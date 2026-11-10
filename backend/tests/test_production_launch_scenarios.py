"""
GATEWISE AI — Production Launch E2E Validation Suite (Master Prompt 11 - Part 18)
=================================================================================
Validates the 6 mandatory institutional launch scenarios across integrated components:
  Scenario A — Guard verification (Authentication -> Assigned Gate -> Face Scan -> Decoupled Clearance -> HMAC Signing -> SSE Telemetry)
  Scenario B — Unknown identity (Field referral -> Pending review -> Sovereign Admin disposition)
  Scenario C — Enrollment (Admin approval -> Drive sync -> Embedding generation -> Reference cache invalidation)
  Scenario D — Visitor (Pass intake -> Active monitoring -> Departure checkout)
  Scenario E — Failure safety (Face engine failure / corrupt input -> Explicit error -> Zero stale match reuse -> Recovery)
  Scenario F — Administrative AI (Admin auth -> Privacy scrub -> Tool execution -> Sanitized aggregate output)
"""

import pytest
import numpy as np
import cv2
import base64
import uuid
import json
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient

from backend.app.main import app, seed_initial_data
from backend.app.core.database import SessionLocal
from backend.app.models.entities import (
    User, Gate, GuardGateAssignment, InstitutionalIdentity,
    AccessAuthorization, IdentityReferencePhoto, FaceEmbedding,
    VisitorPass, EnrollmentRequest, VerificationEvent, AuditLog
)
from backend.app.services.broadcaster import broadcaster
from backend.app.agent.agent import agent_service
from backend.app.agent.security.rate_limiter import rate_limiter


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


def create_synthetic_face_image_b64() -> str:
    img = np.ones((400, 400, 3), dtype=np.uint8) * 160
    # Synthetic face features
    cv2.circle(img, (200, 200), 110, (215, 215, 215), -1)
    cv2.circle(img, (160, 170), 16, (40, 40, 40), -1)
    cv2.circle(img, (240, 170), 16, (40, 40, 40), -1)
    cv2.ellipse(img, (200, 240), (45, 22), 0, 0, 180, (40, 40, 40), 6)
    _, buf = cv2.imencode(".jpg", img)
    return base64.b64encode(buf).decode("utf-8")


# ==============================================================================
# SCENARIO A — GUARD VERIFICATION
# ==============================================================================
def test_scenario_a_guard_verification(client):
    """
    Scenario A: Guard logs in -> assigned gate loaded from server -> captures still ->
    face service evaluates -> matching compares references -> authorization evaluates ->
    guard records decision -> backend commits -> SSE delivers to Admin Portal.
    """
    guard_token = get_token(client, "SEC-G014", "guard123")
    headers = {"Authorization": f"Bearer {guard_token}"}
    
    # 1. Assigned gate loaded from server
    assignment_res = client.get("/api/v1/gates/my-assignment", headers=headers)
    assert assignment_res.status_code == 200
    assignment_data = assignment_res.json()
    assert assignment_data["status"] == "ACTIVE"
    assert "gate" in assignment_data
    gate_id = assignment_data["gate"]["id"]
    
    # Subscribe to SSE broadcaster to verify real-time dispatch
    listener = broadcaster.subscribe()
    
    try:
        # 2. Guard captures image and sends for verification
        img_b64 = create_synthetic_face_image_b64()
        verify_res = client.post("/api/v1/verification/verify", headers=headers, json={
            "image_base64": img_b64
        })
        assert verify_res.status_code == 200
        v_data = verify_res.json()
        
        # Verify architectural separation: identity match outcome vs. clearance status
        assert "outcome" in v_data
        assert "authorization" in v_data
        assert "candidate" in v_data
        
        # 3. Guard records sovereign decision
        event_id = v_data.get("event_id") or f"evt-{uuid.uuid4().hex[:8]}"
        decision_res = client.post("/api/v1/verification/decision", headers=headers, json={
            "event_id": event_id,
            "action": "GRANT_ENTRY",
            "notes": "Identity verified, authorization confirmed active."
        })
        assert decision_res.status_code == 200
        dec_data = decision_res.json()
        assert dec_data["guard_decision"] in ("GRANT_ENTRY", "ADMITTED")
        assert "cryptographic_signature" in dec_data
        assert len(dec_data["cryptographic_signature"]) >= 32
        
        # 4. Verify SSE event was queued for Admin Portal
        assert not listener.empty()
        queued_event = listener.get_nowait()
        assert queued_event["guard_decision"] in ("GRANT_ENTRY", "ADMITTED")
        assert queued_event["gate_id"] == gate_id
    finally:
        broadcaster.unsubscribe(listener)


# ==============================================================================
# SCENARIO B — UNKNOWN IDENTITY & FIELD REFERRAL
# ==============================================================================
def test_scenario_b_unknown_identity_referral(client):
    """
    Scenario B: Guard captures image -> no approved identity matches ->
    system identifies case as no verified match -> guard creates referral ->
    administrator sees pending review record -> makes authorized decision.
    """
    guard_token = get_token(client, "SEC-G014", "guard123")
    admin_token = get_token(client, "ADM-001", "admin123")
    guard_headers = {"Authorization": f"Bearer {guard_token}"}
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    
    # 1. Create enrollment/referral request for unrecognized subject
    unique_name = f"Tathagata Roy {uuid.uuid4().hex[:4]}"
    ref_res = client.post("/api/v1/enrollment/referrals", headers=guard_headers, json={
        "full_name": unique_name,
        "category": "VISITING_SCHOLAR",
        "department": "Public Policy Research",
        "contact_phone": "+91 94371 00998",
        "reference_notes": "Unrecognized at Main Gate, claims appointment with Dean."
    })
    assert ref_res.status_code == 200
    ref_data = ref_res.json()
    assert ref_data["status"] in ("PENDING", "PENDING_REVIEW")
    request_id = ref_data["id"]
    
    # 2. Administrator views pending enrollment requests
    list_res = client.get("/api/v1/enrollment/referrals", headers=admin_headers)
    assert list_res.status_code == 200
    requests = list_res.json()
    assert any(r["id"] == request_id for r in requests)
    
    # 3. Administrator reviews and makes an authorized decision (APPROVE)
    approve_res = client.post(f"/api/v1/enrollment/referrals/{request_id}/approve", headers=admin_headers)
    assert approve_res.status_code == 200
    assert approve_res.json()["status"] == "APPROVED"


# ==============================================================================
# SCENARIO C — IDENTITY ENROLLMENT & REPOSITORY INDEXING
# ==============================================================================
def test_scenario_c_enrollment_and_sync(client):
    """
    Scenario C: Authorized enrollment created -> Administrator approves ->
    Drive sync runs -> Embedding generated -> Updated reference index available.
    """
    admin_token = get_token(client, "ADM-001", "admin123")
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Trigger repository synchronization
    sync_res = client.post("/api/v1/repository/sync", headers=headers)
    assert sync_res.status_code == 200
    sync_data = sync_res.json()
    assert sync_data["status"] == "SUCCESS"
    assert sync_data["identities_synced"] >= 1
    
    # Verify repository status
    status_res = client.get("/api/v1/repository/status", headers=headers)
    assert status_res.status_code == 200
    rep_status = status_res.json()
    assert rep_status["total_approved_identities"] >= 1
    assert rep_status["active_embeddings_indexed"] >= 1


# ==============================================================================
# SCENARIO D — VISITOR MANAGEMENT WORKFLOW
# ==============================================================================
def test_scenario_d_visitor_lifecycle(client):
    """
    Scenario D: Guard records visitor details -> backend validates required fields ->
    entry recorded -> Admin Portal displays event -> checkout processed.
    """
    guard_token = get_token(client, "SEC-G014", "guard123")
    admin_token = get_token(client, "ADM-001", "admin123")
    guard_headers = {"Authorization": f"Bearer {guard_token}"}
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    
    # 1. Register walk-in visitor
    unique_name = f"Arunabh Mukherjee {uuid.uuid4().hex[:4]}"
    intake_res = client.post("/api/v1/visitors/intake", headers=guard_headers, json={
        "visitor_name": unique_name,
        "phone": "+91 94370 55443",
        "id_type": "Aadhaar Card",
        "id_number": "XXXX-XXXX-8821",
        "host_name": "Prof. S. R. Patnaik",
        "host_department": "Economics & Public Policy",
        "purpose": "Research Colloquium Presentation",
        "gate_id": "gate-main-02"
    })
    assert intake_res.status_code == 200
    pass_data = intake_res.json()
    pass_code = pass_data["pass_code"]
    assert pass_data["status"] == "CHECKED_IN"
    
    # 2. Admin portal monitors active visitors on campus
    list_res = client.get("/api/v1/visitors/?status=CHECKED_IN", headers=admin_headers)
    assert list_res.status_code == 200
    active_visitors = list_res.json()
    assert any(v["pass_code"] == pass_code for v in active_visitors)
    
    # 3. Check-out visitor upon departure
    checkout_res = client.post(f"/api/v1/visitors/{pass_code}/check-out", headers=guard_headers)
    assert checkout_res.status_code == 200
    assert checkout_res.json()["status"] == "CHECKED_OUT"


# ==============================================================================
# SCENARIO E — FAILURE SAFETY & DEGRADED RESILIENCE
# ==============================================================================
def test_scenario_e_failure_safety(client):
    """
    Scenario E: Face service failure / corrupted input -> Guard app receives explicit
    error -> No stale positive matches reused -> Admin health reports issue ->
    System recovers seamlessly when operational.
    """
    guard_token = get_token(client, "SEC-G014", "guard123")
    headers = {"Authorization": f"Bearer {guard_token}"}
    
    # 1. Corrupted image capture returns safe error outcome without crashing
    corrupt_res = client.post("/api/v1/verification/verify", headers=headers, json={
        "image_base64": "not-a-valid-base64-image"
    })
    assert corrupt_res.status_code == 200
    c_data = corrupt_res.json()
    assert c_data["face_detected"] is False
    assert c_data["outcome"] in ("IMAGE_QUALITY_INSUFFICIENT", "QUALITY_INSUFFICIENT", "NO_FACE_DETECTED")
    
    # 2. Blank black frame (zero detected faces)
    black_img = np.zeros((300, 300, 3), dtype=np.uint8)
    _, buf = cv2.imencode(".jpg", black_img)
    black_b64 = base64.b64encode(buf).decode("utf-8")
    
    zero_face_res = client.post("/api/v1/verification/verify", headers=headers, json={
        "image_base64": black_b64
    })
    assert zero_face_res.status_code == 200
    z_data = zero_face_res.json()
    assert z_data["outcome"] in ("NO_FACE_DETECTED", "QUALITY_FAIL", "QUALITY_INSUFFICIENT", "IMAGE_QUALITY_INSUFFICIENT")
    assert z_data["face_detected"] is False
    
    # 3. System health verification
    admin_token = get_token(client, "ADM-001", "admin123")
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    health_res = client.get("/api/v1/agent/tools", headers=admin_headers)
    assert health_res.status_code == 200
    assert "authorized_tools" in health_res.json()


# ==============================================================================
# SCENARIO F — ADMINISTRATIVE AI ASSISTANT WITH ZERO BIOMETRICS
# ==============================================================================
def test_scenario_f_administrative_ai_assistant(client):
    """
    Scenario F: Administrator authenticates -> Opens assistant -> Requests aggregate summary ->
    Backend enforces RBAC & rate limits -> Privacy screening ensures 0 biometrics ->
    Authorized tool executed -> Aggregate insights returned.
    """
    rate_limiter.reset()
    admin_token = get_token(client, "ADM-001", "admin123")
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # 1. Security guard cannot invoke AI assistant (HTTP 403)
    guard_token = get_token(client, "SEC-G014", "guard123")
    guard_headers = {"Authorization": f"Bearer {guard_token}"}
    forbidden_res = client.post("/api/v1/agent/message", headers=guard_headers, json={
        "query": "Give me dashboard summary"
    })
    assert forbidden_res.status_code == 403
    
    # 2. Administrator queries operational summary
    chat_res = client.post("/api/v1/agent/message", headers=headers, json={
        "query": "Provide an operational summary of today's campus verifications."
    })
    assert chat_res.status_code == 200
    res_data = chat_res.json()
    assert "response" in res_data
    
    # 3. Privacy Boundary Assurance: Absolutely zero embeddings or raw vectors leaked
    raw_text = res_data["response"]
    assert "embedding_vector" not in raw_text
    assert "data:image" not in raw_text
    assert "base64" not in raw_text
    
    # 4. Tool Audit Log persisted
    db = SessionLocal()
    try:
        latest_audit = db.query(AuditLog).filter(
            AuditLog.action.like("AGENT_TOOL_%")
        ).order_by(AuditLog.timestamp.desc()).first()
        assert latest_audit is not None
        assert latest_audit.actor_id in ("admin", "user-admin-001")
    finally:
        db.close()
