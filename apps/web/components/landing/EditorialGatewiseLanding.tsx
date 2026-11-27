'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import {
  ArrowRight,
  Check,
  Copy,
  Menu,
  X,
  Plus,
  Minus,
  Smartphone,
  ShieldCheck,
  Lock,
  Camera,
  Database,
  Activity,
  FileCheck2,
  UserCheck,
  RefreshCw,
  Pause,
  Play,
} from 'lucide-react';
import { GuardWebApp } from '@/components/guard/GuardWebApp';
import {
  DoodleUnderline,
  DoodleSparkle,
  DoodleArrowNote,
  DoodleGateSketch,
  DoodleClipboardCheck,
  DoodleZigZagDivider,
} from '@/components/landing/EditorialDoodles';
import {
  HeroPerimeterVisualizer,
  PipelineStageVisual,
  SystemPanoramaDiagram,
  SurfacePreviewArtwork,
} from '@/components/landing/EditorialVisuals';
import { CookieConsent } from '@/components/aura/compliance/CookieConsent';
import { LegalModals } from '@/components/aura/compliance/LegalModals';
import { liveSync } from '@/lib/services/live-sync';

const COMMAND_TABS = [
  {
    id: 'guard',
    label: 'Guard Terminal',
    code: 'https://gatwise.vercel.app/guard  # Rear Cam Only · Smartphone Gate Scanner',
  },
  {
    id: 'verify',
    label: 'Verify Engine',
    code: 'POST /api/v1/verifications  # 128-D Cosine + ANPR Plate + RBAC Policy',
  },
  {
    id: 'admin',
    label: 'Admin Portal',
    code: 'https://gatwise.vercel.app/admin  # Mode 1/2 Guard Control · Central DB',
  },
] as const;

const CAPABILITIES = [
  {
    index: '#01 BIOMETRICS · RESNET-34',
    title: 'SSD MobileNetV1 + ResNet-34 128-D',
    description:
      'Detects faces via SSD MobileNetV1, aligns 68 neural facial landmarks, and extracts L2-normalized ResNet-34 128-dimensional descriptors in browser.',
    visual: 'biometrics',
  },
  {
    index: '#02 ANPR · TESSERACT LSTM',
    title: 'Neural ANPR & Multi-Vehicle Link',
    description:
      'Contrast-stretches rear camera plate frames and runs LSTM deep neural OCR to automatically read and normalize authorized vehicle registration strings.',
    visual: 'anpr',
  },
  {
    index: '#03 GOVERNANCE',
    title: 'Mode 1 & Mode 2 Guard RBAC',
    description:
      'Enforce strict Approval-Required queues by default or grant audited Direct Registration privileges per officer from the Admin desk.',
    visual: 'rbac',
  },
  {
    index: '#04 FIELD OPTICS',
    title: 'Phone Rear-Camera Lock',
    description:
      'Handheld smartphones lock exclusively to rear perimeter optics with WebRTC viewfinder streaming and native OS camera capture fallback.',
    visual: 'camera',
  },
  {
    index: '#05 STORAGE VAULT',
    title: 'Private Signed Photo Buckets',
    description:
      'Zero public buckets. Biometric portraits and vehicle plate frames live in encrypted Supabase Storage served only via short-lived signed URLs.',
    visual: 'vault',
  },
  {
    index: '#06 AUDIT LEDGER',
    title: 'Instant Realtime Telemetry',
    description:
      'Every verification result, suspended-subject block, and gate entry event broadcasts live across PostgreSQL Realtime channels without page reload.',
    visual: 'audit',
  },
] as const;

const MATRIX_ROWS = [
  {
    feature: 'Central PostgreSQL Backing',
    preReg: 'Live Row',
    mode1: 'Atomic Promotion',
    mode2: 'GUARD_CREATED Tag',
    suspended: 'Real-Time Block',
  },
  {
    feature: 'Face + Vehicle Verification',
    preReg: '128-D + ANPR',
    mode1: 'Post-Approval',
    mode2: 'Immediate Match',
    suspended: 'ACCESS_DENIED',
  },
  {
    feature: 'Admin Oversight & Approval',
    preReg: 'Admin Managed',
    mode1: 'Queue Review',
    mode2: 'Audit Alerted',
    suspended: 'Forced Hold',
  },
  {
    feature: 'Guard Database Visibility',
    preReg: 'Result Card Only',
    mode1: 'Own Requests',
    mode2: 'Own Created (20)',
    suspended: 'Blocked + Logged',
  },
  {
    feature: 'Photo Quality & Failure Gate',
    preReg: 'Strict >= 35/100',
    mode1: 'Server Verified',
    mode2: 'Server Verified',
    suspended: 'Signed Audit Trail',
  },
] as const;

const PIPELINE_STAGES = [
  {
    step: '01',
    title: 'Phone Rear-Cam + SSD MobileNetV1 Detection',
    detail:
      'Captures visitor face or ANPR frame via rear lens only, locates faces with SSD MobileNetV1 and checks pixel sharpness before encoding.',
    badge: 'SSD MOBILENETV1',
    metric: 'LANDMARK 68 · Q>=45',
  },
  {
    step: '02',
    title: 'ResNet-34 128-D Matching & LSTM ANPR OCR',
    detail:
      'Computes aligned ResNet-34 128-D embeddings against face_biometrics and reads license plates automatically using Tesseract LSTM neural OCR.',
    badge: 'RESNET-34 + LSTM',
    metric: 'COSINE >= 0.78',
  },
  {
    step: '03',
    title: 'Access Status, Validity & Gate RBAC Check',
    detail:
      'Immediately blocks SUSPENDED, EXPIRED, or incomplete biometric enrollments and enforces Mode 1 / Mode 2 guard privileges on backend routes.',
    badge: 'ZERO BYPASS',
    metric: 'RBAC + RLS',
  },
  {
    step: '04',
    title: 'Instant Realtime Broadcast to Command Centre',
    detail:
      'Publishes verification outcomes and entry/exit logs directly to the Admin Dashboard over Supabase Realtime channels.',
    badge: 'REALTIME',
    metric: 'HMAC-SHA256',
  },
] as const;

const FAQS = [
  {
    q: 'Why does the Guard Mobile Web App operate strictly on smartphones with rear camera only?',
    a: 'Gate officers inspect incoming visitors and license plates facing them across perimeter lanes. Locking /guard to mobile viewports prevents desktop misuse, while enforcing facingMode: environment ensures officers never accidentally open a selfie camera during verification.',
  },
  {
    q: 'How do the Admin Web Dashboard and Guard Mobile App synchronize in real time?',
    a: 'Both applications share one centralized Supabase PostgreSQL database, private photo storage bucket, and WebSocket Realtime channel. Suspending a person or revoking a guard permission takes effect immediately on the very next verification or API request.',
  },
  {
    q: 'What is the difference between Mode 1 and Mode 2 guard registration?',
    a: 'Mode 1 (Approval Required) is enabled by default: guards submit visitor requests that stay pending until an administrator approves them. Mode 2 (Direct Registration Permission) can be granted per guard by an administrator, allowing audited temporary or direct record creation tagged GUARD_CREATED.',
  },
  {
    q: 'What happens if an uploaded face photograph is blurry, corrupted, or fails biometric extraction?',
    a: 'Both client feature validation and backend magic-byte/variance checks reject corrupted or low-contrast frames, mark enrollment_status as FAILED with the failure reason, and block verification approval until a clear facial photograph is enrolled.',
  },
  {
    q: 'Is bilingual Hindi & English support included across both applications?',
    a: 'Yes. Both the Admin Command Centre login/dashboard and the Guard Mobile Terminal support instant switching between English and हिंदी while preserving identical security policies and backend enforcement.',
  },
] as const;

const EngravingFigure: React.FC<{ kind: string; animateVisuals: boolean }> = ({
  kind,
  animateVisuals,
}) => {
  return (
    <div className="relative h-48 w-full border border-[#DCE1EC] bg-[#FAF9F6] paper-halftone overflow-hidden flex items-center justify-center group-hover:border-[#2F5BFF] transition-colors">
      {/* Corner reticle ticks */}
      <span className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[#2F5BFF]" />
      <span className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-[#2F5BFF]" />
      <span className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-[#2F5BFF]" />
      <span className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[#2F5BFF]" />

      {kind === 'biometrics' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 220 120" className="w-44 h-28" fill="none" aria-hidden="true">
            <ellipse cx="110" cy="60" rx="34" ry="44" stroke="#0A0E1A" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M84 48 H136 M80 62 H140 M88 78 H132" stroke="#2F5BFF" strokeWidth="1" opacity="0.7" />
            <motion.circle
              cx="98"
              cy="52"
              r="3"
              fill="#2F5BFF"
              animate={animateVisuals ? { scale: [1, 1.45, 1], opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 2.2, repeat: Infinity }}
            />
            <motion.circle
              cx="122"
              cy="52"
              r="3"
              fill="#2F5BFF"
              animate={animateVisuals ? { scale: [1, 1.45, 1], opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 2.2, delay: 0.4, repeat: Infinity }}
            />
            <circle cx="110" cy="64" r="2.5" fill="#0D9488" />
            <rect x="24" y="24" width="42" height="72" stroke="#DCE1EC" fill="#FFFFFF" />
            <text x="45" y="55" textAnchor="middle" className="fill-[#2F5BFF] font-mono text-[8px] font-bold">128-D</text>
            <text x="45" y="68" textAnchor="middle" className="fill-[#475569] font-mono text-[7px]">0.984</text>
            <rect x="154" y="34" width="44" height="52" stroke="#DCE1EC" fill="#FFFFFF" />
            <text x="176" y="58" textAnchor="middle" className="fill-[#0D9488] font-mono text-[7px] font-bold">MATCH</text>
            <text x="176" y="69" textAnchor="middle" className="fill-[#0A0E1A] font-mono text-[7px]">L2 NORM</text>
          </svg>
          {animateVisuals && (
            <motion.div
              aria-hidden="true"
              className="absolute inset-x-14 h-[2px] bg-[#2F5BFF]/70 shadow-[0_0_8px_rgba(47,91,255,0.6)]"
              animate={{ y: [-46, 46, -46] }}
              transition={{ duration: 3.4, ease: 'easeInOut', repeat: Infinity }}
            />
          )}
        </div>
      )}

      {kind === 'anpr' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 220 120" className="w-44 h-28" fill="none" aria-hidden="true">
            <rect x="34" y="36" width="152" height="44" fill="#FFFFFF" stroke="#0A0E1A" strokeWidth="1.5" />
            <rect x="34" y="36" width="16" height="44" fill="#2F5BFF" />
            <text x="42" y="62" textAnchor="middle" className="fill-white font-mono text-[8px] font-bold">IN</text>
            <text x="118" y="64" textAnchor="middle" className="fill-[#0A0E1A] font-mono text-[15px] font-bold tracking-[0.2em]">OD 02 AB</text>
            <path d="M26 28 H54 M166 28 H194 M26 88 H54 M166 88 H194" stroke="#2F5BFF" strokeWidth="1.5" />
            <text x="110" y="102" textAnchor="middle" className="fill-[#475569] font-mono text-[7px]">NORMALIZED: OD02AB1234</text>
          </svg>
          {animateVisuals && (
            <motion.div
              aria-hidden="true"
              className="absolute top-9 bottom-11 w-[2px] bg-[#0D9488]"
              animate={{ x: [-58, 58, -58] }}
              transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity }}
            />
          )}
        </div>
      )}

      {kind === 'rbac' && (
        <svg viewBox="0 0 220 120" className="w-44 h-28" fill="none" aria-hidden="true">
          <rect x="22" y="24" width="78" height="32" fill="#FFFFFF" stroke="#2F5BFF" strokeWidth="1.5" />
          <text x="61" y="43" textAnchor="middle" className="fill-[#2F5BFF] font-mono text-[8px] font-bold">MODE 1: REQ</text>
          <rect x="120" y="24" width="78" height="32" fill="#FFFFFF" stroke="#0A0E1A" strokeWidth="1.2" />
          <text x="159" y="43" textAnchor="middle" className="fill-[#0A0E1A] font-mono text-[8px] font-bold">MODE 2: DIRECT</text>
          <path d="M61 56 V74 H159 V56 M110 74 V86" stroke="#CBD5E1" strokeWidth="1.5" />
          {animateVisuals && (
            <motion.path
              d="M61 56 V74 H110 V86"
              stroke="#2F5BFF"
              strokeWidth="2"
              strokeDasharray="6 6"
              animate={{ strokeDashoffset: [0, -24] }}
              transition={{ duration: 1.6, ease: 'linear', repeat: Infinity }}
            />
          )}
          <rect x="64" y="86" width="92" height="22" fill="#0A0E1A" />
          <text x="110" y="100" textAnchor="middle" className="fill-white font-mono text-[7.5px] font-bold">ADMIN POLICY MATRIX</text>
        </svg>
      )}

      {kind === 'camera' && (
        <svg viewBox="0 0 220 120" className="w-44 h-28" fill="none" aria-hidden="true">
          <rect x="76" y="14" width="68" height="92" rx="6" fill="#FFFFFF" stroke="#0A0E1A" strokeWidth="1.5" />
          <motion.circle
            cx="110"
            cy="48"
            r="20"
            stroke="#2F5BFF"
            strokeWidth="1.2"
            strokeDasharray="4 3"
            animate={animateVisuals ? { rotate: 360 } : {}}
            transition={{ duration: 12, ease: 'linear', repeat: Infinity }}
            style={{ originX: '110px', originY: '48px' }}
          />
          <circle cx="110" cy="48" r="14" stroke="#2F5BFF" strokeWidth="1.5" />
          <motion.circle
            cx="110"
            cy="48"
            r="7"
            fill="#2F5BFF"
            fillOpacity="0.18"
            stroke="#0D9488"
            strokeWidth="1.4"
            animate={animateVisuals ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 2.4, repeat: Infinity }}
          />
          <circle cx="110" cy="48" r="2.5" fill="#2F5BFF" />
          <rect x="88" y="78" width="44" height="14" fill="#EEF2FF" stroke="#2F5BFF" strokeWidth="0.8" />
          <text x="110" y="88" textAnchor="middle" className="fill-[#2F5BFF] font-mono text-[6.5px] font-bold">REAR ONLY</text>
        </svg>
      )}

      {kind === 'vault' && (
        <svg viewBox="0 0 220 120" className="w-44 h-28" fill="none" aria-hidden="true">
          <rect x="52" y="22" width="116" height="76" fill="#FFFFFF" stroke="#0A0E1A" strokeWidth="1.5" />
          <rect x="64" y="34" width="92" height="14" fill="#EEF2FF" stroke="#2F5BFF" strokeWidth="0.8" />
          <text x="110" y="44" textAnchor="middle" className="fill-[#2F5BFF] font-mono text-[7px] font-bold">PRIVATE BUCKET + RLS</text>
          <motion.circle
            cx="110"
            cy="70"
            r="12"
            stroke="#0D9488"
            strokeWidth="1.5"
            animate={animateVisuals ? { scale: [1, 1.15, 1], opacity: [0.85, 1, 0.85] } : {}}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <path d="M110 66 V74 M106 70 H114" stroke="#0D9488" strokeWidth="1.6" />
          <text x="110" y="92" textAnchor="middle" className="fill-[#475569] font-mono text-[6.5px]">SIGNED URL TTL: 3600s</text>
        </svg>
      )}

      {kind === 'audit' && (
        <svg viewBox="0 0 220 120" className="w-44 h-28" fill="none" aria-hidden="true">
          <motion.path
            d="M30 82 L64 68 L96 74 L132 42 L166 52 L194 26"
            stroke="#2F5BFF"
            strokeWidth="2.2"
            initial={animateVisuals ? { pathLength: 0.25 } : { pathLength: 1 }}
            animate={animateVisuals ? { pathLength: [0.25, 1, 1] } : {}}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
          />
          <circle cx="64" cy="68" r="3" fill="#2F5BFF" />
          <circle cx="132" cy="42" r="3" fill="#0D9488" />
          <motion.circle
            cx="194"
            cy="26"
            r="4"
            fill="#2F5BFF"
            animate={animateVisuals ? { scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] } : {}}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <line x1="26" y1="92" x2="196" y2="92" stroke="#0A0E1A" strokeWidth="1" />
          <text x="110" y="106" textAnchor="middle" className="fill-[#0A0E1A] font-mono text-[7px] font-bold">WS REALTIME · HMAC-SHA256</text>
        </svg>
      )}
    </div>
  );
};

export const EditorialGatewiseLanding: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'guard' | 'verify' | 'admin'>('guard');
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [recentEventsCount, setRecentEventsCount] = useState(0);
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [motionPlaying, setMotionPlaying] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setRecentEventsCount(liveSync.getEvents().length);
    const unsub = liveSync.subscribe(() => {
      setRecentEventsCount(liveSync.getEvents().length);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!motionPlaying) return;
    const id = setInterval(() => {
      setActiveStageIdx((prev) => (prev + 1) % PIPELINE_STAGES.length);
    }, 3200);
    return () => clearInterval(id);
  }, [motionPlaying]);

  const currentCommand = COMMAND_TABS.find((t) => t.id === activeTab) || COMMAND_TABS[0];

  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText(currentCommand.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failures in restricted environments
    }
  };

  const openLegal = (modal: 'privacy' | 'terms' | 'security' | 'compliance' | 'cookies') => {
    window.dispatchEvent(new CustomEvent('open-legal-modal', { detail: { modal } }));
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen w-full bg-[#2F5BFF] p-[5px] sm:p-[7px] selection:bg-[#2F5BFF] selection:text-white">
        {/* Main Editorial Light-Paper Sheet Framed Inside Ultramarine Cobalt Border */}
        <div className="relative min-h-screen w-full bg-[#FAF9F6] text-[#0A0E1A] overflow-x-clip">
          {/* Subtle vertical architectural rails matching 1080px grid */}
          <div className="hidden xl:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[540px] w-px bg-[#DCE1EC]/80 z-20" />
          <div className="hidden xl:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[540px] w-px bg-[#DCE1EC]/80 z-20" />

          {/* ================================================================= */}
          {/* STICKY 3-COLUMN ARCHITECTURAL HEADER                              */}
          {/* ================================================================= */}
          <header
            className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
              scrolled
                ? 'bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#DCE1EC]'
                : 'bg-[#FAF9F6]/90 border-b border-transparent'
            }`}
          >
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
              <nav
                aria-label="Primary"
                className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-4 md:py-5"
              >
                {/* Left Navigation */}
                <div className="flex items-center gap-6">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={mobileMenuOpen}
                    className="md:hidden p-2 border border-[#DCE1EC] bg-white text-[#0A0E1A] hover:border-[#0A0E1A] cursor-pointer"
                  >
                    {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  </button>

                  <ul className="hidden md:flex items-center gap-6 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#475569]">
                    <li>
                      <a href="#architecture" className="hover:text-[#2F5BFF] transition-colors">
                        Architecture
                      </a>
                    </li>
                    <li>
                      <a href="#terminal" className="hover:text-[#2F5BFF] transition-colors">
                        Guard App
                      </a>
                    </li>
                    <li>
                      <a href="#protocol" className="hover:text-[#2F5BFF] transition-colors">
                        Protocol
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Centered Editorial Crest */}
                <Link href="/" className="flex items-center gap-2.5 group">
                  <span className="w-8 h-8 bg-[#2F5BFF] flex items-center justify-center text-white shrink-0 transition-transform group-hover:scale-105">
                    <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none" aria-hidden="true">
                      <path
                        d="M9 24V15C9 11.134 12.134 8 16 8C19.866 8 23 11.134 23 15V24"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path d="M6 24H26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="16" cy="15" r="2.5" fill="#12B5A6" />
                    </svg>
                  </span>
                  <div className="flex flex-col leading-none">
                    <span className="font-display text-lg font-bold tracking-tight uppercase text-[#0A0E1A]">
                      Gatewise AI
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#475569]">
                      IIM Sambalpur
                    </span>
                  </div>
                </Link>

                {/* Right Navigation + Sharp Cobalt CTA */}
                <div className="flex items-center justify-end gap-5">
                  <ul className="hidden lg:flex items-center gap-6 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#475569]">
                    <li>
                      <Link href="/security" className="hover:text-[#2F5BFF] transition-colors">
                        Security
                      </Link>
                    </li>
                    <li>
                      <a href="#faq" className="hover:text-[#2F5BFF] transition-colors">
                        FAQ
                      </a>
                    </li>
                  </ul>

                  <Link
                    href="/admin/login"
                    className="inline-flex items-center gap-2 h-9 px-4 bg-[#2F5BFF] hover:bg-[#1E44E0] text-white font-mono text-[11px] font-semibold uppercase tracking-[0.1em] rounded-none transition-colors shrink-0"
                  >
                    <span>Admin Desk</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </nav>

              {/* Mobile Nav Drawer */}
              {mobileMenuOpen && (
                <div className="md:hidden border-t border-[#DCE1EC] py-4 space-y-3 bg-[#FAF9F6]">
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px] uppercase tracking-[0.1em]">
                    <a
                      href="#architecture"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 border border-[#DCE1EC] bg-white text-[#0A0E1A]"
                    >
                      Architecture
                    </a>
                    <a
                      href="#terminal"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 border border-[#DCE1EC] bg-white text-[#0A0E1A]"
                    >
                      Guard App
                    </a>
                    <a
                      href="#protocol"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 border border-[#DCE1EC] bg-white text-[#0A0E1A]"
                    >
                      Protocol
                    </a>
                    <Link
                      href="/security"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 border border-[#DCE1EC] bg-white text-[#0A0E1A]"
                    >
                      Security
                    </Link>
                  </div>
                  <Link
                    href="/guard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-2.5 text-center border border-[#0A0E1A] bg-white font-mono text-[11px] font-semibold uppercase tracking-[0.1em]"
                  >
                    Open Guard Web App (/guard)
                  </Link>
                </div>
              )}
            </div>
          </header>

          <main>
            {/* ================================================================= */}
            {/* SECTION 1: MONUMENTAL EDITORIAL POSTER HERO + ANIMATED VISUALS    */}
            {/* ================================================================= */}
            <section className="relative border-b border-[#DCE1EC] paper-grid overflow-hidden">
              <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-0 py-14 sm:py-20 lg:py-24">
                {/* Top Telemetry Eyebrow + Animation Playback Accessibility Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-dashed border-[#CBD5E1]">
                  <div className="inline-flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0A0E1A]">
                    <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                      {motionPlaying && (
                        <span className="animate-ping absolute inline-flex h-full w-full bg-[#15803D] opacity-60" />
                      )}
                      <span className="relative inline-flex h-2.5 w-2.5 bg-[#15803D]" />
                    </span>
                    <span>LIVE CLUSTER · IIM SAMBALPUR PERIMETER · SUPABASE POSTGRESQL</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#475569] hidden sm:inline">
                      LIGHT EDITION · EDGE VERIFICATION ENGINE
                    </span>
                    <button
                      type="button"
                      onClick={() => setMotionPlaying((prev) => !prev)}
                      aria-label={motionPlaying ? 'Pause live visual animations' : 'Play live visual animations'}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[#DCE1EC] bg-white hover:border-[#0A0E1A] font-mono text-[10px] font-bold uppercase text-[#0A0E1A] cursor-pointer"
                    >
                      {motionPlaying ? <Pause className="w-3 h-3 text-[#2F5BFF]" /> : <Play className="w-3 h-3 text-[#2F5BFF]" />}
                      <span>{motionPlaying ? 'Pause Motion' : 'Play Motion'}</span>
                    </button>
                  </div>
                </div>

                {/* Asymmetric 12-Col Poster Hero */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="lg:col-span-7 space-y-7 relative"
                  >
                    <div className="relative inline-block">
                      <DoodleSparkle
                        className="hidden sm:block absolute w-7 h-7 text-[#2F5BFF] -top-7 -left-8 pointer-events-none"
                        color="#2F5BFF"
                      />
                      <DoodleSparkle
                        className="hidden sm:block absolute w-5 h-5 text-[#0D9488] top-1 -right-7 pointer-events-none"
                        color="#0D9488"
                      />
                      <h1 className="font-display font-bold uppercase text-[3.3rem] sm:text-[4.6rem] lg:text-[5.5rem] leading-[0.94] tracking-[-0.025em] text-[#0A0E1A]">
                        The Gate System That{' '}
                        <span className="relative inline-block text-[#2F5BFF] pb-1">
                          Verifies
                          <DoodleUnderline className="absolute left-0 -bottom-1 w-full h-3.5 text-[#2F5BFF] pointer-events-none" />
                        </span>{' '}
                        At Edge Speed.
                      </h1>
                    </div>

                    <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl font-normal">
                      One centralized biometric &amp; ANPR truth layer uniting the{' '}
                      <strong className="text-[#0A0E1A] font-semibold">Admin Web Dashboard</strong>{' '}
                      and smartphone{' '}
                      <strong className="text-[#0A0E1A] font-semibold">Guard Web Terminal</strong>{' '}
                      over real-time PostgreSQL sync, rear-camera verification, and strict Mode 1 /
                      Mode 2 permissions.
                    </p>

                    {/* Flush Hermes-Style Sharp Rectangular Action Pair */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-0 max-w-lg">
                      <Link
                        href="/admin/login"
                        className="inline-flex items-center justify-center gap-2.5 h-12 px-6 bg-[#2F5BFF] hover:bg-[#1E44E0] text-white font-mono text-xs font-semibold uppercase tracking-[0.1em] rounded-none transition-colors"
                      >
                        <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Launch Admin Desk</span>
                      </Link>
                      <Link
                        href="/guard"
                        className="inline-flex items-center justify-center gap-2.5 h-12 px-6 bg-white hover:bg-[#F2F4F8] text-[#0A0E1A] border border-[#0A0E1A] sm:border-l-0 font-mono text-xs font-semibold uppercase tracking-[0.1em] rounded-none transition-colors"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-[#2F5BFF]" aria-hidden="true" />
                        <span>Open Guard Web App</span>
                      </Link>
                    </div>

                    {/* Interactive Tabbed Terminal Command Strip */}
                    <div className="pt-2 max-w-xl">
                      <div
                        role="tablist"
                        aria-label="Deployment routes"
                        className="inline-flex border border-[#2F5BFF] border-b-0 bg-white"
                      >
                        {COMMAND_TABS.map((tab) => {
                          const selected = activeTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              role="tab"
                              aria-selected={selected}
                              onClick={() => setActiveTab(tab.id)}
                              className={`px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors cursor-pointer ${
                                selected
                                  ? 'bg-[#2F5BFF] text-white'
                                  : 'bg-white text-[#475569] hover:text-[#0A0E1A]'
                              }`}
                            >
                              {tab.label}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between gap-3 bg-[#2F5BFF] text-white px-4 py-3 font-mono text-xs border border-[#2F5BFF]">
                        <code className="truncate">{currentCommand.code}</code>
                        <button
                          type="button"
                          onClick={handleCopyCommand}
                          aria-label="Copy endpoint or route"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/15 hover:bg-white/25 text-white text-[10px] font-semibold uppercase tracking-[0.08em] shrink-0 cursor-pointer transition-colors"
                        >
                          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Column: Live Animated Architectural Perimeter Plate */}
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="lg:col-span-5"
                  >
                    <div className="border border-[#0A0E1A] bg-white p-5 sm:p-6 space-y-5 shadow-[8px_8px_0px_#2F5BFF]">
                      <div className="flex items-center justify-between border-b border-[#DCE1EC] pb-3 font-mono text-[10px] uppercase tracking-[0.12em]">
                        <span className="text-[#2F5BFF] font-bold">SYSTEM SPECIFICATION</span>
                        <span className="text-[#475569]">NODE N-01 · GATE-01</span>
                      </div>

                      {/* Animated Interactive Perimeter Scan & Sync Graph Visual */}
                      <HeroPerimeterVisualizer animateVisuals={motionPlaying} />

                      {/* 3 Clean Key-Value Specs */}
                      <dl className="grid grid-cols-3 gap-3 pt-7 font-mono text-xs relative">
                        <div className="border border-[#DCE1EC] bg-[#FAF9F6] p-3 relative">
                          <DoodleArrowNote
                            label="rear lens!"
                            direction="left"
                            className="hidden sm:inline-flex absolute -top-7 left-0 text-[#2F5BFF] pointer-events-none"
                          />
                          <dt className="text-[9px] uppercase tracking-[0.1em] text-[#475569]">Optics</dt>
                          <dd className="font-bold text-[#0A0E1A] mt-1">Rear Cam</dd>
                        </div>
                        <div className="border border-[#DCE1EC] bg-[#FAF9F6] p-3">
                          <dt className="text-[9px] uppercase tracking-[0.1em] text-[#475569]">Database</dt>
                          <dd className="font-bold text-[#2F5BFF] mt-1">PostgreSQL</dd>
                        </div>
                        <div className="border border-[#DCE1EC] bg-[#FAF9F6] p-3">
                          <dt className="text-[9px] uppercase tracking-[0.1em] text-[#475569]">Theme</dt>
                          <dd className="font-bold text-[#0D9488] mt-1">Light Only</dd>
                        </div>
                      </dl>
                      <div className="pt-3 flex items-center justify-between gap-4 border-t border-dashed border-[#DCE1EC]">
                        <DoodleGateSketch className="w-40 h-16 text-[#0A0E1A]/80 shrink-0" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#475569] text-right leading-relaxed">
                          Hand-wired biometric &amp; LPR gate loop
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* ================================================================= */}
            {/* SECTION 2: EARLIER GUARD WEB APP UI/UX + ANIMATED PIPELINE STAGE  */}
            {/* ================================================================= */}
            <section id="terminal" className="bg-white border-b border-[#DCE1EC]">
              <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-0 py-16 sm:py-24">
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-3 relative pt-4">
                  <DoodleArrowNote
                    label="phones only!"
                    direction="right"
                    className="hidden md:inline-flex absolute -top-3 right-12 text-[#2F5BFF] pointer-events-none"
                  />
                  <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2F5BFF] inline-flex items-center gap-2">
                    <span>HANDHELD FIELD TERMINAL · /GUARD</span>
                  </div>
                  <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#0A0E1A] relative inline-block">
                    Guard Mobile Web App
                    <DoodleSparkle
                      className="hidden sm:block absolute w-5 h-5 -top-3 -right-7 pointer-events-none"
                      color="#2F5BFF"
                    />
                  </h2>
                  <div className="flex justify-center pt-1">
                    <DoodleZigZagDivider className="w-40 h-3 text-[#2F5BFF]/70" />
                  </div>
                  <p className="text-sm sm:text-base text-[#475569]">
                    Unchanged intuitive Guard Mobile Web App experience — clean light UI, rear camera
                    only, connected live to the Administrator PostgreSQL database.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  {/* Embedded Authentic Earlier Guard Web App (Light Theme) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-5 flex flex-col items-center"
                  >
                    <div className="w-full max-w-[360px] bg-white rounded-[36px] border border-[#CBD5E1] p-2.5 shadow-[0_20px_50px_-15px_rgba(47,91,255,0.18)]">
                      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#E2E8F0] mb-2 font-mono text-[10px] text-[#475569]">
                        <span className="font-bold text-[#0A0E1A]">GATEWISE GUARD // LIVE UI</span>
                        <span className="inline-flex items-center gap-1 text-[#15803D] font-bold">
                          <span className="w-1.5 h-1.5 bg-[#15803D] rounded-full animate-pulse" />
                          SYNC
                        </span>
                      </div>
                      <div className="h-[620px] overflow-y-auto rounded-[28px]">
                        <GuardWebApp embedded={true} />
                      </div>
                    </div>
                  </motion.div>

                  {/* Animated Interactive 4-Stage Pipeline Explorer */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="border border-[#DCE1EC] bg-[#FAF9F6] p-6 space-y-5">
                      <div className="flex items-center justify-between border-b border-dashed border-[#CBD5E1] pb-4">
                        <div>
                          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#2F5BFF] block">
                            INTERACTIVE LIVE TELEMETRY
                          </span>
                          <h3 className="font-display text-2xl font-bold uppercase text-[#0A0E1A] mt-0.5">
                            Four-Stage Verification Execution
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => liveSync.refreshActiveContext()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#0A0E1A] bg-white hover:bg-[#F2F4F8] font-mono text-[10px] font-semibold uppercase tracking-[0.08em] cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3 text-[#2F5BFF]" />
                          <span>Refresh Sync</span>
                        </button>
                      </div>

                      <PipelineStageVisual
                        activeStageIdx={activeStageIdx}
                        animateVisuals={motionPlaying}
                      />

                      <div className="space-y-3">
                        {PIPELINE_STAGES.map((stage, idx) => {
                          const isActive = activeStageIdx === idx;
                          return (
                            <motion.button
                              key={stage.step}
                              type="button"
                              onClick={() => {
                                setMotionPlaying(false);
                                setActiveStageIdx(idx);
                              }}
                              whileHover={{ x: 3 }}
                              className={`w-full text-left grid grid-cols-[auto_1fr_auto] gap-4 items-start p-4 border transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-white border-[#2F5BFF] shadow-[4px_4px_0px_#2F5BFF]'
                                  : 'bg-white border-[#DCE1EC] hover:border-[#0A0E1A]'
                              }`}
                            >
                              <span
                                className={`font-mono text-xs font-bold pt-0.5 ${
                                  isActive ? 'text-[#2F5BFF]' : 'text-[#475569]'
                                }`}
                              >
                                {stage.step}
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-sm text-[#0A0E1A]">{stage.title}</h4>
                                  {isActive && (
                                    <span className="w-2 h-2 bg-[#15803D] rounded-full animate-pulse" />
                                  )}
                                </div>
                                <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                                  {stage.detail}
                                </p>
                              </div>
                              <div className="hidden sm:flex flex-col items-end gap-1">
                                <span
                                  className={`font-mono text-[9px] font-semibold uppercase tracking-[0.1em] px-2 py-1 border ${
                                    isActive
                                      ? 'bg-[#2F5BFF] text-white border-[#2F5BFF]'
                                      : 'bg-[#EEF2FF] text-[#2F5BFF] border-[#2F5BFF]/20'
                                  }`}
                                >
                                  {idx === 3 ? `${recentEventsCount} EVENTS` : stage.badge}
                                </span>
                                <span className="font-mono text-[9px] text-[#475569]">
                                  {stage.metric}
                                </span>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ================================================================= */}
            {/* VISUAL SYNC BLUEPRINT BAND                                        */}
            {/* ================================================================= */}
            <SystemPanoramaDiagram animateVisuals={motionPlaying} />

            {/* ================================================================= */}
            {/* SECTION 3: 6-TILE ANIMATED EDITORIAL CAPABILITIES GRID (#01 - #06) */}
            {/* ================================================================= */}
            <section id="architecture" className="bg-[#FAF9F6] border-b border-[#DCE1EC]">
              <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-0 py-16 sm:py-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-10 mb-12 border-b border-[#DCE1EC]">
                  <div className="relative">
                    <DoodleSparkle
                      className="hidden sm:block absolute w-6 h-6 -top-5 -left-7 pointer-events-none"
                      color="#0D9488"
                    />
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2F5BFF] block mb-2">
                      CORE CAPABILITIES
                    </span>
                    <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl tracking-tight text-[#0A0E1A]">
                      Built For Sovereign Campus Perimeters.
                    </h2>
                  </div>
                  <Link
                    href="/features"
                    className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-[#2F5BFF] hover:underline"
                  >
                    <span>Full Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
                  {CAPABILITIES.map((cap, idx) => (
                    <motion.article
                      key={cap.index}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.4, delay: idx * 0.06 }}
                      className="group flex flex-col justify-between space-y-5"
                    >
                      <div className="space-y-2.5">
                        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2F5BFF] block">
                          {cap.index}
                        </span>
                        <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-[#0A0E1A]">
                          {cap.title}
                        </h3>
                        <p className="text-sm text-[#475569] leading-relaxed">{cap.description}</p>
                      </div>
                      <figure className="m-0">
                        <EngravingFigure kind={cap.visual} animateVisuals={motionPlaying} />
                      </figure>
                    </motion.article>
                  ))}
                </div>
              </div>
            </section>

            {/* ================================================================= */}
            {/* SECTION 4: 3-COLUMN SURFACE CARDS WITH HOVER DEPTH                */}
            {/* ================================================================= */}
            <section className="bg-[#F2F4F8] border-b border-[#DCE1EC]">
              <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-0 py-16 sm:py-24">
                <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2F5BFF] block">
                    UNIFIED ARCHITECTURE
                  </span>
                  <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl tracking-tight text-[#0A0E1A]">
                    Three Surfaces. One Database.
                  </h2>
                  <p className="text-sm text-[#475569]">
                    Zero local silos or offline caches out of sync. Every action hits the central
                    truth layer.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                  {(
                    [
                      {
                        kind: 'guard' as const,
                        eyebrow: 'SMARTPHONES · REAR CAM ONLY',
                        name: 'Guard App',
                        cta: 'Open /guard Terminal',
                        href: '/guard',
                        icon: <Camera className="w-4 h-4 text-[#2F5BFF]" aria-hidden="true" />,
                        sub: 'Mobile gate verification & request submission',
                      },
                      {
                        kind: 'admin' as const,
                        eyebrow: 'ADMINISTRATOR PORTAL',
                        name: 'Admin Desk',
                        cta: 'Launch Command Centre',
                        href: '/admin/login',
                        icon: <ShieldCheck className="w-4 h-4 text-[#2F5BFF]" aria-hidden="true" />,
                        sub: 'People DB, Vehicles, Guards & Live Gate Feed',
                      },
                      {
                        kind: 'api' as const,
                        eyebrow: 'CLOUD POSTGRESQL + RLS',
                        name: 'Edge API',
                        cta: 'Inspect Architecture',
                        href: '/how-it-works',
                        icon: <Database className="w-4 h-4 text-[#2F5BFF]" aria-hidden="true" />,
                        sub: 'Private signed storage, HMAC tokens & audit logs',
                      },
                    ]
                  ).map((surface, i) => (
                    <motion.div
                      key={surface.name}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.35, delay: i * 0.08 }}
                      className="relative bg-white border border-[#DCE1EC] hover:border-[#2F5BFF] hover:shadow-[6px_6px_0px_#2F5BFF] paper-halftone p-6 flex flex-col items-center justify-between text-center space-y-5 transition-shadow"
                    >
                      <SurfacePreviewArtwork kind={surface.kind} animateVisuals={motionPlaying} />

                      <div className="space-y-2">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#475569] block">
                          {surface.eyebrow}
                        </span>
                        <h3 className="font-display font-bold text-3xl uppercase tracking-tight text-[#0A0E1A]">
                          {surface.name}
                        </h3>
                        <p className="text-xs text-[#475569] max-w-[230px] mx-auto pt-0.5">
                          {surface.sub}
                        </p>
                      </div>

                      <Link
                        href={surface.href}
                        className="inline-flex items-center justify-center gap-2 w-full h-10 bg-white border border-[#0A0E1A] hover:bg-[#2F5BFF] hover:text-white hover:border-[#2F5BFF] text-[#0A0E1A] font-mono text-[11px] font-semibold uppercase tracking-[0.1em] rounded-none transition-colors"
                      >
                        {surface.icon}
                        <span>{surface.cta}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ================================================================= */}
            {/* SECTION 5: PROTOCOL & ACCESS TIER COMPARISON TABLE                */}
            {/* ================================================================= */}
            <section id="protocol" className="bg-white border-b border-[#DCE1EC]">
              <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-0 py-16 sm:py-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                  <div className="flex items-start gap-4">
                    <DoodleClipboardCheck className="w-12 h-14 text-[#2F5BFF] shrink-0 hidden sm:block mt-1" />
                    <div>
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2F5BFF] block mb-2">
                        ACCESS GOVERNANCE MATRIX
                      </span>
                      <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl tracking-tight text-[#0A0E1A]">
                        Gate Verification Policies
                      </h2>
                    </div>
                  </div>
                  <Link
                    href="/admin/guards"
                    className="inline-flex items-center gap-2 h-9 px-4 bg-[#2F5BFF] hover:bg-[#1E44E0] text-white font-mono text-[11px] font-semibold uppercase tracking-[0.1em] rounded-none transition-colors self-start"
                  >
                    <span>Configure Guard Permissions</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>

                <div className="overflow-x-auto border border-[#DCE1EC]">
                  <table className="w-full text-left border-collapse min-w-[680px]">
                    <caption className="sr-only">
                      Comparison of Gatewise AI registration and verification modes
                    </caption>
                    <thead>
                      <tr className="border-b border-[#DCE1EC] bg-[#FAF9F6] font-mono text-[11px] uppercase tracking-[0.1em]">
                        <th scope="col" className="py-4 px-4 text-[#475569] font-semibold">
                          Control Layer
                        </th>
                        <th scope="col" className="py-4 px-4 text-[#0A0E1A] font-bold">
                          Pre-Registered
                        </th>
                        <th scope="col" className="py-4 px-4 bg-[#2F5BFF] text-white font-bold">
                          <div className="flex items-center gap-2">
                            <span>Mode 1 · Approval</span>
                            <span className="px-1.5 py-0.5 bg-white text-[#2F5BFF] text-[9px] font-extrabold">
                              DEFAULT
                            </span>
                          </div>
                        </th>
                        <th scope="col" className="py-4 px-4 text-[#0A0E1A] font-bold">
                          Mode 2 · Direct
                        </th>
                        <th scope="col" className="py-4 px-4 text-[#C93338] font-bold">
                          Suspended
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-xs sm:text-sm">
                      {MATRIX_ROWS.map((row) => (
                        <tr key={row.feature} className="border-b border-[#DCE1EC] last:border-b-0">
                          <th scope="row" className="py-3.5 px-4 font-semibold text-[#0A0E1A]">
                            {row.feature}
                          </th>
                          <td className="py-3.5 px-4 text-[#475569] font-mono text-xs">
                            {row.preReg}
                          </td>
                          <td className="py-3.5 px-4 bg-[#EEF2FF] text-[#10266B] font-mono text-xs font-semibold">
                            {row.mode1}
                          </td>
                          <td className="py-3.5 px-4 text-[#475569] font-mono text-xs">
                            {row.mode2}
                          </td>
                          <td className="py-3.5 px-4 text-[#C93338] font-mono text-xs font-semibold">
                            {row.suspended}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ================================================================= */}
            {/* SECTION 6: DASHED-RULE ANIMATED FAQ ACCORDION                     */}
            {/* ================================================================= */}
            <section id="faq" className="bg-[#FAF9F6] border-b border-[#DCE1EC]">
              <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-0 py-16 sm:py-24">
                <div className="mb-10 relative inline-block">
                  <DoodleSparkle
                    className="hidden sm:block absolute w-5 h-5 -top-2 -right-7 pointer-events-none"
                    color="#2F5BFF"
                  />
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2F5BFF] block mb-2">
                    OPERATIONAL REFERENCE
                  </span>
                  <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl tracking-tight text-[#0A0E1A]">
                    FAQs
                  </h2>
                </div>

                <div className="border-t border-dashed border-[#CBD5E1]">
                  {FAQS.map((item, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div key={item.q} className="border-b border-dashed border-[#CBD5E1]">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          className="w-full py-5 flex items-center justify-between gap-4 text-left cursor-pointer group"
                        >
                          <span className="text-sm sm:text-base font-semibold text-[#2F5BFF] group-hover:text-[#10266B] transition-colors">
                            {item.q}
                          </span>
                          <span className="shrink-0 text-[#0A0E1A]" aria-hidden="true">
                            {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="pb-5 pr-8 text-sm text-[#475569] leading-relaxed">
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </main>

          {/* ================================================================= */}
          {/* SECTION 7: DUAL EDITORIAL SIGNATURE FOOTER STACK                  */}
          {/* ================================================================= */}
          <section className="relative bg-[#FAF9F6] border-b border-[#DCE1EC] overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none select-none font-display font-bold uppercase text-[22vw] leading-none tracking-tighter text-[#0A0E1A]/[0.03] text-center py-4"
            >
              GATEWISE
            </div>
            <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-0 py-10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="text-center md:text-left">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#0A0E1A]">
                  IIM Sambalpur Institutional Security Cluster
                </p>
                <p className="text-xs text-[#475569] mt-1">
                  Verified on Light-Only Editorial Interface · Rear-Camera Guard App · Supabase PostgreSQL
                </p>
              </div>

              <div className="flex items-center gap-3">
                {[
                  { label: '128-D', icon: <UserCheck className="w-4 h-4 text-[#2F5BFF]" /> },
                  { label: 'ANPR', icon: <Activity className="w-4 h-4 text-[#2F5BFF]" /> },
                  { label: 'AUDIT', icon: <FileCheck2 className="w-4 h-4 text-[#2F5BFF]" /> },
                ].map((badge) => (
                  <div
                    key={badge.label}
                    className="w-16 h-16 border border-[#DCE1EC] bg-white flex flex-col items-center justify-center gap-1"
                  >
                    {badge.icon}
                    <span className="font-mono text-[9px] font-bold text-[#0A0E1A]">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.1em] text-[#475569]">
                <button
                  type="button"
                  onClick={() => openLegal('terms')}
                  className="hover:text-[#2F5BFF] cursor-pointer"
                >
                  Terms
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => openLegal('privacy')}
                  className="hover:text-[#2F5BFF] cursor-pointer"
                >
                  Privacy
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => openLegal('cookies')}
                  className="hover:text-[#2F5BFF] cursor-pointer"
                >
                  Cookies
                </button>
              </div>
            </div>
          </section>

          <footer className="bg-[#2F5BFF] text-white">
            <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-0 py-14 sm:py-20 space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/20 pb-10">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/80">
                    <span className="w-2 h-2 bg-white inline-block" aria-hidden="true" />
                    <span>SOVEREIGN PERIMETER OPERATIONS</span>
                  </div>
                  <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl tracking-tight text-white">
                    The Campus Perimeter Engine.
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/guard"
                    className="inline-flex items-center justify-center h-10 px-5 bg-white text-[#2F5BFF] hover:bg-[#EEF2FF] font-mono text-[11px] font-bold uppercase tracking-[0.1em] rounded-none transition-colors"
                  >
                    Guard Mobile Web App
                  </Link>
                  <Link
                    href="/admin/login"
                    className="inline-flex items-center justify-center h-10 px-5 border border-white text-white hover:bg-white/10 font-mono text-[11px] font-bold uppercase tracking-[0.1em] rounded-none transition-colors"
                  >
                    Admin Desk Login
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs">
                <div className="space-y-3">
                  <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
                    Platform
                  </h3>
                  <ul className="space-y-2 text-white/90">
                    <li><Link href="/product" className="hover:underline">Overview</Link></li>
                    <li><Link href="/features" className="hover:underline">Capabilities</Link></li>
                    <li><Link href="/how-it-works" className="hover:underline">Architecture</Link></li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
                    Guard App
                  </h3>
                  <ul className="space-y-2 text-white/90">
                    <li><Link href="/guard" className="hover:underline">Guard Login</Link></li>
                    <li><Link href="/installation" className="hover:underline">Gate Deployment</Link></li>
                    <li><Link href="/faq" className="hover:underline">Operations FAQ</Link></li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
                    Admin Control
                  </h3>
                  <ul className="space-y-2 text-white/90">
                    <li><Link href="/admin/login" className="hover:underline">Command Centre</Link></li>
                    <li><Link href="/admin/people" className="hover:underline">People Database</Link></li>
                    <li><Link href="/admin/guards" className="hover:underline">Guard Permissions</Link></li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
                    Compliance
                  </h3>
                  <ul className="space-y-2 text-white/90">
                    <li><Link href="/security" className="hover:underline">Security Whitepaper</Link></li>
                    <li>
                      <button
                        type="button"
                        onClick={() => openLegal('compliance')}
                        className="hover:underline cursor-pointer"
                      >
                        DPDP &amp; ISO 27001
                      </button>
                    </li>
                    <li><Link href="/support" className="hover:underline">Support Desk</Link></li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.1em] text-white/80">
                <span>© {new Date().getFullYear()} GATEWISE AI · IIM SAMBALPUR DEPLOYMENT</span>
                <span>NO DEMO DATA · HMAC-SHA256 AUDITED · LIGHT EDITION</span>
              </div>
            </div>
          </footer>
        </div>

        {/* Institutional Compliance Modals & Cookies */}
        <CookieConsent />
        <LegalModals />
      </div>
    </MotionConfig>
  );
};
