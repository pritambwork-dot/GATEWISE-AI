from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class ReferencePhotoSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    file_name: str
    file_path: str
    checksum: str
    is_approved: bool
    synced_at: datetime

class IdentityCreate(BaseModel):
    person_id: str
    full_name: str
    category: str
    department: str
    email: Optional[str] = None
    phone: Optional[str] = None
    valid_from: str
    valid_until: str
    clearance_level: str = "ALL_GATES_STANDARD"

class IdentityResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    person_id: str
    full_name: str
    category: str
    department: str
    email: Optional[str] = None
    phone: Optional[str] = None
    valid_from: str
    valid_until: str
    clearance_level: str
    is_active: bool
    reference_photos: List[ReferencePhotoSchema] = []
    created_at: datetime
