import requests
import time
import sys

BASE_URL = "http://127.0.0.1:8000/api/v1"

def run_verification():
    print("Starting verification...")
    
    # 1. Register
    email = f"test_{int(time.time())}@example.com"
    password = "secretpassword"
    print(f"Registering user: {email}")
    r = requests.post(f"{BASE_URL}/auth/register", json={"email": email, "password": password})
    if r.status_code != 200:
        print(f"Registration failed: {r.text}")
        return
    print("Registration successful.")

    # 2. Login
    print("Logging in...")
    r = requests.post(f"{BASE_URL}/auth/token", data={"username": email, "password": password})
    if r.status_code != 200:
        print(f"Login failed: {r.text}")
        return
    token = r.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Login successful. Token received.")

    # 3. Create Scan
    target = "http://example.com"
    print(f"Creating scan for {target}...")
    r = requests.post(f"{BASE_URL}/scans/", json={"target_url": target}, headers=headers)
    if r.status_code != 200:
        print(f"Scan creation failed: {r.text}")
        return
    scan_id = r.json()["id"]
    print(f"Scan created. ID: {scan_id}")

    # 4. Poll Status
    print("Polling for results...")
    for _ in range(10):
        time.sleep(2)
        r = requests.get(f"{BASE_URL}/scans/{scan_id}", headers=headers)
        scan = r.json()
        status = scan["status"]
        print(f"Status: {status}")
        if status in ["completed", "failed"]:
            break
    
    if status != "completed":
        print("Scan did not complete in time or failed.")
        return

    # 5. Check Results
    results = scan["results"]
    print(f"Scan finished. Found {len(results)} issues.")
    for res in results:
        print(f"- [{res['severity']}] {res['vulnerability_type']}: {res['description']}")

if __name__ == "__main__":
    try:
        run_verification()
    except Exception as e:
        print(f"Verification failed with error: {e}")
