# GATEWISE AI — Repository Audit & Foundation Assessment
**Document ID:** `AUDIT-2026-11-10`  
**Evaluation Date:** 2026-11-10  
**Project:** GATEWISE AI 1.0 (Institutional Gate Verification & Visitor Identification)

---

## 1. Executive Summary

This repository audit inspects the existing workspace assets, legacy code artifacts, available Google Stitch design exports, runtime environments, and configuration before establishing the monorepo foundation.

The workspace initially contained an Android Studio Gradle template for an earlier static hero project ("NORVA"), alongside newly generated Stitch design specifications (`DESIGN.md`), early backend models, and initial web/mobile scaffolding.

---

## 2. Inventory of Existing Files & Artifacts

### 2.1. Legacy Files (To Be Replaced or Safely Archived)
* `/app/`: Legacy Android Gradle project containing boilerplate Kotlin/XML (`MainActivity.kt`, `Theme.kt`, `ic_launcher`). *Reason for replacement:* Prompt requires an Expo + React Native + TypeScript + Expo Router mobile architecture (`apps/mobile/`).
* `/build.gradle.kts`, `/settings.gradle.kts`, `/gradle/`: Native Gradle wrappers for the legacy Android app.
* `/index.html`: Static HTML single-file staffing hero page from previous prototype.
* `/metadata.json`: Initial project metadata.

### 2.2. Reusable GATEWISE AI Assets & Specifications
* `/DESIGN.md`: Comprehensive v3.0.0 master design specification defining color tokens, typography scales, 48dp touch targets, and the 7 verification states.
* `/backend/app/`: Core FastAPI modules, SQLAlchemy entities (`User`, `Gate`, `InstitutionalIdentity`, `VerificationEvent`, `VisitorPass`), and YuNet/SFace computer vision pipeline. These will be preserved and refined into clean repository and service layers.
* `/packages/design-tokens/`: Design tokens package defining colors, status codes, roles, and verification thresholds.
* `/packages/api-contracts/`: TypeScript interfaces for auth, verification requests, candidate matches, and visitor records.

---

## 3. Stitch Design System & Export Audit

**Stitch Project ID:** `8400330389051989963`  
**Stitch Title:** `GATEWISE AI — Official Product Experience`  
**Active Stitch Design System Asset:** `assets/585463057a294d3a80e1ff0dea3a8b61`

### 3.1. Available Generated Screens in Stitch
| Screen ID | Title | Device Type | Status |
|---|---|---|---|
| `screens/4c87adac2749427cb47caed27844f111` | Public Website Homepage | Desktop | Complete HTML/CSS & Screenshot |
| `screens/8950413ad9954f43bbfe085f4f65bafe` | Android APK Download & Installation Guide | Desktop | Complete HTML/CSS & Screenshot |
| `screens/9a7135b274ce48a4b2aa3b54a9b354f5` | Guard Station Secure Sign-In | Mobile | Complete HTML/CSS & Screenshot |
| `screens/b387e6f00a284404a4e5b6b61f3bb103` | Guard Camera Permission & Privacy | Desktop/Tablet | Complete HTML/CSS & Screenshot |
| `screens/3bca3fc385f8487fbf455aba54dd67cc` | Guard Home & Camera Viewfinder | Mobile | Complete HTML/CSS & Screenshot |
| `screens/25823c90e88045548f02af67848efafb` | Guard Capture Review | Desktop/Tablet | Complete HTML/CSS & Screenshot |
| `screens/4df443ecee5c4fd3bfc78f8cc911cb87` | Guard Multi-Stage Verification Processing | Desktop/Tablet | Complete HTML/CSS & Screenshot |
| `screens/81804df28fb7406cab83ca00a2933b84` | Guard State A (Verified & Authorized) | Mobile | Complete HTML/CSS & Screenshot |
| `screens/738c56e8dca84cbbbdbac724f1f62003` | Guard State B/F (Identified But Unauthorized) | Desktop/Tablet | Complete HTML/CSS & Screenshot |
| `screens/3cd851815cd146efb79613dfcbb09549` | Guard State C (Potential Match 70–89%) | Desktop/Tablet | Complete HTML/CSS & Screenshot |
| `screens/5c127302114e4dec99ae65151c9ad2a3` | Guard State D (Unknown Person & Escalation) | Mobile | Complete HTML/CSS & Screenshot |
| `screens/62bdb86903ee47869daaac43173c336e` | Guard State E (Image Quality Insufficient) | Mobile | Complete HTML/CSS & Screenshot |
| `screens/226dbe5cab274a9aa4b71182aa9fa2c8` | Guard Decision Recorded & Cryptographic Seal | Mobile | Complete HTML/CSS & Screenshot |
| `screens/8aab00212b114a52bfdfcd6396850a54` | Guard Activity History & Gate Audit Log | Mobile | Complete HTML/CSS & Screenshot |
| `screens/66c5316284444ea2aae3efcdbb8e98da` | Guard Visitor Management & Intake | Desktop/Tablet | Complete HTML/CSS & Screenshot |
| `screens/640efd0f2b8f490481681a66ff5a8c50` | Guard Station Profile & Terminal Status | Desktop/Tablet | Complete HTML/CSS & Screenshot |
| `screens/d251bb039aef45c5bac5616f355908f6` | Desktop Institutional Command Centre | Desktop | Complete HTML/CSS & Screenshot |
| `screens/a28abf48195d42ebb12cad77b94fc41d` | Desktop Identity Repository & Drive Sync | Desktop | Complete HTML/CSS & Screenshot |
| `screens/fd978ebbd22d4fdf922ec87bc6a8cad8` | Desktop Secure Administrator Login | Desktop | Complete HTML/CSS & Screenshot |

### 3.2. Identified Missing Assets & Required Specs
1. **Raw Vector Brand Iconography (.svg)**:
   - Official SVG vector glyph for GATEWISE AI institutional shield logo.
   - *Interim Action:* High-clarity SVG icon implemented based on brand design tokens (`#23865D` with `#176346` gradient).
2. **Raw 3D Campus Mesh Files (.gltf / .glb)**:
   - Three.js viewer HTML code is in Stitch (`screens/c22d4511222d4d35abaf07709dc1c231`), but raw `.glb` 3D model asset is hosted remotely.
3. **Official SFace & YuNet Binary Weights (`.onnx`)**:
   - `face_detection_yunet_2023mar.onnx` and `face_recognition_sface_2021dec.onnx` are referenced; system contains built-in OpenCV DCT frequency/geometry fallback to guarantee zero-crash execution.

---

## 4. Development Environment & Runtime Audit

| Tool | Detected Version | Status |
|---|---|---|
| **Node.js** | `v22.23.1` | Supported for Next.js & Expo |
| **pnpm** | `11.22.0` | Configured as primary monorepo package manager |
| **Python** | `3.13.5` | Supported for FastAPI & OpenCV |
| **Git** | `2.54.0` | Ready for repository checkpointing |
| **OpenCV (`cv2`)** | `5.0.0` | Pre-installed with native SFace/YuNet API |
| **Pytest** | `8.3.4` | Verified passing test suite |
| **Docker** | Not running locally | SQLite development fallback enabled |

---

## 5. Architectural Remediation & Next Steps

1. **Monorepo Structure**: Transition from flat workspaces to clean `pnpm-workspace.yaml` with:
   - `apps/mobile`: Expo + React Native + TypeScript + Expo Router
   - `apps/web`: Next.js 14/15 App Router (`(public)` and `(admin)`)
   - `backend`: FastAPI modular architecture with Alembic migrations
   - `packages/design-tokens`: Shared brand palette and geometry
   - `packages/api-contracts`: Shared TypeScript data schemas
2. **Environment & Security**:
   - Create comprehensive root `.env.example`.
   - Ensure zero secrets in Git or frontend bundles (`EXPO_PUBLIC` variables restricted to endpoints).
3. **Documentation**:
   - Deliver `SYSTEM_ARCHITECTURE.md`, `DEVELOPMENT_ROADMAP.md`, `DESIGN_IMPLEMENTATION.md`.
4. **Git Baseline**:
   - Initialize Git and commit baseline checkpoint.
