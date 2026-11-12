import React from 'react';
import { LogoMark } from '../primitives/LogoMark';

export const Footer: React.FC = () => {
  const openModal = (modal: 'privacy' | 'terms' | 'security' | 'compliance' | 'cookies') => {
    window.dispatchEvent(new CustomEvent('open-legal-modal', { detail: { modal } }));
  };

  return (
    <footer className="relative z-10 border-t border-white/10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-14 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/50 text-center md:text-left">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <LogoMark className="w-6 h-6 text-white/90 shrink-0" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <span className="font-bold text-white/90">GATEWISE AI</span>
          <span className="hidden sm:inline">•</span>
          <span>© {new Date().getFullYear()} GATEWISE Technologies Inc. Sovereign Perimeter Operations.</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 sm:gap-6">
        <button
          type="button"
          onClick={() => openModal('privacy')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Zero-Image Privacy Policy
        </button>
        <button
          type="button"
          onClick={() => openModal('terms')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Terms of Service
        </button>
        <button
          type="button"
          onClick={() => openModal('security')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Security Whitepaper
        </button>
        <button
          type="button"
          onClick={() => openModal('compliance')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          ISO 27001 &amp; DPDP
        </button>
        <button
          type="button"
          onClick={() => openModal('cookies')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Cookie Preferences
        </button>
        <div className="flex items-center gap-2 text-emerald-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>All Gates Operational</span>
        </div>
      </div>
    </footer>
  );
};
