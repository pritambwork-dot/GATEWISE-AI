import uuid
import threading
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field

class AgentMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role: str # "user", "assistant", "system", "tool"
    content: str
    tool_calls: Optional[List[Dict[str, Any]]] = None
    proposals: Optional[List[Dict[str, Any]]] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AgentSession(BaseModel):
    session_id: str
    user_id: str
    user_role: str
    title: str = "Campus Operations Chat"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_active: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    messages: List[AgentMessage] = Field(default_factory=list)

class SessionManager:
    """Thread-safe, user-isolated session repository."""
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(SessionManager, cls).__new__(cls)
                cls._instance._sessions: Dict[str, AgentSession] = {}
                cls._instance._session_lock = threading.Lock()
        return cls._instance

    def get_or_create_session(
        self,
        session_id: Optional[str],
        user_id: str,
        user_role: str
    ) -> AgentSession:
        with self._session_lock:
            if session_id and session_id in self._sessions:
                session = self._sessions[session_id]
                # Enforce user boundary
                if session.user_id == user_id:
                    session.last_active = datetime.now(timezone.utc)
                    return session
            
            # Create fresh session
            new_id = session_id or str(uuid.uuid4())
            new_session = AgentSession(
                session_id=new_id,
                user_id=user_id,
                user_role=user_role
            )
            self._sessions[new_id] = new_session
            return new_session

    def get_session(self, session_id: str, user_id: str) -> Optional[AgentSession]:
        with self._session_lock:
            session = self._sessions.get(session_id)
            if session and session.user_id == user_id:
                session.last_active = datetime.now(timezone.utc)
                return session
            return None

    def list_user_sessions(self, user_id: str) -> List[AgentSession]:
        with self._session_lock:
            return [
                s for s in self._sessions.values()
                if s.user_id == user_id
            ]

    def delete_session(self, session_id: str, user_id: str) -> bool:
        with self._session_lock:
            if session_id in self._sessions:
                if self._sessions[session_id].user_id == user_id:
                    del self._sessions[session_id]
                    return True
            return False

    def cleanup_expired(self, ttl_minutes: int = 60) -> int:
        with self._session_lock:
            now = datetime.now(timezone.utc)
            cutoff = now - timedelta(minutes=ttl_minutes)
            expired_keys = [
                sid for sid, s in self._sessions.items()
                if s.last_active < cutoff
            ]
            for k in expired_keys:
                del self._sessions[k]
            return len(expired_keys)

session_manager = SessionManager()
