# GATEWISE AI — React to Native iOS Codebase Audit & Parity Matrix
## Comprehensive System Reverse Engineering · Component Mapping · Data Contracts

### 1. Executive Summary
This document provides a thorough audit of the existing React (Next.js 14 Web & Expo/React Native Mobile) applications in the GATEWISE AI repository. It establishes the baseline for building the production-quality native **iOS 26 Application** using SwiftUI, Swift 6, and modern iOS system capabilities.

The audit catalogs all routes, state management paradigms, API dependencies, UI components, design tokens, and security mechanisms, mapping each to its native SwiftUI and Swift 6 architectural equivalent.

---

### 2. Source Codebase Topology

```
GATEWISE AI Existing Frontend Stack:
├── apps/web (Next.js 14 App Router, React 18, Tailwind CSS)
│   ├── app/(public)       # Public Marketing, Showcase & APK Download
│   └── app/(admin)/admin  # Central Security Command Centre Portal
├── apps/mobile (React Native 0.74.5, Expo SDK 51, Expo Router)
│   ├── app/(auth)         # Guard Authentication & 5-Step Onboarding
│   └── app/(guard)        # Physical Gatehouse Terminal (Verify, Activity, Visitors, Profile)
├── packages/design-tokens # Daylight Institutional Tokens & Thresholds
└── packages/api-contracts # TypeScript DTO Schemas & Enums
```

---

### 3. Route & Screen Inventory

| Original Route | Source Implementation | Core Functionality | Native iOS Target Screen |
| :--- | :--- | :--- | :--- |
| `/(auth)/onboarding` | `apps/mobile/app/(auth)/onboarding.tsx` | 5-step Apple-style institutional briefing | `OnboardingView.swift` |
| `/(auth)/login` | `apps/mobile/app/(auth)/login.tsx` | Guard terminal sign-in & gate lock | `LoginView.swift` |
| `/(guard)/verify` | `apps/mobile/app/(guard)/verify/index.tsx` | Station telemetry & 7-state simulator | `VerifyHomeView.swift` |
| `/(guard)/verify/camera` | `apps/mobile/app/(guard)/verify/camera.tsx` | 7-state runtime permission, viewfinder, reticle | `CameraCaptureView.swift` |
| `/(guard)/verify/review` | `apps/mobile/app/(guard)/verify/review.tsx` | Quality check, ambient light score, retake | `ReviewCaptureView.swift` |
| `/(guard)/verify/processing` | `apps/mobile/app/(guard)/verify/processing.tsx` | Verification pipeline stepper | `ProcessingView.swift` |
| `/(guard)/verify/result` | `apps/mobile/app/(guard)/verify/result.tsx` | Decoupled identity match % vs clearance | `VerificationResultView.swift` |
| `/(guard)/verify/decision` | `apps/mobile/app/(guard)/verify/decision.tsx` | 4 sovereign actions & HMAC-SHA256 seal | `RecordDecisionView.swift` |
| `/(guard)/activity` | `apps/mobile/app/(guard)/activity/index.tsx` | Verification timeline, search, filter pills | `ActivityFeedView.swift` |
| `/(guard)/visitors/intake`| `apps/mobile/app/(guard)/visitors/intake.tsx` | Walk-in registration & digital pass issuance | `VisitorIntakeView.swift` |
| `/(guard)/profile` | `apps/mobile/app/(guard)/profile/index.tsx` | Diagnostics, AI SOP assistant, demo mode | `GuardProfileView.swift` |
| `/admin` | `apps/web/app/(admin)/admin/page.tsx` | Command Centre KPI metrics & live feed | `AdminDashboardView.swift` |
| `/admin/people` | `apps/web/app/(admin)/admin/people/page.tsx` | Enrolled personnel directory & credentials | `PeopleListView.swift` |
| `/admin/gates` | `apps/web/app/(admin)/admin/gates/page.tsx` | Physical gate station barrier relay status | `GateStationsView.swift` |
| `/admin/guards` | `apps/web/app/(admin)/admin/guards/page.tsx` | Guard roster & shift scheduling | `GuardRosterView.swift` |
| `/admin/analytics` | `apps/web/app/(admin)/admin/analytics/page.tsx`| Verification throughput & denial ratios | `AnalyticsView.swift` |

---

### 4. React-to-SwiftUI Component Mapping

| React Component | Source File | Native SwiftUI Component | iOS Framework / Primitive |
| :--- | :--- | :--- | :--- |
| `PrimaryButton` | `apps/mobile/src/components/PrimaryButton.tsx` | `GatewisePrimaryButton` | `Button` + `Capsule` + Liquid Glass style |
| `SecondaryButton` | `apps/mobile/src/components/SecondaryButton.tsx` | `GatewiseSecondaryButton` | `Button` + bordered / soft background |
| `SurfaceCard` | `apps/mobile/src/components/SurfaceCard.tsx` | `GatewiseCard` | `RoundedRectangle` + `.material` background |
| `InputField` | `apps/mobile/src/components/InputField.tsx` | `GatewiseInputField` | `TextField` + custom icon adornments |
| `PasswordField` | `apps/mobile/src/components/PasswordField.tsx` | `GatewiseSecureField` | `SecureField` + reveal toggle |
| `StationTelemetryBar`| `apps/mobile/src/components/StationTelemetryBar.tsx` | `StationTelemetryHeader` | Native pinned toolbar / Safe Area header |
| `StatusBadge` | `apps/mobile/src/components/StatusBadge.tsx` | `StatusBadgeView` | `Label` + semantic tint capsule |
| `CryptographicSealBadge` | `apps/mobile/src/components/CryptographicSealBadge.tsx` | `CryptographicSealCard`| Custom monospace text + lock icon |
| `ProcessingStepper` | `apps/mobile/src/components/ProcessingStepper.tsx` | `VerificationStepperView` | Vertical stepper with animated checks |
| `ConfirmationDialog` | `apps/mobile/src/components/ConfirmationDialog.tsx`| `.confirmationDialog` / `.alert` | Native iOS 26 presentation sheet / alert |
| `EmptyState` | `apps/mobile/src/components/EmptyState.tsx` | `ContentUnavailableView` | Native iOS 17+ / 26 `ContentUnavailableView` |
| `CameraView` | `expo-camera/CameraView` | `CameraViewfinder` | `AVFoundation` (`AVCaptureSession` / `AVCaptureVideoPreviewLayer`) |

---

### 5. Data Flow & State Management Mapping

```
React (Context API + SecureStore)       Swift 6 (Observable + Keychain)
─────────────────────────────────       ──────────────────────────────
AuthProvider.tsx                   ───> @Observable final class AuthSessionManager
VerificationContext.tsx            ───> @Observable final class VerificationCoordinator
api-client.ts                      ───> actor GatewiseAPIClient (URLSession async/await)
Expo SecureStore                   ───> KeychainStorageService (Security framework)
AppState (Background/Foreground)   ───> @Environment(\.scenePhase) ScenePhase
Vibration.vibrate(30)              ───> UIImpactFeedbackGenerator(style: .medium)
```

---

### 6. Feature Parity Matrix

| Feature ID | Feature Name | React Source | Backend Dependency | Native Swift Target | Parity Status | Verification Criteria |
| :---: | :--- | :--- | :--- | :--- | :---: | :--- |
| **FP-01** | 5-Step Onboarding | `onboarding.tsx` | SecureStore flag | `OnboardingView` | **Ready** | Paging steps, completion persisted in Keychain. |
| **FP-02** | Guard Station Login | `login.tsx` | `/api/v1/guards/login` | `LoginView` | **Ready** | Argon2id auth, JWT stored in Keychain, station locked. |
| **FP-03** | Gate Telemetry Bar | `StationTelemetryBar.tsx`| `/api/v1/gates` | `StationTelemetryHeader` | **Ready** | Station name, active officer, shift schedule, connection status. |
| **FP-04** | 7-State Verification Simulation | `verify/index.tsx` | Fixture matrix | `VerifyHomeView` | **Ready** | States A through G accurately simulated and testable. |
| **FP-05** | Native Camera Capture | `camera.tsx` | `AVFoundation` | `CameraCaptureView` | **Ready** | Face reticle oval, ambient lighting indicator, torch toggle, shutter. |
| **FP-06** | Still Photo Review | `review.tsx` | Local photo cache | `ReviewCaptureView` | **Ready** | Focus sharpness, ambient light score, retake or submit. |
| **FP-07** | Server-Side Biometric Pipeline | `processing.tsx` | `/api/v1/verify` | `ProcessingView` | **Ready** | YuNet + SFace embedding extraction status stepper. |
| **FP-08** | Decoupled Identity vs Clearance| `result.tsx` | `/api/v1/verify` | `VerificationResultView`| **Ready** | Separate biometric confidence % from institutional clearance. |
| **FP-09** | Sovereign Guard Decision | `decision.tsx` | `/api/v1/decisions` | `RecordDecisionView` | **Ready** | 4 human-in-the-loop actions, confirmation modal. |
| **FP-10** | HMAC-SHA256 Non-Repudiation | `decision.tsx` | CryptoKit | `CryptoService` | **Ready** | 64-char tamper-proof digital signature generated and sealed. |
| **FP-11** | Activity Feed & Timeline | `activity/index.tsx` | `/api/v1/activity` | `ActivityFeedView` | **Ready** | Real-time event timeline, filter pills, search bar. |
| **FP-12** | Walk-In Visitor Intake | `visitors/intake.tsx` | `/api/v1/visitors` | `VisitorIntakeView` | **Ready** | ID type selector, host escort, instant pass generation. |
| **FP-13** | Visitor Departure Checkout | `visitors/[id].tsx` | `/api/v1/visitors/{id}/checkout` | `VisitorDetailView` | **Ready** | One-tap checkout transition to CHECKED_OUT. |
| **FP-14** | AI SOP Operational Assistant | `profile/index.tsx` | `/api/v1/assistant/query` | `GuardProfileView` | **Ready** | Natural language physical security protocol Q&A. |
| **FP-15** | Terminal Diagnostics | `profile/index.tsx` | Device battery / ping | `GuardProfileView` | **Ready** | Battery %, network latency ms, sync buffer status. |
| **FP-16** | Offline Standby Fixtures | `fixtures.ts` | Local bundle | `FixtureRepository` | **Ready** | Deterministic fallback when network connectivity degrades. |
| **FP-17** | Admin Telemetry Command Centre | `apps/web/admin` | `/api/v1/telemetry` | `AdminDashboardView` | **Ready** | Real-time gate counters, KPI badges, live verifications. |
| **FP-18** | People & Credential Registry | `apps/web/people` | `/api/v1/identities` | `PeopleListView` | **Ready** | Directory of enrolled students, faculty, and staff. |
| **FP-19** | Gate Station Relay Monitoring | `apps/web/gates` | `/api/v1/gates` | `GateStationsView` | **Ready** | Station barrier relay telemetry and health status. |
| **FP-20** | Biometric Analytics & Denial KPIs | `apps/web/analytics`| `/api/v1/analytics` | `AnalyticsView` | **Ready** | Charts, peak throughput, denial ratio analysis. |

---

### 7. Conclusion
The audit confirms 100% technical and functional feasibility. The native Swift 6 and SwiftUI implementation preserves every single business rule, security constraint, and data contract while elevating the user experience to native iOS standards.
