from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class FaceVerificationRequest(BaseModel):
    gate_id: Optional[str] = None
    image_base64: str
    timestamp: Optional[str] = None
    ambient_light_score: Optional[float] = None

class FaceMatchCandidate(BaseModel):
    identity_id: str
    person_name: str
    person_id: str # e.g. STU-2024-0492
    category: str  # Student, Faculty, Staff, Contractor, Visitor
    department: str
    reference_photo_url: str
    similarity_score: float # 0.0 to 1.0

class AuthorizationStatus(BaseModel):
    is_authorized: bool
    clearance_level: str
    valid_from: str
    valid_until: str
    permitted_gates: List[str] = []
    restriction_reason: Optional[str] = None

class VerificationResultResponse(BaseModel):
    event_id: str
    gate_id: str
    gate_name: str
    guard_id: str
    guard_name: str
    timestamp: datetime
    outcome: str # VERIFIED_AUTHORIZED, IDENTIFIED_UNAUTHORIZED, POTENTIAL_MATCH, UNKNOWN_PERSON, QUALITY_INSUFFICIENT, ACCESS_DENIED
    face_detected: bool
    image_quality_score: float
    quality_feedback: List[str] = []
    candidate: Optional[FaceMatchCandidate] = None
    authorization: Optional[AuthorizationStatus] = None
    live_photo_thumbnail_url: Optional[str] = None

class GuardDecisionRequest(BaseModel):
    event_id: str
    action: str # GRANT_ENTRY, DENY_ENTRY, ESCALATE_TO_ADMIN, REFER_TO_VISITOR_DESK
    notes: Optional[str] = None
    override_reason: Optional[str] = None

class VerificationEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    timestamp: datetime
    gate_id: str
    gate_name: str
    guard_id: str
    guard_name: str
    person_id: Optional[str] = None
    person_name: Optional[str] = None
    person_category: Optional[str] = None
    outcome: str
    guard_decision: str
    similarity_score: Optional[float] = None
    decision_reason: Optional[str] = None
    cryptographic_signature: str
    sync_status: str
