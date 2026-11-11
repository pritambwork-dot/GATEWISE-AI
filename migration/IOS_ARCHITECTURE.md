# CONTRACT: NATIVE iOS 26 ARCHITECTURE & CONCURRENCY
**Status:** Frozen  
**Lead Orchestrator:** Lead Agent  
**Date:** 2026-11-11  

---

### 1. 5-Tier Layer Boundaries

```
[ Presentation Layer ] (SwiftUI Views, ViewModels, Liquid Glass Controls)
         │
         ▼
[ Domain Layer ]       (Immutable Models, Outcome Enums, Repository Protocols)
         │
         ▼
[ Data Layer ]         (DTOs, Mappers, Remote Repositories, Fixture Mocks)
         │
         ▼
[ Core Layer ]         (API Client, Supabase Manager, Crypto, Keychain, Design Tokens)
         │
         ▼
[ Application Layer ]  (AppState Coordinator, Root Navigation, GatewiseGuardApp)
```

---

### 2. Strict Concurrency Guarantees (Swift 6)

- All ViewModels are marked `@MainActor` and utilize `@Observable` (Swift Observation).
- Network clients (`GatewiseAPIClient`, `SupabaseManager`, `AuthManager`, `RealtimeManager`) are actor-isolated.
- All domain models and DTOs conform to `Sendable`.
- No global mutable state; dependencies are injected via initializers conforming to protocols.

---

### 3. File Ownership Boundaries

| Component Group | Directory Path | Responsible Agent |
|---|---|---|
| Application Coordinator | `Sources/GatewiseGuard/App/` | `ios_architect` |
| Domain Models & Protocols | `Sources/GatewiseGuard/Domain/` | `ios_architect` |
| Design Tokens & Glass | `Sources/GatewiseGuard/Core/DesignSystem/` | `design_system_builder` |
| Supabase & Keychain | `Sources/GatewiseGuard/Core/Supabase/` & `Security/` | `supabase_integrator` |
| Data DTOs & Repositories | `Sources/GatewiseGuard/Data/` | `supabase_integrator` |
| Feature Slices | `Sources/GatewiseGuard/Features/` & `Presentation/` | `feature_implementer` |
| Tests & QA Automation | `Sources/GatewiseGuardRunner/` & `migration/qa/` | `qa_engineer` |
