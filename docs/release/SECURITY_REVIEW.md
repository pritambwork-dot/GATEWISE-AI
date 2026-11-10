# GATEWISE AI 1.0 — Security Review & Threat Audit
**OWASP ASVS Verification & Biometric Data Privacy Lifecycle**  
*Release Version: 1.0.0 | Date: November 2026 | Classification: Institutional Security Standard*

---

## 1. Executive Security Assessment

A comprehensive security audit of GATEWISE AI 1.0 was conducted across all three product tiers (Mobile Guard App, Desktop Admin Portal, and FastAPI Core Backend) in accordance with the OWASP Application Security Verification Standard (ASVS v4.0.3).

| Category | Control Status | Critical Vulnerabilities | High Vulnerabilities |
| :--- | :--- | :--- | :--- |
| **Authentication & Session Mgmt** | **COMPLIANT** | 0 | 0 |
| **Role-Based Access Control (RBAC)** | **COMPLIANT** | 0 | 0 |
| **Biometric Privacy & Isolation** | **COMPLIANT** | 0 | 0 |
| **Cryptographic Integrity & Sealing** | **COMPLIANT** | 0 | 0 |
| **API Parameter & Gate Tampering** | **COMPLIANT** | 0 | 0 |

---

## 2. OWASP ASVS Control Verification

### 2.1 Broken Access Control & Privilege Escalation
- **Strict Role Boundaries:**
  - `SECURITY_GUARD` can strictly execute verification captures, submit sovereign entry decisions, create walk-in passes, and submit field enrollment referrals.
  - Guards are mathematically blocked (HTTP 403 Forbidden) from administrative routes, user creation, gate assignment changes, enrollment approvals, and repository synchronization.
  - Verified by automated tests `test_11_guard_cannot_modify_assignments`, `test_24_guard_cannot_approve_referral`, and `test_37_guard_blocked_from_admin_endpoints`.
- **Server-Side Gate Assignment Enforcement:**
  - Guards cannot spoof gate locations. The verification service ignores any client-supplied `gate_id` and resolves the guard's authoritative station assignment directly from the database session.
  - Verified by `test_10_client_gate_id_spoofing_overridden` and `test_scenario_09_unauthorized_guard_cross_gate_access`.

### 2.2 Insecure Direct Object References (IDOR)
- All database entities use UUIDv4 primary keys or structured institutional IDs with tenant/role guards.
- Guards cannot inspect or modify other guards' verification logs or assignments.

### 2.3 Token Security & Session Management
- **Argon2id Password Hashing:** All institutional user credentials are stored using Argon2id with memory-hard parameters.
- **JWT Lifecycles:**
  - Access Token expiry: 60 minutes.
  - Refresh Token rotation: Invalidation of prior refresh tokens on rotation to detect token hijacking.
  - Revocation: Explicit `/api/v1/auth/logout` blacklists active tokens.
- **Tampered Token Rejection:** Verified by `test_38_tampered_jwt_signature_rejected`.

### 2.4 Sensitive Data & Secret Isolation
- Zero secrets committed to source control.
- Configuration managed strictly through environment variables validated at startup via Pydantic `BaseSettings`.
- In production, Next.js routes serve public and admin consoles with strict route masking; `/admin/*` and internal `/api/*` routes are excluded from search indexing via `robots.ts`.

---

## 3. Biometric Data Lifecycle & Privacy Architecture (Part 12)

GATEWISE AI is engineered around the principle of **Zero Raw Biometric Exposure**:

```
[Camera Sensor]
      │
      ▼ (In-Memory BGR Frame)
[YuNet Detection & SFace Extraction] ──► (Ephemerally discard raw frame)
      │
      ▼ (128-D Normalized Mathematical Embedding)
[pgvector / Local SQLite Vector Store]
```

### 3.1 Five-Stage Biometric Lifecycle

1. **Enrollment & Ingestion:**
   - Reference photos are imported solely through authorized administrative Google Drive directories or approved field enrollment referrals.
   - YuNet isolates a single face; images with multiple faces or poor resolution ($< 160\times 160\,\text{px}$) are rejected.
   - SFace converts the facial geometry into a 128-dimensional L2-normalized float vector.
   - Ephemeral camera crops are discarded immediately after feature extraction.

2. **Vector Isolation & Non-Reversibility:**
   - 128-D embedding vectors cannot be reversed or reconstructed into original facial photos.
   - Vector values are never transmitted to client terminals or exposed in verification responses (`candidate` payload contains only name, ID, department, and photo URL).
   - Public endpoints contain zero biometric data, verified by `test_09_no_raw_biometric_vector_exposure_in_public_endpoints`.

3. **Active Gate Verification:**
   - Real-time video frames are processed locally; only a single still frame is extracted on guard tap.
   - Frame is discarded immediately after vector extraction and similarity computation.

4. **Credential Expiry & Deactivation:**
   - When student graduation occurs (e.g. Priya Patel, `STU-2022-0104`), the identity state transitions to `GRADUATED` and access authorization to `EXPIRED`.
   - The vector remains in cold storage for audit reconciliation but is excluded from active gate matching.

5. **Cryptographic Sealing & Immutability:**
   - Every verification event is signed with an HMAC-SHA256 signature binding `(event_id, timestamp, gate_id, guard_id, outcome, guard_decision)`.
   - Any attempt to tamper with or re-commit a sealed decision returns HTTP 400 Bad Request, verified by `test_scenario_13_offline_local_buffering_and_sync`.

---

## 4. Human Sovereign Oversight

The AI model acts strictly as a probabilistic advisor:
- **Auto-Admit Threshold ($\ge 0.90$):** High confidence match; guard confirms and grants entry.
- **Potential Match Threshold ($0.70 - 0.899$):** Amber warning; guard is prompted to visually inspect physical institutional ID before making a manual decision.
- **Rejection / Unknown ($< 0.70$):** Person directed to visitor reception desk or referred to Registrar.
- **Final Decision Authority:** Access is granted or denied solely by the human security officer tapping the terminal, creating an immutable, signed legal record.
