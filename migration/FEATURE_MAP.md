# CONTRACT: FEATURE PARITY & MAPPING SPECIFICATION
**Status:** Frozen  
**Lead Orchestrator:** Lead Agent  
**Date:** 2026-11-11  

---

### 1. Functional Feature Mapping

| Feature ID | Feature Title | React Source Location | Native SwiftUI Location | Primary Contract |
|---|---|---|---|---|
| `FEAT-01` | **Guard Onboarding** | `apps/mobile/app/(auth)/onboarding.tsx` | `Presentation/Onboarding/OnboardingView.swift` | 5-step SOP orientation |
| `FEAT-02` | **Station Auth & Gate Lock** | `apps/mobile/app/(auth)/login.tsx` | `Features/Authentication/ViewModels/AuthenticationViewModel.swift` | Guard login + gate station lock |
| `FEAT-03` | **Biometric Unlock** | `apps/mobile/src/services/biometrics.ts` | `Core/Security/BiometricAuthService.swift` | Face ID / Passcode prompt |
| `FEAT-04` | **Optical Camera Viewfinder**| `apps/mobile/app/(guard)/verify/camera.tsx` | `Presentation/Verify/CameraCaptureView.swift` | AVFoundation + optical reticle |
| `FEAT-05` | **Capture Review & Sharpness**| `apps/mobile/app/(guard)/verify/review.tsx` | `Presentation/Verify/ReviewCaptureView.swift` | Sharpness score + blur warning |
| `FEAT-06` | **Biometric Pipeline HUD** | `apps/mobile/app/(guard)/verify/processing.tsx` | `Presentation/Verify/ProcessingView.swift` | Sub-100ms progress ring |
| `FEAT-07` | **7-State Outcome Engine** | `packages/design-tokens/src/index.ts` | `Domain/Enums/VerificationOutcome.swift` | States A through G evaluation |
| `FEAT-08` | **Identity Match Card** | `apps/mobile/app/(guard)/verify/result.tsx` | `Presentation/Verify/VerificationResultView.swift` | Candidate photo, category, clearance |
| `FEAT-09` | **Decision & Cryptographic Seal**| `apps/mobile/app/(guard)/verify/decision.tsx` | `Presentation/Verify/RecordDecisionView.swift` | Grant/Deny + HMAC-SHA256 signature |
| `FEAT-10` | **Visitor Pass Directory** | `apps/mobile/app/(guard)/visitors/index.tsx` | `Presentation/Visitors/VisitorViews.swift` | Active visitor badges list & search |
| `FEAT-11` | **Visitor Intake Registration**| `apps/mobile/app/(guard)/visitors/intake.tsx` | `Presentation/Visitors/VisitorViews.swift` | Walk-in visitor intake form |
| `FEAT-12` | **Visitor Departure Checkout**| `apps/mobile/app/(guard)/visitors/[id].tsx` | `Presentation/Visitors/VisitorViews.swift` | Departure checkout + duration |
| `FEAT-13` | **Real-Time Activity Timeline**| `apps/mobile/app/(guard)/activity/index.tsx` | `Presentation/Activity/ActivityFeedView.swift` | Live event feed + filter pills |
| `FEAT-14` | **Event Cryptographic Inspect**| `apps/mobile/app/(guard)/activity/[id].tsx` | `Presentation/Activity/ActivityFeedView.swift` | Signature inspection sheet |
| `FEAT-15` | **AI SOP Knowledge Assistant**| `apps/mobile/app/(guard)/profile/index.tsx` | `Presentation/Profile/GuardProfileView.swift` | Protocol natural-language query |
| `FEAT-16` | **Terminal Diagnostics** | `apps/mobile/app/(guard)/profile/index.tsx` | `Presentation/Profile/GuardProfileView.swift` | Hardware relay & sensor stats |
| `FEAT-17` | **Central Command Dashboard** | `apps/web/app/(admin)/admin/page.tsx` | `Features/Dashboard/Views/DashboardView.swift` | Live telemetry KPI matrix |
| `FEAT-18` | **Physical Barrier Relay Status**| `apps/web/app/(admin)/admin/gates/page.tsx` | `Features/Dashboard/Views/DashboardView.swift` | 4-post gate relay monitoring |
| `FEAT-19` | **Emergency Lockdown Override**| `apps/web/app/(admin)/admin/gates/page.tsx` | `Presentation/Admin/AdminDashboardView.swift` | Barrier emergency lockout |
| `FEAT-20` | **Admin Roster Oversight** | `apps/web/app/(admin)/admin/guards/page.tsx` | `Presentation/Admin/AdminDashboardView.swift` | Guard & personnel assignment |
