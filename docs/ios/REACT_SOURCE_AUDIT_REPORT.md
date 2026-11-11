# GATEWISE AI — Complete React & Next.js Source Code Audit
## Route Inventory · Reusable Component Catalog · State Management & API Mapping

### 1. Executive Summary
This audit provides a complete structural, behavioral, and architectural analysis of the existing Next.js 14 and React Native frontends in the GATEWISE AI codebase. It maps every screen, page, and state container to its native iOS 26 SwiftUI counterpart.

---

### 2. Screen & Route Inventory

#### 2.1 Next.js 14 Web Application (`apps/web`)

| Route Path | File Location | Component Name | Server / Client | Key Dependencies | SwiftUI Target Screen |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `/` | `apps/web/app/(public)/page.tsx` | `PublicLandingPage` | Server | Tailwind, Lucide, Hero, Architecture | `PublicHomeView.swift` |
| `/product` | `apps/web/app/(public)/product/page.tsx` | `ProductPage` | Server | Product features, specifications | `ProductDetailView.swift` |
| `/features` | `apps/web/app/(public)/features/page.tsx` | `FeaturesPage` | Server | Feature cards, technical specs | `FeaturesView.swift` |
| `/how-it-works`| `apps/web/app/(public)/how-it-works/page.tsx` | `HowItWorksPage` | Server | 4-step biometric walkthrough | `HowItWorksView.swift` |
| `/security` | `apps/web/app/(public)/security/page.tsx` | `SecurityPrivacyPage` | Server | DPDP act compliance, biometric privacy | `SecurityPrivacyView.swift` |
| `/download` | `apps/web/app/(public)/download/page.tsx` | `DownloadCenterPage` | Client | APK release downloads, SHA-256 | `DownloadCenterView.swift` |
| `/admin/login` | `apps/web/app/(admin)/admin/login/page.tsx`| `AdminLoginPage` | Client | Argon2id, JWT token exchange | `AdminLoginView.swift` |
| `/admin` | `apps/web/app/(admin)/admin/page.tsx` | `AdminDashboardPage` | Client | Live SSE telemetry, KPI counters | `DashboardView.swift` |
| `/admin/activity`| `apps/web/app/(admin)/admin/activity/page.tsx`| `AdminActivityPage` | Client | Real-time event log, filters, HMAC | `ActivityListView.swift` |
| `/admin/people`| `apps/web/app/(admin)/admin/people/page.tsx` | `AdminPeoplePage` | Client | Student/Faculty/Staff directory | `PeopleDirectoryView.swift` |
| `/admin/gates` | `apps/web/app/(admin)/admin/gates/page.tsx` | `AdminGatesPage` | Client | Gate stations, relay telemetry | `GateStationsView.swift` |
| `/admin/guards`| `apps/web/app/(admin)/admin/guards/page.tsx` | `AdminGuardsPage` | Client | Guard roster, shift scheduling | `GuardRosterView.swift` |
| `/admin/visitors`| `apps/web/app/(admin)/admin/visitors/page.tsx`| `AdminVisitorsPage` | Client | Visitor pass ledger, checkout | `VisitorLedgerView.swift` |
| `/admin/analytics`| `apps/web/app/(admin)/admin/analytics/page.tsx`| `AdminAnalyticsPage`| Client | Recharts denial ratios, hourly peak | `AnalyticsDashboardView.swift` |

#### 2.2 React Native Guard Application (`apps/mobile`)

| Route Path | File Location | Component Name | State Management | Hardware APIs | SwiftUI Target Screen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/(auth)/onboarding` | `apps/mobile/app/(auth)/onboarding.tsx` | `OnboardingScreen` | Local (`useState`) + SecureStore | Vibration | `OnboardingView.swift` |
| `/(auth)/login` | `apps/mobile/app/(auth)/login.tsx` | `LoginScreen` | `useAuth()` + SecureStore | Vibration | `LoginView.swift` |
| `/(guard)/verify` | `apps/mobile/app/(guard)/verify/index.tsx`| `VerifyHomeScreen` | `useVerification()` | None | `VerifyHomeView.swift` |
| `/(guard)/verify/camera` | `apps/mobile/app/(guard)/verify/camera.tsx`| `CameraCaptureScreen`| `useCameraPermissions()` | CameraView, Torch | `CameraCaptureView.swift` |
| `/(guard)/verify/review` | `apps/mobile/app/(guard)/verify/review.tsx`| `ReviewCaptureScreen`| `useVerification()` | Image cache | `ReviewCaptureView.swift` |
| `/(guard)/verify/processing`| `apps/mobile/app/(guard)/verify/processing.tsx`| `VerificationProcessingScreen`| `useVerification()` | None | `ProcessingView.swift` |
| `/(guard)/verify/result` | `apps/mobile/app/(guard)/verify/result.tsx`| `VerificationResultScreen`| `useVerification()` | None | `VerificationResultView.swift` |
| `/(guard)/verify/decision`| `apps/mobile/app/(guard)/verify/decision.tsx`| `RecordDecisionScreen`| `useVerification()` | CryptoKit HMAC | `RecordDecisionView.swift` |
| `/(guard)/activity` | `apps/mobile/app/(guard)/activity/index.tsx`| `ActivityFeedScreen`| Local + `ActivityService` | None | `ActivityFeedView.swift` |
| `/(guard)/visitors/intake`| `apps/mobile/app/(guard)/visitors/intake.tsx`| `VisitorIntakeScreen`| Local + `VisitorService` | None | `VisitorIntakeView.swift` |
| `/(guard)/profile` | `apps/mobile/app/(guard)/profile/index.tsx`| `GuardProfileScreen`| `useAuth()` + `ProfileService` | Battery, Latency | `GuardProfileView.swift` |

---

### 3. State Management & Data Flow Inventory

#### React Source Pattern:
- **`AuthProvider.tsx`:** Provides `user`, `assignedGate`, `token`, `isAuthenticated`, and `isLoading`. Caches tokens in `expo-secure-store`.
- **`VerificationContext.tsx`:** Coordinates the verification pipeline: `capturedUri`, `capturedBase64`, `ambientLightScore`, `processingStep`, `verificationResult`, `decisionSignature`.
- **`api-client.ts`:** Axios/fetch wrapper with automatic Bearer token injection and error handling.

#### Swift 6 Native Architecture Equivalent:
- **`AuthManager.swift`:** Manages authentication state, Keychain storage, and session validation using Swift Observation (`@Observable`).
- **`VerificationCoordinator.swift`:** Orchestrates face verification lifecycle and pipeline steps.
- **`APIClient.swift`:** Actor-isolated HTTP client using native `URLSession` with structured concurrency.

---

### 4. Reusable Component Inventory

| React Component | File Path | Props & Capabilities | SwiftUI Native Component |
| :--- | :--- | :--- | :--- |
| `PrimaryButton` | `apps/mobile/.../PrimaryButton.tsx` | `title`, `onPress`, `loading`, `icon`, `variant` | `AppButton(style: .primary)` |
| `SecondaryButton` | `apps/mobile/.../SecondaryButton.tsx` | `title`, `onPress`, `variant` (.soft, .outline, .ghost) | `AppButton(style: .secondary)` |
| `SurfaceCard` | `apps/mobile/.../SurfaceCard.tsx` | `variant` (.flat, .elevated, .highlight), `padding` | `AppCard` |
| `InputField` | `apps/mobile/.../InputField.tsx` | `label`, `value`, `onChangeText`, `leftIcon`, `error` | `AppTextField` |
| `PasswordField` | `apps/mobile/.../PasswordField.tsx` | `label`, `value`, `onChangeText`, reveal toggle | `AppSecureField` |
| `StationTelemetryBar`| `apps/mobile/.../StationTelemetryBar.tsx` | Fixed header with gate name, guard, and status dot | `AppHeader` |
| `StatusBadge` | `apps/mobile/.../StatusBadge.tsx` | Semantic color-coded pill for verification outcomes | `StatusBadge` |
| `CryptographicSealBadge`| `apps/mobile/.../CryptographicSealBadge.tsx` | Monospace HMAC signature card with verified shield | `CryptographicSealCard` |
| `ProcessingStepper`| `apps/mobile/.../ProcessingStepper.tsx` | 5-step pipeline progress indicator | `VerificationStepperView` |
| `EmptyState` | `apps/mobile/.../EmptyState.tsx` | Icon, title, description, and action button | `EmptyStateView` |
| `ErrorState` | `apps/mobile/.../ErrorState.tsx` | Alert icon, error message, and retry button | `ErrorView` |
| `LoadingState` | `apps/mobile/.../LoadingState.tsx` | Centered spinner with loading description | `LoadingView` |

---

### 5. Conclusion
Every route, screen, state variable, and UI component has been mapped. The architecture preserves 100% of business logic while replacing web-only paradigms (Server Components, CSS Modules) with native SwiftUI equivalents.
