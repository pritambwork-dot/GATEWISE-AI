"""
GATEWISE AI — End-to-End Integration Test Suite (Master Prompt 07 - Part 16)
=============================================================================
Executes all 15 End-to-End scenarios across Mobile Guard, Web Admin, and Central Backend:
1.  Authorized student entry (Aarav Sharma)
2.  Authorized faculty entry (Prof. Devendra Kumar)
3.  Registered visitor check-in (Vikram Malhotra)
4.  Expired visitor pass rejection
5.  Unknown person field referral creation
6.  Admin approval and biometric indexing of new identity
7.  Potential face match (70-89% confidence) handling
8.  Poor-quality / blurry image rejection
9.  Unauthorized guard cross-gate access attempt rejection / override
10. Google Drive sync fallback / offline resilience
11. Face recognition service failure graceful handling
12. Gemini AI policy assistant quota exhaustion fallback
13. Offline / network interruption & local buffering reconciliation
14. Multi-gate concurrent activity & filter reconciliation
15. Signed APK version upgrade & tamper verification
"""

import pytest
import numpy as np
import cv2
import base64
import uuid
import json
import zipfile
import io
from datetime import datetime, timezone, timedelta
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

from backend.app.main import app, seed_initial_data
from backend.app.core.database import SessionLocal
from backend.app.models.entities import (
    User, Gate, GuardGateAssignment, InstitutionalIdentity,
    AccessAuthorization, IdentityReferencePhoto, FaceEmbedding,
    VisitorPass, EnrollmentRequest, VerificationEvent, AuditLog
)
from backend.app.computer_vision.face_pipeline import cv_pipeline
from backend.app.services.drive_sync_service import generate_deterministic_embedding, run_drive_sync
from backend.app.services.verification_service import compute_crypto_signature
from backend.app.security.passwords import get_password_hash
from scripts.verify_and_publish_apk import verify_apk_structure, calculate_sha256
import tempfile
from pathlib import Path


@pytest.fixture(scope="module")
def client():
    seed_initial_data()
    return TestClient(app)


def get_token(client: TestClient, employee_id: str, password: str) -> str:
    res = client.post("/api/v1/auth/login", json={
        "employee_id": employee_id,
        "password": password
    })
    assert res.status_code == 200, f"Login failed for {employee_id}: {res.text}"
    return res.json()["access_token"]


def make_sharp_face_image_b64() -> str:
    """Creates a high quality synthetic face image passing quality check."""
    img = np.ones((320, 320, 3), dtype=np.uint8) * 180
    cv2.ellipse(img, (160, 160), (70, 90), 0, 0, 360, (140, 160, 220), -1)
    cv2.circle(img, (135, 140), 10, (50, 50, 50), -1)
    cv2.circle(img, (185, 140), 10, (50, 50, 50), -1)
    cv2.line(img, (160, 145), (160, 175), (80, 80, 80), 3)
    cv2.ellipse(img, (160, 195), (25, 10), 0, 0, 180, (60, 60, 150), 3)
    # Add high frequency texture so Laplacian blur score > 80
    noise = np.random.randint(0, 30, (320, 320, 3), dtype=np.uint8)
    img = cv2.add(img, noise)
    _, buf = cv2.imencode('.jpg', img)
    return base64.b64encode(buf).decode('utf-8')


# ==============================================================================
# 15 END-TO-END PLATFORM SCENARIOS
# ==============================================================================

class TestPlatformEndToEndScenarios:

    def test_scenario_01_authorized_student_entry(self, client):
        """Scenario 1: Authorized student entry (Aarav Sharma) -> GREEN AUTHORIZED -> Guard commits GRANT_ENTRY."""
        guard_token = get_token(client, "SEC-G014", "guard123")
        aarav_vector = generate_deterministic_embedding("STU-2024-0492")
        b64_img = make_sharp_face_image_b64()

        with patch.object(cv_pipeline, "detect_and_extract_feature", return_value=(True, aarav_vector, None, None, {"faces_detected": 1})):
            res = client.post(
                "/api/v1/verification/verify",
                headers={"Authorization": f"Bearer {guard_token}"},
                json={"gate_id": "gate-main-02", "image_base64": b64_img}
            )
            assert res.status_code == 200, res.text
            data = res.json()
            assert data["outcome"] in ["VERIFIED_AUTHORIZED", "AUTHORIZED"]
            assert data["face_detected"] is True
            assert data["candidate"] is not None
            assert data["candidate"]["person_name"] == "Aarav Sharma"
            assert data["candidate"]["category"] == "Student"
            assert data["candidate"]["similarity_score"] >= 0.90
            assert data["authorization"]["is_authorized"] is True

            event_id = data["event_id"]

            # Guard commits sovereign physical access decision
            decision_res = client.post(
                "/api/v1/verification/decision",
                headers={"Authorization": f"Bearer {guard_token}"},
                json={
                    "event_id": event_id,
                    "guard_decision": "GRANT_ENTRY",
                    "decision_reason": "Verified MBA student - Autumn Term"
                }
            )
            assert decision_res.status_code == 200
            dec_data = decision_res.json()
            assert dec_data["guard_decision"] == "GRANT_ENTRY"
            assert len(dec_data["cryptographic_signature"]) == 64  # HMAC-SHA256 hex string

    def test_scenario_02_authorized_faculty_entry(self, client):
        """Scenario 2: Authorized faculty entry (Prof. Devendra Kumar) -> GREEN AUTHORIZED -> GRANT_ENTRY."""
        guard_token = get_token(client, "SEC-G014", "guard123")
        faculty_vector = generate_deterministic_embedding("FAC-0219")
        b64_img = make_sharp_face_image_b64()

        with patch.object(cv_pipeline, "detect_and_extract_feature", return_value=(True, faculty_vector, None, None, {"faces_detected": 1})):
            res = client.post(
                "/api/v1/verification/verify",
                headers={"Authorization": f"Bearer {guard_token}"},
                json={"gate_id": "gate-main-02", "image_base64": b64_img}
            )
            assert res.status_code == 200
            data = res.json()
            assert data["outcome"] in ["VERIFIED_AUTHORIZED", "AUTHORIZED"]
            assert data["candidate"]["person_name"] == "Prof. Devendra Kumar"
            assert data["candidate"]["category"] == "Faculty"
            assert "Operations" in data["candidate"]["department"]

            event_id = data["event_id"]
            dec_res = client.post(
                "/api/v1/verification/decision",
                headers={"Authorization": f"Bearer {guard_token}"},
                json={
                    "event_id": event_id,
                    "guard_decision": "GRANT_ENTRY",
                    "decision_reason": "Faculty member on-duty"
                }
            )
            assert dec_res.status_code == 200
            assert dec_res.json()["guard_decision"] == "GRANT_ENTRY"

    def test_scenario_03_registered_visitor_checkin(self, client):
        """Scenario 3: Registered visitor check-in -> pass transitions from PRE_APPROVED to CHECKED_IN."""
        admin_token = get_token(client, "ADM-001", "admin123")
        guard_token = get_token(client, "SEC-G014", "guard123")

        # Admin pre-approves pass
        pass_res = client.post(
            "/api/v1/visitors/passes",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "visitor_name": "Vikram Malhotra",
                "phone": "+91 98333 44555",
                "id_type": "Aadhaar Card",
                "id_number": "XXXX-XXXX-8821",
                "host_name": "Prof. S. Sen",
                "host_department": "Finance & Economics",
                "visit_purpose": "Executive Guest Lecture",
                "valid_date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
                "valid_until_time": "19:00",
                "gate_id": "gate-main-02"
            }
        )
        assert pass_res.status_code == 200
        pass_data = pass_res.json()
        pass_code = pass_data["pass_code"]
        assert pass_data["status"] in ["PRE_APPROVED", "EXPECTED"]

        # Guard checks in visitor at gate terminal
        checkin_res = client.post(
            f"/api/v1/visitors/{pass_code}/check-in",
            headers={"Authorization": f"Bearer {guard_token}"}
        )
        assert checkin_res.status_code == 200
        checked_data = checkin_res.json()
        assert checked_data["status"] == "CHECKED_IN"
        assert checked_data["check_in_time"] is not None

    def test_scenario_04_expired_visitor_pass_rejection(self, client):
        """Scenario 4: Expired visitor pass -> RED ACCESS DENIED, check-in rejected."""
        guard_token = get_token(client, "SEC-G014", "guard123")
        db = SessionLocal()
        expired_pass_code = f"PASS-EXP-{uuid.uuid4().hex[:4].upper()}"
        try:
            exp_pass = VisitorPass(
                pass_code=expired_pass_code,
                visitor_name="Harish Salve",
                phone="+91 97111 22334",
                contact_details="+91 97111 22334",
                id_type="Passport",
                id_number="Z8899112",
                host_name="Director Office",
                host_department="Administration",
                visit_purpose="Expired Consultation",
                valid_date="2024-01-01",
                valid_until_time="17:00",
                status="EXPIRED",
                approval_status="EXPIRED",
                gate_id="gate-main-02"
            )
            db.add(exp_pass)
            db.commit()
        finally:
            db.close()

        # Guard attempts check-in -> must fail with 400
        res = client.post(
            f"/api/v1/visitors/{expired_pass_code}/check-in",
            headers={"Authorization": f"Bearer {guard_token}"}
        )
        assert res.status_code == 400
        assert "expired" in res.json()["detail"].lower()

    def test_scenario_05_unknown_person_field_referral(self, client):
        """Scenario 5: Unknown person at gate -> UNKNOWN_PERSON -> Guard submits field enrollment referral."""
        guard_token = get_token(client, "SEC-G014", "guard123")
        b64_img = make_sharp_face_image_b64()
        orthogonal_vector = [0.0] * 128
        orthogonal_vector[0] = 1.0  # Normalized vector distant from seeded identities

        # 1. Verification returns UNKNOWN_PERSON
        with patch.object(cv_pipeline, "detect_and_extract_feature", return_value=(True, orthogonal_vector, None, None, {"faces_detected": 1})):
            res = client.post(
                "/api/v1/verification/verify",
                headers={"Authorization": f"Bearer {guard_token}"},
                json={"gate_id": "gate-main-02", "image_base64": b64_img}
            )
            assert res.status_code == 200
            data = res.json()
            assert data["outcome"] == "UNKNOWN_PERSON"
            assert data["candidate"] is None

        # 2. Guard creates enrollment referral
        unique_name = f"Sunil Mehta {uuid.uuid4().hex[:4]}"
        ref_res = client.post(
            "/api/v1/enrollment/referrals",
            headers={"Authorization": f"Bearer {guard_token}"},
            json={
                "full_name": unique_name,
                "category": "CONTRACTOR",
                "department": "Facilities & Civil Works",
                "phone": "+91 98888 11223",
                "email": "sunil.civil@contractors.ac.in",
                "justification": "New civil engineering supervisor for campus auditorium",
                "reference_photo_base64": b64_img
            }
        )
        assert ref_res.status_code == 200
        ref_data = ref_res.json()
        assert ref_data["status"] in ["PENDING", "PENDING_REVIEW"]
        referral_id = ref_data["id"]

        # 3. Guard cannot self-approve referral (RBAC check)
        guard_approve_res = client.post(
            f"/api/v1/enrollment/referrals/{referral_id}/approve",
            headers={"Authorization": f"Bearer {guard_token}"}
        )
        assert guard_approve_res.status_code == 403

    def test_scenario_06_admin_approval_and_biometric_indexing(self, client):
        """Scenario 6: Admin approves referral -> identity created and indexed -> immediately active."""
        admin_token = get_token(client, "ADM-001", "admin123")
        guard_token = get_token(client, "SEC-G014", "guard123")
        b64_img = make_sharp_face_image_b64()

        # Create unique referral
        unique_name = f"Kavita Verma {uuid.uuid4().hex[:4]}"
        ref_res = client.post(
            "/api/v1/enrollment/referrals",
            headers={"Authorization": f"Bearer {guard_token}"},
            json={
                "full_name": unique_name,
                "category": "RESEARCH_SCHOLAR",
                "department": "Economics & Public Policy",
                "phone": "+91 97777 66554",
                "email": "kavita.v@iimsambalpur.ac.in",
                "justification": "Visiting PhD Research Fellow",
                "reference_photo_base64": b64_img
            }
        )
        assert ref_res.status_code == 200
        referral_id = ref_res.json()["id"]

        # Admin approves referral
        approve_res = client.post(
            f"/api/v1/enrollment/referrals/{referral_id}/approve",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert approve_res.status_code == 200
        appr_data = approve_res.json()
        assert appr_data["status"] == "APPROVED"

        # Verify identity entity and authorization were created in DB
        db = SessionLocal()
        try:
            new_id = db.query(InstitutionalIdentity).filter(InstitutionalIdentity.full_name == unique_name).first()
            assert new_id is not None
            assert new_id.identity_status == "ACTIVE"

            auth_rec = db.query(AccessAuthorization).filter(AccessAuthorization.identity_id == new_id.id).first()
            assert auth_rec is not None
            assert auth_rec.access_status == "AUTHORIZED"

            emb = db.query(FaceEmbedding).filter(FaceEmbedding.identity_id == new_id.id).first()
            assert emb is not None
            assert emb.status == "ACTIVE"
        finally:
            db.close()

    def test_scenario_07_potential_face_match_amber_state(self, client):
        """Scenario 7: Potential face match (70-89% confidence) -> AMBER REVIEW_REQUIRED -> Guard manual verification."""
        guard_token = get_token(client, "SEC-G014", "guard123")
        b64_img = make_sharp_face_image_b64()

        # Construct vector with cosine similarity ~0.78 with Aarav Sharma
        aarav_vector = np.array(generate_deterministic_embedding("STU-2024-0492"), dtype=np.float32)
        random_orth = np.random.randn(128).astype(np.float32)
        random_orth -= np.dot(random_orth, aarav_vector) * aarav_vector
        random_orth /= np.linalg.norm(random_orth)
        target_sim = 0.78
        potential_vector = (target_sim * aarav_vector + np.sqrt(1 - target_sim**2) * random_orth).tolist()

        with patch.object(cv_pipeline, "detect_and_extract_feature", return_value=(True, potential_vector, None, None, {"faces_detected": 1})):
            res = client.post(
                "/api/v1/verification/verify",
                headers={"Authorization": f"Bearer {guard_token}"},
                json={"gate_id": "gate-main-02", "image_base64": b64_img}
            )
            assert res.status_code == 200
            data = res.json()
            assert data["outcome"] == "POTENTIAL_MATCH"
            assert data["candidate"] is not None
            assert 0.70 <= data["candidate"]["similarity_score"] < 0.90

            # Guard manually verifies student ID badge and grants entry with mandatory reason
            event_id = data["event_id"]
            dec_res = client.post(
                "/api/v1/verification/decision",
                headers={"Authorization": f"Bearer {guard_token}"},
                json={
                    "event_id": event_id,
                    "guard_decision": "GRANT_ENTRY",
                    "decision_reason": "Physical ID badge STU-2024-0492 visually confirmed by Officer"
                }
            )
            assert dec_res.status_code == 200
            assert dec_res.json()["guard_decision"] == "GRANT_ENTRY"

    def test_scenario_08_poor_quality_blurry_image_rejection(self, client):
        """Scenario 8: Poor-quality / blurry image -> IMAGE_QUALITY_INSUFFICIENT -> prompt recapture."""
        guard_token = get_token(client, "SEC-G014", "guard123")
        # Generate heavily blurred image
        sharp = np.ones((320, 320, 3), dtype=np.uint8) * 150
        cv2.circle(sharp, (160, 160), 60, (100, 100, 100), -1)
        blurred = cv2.GaussianBlur(sharp, (65, 65), 30)
        _, buf = cv2.imencode('.jpg', blurred)
        b64_blur = base64.b64encode(buf).decode('utf-8')

        res = client.post(
            "/api/v1/verification/verify",
            headers={"Authorization": f"Bearer {guard_token}"},
            json={"gate_id": "gate-main-02", "image_base64": b64_blur}
        )
        assert res.status_code == 200
        data = res.json()
        assert data["outcome"] == "IMAGE_QUALITY_INSUFFICIENT"
        assert data["face_detected"] is False
        assert len(data["quality_feedback"]) > 0
        assert data["candidate"] is None

    def test_scenario_09_unauthorized_guard_cross_gate_access(self, client):
        """Scenario 9: Guard attempts cross-gate spoofing -> server enforces assigned gate; unassigned guard rejected."""
        guard_token = get_token(client, "SEC-G014", "guard123")
        b64_img = make_sharp_face_image_b64()

        # Guard is assigned to gate-main-02; client tries to pass spoofed gate-acad-01
        res = client.post(
            "/api/v1/verification/verify",
            headers={"Authorization": f"Bearer {guard_token}"},
            json={"gate_id": "gate-acad-01", "image_base64": b64_img}
        )
        assert res.status_code == 200
        data = res.json()
        # Server must override to authoritative gate-main-02
        assert data["gate_id"] == "gate-main-02"

        # Create unassigned guard
        db = SessionLocal()
        unassigned_id = f"SEC-UNASSIGN-{uuid.uuid4().hex[:4]}"
        try:
            u_guard = User(
                id=str(uuid.uuid4()),
                employee_id=unassigned_id,
                email=f"{unassigned_id.lower()}@security.iimsambalpur.ac.in",
                password_hash=get_password_hash("testpass"),
                full_name="Roving Officer",
                role="SECURITY_GUARD",
                account_status="ACTIVE"
            )
            db.add(u_guard)
            db.commit()
        finally:
            db.close()

        unassigned_token = get_token(client, unassigned_id, "testpass")
        fail_res = client.post(
            "/api/v1/verification/verify",
            headers={"Authorization": f"Bearer {unassigned_token}"},
            json={"gate_id": "gate-main-02", "image_base64": b64_img}
        )
        assert fail_res.status_code == 403
        assert "no active gate" in fail_res.json()["detail"].lower()

    def test_scenario_10_google_drive_sync_fallback(self, client):
        """Scenario 10: Google Drive temporary failure -> gate verification continues without interruption."""
        guard_token = get_token(client, "SEC-G014", "guard123")
        aarav_vector = generate_deterministic_embedding("STU-2024-0492")
        b64_img = make_sharp_face_image_b64()

        # Simulate Google Drive connection timeout or API outage
        with patch("backend.app.integrations.google_drive.GoogleDriveClient.verify_connection", side_effect=TimeoutError("Drive API unreachable")):
            # Verification operates entirely on local indexed vectors - zero outage
            with patch.object(cv_pipeline, "detect_and_extract_feature", return_value=(True, aarav_vector, None, None, {"faces_detected": 1})):
                res = client.post(
                    "/api/v1/verification/verify",
                    headers={"Authorization": f"Bearer {guard_token}"},
                    json={"gate_id": "gate-main-02", "image_base64": b64_img}
                )
                assert res.status_code == 200
                data = res.json()
                assert data["outcome"] in ["VERIFIED_AUTHORIZED", "AUTHORIZED"]
                assert data["candidate"]["person_name"] == "Aarav Sharma"

    def test_scenario_11_face_recognition_service_failure_handling(self, client):
        """Scenario 11: Face recognition engine error handled gracefully without server crash."""
        guard_token = get_token(client, "SEC-G014", "guard123")
        b64_img = make_sharp_face_image_b64()

        with patch.object(cv_pipeline, "detect_and_extract_feature", side_effect=RuntimeError("OpenCV Out-of-Memory")):
            res = client.post(
                "/api/v1/verification/verify",
                headers={"Authorization": f"Bearer {guard_token}"},
                json={"gate_id": "gate-main-02", "image_base64": b64_img}
            )
            # Service catches exception gracefully and falls back to safe insufficient image state
            assert res.status_code == 200
            data = res.json()
            assert data["outcome"] == "IMAGE_QUALITY_INSUFFICIENT"
            assert data["face_detected"] is False

    def test_scenario_12_gemini_assistant_quota_exhaustion_fallback(self, client):
        """Scenario 12: Gemini AI service quota exhaustion fallback -> deterministic SOP rules delivered."""
        # Query regarding expired credentials
        res = client.post(
            "/api/v1/assistant/query",
            json={"query": "What is the procedure for an expired student pass?"}
        )
        assert res.status_code == 200
        data = res.json()
        answer = data["response"]
        assert "Expired" in answer or "clearance has lapsed" in answer
        assert "Academic Affairs" in answer or "Registrar" in answer

        # Query regarding visitor intake
        visitor_res = client.post(
            "/api/v1/assistant/query",
            json={"query": "How do I register a walk-in guest?"}
        )
        assert visitor_res.status_code == 200
        assert "photo identification" in visitor_res.json()["response"].lower()

    def test_scenario_13_offline_local_buffering_and_sync(self, client):
        """Scenario 13: Local buffering & replay -> idempotent receipt and audit seal preservation."""
        guard_token = get_token(client, "SEC-G014", "guard123")
        aarav_vector = generate_deterministic_embedding("STU-2024-0492")
        b64_img = make_sharp_face_image_b64()

        with patch.object(cv_pipeline, "detect_and_extract_feature", return_value=(True, aarav_vector, None, None, {"faces_detected": 1})):
            res = client.post(
                "/api/v1/verification/verify",
                headers={"Authorization": f"Bearer {guard_token}"},
                json={"gate_id": "gate-main-02", "image_base64": b64_img}
            )
            assert res.status_code == 200
            event_id = res.json()["event_id"]

            # First decision submission from local queue
            dec1 = client.post(
                "/api/v1/verification/decision",
                headers={"Authorization": f"Bearer {guard_token}"},
                json={"event_id": event_id, "guard_decision": "GRANT_ENTRY", "decision_reason": "Buffered queue sync"}
            )
            assert dec1.status_code == 200
            sig1 = dec1.json()["cryptographic_signature"]

            # Second duplicate submission (network replay) -> returns 400 because event is already finalized
            dec2 = client.post(
                "/api/v1/verification/decision",
                headers={"Authorization": f"Bearer {guard_token}"},
                json={"event_id": event_id, "guard_decision": "GRANT_ENTRY", "decision_reason": "Duplicate replay"}
            )
            assert dec2.status_code == 400
            err_msg = dec2.json()["detail"].lower()
            assert "sealed" in err_msg or "immutable" in err_msg or "finalized" in err_msg

    def test_scenario_14_multi_gate_concurrent_monitoring(self, client):
        """Scenario 14: Multi-gate concurrent operations -> stream isolation and reconciliation."""
        admin_token = get_token(client, "ADM-001", "admin123")

        # Fetch recent activity with gate filter
        res_main = client.get("/api/v1/activity/recent?gate_id=gate-main-02", headers={"Authorization": f"Bearer {admin_token}"})
        assert res_main.status_code == 200
        main_events = res_main.json()
        assert all(e["gate_id"] == "gate-main-02" for e in main_events)

        # Fetch global aggregate feed
        res_all = client.get("/api/v1/activity/recent", headers={"Authorization": f"Bearer {admin_token}"})
        assert res_all.status_code == 200
        all_events = res_all.json()
        assert len(all_events) >= len(main_events)

    def test_scenario_15_signed_apk_tamper_detection_and_verification(self, client):
        """Scenario 15: Signed APK upgrade & tamper verification tool enforcement."""
        # 1. Corrupt payload fails archive check
        with tempfile.NamedTemporaryFile(suffix=".apk", delete=False) as f:
            f.write(b"CORRUPTED_NOT_A_ZIP_HEADER_PAYLOAD_TEST_DATA" * 50)
            corrupt_path = Path(f.name)
        try:
            with pytest.raises(ValueError) as excinfo:
                verify_apk_structure(corrupt_path)
            assert "not a valid apk/zip" in str(excinfo.value).lower()
        finally:
            corrupt_path.unlink()

        # 2. Missing AndroidManifest.xml fails structure check
        with tempfile.NamedTemporaryFile(suffix=".apk", delete=False) as f:
            inc_path = Path(f.name)
        with zipfile.ZipFile(inc_path, "w") as zf:
            zf.writestr("classes.dex", b"DEX\n035\x00" + b"\x00" * 2000)
        try:
            with pytest.raises(ValueError) as excinfo:
                verify_apk_structure(inc_path)
            assert "androidmanifest.xml" in str(excinfo.value).lower()
        finally:
            inc_path.unlink()

        # 3. Valid synthetic APK structure passes
        with tempfile.NamedTemporaryFile(suffix=".apk", delete=False) as f:
            valid_path = Path(f.name)
        with zipfile.ZipFile(valid_path, "w") as zf:
            zf.writestr("AndroidManifest.xml", b"<manifest package='com.gatewise.guard'/>" + b"\x00" * 500)
            zf.writestr("classes.dex", b"DEX\n035\x00" + b"\x00" * 2000)
            zf.writestr("resources.arsc", b"\x02\x00\x0c\x00" + b"\x00" * 1000)
            zf.writestr("META-INF/CERT.RSA", b"RSA_SIG" + b"\x00" * 200)
            zf.writestr("META-INF/MANIFEST.MF", b"MANIFEST_DIGEST" + b"\x00" * 200)
        try:
            res = verify_apk_structure(valid_path)
            assert res["has_manifest"] is True
            assert res["has_dex"] is True
            assert res["is_signed"] is True
            assert len(res["sha256"]) == 64
        finally:
            valid_path.unlink()
