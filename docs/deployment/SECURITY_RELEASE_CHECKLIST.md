# GATEWISE AI — Security Release Checklist
**Classification:** Application Security, Cryptography & Privacy Verification  
**Applies To:** Release Candidate v1.0.0

---

## 1. Authentication & Session Security
- [x] **Password Hashing:** Passwords hashed with RFC 9106 Argon2id (`memory_cost=65536`, `time_cost=3`, `parallelism=4`).
- [x] **Timing-Safe Validation:** Password and signature comparisons utilize `hmac.compare_digest` to prevent timing side-channel attacks.
- [x] **JWT Expiration:** Access tokens expire after 8 hours (standard guard shift); refresh tokens expire after 7 days.
- [x] **Mobile Credential Storage:** Mobile access tokens stored strictly in hardware-backed `expo-secure-store` (KeyStore on Android / Keychain on iOS).
- [x] **Web Cookie Protection:** Session cookies flagged with `HttpOnly`, `SameSite=Strict`, and `Secure` attributes.
- [x] **Account State Enforcement:** Deactivated or suspended accounts are immediately rejected with HTTP 403 upon token inspection.

---

## 2. Authorization & Role Separation (RBAC)
- [x] **Authoritative Gate Post Resolution:** Guard cannot submit or alter client-side gate IDs; backend strictly resolves active gate assignment from database.
- [x] **Default-Deny Role Enforcement:** Unauthenticated or unauthorized role requests abort immediately with HTTP 401/403.
- [x] **Self-Approval Prevention:** Guards cannot approve their own field referrals or elevate user privileges.
- [x] **Zero Raw Biometric Exposure in UI:** Administrators and guards never receive raw 128-D embedding vectors or raw video feeds in web/mobile views.

---

## 3. Cryptographic Non-Repudiation & Audit Integrity
- [x] **HMAC-SHA256 Event Sealing:** Every sovereign guard physical entry decision is sealed with a 32+ character HMAC-SHA256 signature calculated over timestamp, guard ID, gate ID, outcome, and subject identity.
- [x] **Tamper Detection:** Verification events detect any unauthorized modification through signature re-computation.
- [x] **Audit Log Persistence:** All sensitive operations (authentication, gate assignment, referral review, repository sync, tool calls) write immutable records to the `audit_logs` table.

---

## 4. Biometric Data Privacy & Pipeline Quarantining
- [x] **Single-Shot Still Capture Only:** Continuous live video streaming is architecturally prohibited; only user-initiated still frames are processed.
- [x] **Immediate Memory Decompression:** Captured images are processed in-memory and discarded; raw camera captures are never permanently retained.
- [x] **Zero Biometrics to External LLM:** The Gemini AI assistant interface is strictly scrubbed: zero photographs, embeddings, or personally identifiable strings are transmitted to the Gemini API.

---

## 5. Network, Ingress & Infrastructure Defenses
- [x] **TLS 1.3 Termination:** Edge reverse proxy mandates modern TLS with automated certificate renewal.
- [x] **HSTS:** `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` header active.
- [x] **MIME Sniffing & Framing Defenses:** `X-Content-Type-Options: nosniff` and `X-Frame-Options: DENY` (or `SAMEORIGIN`) active on all responses.
- [x] **Referrer & Permissions Policies:** `Referrer-Policy: strict-origin-when-cross-origin` and restrictive `Permissions-Policy` active.
- [x] **Rate Limiting:** Sliding-window rate limiter stops brute-force authentication and API quota exhaustion (30 req/min).
- [x] **Database Isolation:** PostgreSQL port 5432 is strictly bound to internal container network (`gatewise-internal`) and unexposed on public internet.
- [x] **Secret Scanning:** `scripts/security_secret_scan.py` confirmed 0 secrets in working tree and recent Git history.
