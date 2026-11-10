import os
from pydantic_settings import BaseSettings
from typing import Optional

class AgentSettings(BaseSettings):
    GATEWISE_ASSISTANT_ENABLED: bool = os.getenv("GATEWISE_ASSISTANT_ENABLED", "true").lower() in ("true", "1", "yes")
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    GEMINI_API_TIMEOUT: float = float(os.getenv("GEMINI_API_TIMEOUT", "25.0"))
    GEMINI_MAX_OUTPUT_TOKENS: int = int(os.getenv("GEMINI_MAX_OUTPUT_TOKENS", "2048"))
    GEMINI_MAX_REQUESTS_PER_MINUTE: int = int(os.getenv("GEMINI_MAX_REQUESTS_PER_MINUTE", "30"))
    GEMINI_DAILY_REQUEST_LIMIT: int = int(os.getenv("GEMINI_DAILY_REQUEST_LIMIT", "1500"))
    SESSION_TTL_MINUTES: int = int(os.getenv("SESSION_TTL_MINUTES", "60"))
    AGENT_MAX_STEPS: int = 5

agent_settings = AgentSettings()
