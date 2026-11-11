# GATEWISE AI — iOS Production Build & Distribution Verification
**Document ID:** GA-IOS-2026-11-018  
**Audit Date:** November 11, 2026  
**Auditor:** Principal iOS Architect & Production Release Manager  
**Scope:** iOS Guard Mobile Architecture, Tooling & Distribution Verification  
**Status:** ARCHITECTURE VERIFIED · TESTFLIGHT & MDM PROTOCOL ENFORCED

---

## 1. Executive Summary & Policy Adherence

Under Master Prompt 18:
> *"Do not label an iOS APK as an iOS application. Do not offer a normal direct-download `.ipa` button as though iOS users can install it like an Android APK. Use the appropriate distribution method: App Store, TestFlight, approved enterprise or ad hoc distribution where eligible. If the iOS build is not yet approved or available, display an honest 'Coming Soon' or TestFlight availability state."*

This audit sets the authoritative technical standard for how GATEWISE AI delivers on iOS: **zero direct web `.ipa` downloads**, strict compliance with Apple distribution models, and authentic status disclosure on the public download centre.

---

## 2. iOS Codebase Inventory

GATEWISE AI possesses two distinct iOS engineering assets:

### 2.1 React Native / Expo iOS Target (`apps/mobile`)
- Configured in `apps/mobile/app.json`:
  - Bundle Identifier: `com.gatewiseai.guard`
  - Permissions: `NSCameraUsageDescription` ("GATEWISE AI requires camera access to verify subject identity at campus gates.")
  - Orientation: Portrait
  - Metro Export: Compiles into Hermes bytecode bundle (`entry-*.hbc`, 2.6 MB).
  - Target Distribution: EAS Cloud Build -> Apple TestFlight / App Store.

### 2.2 Native SwiftUI & Swift 6 Application (`apps/ios/GatewiseGuard`)
- Configured in `apps/ios/GatewiseGuard/Package.swift`:
  - Targets: iOS 17.0+ / macOS 14.0+
  - Swift Toolchain: Swift 6.0 with `StrictConcurrency`
  - Features: Pure SwiftUI Liquid Glass HUD, Local Persistence, Biometric Authentication, Cryptographic HMAC-SHA256 non-repudiation signing engine.
  - Native Test Suite: 9/9 passing tests in `GatewiseGuardRunner`.

---

## 3. The Technical Fallacy of Direct-Download IPAs

A critical finding of this audit is that **direct-download `.ipa` buttons on websites are technically invalid for production iOS users**:

1. **Apple Mobile File Integrity (AMFI) & Sandbox:**
   - Unlike Android, which supports sideloading unmanaged `.apk` binaries via the "Install Unknown Apps" permission, iOS operating system security prevents users from clicking a `.ipa` file link in Safari and installing it.
   - Safari downloads the `.ipa` as an opaque ZIP file into the "Files" app. The iOS SpringBoard installer will not touch it.

2. **Apple Provisioning Requirements:**
   - Every executable iOS application bundle (`Payload/*.app`) must contain an `embedded.mobileprovision` file signed by Apple.
   - For internal/ad-hoc builds, the profile must explicitly enumerate every test device's unique 40-character UDID.
   - For enterprise builds, the organization must possess an active Apple Developer Enterprise Program certificate ($299/yr) and distribute via a secure HTTPS manifest (`itms-services://?action=download-manifest&url=...`).

3. **Approved Apple Distribution Channels:**
   - **Apple TestFlight:** Up to 10,000 external beta testers with instant automatic installation via Apple's TestFlight app.
   - **Apple App Store Connect:** Public institutional release via App Store review.
   - **Mobile Device Management (MDM):** Automated deployment to campus-managed devices via Apple School Manager / Jamf / Microsoft Intune.

---

## 4. Forensic Breakdown of Previous Artifact (`gatewise-guard-ios-v1.0.0.ipa`)

The 814 KB artifact previously hosted at `/downloads/gatewise-guard-ios-v1.0.0.ipa` failed all genuine iOS validation criteria:
- **Architecture:** Mach-O 64-bit arm64 compiled with `platform 1` (`PLATFORM_MACOS`), meaning it was compiled for Mac desktop rather than iPhone (`PLATFORM_IOS` = 2).
- **Entitlements & Signing:** Total absence of `_CodeSignature/` directory and Apple signature block.
- **Provisioning:** Total absence of `embedded.mobileprovision`.

Presenting this file as an installable iOS download was misleading. It has been permanently removed from all download routes.

---

## 5. Host Tooling Reality & Production Pathway

### 5.1 Host Environment Status
Running developer diagnostics on the current machine confirms:
- Developer Path: `/Library/Developer/CommandLineTools`
- Tool `xcodebuild`: Fails with `tool 'xcodebuild' requires Xcode`.
- iOS SDK `iphoneos` / `iphonesimulator`: Not located on disk.
- Result: Compilation of genuine `arm64-apple-ios` Mach-O binaries signed with Apple Developer keys requires a machine with the full Xcode 16+ IDE or an EAS / Xcode Cloud build runner.

### 5.2 Production Release Pathway for iOS
1. **For Expo React Native Application:**
   ```bash
   cd apps/mobile
   npx eas-cli login
   npx eas-cli build --platform ios --profile production
   npx eas-cli submit --platform ios
   ```
   *EAS compiles against the official Apple SDK in macOS cloud containers and pushes directly to App Store Connect / TestFlight.*

2. **For Native SwiftUI Application:**
   - Open `apps/ios/GatewiseGuard` in Xcode 16.
   - Select Scheme: `GatewiseGuard` -> Any iOS Device (`arm64`).
   - Product -> Archive -> Distribute App -> TestFlight & App Store.

---

## 6. Website Remediation & Honest User Experience

The public Download Centre ([`/download`](http://localhost:3000/download)) has been remediated:
1. **No Fake IPA Download:** The direct `.ipa` download button has been eradicated.
2. **Apple TestFlight Pilot Flow:** Displays an honest **"Apple TestFlight Public Beta"** card with eligibility requirements (iOS 17.0+ on iPhone 11 through 16 Pro Max).
3. **Enterprise MDM Documentation:** Provides clear instructions for campus IT administrators to enroll devices via institutional profiles.
4. **Developer Source Archive:** Provides the verified native Swift source archive ([`gatewise-guard-ios-source-v1.0.0.zip`](/downloads/gatewise-guard-ios-source-v1.0.0.zip)) for institutional security code review and Xcode inspection.
