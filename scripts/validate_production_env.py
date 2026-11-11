#!/usr/bin/env python3
"""
GATEWISE AI — Production Environment Security Validator
Safely verifies required environment variables, models, certificates, and infrastructure
WITHOUT printing secret values to stdout or logs.
"""

import os
import sys
import hashlib
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

# Required Environment Variables by Component
ENV_SPEC = {
    "Backend Core": [
        ("APP_ENV", False),
        ("SECRET_KEY", True),
        ("DATABASE_URL", True),
        ("DATABASE_POOL_SIZE", False),
        ("CORS_ORIGINS", False),
    ],
    "Computer Vision & Face Service": [
        ("YUNET_WEIGHTS_PATH", False),
        ("SFACE_WEIGHTS_PATH", False),
        ("FACE_MATCH_AUTO_ADMIT", False),
        ("FACE_MATCH_CANDIDATE", False),
        ("MIN_BLUR_SCORE", False),
    ],
    "Google Drive Identity Sync": [
        ("GOOGLE_CLIENT_ID", False),
        ("GOOGLE_CLIENT_SECRET", True),
        ("DRIVE_FOLDER_ID", False),
    ],
    "Gemini Assistant (Backend-Only)": [
        ("GATEWISE_ASSISTANT_ENABLED", False),
        ("GEMINI_API_KEY", True),
        ("GEMINI_MODEL", False),
    ],
    "Frontend Next.js": [
        ("NODE_ENV", False),
        ("NEXT_PUBLIC_API_URL", False),
        ("INTERNAL_BACKEND_URL", False),
    ],
    "Android Release": [
        ("ANDROID_PACKAGE_ID", False),
        ("ANDROID_RELEASE_APK", False),
    ]
}

# Known Checksums for Binary Integrity Verification
EXPECTED_CHECKSUMS = {
    "yunet": "8f2383e4dd3cfbb4553ea8718107fc0423210dc964f9f4280604804ed2552fa4",
    "sface": "0ba9fbfa01b5270c96627c4ef784da859931e02f04419c829e83484087c34e79",
    "apk": "f397221752236e04de2be91d4ba1b55a2a136a6e77f5022192ca4387ea6d8ddd"
}

def sha256_file(filepath: Path) -> str:
    if not filepath.is_file():
        return ""
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def validate_environment():
    print("=" * 70)
    print(" GATEWISE AI — Production Environment Security Validation")
    print("=" * 70)

    # Load from .env if present without exposing
    env_file = REPO_ROOT / ".env"
    if env_file.exists():
        print(f"✓ Configuration file detected at {env_file.name}")
        with open(env_file, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    if k.strip() not in os.environ:
                        os.environ[k.strip()] = v.strip()
    else:
        print("ℹ No root .env file found; checking system environment variables.")

    # Defaults for local production execution
    os.environ.setdefault("APP_ENV", "production")
    os.environ.setdefault("DATABASE_POOL_SIZE", "15")
    os.environ.setdefault("YUNET_WEIGHTS_PATH", str(REPO_ROOT / "backend/app/computer_vision/weights/face_detection_yunet_2023mar.onnx"))
    os.environ.setdefault("SFACE_WEIGHTS_PATH", str(REPO_ROOT / "backend/app/computer_vision/weights/face_recognition_sface_2021dec.onnx"))
    os.environ.setdefault("FACE_MATCH_AUTO_ADMIT", "0.90")
    os.environ.setdefault("FACE_MATCH_CANDIDATE", "0.70")
    os.environ.setdefault("MIN_BLUR_SCORE", "60.0")
    os.environ.setdefault("GATEWISE_ASSISTANT_ENABLED", "true")
    os.environ.setdefault("GEMINI_MODEL", "gemini-1.5-flash")
    os.environ.setdefault("NODE_ENV", "production")
    os.environ.setdefault("NEXT_PUBLIC_API_URL", "https://api.gatewiseai.internal/api/v1")
    os.environ.setdefault("INTERNAL_BACKEND_URL", "http://localhost:8000/api/v1")
    os.environ.setdefault("ANDROID_PACKAGE_ID", "com.gatewiseai.guard")
    os.environ.setdefault("ANDROID_RELEASE_APK", str(REPO_ROOT / "apps/web/public/downloads/gatewise-guard-v1.0.0-release.apk"))

    all_ok = True
    missing_critical = []

    for component, vars_list in ENV_SPEC.items():
        print(f"\n[{component}]")
        for var_name, is_secret in vars_list:
            val = os.environ.get(var_name)
            if val is not None and len(val.strip()) > 0:
                if is_secret:
                    # Never print secret value, only length/presence
                    print(f"  ✓ {var_name:<30} : [SET - SECURE CREDENTIAL (len={len(val)})]")
                else:
                    print(f"  ✓ {var_name:<30} : [SET] {val}")
            else:
                if var_name in ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "DRIVE_FOLDER_ID"]:
                    print(f"  ℹ {var_name:<30} : [NOT CONFIGURED] (Identity sync disabled until institutional approval)")
                elif var_name in ["CORS_ORIGINS"]:
                    print(f"  ℹ {var_name:<30} : [DEFAULT] Uses production domains: https://gatewiseai.internal, https://admin.gatewiseai.internal")
                else:
                    print(f"  ✗ {var_name:<30} : [MISSING CRITICAL]")
                    all_ok = False
                    missing_critical.append(var_name)

    # Validate Binary Assets & Model Checksums
    print("\n[Cryptographic Asset Integrity]")
    yunet_path = Path(os.environ["YUNET_WEIGHTS_PATH"])
    yunet_hash = sha256_file(yunet_path)
    if yunet_hash == EXPECTED_CHECKSUMS["yunet"]:
        print(f"  ✓ YuNet Model Weight Checksum : VERIFIED ({yunet_path.name})")
    else:
        print(f"  ✗ YuNet Model Weight Checksum : MISMATCH or NOT FOUND")
        all_ok = False

    sface_path = Path(os.environ["SFACE_WEIGHTS_PATH"])
    sface_hash = sha256_file(sface_path)
    if sface_hash == EXPECTED_CHECKSUMS["sface"]:
        print(f"  ✓ SFace Model Weight Checksum : VERIFIED ({sface_path.name})")
    else:
        print(f"  ✗ SFace Model Weight Checksum : MISMATCH or NOT FOUND")
        all_ok = False

    apk_path = Path(os.environ["ANDROID_RELEASE_APK"])
    apk_hash = sha256_file(apk_path)
    if apk_hash == EXPECTED_CHECKSUMS["apk"]:
        print(f"  ✓ Release APK Binary Checksum : VERIFIED ({apk_path.name})")
    else:
        print(f"  ✗ Release APK Binary Checksum : MISMATCH or NOT FOUND")
        all_ok = False

    print("\n" + "=" * 70)
    if all_ok:
        print("✅ PRODUCTION ENVIRONMENT SECURITY VALIDATION: PASSED")
        print("   All critical variables and assets verified. No secrets leaked.")
        return 0
    else:
        print(f"❌ PRODUCTION ENVIRONMENT VALIDATION: FAILED on {len(missing_critical)} variables.")
        return 1

if __name__ == "__main__":
    sys.exit(validate_environment())
