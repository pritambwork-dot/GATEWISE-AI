'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Smartphone, Monitor, ArrowRight, CheckCircle2,
  Lock, Eye, Shield, Cpu, Activity, Clock, Users, DoorClosed,
  Download, QrCode, Sparkles, ChevronRight, AlertCircle, RefreshCw,
  Fingerprint, Key, Check, X, Camera, Car, Radio, Sliders, Zap
} from 'lucide-react';
import Campus3DView from '@/components/Campus3DView';
import ProductHeroShowcase from '@/components/showcase/ProductHeroShowcase';
import ProductVideoPlayer from '@/components/showcase/ProductVideoPlayer';
import InteractiveProductGallery from '@/components/showcase/InteractiveProductGallery';
import ProductExperienceSections from '@/components/showcase/ProductExperienceSections';

export default function PublicHomePage() {
  const [releaseInfo, setReleaseInfo] = useState<{
    published: boolean;
    version_name?: string;
  }>({ published: false, version_name: '1.0.0' });

  // Interactive Stage state
  const [heroTab, setHeroTab] = useState<'guard' | 'campus' | 'anpr'>('guard');
  const [guardDecision, setGuardDecision] = useState<'idle' | 'granted' | 'flagged'>('idle');
  const [satelliteTimestamp, setSatelliteTimestamp] = useState<string>('14:32:08 IST');

  // Process accordion state
  const [activeStep, setActiveStep] = useState<number>(1);

  // Bento interactive threshold slider
  const [cosineThreshold, setCosineThreshold] = useState<number>(0.72);
  const [guardMode, setGuardMode] = useState<'standard' | 'enhanced'>('standard');

  useEffect(() => {
    fetch('/releases/android-release.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setReleaseInfo({
            published: data.published,
            version_name: data.version_name || '1.0.0',
          });
        }
      })
      .catch(() => {});

    const timer = setInterval(() => {
      const now = new Date();
      setSatelliteTimestamp(now.toTimeString().split(' ')[0] + ' IST');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleGrant = () => {
    setGuardDecision('granted');
    setTimeout(() => setGuardDecision('idle'), 3500);
  };

  const handleFlag = () => {
    setGuardDecision('flagged');
    setTimeout(() => setGuardDecision('idle'), 3500);
  };

  return (
    <div className="space-y-20 md:space-y-32 pb-28 overflow-hidden bg-background">

      {/* ========================================================================= */}
      {/* 1. MASTER PRODUCT HERO: REAL DEVICE-PAIR COMPOSITION & KEY METRICS        */}
      {/* ========================================================================= */}
      <ProductHeroShowcase />

      {/* ========================================================================= */}
      {/* 2. CINEMATIC PRODUCT WALKTHROUGH VIDEO (H.264 + WEBM + WEBVTT CAPTIONS)  */}
      {/* ========================================================================= */}
      <ProductVideoPlayer />

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE 24-SCREEN PRODUCT GALLERY WITH LIGHTBOX MODAL & CATEGORIES */}
      {/* ========================================================================= */}
      <InteractiveProductGallery />

      {/* ========================================================================= */}
      {/* 4. DEDICATED PRODUCT EXPERIENCE SECTIONS (SECTIONS A, B, C, D)            */}
      {/* ========================================================================= */}
      <ProductExperienceSections />

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE LIVE SIMULATION STAGE (GUARD HUD / 3D TWIN / ANPR)         */}
      {/* ========================================================================= */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2.5 px-3 py-1 rounded-full bg-white border border-black/[0.08] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-gatewise-text tracking-tight">Interactive Simulation Deck</span>
              <span className="text-black/20">•</span>
              <span className="text-[10px] font-mono text-gatewise-secondary uppercase">Live Hardware Sandbox</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gatewise-text tracking-tight leading-[1.08]">
              Experience Real-Time{' '}
              <span className="text-gatewise-primary">Perimeter Operations.</span>
            </h2>

            <p className="text-sm sm:text-base text-gatewise-secondary leading-relaxed font-normal">
              Switch between the on-device guard viewfinder, the 3D campus twin, and optical character recognition for vehicle license plates. Test the sovereign guard override button below.
            </p>

            {/* Tactical Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/download"
                className="px-6 py-3.5 rounded-full bg-gatewise-primary text-white text-xs sm:text-sm font-semibold hover:bg-gatewise-deep active:scale-98 transition-all shadow-sm hover:shadow flex items-center space-x-2.5 group"
              >
                <Smartphone className="w-4 h-4" />
                <span>Install Guard APK</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/showcase"
                className="px-6 py-3.5 rounded-full border border-black/[0.1] bg-white text-gatewise-text text-xs sm:text-sm font-semibold hover:bg-black/[0.02] active:scale-98 transition-all shadow-2xs flex items-center space-x-2"
              >
                <span>Launch Motion Lab</span>
                <ChevronRight className="w-3.5 h-3.5 text-gatewise-secondary" />
              </Link>
            </div>

            {/* Micro-proof strip */}
            <div className="pt-5 flex flex-wrap items-center gap-6 text-xs text-gatewise-secondary border-t border-black/[0.06]">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gatewise-primary" />
                <span className="font-medium text-gatewise-text">YuNet 28ms</span>
                <span className="text-gatewise-secondary">Edge Detection</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gatewise-primary" />
                <span className="font-medium text-gatewise-text">SFace 128-D</span>
                <span className="text-gatewise-secondary">Cosine Match</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gatewise-primary" />
                <span className="font-medium text-gatewise-text">HMAC-SHA256</span>
                <span className="text-gatewise-secondary">Officer Seal</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Stage Window Frame */}
          <div className="lg:col-span-7 relative">
            <div className="w-full rounded-3xl bg-white border border-black/[0.08] ss-stage-shadow overflow-hidden flex flex-col relative">
              
              {/* Window Chrome Header Bar with macOS traffic lights & View Switcher */}
              <div className="h-11 px-4 bg-[#f8faf8] border-b border-black/[0.06] flex items-center justify-between gap-3 shrink-0 select-none">
                {/* Traffic lights */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] border border-black/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e] border border-black/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840] border border-black/10" />
                </div>

                {/* View Switcher Tabs inside Window Bar */}
                <div className="flex items-center bg-black/[0.04] p-0.5 rounded-lg text-[11px] font-medium text-gatewise-secondary">
                  <button
                    onClick={() => setHeroTab('guard')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      heroTab === 'guard'
                        ? 'bg-white text-gatewise-text font-semibold shadow-2xs'
                        : 'hover:text-gatewise-text'
                    }`}
                  >
                    Guard Viewfinder
                  </button>
                  <button
                    onClick={() => setHeroTab('campus')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      heroTab === 'campus'
                        ? 'bg-white text-gatewise-text font-semibold shadow-2xs'
                        : 'hover:text-gatewise-text'
                    }`}
                  >
                    3D Campus Twin
                  </button>
                  <button
                    onClick={() => setHeroTab('anpr')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      heroTab === 'anpr'
                        ? 'bg-white text-gatewise-text font-semibold shadow-2xs'
                        : 'hover:text-gatewise-text'
                    }`}
                  >
                    Gate ANPR
                  </button>
                </div>

                {/* Live stream status */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>GATE-01</span>
                </div>
              </div>

              {/* Stage Body */}
              <div className="relative min-h-[460px] p-6 bg-[#f7faf7] flex flex-col justify-between">
                
                {/* TAB 1: Guard Viewfinder Interactive Product UI */}
                {heroTab === 'guard' && (
                  <div className="space-y-4">
                    {/* Viewfinder simulation box */}
                    <div className="relative bg-[#151c18] rounded-2xl p-5 text-white overflow-hidden shadow-inner border border-black/20">
                      
                      {/* Tactical corner reticles */}
                      <span className="tactical-reticle top-3 left-3 border-t-2 border-l-2" />
                      <span className="tactical-reticle top-3 right-3 border-t-2 border-r-2" />
                      <span className="tactical-reticle bottom-3 left-3 border-b-2 border-l-2" />
                      <span className="tactical-reticle bottom-3 right-3 border-b-2 border-r-2" />

                      {/* Header in viewfinder */}
                      <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 mb-4">
                        <div className="flex items-center gap-2">
                          <Camera className="w-3.5 h-3.5" />
                          <span>OPTICAL VIEW • 1080P 60FPS</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                          YUNET DETECTED: 1 FACE (0.998)
                        </span>
                      </div>

                      {/* Applicant match payload card */}
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-bold flex items-center justify-center text-lg shrink-0 border border-white/20">
                            <span>MS</span>
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-white truncate">Dr. Maya Sharma</h4>
                              <span className="px-1.5 py-0.2 rounded bg-emerald-400/20 text-emerald-300 text-[10px] font-mono">
                                FACULTY
                              </span>
                            </div>
                            <p className="text-xs text-white/70 truncate">Research Fellow • Dept. of Bioengineering</p>
                            <p className="text-[10px] font-mono text-white/50">ID: IIMS-RF-2024-884 • North Gate 01 PASS</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-mono text-emerald-300 uppercase block">Cosine Match</span>
                          <span className="text-2xl font-black text-white tracking-tight">
                            98.4<span className="text-xs font-normal text-emerald-300">%</span>
                          </span>
                        </div>
                      </div>

                      {/* Cosine Vector Match Progress Line */}
                      <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between text-[11px] font-mono text-white/60">
                          <span>Vector Distance Metric</span>
                          <span className="text-emerald-400 font-semibold">0.984 &gt; 0.720 Threshold (PASS)</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: '98.4%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Sovereign Officer Decision Buttons (Interactive) */}
                    <div className="bg-white rounded-2xl p-4 border border-black/[0.06] space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-gatewise-text">Sovereign Guard Action</span>
                        <span className="text-[10px] font-mono text-gatewise-secondary">HMAC Key: Active</span>
                      </div>

                      {guardDecision === 'granted' ? (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in zoom-in-95 duration-150">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>ACCESS GRANTED • Boom Barrier Raised • HMAC Sealed</span>
                          </div>
                          <span className="text-[10px] font-mono bg-emerald-200/60 px-2 py-0.5 rounded text-emerald-900">#7f4a-92b1</span>
                        </div>
                      ) : guardDecision === 'flagged' ? (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center justify-between animate-in fade-in zoom-in-95 duration-150">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                            <span>REFERRED TO DESK • Visitor Pass Required</span>
                          </div>
                          <span className="text-[10px] font-mono bg-amber-200/60 px-2 py-0.5 rounded text-amber-900">FLAG-04</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            onClick={handleGrant}
                            className="py-2.5 px-4 rounded-xl bg-gatewise-primary hover:bg-gatewise-deep active:scale-98 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                          >
                            <Check className="w-4 h-4 stroke-[2.5]" />
                            <span>Grant Clearance</span>
                          </button>
                          <button
                            onClick={handleFlag}
                            className="py-2.5 px-4 rounded-xl bg-[#ecefe9] hover:bg-[#e1e5df] active:scale-98 text-gatewise-text text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                            <span>Refer to Booth</span>
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* TAB 2: 3D Campus Digital Twin */}
                {heroTab === 'campus' && (
                  <div className="space-y-3">
                    <div className="h-[360px] rounded-2xl overflow-hidden border border-black/[0.08] bg-white relative">
                      <Campus3DView className="w-full h-full" showControls={true} interactive={true} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gatewise-secondary px-1">
                      <span>Interactive 3D Perimeter Twin (Three.js WebGL)</span>
                      <span className="font-mono text-[10px]">Orbit: Drag • Zoom: Scroll</span>
                    </div>
                  </div>
                )}

                {/* TAB 3: Gate ANPR */}
                {heroTab === 'anpr' && (
                  <div className="space-y-4">
                    <div className="bg-[#151c18] rounded-2xl p-5 text-white border border-black/20 space-y-4">
                      <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4" />
                          <span>ANPR OCR CAMERA POST 01</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          CONFIDENCE: 99.4%
                        </span>
                      </div>

                      <div className="bg-white rounded-xl p-4 text-black flex items-center justify-between border-4 border-black/80 shadow-md">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black px-1.5 py-0.5 bg-blue-700 text-white rounded">IND</span>
                          <span className="font-mono text-2xl font-black tracking-widest">OD 02 AK 9142</span>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
                          AUTHORIZED
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs font-mono text-white/70">
                        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                          <span className="text-[10px] text-white/40 block">VEHICLE ASSIGNMENT</span>
                          <span className="font-semibold text-white">Faculty EV Sedan</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                          <span className="text-[10px] text-white/40 block">BARRIER RELAY</span>
                          <span className="font-semibold text-emerald-400">PULSE SENT (1.8s)</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-black/[0.06] text-xs flex items-center justify-between">
                      <span className="text-gatewise-secondary">Automated Boom Barrier:</span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Raised • Lane Cleared
                      </span>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Straddling Satellite Card */}
            <div className="hidden sm:flex absolute -bottom-6 -right-6 w-72 bg-white/95 backdrop-blur-xl rounded-2xl p-4 border border-black/[0.08] ss-satellite-shadow z-20 flex-col space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gatewise-light text-gatewise-primary flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-gatewise-text">HMAC Audit Seal</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="text-[11px] font-mono text-gatewise-secondary space-y-1 bg-black/[0.02] p-2 rounded-lg border border-black/[0.04]">
                <div className="flex justify-between">
                  <span>Digest:</span>
                  <strong className="text-gatewise-text">7f4a92b1...c4</strong>
                </div>
                <div className="flex justify-between">
                  <span>Hardware Key:</span>
                  <strong className="text-gatewise-text">YubiKey 5C NFC</strong>
                </div>
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <strong className="text-emerald-700 font-bold">142ms Total</strong>
                </div>
              </div>

              <div className="text-[10px] text-gatewise-secondary flex items-center justify-between pt-0.5">
                <span>Node N-01 • Gate 01</span>
                <span className="font-mono text-gatewise-text">{satelliteTimestamp}</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BENTO FEATURE GRID (BENJI TAYLOR BENTO RULES)                          */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-2xl space-y-2 mb-12">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gatewise-primary bg-gatewise-light px-2.5 py-0.5 rounded-full border border-gatewise-mint">
            Engineered Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gatewise-text tracking-tight">
            Built for High-Consequence Perimeter Integrity
          </h2>
          <p className="text-sm text-gatewise-secondary leading-relaxed">
            Every component addresses a specific operational requirement at institutional vehicle and pedestrian checkpoints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* TILE 1: HERO UI (2 Columns) */}
          <div className="md:col-span-2 ss-bento-tile p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gatewise-primary">Hero Component</span>
                <h3 className="text-xl sm:text-2xl font-bold text-gatewise-text">
                  Multi-Factor Gate Telemetry &amp; ANPR Stream
                </h3>
                <p className="text-xs sm:text-sm text-gatewise-secondary max-w-lg leading-relaxed">
                  Seamlessly correlates license plate optical character recognition with passenger facial verification in one coordinated clearance queue.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-semibold border border-emerald-200 shrink-0">
                Live Sensor Sync
              </span>
            </div>

            <div className="bg-[#f7faf7] rounded-2xl p-4 sm:p-5 border border-black/[0.06] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-gatewise-secondary pb-1 border-b border-black/[0.06]">
                <span>GATE 01 DUAL-LANE TELEMETRY</span>
                <span className="text-emerald-700 font-semibold">ALL SENSORS NORMAL</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-xl border border-black/[0.05] shadow-2xs space-y-1">
                  <span className="text-[10px] font-mono text-gatewise-secondary uppercase">Optical Camera</span>
                  <div className="text-sm font-bold text-gatewise-text">1080p 60fps</div>
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Auto-Exposure Active
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-black/[0.05] shadow-2xs space-y-1">
                  <span className="text-[10px] font-mono text-gatewise-secondary uppercase">OCR ANPR Lens</span>
                  <div className="text-sm font-bold text-gatewise-text">OD 02 AK 9142</div>
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Plate Verified
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-black/[0.05] shadow-2xs space-y-1">
                  <span className="text-[10px] font-mono text-gatewise-secondary uppercase">Boom Barrier Relay</span>
                  <div className="text-sm font-bold text-gatewise-text">Raised (03s left)</div>
                  <span className="text-[11px] text-gatewise-secondary font-medium">Automatic Ingress</span>
                </div>
              </div>
            </div>
          </div>

          {/* TILE 2: BIG STAT (1 Column) */}
          <div className="ss-bento-tile p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gatewise-secondary">
                On-Premise Latency
              </span>
              <div className="text-5xl sm:text-6xl font-black text-gatewise-text tracking-tight font-mono pt-2">
                142<span className="text-2xl font-normal text-gatewise-secondary">ms</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm text-gatewise-text mb-1">Sub-300ms SLA Commitment</h4>
              <p className="text-xs text-gatewise-secondary leading-relaxed">
                YuNet landmark alignment and 128-D vector extraction executed entirely on edge hardware to keep gate queues moving.
              </p>
            </div>
          </div>

          {/* TILE 3: STATEMENT TILE (1 Column) */}
          <div className="ss-bento-tile p-6 sm:p-8 flex flex-col justify-between space-y-4 bg-gradient-to-br from-white to-emerald-50/30">
            <div className="w-10 h-10 rounded-xl bg-gatewise-light text-gatewise-primary flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gatewise-text tracking-tight leading-snug">
                Zero Cloud Biometrics.
              </h3>
              <p className="text-xs text-gatewise-secondary leading-relaxed">
                Facial vectors are extracted in volatile RAM and discarded. Raw face pictures are never transmitted or retained in server logs.
              </p>
            </div>
            <div className="pt-2 border-t border-black/[0.06] text-[11px] font-mono text-emerald-800">
              ISO/IEC 27001 &amp; DPDP Compliant
            </div>
          </div>

          {/* TILE 4: COMPONENT UI (1 Column) */}
          <div className="ss-bento-tile p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gatewise-secondary">
                Control Specimen
              </span>
              <h4 className="text-base font-bold text-gatewise-text">Officer Discretion Mode</h4>
              <p className="text-xs text-gatewise-secondary">
                Guard overrides and sovereign manual clearance protocols.
              </p>
            </div>

            <div className="bg-[#f7faf7] p-3 rounded-xl border border-black/[0.06] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gatewise-text">Operational Policy:</span>
                <span className="text-[11px] font-mono text-gatewise-primary uppercase font-bold">
                  {guardMode === 'standard' ? 'Assisted Gate' : 'High Audit'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/[0.04] rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setGuardMode('standard')}
                  className={`py-1.5 rounded-md transition-all cursor-pointer ${
                    guardMode === 'standard'
                      ? 'bg-white text-gatewise-text shadow-2xs'
                      : 'text-gatewise-secondary'
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setGuardMode('enhanced')}
                  className={`py-1.5 rounded-md transition-all cursor-pointer ${
                    guardMode === 'enhanced'
                      ? 'bg-white text-gatewise-text shadow-2xs'
                      : 'text-gatewise-secondary'
                  }`}
                >
                  Strict Audit
                </button>
              </div>
            </div>

            <div className="text-[11px] text-gatewise-secondary flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Officer retains ultimate physical gate veto</span>
            </div>
          </div>

          {/* TILE 5: DIAGRAM UI (1 Column) */}
          <div className="ss-bento-tile p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gatewise-secondary">
                Mathematical Metric
              </span>
              <h4 className="text-base font-bold text-gatewise-text">128-D Cosine Metric</h4>
              <p className="text-xs text-gatewise-secondary">
                Dynamic threshold slider for ROC curve balancing.
              </p>
            </div>

            <div className="bg-[#f7faf7] p-3.5 rounded-xl border border-black/[0.06] space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gatewise-secondary">Accept Threshold:</span>
                <span className="font-bold text-gatewise-primary">{cosineThreshold.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.50"
                max="0.90"
                step="0.01"
                value={cosineThreshold}
                onChange={(e) => setCosineThreshold(parseFloat(e.target.value))}
                className="w-full accent-gatewise-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-gatewise-secondary">
                <span>FAR: 0.001%</span>
                <span>FRR: 0.42%</span>
              </div>
            </div>

            <div className="text-[11px] text-gatewise-secondary">
              Dual-verification threshold protects high-security labs and dormitories.
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. THE 4-STEP VERIFICATION PROCESS (STAGESHOW EXPANDING LIST)             */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gatewise-primary bg-gatewise-light px-2.5 py-0.5 rounded-full border border-gatewise-mint">
              Verification Protocol
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gatewise-text tracking-tight">
              From Optical Capture to Signed Audit Seal
            </h2>
            <p className="text-sm text-gatewise-secondary leading-relaxed">
              Every verification runs deterministically across four synchronized stages, keeping officers informed and records immutable.
            </p>

            <div className="p-4 rounded-2xl bg-white border border-black/[0.08] ss-card-shadow space-y-2">
              <span className="text-xs font-bold text-gatewise-text flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gatewise-primary" />
                Guaranteed Institutional Compliance
              </span>
              <p className="text-xs text-gatewise-secondary leading-relaxed">
                Step-by-step cryptographic audit logs ensure zero unauthorized gate openings and immediate accountability.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {[
              {
                num: '01',
                title: 'Tactical Optical Capture',
                desc: 'Officer points the Android ruggedized terminal. Single-shot viewfinder applies automatic gamma normalization and sun-glare compensation in real time.',
                badge: 'VIEWFINDER 60FPS',
              },
              {
                num: '02',
                title: 'YuNet 5-Point Landmark Extraction',
                desc: 'OpenCV Zoo YuNet detects 5 facial landmarks (eyes, nose tip, mouth corners) in 28ms to rotate and crop the normalized face bounding box.',
                badge: '28MS INFERENCE',
              },
              {
                num: '03',
                title: '128-D Cosine Metric Matching',
                desc: 'SFace generates an L2-normalized 128-dimensional biometric embedding in RAM, comparing against institutional Google Drive photo archives.',
                badge: 'COSINE > 0.720',
              },
              {
                num: '04',
                title: 'Sovereign Guard Action & HMAC Seal',
                desc: 'The guard reviews the candidate card and grants clearance. The transaction is instantly hashed and sealed using the device’s hardware key.',
                badge: 'HMAC-SHA256 SIGNED',
              },
            ].map((step, idx) => {
              const stepIndex = idx + 1;
              const isActive = activeStep === stepIndex;

              return (
                <div
                  key={step.num}
                  onClick={() => setActiveStep(stepIndex)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isActive
                      ? 'bg-white border-gatewise-primary/40 ss-card-shadow'
                      : 'bg-[#f7faf7] border-black/[0.06] hover:bg-white hover:border-black/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                          isActive
                            ? 'bg-gatewise-primary text-white shadow-xs'
                            : 'bg-black/[0.05] text-gatewise-secondary'
                        }`}
                      >
                        {step.num}
                      </span>
                      <h4
                        className={`font-bold transition-all ${
                          isActive ? 'text-base text-gatewise-text' : 'text-sm text-gatewise-secondary'
                        }`}
                      >
                        {step.title}
                      </h4>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                          : 'bg-black/[0.03] text-gatewise-secondary'
                      }`}
                    >
                      {step.badge}
                    </span>
                  </div>

                  {isActive && (
                    <div className="mt-3.5 pl-12 border-l-2 border-gatewise-primary/20 ml-4 animate-in fade-in duration-200">
                      <p className="text-xs text-gatewise-secondary leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. ARCHITECTURAL 3D MAQUETTE & PHYSICAL WORLD                             */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-black/[0.08] ss-stage-shadow p-8 sm:p-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gatewise-primary bg-gatewise-light px-2.5 py-0.5 rounded-full border border-gatewise-mint">
                Physical Twin
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gatewise-text tracking-tight">
                Simulated 3D Campus Security Topology
              </h2>
              <p className="text-xs sm:text-sm text-gatewise-secondary max-w-xl">
                A scale model perspective of the campus perimeter: automated boom barriers, pedestrian card totems, inspection booths, and administrative pavilions.
              </p>
            </div>
            <div className="text-xs font-mono text-gatewise-secondary bg-[#f7faf7] px-3.5 py-2 rounded-xl border border-black/[0.06] w-fit">
              Model: Daylight Architectural Mesh (FOV 28°)
            </div>
          </div>

          <div className="h-[380px] sm:h-[460px] rounded-2xl overflow-hidden border border-black/[0.08] bg-[#f4f8f5] relative">
            <Campus3DView className="w-full h-full" showControls={true} interactive={true} />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. INSTITUTIONAL TRUST & PRIVACY GUARANTEES                               */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#141b17] text-white p-8 sm:p-12 space-y-8 relative overflow-hidden">
          
          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-white/10 px-3 py-1 rounded-full border border-white/15">
              Enterprise Data Governance
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Institutional Privacy &amp; Cryptography by Design
            </h2>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              GATEWISE AI is engineered to protect student and staff civil liberties with zero cloud biometric leakage and non-repudiation audit trails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs relative z-10">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <span className="font-bold text-white text-sm block">Invitation-Only Access</span>
              <p className="text-white/70 leading-relaxed">
                Guards and administrators are provisioned explicitly by the registrar. Public registration endpoints are disabled by architecture.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <span className="font-bold text-white text-sm block">Zero Raw Biometric Storage</span>
              <p className="text-white/70 leading-relaxed">
                Facial crops from gate cameras are analyzed in ephemeral memory and discarded. Raw face pictures are never retained in server logs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <span className="font-bold text-white text-sm block">Cryptographic Non-Repudiation</span>
              <p className="text-white/70 leading-relaxed">
                Every clearance event is signed with the officer’s hardware key using HMAC-SHA256, creating an immutable log for security audits.
              </p>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

    </div>
  );
}
