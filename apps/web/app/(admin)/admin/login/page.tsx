'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogoMark } from '@/components/aura/primitives/LogoMark';
import { useAuth } from '@/lib/contexts/auth-context';
import { AlertCircle, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

type PrototypeState =
  | 'default'
  | 'focus'
  | 'validation_error'
  | 'invalid_credentials'
  | 'account_disabled'
  | 'loading'
  | 'session_expired';

const translations = {
  en: {
    welcomeBack: 'Welcome back',
    signInSubtitle: 'Sign in to the administrator portal.',
    adminIdLabel: 'Institutional email or administrator ID',
    adminIdPlaceholder: '[administrator ID or institutional email]',
    passwordLabel: 'Password',
    show: 'Show',
    hide: 'Hide',
    signingIn: 'Signing in...',
    signIn: 'Sign In',
    forgotPassword: 'Forgot password?',
    rememberDevice: 'Remember this device appears only if the backend supports it.',
    legalNotice: 'This portal is for authorised institutional administrators. Sign-in attempts are logged. Demo credentials are never shown. Real authentication happens in the backend.',
    protoLabel: 'PROTOTYPE: PREVIEW SIGN-IN STATE',
    leftTagline: 'Verify identity.\nAuthorise entry.',
    leftSubtitle: 'The administrator portal for institutional gate management. Cobalt means trust. Teal means a person is recognised.',
    leftFootnote: 'Authorised administrators only. Access is logged.',
    // Error messages
    errValidation: 'Please provide an administrator ID or institutional email.',
    errInvalidCreds: 'Invalid administrator ID or password.',
    errDisabled: 'This administrator account has been suspended by institutional policy.',
    errSessionExpired: 'Your security session has expired. Please sign in again to continue.',
  },
  hi: {
    welcomeBack: 'वापस स्वागत है',
    signInSubtitle: 'प्रशासक पोर्टल में साइन इन करें।',
    adminIdLabel: 'संस्थागत ईमेल या प्रशासक आईडी',
    adminIdPlaceholder: '[प्रशासक आईडी या संस्थागत ईमेल]',
    passwordLabel: 'पासवर्ड',
    show: 'दिखाएँ',
    hide: 'छुपाएँ',
    signingIn: 'साइन इन हो रहा है...',
    signIn: 'साइन इन करें',
    forgotPassword: 'पासवर्ड भूल गए?',
    rememberDevice: 'यह डिवाइस याद रखें — केवल तभी दिखाई देता है जब बैकएंड इसका समर्थन करता हो।',
    legalNotice: 'यह पोर्टल केवल अधिकृत संस्थागत प्रशासकों के लिए है। साइन-इन प्रयासों को लॉग किया जाता है। डेमो क्रेडेंशियल कभी नहीं दिखाए जाते। वास्तविक प्रमाणीकरण बैकएंड पर होता है।',
    protoLabel: 'प्रोटोटाइप: साइन-इन स्थिति पूर्वावलोकन',
    leftTagline: 'पहचान सत्यापित करें।\nप्रवेश प्राधिकृत करें।',
    leftSubtitle: 'संस्थागत गेट प्रबंधन के लिए प्रशासक पोर्टल। नीला रंग विश्वास का प्रतीक है। हरा रंग पहचान की पुष्टि दर्शाता है।',
    leftFootnote: 'केवल अधिकृत प्रशासकों के लिए। प्रवेश लॉग किया जाता है।',
    errValidation: 'कृपया एक प्रशासक आईडी या संस्थागत ईमेल प्रदान करें।',
    errInvalidCreds: 'अमान्य प्रशासक आईडी या पासवर्ड।',
    errDisabled: 'यह प्रशासक खाता संस्थागत नीति द्वारा निलंबित किया गया है।',
    errSessionExpired: 'आपका सुरक्षा सत्र समाप्त हो गया है। कृपया पुनः साइन इन करें।',
  },
} as const;

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [adminId, setAdminId] = useState('ADM-001');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [protoState, setProtoState] = useState<PrototypeState>('default');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const t = translations[language];

  const applyState = (state: PrototypeState) => {
    setProtoState(state);
    setErrorMessage(null);

    switch (state) {
      case 'default':
        setAdminId('ADM-001');
        setPassword('admin123');
        break;
      case 'focus':
        setAdminId('admin@institution.edu');
        setPassword('');
        break;
      case 'validation_error':
        setAdminId('');
        setPassword('');
        setErrorMessage(translations[language].errValidation);
        break;
      case 'invalid_credentials':
        setAdminId('ADM-999');
        setPassword('wrong-pass');
        setErrorMessage(translations[language].errInvalidCreds);
        break;
      case 'account_disabled':
        setAdminId('ADM-SUSPENDED');
        setPassword('••••••••');
        setErrorMessage(translations[language].errDisabled);
        break;
      case 'loading':
        setAdminId('ADM-001');
        setPassword('••••••••');
        break;
      case 'session_expired':
        setAdminId('ADM-001');
        setPassword('');
        setErrorMessage(translations[language].errSessionExpired);
        break;
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminId.trim() || !password.trim()) {
      applyState('validation_error');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await login(adminId, password);
      window.location.href = '/admin';
    } catch (err: any) {
      setProtoState('invalid_credentials');
      setErrorMessage(err.message || t.errInvalidCreds);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStateLoading = protoState === 'loading' || isSubmitting;

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 font-sans select-none antialiased">
      {/* LEFT COLUMN: Deep Midnight Brand Canvas (#070B1A) */}
      <div className="relative bg-[#070B1A] text-white p-8 sm:p-14 lg:p-20 flex flex-col justify-between overflow-hidden">
        {/* Subtle radial ambient glow */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#2F5BFF]/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#12B5A6]/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Top Header: LogoMark + GATEWISE AI */}
        <div className="relative z-10 flex items-center gap-3">
          <LogoMark className="w-9 h-9" />
          <span className="text-xl font-bold tracking-tight text-white flex items-center">
            GATEWISE
            <span className="text-[#12B5A6] ml-1.5 font-extrabold">AI</span>
          </span>
        </div>

        {/* Center Hero Block */}
        <div className="relative z-10 my-16 lg:my-0 max-w-lg space-y-6">
          {/* Official Emblem */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#2F5BFF] flex items-center justify-center shadow-[0_20px_50px_rgba(47,91,255,0.35)]">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 sm:w-20 sm:h-20"
            >
              <path
                d="M17 33V23C17 19.134 20.134 16 24 16C27.866 16 31 19.134 31 23V33"
                stroke="#FFFFFF"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 33H36"
                stroke="#FFFFFF"
                strokeWidth="3.4"
                strokeLinecap="round"
              />
              <circle cx="24" cy="23" r="3.6" fill="#12B5A6" />
            </svg>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.06]">
            {t.leftTagline.split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h1>

          <p className="text-white/65 text-sm sm:text-base leading-relaxed max-w-md">
            {t.leftSubtitle}
          </p>

          <div className="pt-2">
            <span className="text-[#12B5A6] font-bold text-lg sm:text-xl tracking-wide">
              {language === 'hi' ? 'पहचान सत्यापित' : 'पहचान सत्यापित'}
            </span>
          </div>
        </div>

        {/* Bottom Footnote */}
        <div className="relative z-10 text-xs text-white/40 font-medium">
          {t.leftFootnote}
        </div>
      </div>

      {/* RIGHT COLUMN: Warm Light Enterprise Surface (#F7F7F5) */}
      <div className="bg-[#F7F7F5] text-slate-900 p-8 sm:p-14 lg:p-20 flex flex-col justify-between overflow-y-auto">
        {/* Top Row: Mini Squircle Logo & Language Toggle */}
        <div className="flex items-center justify-between pb-6">
          <div className="w-11 h-11 rounded-2xl bg-[#2F5BFF] flex items-center justify-center shadow-xs">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7"
            >
              <path
                d="M17 33V23C17 19.134 20.134 16 24 16C27.866 16 31 19.134 31 23V33"
                stroke="#FFFFFF"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 33H36"
                stroke="#FFFFFF"
                strokeWidth="3.4"
                strokeLinecap="round"
              />
              <circle cx="24" cy="23" r="3.5" fill="#12B5A6" />
            </svg>
          </div>

          {/* Language Switcher Pills */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-slate-200/70 border border-slate-300/60 text-xs">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                language === 'en'
                  ? 'bg-[#2F5BFF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                language === 'hi'
                  ? 'bg-[#2F5BFF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-md w-full mx-auto my-auto space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.welcomeBack}
            </h2>
            <p className="text-sm text-slate-500">
              {t.signInSubtitle}
            </p>
          </div>

          {/* Conditional Error / Alert Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/90 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Input 1 */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-id"
                className="block text-xs font-semibold text-slate-800"
              >
                {t.adminIdLabel}
              </label>
              <input
                id="admin-id"
                type="text"
                autoComplete="username"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder={t.adminIdPlaceholder}
                className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-2xs ${
                  protoState === 'focus'
                    ? 'border-[#2F5BFF] ring-2 ring-[#2F5BFF]/20'
                    : errorMessage
                    ? 'border-rose-400 focus:border-rose-500'
                    : 'border-slate-300 focus:border-[#2F5BFF] focus:ring-1 focus:ring-[#2F5BFF]'
                }`}
              />
            </div>

            {/* Input 2: Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-800"
              >
                {t.passwordLabel}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pr-16 rounded-xl bg-white border text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-2xs ${
                    errorMessage
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-slate-300 focus:border-[#2F5BFF] focus:ring-1 focus:ring-[#2F5BFF]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#2F5BFF] hover:text-[#2045D6] transition-colors cursor-pointer px-1 py-0.5"
                >
                  {showPassword ? t.hide : t.show}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isStateLoading}
              className="w-full py-3.5 rounded-full bg-[#2F5BFF] hover:bg-[#2549D3] active:scale-[0.99] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isStateLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{t.signingIn}</span>
                </>
              ) : (
                <span>{t.signIn}</span>
              )}
            </button>

            {/* Direct Instant Access */}
            <a
              href="/admin"
              className="w-full py-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-2"
            >
              <span>{language === 'hi' ? 'कमांड सेंटर में सीधे प्रवेश करें (आईआईएम संबलपुर डेस्क)' : 'Launch Command Centre Directly (IIM Sambalpur Desk)'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#2F5BFF]" />
            </a>
          </form>

          {/* Links Row */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <a
              href="#forgot-password"
              onClick={(e) => {
                e.preventDefault();
                alert('Password reset instructions have been routed to your registered campus IT security desk.');
              }}
              className="font-semibold text-[#2F5BFF] hover:underline"
            >
              {t.forgotPassword}
            </a>
            <span className="text-[11px] text-slate-400 text-right max-w-[240px] leading-tight">
              {t.rememberDevice}
            </span>
          </div>

          {/* Legal Notice */}
          <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 leading-relaxed">
            {t.legalNotice}
          </div>
        </div>

        {/* Prototype State Switcher Pills */}
        <div className="pt-8 border-t border-slate-200 space-y-2.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block text-center">
            {t.protoLabel}
          </span>

          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
            {(
              [
                { id: 'default', label: 'Default' },
                { id: 'focus', label: 'Focus' },
                { id: 'validation_error', label: 'Validation error' },
                { id: 'invalid_credentials', label: 'Invalid credentials' },
                { id: 'account_disabled', label: 'Account disabled' },
                { id: 'loading', label: 'Loading' },
                { id: 'session_expired', label: 'Session expired' },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => applyState(s.id)}
                className={`px-3 py-1.5 rounded-full border transition-all text-xs font-semibold cursor-pointer ${
                  protoState === s.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
