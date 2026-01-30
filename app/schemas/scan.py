from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import datetime
from enum import Enum

class ScanStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class Severity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class ScanResultBase(BaseModel):
    vulnerability_type: str
    severity: Severity
    description: str
    details: Optional[str] = None

class ScanResult(ScanResultBase):
    id: int
    scan_id: int

    class Config:
        from_attributes = True

class ScanCreate(BaseModel):
    target_url: HttpUrl

class ScanResponse(BaseModel):
    id: int
    user_id: int
    target_url: str
    status: ScanStatus
    created_at: datetime
    finished_at: Optional[datetime] = None
    results: List[ScanResult] = []

    class Config:
        from_attributes = True
