# GATEWISE AI — Android Guard Application Specification & Implementation Guide
**Version:** 1.0.0-rc3  
**Target Platform:** Android (Google Pixel, Samsung Galaxy Enterprise, Ruggedized Post Tablets)  
**Package Identifier:** `com.gatewiseai.guard`  
**Framework Stack:** React Native 0.74.5 · Expo SDK 51 · Expo Router v3 · TypeScript 5.3  

---

## 1. Executive Summary

The **GATEWISE AI Guard Application** is a specialized native Android application engineered for institutional security personnel at educational campuses such as **IIM Sambalpur**.

The application serves as the operational interface for physical gate access control. It combines single-shot biometric verification, real-time access clearance verification, visitor pass management, and cryptographically sealed audit logging into a cohesive, daylight-aesthetic mobile experience.

### Core Institutional Principles

1. **Sovereign Human Guard Authority**: Face matching does not automatically lift barriers. A licensed security guard retains sovereign authority to `GRANT_ENTRY`, `DENY_ENTRY`, `ESCALATE_TO_ADMIN`, or `REFER_TO_VISITOR_DESK` for every individual.
2. **Zero Continuous Background Video Surveillance**: The camera is active **only** when the guard explicitly taps "START VERIFICATION". There is zero continuous video streaming, ambient surveillance, or passive recording.
3. **Zero Raw Biometric Image Retention**: Captured facial frames are evaluated in ephemeral volatile memory, converted to non-inversible 128-dimensional mathematical embeddings, and immediately purged from local device cache.
4. **Guards Cannot Create Permanent Identities**: Guards cannot enroll students, faculty, or permanent staff. Unregistered individuals must either obtain a Visitor Pass or receive an Enrollment Referral for Registrar review.
5. **Immutable Cryptographic Audit Trail**: Every guard decision is sealed with an HMAC-SHA256 signature containing timestamp, terminal ID, guard employee ID, and candidate similarity score.

---

## 2. Monorepo Architecture & Directory Layout

The application resides in `apps/mobile/` within the GATEWISE AI monorepo, consuming shared design tokens (`@gatewise/design-tokens`) and API data contracts (`@gatewise/api-contracts`).

```
apps/mobile/
├── __tests__/
│   └── mobile-suite.test.ts          # Unit and token verification tests
├── app/                              # Expo Router v3 file-system routing
│   ├── _layout.tsx                   # Root Stack with Auth & Verification Providers
│   ├── index.tsx                     # Entry point & authentication gatekeeper
│   ├── (auth)/
│   │   └── login.tsx                 # Guard authentication & gate locking
│   └── (guard)/
│       ├── _layout.tsx               # 4-Tab bottom navigation bar
│       ├── verify/
│       │   ├── _layout.tsx           # Stack navigator for verification workflow
│       │   ├── index.tsx             # Verify Home (CTA, metrics, 7-state simulator)
│       │   ├── camera.tsx            # Native camera viewfinder & guide reticle
│       │   ├── review.tsx            # Frame quality review & blur analysis
│       │   ├── processing.tsx        # 7-stage vertical processing stepper
│       │   ├── result.tsx            # Unified result card (States A through G)
│       │   └── decision.tsx          # Guard decision recording & SHA-256 seal
│       ├── activity/
│       │   ├── _layout.tsx           # Stack navigator for activity history
│       │   ├── index.tsx             # Filterable, searchable gate event feed
│       │   └── [eventId].tsx         # Immutable event audit record sheet
│       ├── visitors/
│       │   ├── _layout.tsx           # Stack navigator for visitor passes
│       │   ├── index.tsx             # Expected visitors, search & quick check-in
│       │   ├── [visitorId].tsx       # Visitor pass detail & departure check-out
│       │   └── intake.tsx            # Walk-in visitor digital registration form
│       └── profile/
│           ├── _layout.tsx           # Stack navigator for profile & diagnostics
│           └── index.tsx             # Guard credentials, telemetry & SOP assistant
├── assets/                           # App icons, splash screens, and adaptive icons
├── constants/
│   └── theme.ts                      # Legacy theme re-exports
├── src/
│   ├── components/                   # Shared design-system component library
│   │   ├── PrimaryButton.tsx         # 48dp min touch target, loading states
│   │   ├── SecondaryButton.tsx       # Soft & outline button variants
│   │   ├── IconButton.tsx            # 48dp circular/rounded touch targets
│   │   ├── InputField.tsx            # Institutional text input with label & clear
│   │   ├── PasswordField.tsx         # Password input with visibility toggle
│   │   ├── StatusBadge.tsx           # Badges for all 7 states & visitor statuses
│   │   ├── SurfaceCard.tsx           # Elevated & flat daylight surface cards
│   │   ├── StationTelemetryBar.tsx   # Header bar: Gate name, online, battery
│   │   ├── ProcessingStepper.tsx     # 7-stage vertical stepper
│   │   ├── VerificationResultCard.tsx# Side-by-side photo comparison & match
│   │   ├── ConfirmationDialog.tsx    # High-stakes decision confirmation modal
│   │   ├── CryptographicSealBadge.tsx# SHA-256 digital signature badge
│   │   ├── EmptyState.tsx            # Empty list placeholder
│   │   ├── LoadingState.tsx          # Institutional green loading indicator
│   │   ├── ErrorState.tsx            # Network / processing failure screen
│   │   └── index.ts                  # Public component exports
│   ├── providers/
│   │   ├── AuthProvider.tsx          # Authentication context & SecureStore
│   │   └── VerificationContext.tsx   # Active verification session coordinator
│   ├── services/
│   │   ├── api-client.ts             # Base HTTP client with JWT & fallback
│   │   ├── auth.service.ts           # Login, token storage & session restore
│   │   ├── verification.service.ts   # Camera verification & decision submission
│   │   ├── activity.service.ts       # Gate event log querying & detail fetch
│   │   ├── visitor.service.ts        # Visitor pass lookup, check-in & intake
│   │   ├── profile.service.ts        # Terminal diagnostics & AI SOP queries
│   │   └── fixtures.ts               # Deterministic mock data for all 7 states
│   ├── theme/                        # Colors, typography, spacing, shadows
│   │   └── index.ts
│   └── types/                        # TypeScript type definitions
│       └── index.ts
├── app.json                          # Expo project manifest & Android permissions
├── eas.json                          # EAS build configuration (APK / App Bundle)
├── package.json
└── tsconfig.json
```

---

## 3. The 7 Verification States

The application is engineered to handle all 7 standard institutional access control states deterministically:

| State | Institutional Outcome | Threshold Criteria | UI Presentation | SOP Action for Guard |
| :--- | :--- | :--- | :--- | :--- |
| **State A** | `VERIFIED_AUTHORIZED` | Match score $\ge 90\%$, clearance valid | Green badge, checkmark, high confidence | Grant entry barrier passage |
| **State B / F** | `AUTHORIZATION_EXPIRED` | Match score $\ge 90\%$, clearance expired or wrong gate | Red/Amber badge, expiration date | Deny entry or refer to Visitor Desk |
| **State C** | `POTENTIAL_MATCH` | Match score $70\% - 89\%$ | Amber warning badge, review required | **Inspect physical institutional ID card** before deciding |
| **State D** | `UNKNOWN_PERSON` | Match score $< 70\%$ | Slate badge, unregistered individual | Direct to Visitor Desk A or submit Enrollment Referral |
| **State E** | `IMAGE_QUALITY_INSUFFICIENT` | Focus variance $< 60.0$, excessive blur | Orange badge, quality low | Retake photo or perform manual badge check |
| **State G** | `SERVICE_UNAVAILABLE` | Central cluster offline | Blue/Gray badge, offline standby | Use offline entry protocol with local signed buffer |

### Interactive 7-State Simulator
On the **Verify Home screen**, guards and auditors can tap the **7-State Verification Simulator** grid to immediately test how each state renders across capture review, 7-stage processing, side-by-side photo comparison, and decision recording.

---

## 4. Multi-Stage Verification Pipeline (7-Stage Stepper)

When a face capture is submitted, the application executes a visible 7-stage vertical stepper (`ProcessingStepper.tsx`):

1. **Frame Quality & Blur Analysis**: Computes Laplacian focus score ($\ge 60.0$) and checks ambient lighting.
2. **Face Detection & Geometry**: Verifies single centered facial oval and landmarks.
3. **Anti-Spoofing & Liveness Check**: Validates organic skin tone texture against screen glare.
4. **Feature Embedding Extraction**: Computes normalized 128-dimensional biometric embedding.
5. **Vector Database Comparison**: Executes cosine similarity search against enrolled campus identities.
6. **Access Control & Schedule Check**: Validates student semester status, faculty clearance, and post operating hours.
7. **Verification Record Generation**: Assembles immutable cryptographic audit seal with HMAC-SHA256.

---

## 5. Security & Hardware Integration

### Android Permissions (`app.json`)
```json
"android": {
  "package": "com.gatewiseai.guard",
  "versionCode": 1,
  "permissions": [
    "CAMERA"
  ]
}
```

### Expo Camera (`CameraView`)
- Single-shot manual capture via `cameraRef.current.takePictureAsync({ quality: 0.85, base64: true })`.
- Torch toggle (`enableTorch={isTorchOn}`) for night perimeter posts.
- Contextual permission request banner explaining the zero-surveillance privacy guarantee.
- Simulation fallback mode for emulators or test environments without physical camera feeds.

### Encrypted Credential Storage (`expo-secure-store`)
- Session JWT tokens and guard identifiers are stored exclusively in Android Keystore via `expo-secure-store`.
- Automatically purged upon shift sign-out.

---

## 6. Network Endpoints & Local Development

The API client (`apps/mobile/src/services/api-client.ts`) dynamically detects the runtime host:
- **Android Emulator**: Connects to `http://10.0.2.2:8000/api/v1` (routing to the host machine's FastAPI server).
- **iOS Simulator / Web**: Connects to `http://localhost:8000/api/v1`.
- **Physical Device**: Connects to local machine IP on the institutional WiFi network.
- **Offline / Demonstration Mode**: Toggling "Offline Demonstration Mode" in the Profile tab decouples the application from network calls and runs fully deterministic offline fixtures (`fixtures.ts`).

---

## 7. EAS Build Profiles (`eas.json`)

```json
{
  "cli": {
    "version": ">= 9.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### Building the Standalone APK
To compile the standalone installable APK for security guard mobile devices:
```bash
cd apps/mobile
eas build --profile preview --platform android
```

---

## 8. Verification & Test Suite

Run the full verification test suite across monorepo packages:
```bash
# 1. Typecheck the mobile application
pnpm --filter @gatewise/mobile typecheck

# 2. Run Python backend test suite (FastAPI, OpenCV pipeline, SQLite/Alembic)
pnpm test

# 3. Build Next.js administrative web portal and shared packages
pnpm build
```
