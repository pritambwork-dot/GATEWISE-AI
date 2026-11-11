'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';
import { SectionEyebrow } from '../primitives/SectionEyebrow';

const STEPS = [
  {
    num: '01',
    title: 'Tactical Optical Capture',
    desc: 'Officer points the Android ruggedized terminal. Single-shot optical viewfinder applies automatic gamma normalization and sun-glare compensation in real time.',
    badge: 'VIEWFINDER 60FPS',
  },
  {
    num: '02',
    title: 'YuNet 5-Point Landmark Extraction',
    desc: 'OpenCV Zoo YuNet detects 5 facial landmarks (eyes, nose tip, mouth corners) in 28ms to rotate and crop the normalized face bounding box on edge hardware.',
    badge: '28MS INFERENCE',
  },
  {
    num: '03',
    title: '128-D Cosine Metric Matching',
    desc: 'SFace generates an L2-normalized 128-dimensional biometric embedding in volatile RAM, comparing against enrolled campus vectors with 0.72 threshold clearance.',
    badge: 'COSINE > 0.720',
  },
  {
    num: '04',
    title: 'Sovereign Guard Action & HMAC Seal',
    desc: 'The guard reviews the candidate card and grants clearance. The transaction is instantly hashed and sealed using the device’s hardware key via HMAC-SHA256.',
    badge: 'HMAC-SHA256 SIGNED',
  },
];

export const VerificationProtocol: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column Description */}
        <div className="lg:col-span-5 space-y-6">
          <SectionEyebrow label="Verification Protocol" tag="Edge Determinism" />

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05] text-white">
            From Optical Capture to Signed Audit Seal
          </h2>

          <p className="text-white/65 text-base sm:text-lg leading-relaxed">
            Every verification runs deterministically across four synchronized stages, keeping officers
            informed and records mathematically tamper-evident.
          </p>

          <div className="liquid-glass rounded-2xl p-5 border border-white/10 space-y-2">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00d2ff]" />
              Guaranteed Institutional Compliance
            </span>
            <p className="text-xs text-white/60 leading-relaxed">
              Step-by-step cryptographic audit logs ensure zero unauthorized gate openings and immediate
              accountability across all campus shifts.
            </p>
          </div>
        </div>

        {/* Right Column Interactive Expanding Protocol List */}
        <div className="lg:col-span-7 space-y-3.5">
          {STEPS.map((step, idx) => {
            const stepIndex = idx + 1;
            const isActive = activeStep === stepIndex;

            return (
              <div
                key={step.num}
                onClick={() => setActiveStep(stepIndex)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isActive
                    ? 'liquid-glass border-[#00d2ff]/40 bg-white/[0.04] shadow-lg'
                    : 'liquid-glass border-white/5 hover:border-white/20 bg-white/[0.01]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-white text-black shadow-md'
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {step.num}
                    </span>
                    <h4
                      className={`font-bold transition-all ${
                        isActive ? 'text-base sm:text-lg text-white' : 'text-sm sm:text-base text-white/70'
                      }`}
                    >
                      {step.title}
                    </h4>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2.5 py-1 rounded-full border transition-all ${
                      isActive
                        ? 'bg-[#00d2ff]/15 text-[#00d2ff] border-[#00d2ff]/40 font-semibold'
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
                      className="mt-3.5 pl-13 border-l-2 border-[#00d2ff]/30 ml-4 overflow-hidden"
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
