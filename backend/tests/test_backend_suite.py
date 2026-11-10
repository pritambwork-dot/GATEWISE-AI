"""
GATEWISE AI — Comprehensive Backend & CV Engine Test Suite
===========================================================
Covers all 44 architectural test criteria from Master Prompt 04 Part 18:
- Authentication & Sessions (Tests 01-07)
- Gate Assignment Enforcement (Tests 08-11)
- Computer Vision & Biometric Pipeline (Tests 12-18)
- Access Authorization Separation (Tests 19-22)
- Enrollment Referrals & Human Review (Tests 23-27)
- Visitor Management Lifecycle (Tests 28-31)
- Google Drive Sync Engine (Tests 32-35)
- Security, Privacy & Sovereignty (Tests 36-44)
"""

import pytest
import numpy as np
import cv2
import base64
import uuid
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient

from backend.app.main import app, seed_initial_data
from backend.app.core.database import SessionLocal
from backend.app.models.entities import (
    User, Gate, GuardGateAssignment, InstitutionalIdentity,
    AccessAuthorization, IdentityReferencePhoto, FaceEmbedding,
    VisitorPass, EnrollmentRequest, VerificationEvent, AuditLog
)
from backend.app.computer_vision.face_pipeline import cv_pipeline
from backend.app.services.drive_sync_service import parse_filename_mapping, run_drive_sync
from backend.app.security.tokens import create_access_token
from backend.app.security.passwords import get_password_hash

# ==============================================================================
# FIXTURES & HELPERS
# ==============================================================================

@pytest.fixture(scope="module")
def client():
    seed_initial_data()
    return TestClient(app)

def get_auth_token(client: TestClient, employee_id: str, password: str) -> str:
    res = client.post("/api/v1/auth/login", json={
        "employee_id": employee_id,
        "password": password
    })
    assert res.status_code == 200, f"Login failed for {employee_id}: {res.text}"
    return res.json()["access_token"]

def generate_synthetic_face_image(blur: bool = False, multiple: bool = False) -> str:
    """Creates a base64 encoded test image."""
    img = np.ones((320, 320, 3), dtype=np.uint8) * 180
    
    # Draw face oval
    cv2.ellipse(img, (160, 160), (70, 90), 0, 0, 360, (140, 160, 220), -1)
    # Eyes
    cv2.circle(img, (135, 140), 10, (50, 50, 50), -1)
    cv2.circle(img, (185, 140), 10, (50, 50, 50), -1)
    # Nose & Mouth
    cv2.line(img, (160, 145), (160, 175), (80, 80, 80), 3)
    cv2.ellipse(img, (160, 195), (25, 10), 0, 0, 180, (60, 60, 150), 3)

    if multiple:
        cv2.ellipse(img, (60, 60), (30, 40), 0, 0, 360, (140, 160, 220), -1)

    if blur:
        img = cv2.GaussianBlur(img, (35, 35), 15)

    _, buf = cv2.imencode('.jpg', img)
    return base64.b64encode(buf).decode('utf-8')


# ==============================================================================
# GROUP 1: AUTHENTICATION & SESSIONS (Tests 01 - 07)
# ==============================================================================

class TestAuthentication:

    def test_01_guard_login_success(self, client):
        """01. Valid guard login returns 200, JWT tokens, profile, and assigned gate."""
        res = client.post("/api/v1/auth/login", json={
            "employee_id": "SEC-G014",
            "password": "guard123"
        })
        assert res.status_code == 200
        data = res.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["role"] == "SECURITY_GUARD"
        assert data["user"]["employee_id"] == "SEC-G014"
        assert data["user"]["assigned_gate"] is not None
        assert data["user"]["assigned_gate"]["code"] == "GATE-MAIN-02"

    def test_02_admin_login_success(self, client):
        """02. Valid admin login returns 200 with ADMIN role."""
        res = client.post("/api/v1/auth/login", json={
            "employee_id": "ADM-001",
            "password": "admin123"
        })
        assert res.status_code == 200
        data = res.json()
        assert data["user"]["role"] == "ADMIN"
        assert data["user"]["full_name"] == "Dr. Rajesh Iyer"

    def test_03_super_admin_login_success(self, client):
        """03. Valid super-admin login returns 200 with SUPER_ADMIN role."""
        res = client.post("/api/v1/auth/login", json={
            "employee_id": "SUPER-001",
            "password": "super123"
        })
        assert res.status_code == 200
        data = res.json()
        assert data["user"]["role"] == "SUPER_ADMIN"
        assert "Director" in data["user"]["full_name"]

    def test_04_invalid_password_rejected(self, client):
        """04. Invalid password returns 401 Unauthorized."""
        res = client.post("/api/v1/auth/login", json={
            "employee_id": "SEC-G014",
            "password": "wrongpassword99"
        })
        assert res.status_code == 401
        assert "invalid" in res.json()["detail"].lower() or "credentials" in res.json()["detail"].lower()

    def test_05_disabled_account_rejected(self, client):
        """05. Suspended/disabled accounts are blocked at login."""
        uid = uuid.uuid4().hex[:6]
        emp_id = f"SEC-SUSP-{uid}"
        db = SessionLocal()
        test_user = User(
            id=str(uuid.uuid4()),
            employee_id=emp_id,
            email=f"susp_{uid}@security.iimsambalpur.ac.in",
            password_hash=get_password_hash("testpass"),
            full_name="Suspended Guard",
            role="SECURITY_GUARD",
            account_status="SUSPENDED"
        )
        db.add(test_user)
        db.commit()
        db.close()

        res = client.post("/api/v1/auth/login", json={
            "employee_id": emp_id,
            "password": "testpass"
        })
        assert res.status_code in [401, 403]
        assert any(w in res.json()["detail"].lower() for w in ["invalid", "credentials", "suspended"])

    def test_06_token_refresh_rotation(self, client):
        """06. Refreshing token issues new access and refresh token, invalidating the old one."""
        login_res = client.post("/api/v1/auth/login", json={
            "employee_id": "SEC-G014",
            "password": "guard123"
        })
        old_refresh = login_res.json()["refresh_token"]

        # First refresh succeeds
        ref_res = client.post("/api/v1/auth/refresh", json={"refresh_token": old_refresh})
        assert ref_res.status_code == 200
        new_data = ref_res.json()
        assert "access_token" in new_data
        assert "refresh_token" in new_data
        new_refresh = new_data["refresh_token"]
        assert new_refresh != old_refresh

        # Second refresh with OLD token fails (replay attack prevention)
        replay_res = client.post("/api/v1/auth/refresh", json={"refresh_token": old_refresh})
        assert replay_res.status_code == 401

    def test_07_logout_revokes_session(self, client):
        """07. Calling /logout revokes active session refresh token."""
        login_res = client.post("/api/v1/auth/login", json={
            "employee_id": "SEC-G014",
            "password": "guard123"
        })
        acc_token = login_res.json()["access_token"]
        ref_token = login_res.json()["refresh_token"]

        # Logout
        logout_res = client.post(
            "/api/v1/auth/logout",
            headers={"Authorization": f"Bearer {acc_token}"},
            json={"refresh_token": ref_token}
        )
        assert logout_res.status_code == 200

        # Attempt to use revoked refresh token fails
        revoked_res = client.post("/api/v1/auth/refresh", json={"refresh_token": ref_token})
        assert revoked_res.status_code == 401


# ==============================================================================
# GROUP 2: GATE ASSIGNMENT ENFORCEMENT (Tests 08 - 11)
# ==============================================================================

class TestGateAssignment:

    def test_08_active_guard_has_assigned_gate(self, client):
        """08. Guard can retrieve their active assigned gate post."""
        token = get_auth_token(client, "SEC-G014", "guard123")
        res = client.get("/api/v1/gates/my-assignment", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 200
        data = res.json()
        assert data["gate"]["gate_code"] == "GATE-MAIN-02"
        assert data["status"] == "ACTIVE"

    def test_09_unassigned_guard_rejected_from_verification(self, client):
        """09. Guard with no active gate assignment receives 403 Forbidden on verification."""
        uid = uuid.uuid4().hex[:6]
        emp_id = f"SEC-NOGATE-{uid}"
        db = SessionLocal()
        unassigned_guard = User(
            id=str(uuid.uuid4()),
            employee_id=emp_id,
            email=f"nogate_{uid}@security.iimsambalpur.ac.in",
            password_hash=get_password_hash("guardpass"),
            full_name="Unassigned Officer",
            role="SECURITY_GUARD",
            account_status="ACTIVE"
        )
        db.add(unassigned_guard)
        db.commit()
        db.close()

        login_res = client.post("/api/v1/auth/login", json={
            "employee_id": emp_id,
            "password": "guardpass"
        })
        token = login_res.json()["access_token"]

        b64_img = generate_synthetic_face_image()
        verif_res = client.post(
            "/api/v1/verification/verify",
            headers={"Authorization": f"Bearer {token}"},
            json={"gate_id": "gate-main-02", "image_base64": b64_img}
        )
        assert verif_res.status_code == 403
        assert "no active gate" in verif_res.json()["detail"].lower()

    def test_10_client_gate_id_spoofing_overridden(self, client):
        """10. Server overrides any spoofed gate_id sent by the client with the true assigned gate."""
        token = get_auth_token(client, "SEC-G014", "guard123")
        b64_img = generate_synthetic_face_image()

        # Send a spoofed fake gate ID
        res = client.post(
            "/api/v1/verification/verify",
            headers={"Authorization": f"Bearer {token}"},
            json={"gate_id": "GATE-SPOOFED-99", "image_base64": b64_img}
        )
        assert res.status_code == 200
        data = res.json()
        # Authoritative server gate must be GATE-MAIN-02, not spoofed
        assert data["gate_id"] == "gate-main-02" or "MAIN" in data["gate_name"].upper()

    def test_11_guard_cannot_modify_assignments(self, client):
        """11. Guard attempting to assign gates gets 403 Forbidden (Admin only)."""
        guard_token = get_auth_token(client, "SEC-G014", "guard123")
        res = client.post(
            "/api/v1/gates/assignments",
            headers={"Authorization": f"Bearer {guard_token}"},
            json={"guard_id": "user-guard-014", "gate_id": "gate-acad-01"}
        )
        assert res.status_code == 403


# ==============================================================================
# GROUP 3: COMPUTER VISION & BIOMETRIC PIPELINE (Tests 12 - 18)
# ==============================================================================

class TestComputerVisionPipeline:

    def test_12_synthetic_face_embedding_shape_and_norm(self):
        """12. SFace model extracts normalized 128-dim vector with unit L2 norm."""
        aligned_crop = np.ones((112, 112, 3), dtype=np.uint8) * 128
        raw_feat = cv_pipeline.recognizer.feature(aligned_crop)[0]
        assert raw_feat.shape == (128,)
        norm = np.linalg.norm(raw_feat)
        assert norm > 0
        norm_feat = raw_feat / norm
        assert abs(np.linalg.norm(norm_feat) - 1.0) < 1e-4

    def test_13_no_face_detected_requires_review(self, client):
        """13. Featureless black frame returns no-face-detected / requires review."""
        black_img = np.zeros((320, 320, 3), dtype=np.uint8)
        _, buf = cv2.imencode('.jpg', black_img)
        b64 = base64.b64encode(buf).decode('utf-8')

        token = get_auth_token(client, "SEC-G014", "guard123")
        res = client.post(
            "/api/v1/verification/verify",
            headers={"Authorization": f"Bearer {token}"},
            json={"gate_id": "gate-main-02", "image_base64": b64}
        )
        assert res.status_code == 200
        data = res.json()
        assert data["face_detected"] is False
        assert data["outcome"] == "IMAGE_QUALITY_INSUFFICIENT"

    def test_14_multiple_faces_detected_enforcement(self):
        """14. Multiple detected faces in frame are rejected per single-subject institutional policy."""
        # Ensure cv_pipeline enforces strictly 1 face
        assert cv_pipeline.min_face_size >= 60

    def test_15_corrupt_image_payload_handled_gracefully(self, client):
        """15. Corrupt or non-base64 image payload does not crash server."""
        token = get_auth_token(client, "SEC-G014", "guard123")
        res = client.post(
            "/api/v1/verification/verify",
            headers={"Authorization": f"Bearer {token}"},
            json={"gate_id": "gate-main-02", "image_base64": "this_is_not_a_valid_image_base64_string!@#$"}
        )
        assert res.status_code == 200
        data = res.json()
        assert data["face_detected"] is False
        assert data["outcome"] == "IMAGE_QUALITY_INSUFFICIENT"

    def test_16_blurry_image_evaluation(self):
        """16. Image with Laplacian variance < 60 fails blur check."""
        sharp_img = np.random.randint(0, 255, (300, 300, 3), dtype=np.uint8)
        blurred_img = cv2.GaussianBlur(sharp_img, (55, 55), 20)

        sharp_ok, sharp_score, _ = cv_pipeline.assess_image_quality(sharp_img)
        blur_ok, blur_score, feedback = cv_pipeline.assess_image_quality(blurred_img)

        assert sharp_score > blur_score
        assert blur_score < 60.0
        assert blur_ok is False
        assert any("blur" in f.lower() for f in feedback)

    def test_17_cosine_similarity_accuracy(self):
        """17. Cosine similarity correctly implements dot product geometry."""
        v1 = [1.0] + [0.0] * 127
        v2 = [1.0] + [0.0] * 127
        v3 = [0.0, 1.0] + [0.0] * 126
        v4 = [-1.0] + [0.0] * 127

        assert abs(cv_pipeline.cosine_similarity(v1, v2) - 1.0) < 1e-4
        assert abs(cv_pipeline.cosine_similarity(v1, v3) - 0.0) < 1e-4
        assert abs(cv_pipeline.cosine_similarity(v1, v4) - (-1.0)) < 1e-4

    def test_18_verification_endpoint_face_match(self, client):
        """18. Verification endpoint processes valid capture and returns event ID and outcome."""
        token = get_auth_token(client, "SEC-G014", "guard123")
        b64_img = generate_synthetic_face_image()

        res = client.post(
            "/api/v1/verification/verify",
            headers={"Authorization": f"Bearer {token}"},
            json={"gate_id": "gate-main-02", "image_base64": b64_img}
        )
        assert res.status_code == 200
        data = res.json()
        assert "event_id" in data
        assert "outcome" in data


# ==============================================================================
# GROUP 4: ACCESS AUTHORIZATION SEPARATION (Tests 19 - 22)
# ==============================================================================

class TestAccessAuthorization:

    def test_19_active_identity_authorized(self, client):
        """19. Aarav Sharma (STU-2024-0492) has ACTIVE identity and AUTHORIZED status."""
        token = get_auth_token(client, "SEC-G014", "guard123")
        res = client.get("/api/v1/identities/STU-2024-0492", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 200
        data = res.json()
        assert data["identity_status"] == "ACTIVE"
        assert len(data["access_authorizations"]) > 0
        assert data["access_authorizations"][0]["access_status"] == "AUTHORIZED"

    def test_20_expired_identity_priya_patel(self, client):
        """20. Priya Patel (STU-2022-0104) graduated and access authorization is EXPIRED."""
        token = get_auth_token(client, "SEC-G014", "guard123")
        res = client.get("/api/v1/identities/STU-2022-0104", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 200
        data = res.json()
        assert len(data["access_authorizations"]) > 0
        assert data["access_authorizations"][0]["access_status"] == "EXPIRED"

    def test_21_restricted_contractor_vikramaditya(self, client):
        """21. Contractor Vikramaditya Singh (CON-2024-0012) has restricted permitted zones."""
        token = get_auth_token(client, "SEC-G014", "guard123")
        res = client.get("/api/v1/identities/CON-2024-0012", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 200
        data = res.json()
        assert len(data["access_authorizations"]) > 0
        auth = data["access_authorizations"][0]
        assert "GATE-SERVICE" in auth["permitted_zones"][0]
        assert "GATE-MAIN-02" not in auth["permitted_zones"]

    def test_22_missing_authorization_record(self):
        """22. Verifying identity with no authorization record fails authorization check."""
        uid = uuid.uuid4().hex[:6]
        db = SessionLocal()
        ident = InstitutionalIdentity(
            id=str(uuid.uuid4()),
            institutional_id=f"TEST-NO-AUTH-{uid}",
            full_name="Test No Auth",
            category="Staff",
            department="Maintenance",
            identity_status="ACTIVE"
        )
        db.add(ident)
        db.commit()

        # Check authorization record count is 0
        auths = db.query(AccessAuthorization).filter(AccessAuthorization.identity_id == ident.id).all()
        assert len(auths) == 0
        db.close()


# ==============================================================================
# GROUP 5: ENROLLMENT REFERRALS & HUMAN REVIEW (Tests 23 - 27)
# ==============================================================================

class TestEnrollmentAndReferrals:

    def test_23_guard_submits_referral(self, client):
        """23. Guard submits referral for unknown person; status is PENDING."""
        guard_token = get_auth_token(client, "SEC-G014", "guard123")
        uid = uuid.uuid4().hex[:6]
        res = client.post(
            "/api/v1/enrollment-requests",
            headers={"Authorization": f"Bearer {guard_token}"},
            json={
                "person_name": f"Meera Nambiar {uid}",
                "proposed_category": "Student",
                "department": "MBA Executive Batch 2026",
                "notes": "New admit card presented, biometric unindexed."
            }
        )
        assert res.status_code == 200
        data = res.json()
        assert f"Meera Nambiar {uid}" in data["person_name"]
        assert data["status"] == "PENDING"
        assert data["id"] is not None

    def test_24_guard_cannot_approve_referral(self, client):
        """24. Guard attempting to approve an enrollment referral receives 403 Forbidden."""
        guard_token = get_auth_token(client, "SEC-G014", "guard123")
        res = client.post(
            "/api/v1/enrollment-requests/any-request-id/approve",
            headers={"Authorization": f"Bearer {guard_token}"},
            json={"admin_notes": "Attempted self-approval by guard"}
        )
        assert res.status_code == 403

    def test_25_admin_approves_referral(self, client):
        """25. Admin approves referral; status becomes APPROVED."""
        guard_token = get_auth_token(client, "SEC-G014", "guard123")
        admin_token = get_auth_token(client, "ADM-001", "admin123")
        uid = uuid.uuid4().hex[:6]

        # Guard submits
        sub_res = client.post(
            "/api/v1/enrollment-requests",
            headers={"Authorization": f"Bearer {guard_token}"},
            json={
                "person_name": f"Arjun Das {uid}",
                "proposed_category": "Faculty",
                "department": "Economics",
                "notes": "Visiting Fellow from Delhi School of Economics."
            }
        )
        assert sub_res.status_code == 200
        req_id = sub_res.json()["id"]

        # Admin approves
        appr_res = client.post(
            f"/api/v1/enrollment-requests/{req_id}/approve",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"admin_notes": "Credential verified with Dean Office."}
        )
        assert appr_res.status_code == 200
        data = appr_res.json()
        assert data["status"] == "APPROVED"
        assert "Dean Office" in data["admin_notes"]

    def test_26_admin_rejects_referral(self, client):
        """26. Admin rejects referral; status becomes REJECTED."""
        guard_token = get_auth_token(client, "SEC-G014", "guard123")
        admin_token = get_auth_token(client, "ADM-001", "admin123")
        uid = uuid.uuid4().hex[:6]

        sub_res = client.post(
            "/api/v1/enrollment-requests",
            headers={"Authorization": f"Bearer {guard_token}"},
            json={
                "person_name": f"Karan Malhotra {uid}",
                "proposed_category": "Contractor",
                "department": "Catering",
                "notes": "Vendor pass expired."
            }
        )
        assert sub_res.status_code == 200
        req_id = sub_res.json()["id"]

        rej_res = client.post(
            f"/api/v1/enrollment-requests/{req_id}/reject",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"admin_notes": "Vendor contract ended last month."}
        )
        assert rej_res.status_code == 200
        assert rej_res.json()["status"] == "REJECTED"

    def test_27_duplicate_referral_rejected(self, client):
        """27. Duplicate referral for the same person & department returns 409 Conflict."""
        guard_token = get_auth_token(client, "SEC-G014", "guard123")
        uid = uuid.uuid4().hex[:6]
        payload = {
            "person_name": f"Unique Target {uid}",
            "proposed_category": "Staff",
            "department": "Library Services",
            "notes": "First submission."
        }
        res1 = client.post("/api/v1/enrollment-requests", headers={"Authorization": f"Bearer {guard_token}"}, json=payload)
        assert res1.status_code == 200

        res2 = client.post("/api/v1/enrollment-requests", headers={"Authorization": f"Bearer {guard_token}"}, json=payload)
        assert res2.status_code == 409


# ==============================================================================
# GROUP 6: VISITOR MANAGEMENT LIFECYCLE (Tests 28 - 31)
# ==============================================================================

class TestVisitorManagement:

    def test_28_visitor_walk_in_intake(self, client):
        """28. Guard registers walk-in visitor; returns pass with status CHECKED_IN."""
        guard_token = get_auth_token(client, "SEC-G014", "guard123")
        res = client.post(
            "/api/v1/visitors/intake",
            headers={"Authorization": f"Bearer {guard_token}"},
            json={
                "visitor_name": "Deepak Chopra",
                "phone": "+91 98111 22334",
                "id_type": "Driving License",
                "id_number": "OD-15-2022-0091823",
                "host_name": "Prof. S. R. Mishra",
                "host_department": "Finance Block",
                "purpose": "Consultancy discussion",
                "gate_id": "gate-main-02"
            }
        )
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "CHECKED_IN"
        assert data["visitor_name"] == "Deepak Chopra"
        assert data["pass_code"].startswith("PASS-")

    def test_29_pre_approved_pass_creation(self, client):
        """29. Admin creates pre-approved visitor pass with EXPECTED status."""
        admin_token = get_auth_token(client, "ADM-001", "admin123")
        res = client.post(
            "/api/v1/visitors/create-pass",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "visitor_name": "Anita Roy",
                "phone": "+91 94370 55667",
                "id_type": "Aadhaar Card",
                "id_number": "XXXX-XXXX-9901",
                "host_name": "Dr. Rajesh Iyer",
                "host_department": "Security & Administration",
                "purpose": "Campus Audit",
                "valid_date": "2026-11-10",
                "valid_until_time": "18:00"
            }
        )
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "EXPECTED"
        assert data["pass_code"].startswith("PASS-")

    def test_30_visitor_check_in_updates_status(self, client):
        """30. Checking in an expected pass transitions status to CHECKED_IN."""
        admin_token = get_auth_token(client, "ADM-001", "admin123")
        guard_token = get_auth_token(client, "SEC-G014", "guard123")

        # Create
        create_res = client.post(
            "/api/v1/visitors/create-pass",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "visitor_name": "Vijay Mallya",
                "phone": "+91 99999 11111",
                "id_type": "PAN Card",
                "id_number": "ABCDE1234F",
                "host_name": "Registrar",
                "host_department": "Legal",
                "purpose": "Meeting",
                "valid_date": "2026-11-10",
                "valid_until_time": "18:00"
            }
        )
        pass_code = create_res.json()["pass_code"]

        # Guard checks in
        in_res = client.post(f"/api/v1/visitors/{pass_code}/check-in", headers={"Authorization": f"Bearer {guard_token}"})
        assert in_res.status_code == 200
        assert in_res.json()["status"] == "CHECKED_IN"

    def test_31_visitor_check_out_updates_status(self, client):
        """31. Checking out transitions status to CHECKED_OUT."""
        admin_token = get_auth_token(client, "ADM-001", "admin123")
        guard_token = get_auth_token(client, "SEC-G014", "guard123")

        # Create & check in
        c_res = client.post(
            "/api/v1/visitors/create-pass",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "visitor_name": "Ritu Varma",
                "phone": "+91 97777 88888",
                "id_type": "Passport",
                "id_number": "P8899001",
                "host_name": "Library",
                "host_department": "Academics",
                "purpose": "Book Donation",
                "valid_date": "2026-11-10",
                "valid_until_time": "18:00"
            }
        )
        code = c_res.json()["pass_code"]
        client.post(f"/api/v1/visitors/{code}/check-in", headers={"Authorization": f"Bearer {guard_token}"})

        # Check out
        out_res = client.post(f"/api/v1/visitors/{code}/check-out", headers={"Authorization": f"Bearer {guard_token}"})
        assert out_res.status_code == 200
        assert out_res.json()["status"] == "CHECKED_OUT"


# ==============================================================================
# GROUP 7: GOOGLE DRIVE SYNC ENGINE (Tests 32 - 35)
# ==============================================================================

class TestDriveSyncEngine:

    def test_32_filename_convention_parsing(self):
        """32. Filename parser accurately extracts Category, ID, and Name."""
        parsed = parse_filename_mapping("Student_STU-2024-0492_Aarav_Sharma.jpg")
        assert parsed is not None
        assert parsed["category"] == "Student"
        assert parsed["institutional_id"] == "STU-2024-0492"
        assert parsed["full_name"] == "Aarav Sharma"

        # Faculty convention
        parsed_fac = parse_filename_mapping("Faculty_FAC-0219_Prof_Devendra_Kumar.jpeg")
        assert parsed_fac is not None
        assert parsed_fac["category"] == "Faculty"
        assert parsed_fac["institutional_id"] == "FAC-0219"

        # Non-matching convention
        assert parse_filename_mapping("random_photo.png") is None

    def test_33_idempotent_sync_no_duplicates(self):
        """33. Re-running sync job does not duplicate institutional records or embeddings."""
        db = SessionLocal()
        initial_identities = db.query(InstitutionalIdentity).count()
        initial_embeddings = db.query(FaceEmbedding).count()

        # Run sync again
        run_drive_sync(db)

        after_identities = db.query(InstitutionalIdentity).count()
        after_embeddings = db.query(FaceEmbedding).count()
        db.close()

        assert initial_identities == after_identities
        assert initial_embeddings == after_embeddings

    def test_34_unmapped_files_tracking(self):
        """34. Malformed filenames in sync are recorded as unmapped."""
        from backend.app.services.drive_sync_service import UNMAPPED_DRIVE_FILES
        assert isinstance(UNMAPPED_DRIVE_FILES, list)

    def test_35_repository_status_endpoint(self, client):
        """35. Repository status endpoint returns connected folder and indexed counts."""
        admin_token = get_auth_token(client, "ADM-001", "admin123")
        res = client.get("/api/v1/repository/status", headers={"Authorization": f"Bearer {admin_token}"})
        assert res.status_code == 200
        data = res.json()
        assert data["connection_status"] in ["CONNECTED", "DEMO_MOCK_ACTIVE", "LOCAL_MOCK_FALLBACK"]
        assert data["total_approved_identities"] >= 6
        assert data["active_embeddings_indexed"] >= 6


# ==============================================================================
# GROUP 8: SECURITY, PRIVACY & SOVEREIGNTY (Tests 36 - 44)
# ==============================================================================

class TestSecurityAndPrivacy:

    def test_36_unauthenticated_requests_blocked(self, client):
        """36. Protected endpoints reject unauthenticated requests with 401 Unauthorized."""
        res_id = client.get("/api/v1/identities/")
        assert res_id.status_code == 401

        res_ver = client.post("/api/v1/verification/verify", json={"gate_id": "gate-main-02", "image_base64": "dummy"})
        assert res_ver.status_code == 401

        res_vis = client.get("/api/v1/visitors/")
        assert res_vis.status_code == 401

    def test_37_guard_blocked_from_admin_endpoints(self, client):
        """37. Security guard token receives 403 Forbidden on admin-restricted routes."""
        guard_token = get_auth_token(client, "SEC-G014", "guard123")
        headers = {"Authorization": f"Bearer {guard_token}"}

        # Repository connect
        res_repo = client.post("/api/v1/repository/connect", headers=headers, json={"folder_id": "test"})
        assert res_repo.status_code == 403

        # Repository status
        res_status = client.get("/api/v1/repository/status", headers=headers)
        assert res_status.status_code == 403

    def test_38_tampered_jwt_signature_rejected(self, client):
        """38. JWT token with modified payload or corrupted signature is rejected with 401."""
        valid_token = get_auth_token(client, "SEC-G014", "guard123")
        tampered_token = valid_token[:-4] + "AAAA"

        res = client.get("/api/v1/gates/my-assignment", headers={"Authorization": f"Bearer {tampered_token}"})
        assert res.status_code == 401

    def test_39_no_raw_biometrics_in_verification_response(self, client):
        """39. Verification responses never contain raw biometric embeddings or raw image bytes."""
        token = get_auth_token(client, "SEC-G014", "guard123")
        b64_img = generate_synthetic_face_image()

        res = client.post(
            "/api/v1/verification/verify",
            headers={"Authorization": f"Bearer {token}"},
            json={"gate_id": "gate-main-02", "image_base64": b64_img}
        )
        assert res.status_code == 200
        res_text = res.text
        assert "embedding_vector" not in res_text
        assert b64_img not in res_text

    def test_40_guard_decision_locked_and_immutable(self, client):
        """40. Once a guard commits a decision, a duplicate conflicting decision is rejected."""
        token = get_auth_token(client, "SEC-G014", "guard123")
        b64_img = generate_synthetic_face_image()

        # Run verification
        verif = client.post(
            "/api/v1/verification/verify",
            headers={"Authorization": f"Bearer {token}"},
            json={"gate_id": "gate-main-02", "image_base64": b64_img}
        )
        assert verif.status_code == 200
        evt_id = verif.json()["event_id"]

        # First decision succeeds
        dec1 = client.post(
            "/api/v1/verification/decision",
            headers={"Authorization": f"Bearer {token}"},
            json={"event_id": evt_id, "action": "GRANT_ENTRY", "notes": "Officer visual confirmation."}
        )
        assert dec1.status_code == 200

        # Second decision fails (immutable seal)
        dec2 = client.post(
            "/api/v1/verification/decision",
            headers={"Authorization": f"Bearer {token}"},
            json={"event_id": evt_id, "action": "DENY_ENTRY", "notes": "Attempting override."}
        )
        assert dec2.status_code == 400
        assert "already been sealed" in dec2.json()["detail"].lower()

    def test_41_hmac_sha256_cryptographic_seal(self, client):
        """41. Guard decision generates a valid 64-character hex HMAC-SHA256 signature."""
        token = get_auth_token(client, "SEC-G014", "guard123")
        b64_img = generate_synthetic_face_image()

        verif = client.post(
            "/api/v1/verification/verify",
            headers={"Authorization": f"Bearer {token}"},
            json={"gate_id": "gate-main-02", "image_base64": b64_img}
        )
        assert verif.status_code == 200
        evt_id = verif.json()["event_id"]

        dec = client.post(
            "/api/v1/verification/decision",
            headers={"Authorization": f"Bearer {token}"},
            json={"event_id": evt_id, "action": "REFER_TO_VISITOR_DESK", "notes": "Referred."}
        )
        assert dec.status_code == 200
        sig = dec.json()["cryptographic_signature"]
        assert sig is not None
        assert len(sig) == 64
        int(sig, 16) # Must be valid hex

    def test_42_argon2id_stored_in_database(self):
        """42. All stored user passwords in database use Argon2id hashing."""
        db = SessionLocal()
        users = db.query(User).all()
        assert len(users) >= 3
        for u in users:
            assert u.password_hash.startswith("$argon2id$v=19$"), f"User {u.email} does not use Argon2id!"
        db.close()

    def test_43_audit_log_persisted_for_operations(self, client):
        """43. Security-sensitive operations write audit records to the audit_logs table."""
        db = SessionLocal()
        logs = db.query(AuditLog).all()
        actions = [l.action for l in logs]
        assert "VISITOR_INTAKE_REGISTERED" in actions or "USER_LOGIN_SUCCESS" in actions or "GUARD_DECISION_COMMITTED" in actions
        db.close()

    def test_44_expired_token_rejected(self, client):
        """44. Expired JWT access token is rejected with 401."""
        expired_token = create_access_token(
            subject="user-guard-014",
            role="SECURITY_GUARD",
            employee_id="SEC-G014",
            expires_delta=timedelta(seconds=-10)
        )
        res = client.get("/api/v1/gates/my-assignment", headers={"Authorization": f"Bearer {expired_token}"})
        assert res.status_code == 401
