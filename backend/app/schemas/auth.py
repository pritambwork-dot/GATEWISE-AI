from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class LoginRequest(BaseModel):
    employee_id: str
    password: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class RevokeSessionRequest(BaseModel):
    refresh_token: str

class AssignedGateSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    code: str
    location: str
    operating_hours: str
    status: str
    shift_name: str
    assigned_at: datetime

class UserProfileSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    full_name: str
    role: str
    employee_id: str
    avatar_url: Optional[str] = None
    is_active: bool
    assigned_gate: Optional[AssignedGateSchema] = None

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    user: UserProfileSchema
