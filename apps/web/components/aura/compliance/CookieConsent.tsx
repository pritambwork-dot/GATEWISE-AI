import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, Shield, Check, Settings2, X } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  preferences: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'gatewise_cookie_consent_v1';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);
  const [prefsAllowed, setPrefsAllowed] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore localStorage unavailable
    }
  }, []);

  // Listen to external request to open preferences (e.g. from footer link)
  useEffect(() => {
    const handleOpenCookies = () => {
      setIsPreferencesOpen(true);
      setIsVisible(true);
    };
    window.addEventListener('open-cookie-preferences', handleOpenCookies);
    return () => window.removeEventListener('open-cookie-preferences', handleOpenCookies);
  }, []);

  const saveConsent = (essential: boolean, analytics: boolean, preferences: boolean) => {
    const consent: CookiePreferences = {
      essential,
      analytics,
      preferences,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {
      // Ignore
    }
    setIsVisible(false);
    setIsPreferencesOpen(false);
  };

  const handleAcceptAll = () => saveConsent(true, true, true);
  const handleEssentialOnly = () => saveConsent(true, false, false);
  const handleSaveCustom = () => saveConsent(true, analyticsAllowed, prefsAllowed);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-6 z-50 max-w-3xl mx-auto pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="liquid-glass pointer-events-auto rounded-2xl sm:rounded-3xl border border-white/20 bg-[#0e1014]/95 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-white"
        >
          {!isPreferencesOpen ? (
            /* Main Banner */
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#12B5A6]/20 to-[#2F5BFF]/20 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Cookie className="w-5 h-5 text-[#12B5A6]" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-tight">Institutional Privacy &amp; Cookies</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#1FB36B] border border-white/10">
                      DPDP ACT 2023
                    </span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed max-w-xl">
                    GATEWISE AI employs strictly essential security tokens for edge terminal integrity and cryptographic CSRF mitigation. No biometric images or personal tracking identifiers are ever placed in cookies.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPreferencesOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer min-h-[38px]"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span>Customize</span>
                </button>
                <button
                  type="button"
                  onClick={handleEssentialOnly}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all cursor-pointer min-h-[38px]"
                >
                  Essential Only
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-white hover:bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all flex items-center gap-1.5 cursor-pointer min-h-[38px]"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept All</span>
                </button>
              </div>
            </div>
          ) : (
            /* Granular Preferences View */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#12B5A6]" />
                  <span className="text-sm font-bold text-white">Granular Cookie Governance</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPreferencesOpen(false)}
                  className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close preferences"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Essential */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="space-y-0.5 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Strictly Necessary &amp; Security</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1FB36B]/20 text-[#1FB36B]">ALWAYS ON</span>
                    </div>
                    <p className="text-[11px] text-white/60">
                      Required for sovereign gate authentication tokens, encrypted WebSockets, and CSRF defense. Cannot be disabled.
                    </p>
                  </div>
                  <input type="checkbox" checked disabled className="w-4 h-4 accent-white rounded cursor-not-allowed opacity-75" />
                </div>

                {/* Performance */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="space-y-0.5 max-w-md">
                    <span className="text-xs font-bold text-white">Telemetry &amp; Edge Latency Metrics</span>
                    <p className="text-[11px] text-white/60">
                      Anonymous pipeline timing (sub-300ms verification benchmarks) to maintain institutional gate responsiveness.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={analyticsAllowed}
                    onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                    className="w-4 h-4 accent-[#2F5BFF] rounded cursor-pointer"
                  />
                </div>

                {/* Preferences */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="space-y-0.5 max-w-md">
                    <span className="text-xs font-bold text-white">Command Desk UI Preferences</span>
                    <p className="text-[11px] text-white/60">
                      Stores terminal layout mode, audio playback mute state, and operator language selections locally.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefsAllowed}
                    onChange={(e) => setPrefsAllowed(e.target.checked)}
                    className="w-4 h-4 accent-[#2F5BFF] rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleEssentialOnly}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer min-h-[36px]"
                >
                  Reject Optional
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-white hover:bg-white/90 transition-all cursor-pointer min-h-[36px]"
                >
                  Save Selected Preferences
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
