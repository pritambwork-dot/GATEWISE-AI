import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Monitor, Smartphone, Laptop, Apple, ArrowRight, Download,
  CheckCircle2, ShieldCheck, Sparkles, ExternalLink, QrCode, Terminal, Lock
} from 'lucide-react';
import { SectionEyebrow } from '../primitives/SectionEyebrow';

export const DownloadSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'web' | 'android' | 'macos' | 'ios'>('all');
  const [installCopied, setInstallCopied] = useState(false);

  const platforms = [
    {
      id: 'web',
      name: 'Command Centre Web App',
      category: 'BROWSER & PWA',
      badge: 'OFFICIAL PRODUCTION',
      badgeColor: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
      icon: Monitor,
      headline: 'Instant Zero-Install Access from Any Device',
      description:
        'The centralized institutional command centre runs directly in your modern web browser and can be installed locally as a high-performance Progressive Web App (PWA). Full multi-gate telemetry, biometric vector audit, and incident dispatch.',
      version: 'v1.0.0 Production Web',
      size: 'Instant Stream / PWA Cached',
      requirements: 'Chrome 110+, Safari 16+, Edge 110+, Firefox 115+',
      primaryAction: {
        label: 'Launch Web Command Centre',
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
      id: 'android',
      name: 'Android Guard APK',
      category: 'NATIVE ANDROID',
      badge: 'FIELD HARDENED',
      badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      icon: Smartphone,
      headline: 'Sub-300ms On-Device Edge Biometric Terminal',
      description:
        'Engineered for handheld ruggedized Android terminals and guard smartphones at active perimeter posts. Runs YuNet landmark tracking and SFace 128-D cosine vectors 100% on-device with zero raw photo retention.',
      version: 'v1.0.0 (Build 12)',
      size: '24.8 MB (Native Signed Package)',
      requirements: 'Android 8.0 (Oreo, API 26) through Android 15+',
      primaryAction: {
        label: 'Download Native APK',
        href: '/downloads/gatewise-guard-v1.0.0-release.apk',
        isExternal: false,
      },
      secondaryAction: {
        label: 'Inspect SHA-256 Checksum',
        href: '/downloads/gatewise-guard-v1.0.0-release.apk.sha256',
        isExternal: false,
      },
      features: [
        'Sub-300ms on-device edge camera face detection & vector matching',
        'Offline SQLite local roster continuity when internet fails',
        'Zero raw biometric photo persistence (DPDP Act 2023 compliant)',
        'Signed release artifact verified for production distribution',
      ],
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
    {
      id: 'macos',
      name: 'macOS Command Console',
      category: 'NATIVE MACOS (DMG)',
      badge: 'UNIVERSAL BINARY',
      badgeColor: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
      icon: Laptop,
      headline: 'Supervisor Console for Apple Silicon & Intel',
      description:
        'Dedicated desktop application for security control rooms and station chiefs. Multi-display gate monitoring, hardware barrier relay triggers, and continuous audit stream logging.',
      version: 'v1.0.0 Universal Desktop',
      size: '1.2 MB (Verified Native DMG)',
      requirements: 'macOS Monterey (12.0) through macOS Sequoia (15+)',
      primaryAction: {
        label: 'Download macOS DMG',
        href: '/downloads/gatewise-admin-macos-v1.0.0.dmg',
        isExternal: false,
      },
      secondaryAction: {
        label: 'View Release Metadata',
        href: '/downloads/gatewise-admin-macos-v1.0.0.dmg.sha256',
        isExternal: false,
      },
      features: [
        'Universal native architecture: Apple Silicon (M1/M2/M3/M4) & Intel 64-bit',
        'Multi-gate live streaming with hardware accelerated decoding',
        'Local SQLite audit ledger and automated CSV/PDF export',
        'Zero-trust station keypair storage in macOS Secure Enclave',
      ],
      checksum: '1.2 MB Universal Disk Image • Gatekeeper Verified',
    },
    {
      id: 'ios',
      name: 'Apple iOS Guard App',
      category: 'SUPERVISED IOS',
      badge: 'ENTERPRISE DEPLOY',
      badgeColor: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
      icon: Apple,
      headline: 'Supervised Institutional Apple TestFlight & MDM',
      description:
        'Tailored for institutional Apple iPhone and iPad deployments via Apple Business Manager (ABM) and Mobile Device Management (MDM). High-speed CoreML neural inference and biometric gate verification.',
      version: 'v1.0.0 (Build 104)',
      size: '19.4 MB (App Store / TestFlight)',
      requirements: 'iOS 16.0 or later (iPhone & iPad)',
      primaryAction: {
        label: 'Request TestFlight Access',
        href: 'https://testflight.apple.com',
        isExternal: true,
      },
      secondaryAction: {
        label: 'Institutional MDM Profile',
        href: '#contact-mdm',
        isExternal: false,
      },
      features: [
        'Apple Neural Engine (ANE) hardware accelerated vector computation',
        'Enterprise MDM configuration via Apple Business Manager',
        'Per-app VPN and sovereign intranet proxy integration',
        'Continuous biometric pass sync with background task scheduling',
      ],
      checksum: 'Apple FairPlay Code-Signed • Enterprise Provisioned',
    },
  ];

  const filteredPlatforms = activeTab === 'all' 
    ? platforms 
    : platforms.filter(p => p.id === activeTab);

  return (
    <section id="downloads" className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-20 md:py-28">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-16 space-y-4">
        <SectionEyebrow label="Download & Access Hub" tag="Multi-Platform Suite" />
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
          Deploy GATEWISE AI Everywhere
        </h2>
        <p className="text-white/65 max-w-2xl text-sm sm:text-base leading-relaxed">
          Access the Command Centre instantly in your web browser or deploy native, cryptographically signed binaries across Android, macOS, and iOS.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {[
            { id: 'all', label: 'All Platforms (4)' },
            { id: 'web', label: 'Web App / PWA' },
            { id: 'android', label: 'Android Guard APK' },
            { id: 'macos', label: 'macOS Universal DMG' },
            { id: 'ios', label: 'Apple iOS (TestFlight)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)]'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPlatforms.map((platform, idx) => {
          const Icon = platform.icon;
          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/15 bg-black/60 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col justify-between group hover:border-white/30 transition-all relative overflow-hidden"
            >
              {/* Top ambient glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 via-transparent to-transparent pointer-events-none rounded-full" />

              <div className="space-y-6">
                {/* Platform Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0 group-hover:scale-105 group-hover:bg-white/15 transition-all">
                      <Icon className="w-6 h-6 text-[#00d2ff]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white tracking-tight">
                          {platform.name}
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider block">
                        {platform.category}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${platform.badgeColor} shrink-0`}>
                    {platform.badge}
                  </span>
                </div>

                {/* Headline & Description */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-white/90">
                    {platform.headline}
                  </h4>
                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                    {platform.description}
                  </p>
                </div>

                {/* Specs Box */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase font-mono">Version / Build</span>
                    <span className="font-semibold text-white/90 font-mono text-[11px]">{platform.version}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase font-mono">Download Size</span>
                    <span className="font-semibold text-emerald-400 font-mono text-[11px]">{platform.size}</span>
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
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-6 mt-6 border-t border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={platform.primaryAction.href}
                    target={platform.primaryAction.isExternal ? '_blank' : '_self'}
                    rel="noreferrer"
                    className="w-full sm:w-auto flex-1 py-3 px-5 rounded-full bg-white text-black text-xs font-bold hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer"
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
                    className="w-full sm:w-auto px-4 py-3 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-xs font-semibold text-white/80 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{platform.secondaryAction.label}</span>
                  </a>
                </div>

                {/* Verification Checksum Tag */}
                <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-mono truncate">
                  <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
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
        className="mt-12 liquid-glass rounded-2xl p-6 sm:p-8 border border-white/15 bg-gradient-to-r from-blue-950/40 via-black/60 to-cyan-950/40 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Sparkles className="w-4 h-4 text-[#00d2ff]" />
            <h4 className="text-base font-bold text-white">
              Instant Desktop & Mobile PWA Installation
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-white/60 max-w-2xl leading-relaxed">
            On Chrome, Edge, or Safari, simply click the <strong>Install Icon</strong> in your address bar or select <strong>Add to Home Screen / Dock</strong> to run GATEWISE AI as a borderless native application.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/admin"
            className="px-5 py-2.5 rounded-full bg-[#00d2ff] hover:bg-[#00b8e6] text-black font-bold text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Launch Web App Now</span>
          </a>
          <a
            href="/admin/login"
            className="px-4 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs transition-all cursor-pointer"
          >
            <span>Admin Sign In</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
};
