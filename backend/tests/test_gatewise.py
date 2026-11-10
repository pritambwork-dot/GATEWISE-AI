import pytest
from fastapi.testclient import TestClient
import numpy as np
import cv2
import base64
from backend.app.main import app, seed_initial_data

@pytest.fixture(scope="module")
def client():
    seed_initial_data()
    return TestClient(app)

def test_health_check(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "HEALTHY"

def test_guard_authentication_and_gate_locking(client):
    # Valid Guard Login
    res = client.post("/api/v1/auth/login", json={
        "employee_id": "SEC-G014",
        "password": "guard123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "SECURITY_GUARD"
    assert data["user"]["assigned_gate"] is not None
    assert data["user"]["assigned_gate"]["code"] == "GATE-MAIN-02"
    assert "Main Campus Gate" in data["user"]["assigned_gate"]["name"]

def test_admin_authentication(client):
    res = client.post("/api/v1/auth/login", json={
        "employee_id": "ADM-001",
        "password": "admin123"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["user"]["role"] == "ADMIN"
    assert data["user"]["full_name"] == "Dr. Rajesh Iyer"

def test_invalid_login_rejected(client):
    res = client.post("/api/v1/auth/login", json={
        "employee_id": "SEC-G014",
        "password": "wrong_password"
    })
    assert res.status_code == 401

def test_identities_and_drive_sync(client):
    # Login as Guard or Admin to query identities
    login_res = client.post("/api/v1/auth/login", json={
        "employee_id": "SEC-G014",
        "password": "guard123"
    })
    token = login_res.json()["access_token"]
    
    # Query identities
    res = client.get("/api/v1/identities/", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    identities = res.json()
    assert len(identities) >= 5
    
    person_ids = [i.get("institutional_id") or i.get("person_id") for i in identities]
    assert "STU-2024-0492" in person_ids # Aarav Sharma
    assert "FAC-0219" in person_ids     # Prof. Devendra Kumar
    assert "STU-2022-0104" in person_ids # Priya Patel (expired)

def test_face_verification_and_guard_decision(client):
    # 1. Login Guard
    login_res = client.post("/api/v1/auth/login", json={
        "employee_id": "SEC-G014",
        "password": "guard123"
    })
    token = login_res.json()["access_token"]
    gate_id = login_res.json()["user"]["assigned_gate"]["id"]

    # 2. Synthetic textured face image
    img = np.random.randint(100, 200, (300, 300, 3), dtype=np.uint8)
    img[60:240, 80:220] = (140, 160, 220)
    noise = np.random.randint(-20, 20, (180, 140, 3), dtype=np.int16)
    img[60:240, 80:220] = np.clip(img[60:240, 80:220].astype(np.int16) + noise, 0, 255).astype(np.uint8)
    _, buf = cv2.imencode('.jpg', img)
    b64_str = base64.b64encode(buf).decode('utf-8')

    # 3. Call verification endpoint
    verif_res = client.post(
        "/api/v1/verification/verify",
        headers={"Authorization": f"Bearer {token}"},
        json={"gate_id": gate_id, "image_base64": b64_str}
    )
    assert verif_res.status_code == 200
    verif_data = verif_res.json()
    assert "event_id" in verif_data
    assert "outcome" in verif_data
    evt_id = verif_data["event_id"]

    # 4. Record human guard decision
    decision_res = client.post(
        "/api/v1/verification/decision",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "event_id": evt_id,
            "action": "GRANT_ENTRY",
            "notes": "Verified by officer on duty at Post 02."
        }
    )
    assert decision_res.status_code == 200
    dec_data = decision_res.json()
    assert dec_data["guard_decision"] == "GRANT_ENTRY"
    assert dec_data["cryptographic_signature"] is not None
    assert len(dec_data["cryptographic_signature"]) == 64 # SHA-256 hex string

def test_visitor_pass_management(client):
    # Admin login for pass creation
    admin_login = client.post("/api/v1/auth/login", json={
        "employee_id": "ADM-001",
        "password": "admin123"
    })
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Guard login for check-in / check-out
    guard_login = client.post("/api/v1/auth/login", json={
        "employee_id": "SEC-G014",
        "password": "guard123"
    })
    guard_token = guard_login.json()["access_token"]
    guard_headers = {"Authorization": f"Bearer {guard_token}"}

    # 1. Create Pre-approved visitor pass
    pass_res = client.post("/api/v1/visitors/create-pass", headers=admin_headers, json={
        "visitor_name": "Siddharth Sen",
        "phone": "+91 98450 11223",
        "id_type": "Passport",
        "id_number": "Z1928374",
        "host_name": "Director Office",
        "host_department": "Administration",
        "purpose": "Academic Council Review",
        "valid_date": "2026-11-10",
        "valid_until_time": "19:00"
    })
    assert pass_res.status_code == 200
    pass_data = pass_res.json()
    pass_code = pass_data["pass_code"]
    assert pass_data["status"] == "EXPECTED"

    # 2. Check-in visitor
    in_res = client.post(f"/api/v1/visitors/{pass_code}/check-in", headers=guard_headers)
    assert in_res.status_code == 200
    assert in_res.json()["status"] == "CHECKED_IN"

    # 3. Check-out visitor
    out_res = client.post(f"/api/v1/visitors/{pass_code}/check-out", headers=guard_headers)
    assert out_res.status_code == 200
    assert out_res.json()["status"] == "CHECKED_OUT"

def test_guard_operational_assistant(client):
    res = client.post("/api/v1/assistant/query", json={
        "query": "What is the procedure when an expired student card is presented?"
    })
    assert res.status_code == 200
    ans = res.json()["response"]
    assert "Expired" in ans or "Deny" in ans or "Registrar" in ans
