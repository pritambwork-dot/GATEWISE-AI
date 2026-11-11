'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  Smartphone, Download, ShieldCheck, CheckCircle2, AlertTriangle,
  Lock, Copy, Check, QrCode, FileText, ArrowRight, ExternalLink,
  Info, RefreshCw, ShieldAlert, Monitor, Apple, Terminal, CheckCircle,
  HelpCircle, ChevronRight, Layers, Sparkles
} from 'lucide-react';

type PlatformKey = 'android' | 'ios' | 'macos';

interface PlatformDetails {
  id: PlatformKey;
  name: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  fileName: string;
  fileSizeBytes: number;
  formattedSize: string;
  version: string;
  downloadUrl: string;
  sha256: string;
  compatibility: string;
  packageId: string;
  releaseDate: string;
  architecture: string;
  description: string;
  installSteps: { step: string; title: string; desc: string }[];
  secondaryActions?: { label: string; href: string; external?: boolean; icon: React.ReactNode }[];
}

const PLATFORMS: Record<PlatformKey, PlatformDetails> = {
  android: {
    id: 'android',
    name: 'Android Guard APK',
    tagline: 'Perimeter Security Post Client',
    badge: 'Production APK',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: <Smartphone className="w-7 h-7 text-emerald-600" />,
    fileName: 'gatewise-guard-v1.0.0-release.apk',
    fileSizeBytes: 906440,
    formattedSize: '885 KB',
    version: '1.0.0',
    downloadUrl: '/downloads/gatewise-guard-v1.0.0-release.apk',
    sha256: 'f397221752236e04de2be91d4ba1b55a2a136a6e77f5022192ca4387ea6d8ddd',
    compatibility: 'Android 8.0 (API 26) through Android 15+',
    packageId: 'com.gatewiseai.guard',
    releaseDate: '2026-11-11',
    architecture: 'Universal ARM64 / ARMv7 / x86_64',
    description: 'On-device guard verification app featuring real-time YuNet edge camera detection, SFace 128-D cosine inference, and cryptographic HMAC-SHA256 non-repudiation ledger.',
    installSteps: [
      {
        step: '01',
        title: 'Download Signed APK',
        desc: 'Tap the download button below directly on your Android phone or ruggedized gate scanner.'
      },
      {
        step: '02',
        title: 'Confirm Browser Prompt',
        desc: 'If Chrome warns "File might be harmful", tap "Download anyway". This is standard Android verification for direct enterprise APK packages.'
      },
      {
        step: '03',
        title: 'Allow Installation Source',
        desc: 'Open the downloaded APK from notifications or your Files app. If prompted, allow "Install unknown apps" for your browser.'
      },
      {
        step: '04',
        title: 'Launch & Authorize Post',
        desc: 'Open GATEWISE Guard, grant camera access for the perimeter HUD, and sign in with your officer PIN credentials.'
      }
    ],
    secondaryActions: [
      {
        label: 'Alternative Mirror (/releases)',
        href: '/releases/gatewise-guard-v1.0.0-release.apk',
        icon: <Download className="w-4 h-4" />
      },
      {
        label: 'Full Field Installation Guide',
        href: '/installation',
        icon: <HelpCircle className="w-4 h-4" />
      }
    ]
  },
  ios: {
    id: 'ios',
    name: 'Apple iOS Guard App',
    tagline: 'Native SwiftUI 6 Security Client',
    badge: 'Native iOS Package',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: <Apple className="w-7 h-7 text-slate-800" />,
    fileName: 'gatewise-guard-ios-v1.0.0.ipa',
    fileSizeBytes: 833683,
    formattedSize: '814 KB',
    version: '1.0.0',
    downloadUrl: '/downloads/gatewise-guard-ios-v1.0.0.ipa',
    sha256: '504c0762bf09722761e01b5bb437d433476c0e31ab5e06ce37bb811b7d1fdf61',
    compatibility: 'iOS 17.0+ (iPhone 11 through 16 Pro Max, iPadOS 17+)',
    packageId: 'com.gatewiseai.guard',
    releaseDate: '2026-11-11',
    architecture: 'Apple Silicon Native (ARM64)',
    description: 'Pure native SwiftUI and Swift 6 application with Liquid Glass styling, strict concurrency isolation, hardware Face ID biometric auth, and offline-first persistence.',
    installSteps: [
      {
        step: '01',
        title: 'Download iOS Package (.ipa)',
        desc: 'Download the standalone .ipa bundle directly to your iPhone, iPad, or Mac workstation.'
      },
      {
        step: '02',
        title: 'Sideload via AltStore / SideStore',
        desc: 'Open in AltStore, SideStore, or Apple Configurator 2, or install via institutional Mobile Device Management (MDM).'
      },
      {
        step: '03',
        title: 'Trust Enterprise Profile',
        desc: 'Go to iPhone Settings -> General -> VPN & Device Management, and tap "Trust GATEWISE AI Institutional Authority".'
      },
      {
        step: '04',
        title: 'Launch with Face ID',
        desc: 'Launch GATEWISE Guard, grant camera permissions, and unlock your gate session using Face ID or PIN.'
      }
    ],
    secondaryActions: [
      {
        label: 'Download Xcode Source Archive (.zip)',
        href: '/downloads/gatewise-guard-ios-source-v1.0.0.zip',
        icon: <FileText className="w-4 h-4" />
      },
      {
        label: 'OTA Enterprise Manifest (.plist)',
        href: '/downloads/gatewise-guard-ios-manifest.plist',
        icon: <Terminal className="w-4 h-4" />
      }
    ]
  },
  macos: {
    id: 'macos',
    name: 'macOS Command Centre DMG',
    tagline: 'Desktop Administration & Telemetry Console',
    badge: 'macOS Universal DMG',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: <Monitor className="w-7 h-7 text-purple-700" />,
    fileName: 'gatewise-admin-macos-v1.0.0.dmg',
    fileSizeBytes: 1296738,
    formattedSize: '1.2 MB',
    version: '1.0.0',
    downloadUrl: '/downloads/gatewise-admin-macos-v1.0.0.dmg',
    sha256: 'f5131c83a00d3ec6c73f4b69119bcf7b09b90dbe0d05ee7401b6a500451429b6',
    compatibility: 'macOS 13.0 Ventura, Sonoma, Sequoia (M1/M2/M3/M4 & Intel)',
    packageId: 'com.gatewiseai.admin',
    releaseDate: '2026-11-11',
    architecture: 'Universal Binary (Apple Silicon & Intel x86_64)',
    description: 'Standalone desktop administration workstation for campus operations directors: live multi-gate telemetry, biometric roster management, and cryptographic log audit.',
    installSteps: [
      {
        step: '01',
        title: 'Download Disk Image (.dmg)',
        desc: 'Click the button below to download the official gatewise-admin-macos-v1.0.0.dmg package.'
      },
      {
        step: '02',
        title: 'Mount & Drag to Applications',
        desc: 'Double-click the .dmg to open the disk image, then drag "GATEWISE AI Command Centre.app" into the Applications folder shortcut.'
      },
      {
        step: '03',
        title: 'macOS Gatekeeper Verification',
        desc: 'On first launch, if prompted: open System Settings -> Privacy & Security, scroll down to Security, and click "Open Anyway".'
      },
      {
        step: '04',
        title: 'Sign In to Campus Console',
        desc: 'Launch the application from Launchpad or Applications and authenticate using your director-level administrator credentials.'
      }
    ],
    secondaryActions: [
      {
        label: 'Alternative Mirror (/releases)',
        href: '/releases/gatewise-admin-macos-v1.0.0.dmg',
        icon: <Download className="w-4 h-4" />
      },
      {
        label: 'Web-Based Admin Portal',
        href: '/admin/login',
        icon: <ExternalLink className="w-4 h-4" />
      }
    ]
  }
};

export default function DownloadPage() {
  const [activePlatform, setActivePlatform] = useState<PlatformKey>('android');
  const [copiedSha, setCopiedSha] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Auto-detect client platform from User-Agent or URL query
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const queryPlatform = params.get('platform')?.toLowerCase();
    if (queryPlatform === 'ios' || queryPlatform === 'ipa') {
      setActivePlatform('ios');
      return;
    }
    if (queryPlatform === 'macos' || queryPlatform === 'mac' || queryPlatform === 'dmg') {
      setActivePlatform('macos');
      return;
    }
    if (queryPlatform === 'android' || queryPlatform === 'apk') {
      setActivePlatform('android');
      return;
    }

    // Auto-detect based on navigator.userAgent
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua)) {
      setActivePlatform('ios');
    } else if (/Android/i.test(ua)) {
      setActivePlatform('android');
    } else if (/Macintosh/i.test(ua)) {
      setActivePlatform('macos');
    }
  }, []);

  // Generate QR code pointing directly to the download file or current view
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentDetails = PLATFORMS[activePlatform];
    const targetUrl = `${window.location.origin}${currentDetails.downloadUrl}`;

    QRCode.toDataURL(targetUrl, {
      width: 240,
      margin: 2,
      color: {
        dark: activePlatform === 'android' ? '#176346' : activePlatform === 'ios' ? '#0f172a' : '#581c87',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [activePlatform]);

  const handleCopySha = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2200);
  };

  const current = PLATFORMS[activePlatform];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 space-y-8 sm:space-y-12">
      
      {/* Header Area */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gatewise-light border border-gatewise-mint text-[11px] font-bold text-gatewise-deep uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-gatewise-primary" />
          <span>Official Institutional Distribution Centre</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gatewise-text tracking-tight leading-tight">
          Download GATEWISE AI
        </h1>
        <p className="text-sm sm:text-base text-gatewise-secondary leading-relaxed">
          Official release downloads for security guards, campus supervisors, and systems administrators across Android, Apple iOS, and macOS platforms.
        </p>
      </div>

      {/* Platform Switcher Pills (Highly Optimized for Touch & Phones) */}
      <div className="bg-black/[0.04] p-1.5 rounded-2xl sm:rounded-full border border-black/[0.06] flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2">
        
        {/* Android Tab */}
        <button
          onClick={() => setActivePlatform('android')}
          className={`flex items-center justify-center space-x-2.5 py-3 sm:py-2.5 px-4 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[48px] ${
            activePlatform === 'android'
              ? 'bg-white text-gatewise-deep shadow-sm border border-black/[0.04]'
              : 'text-gatewise-secondary hover:text-gatewise-text hover:bg-white/50'
          }`}
        >
          <Smartphone className={`w-4 h-4 ${activePlatform === 'android' ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span>Android (APK)</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-normal">
            v1.0.0
          </span>
        </button>

        {/* iOS Tab */}
        <button
          onClick={() => setActivePlatform('ios')}
          className={`flex items-center justify-center space-x-2.5 py-3 sm:py-2.5 px-4 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[48px] ${
            activePlatform === 'ios'
              ? 'bg-white text-gatewise-deep shadow-sm border border-black/[0.04]'
              : 'text-gatewise-secondary hover:text-gatewise-text hover:bg-white/50'
          }`}
        >
          <Apple className={`w-4 h-4 ${activePlatform === 'ios' ? 'text-slate-900' : 'text-slate-400'}`} />
          <span>Apple iOS (IPA)</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-mono font-normal">
            iOS 17+
          </span>
        </button>

        {/* macOS Tab */}
        <button
          onClick={() => setActivePlatform('macos')}
          className={`flex items-center justify-center space-x-2.5 py-3 sm:py-2.5 px-4 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[48px] ${
            activePlatform === 'macos'
              ? 'bg-white text-gatewise-deep shadow-sm border border-black/[0.04]'
              : 'text-gatewise-secondary hover:text-gatewise-text hover:bg-white/50'
          }`}
        >
          <Monitor className={`w-4 h-4 ${activePlatform === 'macos' ? 'text-purple-600' : 'text-slate-400'}`} />
          <span>macOS Desktop (DMG)</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-mono font-normal">
            Universal
          </span>
        </button>
      </div>

      {/* Main Release Card & QR Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Column: Release Details & Download Action */}
        <div className="lg:col-span-8 p-5 sm:p-8 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-6">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gatewise-border">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gatewise-light to-gatewise-mint/40 border border-gatewise-mint text-gatewise-primary flex items-center justify-center font-bold shadow-xs shrink-0">
                {current.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-gatewise-text tracking-tight">
                    {current.name}
                  </h2>
                </div>
                <p className="text-xs text-gatewise-secondary font-medium mt-0.5">
                  {current.tagline} • <span className="font-mono">{current.packageId}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${current.badgeColor}`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Verified Release Published</span>
              </span>
            </div>
          </div>

          {/* Key Specifications Grid (Mobile Responsive) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
              <div className="text-[10px] font-semibold text-gatewise-secondary uppercase">Version</div>
              <div className="font-black text-gatewise-text font-mono text-sm sm:text-base">v{current.version}</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
              <div className="text-[10px] font-semibold text-gatewise-secondary uppercase">Package Size</div>
              <div className="font-black text-gatewise-text font-mono text-sm sm:text-base">{current.formattedSize}</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
              <div className="text-[10px] font-semibold text-gatewise-secondary uppercase">Architecture</div>
              <div className="font-black text-gatewise-text font-mono text-xs truncate" title={current.architecture}>
                {current.architecture.split(' ')[0]}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
              <div className="text-[10px] font-semibold text-gatewise-secondary uppercase">Release Date</div>
              <div className="font-black text-gatewise-text font-mono text-xs">{current.releaseDate}</div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gatewise-secondary leading-relaxed">
            {current.description}
          </p>

          {/* Primary Download CTA Button (Large Touch Target) */}
          <div className="pt-2 space-y-3">
            <a
              href={current.downloadUrl}
              download={current.fileName}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gatewise-primary text-white text-sm sm:text-base font-bold hover:bg-gatewise-deep active:scale-[0.98] transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center space-x-2.5 min-h-[52px]"
            >
              <Download className="w-5 h-5" />
              <span>Download {current.fileName.split('.').pop()?.toUpperCase()} ({current.formattedSize})</span>
            </a>

            <div className="text-[11px] text-gatewise-secondary flex items-center space-x-1.5 pt-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Direct cryptographic download hosted on official campus repository CDN.</span>
            </div>
          </div>

          {/* Secondary Actions Strip */}
          {current.secondaryActions && (
            <div className="flex flex-wrap gap-2.5 pt-2">
              {current.secondaryActions.map((act, idx) => (
                <a
                  key={idx}
                  href={act.href}
                  target={act.external ? '_blank' : undefined}
                  rel={act.external ? 'noopener noreferrer' : undefined}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-gatewise-text text-xs font-semibold inline-flex items-center space-x-2 transition-colors min-h-[40px]"
                >
                  {act.icon}
                  <span>{act.label}</span>
                </a>
              ))}
            </div>
          )}

          {/* Cryptographic SHA-256 Digest Verification Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>SHA-256 Cryptographic Checksum</span>
              </span>
              <button
                onClick={() => handleCopySha(current.sha256)}
                className="inline-flex items-center space-x-1 text-[11px] font-bold text-gatewise-primary hover:text-gatewise-deep px-2 py-1 rounded-lg hover:bg-gatewise-light transition-colors cursor-pointer"
              >
                {copiedSha ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Hash</span>
                  </>
                )}
              </button>
            </div>
            <div className="font-mono text-[11px] text-slate-800 break-all bg-white p-2.5 rounded-xl border border-slate-200 select-all leading-relaxed">
              {current.sha256}
            </div>
            <p className="text-[10px] text-slate-500">
              Verify before sideloading via: <code className="bg-slate-100 px-1 py-0.5 rounded">shasum -a 256 {current.fileName}</code>
            </p>
          </div>

          {/* Installation Walkthrough Steps for this Platform */}
          <div className="pt-4 border-t border-gatewise-border space-y-4">
            <h3 className="font-bold text-sm text-gatewise-text flex items-center space-x-2">
              <FileText className="w-4 h-4 text-gatewise-primary" />
              <span>Step-by-Step Installation ({current.name})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {current.installSteps.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white border border-gatewise-border space-y-1.5 hover:border-gatewise-primary/40 transition-colors">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-gatewise-light text-gatewise-deep text-[10px] font-mono font-bold flex items-center justify-center border border-gatewise-mint">
                      {s.step}
                    </span>
                    <h4 className="text-xs font-bold text-gatewise-text">{s.title}</h4>
                  </div>
                  <p className="text-[11px] text-gatewise-secondary leading-relaxed pl-7">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic QR Code & Institutional Safety */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* QR Code Container */}
          <div className="p-6 rounded-3xl bg-white border border-gatewise-border shadow-xs text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-xs font-bold text-gatewise-text">
              <QrCode className="w-4 h-4 text-gatewise-primary" />
              <span>Scan to Download on {activePlatform === 'macos' ? 'Mac' : 'Phone'}</span>
            </div>

            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border border-gatewise-border flex items-center justify-center shadow-2xs">
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt={`${current.name} Download QR Code`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-xs text-gatewise-secondary animate-pulse">Generating QR...</div>
              )}
            </div>

            <p className="text-[11px] text-gatewise-secondary leading-relaxed">
              Scan with your {activePlatform === 'ios' ? 'iPhone Camera' : activePlatform === 'android' ? 'Android Camera' : 'Mobile Device'} to initiate immediate download directly on your phone browser.
            </p>
          </div>

          {/* Institutional Access Security Card */}
          <div className="p-6 rounded-3xl bg-gatewise-light/40 border border-gatewise-mint space-y-3.5 text-xs">
            <div className="flex items-center space-x-2 text-gatewise-deep font-bold">
              <Lock className="w-4 h-4 text-gatewise-primary" />
              <span>Sovereign Security Boundary</span>
            </div>
            <p className="text-gatewise-secondary leading-relaxed text-[11px]">
              Downloading and installing the client application does not grant perimeter access. An authenticated officer badge or administrator credentials provisioned by campus IT are required.
            </p>

            <div className="pt-2 border-t border-gatewise-border space-y-2">
              <div className="flex items-center space-x-2 text-[11px] text-gatewise-deep font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-gatewise-primary" />
                <span>DPDP Act (2023) Compliance Certified</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-gatewise-deep font-semibold">
                <Check className="w-3.5 h-3.5 text-gatewise-primary" />
                <span>Zero raw biometric photos saved on device</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gatewise-border">
              <Link
                href="/security"
                className="text-xs font-bold text-gatewise-primary hover:text-gatewise-deep flex items-center space-x-1"
              >
                <span>Read Cryptographic Security Architecture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Platform Switcher for Phone Footprint */}
          <div className="p-4 rounded-2xl bg-white border border-gatewise-border space-y-2 text-xs">
            <div className="text-[11px] font-bold text-gatewise-text uppercase tracking-wider">
              Other Platforms
            </div>
            <div className="space-y-1.5">
              {Object.keys(PLATFORMS).filter((k) => k !== activePlatform).map((k) => {
                const p = PLATFORMS[k as PlatformKey];
                return (
                  <button
                    key={k}
                    onClick={() => setActivePlatform(k as PlatformKey)}
                    className="w-full p-2.5 rounded-xl border border-gatewise-border hover:bg-slate-50 transition-colors flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      {p.id === 'android' && <Smartphone className="w-4 h-4 text-emerald-600" />}
                      {p.id === 'ios' && <Apple className="w-4 h-4 text-slate-800" />}
                      {p.id === 'macos' && <Monitor className="w-4 h-4 text-purple-600" />}
                      <span className="font-semibold text-gatewise-text text-xs">{p.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gatewise-muted" />
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
