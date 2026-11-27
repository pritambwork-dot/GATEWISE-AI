'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DoodleArrowNote,
  DoodleCameraScan,
  DoodleSyncLoop,
  DoodleShieldCheck,
} from '@/components/landing/EditorialDoodles';

export const HeroPerimeterVisualizer: React.FC<{ animateVisuals: boolean }> = ({
  animateVisuals,
}) => {
  const [view, setView] = useState<'scan' | 'topology'>('scan');

  return (
    <div className="space-y-3">
      {/* Mini Visual Mode Switcher */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex border border-[#DCE1EC] bg-[#FAF9F6] p-0.5 font-mono text-[9px] uppercase tracking-[0.1em]">
          <button
            type="button"
            onClick={() => setView('scan')}
            className={`px-2.5 py-1 transition-colors cursor-pointer ${
              view === 'scan'
                ? 'bg-[#2F5BFF] text-white font-bold'
                : 'text-[#475569] hover:text-[#0A0E1A]'
            }`}
          >
            Optical Gate Scan
          </button>
          <button
            type="button"
            onClick={() => setView('topology')}
            className={`px-2.5 py-1 transition-colors cursor-pointer ${
              view === 'topology'
                ? 'bg-[#2F5BFF] text-white font-bold'
                : 'text-[#475569] hover:text-[#0A0E1A]'
            }`}
          >
            Live Sync Graph
          </button>
        </div>
        <span className="font-mono text-[9px] text-[#0D9488] font-bold uppercase tracking-[0.1em]">
          ● LIVE ENGINE
        </span>
      </div>

      <div className="relative h-64 border border-[#DCE1EC] bg-[#FAF9F6] paper-halftone flex items-center justify-center p-3 overflow-hidden">
        {/* Horizontal Biometric Laser Sweep */}
        {animateVisuals && view === 'scan' && (
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-[#2F5BFF] to-transparent z-10 pointer-events-none"
            animate={{ y: [-96, 96, -96] }}
            transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
          />
        )}

        <AnimatePresence mode="wait">
          {view === 'scan' ? (
            <motion.svg
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              viewBox="0 0 320 200"
              className="w-full h-full"
              fill="none"
              aria-hidden="true"
            >
              {/* Blueprint grid axes */}
              <line x1="160" y1="10" x2="160" y2="190" stroke="#DCE1EC" strokeWidth="1" />
              <line x1="16" y1="100" x2="304" y2="100" stroke="#DCE1EC" strokeWidth="1" />

              {/* Gate Archway */}
              <motion.path
                d="M104 158 V92 C104 61 129 36 160 36 C191 36 216 61 216 92 V158"
                stroke="#2F5BFF"
                strokeWidth="2.5"
                initial={{ pathLength: 0.35 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.3, ease: 'easeOut' }}
              />
              <path d="M84 158 H236" stroke="#0A0E1A" strokeWidth="2" />

              {/* Biometric Face Reticle inside Gate */}
              <circle cx="160" cy="88" r="22" fill="#FFFFFF" stroke="#2F5BFF" strokeWidth="1.5" />
              <path d="M148 122 C148 113 172 113 172 122" stroke="#0A0E1A" strokeWidth="1.8" strokeLinecap="round" />
              {/* Landmark Dots */}
              <circle cx="154" cy="84" r="2" fill="#2F5BFF" />
              <circle cx="166" cy="84" r="2" fill="#2F5BFF" />
              <circle cx="160" cy="91" r="1.8" fill="#0D9488" />
              <path d="M154 97 C157 100 163 100 166 97" stroke="#0A0E1A" strokeWidth="1.4" strokeLinecap="round" />

              {/* Rotating Dotted Scanner Ring */}
              <motion.circle
                cx="160"
                cy="90"
                r="34"
                stroke="#0A0E1A"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                animate={animateVisuals ? { rotate: 360 } : {}}
                transition={{ duration: 16, ease: 'linear', repeat: Infinity }}
                style={{ originX: '160px', originY: '90px' }}
              />

              {/* Pulse Radar */}
              {animateVisuals && (
                <motion.circle
                  cx="160"
                  cy="90"
                  r="24"
                  stroke="#0D9488"
                  strokeWidth="1.2"
                  animate={{ scale: [0.9, 1.75], opacity: [0.8, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  style={{ originX: '160px', originY: '90px' }}
                />
              )}

              {/* ANPR Plate Callout Bottom */}
              <rect x="116" y="136" width="88" height="18" fill="#FFFFFF" stroke="#0A0E1A" strokeWidth="1.2" />
              <rect x="116" y="136" width="12" height="18" fill="#2F5BFF" />
              <text x="122" y="148" textAnchor="middle" className="fill-white font-mono text-[6px] font-bold">IN</text>
              <text x="166" y="148" textAnchor="middle" className="fill-[#0A0E1A] font-mono text-[8px] font-bold tracking-wider">OD 02 AB 1234</text>

              {/* Corner Spec Badges */}
              <rect x="16" y="18" width="76" height="24" fill="#FFFFFF" stroke="#DCE1EC" />
              <text x="54" y="33" textAnchor="middle" className="fill-[#0A0E1A] font-mono text-[8px] font-bold">128-D VECTOR</text>

              <rect x="228" y="18" width="76" height="24" fill="#FFFFFF" stroke="#DCE1EC" />
              <text x="266" y="33" textAnchor="middle" className="fill-[#2F5BFF] font-mono text-[8px] font-bold">ANPR OCR</text>

              <rect x="16" y="166" width="76" height="22" fill="#FFFFFF" stroke="#DCE1EC" />
              <text x="54" y="180" textAnchor="middle" className="fill-[#0D9488] font-mono text-[8px] font-bold">REAR LENS</text>

              <rect x="228" y="166" width="76" height="22" fill="#FFFFFF" stroke="#DCE1EC" />
              <text x="266" y="180" textAnchor="middle" className="fill-[#0A0E1A] font-mono text-[8px] font-bold">RBAC: ACTIVE</text>

              {/* Connecting Dashed Telemetry Lines */}
              <path d="M92 30 L134 64 M228 30 L186 64" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
            </motion.svg>
          ) : (
            <motion.svg
              key="topology"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              viewBox="0 0 320 200"
              className="w-full h-full"
              fill="none"
              aria-hidden="true"
            >
              {/* Guard Phone Node */}
              <rect x="18" y="64" width="74" height="72" fill="#FFFFFF" stroke="#0A0E1A" strokeWidth="1.5" />
              <rect x="18" y="64" width="74" height="16" fill="#2F5BFF" />
              <text x="55" y="75" textAnchor="middle" className="fill-white font-mono text-[7px] font-bold">GUARD PHONE</text>
              <text x="55" y="99" textAnchor="middle" className="fill-[#0A0E1A] font-mono text-[8px] font-bold">REAR CAM</text>
              <text x="55" y="114" textAnchor="middle" className="fill-[#475569] font-mono text-[6.5px]">Mobile Only</text>

              {/* Central PostgreSQL + Verification Core */}
              <rect x="122" y="34" width="76" height="132" fill="#EEF2FF" stroke="#2F5BFF" strokeWidth="2" />
              <text x="160" y="54" textAnchor="middle" className="fill-[#2F5BFF] font-mono text-[7.5px] font-bold">CENTRAL DB</text>
              <rect x="132" y="64" width="56" height="22" fill="#FFFFFF" stroke="#2F5BFF" strokeWidth="1" />
              <text x="160" y="78" textAnchor="middle" className="fill-[#0A0E1A] font-mono text-[7px] font-bold">PEOPLE &amp; LPR</text>
              <rect x="132" y="92" width="56" height="22" fill="#FFFFFF" stroke="#0D9488" strokeWidth="1" />
              <text x="160" y="106" textAnchor="middle" className="fill-[#0D9488] font-mono text-[7px] font-bold">128-D MATCH</text>
              <rect x="132" y="120" width="56" height="22" fill="#FFFFFF" stroke="#0A0E1A" strokeWidth="1" />
              <text x="160" y="134" textAnchor="middle" className="fill-[#0A0E1A] font-mono text-[7px] font-bold">RLS BUCKET</text>

              {/* Admin Desk Node */}
              <rect x="228" y="64" width="74" height="72" fill="#FFFFFF" stroke="#0A0E1A" strokeWidth="1.5" />
              <rect x="228" y="64" width="74" height="16" fill="#0A0E1A" />
              <text x="265" y="75" textAnchor="middle" className="fill-white font-mono text-[7px] font-bold">ADMIN DESK</text>
              <text x="265" y="99" textAnchor="middle" className="fill-[#0A0E1A] font-mono text-[8px] font-bold">RBAC + LOGS</text>
              <text x="265" y="114" textAnchor="middle" className="fill-[#475569] font-mono text-[6.5px]">Mode 1 &amp; 2</text>

              {/* Animated Bidirectional Links */}
              <motion.path
                d="M92 92 H122 M198 92 H228"
                stroke="#2F5BFF"
                strokeWidth="2"
                strokeDasharray="4 4"
                animate={animateVisuals ? { strokeDashoffset: [0, -16] } : {}}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              />
              <motion.path
                d="M228 112 H198 M122 112 H92"
                stroke="#0D9488"
                strokeWidth="2"
                strokeDasharray="4 4"
                animate={animateVisuals ? { strokeDashoffset: [0, 16] } : {}}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const PipelineStageVisual: React.FC<{
  activeStageIdx: number;
  animateVisuals: boolean;
}> = ({ activeStageIdx, animateVisuals }) => {
  return (
    <div className="relative h-44 border border-[#DCE1EC] bg-white paper-halftone overflow-hidden p-4 flex items-center justify-center">
      <div className="absolute top-2.5 left-3 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#2F5BFF]">
        LIVE STAGE PREVIEW · STEP 0{activeStageIdx + 1}
      </div>
      <div className="absolute top-2.5 right-3 font-mono text-[9px] uppercase tracking-[0.1em] text-[#0D9488] font-semibold">
        {activeStageIdx === 0 && 'ENV CAMERA ACTIVE'}
        {activeStageIdx === 1 && 'VECTOR + OCR MATCH'}
        {activeStageIdx === 2 && 'POLICY GATE CHECK'}
        {activeStageIdx === 3 && 'WS REALTIME SYNC'}
      </div>

      <AnimatePresence mode="wait">
        {activeStageIdx === 0 && (
          <motion.div
            key="stage-0"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="w-full flex items-center justify-around gap-4 pt-4"
          >
            <DoodleCameraScan className="w-20 h-20 shrink-0" animate={animateVisuals} />
            <div className="space-y-2 flex-1 max-w-xs font-mono text-[10px]">
              <div className="flex justify-between">
                <span className="text-[#475569]">LENS LOCK</span>
                <span className="font-bold text-[#2F5BFF]">environment (REAR)</span>
              </div>
              <div className="h-2 w-full bg-[#EEF2FF] overflow-hidden">
                <motion.div
                  className="h-full bg-[#2F5BFF]"
                  initial={{ width: '25%' }}
                  animate={{ width: '89%' }}
                  transition={{ duration: 0.7 }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-[#475569]">
                <span>SHARPNESS Q = 89/100</span>
                <span className="text-[#0D9488] font-bold">PASSED</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeStageIdx === 1 && (
          <motion.svg
            key="stage-1"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            viewBox="0 0 380 110"
            className="w-full h-28 mt-4"
            fill="none"
            aria-hidden="true"
          >
            {/* Octagonal 128-D radar */}
            <polygon points="75,18 103,30 115,58 103,86 75,98 47,86 35,58 47,30" stroke="#DCE1EC" strokeWidth="1.5" fill="#FAF9F6" />
            <polygon points="75,28 96,38 102,58 92,78 75,86 54,76 48,58 56,36" stroke="#2F5BFF" strokeWidth="2" fill="#2F5BFF" fillOpacity="0.12" />
            <text x="75" y="61" textAnchor="middle" className="fill-[#2F5BFF] font-mono text-[9px] font-bold">0.97 COS</text>

            {/* Arrow */}
            <path d="M128 58 H164 M158 53 L165 58 L158 63" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />

            {/* ANPR Box */}
            <rect x="178" y="30" width="172" height="56" fill="#FAF9F6" stroke="#0A0E1A" strokeWidth="1.5" />
            <rect x="190" y="42" width="148" height="24" fill="#FFFFFF" stroke="#2F5BFF" strokeWidth="1.2" />
            <text x="264" y="58" textAnchor="middle" className="fill-[#0A0E1A] font-mono text-[11px] font-bold tracking-[0.2em]">OD 02 AB 1234</text>
            <text x="264" y="79" textAnchor="middle" className="fill-[#0D9488] font-mono text-[8px] font-bold">SUBJECT + VEHICLE LINKED</text>
          </motion.svg>
        )}

        {activeStageIdx === 2 && (
          <motion.div
            key="stage-2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="w-full grid grid-cols-3 gap-3 pt-4 font-mono text-[10px]"
          >
            <div className="border border-[#0D9488] bg-[#F0FDFA] p-2.5 text-center">
              <span className="text-[8px] text-[#0D9488] font-bold block">ACCESS_STATUS</span>
              <span className="font-bold text-[#0A0E1A] mt-1 block">ACTIVE ✓</span>
            </div>
            <div className="border border-[#2F5BFF] bg-[#EEF2FF] p-2.5 text-center">
              <span className="text-[8px] text-[#2F5BFF] font-bold block">GUARD ROLE</span>
              <span className="font-bold text-[#0A0E1A] mt-1 block">MODE 1 / 2</span>
            </div>
            <div className="border border-[#C93338]/40 bg-[#FEF2F2] p-2.5 text-center">
              <span className="text-[8px] text-[#C93338] font-bold block">SUSPENDED</span>
              <span className="font-bold text-[#C93338] mt-1 block">HARD DENY ✕</span>
            </div>
          </motion.div>
        )}

        {activeStageIdx === 3 && (
          <motion.svg
            key="stage-3"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            viewBox="0 0 380 110"
            className="w-full h-28 mt-4"
            fill="none"
            aria-hidden="true"
          >
            <rect x="20" y="28" width="96" height="54" fill="#FAF9F6" stroke="#2F5BFF" strokeWidth="1.5" />
            <text x="68" y="52" textAnchor="middle" className="fill-[#0A0E1A] font-mono text-[9px] font-bold">GUARD EVENT</text>
            <text x="68" y="66" textAnchor="middle" className="fill-[#2F5BFF] font-mono text-[7.5px]">ENTRY VERIFIED</text>

            <motion.path
              d="M116 55 H254"
              stroke="#0D9488"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              animate={animateVisuals ? { strokeDashoffset: [0, -24] } : {}}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
            />
            <circle cx="185" cy="55" r="14" fill="#FFFFFF" stroke="#0D9488" strokeWidth="1.5" />
            <text x="185" y="58" textAnchor="middle" className="fill-[#0D9488] font-mono text-[7px] font-bold">WS</text>

            <rect x="254" y="28" width="106" height="54" fill="#0A0E1A" />
            <text x="307" y="52" textAnchor="middle" className="fill-white font-mono text-[9px] font-bold">ADMIN LIVE FEED</text>
            <text x="307" y="66" textAnchor="middle" className="fill-[#34D399] font-mono text-[7.5px]">LOGGED &lt; 120ms</text>
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SystemPanoramaDiagram: React.FC<{ animateVisuals: boolean }> = ({
  animateVisuals,
}) => (
  <section className="bg-[#FAF9F6] border-b border-[#DCE1EC]">
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-0 py-14 sm:py-20">
      <div className="border border-[#0A0E1A] bg-white p-6 sm:p-8 shadow-[6px_6px_0px_#DCE1EC] relative">
        <DoodleArrowNote
          label="single source of truth!"
          direction="left"
          className="hidden md:inline-flex absolute -top-5 right-10 pointer-events-none"
        />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-8 border-b border-[#DCE1EC]">
          <div>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2F5BFF] block mb-1.5">
              REAL-TIME SYNC BLUEPRINT
            </span>
            <h2 className="font-display font-bold uppercase text-3xl sm:text-4xl tracking-tight text-[#0A0E1A]">
              One Central Brain Across Gate &amp; Desk.
            </h2>
          </div>
          <span className="font-mono text-[11px] text-[#475569]">
            PostgreSQL + Private Storage + Realtime WebSockets
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-5 items-center">
          {/* Node 1: Guard Smartphone */}
          <div className="border border-[#DCE1EC] bg-[#FAF9F6] p-5 flex flex-col items-center text-center space-y-3">
            <DoodleCameraScan className="w-16 h-16" animate={animateVisuals} />
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#2F5BFF]">
                MOBILE ONLY (/GUARD)
              </span>
              <h3 className="font-display text-xl font-bold uppercase text-[#0A0E1A] mt-0.5">
                Guard Field Scanner
              </h3>
              <p className="text-xs text-[#475569] mt-1">
                Scans visitor face &amp; vehicle plates strictly with smartphone rear lens.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <DoodleSyncLoop className="w-24 h-10 rotate-90 md:rotate-0" animate={animateVisuals} />
          </div>

          {/* Node 2: Central Truth Engine */}
          <div className="border-2 border-[#2F5BFF] bg-[#EEF2FF]/60 p-5 flex flex-col items-center text-center space-y-3">
            <DoodleShieldCheck className="w-14 h-14" />
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#0D9488]">
                CENTRAL BACKEND
              </span>
              <h3 className="font-display text-xl font-bold uppercase text-[#0A0E1A] mt-0.5">
                Verification &amp; DB Core
              </h3>
              <p className="text-xs text-[#475569] mt-1">
                128-D face match, normalized ANPR plates, access validity &amp; RBAC rules.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <DoodleSyncLoop className="w-24 h-10 rotate-90 md:rotate-0" animate={animateVisuals} />
          </div>

          {/* Node 3: Admin Web Command Centre */}
          <div className="border border-[#DCE1EC] bg-[#FAF9F6] p-5 flex flex-col items-center text-center space-y-3">
            <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none" aria-hidden="true">
              <rect x="8" y="14" width="64" height="44" rx="3" fill="#FFFFFF" stroke="#0A0E1A" strokeWidth="2.2" />
              <path d="M8 24H72" stroke="#DCE1EC" strokeWidth="1.5" />
              <rect x="14" y="30" width="22" height="20" fill="#EEF2FF" stroke="#2F5BFF" strokeWidth="1.4" />
              <path d="M42 32H64M42 39H60M42 46H56" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
              <path d="M28 66H52M40 58V66" stroke="#0A0E1A" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#2F5BFF]">
                WEB PORTAL (/ADMIN)
              </span>
              <h3 className="font-display text-xl font-bold uppercase text-[#0A0E1A] mt-0.5">
                Admin Command Centre
              </h3>
              <p className="text-xs text-[#475569] mt-1">
                Manages People DB, Vehicles, Mode 1/2 Guard permissions &amp; Live Gate Feed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const SurfacePreviewArtwork: React.FC<{
  kind: 'guard' | 'admin' | 'api';
  animateVisuals: boolean;
}> = ({ kind, animateVisuals }) => (
  <div className="w-full h-36 border border-[#DCE1EC] bg-[#FAF9F6] flex items-center justify-center p-3 overflow-hidden">
    {kind === 'guard' && (
      <svg viewBox="0 0 220 110" className="w-full h-full" fill="none" aria-hidden="true">
        <rect x="76" y="8" width="68" height="94" rx="8" fill="#FFFFFF" stroke="#0A0E1A" strokeWidth="1.8" />
        <rect x="84" y="20" width="52" height="44" rx="4" fill="#EEF2FF" stroke="#2F5BFF" strokeWidth="1.2" />
        <circle cx="110" cy="40" r="10" stroke="#0D9488" strokeWidth="1.6" />
        {animateVisuals && (
          <motion.line
            x1="88"
            y1="26"
            x2="132"
            y2="26"
            stroke="#2F5BFF"
            strokeWidth="1.5"
            animate={{ y1: [26, 58, 26], y2: [26, 58, 26] }}
            transition={{ duration: 2.6, repeat: Infinity }}
          />
        )}
        <rect x="86" y="72" width="48" height="14" rx="7" fill="#0D9488" />
        <text x="110" y="81.5" textAnchor="middle" className="fill-white font-mono text-[6.5px] font-bold">VERIFIED ✓</text>
      </svg>
    )}

    {kind === 'admin' && (
      <svg viewBox="0 0 220 110" className="w-full h-full" fill="none" aria-hidden="true">
        <rect x="18" y="10" width="184" height="90" rx="4" fill="#FFFFFF" stroke="#0A0E1A" strokeWidth="1.8" />
        <rect x="18" y="10" width="42" height="90" fill="#F2F4F8" stroke="#DCE1EC" strokeWidth="1" />
        <rect x="25" y="22" width="28" height="6" fill="#2F5BFF" />
        <rect x="25" y="34" width="24" height="4" fill="#CBD5E1" />
        <rect x="25" y="44" width="24" height="4" fill="#CBD5E1" />
        <rect x="68" y="20" width="38" height="22" fill="#EEF2FF" stroke="#2F5BFF" strokeWidth="1" />
        <rect x="112" y="20" width="38" height="22" fill="#F0FDFA" stroke="#0D9488" strokeWidth="1" />
        <rect x="156" y="20" width="38" height="22" fill="#FAF9F6" stroke="#DCE1EC" strokeWidth="1" />
        <rect x="68" y="50" width="126" height="40" fill="#FAF9F6" stroke="#DCE1EC" strokeWidth="1" />
        <path d="M76 62 H184 M76 72 H174 M76 82 H164" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )}

    {kind === 'api' && (
      <svg viewBox="0 0 220 110" className="w-full h-full" fill="none" aria-hidden="true">
        <ellipse cx="70" cy="30" rx="34" ry="10" fill="#EEF2FF" stroke="#2F5BFF" strokeWidth="1.6" />
        <path d="M36 30 V78 C36 83.5 51.2 88 70 88 C88.8 88 104 83.5 104 78 V30" fill="#FFFFFF" stroke="#2F5BFF" strokeWidth="1.6" />
        <path d="M36 54 C36 59.5 51.2 64 70 64 C88.8 64 104 59.5 104 54" stroke="#2F5BFF" strokeWidth="1.2" />
        <text x="70" y="47" textAnchor="middle" className="fill-[#0A0E1A] font-mono text-[6.5px] font-bold">POSTGRES</text>
        <text x="70" y="77" textAnchor="middle" className="fill-[#0D9488] font-mono text-[6.5px] font-bold">BIOMETRICS</text>
        <motion.path
          d="M108 55 H142"
          stroke="#0D9488"
          strokeWidth="2"
          strokeDasharray="4 4"
          animate={animateVisuals ? { strokeDashoffset: [0, -16] } : {}}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
        />
        <rect x="142" y="28" width="58" height="54" fill="#FFFFFF" stroke="#0A0E1A" strokeWidth="1.6" />
        <text x="171" y="51" textAnchor="middle" className="fill-[#2F5BFF] font-mono text-[7px] font-bold">SIGNED URL</text>
        <text x="171" y="65" textAnchor="middle" className="fill-[#475569] font-mono text-[6.5px]">RLS LOCKED</text>
      </svg>
    )}
  </div>
);
