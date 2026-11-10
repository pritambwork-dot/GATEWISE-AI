from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class GateStatusItem(BaseModel):
    id: str
    name: str
    code: str
    location: str
    status: str
    active_guard_name: Optional[str] = None
    active_guard_employee_id: Optional[str] = None
    today_scans_count: int = 0
    today_verified_count: int = 0
    today_denied_count: int = 0
    last_event_time: Optional[datetime] = None

class HourlyTrafficItem(BaseModel):
    hour: str # e.g. "08:00", "09:00"
    verified_entries: int
    denied_entries: int
    visitors_registered: int

class DashboardStatsResponse(BaseModel):
    active_gates_count: int
    total_scans_today: int
    auto_verified_percentage: float
    total_exceptions_today: int
    active_visitors_on_campus: int
    pending_enrollment_referrals: int
    system_health_status: str # HEALTHY, DEGRADED, OFFLINE
    drive_sync_last_status: str
    drive_sync_last_time: Optional[datetime] = None
    drive_identities_count: int
    gates: List[GateStatusItem]
    hourly_traffic: List[HourlyTrafficItem]
