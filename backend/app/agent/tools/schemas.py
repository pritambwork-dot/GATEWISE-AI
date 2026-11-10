from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class NavigationInput(BaseModel):
    target_page: str = Field(
        ...,
        description="The relative target dashboard route, e.g., '/admin/activity', '/admin/visitors', '/admin/enrollment', '/admin/gates', '/admin/guards', '/admin/repository', '/admin/analytics', '/admin/settings'"
    )

class VerificationTrendsInput(BaseModel):
    timeframe: str = Field(
        default="today",
        description="Time period to analyze: 'today', 'yesterday', 'previous_7_days' / '7d', or 'previous_30_days' / '30d'"
    )
    start_date: Optional[str] = Field(
        default=None,
        description="Optional ISO start date for custom range filter"
    )
    end_date: Optional[str] = Field(
        default=None,
        description="Optional ISO end date for custom range filter"
    )

class ExplainWorkflowInput(BaseModel):
    topic: str = Field(
        ...,
        description="The institutional workflow topic, e.g. 'state_d', 'unidentified_person', 'expired_clearance', 'visitor_intake', 'shift_change'"
    )

class ExplainStatusInput(BaseModel):
    status_code: str = Field(
        ...,
        description="The status code to explain, e.g. 'VERIFIED_AUTHORIZED', 'IDENTIFIED_UNAUTHORIZED', 'UNKNOWN_PERSON', 'INSUFFICIENT_QUALITY'"
    )

class GateStatusChangeProposalInput(BaseModel):
    gate_code: str = Field(..., description="Target gate code, e.g. 'MAIN-01', 'NORTH-01'")
    new_status: str = Field(..., description="Proposed gate status, either 'ACTIVE' or 'MAINTENANCE'")
    reason: str = Field(..., description="Justification for proposing the status change")

class EnrollmentReviewProposalInput(BaseModel):
    request_id: str = Field(..., description="The ID of the pending enrollment referral to inspect")

class VisitorPassProposalInput(BaseModel):
    visitor_name: str = Field(..., description="Name of the visitor for intake proposal")
    purpose: str = Field(..., description="Institutional purpose of visit")
    host_department: str = Field(..., description="Host department or faculty point of contact")

class ActionProposal(BaseModel):
    proposal_id: str
    action_type: str
    title: str
    description: str
    parameters: Dict[str, Any]
    target_url: str
    requires_confirmation: bool = True

class ToolCallResult(BaseModel):
    tool_name: str
    success: bool
    data: Any
    proposal: Optional[ActionProposal] = None
    error: Optional[str] = None
