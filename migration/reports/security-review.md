# DISCOVERY REPORT: SECURITY & THREAT MODEL REVIEW
**Agent:** `security_reviewer`  
**Execution Mode:** Read-Only Discovery  
**Output Target:** `migration/reports/security-review.md`  
**Timestamp:** 2026-11-11T12:33:00+05:30  

---

### 1. Security Architecture & Threat Boundaries

| Boundary | Mechanism | Implementation Guarantee |
|---|---|---|
| **Client-to-Backend** | TLS 1.3 + JWT Bearer Auth | All endpoints require authenticated guard token; public routes strictly limited to health check. |
| **Credential Storage** | Apple Hardware Keychain | Stored with `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly`. Never stored in plaintext or UserDefaults. |
| **Station Binding** | Hardware Gate Lock | Guard token is tied to `assignedGateId`. Requests outside assigned post are rejected with 403 Forbidden. |
| **Non-Repudiation** | HMAC-SHA256 Digital Seal | Every entry decision is sealed with `eventId:guardId:gateId:action:timestamp:salt`. |
| **Biometric Local Auth**| LocalAuthentication Face ID | Required when resuming terminal session after 15 minutes of background inactivity. |
| **Database Access** | PostgreSQL Row Level Security | Direct table access restricted by RLS policies; service-role keys are never embedded in the client app. |

---

### 2. High-Risk Vector Analysis & Remediations

1. **Secret Exposure in Client Binary**:
   - *Risk*: Hardcoding Supabase service-role keys or database passwords in the iOS application.
   - *Audit Status*: **PASS**. Only public `anon` key is configured in `SupabaseConfiguration`.
2. **Offline Data Tampering**:
   - *Risk*: Modifying cached verification events stored while the device is temporarily offline.
   - *Audit Status*: **PASS**. Verification events include immutable HMAC-SHA256 signatures generated at the moment of decision. The backend recomputes the HMAC digest upon synchronization.
3. **Session Hijacking on Shared Hardware Terminals**:
   - *Risk*: A guard leaves a physical gate terminal unattended.
   - *Audit Status*: **PASS**. The app auto-locks and prompts for biometric Face ID or station password.
4. **Data Privacy (DPDP / GDPR Compliance)**:
   - *Risk*: Exposing facial embeddings or unmasked government ID numbers.
   - *Audit Status*: **PASS**. Aadhaar and government ID numbers are stored masked (`idNumberMasked`); raw 128D embeddings are non-invertible vectors processed only by vector index operations.

---

### 3. Conclusion & Release Readiness

The security posture is enterprise-ready. No elevated privilege keys or unauthenticated routes were detected in the native iOS application.
