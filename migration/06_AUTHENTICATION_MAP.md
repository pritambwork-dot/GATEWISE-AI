# MIGRATION AUDIT 06: AUTHENTICATION & SECURITY MAP
## Native Guard Authentication, Hardware Keychain, Station Lock, & Biometrics

**Audited By:** AGENT 04 — Supabase Backend Agent & AGENT 02 — iOS Architect Agent  
**Date:** 2026-11-11  

---

### 1. Authentication Lifecycle

```
[ Guard Launches App ]
         │
         ▼
[ Check Hardware Keychain for Active Session ]
         │
    ┌────┴───────────────────────────┐
    ▼                                ▼
[ Valid Token Exists ]       [ No Token / Expired ]
    │                                │
    ▼                                ▼
[ Local Face ID Biometric Prompt ] [ LoginView: Enter Employee ID & Pass ]
    │                                │
    ├────────────┬───────────────────┘
    │ Success    │
    ▼            ▼
[ Authenticate against /api/v1/auth/login ]
    │
    ▼
[ Hardware Station Lock to Assigned Gate (e.g. GATE-MAIN-02) ]
    │
    ▼
[ Persist Session Token in Keychain (kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly) ]
    │
    ▼
[ Navigate to Root Tab Navigation (Verify, Visitors, Activity, Profile) ]
```

---

### 2. Station Gate Locking Guarantee

In the GATEWISE security model, a security guard is strictly bound to a designated physical post (`GateStation`) during their shift:
- **Station ID Binding**: Every verification request, visitor pass creation, and decision seal includes the active `gateId`.
- **Tamper Prevention**: Guards cannot arbitrarily switch gates in the client app without re-authenticating through supervisory credentials.
- **Session Auto-Lock**: If the app enters the background for more than 15 minutes, the interface locks and requires biometric Face ID to resume.

---

### 3. Native Security Implementations

#### 3.1 Hardware Keychain (`KeychainService.swift`)
- Uses `Security.framework` (`SecItemAdd`, `SecItemCopyMatching`, `SecItemDelete`).
- Accessible mode: `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly` ensures cryptographic tokens cannot be extracted from unauthenticated device backups.
- Features `MockKeychainService` fallback for testing and continuous integration without sandbox restrictions.

#### 3.2 Biometric Face ID (`BiometricAuthService.swift`)
- Uses `LocalAuthentication.LAContext`.
- Context policy: `.deviceOwnerAuthenticationWithBiometrics`.
- Fallback to station passcode if biometric fails or hardware is not configured.

#### 3.3 Cryptographic Non-Repudiation (`CryptoService.swift`)
- Uses Apple `CryptoKit` (`HMAC<SHA256>`, `SHA256`).
- Digital signature payload: `eventId:guardId:gateId:decision:timestamp:salt`.
- Generates 64-character hex signature stored alongside the verification record in PostgreSQL.
