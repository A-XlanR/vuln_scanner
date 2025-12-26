from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api import deps
from app.models.user import User
from app.models.scan import Scan, ScanStatus
from app.schemas.scan import ScanCreate, ScanResponse
from app.services.scanner import perform_scan

router = APIRouter()

@router.post("/", response_model=ScanResponse)
def create_scan(
    scan_in: ScanCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    scan = Scan(
        user_id=current_user.id,
        target_url=str(scan_in.target_url),
        status=ScanStatus.PENDING
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)
    
    # Trigger scanner in background
    background_tasks.add_task(perform_scan, scan.id, str(scan_in.target_url), db)
    
    return scan

@router.get("/", response_model=List[ScanResponse])
def read_scans(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    scans = db.query(Scan).filter(Scan.user_id == current_user.id).offset(skip).limit(limit).all()
    return scans

@router.get("/{scan_id}", response_model=ScanResponse)
def read_scan(
    scan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    if scan.user_id != current_user.id:
         raise HTTPException(status_code=403, detail="Not authorized to view this scan")
    return scan
