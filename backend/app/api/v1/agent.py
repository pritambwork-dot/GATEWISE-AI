import json
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session

from ...core.database import get_db
from ...models.entities import User
from ...security.permissions import get_current_user, require_roles, GatewiseRole
from ...agent import agent_service
from ...agent.runtime.session import session_manager
from ...agent.security.permissions import ROLE_TOOL_PERMISSIONS

router = APIRouter(prefix="/agent", tags=["GATEWISE AI Assistant"])

class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000, description="Administrator query")
    session_id: Optional[str] = Field(None, description="Active session ID or empty to create new")

class ChatResponse(BaseModel):
    session_id: str
    response: str
    tools_executed: List[Dict[str, Any]] = []
    proposals: List[Dict[str, Any]] = []

class SessionResponse(BaseModel):
    session_id: str
    title: str
    created_at: str
    last_active: str
    message_count: int

@router.post("/chat")
async def chat_stream(
    payload: ChatRequest,
    current_user: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """
    Streaming SSE endpoint for the GATEWISE AI Assistant.
    Emits real-time tokens, tool executions, and action proposals.
    """
    generator = agent_service.stream_chat(
        query=payload.query,
        session_id=payload.session_id,
        user_id=str(current_user.id),
        user_role=current_user.role,
        db=db
    )
    return StreamingResponse(
        generator,
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@router.post("/message", response_model=ChatResponse)
async def chat_synchronous(
    payload: ChatRequest,
    current_user: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """
    Non-streaming synchronous endpoint for testing and standard REST clients.
    """
    generator = agent_service.stream_chat(
        query=payload.query,
        session_id=payload.session_id,
        user_id=str(current_user.id),
        user_role=current_user.role,
        db=db
    )
    
    full_text = ""
    tools: List[Dict[str, Any]] = []
    proposals: List[Dict[str, Any]] = []
    resolved_session_id = payload.session_id or "default"

    async for chunk in generator:
        if chunk.startswith("data: "):
            try:
                event = json.loads(chunk[6:].strip())
                event_type = event.get("type")
                if event_type == "text_delta":
                    full_text += event.get("delta", "")
                elif event_type == "tool_start":
                    tools.append(event)
                elif event_type == "action_proposal":
                    proposals.append(event.get("proposal", {}))
                elif event_type == "done":
                    resolved_session_id = event.get("session_id", resolved_session_id)
            except Exception:
                pass

    return ChatResponse(
        session_id=resolved_session_id,
        response=full_text,
        tools_executed=tools,
        proposals=proposals
    )

@router.get("/sessions", response_model=List[SessionResponse])
def list_sessions(
    current_user: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN]))
):
    """Returns active assistant sessions for the current authenticated administrator."""
    sessions = session_manager.list_user_sessions(str(current_user.id))
    return [
        SessionResponse(
            session_id=s.session_id,
            title=s.title,
            created_at=s.created_at.isoformat(),
            last_active=s.last_active.isoformat(),
            message_count=len(s.messages)
        )
        for s in sessions
    ]

@router.delete("/sessions/{session_id}")
def delete_session(
    session_id: str,
    current_user: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN]))
):
    """Deletes an active session."""
    success = session_manager.delete_session(session_id, str(current_user.id))
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session '{session_id}' not found."
        )
    return {"status": "DELETED", "session_id": session_id}

@router.get("/tools")
def list_available_tools(
    current_user: User = Depends(require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN]))
):
    """Lists operational tools permitted for the administrator's role."""
    permitted = ROLE_TOOL_PERMISSIONS.get(current_user.role, set())
    return {
        "role": current_user.role,
        "authorized_tools": sorted(list(permitted))
    }
