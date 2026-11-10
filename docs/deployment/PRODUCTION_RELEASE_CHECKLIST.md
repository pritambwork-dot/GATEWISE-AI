# GATEWISE AI 1.0 — Production Release Checklist
## Verification, Signing, Publication & Security Audit Protocol

---

## 1. Pre-Build Code & Environment Audit

- [ ] **Package Identifier Confirmed**: `com.gatewiseai.guard` verified in `apps/mobile/app.json`.
- [ ] **Version Numbers Bumped**:
  - `apps/mobile/app.json`: `version` (e.g. `1.0.0`) and `android.versionCode` incremented.
  - `package.json`: Version matches release milestone.
- [ ] **Git Working Tree Clean**: All changes committed and tagged (`git tag v1.0.0`).
- [ ] **Security Scan**: No hardcoded API keys, JWT secrets, or keystore passwords in source code.
- [ ] **Dependency Audit**: `pnpm install` verified with lockfile integrity.

---

## 2. APK Build & Signing Verification

- [ ] **EAS Production Build**: Execute `eas build --platform android --profile production-apk`.
- [ ] **Keystore Identity Preserved**: Verified that EAS uses the existing production keystore and key alias.
- [ ] **Artifact Download**: Download resulting `.apk` file to build artifacts directory.
- [ ] **Binary Integrity**: Verify the APK opens as a valid archive (`zipfile` inspection).
- [ ] **Digital Signature**: Verify `META-INF/` signatures (`jarsigner -verify -verbose -certs <apk>` or `apksigner verify`).
- [ ] **Checksum Calculation**: Compute canonical SHA-256 binary hash.

---

## 3. Release Publication Protocol

- [ ] **Verification Tool Run**:
  ```bash
  python3 scripts/verify_and_publish_apk.py /path/to/gatewise-guard.apk \
    --version-name 1.0.0 \
    --version-code 1 \
    --download-url https://cdn.gatewiseai.internal/releases/gatewise-guard-v1.0.0.apk \
    --publish
  ```
- [ ] **Metadata Published**: `apps/web/public/releases/android-release.json` updated with `published: true`.
- [ ] **Public API Endpoint Checked**: `GET /api/v1/releases/android/latest` returns `published: true` and matching SHA-256 hash.
- [ ] **Public Download Page**: Verified that `/download` enables the download CTA and displays matching version and checksum.
- [ ] **QR Code Tested**: Scanned desktop QR code with a physical Android device to confirm destination resolves.

---

## 4. Post-Deployment Sideloading Validation

- [ ] **Test Sideload**: Install downloaded APK on an Android test device (Android 10+).
- [ ] **Clean Installation**: Confirm no Play Protect blocks or signing mismatch errors.
- [ ] **Camera Permission Prompt**: Confirm scoped "While using the app" dialogue appears and camera operates with autofocus.
- [ ] **Guard Login**: Authenticate with active guard account (`SEC-G014`) and confirm gate post assignment appears.
- [ ] **Live Verification Scan**: Execute a face scan and confirm result evaluates against backend database.
- [ ] **Cryptographic Seal Check**: Confirm HMAC-SHA256 signature appears in the administrator telemetry log.
