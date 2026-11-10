import os
from pydantic_settings import BaseSettings, SettingsConfigDict

DEFAULT_SQLITE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../gatewise.db"))

class Settings(BaseSettings):
    PROJECT_NAME: str = "GATEWISE AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "gatewise-super-secret-key-iim-sambalpur-2026")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 8 # 8 hour shift
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database (PostgreSQL with graceful SQLite development fallback)
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_SQLITE_PATH}")
    DATABASE_POOL_SIZE: int = int(os.getenv("DATABASE_POOL_SIZE", "10"))
    
    # Operational Environment
    ENVIRONMENT: str = os.getenv("APP_ENV", "development")
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "")
    
    @property
    def allowed_cors_origins(self) -> list[str]:
        if self.CORS_ORIGINS:
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
        if self.ENVIRONMENT == "production":
            return [
                "https://gatewiseai.internal",
                "https://admin.gatewiseai.internal",
                "https://api.gatewiseai.internal"
            ]
        # In development/staging, support localhost ports and wildcards
        return ["*"]
    
    # Biometric thresholds
    FACE_MATCH_AUTO_ADMIT: float = 0.90
    FACE_MATCH_CANDIDATE: float = 0.70
    MIN_BLUR_SCORE: float = 60.0
    
    # AI Assistant (Backend-only)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Google Drive Sync
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    DRIVE_FOLDER_ID: str = os.getenv("DRIVE_FOLDER_ID", "IIM_Sambalpur_Approved_Identities_2024_2026")
    
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="allow"
    )

settings = Settings()
