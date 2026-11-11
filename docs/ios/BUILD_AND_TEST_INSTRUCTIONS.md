# GATEWISE AI — Native iOS 26 Build, Run & Test Guide
## Swift 6 · SwiftUI · Xcode Project Integration · Backend Pairing

### 1. Overview & System Requirements
The GATEWISE Guard & Command Centre native iOS application (`GatewiseGuard`) is implemented as a production-grade Swift 6 package and Xcode application target.

#### Minimum Environment Requirements:
- **Operating System:** macOS 14.0 (Sonoma) or macOS 15.0+ (Sequoia) / macOS 26.
- **Compiler:** Apple Swift 6.0+ (tested and verified on Swift 6.3.3).
- **IDE:** Xcode 16.0 or Xcode 26+.
- **Target OS:** iOS 17.0+ (iOS 26 Liquid Glass ready) & macOS 14.0+ Catalyst.
- **Backend Service:** GATEWISE AI FastAPI core service (`http://localhost:8000/api/v1`).

---

### 2. Project Layout (`apps/ios/GatewiseGuard/`)

```
apps/ios/GatewiseGuard/
├── Package.swift                  # Swift 6 Package Manifest
├── Sources/
│   ├── GatewiseGuard/             # Core Native Library
│   │   ├── GatewiseGuardApp.swift # Root SwiftUI Application struct
│   │   ├── App/                   # AppState, Coordinators, RootContentView
│   │   ├── Core/
│   │   │   ├── Theme/             # GatewiseColors, GatewiseTypography, GatewiseIcons
│   │   │   ├── Security/          # CryptoService, KeychainService, BiometricAuthService
│   │   │   ├── Network/           # GatewiseAPIClient, APIEndpoint, NetworkError
│   │   │   └── Camera/            # CameraCaptureController
│   │   ├── Domain/
│   │   │   ├── Models/            # UserProfile, GateStation, VerificationResult, VisitorPass
│   │   │   ├── Enums/             # VerificationOutcome, GuardDecisionAction, UserRole
│   │   │   └── Repositories/      # Domain Repository Interfaces
│   │   ├── Data/
│   │   │   ├── Repositories/      # Remote HTTP Repositories
│   │   │   └── Fixtures/          # Deterministic 7-State Fixtures & Mock Repositories
│   │   └── Presentation/
│   │       ├── Components/        # Buttons, Cards, Badges, Headers, Steppers
│   │       ├── Onboarding/        # 5-Step Orientation Flow
│   │       ├── Auth/              # Guard Login & Gate Lock
│   │       ├── Verify/            # Viewfinder, Reticle, Review, Result, Decision
│   │       ├── Activity/          # Real-Time Event Timeline & Filters
│   │       ├── Visitors/          # Walk-in Registration & Departure Checkout
│   │       ├── Profile/           # Diagnostics, AI SOP Assistant, Replay Orientation
│   │       └── Admin/             # Central Security Command Dashboard
│   └── GatewiseGuardRunner/       # Native Test Suite Runner Executable
│       └── main.swift
└── docs/ios/                      # Complete iOS Architecture & Audit Documentation
```

---

### 3. Command-Line Compilation & Verification

#### 3.1 Build the Native Swift 6 Library
To compile the entire codebase with strict concurrency enforcement:

```bash
cd apps/ios/GatewiseGuard
swift build
```

**Verified Build Output:**
```
[0/1] Planning build
Building for debugging...
[24/24] Compiling GatewiseGuard OnboardingView.swift
Build complete! (1.67s)
```

#### 3.2 Execute the Native Test Suite
To execute the automated verification test suite:

```bash
cd apps/ios/GatewiseGuard
swift run GatewiseGuardRunner
```

**Verified Test Execution Output:**
```
======================================================================
 GATEWISE GUARD (NATIVE iOS 26 / SWIFT 6) TEST SUITE RUNNER
======================================================================

[1] Running: CryptoService HMAC-SHA256 Digital Signature Generation...
  ✓ PASS

[2] Running: CryptoService SHA-256 Digest Calculation...
  ✓ PASS

[3] Running: 7 Verification Simulation States Adhere to Institutional Rules...
  ✓ PASS

[4] MockAuthRepository Officer Authentication & Gate Lock...
  ✓ PASS

[5] MockVisitorRepository Pass Intake & Departure Lifecycle...
  ✓ PASS

[6] SOP Knowledge Assistant Protocol Matcher...
  ✓ PASS

======================================================================
 TEST SUMMARY: 6 / 6 PASSED (100% SUCCESS RATE)
======================================================================
```

---

### 4. Opening in Xcode & Device Deployment

#### 4.1 Launching via Xcode
Double-click `Package.swift` or run from terminal:

```bash
open apps/ios/GatewiseGuard/Package.swift
```

#### 4.2 Target Device Configuration
1. Select target scheme: **GatewiseGuard** or **GatewiseGuardRunner**.
2. Destination: Choose any iOS Simulator (e.g. **iPhone 16 Pro**, **iPad Pro 13"**) or a connected physical iOS device.
3. Tap **Product → Run** (`Cmd + R`).

#### 4.3 Entitlements & Permissions Configuration
For device deployment with physical hardware, ensure the following keys are declared in the Xcode app wrapper `Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>GATEWISE AI requires camera access to capture subject photographs for security verification.</string>

<key>NSFaceIDUsageDescription</key>
<string>GATEWISE AI requires Face ID to unlock the station terminal and authenticate guard credentials.</string>
```

---

### 5. Backend Connectivity Pairing

The native client connects by default to `http://localhost:8000/api/v1`.

To launch the supporting FastAPI backend locally:
```bash
cd /Users/pritambiswas/antigravity/NORVA
python3 -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```

Verify backend health:
```bash
curl http://localhost:8000/health
# Returns: {"status": "healthy", "service": "gatewise-ai"}
```

When offline or running in demonstration mode, the iOS app automatically utilizes its deterministic local fixtures without requiring a live backend connection.
