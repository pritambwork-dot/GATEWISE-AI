import os
from pydantic_settings import BaseSettings
from typing import Optional

class AgentSettings(BaseSettings):
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    GATEWISE_ASSISTANT_ENABLED: bool = os.getenv("GATEWISE_ASSISTANT_ENABLED", "true").lower() in ("true", "1", "yes")
    AGENT_MAX_STEPS: int = 5
    AGENT_TIMEOUT_SECONDS: float = 25.0
    RATE_LIMIT_PER_MINUTE: int = 30
    SESSION_TTL_MINUTES: int = 60

agent_settings = AgentSettings()
