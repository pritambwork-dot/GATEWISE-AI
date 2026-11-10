from typing import Set, Dict
from fastapi import HTTPException, status

ROLE_TOOL_PERMISSIONS: Dict[str, Set[str]] = {
    "SUPER_ADMIN": {
        "get_dashboard_summary",
        "get_verification_trends",
        "get_gate_activity_summary",
        "get_pending_enrollment_summary",
        "get_visitor_summary",
        "get_system_health_summary",
        "explain_application_workflow",
        "explain_status",
        "navigate_to_page",
        "propose_gate_status_change",
        "propose_enrollment_review",
        "propose_visitor_pass",
    },
    "ADMIN": {
        "get_dashboard_summary",
        "get_verification_trends",
        "get_gate_activity_summary",
        "get_pending_enrollment_summary",
        "get_visitor_summary",
        "get_system_health_summary",
        "explain_application_workflow",
        "explain_status",
        "navigate_to_page",
        "propose_gate_status_change",
        "propose_enrollment_review",
        "propose_visitor_pass",
    },
    "GUARD": {
        "explain_application_workflow",
        "explain_status",
    }
}

def is_tool_authorized(tool_name: str, user_role: str) -> bool:
    """Checks whether the specified role is permitted to execute the tool."""
    allowed_tools = ROLE_TOOL_PERMISSIONS.get(user_role.upper(), set())
    return tool_name in allowed_tools

def validate_tool_permission(tool_name: str, user_role: str):
    """Enforces role-based tool execution; raises 403 if unauthorized."""
    if not is_tool_authorized(tool_name, user_role):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Role '{user_role}' is not authorized to execute tool '{tool_name}'"
        )
