"""
GATEWISE AI — Automated Tests for Public Website, Release Metadata, and Security Integrity.
"""

import pytest
from fastapi.testclient import TestClient
import json
from pathlib import Path
from backend.app.main import app, seed_initial_data
from scripts.verify_and_publish_apk import verify_apk_structure, calculate_sha256
import zipfile
import tempfile

@pytest.fixture(scope="module")
def client():
    seed_initial_data()
    return TestClient(app)

ROOT_DIR = Path(__file__).resolve().parents[2]
METADATA_FILE = ROOT_DIR / "apps" / "web" / "public" / "releases" / "android-release.json"


class TestPublicReleaseMetadata:
    def test_01_release_file_exists_and_valid_json(self):
        assert METADATA_FILE.exists(), "android-release.json file must exist in public/releases/"
        with open(METADATA_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        assert data["application"] == "GATEWISE AI"
        assert data["platform"] == "android"
        assert data["package_identifier"] == "com.gatewiseai.guard"
        assert "published" in data
        assert isinstance(data["release_notes"], list)

    def test_02_public_api_serves_latest_release(self, client):
        res = client.get("/api/v1/releases/android/latest")
        assert res.status_code == 200
        data = res.json()
        assert data["application"] == "GATEWISE AI"
        assert data["package_identifier"] == "com.gatewiseai.guard"
        assert data["minimum_android_version"] == "Android 8.0 (API 26)+"

    def test_03_unpublished_release_has_null_or_pending_artifacts(self, client):
        res = client.get("/api/v1/releases/android/latest")
        data = res.json()
        if not data["published"]:
            assert data["download_url"] is None or not data["download_url"].startswith("http") or data["verification_status"] == "PENDING_PUBLICATION"

    def test_04_anonymous_user_cannot_publish_release(self, client):
        res = client.post("/api/v1/releases/android/publish", json={
            "application": "GATEWISE AI",
            "published": True,
            "download_url": "https://cdn.gatewiseai.internal/app.apk",
            "sha256": "abcdef123456",
            "package_identifier": "com.gatewiseai.guard"
        })
        assert res.status_code in [401, 403]

    def test_05_guard_cannot_publish_release(self, client):
        guard_login = client.post("/api/v1/auth/login", json={
            "employee_id": "SEC-G014",
            "password": "guard123"
        })
        token = guard_login.json()["access_token"]
        res = client.post(
            "/api/v1/releases/android/publish",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "application": "GATEWISE AI",
                "published": True,
                "download_url": "https://cdn.gatewiseai.internal/app.apk",
                "sha256": "abcdef123456",
                "package_identifier": "com.gatewiseai.guard"
            }
        )
        assert res.status_code == 403

    def test_06_admin_cannot_publish_without_sha256_or_download_url(self, client):
        admin_login = client.post("/api/v1/auth/login", json={
            "employee_id": "ADM-001",
            "password": "admin123"
        })
        token = admin_login.json()["access_token"]
        res = client.post(
            "/api/v1/releases/android/publish",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "application": "GATEWISE AI",
                "published": True,
                "download_url": None, # Missing download URL
                "sha256": None,       # Missing checksum
                "package_identifier": "com.gatewiseai.guard"
            }
        )
        assert res.status_code == 400
        assert "Cannot publish release without verified download_url" in res.json()["detail"]


class TestReleaseVerificationTool:
    def test_07_verification_tool_detects_corrupt_apk(self):
        with tempfile.NamedTemporaryFile(suffix=".apk", delete=False) as f:
            f.write(b"NOT_A_VALID_ZIP_HEADER_OR_APK_CONTENT" * 50) # > 1000 bytes
            temp_path = Path(f.name)

        try:
            with pytest.raises(ValueError) as excinfo:
                verify_apk_structure(temp_path)
            assert "not a valid APK/ZIP archive" in str(excinfo.value)
        finally:
            temp_path.unlink()

    def test_08_verification_tool_validates_synthetic_apk_structure(self):
        with tempfile.NamedTemporaryFile(suffix=".apk", delete=False) as f:
            temp_path = Path(f.name)

        # Create valid mock APK structure (> 1KB)
        with zipfile.ZipFile(temp_path, "w") as z:
            z.writestr("AndroidManifest.xml", b"<manifest package='com.gatewiseai.guard'></manifest>")
            z.writestr("classes.dex", b"DEX_BINARY_CODE_035" * 100)
            z.writestr("resources.arsc", b"ARSC_RESOURCE_TABLE" * 100)
            z.writestr("META-INF/CERT.RSA", b"DIGITAL_SIGNATURE_KEY" * 50)
            z.writestr("META-INF/MANIFEST.MF", b"MANIFEST_DIGESTS" * 50)

        try:
            results = verify_apk_structure(temp_path)
            assert results["has_manifest"] is True
            assert results["has_dex"] is True
            assert results["is_signed"] is True
            assert len(results["sha256"]) == 64
        finally:
            temp_path.unlink()


class TestPublicRoutesSecurity:
    def test_09_no_raw_biometric_vector_exposure_in_public_endpoints(self, client):
        # Health check
        res = client.get("/health")
        assert res.status_code == 200
        assert "face_crop" not in res.text
        assert "raw_vector" not in res.text

        # Latest release metadata
        res = client.get("/api/v1/releases/android/latest")
        assert res.status_code == 200
        assert "raw_vector" not in res.text
        assert "password" not in res.text
        assert "secret" not in res.text

    def test_10_protected_admin_routes_reject_anonymous_browsing(self, client):
        endpoints = [
            "/api/v1/identities/",
            "/api/v1/guards/",
            "/api/v1/visitors/",
            "/api/v1/audit/logs",
            "/api/v1/repository/status"
        ]
        for ep in endpoints:
            res = client.get(ep)
            assert res.status_code in [401, 403], f"Endpoint {ep} must reject unauthenticated requests"
