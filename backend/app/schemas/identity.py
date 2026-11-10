from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from datetime import datetime

class ReferencePhotoSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    drive_file_id: Optional[str] = None
    file_checksum: Optional[str] = None
    source: Optional[str] = "GOOGLE_DRIVE"
    review_status: Optional[str] = "APPROVED"
    sync_status: Optional[str] = "SYNCED"
    created_at: Optional[datetime] = None

class AccessAuthorizationSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    access_status: str
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    permitted_zones: Optional[List[Any]] = []
    restrictions: Optional[str] = None

class IdentityCreate(BaseModel):
    person_id: Optional[str] = None
    institutional_id: Optional[str] = None
    full_name: str
    category: str
    department: str
    email: Optional[str] = None
    phone: Optional[str] = None
    valid_from: Optional[str] = None
    valid_until: Optional[str] = None
    clearance_level: Optional[str] = "ALL_GATES_STANDARD"

class IdentityResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    institutional_id: str
    person_id: Optional[str] = None
    full_name: str
    category: str
    department: str
    designation: Optional[str] = None
    identity_status: Optional[str] = "ACTIVE"
    email: Optional[str] = None
    phone: Optional[str] = None
    reference_photos: List[ReferencePhotoSchema] = []
    access_authorizations: List[AccessAuthorizationSchema] = []
    created_at: Optional[datetime] = None
