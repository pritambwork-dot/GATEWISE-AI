# GATEWISE AI — Backend Architecture & Implementation Plan
**Document Version:** 1.0.0  
**Target Milestone:** Master Prompt 04 — Core Backend, Auth, DB, Drive Sync & Biometric Engine  
**Author:** Principal Software Architect & Application Security Engineer  
**Institution:** Indian Institute of Management Sambalpur (IIM-S)  

---

## 1. Executive Summary & Objective

This document defines the comprehensive architecture and implementation blueprint for the centralized **GATEWISE AI Backend**.

The backend serves as the single authoritative source of truth for:
1. **Institutional Identity & Credential Management**: Secure storage of verified identities (Students, Faculty, Staff, Contractors) and access authorizations.
2. **Biometric Face Verification Engine**: Dual-stage OpenCV Zoo YuNet detection and SFace feature extraction pipeline with configurable quality assessment and cosine similarity matching.
3. **Mandatory Gate Assignment Enforcement**: Server-side resolution of a guard's active station (`Main Campus Gate · Post 02`) with default-deny verification validation.
4. **Institutional Google Drive Synchronization**: Idempotent synchronization of reference photographs and metadata from the approved IIM Sambalpur cloud directory.
5. **Human Guard Sovereignty & Cryptographic Audit**: Separation of AI candidate matching from human gate decisions, with HMAC-SHA256 digital seals on all events.
6. **Visitor Lifecycle Management & Enrollment Referrals**: Digital intake, pre-approved passes, check-in/out, and guard-initiated enrollment referrals for Registrar approval.

---

## 2. System Architecture & Component Topology

```
+-----------------------------------------------------------------------------------+
|                            GATEWISE AI SYSTEM TOPOLOGY                            |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|   +-----------------------+              +------------------------------------+   |
|   |  Android Guard App    |              |  Central Command Centre (Web)      |   |
|   |  (React Native/Expo)  |              |  (Next.js Desktop Admin Portal)    |   |
|   +-----------+-----------+              +-----------------+------------------+   |
|               |                                            |                      |
|               | HTTPS REST API                             | HTTPS / SSE Feed     |
|               +--------------------+   +-------------------+                      |
|                                    |   |                                          |
|                                    v   v                                          |
|                     +------------------------------+                              |
|                     |     FastAPI Core Gateway     |                              |
|                     |   (Uvicorn / Python 3.13)    |                              |
|                     +--------------+---------------+                              |
|                                    |                                              |
|         +--------------------------+-------------------------+                    |
|         |                          |                         |                    |
|         v                          v                         v                    |
|  +---------------+       +--------------------+      +--------------------+       |
|  | Auth & RBAC   |       | Face CV Pipeline   |      | Google Drive Sync  |       |
|  | - Argon2id    |       | - YuNet (Detect)   |      | - Manifest Mapping |       |
|  | - JWT + DB    |       | - Blur / Exposure  |      | - Idempotent Sync  |       |
|  |   Sessions    |       | - SFace (128-d)    |      | - SHA-256 Hashes   |       |
|  | - Gate Guard  |       | - Cosine Similarity|      | - Change Tracking  |       |
|  |   Assignment  |       | - Isolated Thread  |      +--------------------+       |
|  +-------+-------+       +---------+----------+                                   |
|          |                         |                                              |
|          +-------------------------+                                              |
|                                    |                                              |
|                                    v                                              |
|                  +-----------------------------------+                            |
|                  |     SQLAlchemy 2.x ORM Layer      |                            |
|                  +-----------------+-----------------+                            |
|                                    |                                              |
|                                    v                                              |
|                  +-----------------------------------+                            |
|                  | PostgreSQL / SQLite + pgvector    |                            |
|                  | - 13 Core Relational Entities     |                            |
|                  | - 128-dim Normalized Embeddings   |                            |
|                  | - Immutable Audit Log Ledger      |                            |
|                  +-----------------------------------+                            |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## 3. Database Entity Model (13 Core Entities)

The database schema is managed via SQLAlchemy 2.x and Alembic migrations:

1. **`users`**:
   - `id` (UUID PK), `email` (unique index), `password_hash` (Argon2id), `full_name`, `employee_id` (unique index), `role` (`SUPER_ADMIN`, `ADMIN`, `SECURITY_GUARD`), `account_status` (`ACTIVE`, `SUSPENDED`, `DEACTIVATED`), `mfa_enabled` (bool), `created_at`, `updated_at`.
2. **`gates`**:
   - `id` (UUID PK), `gate_code` (unique, e.g. `GATE-MAIN-02`), `gate_name` (`Main Campus Gate · Post 02`), `location`, `status` (`ACTIVE`, `MAINTENANCE`, `OFFLINE`), `created_at`.
3. **`guard_gate_assignments`**:
   - `id` (UUID PK), `guard_id` (FK `users.id`), `gate_id` (FK `gates.id`), `assigned_by` (FK `users.id`), `assigned_at`, `effective_from`, `effective_until`, `status` (`ACTIVE`, `EXPIRED`, `REVOKED`), `shift_name`.
4. **`institutional_identities`**:
   - `id` (UUID PK), `institutional_id` (unique, e.g. `STU-2024-0492`), `full_name`, `category` (`Student`, `Faculty`, `Staff`, `Visiting Faculty`, `Researcher`, `Contractor`), `department`, `designation`, `identity_status` (`ACTIVE`, `GRADUATED`, `SUSPENDED`), `created_at`, `updated_at`.
5. **`identity_reference_photos`**:
   - `id` (UUID PK), `identity_id` (FK `institutional_identities.id`), `drive_file_id`, `drive_folder_id`, `file_checksum` (SHA-256), `source` (`GOOGLE_DRIVE`, `ADMIN_MANUAL`), `review_status` (`APPROVED`, `PENDING_REVIEW`, `REJECTED`), `approved_by` (FK `users.id`), `approved_at`, `sync_status` (`SYNCED`, `PENDING`, `DEACTIVATED`), `created_at`.
6. **`face_embeddings`**:
   - `id` (UUID PK), `identity_id` (FK `institutional_identities.id`), `reference_photo_id` (FK `identity_reference_photos.id`), `embedding_vector` (128-dim normalized vector, pgvector / JSON for dev), `model_name` (`SFace`), `model_version` (`2021dec`), `embedding_dimension` (128), `normalization_method` (`L2`), `status` (`ACTIVE`, `DEPRECATED`), `created_at`.
7. **`access_authorizations`**:
   - `id` (UUID PK), `identity_id` (FK `institutional_identities.id`), `access_status` (`AUTHORIZED`, `EXPIRED`, `REVOKED`, `SUSPENDED`), `valid_from`, `valid_until`, `permitted_zones` (JSON array of gate IDs or `["ALL"]`), `restrictions` (text reason if revoked/expired), `created_by` (FK `users.id`), `updated_at`.
8. **`visitors` / `visitor_passes`**:
   - `id` (UUID PK), `pass_code` (unique, e.g. `PASS-8921`), `visitor_name`, `contact_details` (phone, email), `host_name`, `host_identity_id` (optional FK), `host_department`, `visit_purpose`, `id_type`, `id_number`, `appointment_start`, `appointment_end`, `approval_status` (`EXPECTED`, `CHECKED_IN`, `CHECKED_OUT`, `EXPIRED`, `REJECTED`), `check_in_at`, `check_out_at`, `created_by` (FK `users.id`), `gate_id` (FK `gates.id`).
9. **`enrollment_requests`**:
   - `id` (UUID PK), `submitted_by_guard_id` (FK `users.id`), `assigned_gate_id` (FK `gates.id`), `visitor_or_person_name`, `institutional_id` (optional), `department`, `reason_for_review`, `captured_image_hash`, `request_status` (`PENDING`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`), `admin_notes`, `reviewed_by` (FK `users.id`), `reviewed_at`, `created_at`.
10. **`verification_events`**:
    - `id` (UUID PK, e.g. `EVT-20261110-XXXX`), `guard_id` (FK `users.id`), `gate_id` (FK `gates.id`), `verification_timestamp`, `identity_match_status` (`VERIFIED_AUTHORIZED`, `IDENTIFIED_UNAUTHORIZED`, `POTENTIAL_MATCH`, `UNKNOWN_PERSON`, `IMAGE_QUALITY_INSUFFICIENT`, `SERVICE_UNAVAILABLE`), `authorization_status` (`AUTHORIZED`, `UNAUTHORIZED`, `EXPIRED`), `candidate_identity_id` (optional FK), `similarity_score` (float), `processing_status` (`COMPLETED`, `FAILED`), `final_decision_status` (`PENDING`, `GRANT_ENTRY`, `DENY_ENTRY`, `ESCALATE_TO_ADMIN`, `REFER_TO_VISITOR_DESK`), `decision_recorded_at`, `cryptographic_signature` (HMAC-SHA256).
11. **`guard_decisions`**:
    - `id` (UUID PK), `verification_event_id` (FK `verification_events.id`, unique), `guard_id` (FK `users.id`), `decision` (`GRANT_ENTRY`, `DENY_ENTRY`, `ESCALATE_TO_ADMIN`, `REFER_TO_VISITOR_DESK`), `decision_reason` (text), `recorded_at`.
12. **`audit_logs`**:
    - `id` (UUID PK), `actor_id` (FK `users.id`), `action` (string, e.g. `AUTH_LOGIN`, `GUARD_DECISION_COMMIT`, `DRIVE_SYNC_TRIGGER`, `GATE_ASSIGNMENT_UPDATE`), `resource_type`, `resource_id`, `timestamp`, `result` (`SUCCESS`, `FAILURE`), `relevant_request_id`, `details` (JSON without credentials or raw biometrics).
13. **`drive_sync_jobs`**:
    - `id` (UUID PK), `folder_id`, `job_type` (`INITIAL`, `INCREMENTAL`, `MANUAL`), `job_status` (`RUNNING`, `COMPLETED`, `FAILED`), `started_at`, `completed_at`, `files_processed`, `files_rejected`, `last_error`, `page_token`.

---

## 4. Authentication, Sessions & Role-Based Access Control (RBAC)

### Password Hashing
- Algorithm: **Argon2id** (`m=65536, t=3, p=4`) via `passlib[argon2]`.
- Plaintext passwords and legacy hashes are prohibited.

### Token & Session Lifecycle
- **Access Tokens**: Short-lived (30 minutes in production, 8 hours in shift mode), signed with HMAC-SHA256 (`HS256`).
- **Refresh Tokens**: Rotating, stored as SHA-256 hashes in `user_sessions` with 7-day expiration and instant server-side revocation on logout.
- **Default-Deny Authorization**: Every route applies a dependency `require_roles([GatewiseRole.SECURITY_GUARD])` or `require_roles([GatewiseRole.ADMIN, GatewiseRole.SUPER_ADMIN])`.

### Role Permissions Matrix

| Permission | SUPER ADMIN | ADMIN | SECURITY GUARD |
| :--- | :---: | :---: | :---: |
| Authenticate to Android Post App | Yes | Yes | Yes |
| Access Assigned Gate Verification | Yes | Yes | Yes (Assigned Gate Only) |
| Submit Live Capture for Match | Yes | Yes | Yes (Assigned Gate Only) |
| Commit Sovereign Guard Decision | Yes | Yes | Yes |
| Submit Enrollment Referral | Yes | Yes | Yes |
| Check-in / Out Visitor Pass | Yes | Yes | Yes |
| Create Walk-In Visitor Pass | Yes | Yes | Yes |
| Create Permanent Institutional Identity | Yes | Yes | **DENIED** |
| Approve / Reject Enrollment Referral | Yes | Yes | **DENIED** |
| Assign Guard to Gate Post | Yes | Yes | **DENIED** |
| Change Biometric Matching Thresholds | Yes | **DENIED** | **DENIED** |
| Connect / Synchronize Google Drive | Yes | Yes | **DENIED** |
| View Restricted Security Audit Logs | Yes | **DENIED** | **DENIED** |

---

## 5. Mandatory Gate Assignment Enforcement

1. **Server-Side Gate Resolution**:
   - `POST /api/v1/verification/verify` and `POST /api/v1/verification/capture` **never** trust the `gate_id` sent in the request body.
   - The dependency `get_active_guard_gate(current_user, db)` queries `guard_gate_assignments` for an active assignment where `guard_id == current_user.id` and `status == 'ACTIVE'`.
   - If no active assignment exists, the backend immediately rejects the request with HTTP 403 Forbidden: `"Guard has no active gate post assignment. Contact Post Commander."`
   - If the client attempts to pass a different gate ID, the backend enforces the guard's assigned gate ID and logs an audit security alert.
2. **Assignment Audit History**:
   - Every assignment change is committed to `guard_gate_assignments` with `assigned_by`, `assigned_at`, `effective_from`, and `effective_until`.

---

## 6. Google Drive Reference Repository & Sync Engine

1. **Institutional Folder Structure**:
   - Root Folder: `IIM_Sambalpur_Approved_Identities_2024_2026`
   - Manifest mapping supports:
     - `manifest.json` / `manifest.csv` containing `{ institutional_id, full_name, category, department, filename, checksum }`.
     - Standardized verified filename convention: `{CATEGORY}_{INSTITUTIONAL_ID}_{FULL_NAME}.jpg`.
2. **Sync Pipeline**:
   - Step 1: Validate service credentials / OAuth token and test folder connectivity.
   - Step 2: Enumerate files with pagination support.
   - Step 3: Compute SHA-256 checksums to avoid re-processing identical files.
   - Step 4: Validate single detectable face via YuNet.
   - Step 5: Extract 128-dimensional L2-normalized embedding via SFace.
   - Step 6: Create or update `institutional_identities`, `identity_reference_photos`, and `face_embeddings`.
   - Step 7: Record audit log and `drive_sync_jobs` completion statistics.
3. **Idempotence & Deletion**:
   - Photos trashed or removed from Drive automatically deactivate corresponding embeddings (`status = 'DEPRECATED'`) without deleting historical verification events.

---

## 7. Computer Vision Pipeline (OpenCV Zoo YuNet + SFace)

### Model Provenance & Verification
- **YuNet**: `face_detection_yunet_2023mar.onnx`
  - Source: OpenCV Zoo official media release (`media.githubusercontent.com`)
  - Expected Checksum: `8f2383e4dd3cfbb4553ea8718107fc0423210dc964f9f4280604804ed2552fa4`
  - Output: Bounding box, confidence score, 5 facial landmarks (right eye, left eye, nose tip, right mouth corner, left mouth corner).
- **SFace**: `face_recognition_sface_2021dec.onnx`
  - Source: OpenCV Zoo official media release (`media.githubusercontent.com`)
  - Expected Checksum: `0ba9fbfa01b5270c96627c4ef784da859931e02f04419c829e83484087c34e79`
  - Output: 128-dimensional float32 feature embedding vector, normalized via L2 norm.

### Pipeline Stages
1. **Stage 1 — Image Validation**:
   - Payload limit: 8MB max. Format: JPEG, PNG, WEBP.
   - Validates decompression integrity, non-zero dimensions, and color channels.
2. **Stage 2 — Face Detection (YuNet)**:
   - Configured with `(320, 320)` input scale, score threshold 0.60, NMS threshold 0.30.
   - Strict rule: **Exactly one face required**. If zero faces are found, returns `NO_FACE_DETECTED`. If multiple faces are detected, returns `MULTIPLE_FACES_DETECTED` (requires single subject recapture).
3. **Stage 3 — Quality Assessment**:
   - Blur metric: Laplacian variance ($\sigma^2 \ge 60.0$).
   - Brightness: Mean grayscale intensity in range $[40.0, 235.0]$.
   - Face size: Bounding box area must occupy $\ge 12\%$ of total frame area.
   - Structured quality response with diagnostic feedback. If quality fails, triggers `IMAGE_QUALITY_INSUFFICIENT` without false unknown categorization.
4. **Stage 4 — Face Alignment**:
   - Aligns face crop using the 5 YuNet facial landmarks via `FaceRecognizerSF.alignCrop`.
5. **Stage 5 — Embedding Generation (SFace)**:
   - Extracts 128-dim vector via `FaceRecognizerSF.feature`.
   - L2 normalized so that cosine similarity equals dot product.
6. **Stage 6 — Identity Matching**:
   - Exact nearest neighbor cosine similarity across active `face_embeddings`.
   - Thresholds:
     - $\ge 0.90$: Auto-match candidate.
     - $0.70 - 0.899$: Potential match requiring physical ID inspection.
     - $< 0.70$: Unknown person.

---

## 8. Sovereign Human Decision & Verification API

- **Decoupled Architecture**: Biometric matching and gate decisions are strictly isolated.
- **Endpoints**:
  - `POST /api/v1/verification/verify`: Accepts image, runs CV pipeline, queries identity & authorization, creates `verification_events` record with status `awaiting_guard`.
  - `POST /api/v1/verification/{event_id}/decision`: Accepts `action` (`GRANT_ENTRY`, `DENY_ENTRY`, `ESCALATE_TO_ADMIN`, `REFER_TO_VISITOR_DESK`), optional override notes. Validates guard assignment and commits immutable HMAC-SHA256 signature.
  - `GET /api/v1/verification/{event_id}`: Retrieves full audit details.

---

## 9. Implementation Milestones

- **Milestone 1**: Enhanced SQLAlchemy models & Alembic migration for all 13 entities.
- **Milestone 2**: Argon2id password security, rotating refresh tokens, session revocation, and default-deny RBAC.
- **Milestone 3**: Gate assignment enforcement service.
- **Milestone 4**: YuNet + SFace OpenCV Zoo model downloader, checksum verifier, and computer vision pipeline.
- **Milestone 5**: Google Drive sync service with manifest mapping and change tracking.
- **Milestone 6**: Verification capture & sovereign guard decision endpoints.
- **Milestone 7**: Enrollment referrals & Visitor pass management endpoints.
- **Milestone 8**: Real-time activity SSE streaming & optional Gemini operational assistant.
- **Milestone 9**: Comprehensive automated test suite (44 test cases) and Android verification.
