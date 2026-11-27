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
      <div className="fixed inset-0 z-[9999] bg-[#FAF9F6] text-[#0A0E1A] border-[6px] border-[#2F5BFF] flex flex-col items-center justify-center p-6 text-center select-none overflow-y-auto paper-grid">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-md p-8 bg-white border border-[#0A0E1A] shadow-[8px_8px_0px_#2F5BFF] flex flex-col items-center space-y-5"
        >
          {/* Brand Mark with Mobile Badge */}
          <div className="relative">
            <div className="w-16 h-16 bg-[#2F5BFF] flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0A0E1A] flex items-center justify-center text-white text-[10px] font-bold">
              <Lock className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EEF2FF] border border-[#2F5BFF]/30 font-mono text-[10px] font-bold text-[#2F5BFF] uppercase tracking-wider">
              <span>Mobile Smartphones Only · Rear Camera</span>
            </div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-[#0A0E1A]">
              Handheld Device Required
            </h1>
            <p className="text-xs text-[#475569] leading-relaxed max-w-sm">
              GATEWISE Guard is sovereign mobile terminal software engineered strictly for handheld smartphones and portable rear-camera gate terminals at IIM Sambalpur.
            </p>
          </div>

          {/* QR Code / Instructions Box */}
          <div className="w-full p-4 bg-[#FAF9F6] border border-[#DCE1EC] flex flex-col items-center space-y-3">
            <div className="w-32 h-32 bg-white border border-[#DCE1EC] p-2.5 flex items-center justify-center">
              {/* Clean SVG QR Code Representation */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-[#0A0E1A]"
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
            <span className="text-[11px] text-[#475569] font-mono">
              Scan with your phone camera to open /guard
            </span>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-2 pt-1">
            <a
              href="/admin"
              className="w-full py-3 min-h-[46px] bg-[#2F5BFF] hover:bg-[#1E44E0] text-white font-mono uppercase tracking-[0.08em] font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Monitor className="w-4 h-4 text-white" />
              <span>Open Command Centre (Desktop)</span>
            </a>

            <a
              href="/"
              className="w-full py-2.5 border border-[#0A0E1A] bg-white hover:bg-[#F2F4F8] transition-all font-mono text-xs uppercase tracking-[0.08em] text-[#0A0E1A] flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return to Institutional Home</span>
            </a>

            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem('gatewise_phone_override', 'true');
                setBypassed(true);
              }}
              className="text-[10px] text-[#475569] hover:text-[#2F5BFF] transition-colors pt-2 underline cursor-pointer"
            >
              Developer Simulator: Bypass Phone Gate
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#475569]">
            <span className="w-1.5 h-1.5 bg-[#15803D]" />
            <span>IIM Sambalpur Field Terminal Policy Enforced</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};
