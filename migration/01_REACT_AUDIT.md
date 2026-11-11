# MIGRATION AUDIT 01: REACT & NEXT.JS SOURCE AUDIT
## Comprehensive Source Architecture, Routing, State, & Dependency Inventory

**Audited By:** AGENT 01 — Product Reverse Engineering Agent  
**Source Locations:** `apps/web` (Next.js 14 App Router) & `apps/mobile` (React Native / Expo 51)  
**Target Platform:** Native iOS 26 (SwiftUI / Swift 6 / Clean Architecture)  
**Date:** 2026-11-11  

---

### 1. Framework & Runtime Versions

| Environment | Version | Key Libraries |
|---|---|---|
| **Web Application (`apps/web`)** | Next.js 14.2.3, React 18.2.0 | Tailwind CSS 3.4, Lucide Icons, Three.js (`Campus3DView`), Next Auth / JWT |
| **Mobile Application (`apps/mobile`)** | React Native 0.74.2, Expo SDK 51 | Expo Camera, Expo Router 3.5, Expo SecureStore, React Native Reanimated 3 |
| **Shared Monorepo Packages** | pnpm 9.x workspace | `@gatewise/design-tokens` (1.0.0), `@gatewise/api-contracts` (1.0.0) |
| **Backend Service** | FastAPI 0.111.0, Python 3.13 | PostgreSQL 16, pgvector, SQLAlchemy 2.0 async, PyJWT, Crypto HMAC-SHA256 |

---

### 2. Route & Screen Breakdown

#### 2.1 Next.js 14 Web Portal (`apps/web/app/`)
- **Public Facing Domain (`(public)`)**:
  - `/` (Home landing page, Institutional trust header, real-time KPI overview)
  - `/features` (Biometric AI engine, YuNet + SFace pipeline explanations)
  - `/how-it-works` (7-step verification workflow breakdown)
  - `/product` (Hardware turnstile & gate station specifications)
  - `/security` (Zero-Trust, offline buffer, non-repudiation digital seal architecture)
  - `/installation` (Campus deployment topology and edge agent setup)
  - `/faq` (Institutional FAQs on GDPR, DPDP compliance, student privacy)
  - `/download` (Public download center for guard APK and iOS binaries)
  - `/showcase` (Interactive Stageshow UI/UX product showcase)
  - `/support` (24/7 campus security dispatch & IT support ticketing)
- **Admin Command Portal (`(admin)/admin`)**:
  - `/admin` (Central Security Command Dashboard, KPI matrix, station status)
  - `/admin/login` (Admin credential authentication, session tokens)
  - `/admin/activity` (Audit timeline, SSE live streaming events, CSV/PDF export)
  - `/admin/analytics` (Peak entry times, department throughput charts, exception rates)
  - `/admin/enrollment` (Biometric photo enrollment, YuNet 106-landmark validation)
  - `/admin/gates` (Gate post station management, relay status, guard assignment)
  - `/admin/guards` (Security officer roster, active shift tracking, badge allocation)
  - `/admin/people` (Student, faculty, contractor directory, clearance levels)
  - `/admin/repository` (Facial embedding database, vector indexing health)
  - `/admin/visitors` (Campus visitor pass issuing, host approvals, pre-registration)
  - `/admin/settings` (Threshold configurations, fallback mode rules, retention limits)

#### 2.2 React Native / Expo Mobile App (`apps/mobile/app/`)
- **Authentication Flow (`(auth)`)**:
  - `onboarding.tsx` (5-step guard orientation walkthrough)
  - `login.tsx` (Officer ID input, Station Password, Gate Station Locking)
- **Guard Operational Flow (`(guard)`)**:
  - `verify/index.tsx` (Home viewfinder trigger, active gate lock status)
  - `verify/camera.tsx` (Expo Camera viewfinder, reticle, ambient lux detector)
  - `verify/review.tsx` (Photo confirmation, quality feedback, retake/submit)
  - `verify/processing.tsx` (Sub-100ms inference animation, progress ring)
  - `verify/result.tsx` (7-state outcome badge, candidate match card, clearance)
  - `verify/decision.tsx` (Grant / Deny entry, manual override reason, non-repudiation HMAC seal)
  - `visitors/index.tsx` (Active visitor pass roster, status filters)
  - `visitors/intake.tsx` (Walk-in registration form, photo capture, host selection)
  - `visitors/[visitorId].tsx` (Pass badge detail view, checkout button)
  - `activity/index.tsx` (Reverse-chronological verification event feed)
  - `activity/[eventId].tsx` (Cryptographic verification detail, HMAC signature verify)
  - `profile/index.tsx` (Officer credentials, station diagnostics, AI SOP Knowledge Assistant)

---

### 3. State Management Analysis

- **Client State**:
  - React `useState` and `useReducer` for viewfinder states and multi-step forms.
  - Global `AuthContext` managing officer session, JWT tokens, and station locking.
  - Camera `torchMode`, `facingMode`, `zoomRatio`, and optical reticle geometry.
- **Persistent State**:
  - Expo `SecureStore` (Hardware Keychain wrapper) for JWT access/refresh tokens.
  - `AsyncStorage` for cached station preferences and offline pending event queue.
- **Server State & Realtime**:
  - TanStack Query / `fetch` polling with Server-Sent Events (SSE) on `/api/v1/events/stream`.
  - Supabase Realtime channel `gate-events` for immediate barrier relay triggers.

---

### 4. Design System & Asset Pipeline

- **Token Package**: `@gatewise/design-tokens`
  - Colors: Daylight canvas (`#F4F8F5`), Deep Emerald (`#176346`), Institutional Mint (`#23865D`), Soft Sage (`#C7E7D8`).
  - Typography: System font stack (Inter / SF Pro), 11pt to 36pt hierarchy.
  - Spacing & Radii: 4pt grid system (`2px` to `64px`), 4px to 24px corner radii.
- **Native Translation Principle**:
  - Preserve exact hex values in light appearance; add high-contrast dark-mode counterparts.
  - Replace stock CSS rounded cards with native iOS 26 `GlassEffectContainer` and standard `.regularMaterial`.
