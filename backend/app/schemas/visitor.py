from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class VisitorPassCreate(BaseModel):
    visitor_name: str
    phone: str
    id_type: str
    id_number: str
    host_name: str
    host_department: str
    purpose: str
    valid_date: str
    valid_until_time: str
    gate_id: Optional[str] = None

class VisitorIntakeRequest(BaseModel):
    visitor_name: str
    phone: str
    id_type: str
    id_number: str
    host_name: str
    host_department: str
    purpose: str
    gate_id: str
    photo_base64: Optional[str] = None

class VisitorPassResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    pass_code: str
    visitor_name: str
    phone: str
    id_type: str
    id_number: str
    host_name: str
    host_department: str
    purpose: str
    valid_date: str
    valid_until_time: str
    status: str # EXPECTED, CHECKED_IN, CHECKED_OUT, EXPIRED
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    gate_id: Optional[str] = None
    created_at: datetime
