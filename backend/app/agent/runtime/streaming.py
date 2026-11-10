import json
from typing import Dict, Any, AsyncGenerator

def format_sse_event(event_type: str, data: Dict[str, Any]) -> str:
    """Encodes a payload into standard Server-Sent Events (SSE) format."""
    payload = {"type": event_type, **data}
    return f"data: {json.dumps(payload)}\n\n"

def sse_text_delta(delta: str) -> str:
    return format_sse_event("text_delta", {"delta": delta})

def sse_tool_start(tool_name: str, arguments: Dict[str, Any]) -> str:
    return format_sse_event("tool_start", {"tool_name": tool_name, "arguments": arguments})

def sse_tool_result(tool_name: str, result: Any) -> str:
    return format_sse_event("tool_result", {"tool_name": tool_name, "result": result})

def sse_action_proposal(proposal: Dict[str, Any]) -> str:
    return format_sse_event("action_proposal", {"proposal": proposal})

def sse_navigation(target_page: str, page_title: str) -> str:
    return format_sse_event("navigation", {"target_page": target_page, "page_title": page_title})

def sse_error(message: str, error_code: str = "AGENT_ERROR") -> str:
    return format_sse_event("error", {"message": message, "error_code": error_code})

def sse_done(session_id: str, finish_reason: str = "stop") -> str:
    return format_sse_event("done", {"session_id": session_id, "finish_reason": finish_reason})
