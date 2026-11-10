# GATEWISE AI 1.0 — Development Roadmap & Implementation Phasing
**Document ID:** `ROADMAP-2026-11-10`  
**Current Phase:** Phase 1 (Engineering Foundation & Scaffolding Complete)

---

## 1. Project Phasing & Milestone Matrix

```
[Phase 1: Foundation] ────► [Phase 2: Vision Pipeline] ────► [Phase 3: Real-Time Admin] ────► [Phase 4: Field Testing]
     (COMPLETE)                    (PLANNED)                       (PLANNED)                     (PILOT STAGE)
├── Clean Monorepo            ├── ONNX YuNet / SFace         ├── SSE Event Inflow            ├── Hardware Mounts
├── Expo Router Mobile App    ├── Cosine Vector Matching     ├── Drive Sync Background Job   ├── Post 02 Deployment
├── Next.js App Router Web    ├── Motion Blur / Glare QA     ├── Registrar Referral Queue    ├── Guard Training
└── Modular FastAPI Core      └── Local SQLite Cache         └── Forensic Audit Inspector    └── Sign-off
```

---

## 2. Phase 1: Engineering Foundation & Monorepo (Completed)

| Work Item | Target Subsystem | Status | Verification Criteria |
|---|---|---|---|
| **Repository Audit** | Root / Docs | **DONE** | Complete audit catalog in `docs/architecture/REPOSITORY_AUDIT.md` |
| **Monorepo Setup** | Monorepo Root | **DONE** | Configured `pnpm-workspace.yaml` with clean JS/TS/Python boundaries |
| **Android Scaffolding** | `apps/mobile/` | **DONE** | Expo SDK 51, TypeScript, Expo Router routes, `app.json` permissions |
| **Next.js Scaffolding** | `apps/web/` | **DONE** | Next.js 14 App Router, separate `(public)` and `(admin)` route groups |
| **Modular FastAPI Core** | `backend/` | **DONE** | Repositories, services, models, HMAC-SHA256 tokens, Alembic migrations |
| **Shared Design Tokens** | `packages/design-tokens` | **DONE** | Colors, typography, spacing, border radii, shadows, motion, elevation |
| **API Contracts** | `packages/api-contracts` | **DONE** | TypeScript data schemas for auth, verification, visitor passes |
| **Local Dev Infrastructure**| Root / Scripts | **DONE** | `docker-compose.yml`, `scripts/dev.sh`, `scripts/migrate.sh`, `scripts/test.sh` |
| **Automated Testing** | `backend/tests/` | **DONE** | 8 automated Pytest tests passing 100% |

---

## 3. Phase 2: Computer Vision & Edge Processing (Next Phase)

* **Tasks**:
  * Integrate calibrated ONNX models for YuNet face detection and SFace feature extraction.
  * Fine-tune adaptive Laplacian motion-blur thresholds and daylight exposure filters.
  * Implement offline SQLite synchronization engine on the Android terminal.
  * Connect camera preview with physical autofocus, exposure locking, and tactile shutter.
* **Dependencies**:
  * Final camera hardware specification for Samsung Galaxy Tab A9 / Pixel Tablet.
* **Known Blockers**:
  * None. Resilient mathematical DCT/geometry fallback active for local testing.

---

## 4. Phase 3: Administrative Control & Drive Sync (Subsequent Phase)

* **Tasks**:
  * Implement Google Workspace Service Account background sync for approved Drive folders.
  * Complete full UI for Registrar Referral Queue (reviewing walk-in scholar photo submissions).
  * Build real-time analytics aggregation for hourly campus inflow trends.
  * Implement CSV and cryptographic audit certificate export in the Command Centre.
* **Dependencies**:
  * Google Cloud project service account credentials with read-only Drive API scopes.

---

## 5. Phase 4: Production Gate Pilot & Hardening

* **Tasks**:
  * Field pilot deployment at IIM Sambalpur Main Campus Gate (Post 02).
  * 8-hour guard shift endurance tests with LTE connectivity.
  * Security audit verifying zero biometric leakage to cloud LLMs or third-party APIs.
  * Delivery of signed production APK with institutional keystore.
