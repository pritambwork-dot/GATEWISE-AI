'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Smartphone, Monitor, QrCode, ArrowRight, ShieldCheck, Home, Lock } from 'lucide-react';

interface PhoneOnlyGateProps {
  children: React.ReactNode;
}

export const PhoneOnlyGate: React.FC<PhoneOnlyGateProps> = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [bypassed, setBypassed] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && sessionStorage.getItem('gatewise_phone_override') === 'true') {
      setBypassed(true);
    }

    const checkDevice = () => {
      // STRICT CHECK: Screen width > 768px indicates desktop or laptop computer
      const isLargeScreen = window.innerWidth > 768;
      const isMobileUA = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      // If screen is wider than 768px and not a phone UA, trigger desktop blocking gate
      setIsDesktop(isLargeScreen && !isMobileUA);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (!mounted || bypassed) return <>{children}</>;

  if (isDesktop) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#070B1A] text-white flex flex-col items-center justify-center p-6 text-center select-none overflow-y-auto">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 w-96 h-96 bg-[#2F5BFF]/15 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-md p-8 rounded-[36px] bg-white/[0.04] border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col items-center space-y-5"
        >
          {/* Brand Mark with Mobile Badge */}
          <div className="relative">
            <div className="w-16 h-16 rounded-3xl bg-[#2F5BFF] flex items-center justify-center shadow-[0_0_30px_rgba(47,91,255,0.4)]">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#12B5A6] flex items-center justify-center text-white text-[10px] font-bold shadow-md">
              <Lock className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2F5BFF]/15 border border-[#2F5BFF]/30 text-[10px] font-bold text-[#2F5BFF] uppercase tracking-wider">
              <span>Mobile Smartphones Only</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Handheld Device Required
            </h1>
            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              GATEWISE Guard is sovereign mobile terminal software engineered strictly for handheld smartphones and portable gate terminals operated by campus security personnel at IIM Sambalpur.
            </p>
          </div>

          {/* QR Code / Instructions Box */}
          <div className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center space-y-3">
            <div className="w-32 h-32 rounded-xl bg-white p-2.5 flex items-center justify-center shadow-md">
              {/* Clean SVG QR Code Representation */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-black"
                fill="currentColor"
              >
                <path d="M0,0 h30 v30 h-30 z M6,6 v18 h18 v-18 z M10,10 h10 v10 h-10 z" />
                <path d="M70,0 h30 v30 h-30 z M76,6 v18 h18 v-18 z M80,10 h10 v10 h-10 z" />
                <path d="M0,70 h30 v30 h-30 z M6,76 v18 h18 v-18 z M10,80 h10 v10 h-10 z" />
                <rect x="40" y="10" width="8" height="8" />
                <rect x="52" y="10" width="8" height="8" />
                <rect x="40" y="24" width="20" height="6" />
                <rect x="10" y="40" width="8" height="20" />
                <rect x="24" y="40" width="8" height="8" />
                <rect x="40" y="40" width="20" height="20" />
                <rect x="70" y="40" width="8" height="8" />
                <rect x="84" y="40" width="8" height="20" />
                <rect x="40" y="70" width="12" height="8" />
                <rect x="58" y="70" width="12" height="8" />
                <rect x="40" y="84" width="20" height="8" />
                <rect x="70" y="70" width="20" height="20" />
              </svg>
            </div>
            <span className="text-[11px] text-white/60 font-mono">
              Scan with your phone camera to open /guard
            </span>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-2 pt-1">
            {/* Desktop Command Centre CTA */}
            <a
              href="/admin"
              className="w-full py-3 min-h-[48px] rounded-full bg-white text-black font-bold text-xs hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Monitor className="w-4 h-4 text-black" />
              <span>Open Command Centre (Computers &amp; Laptops)</span>
            </a>

            {/* Return to Home */}
            <a
              href="/"
              className="w-full py-2.5 rounded-full border border-white/10 hover:bg-white/5 active:scale-[0.98] transition-all text-xs text-white/70 hover:text-white flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return to Institutional Home</span>
            </a>

            {/* Developer Testing Override */}
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem('gatewise_phone_override', 'true');
                setBypassed(true);
              }}
              className="text-[10px] text-white/40 hover:text-white/80 transition-colors pt-2 underline cursor-pointer"
            >
              Developer Simulator: Bypass Phone Gate
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#12B5A6]" />
            <span>IIM Sambalpur Field Terminal Policy Enforced</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};
