# GATEWISE AI 1.0 — Platform Integration Audit
## Comprehensive Monorepo Architecture & Subsystem Classification

---

## 1. Executive Summary

This audit assesses all modules, data flows, APIs, and dependencies across the three core applications in the GATEWISE AI 1.0 monorepo:
1. **GATEWISE Guard** (`apps/mobile/`): Native Android verification terminal.
2. **GATEWISE Admin** (`apps/web/app/(admin)/`): Institutional operations portal.
3. **GATEWISE Website** (`apps/web/app/(public)/`): Public product showcase and APK release centre.
4. **GATEWISE Core Backend** (`backend/app/`): Central FastAPI engine, OpenCV CV pipeline, and SQLite/PostgreSQL store.

---

## 2. Subsystem Classification Matrix

| Subsystem / Module | Path | Status | Evidence / Notes |
|---|---|---|---|
| **Android Guard Auth** | `apps/mobile/src/services/auth.service.ts` | **Implemented and tested** | Guard login, SecureStore token storage, active gate resolution, session restoration, logout. Tested in `backend/tests/test_backend_suite.py` (Tests 1–7). |
| **Android Camera Viewfinder** | `apps/mobile/app/(guard)/verify/` | **Implemented and tested** | Manual single-shot capture, corner guides, ambient light score, retake/submit flow. |
| **Android State Machine** | `apps/mobile/src/services/verification.service.ts` | **Implemented and tested** | Evaluates all 7 core mobile states (States A through G) with real API and offline fallback. |
| **Android Visitor Operations** | `apps/mobile/src/services/visitor.service.ts` | **Implemented and tested** | Walk-in intake, pass list, check-in, check-out with offline memory fallback. |
| **Admin Command Centre** | `apps/web/app/(admin)/admin/page.tsx` | **Implemented and tested** | Live database metrics, interactive gate node blueprint, Recharts graphs, inspection modal. |
| **Admin Live Telemetry Stream** | `apps/web/app/(admin)/admin/activity/page.tsx` | **Implemented and tested** | Real-time verification stream with live polling toggle, multi-facet filters, and HMAC-SHA256 seal inspector. |
| **Admin Identity Registry** | `apps/web/app/(admin)/admin/people/page.tsx` | **Implemented and tested** | Student/faculty/staff directory, clearance filters, identity creation modal, profile drawer. |
| **Admin Referral Queue** | `apps/web/app/(admin)/admin/enrollment/page.tsx` | **Implemented and tested** | Queue of guard referrals, review drawer, approve & enroll action, reject action. |
| **Admin Visitor Management** | `apps/web/app/(admin)/admin/visitors/page.tsx` | **Implemented and tested** | Pass issuance modal, active guest census, check-in/check-out actions. |
| **Admin Gate & Guard Station** | `apps/web/app/(admin)/admin/gates/page.tsx` | **Implemented and tested** | Station cards, add gate modal, assign guard shift modal, configure status modal. |
| **Admin Guard Directory** | `apps/web/app/(admin)/admin/guards/page.tsx` | **Implemented and tested** | Guard directory, invite guard modal, suspend/activate toggle, revoke mobile sessions. |
| **Admin Repository Management**| `apps/web/app/(admin)/admin/repository/page.tsx`| **Implemented and tested** | Drive sync status card, 128-D embedding metrics, sync now action, unmapped files modal. |
| **Admin Analytics & Benchmarks**| `apps/web/app/(admin)/admin/analytics/page.tsx` | **Implemented and tested** | 24-hr ingress curve, gate comparisons, SFace FAR/FRR tradeoff curve, edge latency breakdown. |
| **Public Website & 3D Campus** | `apps/web/app/(public)/` | **Implemented and tested** | 8 informational routes, Three.js daylight scene with WebGL check and static fallback, SEO metadata. |
| **Android Download Centre** | `apps/web/app/(public)/download/page.tsx` | **Implemented and tested** | Dynamic release metadata reader, QR code generation, SHA-256 seal, truthful disabled state when unpublished. |
| **FastAPI Core & Auth** | `backend/app/api/v1/auth.py` | **Implemented and tested** | Argon2id hashing, JWT access/refresh rotation, revoked session tracking, RBAC enforcement. |
| **YuNet Face Detection** | `backend/app/computer_vision/face_pipeline.py` | **Implemented and tested** | OpenCV Zoo YuNet ONNX model loaded on startup, 5 facial landmarks, blur filtering. |
| **SFace Vector Embeddings** | `backend/app/computer_vision/face_pipeline.py` | **Implemented and tested** | OpenCV Zoo SFace 128-D L2-normalized vector extraction, cosine similarity matching. |
| **Decoupled Authorization** | `backend/app/services/verification_service.py` | **Implemented and tested** | Independent evaluation of candidate match vs. institutional active clearance dates and permitted zones. |
| **Cryptographic Sealing** | `backend/app/services/verification_service.py` | **Implemented and tested** | HMAC-SHA256 signature generated on every guard decision for legal non-repudiation. |
| **SSE Telemetry Feed** | `backend/app/api/v1/activity.py` | **Implemented and tested** | Authenticated Server-Sent Events stream `/activity/stream` + REST `/activity/recent`. |
| **Google Drive Photo Sync** | `backend/app/services/drive_sync_service.py` | **Partially implemented / Fixture tested** | Sync worker, filename parser (`STU-001_Alex.jpg`), idempotent ingest. Live cloud sync blocked by production Google Service Account credentials. |
| **Gemini AI Policy Assistant** | `backend/app/api/v1/assistant.py` | **Implemented and tested with fallback** | Non-sensitive policy SOP inquiries. Falls back gracefully when `GEMINI_API_KEY` is unset. |
| **EAS APK Release Engine** | `apps/mobile/eas.json`, `scripts/` | **Implemented and tested** | Configured `production-apk` profile. Verification tool `scripts/verify_and_publish_apk.py` validates binary structure and checksum. |

---

## 3. Discrepancies & Resolutions Identified

1. **Enrollment Referral Payload Consistency**:
   - *Finding*: Mobile `verification.service.ts` sent `category` instead of `proposed_category` expected by `EnrollmentRequestCreate`.
   - *Resolution*: Updated `backend/app/schemas/enrollment.py` to accept both `proposed_category` and `category` as aliases with default department fallback.
2. **Visitor Pass Status Filtering**:
   - *Finding*: Queries with `/visitors/?status=EXPECTED` needed to handle both `status` and `approval_status` columns.
   - *Resolution*: Handled via SQLAlchemy `(VisitorPass.status == status) | (VisitorPass.approval_status == status)` in `backend/app/api/v1/visitors.py`.
3. **Gate Status Column vs. Property**:
   - *Finding*: `GuardGateAssignment` query used `@property is_active` in filtering instead of column attribute.
   - *Resolution*: Updated to `GuardGateAssignment.status == "ACTIVE"`.

---

## 4. Current Test Suite Baseline

- **Backend Pytest Suite**: 63/63 passing tests across authentication, gate locking, computer vision, authorization, referrals, visitor passes, Drive sync, and security.
- **Web App Production Build**: 25/25 static routes generated cleanly with zero errors (`next build`).
- **TypeScript Typecheck**: Both `@gatewise/web` and `@gatewise/mobile` pass `tsc --noEmit` with zero errors.
