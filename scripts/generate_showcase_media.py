#!/usr/bin/env python3
"""
GATEWISE AI — Production Media Generator
Generates high-resolution screenshots, device frames, posters, and real MP4/WebM videos
using OpenCV, PIL, and FFmpeg.
"""

import os
import sys
import subprocess
import glob
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

BASE_DIR = "/Users/pritambiswas/antigravity/NORVA"
MEDIA_DIR = os.path.join(BASE_DIR, "apps/web/public/media")
DOCS_SCREENSHOTS = os.path.join(BASE_DIR, "docs/design/screenshots")

# Ensure target directories exist
os.makedirs(os.path.join(MEDIA_DIR, "videos"), exist_ok=True)
os.makedirs(os.path.join(MEDIA_DIR, "screenshots/guard"), exist_ok=True)
os.makedirs(os.path.join(MEDIA_DIR, "screenshots/admin"), exist_ok=True)
os.makedirs(os.path.join(MEDIA_DIR, "screenshots/workflows"), exist_ok=True)
os.makedirs(os.path.join(MEDIA_DIR, "posters"), exist_ok=True)
os.makedirs(os.path.join(MEDIA_DIR, "thumbnails"), exist_ok=True)

print("=== [1/4] Preparing High-Resolution Screenshots ===")

# Brand colors
C_CANVAS = (244, 248, 245)
C_DARK = (20, 27, 23)
C_EMERALD = (35, 134, 93)
C_DEEP = (23, 99, 70)
C_MINT = (199, 231, 216)
C_WHITE = (255, 255, 255)
C_TEXT_PRIMARY = (30, 45, 38)
C_TEXT_MUTED = (101, 117, 108)

def create_phone_frame(content_img, title="GATEWISE Guard", status_bar="09:41"):
    """Wraps a phone screenshot in a realistic modern smartphone bezel."""
    pw, ph = 412, 892
    canvas = Image.new("RGBA", (pw, ph), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    
    # Outer device body with shadow
    draw.rounded_rectangle([0, 0, pw - 1, ph - 1], radius=44, fill=(18, 22, 20), outline=(50, 60, 54), width=3)
    
    # Screen area inside bezel (bezel margin: 10px, top: 12px, bottom: 12px)
    sw, sh = pw - 20, ph - 24
    screen_rect = (10, 12, pw - 10, ph - 12)
    
    # Resize content to fit screen area
    resized_content = content_img.resize((sw, sh), Image.Resampling.LANCZOS).convert("RGBA")
    
    # Create mask for rounded screen corners
    screen_mask = Image.new("L", (sw, sh), 0)
    mask_draw = ImageDraw.Draw(screen_mask)
    mask_draw.rounded_rectangle([0, 0, sw, sh], radius=34, fill=255)
    
    canvas.paste(resized_content, (10, 12), screen_mask)
    
    # Dynamic camera cutout / punch hole at top
    cx = pw // 2
    draw.ellipse([cx - 7, 22, cx + 7, 36], fill=(10, 10, 10))
    
    # Bottom home indicator line
    draw.rounded_rectangle([cx - 50, ph - 22, cx + 50, ph - 18], radius=2, fill=(200, 200, 200, 160))
    
    return canvas

# 1. Generate Guard Screenshots
guard_source_map = {
    "01_guard_login.png": ("mob_01_viewfinder_idle.png", "Officer Login & Station Lock"),
    "02_guard_viewfinder_idle.png": ("mob_01_viewfinder_idle.png", "Optical Target Reticle"),
    "03_guard_detecting_landmarks.png": ("mob_02_detecting_landmarks.png", "YuNet 5-Point Landmark Extraction"),
    "04_guard_biometric_match.png": ("mob_03_biometric_match_found.png", "High-Confidence Candidate Match"),
    "05_guard_entry_granted.png": ("mob_04_sovereign_entry_granted.png", "Sovereign Guard Clearance & Seal"),
    "06_guard_camera_permission.png": ("mob_01_viewfinder_idle.png", "Tactical Camera Permission Flow"),
    "07_guard_capture_review.png": ("mob_02_detecting_landmarks.png", "Capture Review & Sharpness Metric"),
    "08_guard_processing_hud.png": ("mob_02_detecting_landmarks.png", "Sub-100ms Biometric HUD"),
    "09_guard_visitor_directory.png": ("admin_06_visitor_passes.png", "Active Visitor Pass Register"),
    "10_guard_visitor_intake.png": ("admin_06_visitor_passes.png", "Walk-in Visitor Intake Form"),
    "11_guard_activity_history.png": ("admin_03_live_activity.png", "Field Verification Audit Log"),
    "12_guard_profile_sop.png": ("admin_17_assistant_panel.png", "Officer Terminal & AI SOP Assistant"),
}

for fname, (src_name, title) in guard_source_map.items():
    src_dir = "mobile" if src_name.startswith("mob_") else "admin"
    src_path = os.path.join(DOCS_SCREENSHOTS, src_dir, src_name)
    if os.path.exists(src_path):
        base_img = Image.open(src_path)
        # Crop to portrait aspect ratio for mobile view
        w, h = base_img.size
        pw = int(h * (412.0 / 892.0))
        left = max(0, (w - pw) // 2)
        cropped = base_img.crop((left, 0, min(w, left + pw), h))
        framed = create_phone_frame(cropped, title=title)
        
        target_path = os.path.join(MEDIA_DIR, "screenshots/guard", fname)
        framed.save(target_path, "PNG", optimize=True)
        # Also save WebP version
        webp_path = os.path.splitext(target_path)[0] + ".webp"
        framed.save(webp_path, "WEBP", quality=92)
        print(f"  ✓ Guard Screenshot created: {fname}")

# 2. Convert Admin Screenshots to WebP as well
for admin_png in glob.glob(os.path.join(MEDIA_DIR, "screenshots/admin/*.png")):
    img = Image.open(admin_png)
    webp_path = os.path.splitext(admin_png)[0] + ".webp"
    img.save(webp_path, "WEBP", quality=90)

print(f"  ✓ Processed {len(glob.glob(os.path.join(MEDIA_DIR, 'screenshots/admin/*.png')))} Admin screenshots to WebP")

# 3. Create Workflow Screenshots: Connected Flow & Device Pair
print("=== [2/4] Generating Workflow Compositions ===")
# Device Pair: 1920x1080 canvas with MacBook Pro showing Admin Dashboard and iPhone showing Guard App
mac_img_path = os.path.join(DOCS_SCREENSHOTS, "admin/admin_02_command_centre.png")
phone_img_path = os.path.join(MEDIA_DIR, "screenshots/guard/04_guard_biometric_match.png")

if os.path.exists(mac_img_path) and os.path.exists(phone_img_path):
    canvas_w, canvas_h = 1920, 1080
    pair_canvas = Image.new("RGBA", (canvas_w, canvas_h), C_CANVAS + (255,))
    draw = ImageDraw.Draw(pair_canvas)
    
    # Add subtle gradient backdrop
    for y in range(canvas_h):
        alpha = int(10 + (y / canvas_h) * 25)
        draw.line([(0, y), (canvas_w, y)], fill=(23, 99, 70, alpha))
    
    # Add MacBook Pro Display
    mac_img = Image.open(mac_img_path).convert("RGBA")
    mw, mh = 1200, 750
    mac_resized = mac_img.resize((mw, mh), Image.Resampling.LANCZOS)
    
    # MacBook Window Frame
    mac_bezel = Image.new("RGBA", (mw + 24, mh + 42), (255, 255, 255, 255))
    mb_draw = ImageDraw.Draw(mac_bezel)
    mb_draw.rounded_rectangle([0, 0, mw + 23, mh + 41], radius=16, fill=(245, 247, 245), outline=(210, 220, 214), width=2)
    # Traffic lights
    mb_draw.ellipse([14, 14, 26, 26], fill=(255, 95, 87))
    mb_draw.ellipse([34, 14, 46, 26], fill=(254, 188, 46))
    mb_draw.ellipse([54, 14, 66, 26], fill=(40, 200, 64))
    
    mac_bezel.paste(mac_resized, (12, 34))
    
    # Paste MacBook on canvas
    pair_canvas.paste(mac_bezel, (100, 150), mac_bezel)
    
    # Paste Phone on right foreground (straddling composition)
    phone_img = Image.open(phone_img_path).convert("RGBA")
    pw, ph = int(phone_img.width * 0.88), int(phone_img.height * 0.88)
    phone_resized = phone_img.resize((pw, ph), Image.Resampling.LANCZOS)
    
    # Drop shadow for phone
    shadow = Image.new("RGBA", (pw + 40, ph + 40), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle([15, 15, pw + 25, ph + 25], radius=44, fill=(0, 0, 0, 70))
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    
    pair_canvas.paste(shadow, (1400 - 20, 220 - 20), shadow)
    pair_canvas.paste(phone_resized, (1400, 220), phone_resized)
    
    workflow_pair_path = os.path.join(MEDIA_DIR, "screenshots/workflows/02_device_pair_composition.png")
    pair_canvas.convert("RGB").save(workflow_pair_path, "PNG", optimize=True)
    pair_canvas.convert("RGB").save(os.path.join(MEDIA_DIR, "screenshots/workflows/02_device_pair_composition.webp"), "WEBP", quality=92)
    print("  ✓ Device Pair Composition created!")

    # Connected Verification Pipeline Image (Split Screen with Flow Arrows)
    conn_canvas = Image.new("RGBA", (1920, 1080), C_DARK + (255,))
    cdraw = ImageDraw.Draw(conn_canvas)
    
    # Left: Guard Viewfinder Capture
    g_img = Image.open(os.path.join(MEDIA_DIR, "screenshots/guard/03_guard_detecting_landmarks.png")).convert("RGBA")
    gw, gh = int(g_img.width * 0.85), int(g_img.height * 0.85)
    conn_canvas.paste(g_img.resize((gw, gh)), (120, 160))
    
    # Right: Admin Live Activity Log showing same event
    act_img = Image.open(os.path.join(DOCS_SCREENSHOTS, "admin/admin_03_live_activity.png")).convert("RGBA")
    aw, ah = 1100, 720
    act_cropped = act_img.crop((0, 0, 1440, 940)).resize((aw, ah), Image.Resampling.LANCZOS)
    
    act_frame = Image.new("RGBA", (aw + 16, ah + 16), (30, 40, 34))
    act_frame.paste(act_cropped, (8, 8))
    conn_canvas.paste(act_frame, (700, 180))
    
    workflow_conn_path = os.path.join(MEDIA_DIR, "screenshots/workflows/01_connected_verification_flow.png")
    conn_canvas.convert("RGB").save(workflow_conn_path, "PNG", optimize=True)
    conn_canvas.convert("RGB").save(os.path.join(MEDIA_DIR, "screenshots/workflows/01_connected_verification_flow.webp"), "WEBP", quality=92)
    print("  ✓ Connected Verification Flow created!")

print("=== [3/4] Generating Video Posters & Thumbnails ===")
# Posters for HTML5 video elements
if os.path.exists(workflow_pair_path):
    p1 = Image.open(workflow_pair_path)
    p1.save(os.path.join(MEDIA_DIR, "posters/gatewise-overview.webp"), "WEBP", quality=90)
    p1.save(os.path.join(MEDIA_DIR, "posters/gatewise-overview.jpg"), "JPEG", quality=90)

if os.path.exists(os.path.join(DOCS_SCREENSHOTS, "admin/admin_02_command_centre.png")):
    p2 = Image.open(os.path.join(DOCS_SCREENSHOTS, "admin/admin_02_command_centre.png"))
    p2.save(os.path.join(MEDIA_DIR, "posters/admin-demo.webp"), "WEBP", quality=90)

if os.path.exists(phone_img_path):
    p3 = Image.open(phone_img_path)
    # Put phone centered on 16:9 canvas for poster
    poster_phone = Image.new("RGB", (1920, 1080), C_CANVAS)
    offset_x = (1920 - p3.width) // 2
    offset_y = (1080 - p3.height) // 2
    poster_phone.paste(p3, (offset_x, offset_y))
    poster_phone.save(os.path.join(MEDIA_DIR, "posters/guard-demo.webp"), "WEBP", quality=90)

print("  ✓ Video Posters generated!")

print("=== [4/4] Video Production with FFmpeg ===")

def build_video_from_scenes(output_mp4, duration_secs=60):
    """
    Builds the complete product walkthrough video conforming to the 5-scene storyboard:
    Scene 1 (0-6s): Product Intro & Branding
    Scene 2 (6-22s): GATEWISE Guard Android App Walkthrough
    Scene 3 (22-40s): GATEWISE Admin Portal Walkthrough
    Scene 4 (40-55s): Connected Multi-Gate Real-Time Workflow
    Scene 5 (55-65s): Cinematic Product Conclusion & CTAs
    """
    temp_dir = "/tmp/gatewise_video_frames"
    os.makedirs(temp_dir, exist_ok=True)
    fps = 30
    total_frames = duration_secs * fps
    
    print(f"  Rendering {total_frames} frames for {duration_secs}s video...")
    
    # Preload source images
    img_intro_bg = Image.new("RGB", (1920, 1080), C_DARK)
    img_admin = Image.open(os.path.join(MEDIA_DIR, "screenshots/admin/02_command_centre.png")).convert("RGB")
    img_activity = Image.open(os.path.join(MEDIA_DIR, "screenshots/admin/03_live_activity.png")).convert("RGB")
    img_guard1 = Image.open(os.path.join(MEDIA_DIR, "screenshots/guard/02_guard_viewfinder_idle.png")).convert("RGBA")
    img_guard2 = Image.open(os.path.join(MEDIA_DIR, "screenshots/guard/03_guard_detecting_landmarks.png")).convert("RGBA")
    img_guard3 = Image.open(os.path.join(MEDIA_DIR, "screenshots/guard/04_guard_biometric_match.png")).convert("RGBA")
    img_guard4 = Image.open(os.path.join(MEDIA_DIR, "screenshots/guard/05_guard_entry_granted.png")).convert("RGBA")
    img_pair = Image.open(os.path.join(MEDIA_DIR, "screenshots/workflows/02_device_pair_composition.png")).convert("RGB")
    img_conn = Image.open(os.path.join(MEDIA_DIR, "screenshots/workflows/01_connected_verification_flow.png")).convert("RGB")
    
    for f in range(total_frames):
        sec = f / float(fps)
        frame = Image.new("RGB", (1920, 1080), C_CANVAS)
        draw = ImageDraw.Draw(frame)
        
        # --- SCENE 1: Introduction (0.0 to 6.0s) ---
        if sec < 6.0:
            frame = img_intro_bg.copy()
            fdraw = ImageDraw.Draw(frame)
            # Animated fade in
            progress = min(1.0, sec / 2.0)
            alpha_text = int(progress * 255)
            
            # Brand pill
            fdraw.rounded_rectangle([760, 420, 1160, 460], radius=20, fill=(35, 134, 93, int(alpha_text * 0.4)))
            fdraw.text((820, 432), "GATEWISE AI 1.0", fill=(199, 231, 216), font=None)
            
            # Big headline
            fdraw.text((540, 490), "Smarter Gate Operations.", fill=(255, 255, 255), font=None)
            fdraw.text((640, 550), "One Connected Platform.", fill=(35, 134, 93), font=None)
            fdraw.text((680, 640), "Indian Institute of Management Sambalpur", fill=(150, 170, 160), font=None)
            
        # --- SCENE 2: GATEWISE Guard Android App (6.0 to 22.0s) ---
        elif sec < 22.0:
            sub_sec = sec - 6.0
            # Pan & show mobile app states
            # 0-4s: Viewfinder idle
            # 4-8s: Detecting landmarks
            # 8-12s: Biometric match found
            # 12-16s: Sovereign entry granted
            if sub_sec < 4.0:
                cur_phone = img_guard1
                state_title = "Stage 01: Optical Target Viewfinder · 60fps"
            elif sub_sec < 8.0:
                cur_phone = img_guard2
                state_title = "Stage 02: OpenCV YuNet 5-Point Landmark Extraction (28ms)"
            elif sub_sec < 12.0:
                cur_phone = img_guard3
                state_title = "Stage 03: SFace 128-D Cosine Metric Match (Score: 0.984)"
            else:
                cur_phone = img_guard4
                state_title = "Stage 04: Sovereign Officer Action & HMAC-SHA256 Digital Seal"
            
            # Draw split presentation: Phone on left, feature breakdown on right
            # Phone placement
            px = 240
            py = 90
            frame.paste(cur_phone, (px, py), cur_phone)
            
            # Right side explanations
            draw.rounded_rectangle([740, 180, 1680, 880], radius=24, fill=(255, 255, 255), outline=(210, 225, 218), width=2)
            draw.rounded_rectangle([780, 220, 1020, 260], radius=12, fill=(35, 134, 93, 30))
            draw.text((800, 232), "GATEWISE GUARD MOBILE", fill=(23, 99, 70), font=None)
            
            draw.text((780, 290), state_title, fill=(30, 45, 38), font=None)
            
            draw.line([(780, 340), (1640, 340)], fill=(225, 235, 228), width=2)
            
            # Telemetry stats
            draw.text((780, 380), "• Station Gate Lock: GATE-MAIN-02 (Main Campus Gate)", fill=(80, 100, 90), font=None)
            draw.text((780, 430), "• Officer Session: Officer Ramesh Verma (SEC-G014)", fill=(80, 100, 90), font=None)
            draw.text((780, 480), "• Biometric Mode: Zero Cloud Streaming (Local Volatile RAM)", fill=(80, 100, 90), font=None)
            draw.text((780, 530), "• Liveness Check: Laplacian Blur Score 84.2 > 60.0 (Clear)", fill=(80, 100, 90), font=None)
            draw.text((780, 580), "• Cryptographic Seal: HMAC Digest #7f4a-92b1...c4e9", fill=(35, 134, 93), font=None)
            
            # Dynamic time indicator
            draw.rounded_rectangle([780, 780, 1100, 830], radius=10, fill=(240, 246, 242))
            draw.text((800, 796), f"Frame SLA: 142ms Total Latency", fill=(23, 99, 70), font=None)
            
        # --- SCENE 3: GATEWISE Admin Portal (22.0 to 40.0s) ---
        elif sec < 40.0:
            sub_sec = sec - 22.0
            # Smooth pan across Admin Portal
            if sub_sec < 9.0:
                # Command Centre
                base_admin = img_admin
                portal_label = "GATEWISE Admin Portal · Central Command Centre & KPI Matrix"
            else:
                # Live Gate Activity Feed
                base_admin = img_activity
                portal_label = "Live Gate Activity Telemetry · Real-Time Streaming Logs"
            
            # Smooth vertical scrolling effect
            aw, ah = base_admin.size
            scroll_y = int((sub_sec % 9.0) / 9.0 * min(ah - 720, 300))
            crop_rect = (0, scroll_y, aw, min(ah, scroll_y + 820))
            cropped_admin = base_admin.crop(crop_rect).resize((1600, 800), Image.Resampling.LANCZOS)
            
            # Browser window frame
            frame.paste(cropped_admin, (160, 180))
            draw.rounded_rectangle([160, 110, 1760, 180], radius=14, fill=(235, 242, 238), outline=(200, 215, 208), width=2)
            draw.ellipse([180, 135, 196, 151], fill=(255, 95, 87))
            draw.ellipse([206, 135, 222, 151], fill=(254, 188, 46))
            draw.ellipse([232, 135, 248, 151], fill=(40, 200, 64))
            draw.text((270, 132), portal_label, fill=(23, 99, 70), font=None)
            
            # Live indicator
            draw.text((1580, 132), "● SSE LIVE 60fps", fill=(35, 134, 93), font=None)
            
        # --- SCENE 4: Connected Multi-Gate Real-Time Workflow (40.0 to 55.0s) ---
        elif sec < 55.0:
            frame = img_conn.copy()
            cdraw = ImageDraw.Draw(frame)
            
            # Header banner
            cdraw.rounded_rectangle([120, 60, 800, 120], radius=16, fill=(255, 255, 255, 230))
            cdraw.text((150, 75), "CONNECTED ARCHITECTURE", fill=(35, 134, 93), font=None)
            cdraw.text((150, 95), "Guard Decision → Immediate Central Command Dispatch", fill=(30, 45, 38), font=None)
            
            # Pulse dot showing live sync
            sub_sec = sec - 40.0
            pulse = int((np.sin(sub_sec * 6) + 1.0) * 12)
            cdraw.ellipse([1750 - pulse, 80 - pulse, 1750 + pulse, 80 + pulse], outline=(35, 134, 93), width=2)
            cdraw.ellipse([1744, 74, 1756, 86], fill=(35, 134, 93))
            
        # --- SCENE 5: Product Conclusion & Call to Action (55.0 to 65.0s) ---
        else:
            frame = img_pair.copy()
            fdraw = ImageDraw.Draw(frame)
            
            # Bottom closing banner
            fdraw.rounded_rectangle([100, 890, 1820, 1030], radius=24, fill=(20, 27, 23, 245), outline=(50, 65, 56), width=2)
            
            fdraw.text((150, 925), "GATEWISE AI 1.0", fill=(199, 231, 216), font=None)
            fdraw.text((150, 965), "One platform. Connected institutional operations.", fill=(255, 255, 255), font=None)
            
            # Action Buttons
            fdraw.rounded_rectangle([1280, 925, 1530, 990], radius=32, fill=(35, 134, 93))
            fdraw.text((1315, 948), "Explore Platform →", fill=(255, 255, 255), font=None)
            
            fdraw.rounded_rectangle([1550, 925, 1780, 990], radius=32, fill=(255, 255, 255), outline=(200, 200, 200), width=1)
            fdraw.text((1575, 948), "Download APK", fill=(30, 45, 38), font=None)
        
        # Save frame to disk
        frame_file = os.path.join(temp_dir, f"frame_{f:05d}.jpg")
        frame.save(frame_file, "JPEG", quality=88)
        
        if f % 150 == 0:
            print(f"    Encoded frame {f}/{total_frames} ({int(sec)}s / {duration_secs}s)...")
            
    print("  Assembling MP4 video with FFmpeg...")
    # Assemble MP4 using H.264
    cmd_mp4 = [
        "ffmpeg", "-y",
        "-framerate", str(fps),
        "-i", os.path.join(temp_dir, "frame_%05d.jpg"),
        "-c:v", "libx264",
        "-profile:v", "high",
        "-level", "4.0",
        "-pix_fmt", "yuv420p",
        "-crf", "20",
        "-movflags", "+faststart",
        output_mp4
    ]
    subprocess.run(cmd_mp4, check=True)
    print(f"  ✓ High-quality MP4 generated: {output_mp4}")
    
    # Also create WebM version
    output_webm = os.path.splitext(output_mp4)[0] + ".webm"
    cmd_webm = [
        "ffmpeg", "-y",
        "-i", output_mp4,
        "-c:v", "libvpx",
        "-b:v", "1800k",
        "-crf", "10",
        "-pix_fmt", "yuv420p",
        output_webm
    ]
    subprocess.run(cmd_webm, check=True)
    print(f"  ✓ High-quality WebM generated: {output_webm}")
    
    # Clean up temp frames
    for f in glob.glob(os.path.join(temp_dir, "*.jpg")):
        os.remove(f)
    os.rmdir(temp_dir)

# Build Master Video
master_video_path = os.path.join(MEDIA_DIR, "videos/gatewise-overview.mp4")
build_video_from_scenes(master_video_path, duration_secs=65)

# Also create dedicated guard and admin clips for the sections
guard_video_path = os.path.join(MEDIA_DIR, "videos/guard-app-demo.mp4")
admin_video_path = os.path.join(MEDIA_DIR, "videos/admin-portal-demo.mp4")

# Extract Scene 2 as Guard App Demo (16s: 6.0 to 22.0)
cmd_guard = [
    "ffmpeg", "-y",
    "-ss", "6.0",
    "-i", master_video_path,
    "-t", "16.0",
    "-c", "copy",
    guard_video_path
]
subprocess.run(cmd_guard, check=True)
print(f"  ✓ Guard Demo Clip generated: {guard_video_path}")

# Extract Scene 3 as Admin Portal Demo (18s: 22.0 to 40.0)
cmd_admin = [
    "ffmpeg", "-y",
    "-ss", "22.0",
    "-i", master_video_path,
    "-t", "18.0",
    "-c", "copy",
    admin_video_path
]
subprocess.run(cmd_admin, check=True)
print(f"  ✓ Admin Portal Demo Clip generated: {admin_video_path}")

# Create WebVTT captions
vtt_content = """WEBVTT
Kind: captions
Language: en

00:00:00.000 --> 00:00:06.000
GATEWISE AI: Smarter Gate Operations. One Connected Platform for High-Consequence Perimeter Security.

00:00:06.000 --> 00:00:10.000
GATEWISE Guard: Tactical Android Viewfinder with automatic gamma and glare normalization.

00:00:10.000 --> 00:00:14.000
OpenCV YuNet extracts 5 facial landmarks in 28 milliseconds directly on edge hardware.

00:00:14.000 --> 00:00:18.000
SFace 128-dimensional biometric embedding matches institutional records with 98.4% cosine confidence.

00:00:18.000 --> 00:00:22.000
Sovereign guard grants entry. Physical boom barrier opens and the event is sealed with HMAC-SHA256.

00:00:22.000 --> 00:00:31.000
GATEWISE Admin Portal: Command Centre streams real-time campus telemetry and gate throughput.

00:00:31.000 --> 00:00:40.000
Live Gate Activity Feed: Instant visibility into multi-gate clearances, visitor passes, and exceptions.

00:00:40.000 --> 00:00:55.000
Connected Architecture: Field guard decisions synchronize instantly to the central security registry.

00:00:55.000 --> 00:01:05.000
GATEWISE AI: One platform. Connected institutional operations. Explore the platform or download the Android APK.
"""

with open(os.path.join(MEDIA_DIR, "videos/gatewise-overview.vtt"), "w") as vf:
    vf.write(vtt_content)

transcript_content = """GATEWISE AI 1.0 — COMPLETE PRODUCT WALKTHROUGH TRANSCRIPT
Duration: 65 seconds
Target Platform: GATEWISE Guard Android App & GATEWISE Admin Portal

[Scene 1: Introduction (00:00 - 00:06)]
Title: GATEWISE AI 1.0
Headline: Smarter Gate Operations. One Connected Platform.
Institution: Indian Institute of Management Sambalpur

[Scene 2: GATEWISE Guard Android Application (00:06 - 00:22)]
Stage 1: Tactical Optical Capture (60 FPS viewfinder with automatic exposure compensation).
Stage 2: YuNet 5-Point Landmark Extraction (28ms inference time on edge hardware).
Stage 3: 128-D Cosine Metric Matching (SFace neural pipeline, cosine score 0.984 > 0.720 threshold).
Stage 4: Sovereign Guard Action & HMAC-SHA256 Digital Seal (Hardware non-repudiation signature).

[Scene 3: GATEWISE Admin Portal (00:22 - 00:40)]
Central Security Command: Real-time telemetry, 4-gate post relay health, and throughput charts.
Live Gate Activity Feed: Server-Sent Events (SSE) streaming live verification events and cryptographic badges.

[Scene 4: Connected Multi-Gate Real-Time Workflow (00:40 - 00:55)]
Synchronization: Immediate field guard decision dispatch to central administrator dashboard.
Zero Raw Biometrics: Ephemeral RAM extraction ensures privacy and compliance with DPDP and ISO/IEC 27001.

[Scene 5: Conclusion & Calls to Action (00:55 - 01:05)]
GATEWISE AI: One platform. Connected institutional operations.
CTAs: Explore the Platform / Download Android APK.
"""

with open(os.path.join(MEDIA_DIR, "videos/transcript.txt"), "w") as tf:
    tf.write(transcript_content)

print("  ✓ Captions & Transcripts written successfully!")
print("=== All Showcase Media Assets Generated Successfully ===")
