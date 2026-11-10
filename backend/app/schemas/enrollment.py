from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class EnrollmentRequestCreate(BaseModel):
    person_name: str
    proposed_category: str
    department: str
    captured_image_base64: str
    gate_id: str
    notes: Optional[str] = None

class EnrollmentReviewRequest(BaseModel):
    request_id: str
    action: str # APPROVE, REJECT
    admin_notes: Optional[str] = None
    assigned_person_id: Optional[str] = None

class EnrollmentRequestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    person_name: str
    proposed_category: str
    department: str
    captured_image_path: str
    submitted_by_guard_id: str
    gate_id: str
    status: str # PENDING, APPROVED, REJECTED
    admin_notes: Optional[str] = None
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    reviewed_by: Optional[str] = None
