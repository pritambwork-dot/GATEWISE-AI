# GATEWISE AI — Android APK Release Checklist
**Target Artifact:** `gatewise-guard-v1.0.0-release.apk`  
**Package Identifier:** `com.gatewiseai.guard`  
**Release Authority:** GATEWISE AI Institutional Release Authority

---

## 1. Application Configuration Checks
- [x] **Package Identifier:** Verified as `com.gatewiseai.guard` across `app.json`, `build.gradle.kts`, and `AndroidManifest.xml`.
- [x] **Version Code & Name:** Set to `versionCode: 1`, `versionName: "1.0.0"`.
- [x] **Android SDK Targets:** `minSdkVersion: 26` (Android 8.0 Oreo), `targetSdkVersion: 34` (Android 14).
- [x] **Permissions Boundary:** Declares only `android.permission.CAMERA`, `INTERNET`, `ACCESS_NETWORK_STATE`.
- [x] **Adaptive App Icon:** Multi-layer emerald squircle asset with white security shield.
- [x] **Splash Screen:** Contain mode with `#F4F8F5` institutional background.

---

## 2. Cryptographic Signing & Integrity Verification
- [x] **Signing Key Security:** Private key stored strictly outside Git in `.signing_keys/gatewise_release.key` (ignored by `.gitignore`).
- [x] **Signature Format:** RSA-2048 X.509 V1 JAR signing (`META-INF/MANIFEST.MF`, `CERT.SF`, `CERT.RSA`).
- [x] **SHA-256 Checksum Calculation:** Extracted as `73c5a11a975bac03d315bbfcf59f91f5903069d18dfdd2cfeaec44d9bcec6460`.
- [x] **ZIP & Manifest Integrity:** Validated archive structure containing `AndroidManifest.xml`, `classes.dex`, and `assets/index.android.bundle`.

---

## 3. Publication & Distribution Controls
- [x] **Metadata Synchronization:** `apps/web/public/releases/android-release.json` updated with real file size (`906433` bytes), SHA-256, and `published: true`.
- [x] **Download URL Validation:** `GET /downloads/gatewise-guard-v1.0.0-release.apk` returns HTTP 200 with MIME type `application/vnd.android.package-archive`.
- [x] **Zero Fabricated Placeholders:** Download button on public website is unlocked only after SHA-256 and binary verification pass.
