# GATEWISE AI — Android Guard Build Guide
**App Name:** GATEWISE AI  
**Package Identifier:** `com.gatewiseai.guard`  
**Framework:** React Native 0.74.5 · Expo SDK 51 · TypeScript · Hermes Engine  
**Release Output:** Signed Standalone Android Package (`.apk`)

---

## 1. Build Architecture & Profiles

The application configuration is defined in [`apps/mobile/app.json`](file:///Users/pritambiswas/antigravity/NORVA/apps/mobile/app.json) and [`apps/mobile/eas.json`](file:///Users/pritambiswas/antigravity/NORVA/apps/mobile/eas.json).

### Build Profile Matrix
| Profile | Target Distribution | Android Output | Target API Endpoint |
|---|---|---|---|
| `development` | Expo Go / Internal Dev | Debug APK | `http://10.0.2.2:8000/api/v1` |
| `preview` | Staging / Test Devices | Internal Signed APK | `https://staging-api.gatewiseai.internal/api/v1` |
| `production-apk` | Direct Institutional Distribution | Standalone Signed APK | `https://api.gatewiseai.internal/api/v1` |
| `production` | Google Play Store (Optional) | Android App Bundle (`.aab`) | `https://api.gatewiseai.internal/api/v1` |

---

## 2. Automated Production Release Build Command

To assemble and digitally sign the official production APK:

```bash
# Execute official production build and publication tool
python3 scripts/build_signed_release_apk.py
```

### Build Pipeline Steps:
1. **Hermes Bundle Export:** Metro Bundler exports pre-compiled Hermes bytecode (`dist_release/_expo/static/js/android/entry-*.hbc`).
2. **Signing Keystore Check:** Generates or loads the RSA-2048 institutional release certificate from `.signing_keys/`.
3. **APK Assembly:** Packages `AndroidManifest.xml` (`com.gatewiseai.guard`), Dalvik `classes.dex`, application assets, and icons.
4. **Digital Signature Injection:** Generates standard Android V1 JAR signing manifests in `META-INF/` (`MANIFEST.MF`, `CERT.SF`, `CERT.RSA`) signed via OpenSSL.
5. **Release Publication:** Emits artifact to [`apps/web/public/downloads/gatewise-guard-v1.0.0-release.apk`](file:///Users/pritambiswas/antigravity/NORVA/apps/web/public/downloads/gatewise-guard-v1.0.0-release.apk) and updates `apps/web/public/releases/android-release.json`.

---

## 3. Cloud Build Alternative (Expo EAS)

For institutions utilizing Expo Application Services (EAS):
```bash
# 1. Login to Expo EAS
npx eas login

# 2. Build Signed Standalone Production APK
cd apps/mobile && npx eas build --profile production-apk --platform android
```
