'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Smartphone, Monitor, ShieldCheck, Zap, Lock, Activity,
  CheckCircle2, ArrowRight, Play, Eye, Users, RefreshCw,
  Cpu, FileCheck, Layers, Server, Globe
} from 'lucide-react';

export default function ProductExperienceSections() {
  const [guardTab, setGuardTab] = useState<'hud' | 'match' | 'granted' | 'visitors'>('hud');

  return (
    <div className="space-y-24 md:space-y-36">

      {/* ========================================================================= */}
      {/* SECTION A: GATEWISE GUARD MOBILE APP DEEP DIVE                            */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Mobile Phone Frame with Real Video Clip */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Decorative Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-gatewise-mint/30 to-transparent rounded-[48px] blur-2xl -z-10" />

              {/* iPhone / Modern Android Bezel */}
              <div className="relative rounded-[44px] p-3.5 bg-slate-900 border-4 border-slate-700 shadow-2xl">
                {/* Top Camera Punch-hole */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full z-20 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                </div>

                {/* Video Screen Container */}
                <div className="relative rounded-[32px] overflow-hidden bg-black aspect-[9/19.5]">
                  <video
                    className="w-full h-full object-cover"
                    poster="/media/posters/guard-demo.webp"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                  >
                    <source src="/media/videos/guard-app-demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Dynamic Floating HUD Badge */}
                  <div className="absolute bottom-4 inset-x-4 bg-black/70 backdrop-blur-md border border-white/20 rounded-xl p-2.5 text-white text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-emerald-400 flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                        <span>SFace 128-D Active</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-300">28ms YuNet</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Technical Explanation */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gatewise-light text-gatewise-deep border border-gatewise-mint text-xs font-semibold">
              <Smartphone className="w-3.5 h-3.5 text-gatewise-primary" />
              <span>GATEWISE Guard Android APK 1.0</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-gatewise-text tracking-tight leading-tight">
              Turn Any Android Device into an{' '}
              <span className="text-gatewise-primary">AI Gate Controller.</span>
            </h2>

            <p className="text-base text-gatewise-secondary leading-relaxed">
              Designed specifically for high-throughput physical checkpoints. Security personnel verify incoming students and faculty in under 300 milliseconds without requiring bulky fixed biometric turnstile pedestals.
            </p>

            {/* Feature Quadrant */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-4 rounded-2xl border border-gatewise-border shadow-2xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-gatewise-light text-gatewise-primary flex items-center justify-center font-bold text-xs">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-gatewise-text">28ms YuNet Edge Detection</h3>
                <p className="text-xs text-gatewise-secondary leading-relaxed">
                  Isolates 5 facial landmarks directly on device hardware using optimized ONNX runtimes.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gatewise-border shadow-2xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-gatewise-light text-gatewise-primary flex items-center justify-center font-bold text-xs">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-gatewise-text">Zero Raw Images Stored</h3>
                <p className="text-xs text-gatewise-secondary leading-relaxed">
                  Only 128-D vector coordinates are compared. Photographs never enter audit records or server disk.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gatewise-border shadow-2xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-gatewise-light text-gatewise-primary flex items-center justify-center font-bold text-xs">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-gatewise-text">Offline SQLite Continuity</h3>
                <p className="text-xs text-gatewise-secondary leading-relaxed">
                  Gates operate uninterrupted when campus Wi-Fi drops. Verifications queue locally and auto-sync.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gatewise-border shadow-2xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-gatewise-light text-gatewise-primary flex items-center justify-center font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-gatewise-text">Guard-in-the-Loop Override</h3>
                <p className="text-xs text-gatewise-secondary leading-relaxed">
                  Officers retain final sovereignty to clear exceptions, review visitor passes, or trigger campus alerts.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/download"
                className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-gatewise-primary hover:text-gatewise-deep"
              >
                <span>Download Verified Android Guard APK</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION B: ADMIN COMMAND CENTRE DEEP DIVE                                 */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Administrative Highlights */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gatewise-light text-gatewise-deep border border-gatewise-mint text-xs font-semibold">
              <Monitor className="w-3.5 h-3.5 text-gatewise-primary" />
              <span>Centralised Institutional Command Centre</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-gatewise-text tracking-tight leading-tight">
              Real-Time Campus Telemetry at{' '}
              <span className="text-gatewise-teal">Institutional Scale.</span>
            </h2>

            <p className="text-base text-gatewise-secondary leading-relaxed">
              Security directors, estate officers, and campus administrators oversee all gate posts from a unified command deck. Track ingress volume, audit anomaly alerts, and query historical activity using natural language.
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border border-gatewise-border shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-gatewise-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gatewise-text">Sub-Second WebSocket Event Broadcast</h4>
                  <p className="text-xs text-gatewise-secondary mt-0.5">
                    Every admittance at Gate-01 or Gate-02 updates the command deck within milliseconds with cosine scores.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border border-gatewise-border shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-gatewise-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gatewise-text">Natural Language AI Security Assistant</h4>
                  <p className="text-xs text-gatewise-secondary mt-0.5">
                    Query telemetry in plain English: &quot;Show all failed matches at West Gate in the last 2 hours&quot; with zero SQL.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border border-gatewise-border shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-gatewise-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gatewise-text">HMAC-SHA256 Cryptographic Non-Repudiation</h4>
                  <p className="text-xs text-gatewise-secondary mt-0.5">
                    Every entry event is hashed and signed with hardware keys. Audit trails cannot be forged or altered retroactively.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-gatewise-primary hover:text-gatewise-deep"
              >
                <span>Launch Admin Command Centre</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: Desktop Frame with Real Video Clip */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full">
              {/* Decorative Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-gatewise-teal/20 via-gatewise-light/30 to-transparent rounded-3xl blur-2xl -z-10" />

              {/* MacBook Pro / Desktop Frame */}
              <div className="relative rounded-2xl p-2.5 bg-slate-900 border-2 border-slate-700 shadow-2xl">
                {/* Desktop Top Window Bar */}
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-slate-300">gatewise-admin.internal · Command Deck</span>
                  <span>14:32:08 IST</span>
                </div>

                {/* Video Container */}
                <div className="relative rounded-lg overflow-hidden bg-black aspect-[16/10]">
                  <video
                    className="w-full h-full object-cover"
                    poster="/media/posters/admin-demo.webp"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                  >
                    <source src="/media/videos/admin-portal-demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION C: CONNECTED WORKFLOW (THE 5-STAGE HANDSHAKE)                     */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-white to-gatewise-light/30 rounded-3xl border border-gatewise-border p-6 sm:p-10 shadow-sm space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gatewise-light text-gatewise-deep border border-gatewise-mint text-xs font-semibold">
              <Activity className="w-3.5 h-3.5 text-gatewise-primary" />
              <span>Architecture &amp; Data Pipeline</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gatewise-text tracking-tight">
              The Sub-300ms Verification Handshake
            </h2>
            <p className="text-sm sm:text-base text-gatewise-secondary leading-relaxed">
              How five interconnected pipeline stages execute simultaneously to deliver sovereign campus clearance with zero security compromises.
            </p>
          </div>

          {/* Workflow Diagram Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-gatewise-borderMedium shadow-md bg-slate-900">
            <picture>
              <source srcSet="/media/screenshots/workflows/01_connected_verification_flow.webp" type="image/webp" />
              <img
                src="/media/screenshots/workflows/01_connected_verification_flow.png"
                alt="GATEWISE AI 5-Stage Verification Handshake Diagram"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </picture>
          </div>

          {/* 5-Stage Interactive Step Strip */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gatewise-border shadow-2xs space-y-2">
              <span className="font-mono text-xs font-bold text-gatewise-primary">STAGE 01</span>
              <h4 className="text-sm font-bold text-gatewise-text">Edge YuNet Capture</h4>
              <p className="text-xs text-gatewise-secondary leading-relaxed">
                28ms inference isolates face bounding box and 5 landmarks. Checks orientation and lighting.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gatewise-border shadow-2xs space-y-2">
              <span className="font-mono text-xs font-bold text-gatewise-primary">STAGE 02</span>
              <h4 className="text-sm font-bold text-gatewise-text">128-D Vector Extraction</h4>
              <p className="text-xs text-gatewise-secondary leading-relaxed">
                SFace model converts facial geometry into normalized floating-point vector. Image discarded.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gatewise-border shadow-2xs space-y-2">
              <span className="font-mono text-xs font-bold text-gatewise-primary">STAGE 03</span>
              <h4 className="text-sm font-bold text-gatewise-text">Cosine Policy Engine</h4>
              <p className="text-xs text-gatewise-secondary leading-relaxed">
                Fast vector comparison against local enrolled cache. Requires &ge;0.72 score for auto-clearance.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gatewise-border shadow-2xs space-y-2">
              <span className="font-mono text-xs font-bold text-gatewise-primary">STAGE 04</span>
              <h4 className="text-sm font-bold text-gatewise-text">HMAC Cryptographic Seal</h4>
              <p className="text-xs text-gatewise-secondary leading-relaxed">
                SHA-256 signature generated combining guard token, timestamp, subject ID, and gate post key.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gatewise-border shadow-2xs space-y-2">
              <span className="font-mono text-xs font-bold text-gatewise-primary">STAGE 05</span>
              <h4 className="text-sm font-bold text-gatewise-text">Barrier &amp; Admin Sync</h4>
              <p className="text-xs text-gatewise-secondary leading-relaxed">
                Guard phone triggers turnstile relay pulse and updates central command deck via WebSocket.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION D: ENTERPRISE TRUST & SOVEREIGN DATA COMPLIANCE                   */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-gatewise-border rounded-3xl p-8 sm:p-12 bg-white shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gatewise-border pb-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gatewise-light text-gatewise-deep border border-gatewise-mint text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-gatewise-primary" />
                <span>Institutional Privacy &amp; Data Sovereignty</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gatewise-text tracking-tight mt-2">
                Built from Day One for Zero Third-Party Leaks
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                DPDP Act 2023 Compliant
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-gatewise-text flex items-center space-x-2">
                <Server className="w-4 h-4 text-gatewise-primary" />
                <span>100% On-Premise Deployment</span>
              </h4>
              <p className="text-xs text-gatewise-secondary leading-relaxed">
                FastAPI backend, PostgreSQL database, and vector indices run strictly within campus infrastructure. No biometric data ever exits the institutional firewall.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-gatewise-text flex items-center space-x-2">
                <Lock className="w-4 h-4 text-gatewise-primary" />
                <span>Zero Image Logging Policy</span>
              </h4>
              <p className="text-xs text-gatewise-secondary leading-relaxed">
                Raw face frames captured in Android memory buffers are destroyed instantly post-vectorization. Audit logs only contain mathematical vectors and cryptographic hashes.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-gatewise-text flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-gatewise-primary" />
                <span>Tamper-Proof Audit Vault</span>
              </h4>
              <p className="text-xs text-gatewise-secondary leading-relaxed">
                Every entrance, denial, and manual override is recorded in an immutable ledger sealed with rotating HMAC keys, ensuring complete forensic accountability.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
