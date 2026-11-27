'use client';

import React from 'react';
import { motion } from 'motion/react';

export const DoodleUnderline: React.FC<{ className?: string; animate?: boolean }> = ({
  className = 'w-64 h-4',
  animate = true,
}) => (
  <svg viewBox="0 0 260 18" fill="none" className={className} aria-hidden="true">
    <motion.path
      d="M3 12C48 4 108 16 154 8C192 2 224 12 256 6"
      stroke="#2F5BFF"
      strokeWidth="3.2"
      strokeLinecap="round"
      initial={animate ? { pathLength: 0 } : { pathLength: 1 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    />
    <motion.path
      d="M18 16C74 11 138 17 238 11"
      stroke="#0D9488"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeDasharray="4 4"
      initial={animate ? { pathLength: 0 } : { pathLength: 1 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.1, delay: 0.25, ease: 'easeOut' }}
    />
  </svg>
);

export const DoodleSparkle: React.FC<{ className?: string; color?: string; animate?: boolean }> = ({
  className = 'w-7 h-7',
  color = '#2F5BFF',
  animate = true,
}) => (
  <motion.svg
    viewBox="0 0 36 36"
    fill="none"
    className={className}
    aria-hidden="true"
    animate={animate ? { rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] } : {}}
    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
  >
    <path
      d="M18 3C18.5 11.5 21 16 33 18C21 20 18.5 24.5 18 33C17.5 24.5 15 20 3 18C15 16 17.5 11.5 18 3Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="29" cy="8" r="1.5" fill="#0D9488" />
  </motion.svg>
);

export const DoodleArrowNote: React.FC<{
  label: string;
  className?: string;
  direction?: 'right' | 'left';
}> = ({ label, className = '', direction = 'right' }) => (
  <div className={`inline-flex items-center gap-2 font-mono text-[10px] font-bold text-[#2F5BFF] ${className}`}>
    {direction === 'left' && (
      <svg viewBox="0 0 42 22" className="w-9 h-5 shrink-0" fill="none" aria-hidden="true">
        <path
          d="M39 5C28 4 18 9 7 15M7 15L14 10M7 15L13 19"
          stroke="#2F5BFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
    <span className="px-2 py-0.5 border border-dashed border-[#2F5BFF]/60 bg-white rotate-[-2deg]">
      {label}
    </span>
    {direction === 'right' && (
      <svg viewBox="0 0 42 22" className="w-9 h-5 shrink-0" fill="none" aria-hidden="true">
        <path
          d="M3 6C15 5 25 10 35 16M35 16L28 11M35 16L29 20"
          stroke="#2F5BFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  </div>
);

export const DoodleGateSketch: React.FC<{ className?: string; animate?: boolean }> = ({
  className = 'w-44 h-28',
  animate = true,
}) => (
  <svg viewBox="0 0 210 120" fill="none" className={className} aria-hidden="true">
    {/* Hand-drawn ground squiggle */}
    <path d="M10 102C60 100 140 104 200 101" stroke="#0A0E1A" strokeWidth="2" strokeLinecap="round" />
    {/* Cute Guard Booth Doodle */}
    <path
      d="M24 102V54C24 51 27 48 30 48H66C69 48 72 51 72 54V102"
      stroke="#0A0E1A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M20 48L48 30L76 48" stroke="#2F5BFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="34" y="58" width="28" height="20" rx="2" stroke="#2F5BFF" strokeWidth="1.8" />
    {/* Smiling little officer */}
    <circle cx="48" cy="66" r="4.5" stroke="#0A0E1A" strokeWidth="1.6" />
    <path d="M40 77C42 73 54 73 56 77" stroke="#0A0E1A" strokeWidth="1.6" strokeLinecap="round" />
    {/* Boom Barrier Arm (gently lifts!) */}
    <rect x="86" y="76" width="12" height="26" stroke="#0A0E1A" strokeWidth="2" fill="#FFFFFF" />
    <motion.g
      animate={animate ? { rotate: [0, -18, 0] } : {}}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ originX: '92px', originY: '82px' }}
    >
      <path d="M92 82L178 76" stroke="#2F5BFF" strokeWidth="4" strokeLinecap="round" />
      <path d="M108 81L116 80M130 79L138 78M152 78L160 77" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </motion.g>
    {/* Cute tiny car doodle */}
    <path
      d="M132 101V91C132 88 136 86 142 86H172C178 86 182 89 184 94L188 101"
      stroke="#0A0E1A"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="144" cy="101" r="4" fill="#FFFFFF" stroke="#0A0E1A" strokeWidth="2" />
    <circle cx="174" cy="101" r="4" fill="#FFFFFF" stroke="#0A0E1A" strokeWidth="2" />
    {/* Signal waves above scanner */}
    <motion.path
      d="M104 42C109 36 117 36 122 42M100 36C108 27 118 27 126 36"
      stroke="#0D9488"
      strokeWidth="1.8"
      strokeLinecap="round"
      animate={animate ? { opacity: [0.3, 1, 0.3] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </svg>
);

export const DoodleClipboardCheck: React.FC<{ className?: string }> = ({
  className = 'w-14 h-14',
}) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <path
      d="M16 14H48C50 14 52 16 52 18V54C52 56 50 58 48 58H16C14 58 12 56 12 54V18C12 16 14 14 16 14Z"
      stroke="#0A0E1A"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path d="M24 10H40V18H24V10Z" stroke="#2F5BFF" strokeWidth="2.2" fill="#FFFFFF" strokeLinejoin="round" />
    <path d="M22 36L29 43L43 27" stroke="#0D9488" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 49H40" stroke="#CBD5E1" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export const DoodleZigZagDivider: React.FC<{ className?: string }> = ({
  className = 'w-full h-5 text-[#2F5BFF]/30',
}) => (
  <svg viewBox="0 0 600 20" preserveAspectRatio="none" fill="none" className={className} aria-hidden="true">
    <path
      d="M0 10 Q15 2 30 10 T60 10 T90 10 T120 10 T150 10 T180 10 T210 10 T240 10 T270 10 T300 10 T330 10 T360 10 T390 10 T420 10 T450 10 T480 10 T510 10 T540 10 T570 10 T600 10"
      stroke="currentColor"
      strokeWidth="1.6"
      fill="none"
    />
  </svg>
);

export const DoodleCameraScan: React.FC<{ className?: string; animate?: boolean }> = ({
  className = 'w-20 h-20',
  animate = true,
}) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
    <rect x="20" y="10" width="40" height="60" rx="7" stroke="#0A0E1A" strokeWidth="2.2" fill="#FFFFFF" />
    <path d="M35 16H45" stroke="#0A0E1A" strokeWidth="2" strokeLinecap="round" />
    <rect x="25" y="22" width="30" height="36" rx="2" stroke="#2F5BFF" strokeWidth="1.6" strokeDasharray="3 3" />
    <circle cx="40" cy="39" r="9" stroke="#0D9488" strokeWidth="1.8" />
    <circle cx="37" cy="37" r="1.3" fill="#0A0E1A" />
    <circle cx="43" cy="37" r="1.3" fill="#0A0E1A" />
    <path d="M36 42C38 44 42 44 44 42" stroke="#0A0E1A" strokeWidth="1.5" strokeLinecap="round" />
    <motion.line
      x1="27"
      y1="32"
      x2="53"
      y2="32"
      stroke="#2F5BFF"
      strokeWidth="1.8"
      animate={animate ? { y1: [26, 52, 26], y2: [26, 52, 26] } : {}}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
    />
    <circle cx="40" cy="64" r="2.2" fill="#2F5BFF" />
    <path d="M10 34C13 30 13 44 10 40M70 34C67 30 67 44 70 40" stroke="#2F5BFF" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const DoodleSyncLoop: React.FC<{ className?: string; animate?: boolean }> = ({
  className = 'w-28 h-12',
  animate = true,
}) => (
  <svg viewBox="0 0 120 48" fill="none" className={className} aria-hidden="true">
    <motion.path
      d="M16 18C32 4 88 4 104 18"
      stroke="#2F5BFF"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeDasharray="4 4"
      animate={animate ? { strokeDashoffset: [0, -16] } : {}}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
    />
    <path d="M98 18H105V11" stroke="#2F5BFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <motion.path
      d="M104 30C88 44 32 44 16 30"
      stroke="#0D9488"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeDasharray="4 4"
      animate={animate ? { strokeDashoffset: [0, -16] } : {}}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
    />
    <path d="M22 30H15V37" stroke="#0D9488" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="60" cy="24" r="6" fill="#EEF2FF" stroke="#2F5BFF" strokeWidth="1.8" />
    <circle cx="60" cy="24" r="2" fill="#0D9488" />
  </svg>
);

export const DoodleShieldCheck: React.FC<{ className?: string }> = ({
  className = 'w-14 h-14',
}) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <path
      d="M32 8L52 16V31C52 44 43 52 32 56C21 52 12 44 12 31V16L32 8Z"
      fill="#FFFFFF"
      stroke="#0A0E1A"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path d="M23 32L29.5 38.5L42 25" stroke="#2F5BFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="52" cy="12" r="2" fill="#0D9488" />
  </svg>
);
