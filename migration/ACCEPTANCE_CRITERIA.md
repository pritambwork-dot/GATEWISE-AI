# CONTRACT: ACCEPTANCE CRITERIA & VERIFICATION STANDARDS
**Status:** Frozen  
**Lead Orchestrator:** Lead Agent  
**Date:** 2026-11-11  

---

### 1. Mandatory Release Criteria

1. **Clean Swift 6 Build**:
   - `swift build` in `apps/ios/GatewiseGuard` must succeed with zero errors under strict concurrency checks.
2. **100% Automated Test Runner Pass**:
   - `swift run GatewiseGuardRunner` must execute all 10 suites with 100% success rate.
3. **Zero Liquid Glass Linter Errors**:
   - `check_glass.py` must report 0 errors and 0 warnings targeting iOS 26.0.
4. **Backend Health & Pairing**:
   - Live pairing to `http://localhost:8000/api/v1` must return healthy service status.
5. **Security & Non-Repudiation**:
   - All entry decisions must include a verifiable 64-character HMAC-SHA256 digital signature.
6. **No Regressions on Web/Mobile**:
   - Original React code in `apps/web` and `apps/mobile` must remain untouched and buildable (`pnpm build` passes).
