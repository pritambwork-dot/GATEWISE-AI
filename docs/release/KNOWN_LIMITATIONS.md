# GATEWISE AI 1.0 — Known Limitations & Operational Bounds
**Institutional Security & Environmental Guidelines**  
*Release Version: 1.0.0 | Date: November 2026*

---

## 1. Computer Vision & Environmental Boundaries

### 1.1 Ambient Lighting & Illumination
- **Minimum Illumination:** Low-light environments ($< 40\,\text{lux}$) require the guard to engage the terminal flashlight toggle or ensure gate canopy illumination is active.
- **Direct Backlighting:** Direct blinding sunlight behind the subject (e.g. western sun at Gate 02 during sunset) can cause facial silhouettes. Guards must orient the terminal at an angle to avoid direct lens flare.
- **Motion Blur:** Subjects moving rapidly past the camera will trigger the Laplacian blur filter ($< 60.0$) and be asked to pause momentarily.

### 1.2 Facial Geometry & Occlusions
- **Pose Angle:** Face detection (YuNet) operates optimally within $\pm 35^\circ$ yaw and pitch. Subjects looking severely downward at phones or turned sideways will require repositioning.
- **Facial Coverings:** Thin prescription eyeglasses are supported. Heavy opaque sunglasses, motorcycle helmets, or surgical masks covering the nose and mouth obstruct landmark alignment and require removal for verification.
- **Single-Subject Policy:** The system enforces a strict single-face constraint. If multiple people crowd the frame, the verification is rejected (`Multiple faces detected in frame`) to ensure each entrant is individually accounted for.

---

## 2. Infrastructure & Offline Operation

### 2.1 Offline Local Buffering
- Mobile guard terminals support autonomous offline verification using cached embeddings in local storage.
- The local event queue safely holds up to **2,500 un-synced events** per device. When reconnection to the campus Wi-Fi or 4G/5G private network occurs, the terminal automatically reconciles events with the central backend.
- Guards are notified via a prominent amber badge on the status bar when operating in offline mode.

### 2.2 Google Drive Synchronization Frequency
- Background synchronization of enrolled photos from Google Drive occurs on a **15-minute polling cadence** to adhere to institutional Google Workspace API quota limits.
- If a Registrar enrolls a new student who requires immediate gate admittance, an administrator can execute an immediate forced sync via the Desktop Admin Portal (`/admin/repository` -> `Sync Now`).

---

## 3. Recommended Hardware Specifications

| Component | Minimum Specification | Recommended Production Standard |
| :--- | :--- | :--- |
| **Terminal Device** | Android 10 (API 29), 3GB RAM | Android 13/14, 6GB+ RAM (Samsung Galaxy Tab Active4 Pro) |
| **Camera Sensor** | 8 MP, Auto-Focus, $720\text{p}@30\text{fps}$ | 13 MP, Fast Phase-Detection AF, Dual Flash |
| **Network** | 4G LTE or Campus Wi-Fi 5 | Dual-SIM 5G + WPA3 Institutional Enterprise Wi-Fi 6 |
| **Casing** | Standard protective case | MIL-STD-810H ruggedized bumper with hand strap |
