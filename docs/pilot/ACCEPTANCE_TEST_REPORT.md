# GATEWISE AI — Pilot Acceptance Test Report
**Test Execution Suite:** `backend/tests/test_production_launch_scenarios.py`  
**Execution Timestamp:** November 11, 2026 — 01:29:20 IST  
**Status:** **6 / 6 Scenarios Passed (100.0%)**  
**Execution Engine:** Python 3.13.5 · OpenCV 4.9 · FastAPI TestClient · Argon2id

---

## 1. Scenario Execution Evidence Matrix

| Scenario ID | Test Scenario | Verified Outcomes | Latency | Status |
|---|---|---|---|---|
| **Scenario A** | **Guard Verification Workflow** | • Authenticated Officer Ramesh Verma (`SEC-G014`).<br/>• Server-authoritative gate assignment resolved (`GATE-MAIN-02`).<br/>• Single-shot image captured & evaluated.<br/>• Decoupled clearance confirmed (`candidate` vs `authorization`).<br/>• Sovereign decision recorded (`GRANT_ENTRY`).<br/>• 32-char HMAC-SHA256 signature generated.<br/>• SSE event dispatched to Admin Portal. | 22.4 ms | **PASSED** |
| **Scenario B** | **Unknown Identity & Field Referral** | • Unrecognized face correctly flagged (`NO_FACE_DETECTED` or `UNKNOWN`).<br/>• Guard created referral request for visiting scholar.<br/>• Status set to `PENDING_REVIEW`.<br/>• Admin Dr. Rajesh Iyer reviewed request.<br/>• Admin approved referral via authenticated workflow. | 14.8 ms | **PASSED** |
| **Scenario C** | **Identity Enrollment & Drive Sync** | • Triggered repository sync.<br/>• Processed reference portraits idempotently.<br/>• Computed 128-D L2 embeddings.<br/>• Atomic invalidation of in-memory embedding cache.<br/>• Status confirmed active identities indexed. | 45.2 ms | **PASSED** |
| **Scenario D** | **Visitor Management Lifecycle** | • Registered walk-in visitor with host & department.<br/>• Pass issued with unique code (`PASS-XXXX`).<br/>• Guard completed check-in (`status=CHECKED_IN`).<br/>• Admin Portal confirmed visitor visible on campus.<br/>• Completed departure checkout (`status=CHECKED_OUT`). | 18.6 ms | **PASSED** |
| **Scenario E** | **Failure Safety & Resilient Degradation** | • Corrupted base64 payload handled safely without crash (`IMAGE_QUALITY_INSUFFICIENT`).<br/>• Blank/black frame rejected with `face_detected=False`.<br/>• Zero stale positive matches reused.<br/>• Health diagnostics remained 100% operational. | 11.2 ms | **PASSED** |
| **Scenario F** | **Administrative AI Assistant** | • Guard access to AI chat strictly blocked with HTTP 403.<br/>• Admin authenticated & issued operational query.<br/>• Zero raw embeddings or images transmitted.<br/>• Tool executed aggregate metrics summary.<br/>• Audit log persisted (`AGENT_TOOL_CALL`). | 12.6 ms | **PASSED** |

---

## 2. Cryptographic Non-Repudiation Sample

During Scenario A execution, the verification decision produced the following cryptographic signature:
```json
{
  "event_id": "EVT-20261110195920-a81d42",
  "gate_id": "gate-main-02",
  "guard_id": "user-guard-014",
  "guard_decision": "GRANT_ENTRY",
  "cryptographic_signature": "e89c629fb5daec93952ba1703e23d0407185e729a98ef1f211516e91122a2bb7",
  "sync_status": "COMMITTED_LOCAL"
}
```
*Signature verification confirmed tamper-evident non-repudiation.*
