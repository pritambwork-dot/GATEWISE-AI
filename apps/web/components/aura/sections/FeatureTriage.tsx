'use client';
import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Cpu, Database, EyeOff, Lock, Radio } from 'lucide-react';
import { SectionEyebrow } from '../primitives/SectionEyebrow';

const ARCHITECTURE_GROUPS = [
  {
    category: 'Sub-300ms Clearance',
    count: '98.4%',
    color: '#00d2ff',
    items: [
      'YuNet 5-point facial landmark isolation on edge CPU',
      'SFace 128-D Euclidean & Cosine metric verification',
    ],
  },
  {
    category: 'Offline Sovereign Fallback',
    count: '100% Uptime',
    color: '#10b981',
    items: [
      'Encrypted on-device SQLite identity cache',
      'Automatic WAN sync with backoff queue when link restores',
    ],
  },
  {
    category: 'Zero Image Retention Policy',
    count: 'Compliant',
    color: '#A4F4FD',
    items: [
      'No raw facial photos ever stored on disk or cloud logs',
      'Transient memory buffers scrubbed immediately after inference',
    ],
  },
  {
    category: 'Cryptographic Non-Repudiation',
    count: 'HMAC-SHA256',
    color: '#f59e0b',
    items: [
      'Every barrier open event signed with gate private key',
      'Tamper-evident audit trail exported directly to administration',
    ],
  },
];

const CHIPS = [
  'YuNet 5-Point Edge Mesh',
  'SFace 128-D Cosine Match',
  'Zero Raw Image Retention',
  'Offline Sovereign Cache',
  'ANPR License Plate Sync',
];

export const FeatureTriage: React.FC = () => {
  return (
    <section id="architecture" className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-20 md:py-28">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left Column Motion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start"
        >
          <SectionEyebrow label="Perimeter Architecture" tag="Zero-Trust Edge" />

          <h2 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.02] text-white">
            Clear every gate
            <br />
            in under 300ms.
          </h2>

          <p className="mt-6 text-white/65 text-base sm:text-lg leading-[1.6] max-w-xl">
            GATEWISE AI runs neural face detection and 128-D vector matching right on the security
            guard&apos;s handheld Android terminal. When internet connectivity drops, gates never stop:
            local SQLite cache verifies enrolled students and faculty instantly, and every entry logs
            an HMAC-SHA256 signature to an immutable audit trail.
          </p>

          {/* Chips Row */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {CHIPS.map((chip) => (
              <span
                key={chip}
                className="text-xs text-white/75 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:border-[#00d2ff]/40 hover:text-white transition-all cursor-default select-none"
              >
                {chip}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Liquid-glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="liquid-glass rounded-2xl p-6 border border-white/10 shadow-2xl"
        >
          {/* Eyebrow text */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs">
            <span className="text-white/80 font-medium">Campus Perimeter · 1,420 Entries Verified Today</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Four Sub-Cards */}
          <div className="mt-4 space-y-3">
            {ARCHITECTURE_GROUPS.map((group) => (
              <div
                key={group.category}
                className="liquid-glass rounded-xl p-4 border border-white/5 hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between mb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: group.color }}
                    />
                    <span className="font-semibold text-white/90">{group.category}</span>
                  </div>
                  <span className="text-[11px] text-[#00d2ff] font-mono font-medium">
                    {group.count}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {group.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-white/60 truncate hover:text-white/90 transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-white/30">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
