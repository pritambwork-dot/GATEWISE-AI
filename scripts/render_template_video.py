#!/usr/bin/env python3
"""
GATEWISE AI — Video Template Engine
Recreates the high-energy 28.84-second product teaser template (60 fps)
matching the uploaded video template (media_1794382458736_56d85117.mp4)
with GATEWISE AI product screens, branding, metrics, and typography.
"""

import os
import math
import subprocess
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont

# Video dimensions & framerate
WIDTH = 1920
HEIGHT = 1080
FPS = 60.0
TOTAL_FRAMES = 1730  # 28.833s

FONT_PATH = '/System/Library/Fonts/HelveticaNeue.ttc'
MONO_PATH = '/System/Library/Fonts/Menlo.ttc'

def get_font(size, style='bold'):
    idx = 1 if style == 'bold' else (10 if style == 'medium' else (0 if style == 'regular' else 9))
    try:
        return ImageFont.truetype(FONT_PATH, size, index=idx)
    except Exception:
        return ImageFont.load_default()

def get_mono_font(size, bold=True):
    try:
        return ImageFont.truetype(MONO_PATH, size, index=1 if bold else 0)
    except Exception:
        return ImageFont.load_default()

# Pre-generate stars for starry scenes
np.random.seed(42)
NUM_STARS = 120
STAR_X = np.random.uniform(0, WIDTH, NUM_STARS)
STAR_Y = np.random.uniform(0, HEIGHT, NUM_STARS)
STAR_RAD = np.random.uniform(1.0, 2.5, NUM_STARS)
STAR_BRIGHT = np.random.uniform(0.3, 0.9, NUM_STARS)
STAR_SPEED = np.random.uniform(0.2, 0.8, NUM_STARS)

# Color palettes
BG_DARK = (8, 12, 16)
CYAN_GLOW = (56, 189, 248)
BLUE_GLOW = (37, 99, 235)
GREEN_LIME = (130, 245, 130)
GREEN_PRIMARY = (35, 134, 93)
GREEN_MINT = (199, 231, 216)
WHITE = (255, 255, 255)
DARK_TEXT = (5, 46, 22)

def draw_pill(draw, x, y, w, h, fill, border=None, border_w=2):
    """Draw a smooth rounded pill."""
    r = h / 2.0
    draw.rounded_rectangle([x, y, x + w, y + h], radius=r, fill=fill, outline=border, width=border_w)

def draw_centered_text(draw, text, cx, cy, font, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((cx - tw / 2.0, cy - th / 2.0 - bbox[1]), text, font=font, fill=fill)
    return tw, th

def draw_stars(canvas, f_idx):
    for i in range(NUM_STARS):
        sx = int((STAR_X[i] + STAR_SPEED[i] * f_idx * 0.4) % WIDTH)
        sy = int(STAR_Y[i])
        alpha = STAR_BRIGHT[i] * (0.6 + 0.4 * math.sin(f_idx * 0.05 + i))
        c = int(255 * alpha)
        cv2.circle(canvas, (sx, sy), int(STAR_RAD[i]), (c, c, c), -1)

# Precompute radial glow templates
def make_radial_glow(w, h, cx, cy, radius, color):
    y, x = np.ogrid[:h, :w]
    dist_sq = (x - cx)**2 + (y - cy)**2
    mask = np.clip(1.0 - np.sqrt(dist_sq) / radius, 0, 1)
    mask = (mask ** 2)
    glow = np.zeros((h, w, 3), dtype=np.float32)
    for ch in range(3):
        glow[:, :, ch] = color[ch] * mask
    return glow

print("Precomputing glow backdrops...")
GLOW_HORIZON = make_radial_glow(WIDTH, HEIGHT, WIDTH // 2, HEIGHT + 200, 900, (29, 78, 216))
GLOW_CENTER_BLUE = make_radial_glow(WIDTH, HEIGHT, WIDTH // 2, HEIGHT // 2, 600, (30, 90, 220))
GLOW_CENTER_GREEN = make_radial_glow(WIDTH, HEIGHT, WIDTH // 2, HEIGHT // 2, 550, (20, 160, 100))
GLOW_DUAL_TOP = make_radial_glow(WIDTH, HEIGHT, WIDTH // 2, -150, 750, (30, 100, 230))
GLOW_DUAL_BOTTOM = make_radial_glow(WIDTH, HEIGHT, WIDTH // 2, HEIGHT + 150, 750, (30, 100, 230))

def render_scene_1(f_rel, total_f):
    """0.00s - 2.27s (Frames 0 to 136): The Kinetic Hook"""
    t = f_rel / total_f
    bg = np.full((HEIGHT, WIDTH, 3), (8, 12, 16), dtype=np.uint8)
    glow = GLOW_HORIZON * (0.7 + 0.3 * math.sin(t * math.pi))
    bg = np.clip(bg.astype(np.float32) + glow, 0, 255).astype(np.uint8)
    draw_stars(bg, f_rel)

    img = Image.fromarray(bg)
    draw = ImageDraw.Draw(img)

    # Glowing bottom horizon sphere arc
    arc_y = HEIGHT + 350
    arc_r = 750
    draw.ellipse([WIDTH//2 - arc_r, arc_y - arc_r, WIDTH//2 + arc_r, arc_y + arc_r], outline=(56, 189, 248), width=3)

    # Top text
    draw_centered_text(draw, "EDGE BIOMETRIC INTELLIGENCE", WIDTH//2, 380, get_font(32, 'medium'), (200, 220, 240))

    # Big GATEWISE text with subtle tracking
    scale = 1.0 + (1.0 - t) * 0.08
    font_main = get_font(int(148 * scale), 'bold')
    draw_centered_text(draw, "GATEWISE", WIDTH//2, 520, font_main, (255, 255, 255))

    # Flanking subtitles well separated
    draw_centered_text(draw, "Sub-300ms", WIDTH//2 - 620, 525, get_font(38, 'regular'), (140, 160, 180))
    draw_centered_text(draw, "Sovereign", WIDTH//2 + 620, 525, get_font(38, 'regular'), (140, 160, 180))

    # Bottom Pill Banner resting on the horizon arc
    pill_w = 940
    pill_h = 58
    pill_x = (WIDTH - pill_w) // 2
    pill_y = 720
    draw_pill(draw, pill_x, pill_y, pill_w, pill_h, GREEN_LIME)
    draw_centered_text(draw, "AI system for end-to-end workflow automation and optimization", WIDTH//2, pill_y + pill_h//2, get_font(26, 'bold'), DARK_TEXT)

    # Glitch / rapid flash cut near end
    if t > 0.85:
        sub_t = (t - 0.85) / 0.15
        overlay = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, int(180 * sub_t)))
        img.paste(overlay, (0, 0), overlay)
        draw = ImageDraw.Draw(img)
        draw_centered_text(draw, "Active Post: Gate-Main-02", WIDTH//2, HEIGHT//2 - 30, get_font(52, 'bold'), (255, 255, 255))
        draw_centered_text(draw, "Queue Ingress Telemetry Render", WIDTH//2, HEIGHT//2 + 35, get_font(28, 'regular'), (140, 180, 220))

    return np.array(img)

def render_scene_2(f_rel, total_f):
    """2.27s - 7.60s (Frames 136 to 456): Live Ingress Queue & Pulsating Stadium CTA"""
    t = f_rel / total_f

    if t < 0.65:
        # Part A: Queue Cards
        bg = np.full((HEIGHT, WIDTH, 3), (10, 16, 24), dtype=np.uint8)
        glow = GLOW_CENTER_BLUE * 0.5
        bg = np.clip(bg.astype(np.float32) + glow, 0, 255).astype(np.uint8)
        img = Image.fromarray(bg)
        draw = ImageDraw.Draw(img)

        # Header
        draw.text((360, 140), "Active Ingress Queue", font=get_font(42, 'bold'), fill=(255, 255, 255))
        draw.text((360, 195), "Real-time Edge Verification • Gate-Main-02", font=get_font(22, 'regular'), fill=(160, 185, 210))
        draw.text((1480, 155), "Live 30fps", font=get_mono_font(22, bold=True), fill=(52, 211, 153))

        cards = [
            ("Dr. Maya Sharma", "Faculty • Dept. of Bioengineering  |  Cosine 0.984", "+60,901", True),
            ("Officer Ramesh Verma", "Security Post 02 • Active Duty Session Bound", "+52,001", False),
            ("Marcus Vance", "Student Affairs • North Turnstile 01  |  Cosine 0.942", "+49,006", False),
            ("Visitor Pass #9042", "Dean's Guest • Digital QR Issued  |  Cleared", "+35,321", False),
            ("Vehicle OD 02 AK 9142", "Faculty EV Sedan • Barrier Relay Pulse (1.8s)", "+29,431", False),
        ]

        card_w = 1200
        card_h = 100
        start_y = 260
        spacing = 118

        for idx, (title, sub, metric, is_active) in enumerate(cards):
            cy = start_y + idx * spacing
            cx = (WIDTH - card_w) // 2

            slide_delay = idx * 0.08
            prog = max(0.0, min(1.0, (t / 0.65 - slide_delay) * 2.5))
            cx_slide = cx + int((1.0 - prog) * 200)

            if is_active:
                draw.rounded_rectangle([cx_slide - 40, cy - 6, cx_slide + card_w + 40, cy + card_h + 6], radius=24, fill=(28, 70, 150, 180))
                draw_pill(draw, cx_slide - 30, cy, 12, card_h, (56, 189, 248))

            draw.rounded_rectangle([cx_slide, cy, cx_slide + card_w, cy + card_h], radius=20, fill=(255, 255, 255) if not is_active else (240, 246, 255))

            icon_box = [cx_slide + 18, cy + 18, cx_slide + 82, cy + 82]
            icon_fill = (37, 99, 235) if is_active else (225, 235, 248)
            draw.rounded_rectangle(icon_box, radius=18, fill=icon_fill)
            if is_active:
                draw_centered_text(draw, "AI", (icon_box[0]+icon_box[2])//2, (icon_box[1]+icon_box[3])//2, get_font(26, 'bold'), (255, 255, 255))
            else:
                draw_centered_text(draw, str(idx+1), (icon_box[0]+icon_box[2])//2, (icon_box[1]+icon_box[3])//2, get_font(26, 'bold'), (37, 99, 235))

            draw.text((cx_slide + 110, cy + 22), title, font=get_font(26, 'bold'), fill=(15, 23, 42) if not is_active else (2, 44, 120))
            draw.text((cx_slide + 110, cy + 58), sub, font=get_font(18, 'regular'), fill=(100, 116, 139) if not is_active else (30, 80, 180))

            if is_active:
                play_cx = cx_slide + card_w - 55
                play_cy = cy + card_h // 2
                draw.ellipse([play_cx - 22, play_cy - 22, play_cx + 22, play_cy + 22], fill=(37, 99, 235))
                draw.polygon([(play_cx - 6, play_cy - 10), (play_cx - 6, play_cy + 10), (play_cx + 9, play_cy)], fill=(255, 255, 255))
            else:
                rx = cx_slide + card_w - 55
                ry = cy + card_h // 2
                for dy in [-8, 0, 8]:
                    draw.line([rx - 14, ry + dy, rx + 14, ry + dy], fill=(148, 163, 184), width=3)

        return np.array(img)

    else:
        # Part B: Expanding Stadium Pill (Frames 340 to 456)
        sub_t = (t - 0.65) / 0.35
        bg = np.full((HEIGHT, WIDTH, 3), (8, 14, 22), dtype=np.uint8)
        glow = GLOW_CENTER_BLUE * (0.8 + 0.2 * math.sin(sub_t * math.pi * 4))
        bg = np.clip(bg.astype(np.float32) + glow, 0, 255).astype(np.uint8)
        img = Image.fromarray(bg)
        draw = ImageDraw.Draw(img)

        pill_w = 880
        pill_h = 160
        pcx = WIDTH // 2
        pcy = HEIGHT // 2

        num_rings = 4
        for r_idx in range(num_rings):
            phase = (sub_t * 2.5 + r_idx / num_rings) % 1.0
            expand_w = pill_w + phase * 650
            expand_h = pill_h + phase * 400
            alpha = max(0.0, 1.0 - phase)
            ring_color = (int(130 * alpha), int(245 * alpha), int(130 * alpha))
            draw.rounded_rectangle(
                [pcx - expand_w/2, pcy - expand_h/2, pcx + expand_w/2, pcy + expand_h/2],
                radius=expand_h / 2,
                outline=ring_color,
                width=int(3 + (1.0 - phase) * 3)
            )

        draw_pill(draw, pcx - pill_w/2, pcy - pill_h/2, pill_w, pill_h, GREEN_LIME)
        draw_centered_text(draw, "Explore Gate Operations  ->", pcx, pcy, get_font(52, 'bold'), DARK_TEXT)

        return np.array(img)

def render_scene_3(f_rel, total_f):
    """7.60s - 13.10s (Frames 456 to 786): 3D Cascading Stacked Deck with Animated Cursor"""
    t = f_rel / total_f

    bg = np.full((HEIGHT, WIDTH, 3), (10, 15, 24), dtype=np.uint8)
    glow = GLOW_CENTER_BLUE * 0.6
    bg = np.clip(bg.astype(np.float32) + glow, 0, 255).astype(np.uint8)
    img = Image.fromarray(bg)
    draw = ImageDraw.Draw(img)

    draw_centered_text(draw, "Sovereign Perimeter Stack", WIDTH//2, 140, get_font(56, 'bold'), (255, 255, 255))

    stack_layers = [
        "Data Sync & WebSocket Feed",
        "Autonomous ANPR & Barrier Relay",
        "HMAC-SHA256 Non-Repudiation Vault",
        "SFace 128-D Vector Embeddings",
        "YuNet 28ms Face Landmark Detector",
        "Offline SQLite Continuity Engine",
    ]

    base_w = 640
    base_h = 76
    start_y = 260
    spacing = 84

    cursor_layer = min(len(stack_layers) - 1, int(t * len(stack_layers) * 1.1))

    for idx, label in enumerate(stack_layers):
        scale_w = base_w + idx * 36
        cx = WIDTH // 2
        cy = start_y + idx * spacing

        is_selected = (idx == cursor_layer)
        card_fill = (255, 255, 255) if not is_selected else (235, 255, 242)
        border_col = (37, 99, 235) if not is_selected else (34, 197, 94)
        border_w = 2 if not is_selected else 4

        draw_pill(draw, cx - scale_w/2, cy, scale_w, base_h, card_fill, border_col, border_w)

        icon_cx = cx - scale_w/2 + 42
        icon_cy = cy + base_h/2
        draw.rounded_rectangle([icon_cx - 24, icon_cy - 24, icon_cx + 24, icon_cy + 24], radius=14, fill=(37, 99, 235))
        draw_centered_text(draw, str(6 - idx), icon_cx, icon_cy, get_font(20, 'bold'), (255, 255, 255))

        draw.text((icon_cx + 42, cy + 22), label, font=get_font(24, 'bold'), fill=(15, 23, 42))

    cursor_target_y = start_y + cursor_layer * spacing + base_h / 2
    cursor_target_x = WIDTH // 2 - (base_w + cursor_layer * 36) / 2 - 40
    cursor_x = cursor_target_x + math.sin(t * 20) * 4
    cursor_y = cursor_target_y

    pts = [(cursor_x - 32, cursor_y - 20), (cursor_x - 32, cursor_y + 20), (cursor_x, cursor_y)]
    draw.polygon(pts, fill=(130, 245, 130), outline=(34, 197, 94))

    return np.array(img)

def render_scene_4(f_rel, total_f):
    """13.10s - 15.43s (Frames 786 to 926): The Unified Platform Statement"""
    t = f_rel / total_f

    bg = np.full((HEIGHT, WIDTH, 3), (6, 9, 14), dtype=np.uint8)
    glow = GLOW_CENTER_BLUE * 0.4
    bg = np.clip(bg.astype(np.float32) + glow, 0, 255).astype(np.uint8)
    img = Image.fromarray(bg)
    draw = ImageDraw.Draw(img)

    badges = [
        (WIDTH//2, 180, "28ms YuNet Edge", "YuNet"),
        (WIDTH//2 - 480, 320, "SFace 128-D", "SFace"),
        (WIDTH//2 + 480, 320, "HMAC-256 Seal", "HMAC"),
        (WIDTH//2 - 360, 780, "Guard Android APK", "APK"),
        (WIDTH//2 + 360, 780, "Command Deck", "ADMIN"),
    ]

    for bx, by, text, tag in badges:
        float_y = by + math.sin(t * 6 + bx) * 12
        draw.rounded_rectangle([bx - 120, float_y - 45, bx + 120, float_y + 45], radius=20, fill=(18, 30, 48), outline=(56, 189, 248), width=2)
        draw_centered_text(draw, tag, bx, float_y - 12, get_font(18, 'bold'), (56, 189, 248))
        draw_centered_text(draw, text, bx, float_y + 16, get_font(20, 'regular'), (255, 255, 255))

    draw_centered_text(draw, "Connect  🌐  every gate, guard & turnstile in", WIDTH//2, 470, get_font(48, 'bold'), (255, 255, 255))
    draw_centered_text(draw, "one unified platform", WIDTH//2, 550, get_font(68, 'bold'), (74, 222, 128))

    return np.array(img)

def render_scene_5(f_rel, total_f):
    """15.43s - 21.70s (Frames 926 to 1302): Massive Metric Showcase (<300ms)"""
    t = f_rel / total_f

    bg = np.full((HEIGHT, WIDTH, 3), (6, 10, 16), dtype=np.uint8)
    glow = GLOW_CENTER_BLUE * (0.9 + 0.15 * math.sin(t * 8))
    bg = np.clip(bg.astype(np.float32) + glow, 0, 255).astype(np.uint8)
    draw_stars(bg, f_rel)

    img = Image.fromarray(bg)
    draw = ImageDraw.Draw(img)

    cx, cy = WIDTH // 2, HEIGHT // 2
    r_aura = 360
    draw.ellipse([cx - r_aura, cy - r_aura, cx + r_aura, cy + r_aura], outline=(56, 189, 248), width=2)

    draw_centered_text(draw, "<300ms", cx, cy - 35, get_font(150, 'bold'), (255, 255, 255))
    draw_centered_text(draw, "End-to-End Verification SLA", cx, cy + 95, get_font(38, 'regular'), (200, 225, 250))

    pills = [
        (330, 240, "Zero Raw Photos", "128-D", True),
        (300, 490, "Mean Cosine Match", "98.4%", False),
        (330, 760, "On-Premise Deploy", "100%", True),
        (1590, 490, "DPDP Act Compliant", "Audit", False),
        (1560, 760, "Offline Continuity", "24/7", True),
    ]

    for px, py, label, val, is_green in pills:
        fy = py + math.sin(t * 6 + px * 0.01) * 10
        pill_fill = GREEN_LIME if is_green else (255, 255, 255)
        text_fill = DARK_TEXT if is_green else (15, 23, 42)
        pw = 420
        ph = 76
        draw_pill(draw, px - pw/2, fy - ph/2, pw, ph, pill_fill)
        draw.text((px - pw/2 + 28, fy - 18), val, font=get_font(28, 'bold'), fill=text_fill)
        draw.text((px - pw/2 + 155, fy - 14), label, font=get_font(20, 'medium'), fill=text_fill)

    return np.array(img)

def render_scene_6(f_rel, total_f):
    """21.70s - 25.00s (Frames 1302 to 1500): Constellation Multi-Node Network"""
    t = f_rel / total_f

    bg = np.full((HEIGHT, WIDTH, 3), (6, 9, 14), dtype=np.uint8)
    draw_stars(bg, f_rel)
    img = Image.fromarray(bg)
    draw = ImageDraw.Draw(img)

    cx, cy = WIDTH // 2, HEIGHT // 2

    draw_centered_text(draw, "Full Perimeter Governance.", cx, cy - 25, get_font(48, 'bold'), (255, 255, 255))
    draw_centered_text(draw, "Zero Cloud Leaks.", cx, cy + 35, get_font(48, 'bold'), (74, 222, 128))

    node_names = [
        "Gate-01 Turnstiles",
        "Gate-02 Main Guard",
        "Admin Command Desk",
        "North Vehicle Barrier",
        "West Pedestrian Totem",
        "Local SQLite Vault"
    ]

    orbit_r = 440
    angle_offset = t * 0.4

    for i, name in enumerate(node_names):
        theta = angle_offset + i * (2 * math.pi / len(node_names))
        nx = cx + orbit_r * math.cos(theta)
        ny = cy + orbit_r * math.sin(theta)

        draw.line([cx, cy, nx, ny], fill=(30, 80, 160), width=1)

        nw, nh = 210, 80
        draw.rounded_rectangle([nx - nw/2, ny - nh/2, nx + nw/2, ny + nh/2], radius=16, fill=(18, 30, 48), outline=(56, 189, 248), width=2)
        draw_centered_text(draw, name, nx, ny - 10, get_font(16, 'bold'), (255, 255, 255))
        draw_centered_text(draw, "ACTIVE • </ >", nx, ny + 16, get_mono_font(13, bold=True), (74, 222, 128))

    return np.array(img)

def render_scene_7(f_rel, total_f):
    """25.00s - 27.50s (Frames 1500 to 1650): Value Proposition & Call to Action with Real Toggle Switch"""
    t = f_rel / total_f

    bg = np.full((HEIGHT, WIDTH, 3), (6, 9, 14), dtype=np.uint8)
    glow = (GLOW_DUAL_TOP + GLOW_DUAL_BOTTOM) * 0.7
    bg = np.clip(bg.astype(np.float32) + glow, 0, 255).astype(np.uint8)
    img = Image.fromarray(bg)
    draw = ImageDraw.Draw(img)

    draw.ellipse([WIDTH//2 - 900, -1000, WIDTH//2 + 900, 150], outline=(56, 189, 248), width=3)
    draw.ellipse([WIDTH//2 - 900, HEIGHT - 150, WIDTH//2 + 900, HEIGHT + 1000], outline=(56, 189, 248), width=3)

    # First line with graphical toggle
    # "Deploy" ... [toggle switch with arrow] ... "sovereign,"
    cy_text = HEIGHT // 2 - 50
    draw.text((WIDTH//2 - 420, cy_text - 30), "Deploy", font=get_font(56, 'bold'), fill=(255, 255, 255))

    # Real graphical toggle switch
    tg_x = WIDTH//2 - 180
    tg_y = cy_text - 25
    tg_w = 96
    tg_h = 52
    draw.rounded_rectangle([tg_x, tg_y, tg_x + tg_w, tg_y + tg_h], radius=tg_h/2, fill=(255, 255, 255))
    # Right knob
    knob_cx = tg_x + tg_w - tg_h/2
    knob_cy = tg_y + tg_h/2
    draw.ellipse([knob_cx - 20, knob_cy - 20, knob_cx + 20, knob_cy + 20], fill=(15, 23, 42))
    # Arrow inside knob
    draw.line([knob_cx - 8, knob_cy, knob_cx + 8, knob_cy], fill=(255, 255, 255), width=3)
    draw.line([knob_cx + 3, knob_cy - 5, knob_cx + 8, knob_cy], fill=(255, 255, 255), width=3)
    draw.line([knob_cx + 3, knob_cy + 5, knob_cx + 8, knob_cy], fill=(255, 255, 255), width=3)

    draw.text((WIDTH//2 - 60, cy_text - 30), "sovereign,", font=get_font(56, 'bold'), fill=(255, 255, 255))

    # Second line
    draw_centered_text(draw, "sub-second campus intelligence", WIDTH//2, HEIGHT//2 + 35, get_font(56, 'bold'), (255, 255, 255))

    # CTA Button
    pw, ph = 480, 68
    draw_pill(draw, WIDTH//2 - pw/2, HEIGHT//2 + 135, pw, ph, (255, 255, 255))
    draw_centered_text(draw, "www.gatewise.ai", WIDTH//2, HEIGHT//2 + 135 + ph//2, get_font(28, 'bold'), (15, 23, 42))

    return np.array(img)

def render_scene_8(f_rel, total_f):
    """27.50s - 28.84s (Frames 1650 to 1730): Brand Outro & Release Lockup"""
    t = f_rel / total_f

    bg = np.full((HEIGHT, WIDTH, 3), (10, 8, 22), dtype=np.uint8)
    glow = GLOW_CENTER_GREEN * (0.8 + 0.3 * t)
    bg = np.clip(bg.astype(np.float32) + glow, 0, 255).astype(np.uint8)
    img = Image.fromarray(bg)
    draw = ImageDraw.Draw(img)

    cx, cy = WIDTH // 2, HEIGHT // 2 - 45

    # Larger Shield mark
    scale = 1.3
    shield_pts = [
        (cx, cy - int(90 * scale)),
        (cx + int(75 * scale), cy - int(60 * scale)),
        (cx + int(75 * scale), cy + int(20 * scale)),
        (cx, cy + int(90 * scale)),
        (cx - int(75 * scale), cy + int(20 * scale)),
        (cx - int(75 * scale), cy - int(60 * scale))
    ]
    draw.polygon(shield_pts, fill=(35, 134, 93), outline=(130, 245, 130))

    # Checkmark inside shield
    draw.line([(cx - 36, cy + 5), (cx - 10, cy + 35), (cx + 45, cy - 35)], fill=(255, 255, 255), width=10)

    # Sparkle star at top-right of shield
    sp_x = cx + int(85 * scale)
    sp_y = cy - int(70 * scale)
    draw.line([sp_x - 14, sp_y, sp_x + 14, sp_y], fill=(255, 255, 200), width=3)
    draw.line([sp_x, sp_y - 14, sp_x, sp_y + 14], fill=(255, 255, 200), width=3)

    # Brand Title
    draw_centered_text(draw, "GATEWISE AI 1.0", cx, cy + 170, get_font(56, 'bold'), (255, 255, 255))
    draw_centered_text(draw, "Institutional Access Architecture • Verified for IIM Sambalpur Campus", cx, cy + 235, get_font(24, 'regular'), (180, 210, 240))

    return np.array(img)

def main():
    raw_video_path = '/tmp/gatewise_template_raw.mp4'
    audio_path = '/Users/pritambiswas/.gemini/antigravity/brain/e6d0fdee-9755-4cef-ab84-67e7dbd15645/scratch/template_audio/soundtrack.aac'
    final_output_mp4 = '/Users/pritambiswas/antigravity/NORVA/apps/web/public/media/videos/gatewise-teaser-template.mp4'
    final_output_webm = '/Users/pritambiswas/antigravity/NORVA/apps/web/public/media/videos/gatewise-teaser-template.webm'
    poster_path = '/Users/pritambiswas/antigravity/NORVA/apps/web/public/media/posters/gatewise-teaser.webp'

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    writer = cv2.VideoWriter(raw_video_path, fourcc, FPS, (WIDTH, HEIGHT))

    print(f"Rendering {TOTAL_FRAMES} frames @ {FPS} fps (~28.84s)...")

    cuts = [
        (0, 136, render_scene_1),
        (136, 456, render_scene_2),
        (456, 786, render_scene_3),
        (786, 926, render_scene_4),
        (926, 1302, render_scene_5),
        (1302, 1500, render_scene_6),
        (1500, 1650, render_scene_7),
        (1650, TOTAL_FRAMES, render_scene_8),
    ]

    for start_f, end_f, scene_func in cuts:
        scene_len = end_f - start_f
        print(f"Rendering {scene_func.__name__}: frames {start_f} to {end_f} ({scene_len} frames)...")
        for f in range(start_f, end_f):
            frame_rgb = scene_func(f - start_f, scene_len)
            frame_bgr = cv2.cvtColor(frame_rgb, cv2.COLOR_RGB2BGR)
            writer.write(frame_bgr)

    writer.release()
    print("Video frame generation completed successfully!")

    # Mux with original high-energy soundtrack using ffmpeg
    print("Muxing video with soundtrack...")
    ffmpeg_cmd = [
        '/Users/pritambiswas/.local/bin/ffmpeg', '-y',
        '-i', raw_video_path,
        '-i', audio_path,
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '18',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-shortest',
        '-movflags', '+faststart',
        final_output_mp4
    ]
    subprocess.run(ffmpeg_cmd, check=True)
    print(f"Saved master MP4: {final_output_mp4}")

    # Generate WebM fallback (fast)
    print("Generating WebM version...")
    webm_cmd = [
        '/Users/pritambiswas/.local/bin/ffmpeg', '-y',
        '-i', final_output_mp4,
        '-c:v', 'libvpx',
        '-b:v', '2M',
        '-speed', '8',
        '-deadline', 'realtime',
        '-c:a', 'libvorbis',
        final_output_webm
    ]
    subprocess.run(webm_cmd, check=True)
    print(f"Saved WebM: {final_output_webm}")

    # Generate Poster
    print("Generating poster...")
    poster_cmd = [
        '/Users/pritambiswas/.local/bin/ffmpeg', '-y',
        '-ss', '00:00:18.000',
        '-i', final_output_mp4,
        '-vframes', '1',
        '-c:v', 'libwebp',
        poster_path
    ]
    subprocess.run(poster_cmd, check=True)
    print(f"Saved Poster: {poster_path}")

if __name__ == '__main__':
    main()
