import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Cpu, Database, EyeOff, Lock, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { SectionEyebrow } from '../primitives/SectionEyebrow';

const PROTOCOL_STEPS = [
  {
    num: '01',
    title: 'YuNet 5-Point Mesh Optical Alignment',
    badge: 'VIEWFINDER 60FPS',
    time: '28ms Execution',
    desc: 'When an individual approaches any campus ingress lane, the edge camera tracks pupils, nose tip, and mouth corners in 28 milliseconds. Real-time bounding box stabilizes optical framing before feature extraction.',
  },
  {
    num: '02',
    title: 'On-Device SFace 128-D Cosine Analysis',
    badge: 'ZERO CLOUD LEAK',
    time: '64ms Vector Pass',
    desc: '128 high-dimensional floating-point embeddings are extracted directly in volatile RAM on the guard handheld terminal. Raw photographic pixels are purged immediately to guarantee statutory privacy compliance.',
  },
  {
    num: '03',
    title: 'Local Sovereign SQLite Vector Comparison',
    badge: '100% OFFLINE CONTINUITY',
    time: '50ms Database Match',
    desc: 'Vectors are scored against the cryptographically synchronized offline SQLite roster cached on the physical terminal. If WAN fiber links fail, campus clearance operations proceed without a microsecond of downtime.',
  },
  {
    num: '04',
    title: 'Hardware Barrier Actuation & HMAC Ledger',
    badge: 'NON-REPUDIATION SIGNED',
    time: 'Instant Relay Trigger',
    desc: 'If cosine distance meets or exceeds 0.72, a hardware pulse is transmitted to lift turnstiles or boom barriers. Every clearance transaction generates an HMAC-SHA256 signature committed to an immutable audit ledger.',
  },
];

export const VerificationProtocol: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="protocol" className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-24">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8 sm:mb-12 space-y-3">
        <SectionEyebrow label="Zero-Trust Pipeline" tag="4-Stage Sovereign Architecture" />
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Sub-300ms Verification Protocol
        </h2>
        <p className="text-white/65 max-w-xl text-xs sm:text-sm lg:text-base leading-relaxed px-2">
          From the optical sensor photon capture to automated turnstile actuation, every step runs locally on-device.
        </p>
      </div>

      {/* Protocol Visualizer Card */}
      <div className="liquid-glass rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-white/10 space-y-6 sm:space-y-8 bg-black/60 shadow-[0_25px_80px_rgba(0,0,0,0.8)]">
        {/* Step Progress Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          {PROTOCOL_STEPS.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.num}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all cursor-pointer min-h-[64px] ${
                  isActive
                    ? 'border-[#2F5BFF]/70 bg-[#2F5BFF]/15 shadow-[0_0_24px_rgba(47,91,255,0.22)]'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isActive ? 'text-[#12B5A6]' : 'text-white/40'
                    }`}
                  >
                    STAGE {step.num}
                  </span>
                  <span className="text-[10px] font-mono text-white/50">{step.time}</span>
                </div>
                <div className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-white/70'}`}>
                  {step.title.split(' ')[0]} {step.title.split(' ')[1]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Breakdown */}
        <div className="space-y-4 pt-2">
          {PROTOCOL_STEPS.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`p-4 sm:p-6 rounded-2xl border transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#2F5BFF]/50 bg-[#2F5BFF]/5 shadow-lg'
                    : 'border-white/5 bg-transparent hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all shrink-0 ${
                        isActive
                          ? 'bg-[#2F5BFF] text-white shadow-md'
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {step.num}
                    </span>
                    <h4
                      className={`font-bold transition-all text-sm sm:text-base ${
                        isActive ? 'text-white' : 'text-white/70'
                      }`}
                    >
                      {step.title}
                    </h4>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2.5 py-0.5 sm:py-1 rounded-full border transition-all self-start sm:self-auto shrink-0 ${
                      isActive
                        ? 'bg-[#2F5BFF]/20 text-[#12B5A6] border-[#2F5BFF]/40 font-semibold'
                        : 'bg-white/5 text-white/40 border-white/10'
                    }`}
                  >
                    {step.badge}
                  </span>
                </div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-3.5 pl-3 sm:pl-13 border-l-2 border-[#12B5A6]/40 ml-2 sm:ml-4 overflow-hidden"
                    >
                      <p className="text-xs sm:text-sm text-white/70 leading-relaxed pt-1">
                        {step.desc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
