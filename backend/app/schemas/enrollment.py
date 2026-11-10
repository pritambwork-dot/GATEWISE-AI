from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class EnrollmentRequestCreate(BaseModel):
    person_name: str
    proposed_category: str
    department: str
    captured_image_base64: Optional[str] = None
    gate_id: Optional[str] = None
    notes: Optional[str] = None

class EnrollmentReviewRequest(BaseModel):
    request_id: Optional[str] = None
    action: Optional[str] = "APPROVE" # APPROVE, REJECT
    admin_notes: Optional[str] = None
    assigned_person_id: Optional[str] = None

class EnrollmentRequestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    person_name: str
    proposed_category: str
    department: str
    captured_image_path: Optional[str] = None
    submitted_by_guard_id: str
    gate_id: Optional[str] = None
    status: str # PENDING, APPROVED, REJECTED
    request_status: Optional[str] = None
    admin_notes: Optional[str] = None
    administrator_notes: Optional[str] = None
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    reviewed_by: Optional[str] = None
