# DISCOVERY REPORT: REACT & NEXT.JS CODEBASE AUDIT
**Agent:** `react_auditor`  
**Execution Mode:** Read-Only Discovery  
**Output Target:** `migration/reports/react-audit.md`  
**Timestamp:** 2026-11-11T12:33:00+05:30  

---

### 1. Executive Summary

The frontend codebase is organized as a pnpm monorepo consisting of:
- `apps/web`: Next.js 14.2.3 App Router with React 18.2.0, Tailwind CSS 3.4.
- `apps/mobile`: React Native 0.74.2 with Expo SDK 51, Expo Router 3.5.
- `packages/design-tokens`: Shared brand palette, typography scales, spacing, radii, shadows.
- `packages/api-contracts`: TypeScript domain models, DTOs, and enum contracts.

The application serves two distinct institutional security audiences:
1. **Security Guards (Mobile)**: Low-friction operational flow: station lock, camera viewfinder, biometric face verification, 7-state outcome evaluation, visitor intake, and SOP guidance.
2. **Security Supervisors & Administrators (Web Portal)**: Oversight and command: central live telemetry, peak entry analytics, gate post relay configuration, guard shift scheduling, biometric enrollment, and audit logs.

---

### 2. Route & Screen Inventory

#### 2.1 Next.js 14 Web Portal (`apps/web/app/`)
- **Public Informational Routes**:
  - `(public)/page.tsx` (`/`): Public showcase, trust architecture overview, real-time KPI banner.
  - `(public)/features/page.tsx` (`/features`): Biometric engine breakdown (YuNet landmarking + SFace embedding).
  - `(public)/how-it-works/page.tsx` (`/how-it-works`): 7-step institutional verification protocol.
  - `(public)/product/page.tsx` (`/product`): Hardware turnstile & post relay specifications.
  - `(public)/security/page.tsx` (`/security`): Non-repudiation cryptographic seal architecture.
  - `(public)/installation/page.tsx` (`/installation`): Edge agent topology and installation script guide.
  - `(public)/download/page.tsx` (`/download`): Mobile binary download center.
  - `(public)/faq/page.tsx` (`/faq`): Institutional data protection and compliance FAQ.
  - `(public)/showcase/page.tsx` (`/showcase`): Interactive Stageshow motion product demonstration.
  - `(public)/support/page.tsx` (`/support`): 24/7 security dispatch ticket intake.
- **Admin Command Portal**:
  - `(admin)/admin/page.tsx` (`/admin`): Central Command Dashboard, KPI matrix, 4-gate post status.
  - `(admin)/admin/login/page.tsx` (`/admin/login`): Supervisor credential login.
  - `(admin)/admin/activity/page.tsx` (`/admin/activity`): Event timeline, SSE stream, CSV export.
  - `(admin)/admin/analytics/page.tsx` (`/admin/analytics`): Throughput charts, rejection breakdown.
  - `(admin)/admin/enrollment/page.tsx` (`/admin/enrollment`): Photo intake & YuNet landmark validation.
  - `(admin)/admin/gates/page.tsx` (`/admin/gates`): Barrier relays, guard assignment, emergency lockout.
  - `(admin)/admin/guards/page.tsx` (`/admin/guards`): Guard roster, active shifts.
  - `(admin)/admin/people/page.tsx` (`/admin/people`): Student/faculty identity directory.
  - `(admin)/admin/repository/page.tsx` (`/admin/repository`): Vector embedding repository health.
  - `(admin)/admin/visitors/page.tsx` (`/admin/visitors`): Pre-registered visitor approval queue.
  - `(admin)/admin/settings/page.tsx` (`/admin/settings`): Thresholds, data retention, offline policies.

#### 2.2 Mobile Guard Application (`apps/mobile/app/`)
- `(auth)/onboarding.tsx`: 5-step guard orientation and institutional SOP primer.
- `(auth)/login.tsx`: Officer ID input, station password, hardware gate station lock.
- `(guard)/verify/index.tsx`: Viewfinder trigger, station status row, verification metrics.
- `(guard)/verify/camera.tsx`: Camera viewfinder, optical target reticle, ambient lux detector.
- `(guard)/verify/review.tsx`: Live capture preview, sharpness score, retake/confirm.
- `(guard)/verify/processing.tsx`: Real-time biometric HUD, sub-100ms inference progress ring.
- `(guard)/verify/result.tsx`: 7-state outcome badge, candidate identity card, clearance validity.
- `(guard)/verify/decision.tsx`: Grant/Deny buttons, override reason input, HMAC digital seal.
- `(guard)/visitors/index.tsx`: Active visitor pass list with search and status filter.
- `(guard)/visitors/intake.tsx`: Walk-in registration form, ID photo, host selection.
- `(guard)/visitors/[visitorId].tsx`: Visitor pass badge view with checkout button.
- `(guard)/activity/index.tsx`: Reverse-chronological verification event feed.
- `(guard)/activity/[eventId].tsx`: Cryptographic audit record inspection.
- `(guard)/profile/index.tsx`: Officer credential summary, terminal diagnostics, AI SOP Assistant.

---

### 3. State Management & Data Flow

- **Global Auth & Session**: `AuthContext` provides JWT bearer token, active guard profile, and locked `gateId`.
- **Local Persistence**: Expo `SecureStore` stores JWT tokens; `AsyncStorage` caches offline verification events.
- **Form State**: Uncontrolled inputs with React state validation; multi-step stepper state machine in Verify flow.
- **Realtime Updates**: Server-Sent Events (SSE) `/api/v1/events/stream` and Supabase Realtime channel `gate-events`.

---

### 4. Asset Inventory

- **Design Tokens**: Defined in `packages/design-tokens/src/index.ts`.
- **Icons**: Lucide Icons in web, SF Pro and Material Icons in mobile.
- **Images**: Campus 3D models (`Campus3DView.tsx`), sample photos, institutional seal vector graphics.
