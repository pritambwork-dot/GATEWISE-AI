# GATEWISE AI — Security Guard Android Installation Guide
## Field Deployment & Checkpoint Terminal Setup

---

## 1. Prerequisites

Before installing the **GATEWISE Guard** application, verify that the mobile device meets the following hardware and software criteria:

- **Operating System**: Android 8.0 (Oreo / API Level 26) through Android 15.
- **Camera**: Rear-facing camera with autofocus and minimum 5MP resolution.
- **Storage**: At least 150 MB of free internal storage.
- **Network**: Perimeter WiFi or 4G LTE connectivity (offline buffer supports transient dropouts).
- **Credentials**: Active Security Guard Employee ID (e.g., `SEC-G014`) and password provided by campus security administration.

---

## 2. Step-by-Step Installation Instructions

### Step 1 — Open the Official Download Page
Open Google Chrome, Samsung Internet, or Firefox on the Android device and navigate to:
`https://gatewiseai.internal/download` (or scan the desktop QR code using your camera).

### Step 2 — Download the APK File
Tap the **Download APK** button. If Android displays a dialogue asking "File might be harmful. Do you want to download gatewise-guard.apk anyway?", tap **Download anyway**. This is standard for apps distributed outside Google Play.

### Step 3 — Open the Downloaded File
Once the download is complete:
- Pull down the Android notification bar and tap the completed download notification.
- Or open your device's **Files** or **My Files** app, navigate to **Downloads**, and tap the `.apk` file.

### Step 4 — Allow Installation from This Source
If your device displays a security prompt stating:
> *"For your security, your phone is not allowed to install unknown apps from this source."*

1. Tap **Settings** in the prompt dialogue.
2. Toggle the switch for **Allow from this source** to ON (for Chrome or Files only).
3. Tap the back button to return to the installer.
4. *Do not disable global device protections or bypass Google Play Protect.*

### Step 5 — Complete the Installation
Tap **Install** when the Package Installer asks *"Do you want to install this app?"*. Wait 5 to 10 seconds for the installation bar to finish, then tap **Open**.

### Step 6 — Grant Camera Permission
When GATEWISE AI launches for the first time, it will request permission:
> *"Allow GATEWISE AI to take pictures and record video?"*

Select **While using the app**. Camera access is strictly required to capture subject photographs for security verification.

### Step 7 — Sign In with Guard Credentials
Enter your institutional Employee ID (e.g. `SEC-G014`) and password. Upon sign-in:
- Your assigned gate station (e.g., `GATE-01 Main Campus Entrance`) will be displayed at the top.
- The status indicator will turn green: `Active On Duty`.
- Tap **Start Verification** to begin checkpoint operations.

---

## 3. Field Troubleshooting FAQ

| Problem | Probable Cause | Corrective Action |
|---|---|---|
| **"App Not Installed"** | An existing development version is already on the phone with a mismatched debug signature. | Uninstall any previous GATEWISE AI app from the phone, restart the device, and reinstall the production APK. |
| **"Camera Black Screen"** | Camera permission was denied on first launch. | Go to Android Settings &rarr; Apps &rarr; GATEWISE AI &rarr; Permissions &rarr; Camera &rarr; Select "Allow while using the app". |
| **"Station Not Assigned"** | Officer is not currently assigned to an active checkpoint. | Contact the Chief Security Officer via the Admin Portal to assign your guard account to a specific gate shift. |
| **"Offline Mode (Amber Dot)"** | Perimeter WiFi or cellular signal dropped. | Continue normal verifications. The app caches embeddings and visitor passes locally. Logs will automatically synchronize once the network reconnects. |
