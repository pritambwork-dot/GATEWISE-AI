# MIGRATION AUDIT 02: COMPLETE SCREEN INVENTORY
## Exhaustive Screen Catalog Across Web & Mobile Environments

**Audited By:** AGENT 01 — Product Reverse Engineering Agent  
**Date:** 2026-11-11  

---

### 1. Guard Mobile Application Screens (`apps/mobile`)

| # | Screen Name | React Source Path | Route | Primary Responsibilities | Native SwiftUI Equivalent |
|---|---|---|---|---|---|
| 1 | **Onboarding Orientation** | `apps/mobile/app/(auth)/onboarding.tsx` | `/(auth)/onboarding` | 5-step interactive protocol & SOP primer for newly deployed security personnel | `Presentation/Onboarding/OnboardingView.swift` |
| 2 | **Officer Sign-In & Gate Lock** | `apps/mobile/app/(auth)/login.tsx` | `/(auth)/login` | Guard credentials validation, station password, hardware gate station lock, biometric Face ID | `Presentation/Auth/LoginView.swift` & `AuthenticationViewModel.swift` |
| 3 | **Verify Viewfinder Home** | `apps/mobile/app/(guard)/verify/index.tsx` | `/(guard)/verify` | Primary operational viewfinder launcher, active gate relay indicator, quick statistics | `Presentation/Verify/VerifyHomeView.swift` |
| 4 | **Optical Camera Capture** | `apps/mobile/app/(guard)/verify/camera.tsx` | `/(guard)/verify/camera` | AVFoundation capture, optical target reticle, ambient lux detector, torch toggle | `Presentation/Verify/CameraCaptureView.swift` |
| 5 | **Capture Review & Quality Check** | `apps/mobile/app/(guard)/verify/review.tsx` | `/(guard)/verify/review` | Live photo inspection, sharpness evaluation, blur warning, retake/confirm action | `Presentation/Verify/ReviewCaptureView.swift` |
| 6 | **Biometric Processing HUD** | `apps/mobile/app/(guard)/verify/processing.tsx` | `/(guard)/verify/processing` | Neural pipeline feedback HUD (YuNet crop + SFace 128D embedding + pgvector match) | `Presentation/Verify/ProcessingView.swift` |
| 7 | **Verification Outcome Result** | `apps/mobile/app/(guard)/verify/result.tsx` | `/(guard)/verify/result` | 7-state outcome badge, candidate identity card, clearance expiration, confidence gauge | `Presentation/Verify/VerificationResultView.swift` |
| 8 | **Guard Decision & Cryptographic Seal** | `apps/mobile/app/(guard)/verify/decision.tsx` | `/(guard)/verify/decision` | Grant/Deny entry trigger, override reason notes, HMAC-SHA256 non-repudiation signature | `Presentation/Verify/RecordDecisionView.swift` |
| 9 | **Visitor Pass Directory** | `apps/mobile/app/(guard)/visitors/index.tsx` | `/(guard)/visitors` | Active visitor badges, filter by Checked In / Checked Out, search by name or host | `Presentation/Visitors/VisitorViews.swift` (`VisitorListView`) |
| 10 | **Visitor Intake Registration** | `apps/mobile/app/(guard)/visitors/intake.tsx` | `/(guard)/visitors/intake` | Walk-in visitor data entry, government ID capture, host department, pass code generation | `Presentation/Visitors/VisitorViews.swift` (`VisitorIntakeView`) |
| 11 | **Visitor Pass Detail & Checkout** | `apps/mobile/app/(guard)/visitors/[visitorId].tsx` | `/(guard)/visitors/[id]` | Pass barcode preview, duration elapsed counter, departure checkout button | `Presentation/Visitors/VisitorViews.swift` (`VisitorPassDetailSheet`) |
| 12 | **Activity Audit Timeline** | `apps/mobile/app/(guard)/activity/index.tsx` | `/(guard)/activity` | Reverse-chronological event timeline, outcome badge filters, live SSE stream updates | `Presentation/Activity/ActivityFeedView.swift` |
| 13 | **Verification Event Audit Inspection** | `apps/mobile/app/(guard)/activity/[eventId].tsx` | `/(guard)/activity/[id]` | Event metadata, officer ID, cryptographic signature verification, reference image | `Presentation/Activity/ActivityDetailSheet.swift` |
| 14 | **Guard Station Profile & SOP Assistant** | `apps/mobile/app/(guard)/profile/index.tsx` | `/(guard)/profile` | Officer credential card, terminal health diagnostics, AI SOP Knowledge Assistant | `Presentation/Profile/GuardProfileView.swift` |

---

### 2. Admin Command Portal Screens (`apps/web`)

| # | Screen Name | Next.js Source Path | Route | Primary Responsibilities | Native SwiftUI Equivalent |
|---|---|---|---|---|---|
| 15 | **Security Command Central Dashboard** | `apps/web/app/(admin)/admin/page.tsx` | `/admin` | Real-time institutional telemetry, 4-gate post relay health, pass rate KPI, alerts | `Features/Dashboard/Views/DashboardView.swift` |
| 16 | **Admin Authentication** | `apps/web/app/(admin)/admin/login/page.tsx` | `/admin/login` | Elevated administrator credentials, 2FA prompt, role-based session issuance | `Presentation/Auth/LoginView.swift` |
| 17 | **Central Event Activity Stream** | `apps/web/app/(admin)/admin/activity/page.tsx` | `/admin/activity` | Enterprise-wide event log, high-volume search, multi-station filter, CSV audit export | `Presentation/Activity/ActivityFeedView.swift` |
| 18 | **Gate Stations & Relay Manager** | `apps/web/app/(admin)/admin/gates/page.tsx` | `/admin/gates` | Physical turnstile relay configuration, emergency barrier override, guard dispatch | `Presentation/Admin/AdminDashboardView.swift` |
| 19 | **Guard Personnel Roster** | `apps/web/app/(admin)/admin/guards/page.tsx` | `/admin/guards` | Security officer scheduling, shift assignment, post lock configuration | `Presentation/Admin/AdminDashboardView.swift` |
| 20 | **Identity Directory & Enrollment** | `apps/web/app/(admin)/admin/people/page.tsx` | `/admin/people` | Student, faculty, staff member repository, biometric enrollment status, badge status | `Presentation/Admin/AdminDashboardView.swift` |
| 21 | **Visitor Pass Management** | `apps/web/app/(admin)/admin/visitors/page.tsx` | `/admin/visitors` | Pre-registered visitor approvals, VIP convoy passes, historical visitor logs | `Presentation/Visitors/VisitorViews.swift` |
| 22 | **System Configuration & Security Settings**| `apps/web/app/(admin)/admin/settings/page.tsx` | `/admin/settings` | Match threshold tuning (0.70 - 0.90), offline sync rules, data retention policies | `Presentation/Profile/GuardProfileView.swift` |
