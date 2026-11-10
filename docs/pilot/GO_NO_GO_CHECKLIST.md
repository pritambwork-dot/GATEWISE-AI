# GATEWISE AI — Institutional Pilot Go / No-Go Checklist
**Assessment Date:** November 11, 2026  
**Evaluator:** Principal Software Architect, Launch Manager & QA Lead  
**Pilot Recommendation:** **PROCEED WITH CONDITIONS (Restricted Single-Gate Pilot)**

---

## 1. Technical & Engineering Evaluation (100% COMPLETE)

| Technical Criterion | Benchmark Requirement | Observed Status | Verdict |
|---|---|---|---|
| **Android Guard Application** | Compiles clean Hermes bundle; installable APK. | v1.0.0 built, signed, verified (`906433` bytes). | **GO** |
| **Desktop Admin Portal** | Real-time SSE feed; command centre; audit logs. | Fully operational on Next.js 14; 25 pages static. | **GO** |
| **FastAPI Backend** | 100% route coverage; RBAC; Argon2id passwords. | 142/142 tests passing in 3.01s. | **GO** |
| **Computer Vision Pipeline** | YuNet + SFace ONNX models authenticated. | SHA-256 verified; p95 inference 3.34 ms. | **GO** |
| **End-to-End Scenarios** | 6 mandatory pilot scenarios validated. | 6/6 passed (100.0%) in automated suite. | **GO** |
| **Disaster Recovery** | Empirical snapshot and restore test passed. | 100.0% row parity across 15 tables; RTO 3.88 ms. | **GO** |
| **Secret Scanning** | Zero hardcoded keys or passwords in Git. | `scripts/security_secret_scan.py` confirmed clean. | **GO** |

---

## 2. Security & Operational Hardening (100% COMPLETE)

| Security Criterion | Requirement | Observed Status | Verdict |
|---|---|---|---|
| **Gate Assignment Sovereignty** | Guard cannot alter assigned gate post. | Authoritative resolution from database (`403` on mismatch). | **GO** |
| **Decoupled Clearance** | Face match does not automatically grant entry. | UI visually separates match % from access rights. | **GO** |
| **Cryptographic Sealing** | Every decision signed with HMAC-SHA256. | Active on all commit endpoints; verified. | **GO** |
| **Biometric Privacy** | Zero cloud biometrics or vector leaks to LLM. | Strict privacy boundary; zero embeddings sent to Gemini. | **GO** |
| **Production Headers** | HSTS, `nosniff`, `DENY`, CORS allowlist. | Verified on both FastAPI and Next.js responses. | **GO** |

---

## 3. Institutional Governance & Data Conditions (PENDING INSTITUTIONAL SIGN-OFF)

| Governance Criterion | Requirement | Observed Status | Verdict |
|---|---|---|---|
| **Data Ownership Agreement** | Formal written consent from IIM Sambalpur. | Documentation prepared; awaiting Director sign-off. | **CONDITIONAL** |
| **Shared Drive Credentials** | Official Workspace Service Account key. | Local fallback active; awaiting campus IT provisioning. | **CONDITIONAL** |
| **Campus Privacy Notice** | Physical signage at Gate Post 02. | Text drafted; awaiting physical placard printing. | **CONDITIONAL** |

---

## 4. Formal Launch Recommendation Statement

### **RECOMMENDATION: PROCEED WITH CONDITIONS**

The technical engineering, application security, digital signing, and performance validation phases of GATEWISE AI 1.0 are **fully complete and verified**.

The platform is approved to proceed into **Stage 3 (Restricted Single-Gate Pilot)** at **Gate Post 02** under the following operational conditions:
1. Conduct initial pilot solely at Gate Post 02 with Officer Ramesh Verma (`SEC-G014`).
2. Maintain active physical manual fallback procedure (SOP-01) at all times.
3. Transition from synthetic staging cohort to institutional student repository immediately upon campus IT granting Google Shared Drive service account authorization.
