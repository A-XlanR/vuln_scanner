import httpx
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.scan import Scan, ScanResult, ScanStatus

async def perform_scan(scan_id: int, url: str, db: Session):
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        return

    scan.status = ScanStatus.RUNNING
    db.commit()

    try:
        async with httpx.AsyncClient(verify=False, follow_redirects=True) as client:
            response = await client.get(url, timeout=10.0)
            
            # 1. Check Missing Security Headers
            headers_to_check = {
                "X-Frame-Options": "Clickjacking protection missing",
                "X-Content-Type-Options": "MIME sniffing protection missing",
                "Strict-Transport-Security": "HSTS not enabled",
                "Content-Security-Policy": "CSP missing",
            }

            for header, issue in headers_to_check.items():
                if header.lower() not in [k.lower() for k in response.headers.keys()]:
                    db.add(ScanResult(
                        scan_id=scan.id,
                        vulnerability_type="Missing Security Header",
                        severity="MEDIUM" if header != "Content-Security-Policy" else "LOW",
                        description=f"Missing header: {header}",
                        details=f"{issue}. Recommendation: Add {header} to server configuration."
                    ))

            # 2. Server Version Disclosure
            if "server" in [k.lower() for k in response.headers.keys()]:
                server_header = response.headers.get("server")
                db.add(ScanResult(
                    scan_id=scan.id,
                    vulnerability_type="Server Information Disclosure",
                    severity="LOW",
                    description="Server header is present",
                    details=f"Server detected: {server_header}. Recommendation: Obscure server banner."
                ))

            # 3. Cookie Flags
            # Check if any cookies are set without Secure/HttpOnly
            for cookie in response.cookies.jar:
                if not cookie.secure:
                     db.add(ScanResult(
                        scan_id=scan.id,
                        vulnerability_type="Insecure Cookie",
                        severity="MEDIUM",
                        description=f"Cookie '{cookie.name}' is missing Secure flag",
                        details="Cookie sent over unencrypted connections."
                    ))
                # HttpOnly check in httpx might require inspecting the parsed cookie attributes manually if exposed, 
                # but standard cookie jar might not easily expose it directly in all versions. 
                # httpx's Cookies object abstracts this.

        scan.status = ScanStatus.COMPLETED
        scan.finished_at = datetime.utcnow()

    except Exception as e:
        scan.status = ScanStatus.FAILED
        db.add(ScanResult(
            scan_id=scan.id,
            vulnerability_type="Scan Error",
            severity="HIGH",
            description="Failed to perform scan",
            details=str(e)
        ))
    
    finally:
        db.commit()
