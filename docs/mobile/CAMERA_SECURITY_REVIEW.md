# GATEWISE AI — Mobile Camera Security & Biometric Privacy Review
## Biometric Ingestion Governance · Hardware Boundary Isolation · Zero-Leakage Architecture

### 1. Security & Privacy Executive Summary
The GATEWISE Guard Android application handles sensitive facial biometrics at campus entry points. Biometric data ingestion carries severe regulatory, institutional, and human rights responsibilities (e.g., India's Digital Personal Data Protection Act, ISO/IEC 30107-3 PAD compliance).

This security review certifies that the mobile camera subsystem adheres to an **Extreme Privacy Architecture**:
1. Zero saving to the public Android gallery or external media storage.
2. Complete absence of audio recording capabilities (`recordAudioAndroid: false`).
3. Total physical and architectural isolation between biometric face representations and external AI/LLM services (Gemini).
4. Ephemeral volatile memory lifecycle for all transient image frames.

---

### 2. Biometric Ingestion Boundary Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ANDROID GUARD DEVICE                            │
│                                                                        │
│  [CameraView]  ──(Single Still)──>  [Private Cache]                    │
│                                           │                            │
│                                    (Base64 in RAM)                     │
│                                           │                            │
│  [Zero Gallery]    [Zero Audio]           ▼                            │
│  (CameraRoll=0)    (Mic Disabled)   [HTTPS TLS 1.3]                    │
└───────────────────────────────────────────┬────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FASTAPI CORE BACKEND                            │
│                                                                        │
│                     ┌───────────────────────────┐                      │
│                     │ YuNet Face Detector       │                      │
│                     │ SFace 128D Embedding      │                      │
│                     │ Cosine Vector Similarity  │                      │
│                     └─────────────┬─────────────┘                      │
│                                   │                                    │
│                                   ▼                                    │
│                     ┌───────────────────────────┐                      │
│                     │ HMAC-SHA256 Non-Repudiation│                     │
│                     │ Cryptographic Audit Seal  │                      │
│                     └───────────────────────────┘                      │
│                                                                        │
│   ❌ BIOMETRICS NEVER SENT TO GEMINI / EXTERNAL LLMS                   │
│   (Gemini is strictly scoped to textual SOP rulebook queries)          │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Detailed Security Audits

#### 3.1 Public Gallery & Media Storage Isolation
- **Risk:** Unintentional leakage of subject photographs to Google Photos, Android MediaStore, or backup sync services.
- **Audit Verification:**
  - Neither `expo-media-library` nor `react-native-cameraroll` is installed in `package.json`.
  - `CameraView.takePictureAsync` saves exclusively to the application-private cache directory:
    `/data/user/0/com.gatewiseai.guard/cache/Camera/...`
  - This directory is protected by Android sandbox UID enforcement; other apps on the device cannot access these files.
  - Temporary cache files are cleared immediately following verification commitment or retake.

#### 3.2 Microphone & Audio Eavesdropping Prevention
- **Risk:** Accidental activation of microphone recording during identity capture, violating consent laws.
- **Audit Verification:**
  - `apps/mobile/app.json` explicitly declares:
    ```json
    [
      "expo-camera",
      {
        "cameraPermission": "GATEWISE AI requires camera access to capture subject photographs for security verification.",
        "recordAudioAndroid": false
      }
    ]
    ```
  - In Android Manifest generation, the `RECORD_AUDIO` permission is completely stripped.
  - The Android system privacy dashboard (green dot microphone indicator) never activates when GATEWISE Guard is running.

#### 3.3 Server-Side Facial Biometrics Isolation
- **Risk:** Reverse-engineering of biometric templates or on-device model tampering.
- **Audit Verification:**
  - Zero biometric facial recognition models (YuNet/SFace) are bundled inside the APK.
  - The mobile device acts strictly as a secure acquisition terminal; all face detection, landmark alignment, and 128-dimensional embedding generation occur on the secured institutional backend.
  - Even if an attacker gains root access to an Android device, no biometric enrolled database or facial embeddings can be extracted from the APK.

#### 3.4 Separation of Biometrics from Gemini & External LLMs
- **Risk:** Transmission of facial photographs or biometric embeddings to public multimodal LLM APIs.
- **Audit Verification:**
  - The Google Gemini API integration in `backend/app/services/sop_assistant.py` and `ProfileService` is **strictly restricted to text-based Standard Operating Procedures (SOP)** queries (e.g., protocol for delivery vehicles, contractor rules, VIP convoys).
  - Biometric vectors, facial crops, subject identities, and camera frames are **never passed** to Gemini or any external cloud LLM.
  - Verified by inspection of all API payloads and network intercept logs.

---

### 4. Security Verification Checklist

| Security Control | Implementation Standard | Status | Verified By |
| :--- | :--- | :--- | :--- |
| **SEC-CAM-01** | `recordAudioAndroid: false` in `app.json` | **VERIFIED** | Manifest inspection |
| **SEC-CAM-02** | Zero media-library / CameraRoll permissions | **VERIFIED** | `package.json` audit |
| **SEC-CAM-03** | Private app cache storage for still frames | **VERIFIED** | Filesystem path review |
| **SEC-CAM-04** | Ephemeral RAM deletion post-verification | **VERIFIED** | `VerificationContext` |
| **SEC-CAM-05** | Biometrics isolated from Gemini API | **VERIFIED** | Network traffic log |
| **SEC-CAM-06** | TLS 1.3 encrypted transport for Base64 payload | **VERIFIED** | `api-client.ts` |
| **SEC-CAM-07** | HMAC-SHA256 tamper-proof decision sealing | **VERIFIED** | `test_device_workflow.py` |

---

### 5. Conclusion
The camera subsystem meets the highest standards of defense-grade security and institutional privacy. It strictly confines camera access to single still-frame captures, maintains private sandboxing, and prevents any biometric leakage.
