# GATEWISE AI 1.0 — Android APK Release & Distribution Process
## Release Engineering, Signing Identity & Verification Workflow

---

## 1. Overview & Principles

The **GATEWISE Guard** Android application (`com.gatewiseai.guard`) is distributed to authorized institutional security personnel via signed APK binaries published through the official download centre.

To preserve user trust and security:
- **No Unverified Downloads**: The download button is active only when an official production binary has been built, cryptographically verified, and published.
- **Signing Key Preservation**: Application updates must preserve the identical Android keystore and signing identity to allow in-place updates on guard terminals.
- **Strict Package Identifier**: The package identifier must remain `com.gatewiseai.guard`.
- **Zero Sideloading of Dev Builds**: Development client builds or internal staging URLs must never be published to public download endpoints.

---

## 2. EAS Build Profiles (`apps/mobile/eas.json`)

The EAS build configuration maintains four discrete profiles:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "development",
      "android": { "buildType": "apk" }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview",
      "android": { "buildType": "apk" }
    },
    "production-apk": {
      "distribution": "internal",
      "channel": "production",
      "android": { "buildType": "apk" },
      "env": {
        "APP_ENV": "production",
        "API_URL": "https://api.gatewiseai.internal/api/v1"
      }
    },
    "production": {
      "channel": "production",
      "android": { "buildType": "app-bundle" }
    }
  }
}
```

- **`production-apk`**: Builds a signed standalone release APK configured with production environment variables for direct institutional download.
- **`production`**: Builds an Android App Bundle (`.aab`) for Google Play Console submission if required.

---

## 3. End-to-End Release Pipeline

```
  1. CODE FREEZE & VERSION BUMP
     apps/mobile/app.json -> increment versionCode & versionName
     git tag v1.0.0
       │
       ▼
  2. BUILD PRODUCTION APK (EAS)
     eas build --platform android --profile production-apk
       │
       ▼
  3. DOWNLOAD ARTIFACT
     Download output APK file: gatewise-guard-v1.0.0.apk
       │
       ▼
  4. RUN VERIFICATION TOOL
     scripts/verify_and_publish_apk.py <path-to-apk> \
       --version-name 1.0.0 \
       --version-code 1 \
       --download-url https://cdn.gatewiseai.internal/releases/gatewise-guard-v1.0.0.apk
       │
       ▼
  5. VERIFY CHECKSUM & PACKAGE ID
     Tool inspects ZIP structure, AndroidManifest.xml, classes.dex, META-INF signatures
     Computes SHA-256 binary hash
       │
       ▼
  6. APPROVE & PUBLISH METADATA
     scripts/verify_and_publish_apk.py <path-to-apk> --publish
     Updates apps/web/public/releases/android-release.json
       │
       ▼
  7. WEBSITE DOWNLOAD ACTIVATES
     /download reads published: true and enables the verified download CTA
```

---

## 4. Release Metadata Schema (`android-release.json`)

```json
{
  "application": "GATEWISE AI",
  "platform": "android",
  "release_channel": "production",
  "published": true,
  "version_name": "1.0.0",
  "version_code": 1,
  "minimum_android_version": "Android 8.0 (API 26)+",
  "file_name": "gatewise-guard-v1.0.0.apk",
  "file_size_bytes": 48512400,
  "download_url": "https://cdn.gatewiseai.internal/releases/gatewise-guard-v1.0.0.apk",
  "sha256": "8a4f91e32d0c1589b4f2c00a4e76d542ef891024bc681b9e289387216a491ef2",
  "release_date": "2026-11-10",
  "release_notes": [
    "Initial institutional release of GATEWISE AI Guard application.",
    "Single-shot camera capture with YuNet face detection and SFace 128-D embedding.",
    "Decoupled clearance evaluation separating identity match from gate authorization.",
    "Cryptographic HMAC-SHA256 non-repudiation sealing."
  ],
  "package_identifier": "com.gatewiseai.guard",
  "verification_status": "PUBLISHED_OFFICIAL"
}
```

---

## 5. Security & Secret Safeguards

1. **Keystore Protection**:
   - The production Android keystore (`.keystore` / `.jks`) and passwords must never be committed to Git.
   - Use EAS Secret Manager or cloud HSM for production credentials.
2. **Signature Verification**:
   - Every APK must contain valid digital signatures in `META-INF/` (v1/v2/v3 signing).
3. **Admin Publication Guard**:
   - The backend endpoint `POST /api/v1/releases/android/publish` is guarded by role-based access control, requiring `ADMIN` or `SUPER_ADMIN` credentials.
