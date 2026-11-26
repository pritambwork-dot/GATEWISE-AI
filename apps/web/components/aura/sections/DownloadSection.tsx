import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Monitor, Smartphone, ArrowRight, Download,
  CheckCircle2, ShieldCheck, Sparkles, ExternalLink, QrCode, Terminal, Lock
} from 'lucide-react';
import { SectionEyebrow } from '../primitives/SectionEyebrow';

export const DownloadSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'web' | 'guard'>('all');
  const [installCopied, setInstallCopied] = useState(false);

  const platforms = [
    {
      id: 'web',
      name: 'Command Centre Web App',
      category: 'BROWSER & PWA',
      badge: 'OFFICIAL PRODUCTION',
      badgeColor: 'border-[#12B5A6]/30 bg-[#12B5A6]/10 text-[#12B5A6]',
      icon: Monitor,
      headline: 'Instant Zero-Install Access from Any Device',
      description:
        'The centralized institutional command centre runs directly in your modern web browser and can be installed locally as a high-performance Progressive Web App (PWA). Full multi-gate telemetry, biometric vector audit, and incident dispatch.',
      version: '',
      size: 'Instant Stream / PWA Cached',
      requirements: 'Chrome 110+, Safari 16+, Edge 110+, Firefox 115+',
      primaryAction: {
        label: 'Launch Command Centre',
        href: '/admin',
        isExternal: false,
      },
      secondaryAction: {
        label: 'Sign In / Authenticate',
        href: '/admin/login',
        isExternal: false,
      },
      features: [
        'Instant launch with zero local binary installation required',
        'Installable as standalone Desktop PWA via browser address bar',
        'Live WebSocket telemetry with sub-150ms gate sync',
        'Cryptographic HMAC-SHA256 non-repudiation audit logs',
      ],
      checksum: 'W3C PWA Compliant • TLS 1.3 End-to-End Encrypted',
    },
    {
      id: 'guard',
      name: 'Guard Web Terminal',
      category: 'SOVEREIGN WEB APP / PWA',
      badge: 'FIELD HARDENED',
      badgeColor: 'border-[#1FB36B]/30 bg-[#1FB36B]/10 text-[#1FB36B]',
      icon: Smartphone,
      headline: 'Sub-300ms On-Device Edge Biometric Terminal',
      description:
        'Engineered for handheld guard smartphones and tablets at active perimeter posts. Runs YuNet landmark tracking and SFace 128-D cosine vectors 100% in-browser with zero raw photo retention and instant live sync with the Command Centre.',
      version: '',
      size: 'Instant Mobile Web App / Offline Cached',
      requirements: 'Mobile Chrome, Safari, Samsung Internet, Edge (Android & iOS)',
      primaryAction: {
        label: 'Launch Guard Web App',
        href: '/guard',
        isExternal: false,
      },
      secondaryAction: {
        label: 'Live Operations Scene',
        href: '#guard-web-scene',
        isExternal: false,
      },
      features: [
        'Sub-300ms on-device edge camera face detection & vector matching',
        'Offline local roster continuity when internet connection drops',
        'Zero raw biometric photo persistence (DPDP Act 2023 compliant)',
        'Instant bidirectional synchronization with the Command Centre',
      ],
      checksum: 'PWA Offline Enclave • Camera Scoped • HMAC-SHA256 Ledger',
    },
  ];

  const filteredPlatforms = platforms.filter(
    (p) => activeTab === 'all' || p.id === activeTab
  );

  return (
    <section id="downloads" className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-24">
      {/* Eyebrow & Title */}
      <div className="flex flex-col items-center text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
        <SectionEyebrow label="Verified Web Access Hub" tag="Zero Installation" />
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Deploy GATEWISE AI Everywhere
        </h2>
        <p className="text-white/65 max-w-2xl text-xs sm:text-sm lg:text-base leading-relaxed px-2">
          Access both the Central Command Centre and the Handheld Guard Web Terminal instantly in your web browser with zero local installation required.
        </p>

        {/* Filter Pills - Responsive Horizontal Scrolling */}
        <div className="w-full flex items-center justify-start sm:justify-center gap-2 pt-2 sm:pt-4 overflow-x-auto no-scrollbar pb-1 px-1">
          {[
            { id: 'all', label: 'All Deployments (2)' },
            { id: 'web', label: 'Command Centre Web App' },
            { id: 'guard', label: 'Guard Web Terminal (PWA)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 min-h-[38px] ${
                activeTab === tab.id
                  ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)] font-bold'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {filteredPlatforms.map((platform, idx) => {
          const Icon = platform.icon;
          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="liquid-glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/15 bg-black/60 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col justify-between group hover:border-white/30 transition-all relative overflow-hidden"
            >
              {/* Top ambient glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 via-transparent to-transparent pointer-events-none rounded-full" />

              <div className="space-y-5 sm:space-y-6">
                {/* Platform Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 sm:gap-3.5">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0 group-hover:scale-105 group-hover:bg-white/15 transition-all">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#2F5BFF]" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-xl font-bold text-white tracking-tight">
                        {platform.name}
                      </h3>
                      <span className="text-[10px] sm:text-[11px] font-mono text-white/50 uppercase tracking-wider block">
                        {platform.category}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-bold border ${platform.badgeColor} shrink-0`}>
                    {platform.badge}
                  </span>
                </div>

                {/* Headline & Description */}
                <div className="space-y-1.5 sm:space-y-2">
                  <h4 className="text-xs sm:text-sm font-semibold text-white/90">
                    {platform.headline}
                  </h4>
                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                    {platform.description}
                  </p>
                </div>

                {/* Specs Box */}
                <div className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 grid grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase font-mono">Download Size</span>
                    <span className="font-semibold text-[#1FB36B] font-mono text-[11px] truncate block">{platform.size}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase font-mono">Compatibility</span>
                    <span className="text-white/70 text-[11px]">{platform.requirements}</span>
                  </div>
                </div>

                {/* Features Checklist */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-mono block">
                    Enterprise Capabilities
                  </span>
                  <ul className="space-y-1.5">
                    {platform.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-white/75">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1FB36B] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                  <a
                    href={platform.primaryAction.href}
                    target={platform.primaryAction.isExternal ? '_blank' : '_self'}
                    rel="noreferrer"
                    className="w-full sm:w-auto flex-1 py-3 px-5 min-h-[46px] rounded-full bg-white text-black text-xs font-bold hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer"
                  >
                    <span>{platform.primaryAction.label}</span>
                    {platform.primaryAction.isExternal ? (
                      <ExternalLink className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5" />
                    )}
                  </a>

                  <a
                    href={platform.secondaryAction.href}
                    className="w-full sm:w-auto px-4 py-3 min-h-[46px] rounded-full border border-white/15 bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-xs font-semibold text-white/80 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{platform.secondaryAction.label}</span>
                  </a>
                </div>

                {/* Verification Checksum Tag */}
                <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-mono truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1FB36B] shrink-0" />
                  <span className="truncate">{platform.checksum}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* PWA Quick Guide Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-8 sm:mt-12 liquid-glass rounded-2xl p-5 sm:p-8 border border-white/15 bg-gradient-to-r from-[#2F5BFF]/20 via-black/60 to-[#12B5A6]/20 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6"
      >
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Sparkles className="w-4 h-4 text-[#12B5A6]" />
            <h4 className="text-sm sm:text-base font-bold text-white">
              Instant Web App &amp; Standalone Desktop PWA
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-white/60 max-w-xl">
            You don&apos;t have to wait for app store review. Open GATEWISE AI in Chrome or Safari, tap
            &ldquo;Add to Home Screen&rdquo; or the address bar install icon to launch instantly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
          <a
            href="/admin"
            className="px-5 py-3 min-h-[44px] rounded-full bg-white text-black font-bold text-xs hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>Launch Web App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="/admin/login"
            className="px-4 py-3 min-h-[44px] rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Admin Login</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
};
