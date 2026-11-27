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
          className="pointer-events-auto border border-[#0A0E1A] bg-white p-5 sm:p-6 shadow-[6px_6px_0px_#2F5BFF] text-[#0A0E1A]"
        >
          {!isPreferencesOpen ? (
            /* Main Banner */
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-[#EEF2FF] border border-[#2F5BFF]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Cookie className="w-5 h-5 text-[#2F5BFF]" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#0A0E1A] tracking-tight">Institutional Privacy &amp; Cookies</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/30 font-bold">
                      DPDP ACT 2023
                    </span>
                  </div>
                  <p className="text-xs text-[#475569] leading-relaxed max-w-xl">
                    GATEWISE AI employs strictly essential security tokens for edge terminal integrity and cryptographic CSRF mitigation. No biometric images or tracking cookies are placed.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPreferencesOpen(true)}
                  className="px-3.5 py-2 text-xs font-semibold text-[#475569] hover:text-[#0A0E1A] hover:bg-[#FAF9F6] border border-[#DCE1EC] transition-all flex items-center gap-1.5 cursor-pointer min-h-[38px]"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span>Customize</span>
                </button>
                <button
                  type="button"
                  onClick={handleEssentialOnly}
                  className="px-3.5 py-2 text-xs font-semibold text-[#0A0E1A] bg-[#FAF9F6] hover:bg-[#F2F4F8] border border-[#0A0E1A] transition-all cursor-pointer min-h-[38px]"
                >
                  Essential Only
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2F5BFF] hover:bg-[#1E44E0] transition-all flex items-center gap-1.5 cursor-pointer min-h-[38px]"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept All</span>
                </button>
              </div>
            </div>
          ) : (
            /* Granular Preferences View */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DCE1EC]">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#2F5BFF]" />
                  <span className="text-sm font-bold text-[#0A0E1A]">Granular Cookie Governance</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPreferencesOpen(false)}
                  className="w-7 h-7 hover:bg-[#FAF9F6] flex items-center justify-center text-[#475569] hover:text-[#0A0E1A] transition-colors cursor-pointer"
                  aria-label="Close preferences"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Essential */}
                <div className="flex items-center justify-between p-3 bg-[#FAF9F6] border border-[#DCE1EC]">
                  <div className="space-y-0.5 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0A0E1A]">Strictly Necessary &amp; Security</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#15803D]/10 text-[#15803D] font-bold">ALWAYS ON</span>
                    </div>
                    <p className="text-[11px] text-[#475569]">
                      Required for sovereign gate authentication tokens, encrypted WebSockets, and CSRF defense.
                    </p>
                  </div>
                  <input type="checkbox" checked disabled className="w-4 h-4 accent-[#2F5BFF] cursor-not-allowed opacity-75" />
                </div>

                {/* Performance */}
                <div className="flex items-center justify-between p-3 bg-[#FAF9F6] border border-[#DCE1EC]">
                  <div className="space-y-0.5 max-w-md">
                    <span className="text-xs font-bold text-[#0A0E1A]">Telemetry &amp; Edge Latency Metrics</span>
                    <p className="text-[11px] text-[#475569]">
                      Anonymous pipeline timing to maintain institutional gate responsiveness.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={analyticsAllowed}
                    onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                    className="w-4 h-4 accent-[#2F5BFF] cursor-pointer"
                  />
                </div>

                {/* Preferences */}
                <div className="flex items-center justify-between p-3 bg-[#FAF9F6] border border-[#DCE1EC]">
                  <div className="space-y-0.5 max-w-md">
                    <span className="text-xs font-bold text-[#0A0E1A]">Command Desk UI Preferences</span>
                    <p className="text-[11px] text-[#475569]">
                      Stores terminal layout mode and operator language selections locally.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefsAllowed}
                    onChange={(e) => setPrefsAllowed(e.target.checked)}
                    className="w-4 h-4 accent-[#2F5BFF] cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleEssentialOnly}
                  className="px-3.5 py-2 text-xs font-medium text-[#0A0E1A] bg-[#FAF9F6] hover:bg-[#F2F4F8] border border-[#DCE1EC] transition-all cursor-pointer min-h-[36px]"
                >
                  Reject Optional
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2F5BFF] hover:bg-[#1E44E0] transition-all cursor-pointer min-h-[36px]"
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
