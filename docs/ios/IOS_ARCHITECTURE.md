# GATEWISE AI — Native iOS Application Architecture
## Clean Architecture · Swift 6 Structured Concurrency · Modern SwiftUI

### 1. Architectural Philosophy
The GATEWISE Guard & Command Centre native iOS application is architected following **Clean Feature-Based Architecture** principles. The architecture enforces strict unidirectional data flow, total separation of concerns, and complete isolation between presentation, business logic, and network transport layers.

The codebase leverages modern Swift 6 language features, including:
- **Strict Concurrency Checking:** Elimination of data races via Swift 6 Sendable enforcement and actors.
- **`@Observable` Macro (Observation Framework):** Elimination of legacy `ObservableObject` and `@Published` boilerplate; fine-grained view invalidation.
- **Structured Concurrency:** Native `async/await`, `TaskGroup`, and cooperative cancellation.
- **CryptoKit:** Native hardware-accelerated SHA-256 and HMAC cryptographic signatures.

---

### 2. Multi-Layer Architectural Blueprint

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                              │
│                                                                        │
│   SwiftUI Views  ──(Binds to)──>  @Observable Feature Coordinators     │
│   (Liquid Glass, SF Symbols,      (AuthSession, VerificationCoordinator│
│    Dynamic Type, Haptics)          ActivityViewModel, VisitorViewModel)│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼ (Calls Protocol Interfaces)
┌────────────────────────────────────────────────────────────────────────┐
│                          DOMAIN LAYER                                  │
│                                                                        │
│   • Entities & DTOs (Gate, Guard, SubjectCandidate, VerificationResult)│
│   • Use Cases (VerifySubjectUseCase, CommitGuardDecisionUseCase)       │
│   • Domain Enums (VerificationOutcome, GuardDecisionAction, Role)      │
│   • Repository Interfaces (GateRepositoryProtocol, AuthRepoProtocol)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼ (Implements Repositories)
┌────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                   │
│                                                                        │
│   • Production Repositories (HTTP URLSession with Async/Await)         │
│   • Mock Fixture Repositories (7-State Deterministic Simulator)        │
│   • Local Storage (KeychainStorageService, Volatile Frame Cache)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                           CORE LAYER                                   │
│                                                                        │
│   • actor GatewiseAPIClient (Thread-safe HTTP network transport)       │
│   • CryptoService (HMAC-SHA256 Non-Repudiation Digital Signatures)     │
│   • KeychainService (Hardware Secure Enclave Key Storage)              │
│   • CameraSessionController (AVFoundation Still Capture Engine)        │
│   • DesignSystem Tokens (GatewiseColors, GatewiseTypography)           │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Layer Separation Guidelines

#### 3.1 Presentation Layer (`Presentation/`)
- Contains purely SwiftUI views, reusable design system components, and view modifiers.
- **Rule:** UI components NEVER perform direct URLSession network requests or Keychain operations.
- State is driven by `@Observable` view models injected via SwiftUI's `@Environment` or view parameters.

#### 3.2 Domain Layer (`Domain/`)
- Contains immutable value types (`struct`), Swift enums, and repository protocols.
- Pure Swift; has zero dependencies on SwiftUI or UIKit.
- Encapsulates institutional gate business rules (e.g. 90% auto-admit threshold, decoupled clearance evaluation, sovereign guard authority).

#### 3.3 Data Layer (`Data/`)
- Implements repository protocols defined in the Domain layer.
- Handles decoding of JSON payloads into strongly-typed Codable domain entities.
- Provides seamless offline failover via `FixtureRepository` when network connectivity degrades.

#### 3.4 Core Layer (`Core/`)
- Thread-safe network client (`actor GatewiseAPIClient`) handling JWT authorization headers, timeout policies, and status code verification.
- `CryptoService` executing cryptographic HMAC-SHA256 signature calculations.
- `KeychainService` wrapping the system `Security` framework (`kSecClassGenericPassword`).

---

### 4. Dependency Injection & Service Container
A centralized `AppDependencyContainer` registers and injects dependencies throughout the application:

```swift
@MainActor
public final class AppDependencyContainer {
    public static let shared = AppDependencyContainer()
    
    public let apiClient: GatewiseAPIClient
    public let keychainService: KeychainServiceProtocol
    public let cryptoService: CryptoServiceProtocol
    public let authRepository: AuthRepositoryProtocol
    public let verificationRepository: VerificationRepositoryProtocol
    public let visitorRepository: VisitorRepositoryProtocol
    public let activityRepository: ActivityRepositoryProtocol
    
    public init(useFixtures: Bool = false) {
        // Initializes production or deterministic testing dependencies
    }
}
```

---

### 5. Strict Concurrency & Thread Safety
1. **Network Isolation:** All HTTP network interactions are contained within an `actor`:
   ```swift
   public actor GatewiseAPIClient {
       private let session: URLSession
       private let baseURL: URL
       // Concurrency safe
   }
   ```
2. **MainActor UI Binding:** All view models and UI coordinator classes are explicitly annotated with `@MainActor` to prevent main-thread dispatch violations.
3. **Sendable Compliance:** All DTOs and value types conform to `Sendable`, guaranteeing thread safety when crossing actor boundaries.
