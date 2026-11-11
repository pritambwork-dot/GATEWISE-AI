'use client';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Cpu, Sliders, Check, Zap, Camera, Car } from 'lucide-react';
import { SectionEyebrow } from '../primitives/SectionEyebrow';

export const BentoCapabilities: React.FC = () => {
  const [cosineThreshold, setCosineThreshold] = useState(0.72);
  const [guardMode, setGuardMode] = useState<'standard' | 'enhanced'>('standard');

  // Compute mock FAR / FRR based on threshold
  const far = Math.max(0.0001, (1 - cosineThreshold) * 0.005).toFixed(4);
  const frr = Math.max(0.1, (cosineThreshold - 0.5) * 1.8).toFixed(2);

  return (
    <section className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-16 md:py-24">
      <div className="flex flex-col items-center text-center mb-12 space-y-3">
        <SectionEyebrow label="Engineered Capabilities" tag="Perimeter Security" />
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Built for High-Consequence Perimeter Integrity
        </h2>
        <p className="text-white/60 max-w-xl text-sm sm:text-base leading-relaxed">
          Every component addresses a critical operational requirement at institutional vehicle and pedestrian checkpoints.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TILE 1: Multi-Factor Gate Telemetry (2 Columns) */}
        <div className="md:col-span-2 liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00d2ff]">
                Live Sensor Telemetry
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Multi-Factor Gate Telemetry &amp; ANPR Stream
              </h3>
              <p className="text-xs sm:text-sm text-white/65 max-w-lg leading-relaxed">
                Seamlessly correlates license plate optical character recognition with passenger facial verification in one coordinated clearance queue.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-mono font-semibold border border-emerald-500/30 shrink-0 flex items-center gap-1.5 self-start">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sensor Sync Active
            </span>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 border border-white/10 bg-black/40 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-white/50 pb-2 border-b border-white/10">
              <span>GATE 01 DUAL-LANE TELEMETRY</span>
              <span className="text-emerald-400 font-semibold">ALL SENSORS NORMAL</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-white/40 uppercase">Optical Camera</span>
                <div className="text-sm font-bold text-white">1080p 60fps</div>
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Auto-Exposure
                </span>
              </div>
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-white/40 uppercase">OCR ANPR Lens</span>
                <div className="text-sm font-bold text-white">OD 02 AK 9142</div>
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Plate Verified
                </span>
              </div>
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-white/40 uppercase">Boom Barrier Relay</span>
                <div className="text-sm font-bold text-white">Raised (Lane 01)</div>
                <span className="text-[11px] text-white/50 font-medium">Automatic Ingress</span>
              </div>
            </div>
          </div>
        </div>

        {/* TILE 2: Big Stat (1 Column) */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white/40">
              On-Premise Latency
            </span>
            <div className="text-5xl sm:text-6xl font-black text-white tracking-tight font-mono pt-2">
              142<span className="text-2xl font-normal text-white/40">ms</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm text-white mb-1">Sub-300ms SLA Commitment</h4>
            <p className="text-xs text-white/60 leading-relaxed">
              YuNet landmark alignment and 128-D vector extraction executed entirely on edge hardware to keep gate queues moving without bottlenecks.
            </p>
          </div>
        </div>

        {/* TILE 3: Zero Cloud Biometrics (1 Column) */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between space-y-4 bg-gradient-to-br from-white/[0.04] to-emerald-950/20">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-tight leading-snug">
              Zero Cloud Biometrics.
            </h3>
            <p className="text-xs text-white/65 leading-relaxed">
              Facial vectors are extracted in volatile RAM and discarded. Raw face pictures are never transmitted or retained in server logs.
            </p>
          </div>
          <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-emerald-400">
            ISO/IEC 27001 &amp; DPDP Compliant
          </div>
        </div>

        {/* TILE 4: Control Specimen / Officer Discretion (1 Column) */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white/40">
              Control Specimen
            </span>
            <h4 className="text-base font-bold text-white">Officer Discretion Mode</h4>
            <p className="text-xs text-white/60">
              Guard overrides and sovereign manual clearance protocols.
            </p>
          </div>

          <div className="bg-black/40 p-3.5 rounded-xl border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/70 font-medium">Operational Policy:</span>
              <span className="text-[11px] font-mono text-[#00d2ff] uppercase font-bold">
                {guardMode === 'standard' ? 'Assisted Gate' : 'Strict Audit'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/5 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setGuardMode('standard')}
                className={`py-1.5 rounded-md transition-all cursor-pointer ${
                  guardMode === 'standard'
                    ? 'bg-white text-black shadow-sm font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => setGuardMode('enhanced')}
                className={`py-1.5 rounded-md transition-all cursor-pointer ${
                  guardMode === 'enhanced'
                    ? 'bg-white text-black shadow-sm font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Strict Audit
              </button>
            </div>
          </div>

          <div className="text-[11px] text-white/60 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Officer retains ultimate physical gate veto</span>
          </div>
        </div>

        {/* TILE 5: Mathematical Metric / 128-D Cosine Slider (1 Column) */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white/40">
              Mathematical Metric
            </span>
            <h4 className="text-base font-bold text-white">128-D Cosine Metric</h4>
            <p className="text-xs text-white/60">
              Dynamic threshold slider for ROC curve balancing.
            </p>
          </div>

          <div className="bg-black/40 p-3.5 rounded-xl border border-white/10 space-y-2.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-white/60">Accept Threshold:</span>
              <span className="font-bold text-[#00d2ff]">{cosineThreshold.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.50"
              max="0.90"
              step="0.01"
              value={cosineThreshold}
              onChange={(e) => setCosineThreshold(parseFloat(e.target.value))}
              className="w-full accent-[#00d2ff] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-white/50">
              <span>FAR: {far}%</span>
              <span>FRR: {frr}%</span>
            </div>
          </div>

          <div className="text-[11px] text-white/60">
            Dual-verification threshold protects high-security labs and dormitories.
          </div>
        </div>
      </div>
    </section>
  );
};
