'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Smartphone,
  Monitor,
  ExternalLink,
  Zap,
  Radio,
  Clock,
  ArrowRight,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { SectionEyebrow } from '../primitives/SectionEyebrow';
import { GuardWebApp } from '@/components/guard/GuardWebApp';
import { liveSync } from '@/lib/services/live-sync';
import { VerificationEvent } from '@/types';

export const GuardWebAppScene: React.FC = () => {
  const [syncedEvents, setSyncedEvents] = useState<VerificationEvent[]>([]);
  const [totalScans, setTotalScans] = useState<number>(1015);
  const [recentSyncPulse, setRecentSyncPulse] = useState<string | null>(null);

  useEffect(() => {
    // Initial events
    const initial = liveSync.getEvents();
    setSyncedEvents(initial.slice(0, 6));
    setTotalScans(1015 + initial.length);

    // Subscribe to live sync
    const unsubscribe = liveSync.subscribe((msg) => {
      const latest = liveSync.getEvents();
      setSyncedEvents(latest.slice(0, 6));
      if (msg.type === 'VERIFICATION_RESULT_LOGGED' || msg.type === 'GATE_EVENT_RECORDED') {
        const ev = latest[0];
        if (ev) {
          setTotalScans((prev) => prev + 1);
          setRecentSyncPulse(
            `Live Telemetry: ${ev.person_name || 'Subject'} (${ev.guard_decision}) at ${ev.gate_name}`
          );
          setTimeout(() => setRecentSyncPulse(null), 4000);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSimulateQuickPass = () => {
    liveSync.refreshActiveContext();
  };

  return (
    <section
      id="guard-web-scene"
      className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-24"
    >
      {/* Eyebrow & Headline */}
      <div className="flex flex-col items-center text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
        <SectionEyebrow label="FIELD TERMINAL & COMMAND DESK" tag="Live Web Synchronization" />
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Handheld Web Terminal. Live Institutional Sync.
        </h2>
        <p className="text-white/65 max-w-3xl text-xs sm:text-sm lg:text-base leading-relaxed px-2">
          Experience the sovereign zero-install GATEWISE Guard Web App below. When an officer verifies a face or checks in a visitor at the gate, the Command Centre receives cryptographic event telemetry in sub-150ms.
        </p>
      </div>

      {/* Main Dual-View Scene: Handheld Terminal (Left) + Command Desk Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column (5 cols): Handheld Mobile Frame containing Guard Web App */}
        <div className="lg:col-span-5 flex flex-col items-center">
          {/* Handheld Device Enclosure */}
          <div className="relative w-full max-w-[390px] h-[720px] rounded-[48px] p-3 bg-gradient-to-b from-[#2a2d3d] via-[#121526] to-[#0a0d1c] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(47,91,255,0.2)] border-4 border-[#3a3f55]">
            {/* Dynamic Island / Top Speaker Notch */}
            <div className="absolute top-5 inset-x-0 mx-auto w-28 h-5 rounded-full bg-black z-30 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#12B5A6]/80 animate-pulse mr-2" />
              <span className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Inner Screen */}
            <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-[#070B1A]">
              <GuardWebApp embedded={true} />
            </div>
          </div>

          {/* Quick Action below phone */}
          <div className="flex items-center gap-3 mt-4">
            <a
              href="/guard"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-xs font-semibold text-white flex items-center gap-1.5 shadow-xs"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#12B5A6]" />
              <span>Launch Fullscreen Web App</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <button
              type="button"
              onClick={handleSimulateQuickPass}
              className="px-4 py-2 rounded-full bg-[#2F5BFF] hover:bg-[#254cd6] active:scale-[0.98] transition-all text-xs font-bold text-white flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate Live Verification</span>
            </button>
          </div>
        </div>

        {/* Right Column (7 cols): Command Centre Live Telemetry Stream */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Header Card */}
          <div className="p-5 rounded-[28px] border border-white/10 bg-black/40 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#2F5BFF]" />
                <h3 className="font-bold text-white text-base sm:text-lg">
                  Command Centre Live Telemetry
                </h3>
              </div>
              <p className="text-xs text-white/60 mt-0.5">
                Centralized telemetry receiver · Connected to IIM Sambalpur Gate Array
              </p>
            </div>

            <a
              href="/admin"
              className="px-4 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-md shrink-0 cursor-pointer"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Open Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Sync Status Banner */}
          <AnimatePresence>
            {recentSyncPulse && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 rounded-2xl bg-[#1FB36B]/15 border border-[#1FB36B]/30 flex items-center justify-between text-xs text-[#1FB36B]"
              >
                <div className="flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-[#1FB36B] shrink-0" />
                  <span className="font-bold">{recentSyncPulse}</span>
                </div>
                <span className="text-[10px] text-[#1FB36B]/80 font-mono hidden sm:inline">
                  SUB-150MS SYNC
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.03]">
              <span className="text-[10px] font-semibold text-white/50 uppercase block">
                Total Scans Today
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-white mt-1 block">
                {totalScans}
              </span>
              <span className="text-[10px] text-[#1FB36B] font-mono">+1 Live Pulse</span>
            </div>

            <div className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.03]">
              <span className="text-[10px] font-semibold text-white/50 uppercase block">
                Active Gates
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#12B5A6] mt-1 block">
                3 / 3
              </span>
              <span className="text-[10px] text-white/40">100% Operational</span>
            </div>

            <div className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.03]">
              <span className="text-[10px] font-semibold text-white/50 uppercase block">
                Auto-Verified
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#2F5BFF] mt-1 block">
                98.6%
              </span>
              <span className="text-[10px] text-white/40">SFace 128-D Cosine</span>
            </div>

            <div className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.03]">
              <span className="text-[10px] font-semibold text-white/50 uppercase block">
                Sync Latency
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-amber-400 mt-1 block">
                118ms
              </span>
              <span className="text-[10px] text-white/40">Real-time WebSocket</span>
            </div>
          </div>

          {/* Incoming Live Event Stream */}
          <div className="p-5 rounded-[28px] border border-white/10 bg-black/40 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#1FB36B] animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Event Ledger Stream
                </span>
              </div>
              <span className="text-[10px] font-mono text-white/50">
                BROADCAST CHANNEL · ENCRYPTED
              </span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {syncedEvents.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="p-3 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-8 h-8 rounded-full bg-[#2F5BFF]/15 text-[#2F5BFF] font-bold text-xs flex items-center justify-center shrink-0">
                      {(item.person_name || 'U')[0]}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white truncate">{item.person_name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-white/70">
                          {item.person_category || 'Identity'}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/50 block">
                        {item.gate_name} • Officer {item.guard_name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-white/40 hidden sm:inline">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.guard_decision === 'GRANT_ENTRY' || item.outcome === 'VERIFIED_AUTHORIZED'
                          ? 'bg-[#1FB36B]/15 text-[#1FB36B] border border-[#1FB36B]/30'
                          : item.guard_decision === 'DENY_ENTRY' || item.outcome === 'IDENTIFIED_UNAUTHORIZED'
                          ? 'bg-[#C93338]/15 text-[#C93338] border border-[#C93338]/30'
                          : 'bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30'
                      }`}
                    >
                      {item.guard_decision === 'GRANT_ENTRY' || item.outcome === 'VERIFIED_AUTHORIZED'
                        ? 'PERMITTED'
                        : item.guard_decision === 'DENY_ENTRY' || item.outcome === 'IDENTIFIED_UNAUTHORIZED'
                        ? 'DENIED'
                        : 'PENDING'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
