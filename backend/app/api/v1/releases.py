"""
GATEWISE AI - Release Management API Endpoint
Provides verified release metadata for Android APK and client distributions.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
import json
from pathlib import Path

from ...security.permissions import require_roles, GatewiseRole

router = APIRouter(prefix="/releases", tags=["Release Management"])

RELEASE_FILE_PATH = Path(__file__).resolve().parents[4] / "apps" / "web" / "public" / "releases" / "android-release.json"


class ReleaseNotes(BaseModel):
    application: str = "GATEWISE AI"
    platform: str = "android"
    release_channel: str = "production"
    published: bool = False
    version_name: Optional[str] = "1.0.0"
    version_code: Optional[int] = 1
    minimum_android_version: Optional[str] = "Android 8.0 (API 26)+"
    file_name: Optional[str] = None
    file_size_bytes: Optional[int] = None
    download_url: Optional[str] = None
    sha256: Optional[str] = None
    release_date: Optional[str] = None
    release_notes: List[str] = []
    package_identifier: str = "com.gatewiseai.guard"
    verification_status: str = "PENDING_PUBLICATION"


def load_release_metadata() -> dict:
    if RELEASE_FILE_PATH.exists():
        try:
            with open(RELEASE_FILE_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "application": "GATEWISE AI",
        "platform": "android",
        "release_channel": "production",
        "published": False,
        "version_name": "1.0.0",
        "version_code": 1,
        "minimum_android_version": "Android 8.0 (API 26)+",
        "file_name": None,
        "file_size_bytes": None,
        "download_url": None,
        "sha256": None,
        "release_date": None,
        "release_notes": [
            "Initial institutional release of GATEWISE AI Guard application.",
            "Integrated single-shot camera capture with YuNet face detection and SFace 128-D embedding.",
            "Decoupled clearance evaluation separating identity candidate match from gate authorization.",
            "Cryptographic HMAC-SHA256 non-repudiation sealing for all sovereign guard decisions."
        ],
        "package_identifier": "com.gatewiseai.guard",
        "verification_status": "PENDING_PUBLICATION"
    }


@router.get("/android/latest", response_model=ReleaseNotes)
def get_latest_android_release():
    """
    Public endpoint: Returns official release metadata for GATEWISE AI Android Guard APK.
    Does not expose sensitive system data.
    """
    return load_release_metadata()


@router.post("/android/publish", response_model=ReleaseNotes)
def publish_android_release(
    payload: ReleaseNotes,
    current_user=Depends(require_roles([GatewiseRole.SUPER_ADMIN, GatewiseRole.ADMIN]))
):
    """
    Admin-only endpoint: Updates and publishes Android APK release metadata.
    Enforces that release cannot be published without valid sha256 checksum and download URL.
    """
    if payload.published:
        if not payload.download_url or not payload.sha256:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot publish release without verified download_url and sha256 checksum."
            )
        if payload.package_identifier != "com.gatewiseai.guard":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid package identifier: {payload.package_identifier}. Must be com.gatewiseai.guard."
            )

    data = payload.model_dump()
    try:
        RELEASE_FILE_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(RELEASE_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to persist release metadata: {str(e)}"
        )

    return data
