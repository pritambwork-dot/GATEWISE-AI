from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class EnrollmentRequestCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    person_name: Optional[str] = None
    full_name: Optional[str] = None
    proposed_category: Optional[str] = None
    category: Optional[str] = None
    department: Optional[str] = "General"
    captured_image_base64: Optional[str] = None
    reference_photo_base64: Optional[str] = None
    gate_id: Optional[str] = None
    notes: Optional[str] = None
    justification: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None

    def model_post_init(self, __context):
        if not self.person_name and self.full_name:
            self.person_name = self.full_name
        if not self.person_name:
            self.person_name = "Referred Visitor"
        if not self.proposed_category and self.category:
            self.proposed_category = self.category
        if not self.proposed_category:
            self.proposed_category = "Visitor"
        if not self.notes and self.justification:
            self.notes = self.justification
        if not self.captured_image_base64 and self.reference_photo_base64:
            self.captured_image_base64 = self.reference_photo_base64

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
