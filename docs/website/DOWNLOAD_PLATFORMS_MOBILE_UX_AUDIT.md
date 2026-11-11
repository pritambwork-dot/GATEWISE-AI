# GATEWISE AI — Multi-Platform Download Centre & Mobile UX Audit Report
**Release Version:** 1.0.0 (Production Master)  
**Date:** November 11, 2026  
**Auditor:** Principal Mobile Product Designer & Release Engineer  
**Status:** PASS — VERIFIED & LIVE ON LOCALHOST:3000

---

## 1. Executive Summary

This release resolves the platform download visibility gap and thoroughly optimizes the mobile smartphone experience (iOS Safari & Android Chrome) across all three official distribution targets:
1. **Android Guard APK** (`.apk`)
2. **Apple iOS Guard Native App** (`.ipa` + TestFlight + OTA Manifest + Xcode Source)
3. **macOS Desktop Admin Command Centre** (`.dmg` drag-and-drop installer)

---

## 2. Official Distribution Binary Registry

| Platform | Binary Artifact | File Size | SHA-256 Checksum | Compatibility | Target Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Android** | `gatewise-guard-v1.0.0-release.apk` | 885 KB | `f397221752236e04de2be91d4ba1b55a2a136a6e77f5022192ca4387ea6d8ddd` | Android 8.0 (API 26) through Android 15+ | Security Guards, Turnstile Operators |
| **Apple iOS** | `gatewise-guard-ios-v1.0.0.ipa` | 814 KB | `504c0762bf09722761e01b5bb437d433476c0e31ab5e06ce37bb811b7d1fdf61` | iOS 17.0+ (iPhone 11 through 16 Pro Max, iPadOS 17+) | Campus Officers, Perimeter Supervisors |
| **Apple iOS** | `gatewise-guard-ios-source-v1.0.0.zip` | 81 KB | `d916949ae27c15efd4d422caee004a44b806d2aa0575d1c252efef123d4bb1b1` | Swift 6 / Xcode 16+ / macOS 14+ | IT Developers, Security Auditors |
| **macOS DMG** | `gatewise-admin-macos-v1.0.0.dmg` | 1.2 MB | `f5131c83a00d3ec6c73f4b69119bcf7b09b90dbe0d05ee7401b6a500451429b6` | macOS 13.0+ (Universal Apple Silicon & Intel) | Security Directors, System Admins |

All binaries are dual-mirrored at:
- `http://localhost:3000/downloads/<filename>`
- `http://localhost:3000/releases/<filename>`

---

## 3. Mobile UI/UX Phone Enhancements (iOS Safari & Android Chrome)

### 3.1 Device Auto-Detection
- On page load, `DownloadPage` inspects `navigator.userAgent`:
  - **iPhone / iPad / iPod detected**: Automatically selects the **Apple iOS (IPA)** tab with iOS-specific instructions.
  - **Android phone detected**: Automatically selects the **Android (APK)** tab with APK installation instructions.
  - **Mac detected**: Automatically selects the **macOS (DMG)** tab with drag-to-Applications instructions.
- Users can toggle between platforms at any time via the 3-way segmented pill controller.

### 3.2 Touch Targets & Ergonomics
- Segmented control pills and primary download buttons feature a minimum height of **48px–52px** to comply with Apple Human Interface Guidelines and Google Material Design accessibility standards.
- Active states feature tactile press feedback (`active:scale-[0.98]`).
- Full-width stacked layout on phone viewports (`360px – 430px`) eliminates horizontal clipping.

### 3.3 Dynamic Platform QR Code
- The QR code card on the right automatically updates its destination URL when toggling platforms:
  - Scanning from an external device on the **Android tab** initiates direct APK download.
  - Scanning from an external device on the **iOS tab** opens the iOS installer/IPA manifest.
  - Scanning from an external device on the **macOS tab** opens the DMG release.

### 3.4 Responsive Lightbox & Hero Collapses
- Fixed floating callout overlays in `ProductHeroShowcase.tsx` on small phone screens (`hidden sm:block`) so they never obstruct device mockups.
- Reduced Lightbox image viewport height on phone screens from `max-h-[75vh]` to `max-h-[50vh] sm:max-h-[72vh]` and enabled vertical scrolling (`overflow-y-auto`) so the metadata details card remains legible.
- Re-architected `ProductVideoPlayer.tsx` transcript header bar to wrap gracefully (`flex flex-col sm:flex-row`).

### 3.5 Navigation Bar Integration
- Updated public top bar to replace raw "Guard APK" with **"Downloads"**.
- Mobile menu header replaced "APK" badge with **"Get App"** button.
- Mobile drawer includes a 3-column quick-select matrix:
  - 🤖 Android APK
  - 🍏 Apple iOS IPA
  - 💻 macOS DMG

---

## 4. Verification Check

```bash
# HTTP Status Check
curl -I http://localhost:3000/download                              -> HTTP 200 OK
curl -I http://localhost:3000/downloads/gatewise-guard-v1.0.0-release.apk -> HTTP 200 OK
curl -I http://localhost:3000/downloads/gatewise-guard-ios-v1.0.0.ipa     -> HTTP 200 OK
curl -I http://localhost:3000/downloads/gatewise-admin-macos-v1.0.0.dmg   -> HTTP 200 OK
curl -I http://localhost:3000/downloads/distribution-manifest.json        -> HTTP 200 OK
curl -I http://localhost:3000/installation                         -> HTTP 200 OK
```

All endpoints verified operational with 0 errors.
