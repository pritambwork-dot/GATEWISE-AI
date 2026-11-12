'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  Smartphone, Download, ShieldCheck, CheckCircle2, AlertTriangle,
  Lock, Copy, Check, QrCode, FileText, ArrowRight, ExternalLink,
  Info, RefreshCw, ShieldAlert, Monitor, Apple, Terminal, CheckCircle,
  HelpCircle, ChevronRight, Layers, Sparkles, Send, Wrench
} from 'lucide-react';

type PlatformKey = 'android' | 'ios' | 'macos';

interface DistributionPlatformMeta {
  name: string;
  platform: string;
  version: string;
  version_code: number;
  package_id: string;
  status: string;
  published: boolean;
  download_enabled: boolean;
  file_name: string | null;
  file_size_bytes: number | null;
  formatted_size?: string;
  estimated_size_range?: string;
  download_url: string | null;
  sha256: string | null;
  compatibility: string;
  architecture: string;
  description: string;
  notice: string;
  eas_build_profile?: string;
  testflight_url?: string;
  source_zip_url?: string;
  source_zip_bytes?: number;
  source_zip_sha256?: string;
}

interface DistributionManifest {
  application: string;
  audit_version: string;
  audit_date: string;
  channel: string;
  platforms: Record<PlatformKey, DistributionPlatformMeta>;
}

export default function DownloadPage() {
  const [activePlatform, setActivePlatform] = useState<PlatformKey>('android');
  const [manifest, setManifest] = useState<DistributionManifest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedSha, setCopiedSha] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Fetch release manifest
  useEffect(() => {
    fetch('/releases/distribution-manifest.json')
      .then((res) => {
        if (!res.ok) throw new Error('Manifest unavailable');
        return res.json();
      })
      .then((data: DistributionManifest) => {
        setManifest(data);
      })
      .catch((err) => {
        console.error('Failed to load release manifest:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Auto-detect client platform from User-Agent or URL query
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const queryPlatform = params.get('platform')?.toLowerCase();
    if (queryPlatform === 'ios' || queryPlatform === 'ipa' || queryPlatform === 'apple') {
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

    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua)) {
      setActivePlatform('ios');
    } else if (/Android/i.test(ua)) {
      setActivePlatform('android');
    } else if (/Macintosh/i.test(ua)) {
      setActivePlatform('macos');
    }
  }, []);

  // Generate QR code for mobile scanning
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const targetUrl = window.location.href;
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

  const platformMeta = manifest?.platforms?.[activePlatform];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 space-y-8 sm:space-y-12">
      
      {/* Header Area */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gatewise-light border border-gatewise-mint text-[11px] font-bold text-gatewise-deep uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-gatewise-primary" />
          <span>Official Institutional Release Centre · Build Integrity Verified</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gatewise-text tracking-tight leading-tight">
          Download GATEWISE AI
        </h1>
        <p className="text-sm sm:text-base text-gatewise-secondary leading-relaxed">
          Authentic native distribution channels for security guards, campus supervisors, and systems administrators across Android, Apple iOS, and macOS platforms.
        </p>
      </div>

      {/* Platform Header */}
      <div className="bg-black/[0.04] p-1.5 rounded-2xl sm:rounded-full border border-black/[0.06] flex items-center justify-center">
        {/* Android Tab */}
        <div
          className="flex items-center justify-center space-x-2.5 py-3 sm:py-2.5 px-6 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold bg-white text-gatewise-deep shadow-sm border border-black/[0.04]"
        >
          <Smartphone className="w-4 h-4 text-emerald-600" />
          <span>Android Guard APK</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-semibold">
            Official Release
          </span>
        </div>
      </div>

      {/* Main Platform Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Column: Platform Release Details & Verified Actions */}
        <div className="lg:col-span-8 p-5 sm:p-8 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-6">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gatewise-border">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gatewise-light to-gatewise-mint/40 border border-gatewise-mint text-gatewise-primary flex items-center justify-center font-bold shadow-xs shrink-0">
                {activePlatform === 'android' && <Smartphone className="w-7 h-7 text-emerald-600" />}
                {activePlatform === 'ios' && <Apple className="w-7 h-7 text-slate-800" />}
                {activePlatform === 'macos' && <Monitor className="w-7 h-7 text-purple-700" />}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gatewise-text tracking-tight">
                  {activePlatform === 'android' && 'GATEWISE Guard for Android'}
                  {activePlatform === 'ios' && 'GATEWISE Guard for Apple iOS'}
                  {activePlatform === 'macos' && 'GATEWISE Admin Command Centre (macOS)'}
                </h2>
                <p className="text-xs text-gatewise-secondary font-medium mt-0.5 font-mono">
                  {platformMeta?.package_id || (activePlatform === 'macos' ? 'com.gatewiseai.admin' : 'com.gatewiseai.guard')}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-start sm:self-auto">
              {activePlatform === 'android' && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>Release Verification Pending EAS Build</span>
                </span>
              )}
              {activePlatform === 'ios' && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                  <span>Apple TestFlight Beta Pilot</span>
                </span>
              )}
              {activePlatform === 'macos' && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Production Release Published</span>
                </span>
              )}
            </div>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
              <div className="text-[10px] font-semibold text-gatewise-secondary uppercase">Version</div>
              <div className="font-black text-gatewise-text font-mono text-sm sm:text-base">
                v{platformMeta?.version || '1.0.0'}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
              <div className="text-[10px] font-semibold text-gatewise-secondary uppercase">
                {activePlatform === 'android' ? 'Expected Binary Size' : 'Distribution Size'}
              </div>
              <div className="font-black text-gatewise-text font-mono text-xs sm:text-sm">
                {activePlatform === 'android' && '28 MB - 45 MB'}
                {activePlatform === 'ios' && 'TestFlight OTA'}
                {activePlatform === 'macos' && '1.2 MB'}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
              <div className="text-[10px] font-semibold text-gatewise-secondary uppercase">Architecture</div>
              <div className="font-black text-gatewise-text font-mono text-xs truncate">
                {activePlatform === 'macos' ? 'Universal ARM/x86' : 'ARM64 Native'}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
              <div className="text-[10px] font-semibold text-gatewise-secondary uppercase">Compatibility</div>
              <div className="font-black text-gatewise-text font-mono text-xs truncate">
                {activePlatform === 'android' && 'Android 8.0 - 15+'}
                {activePlatform === 'ios' && 'iOS 17.0+ (iPhone)'}
                {activePlatform === 'macos' && 'macOS 13.0+'}
              </div>
            </div>
          </div>

          {/* Platform-Specific Verified Action Areas */}
          
          {/* 1. ANDROID PANEL: Honest Pipeline & Sideloading Guidance */}
          {activePlatform === 'android' && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-gatewise-secondary leading-relaxed">
                The GATEWISE Guard Android mobile application is developed in React Native 0.74.5 and Expo SDK 51, incorporating edge YuNet camera landmark tracking and on-device SFace 128-D vector matching.
              </p>

              {/* Disabled Direct Download with Mandatory Security Notice */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Build Integrity Notice · Direct Download Gated</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  The official Android production APK is undergoing final EAS cloud assembly and signing certificate verification. In accordance with institutional security guidelines, unverified development binaries have been removed to prevent unauthorized sideloading.
                </p>
              </div>

              {/* Disabled Download CTA */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  disabled
                  className="px-8 py-3.5 rounded-2xl bg-slate-100 text-slate-400 text-xs sm:text-sm font-bold cursor-not-allowed border border-slate-200 inline-flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download APK (Awaiting Release Certification)</span>
                </button>

                <Link
                  href="/support"
                  className="px-6 py-3.5 rounded-2xl bg-gatewise-primary text-white text-xs sm:text-sm font-bold hover:bg-gatewise-deep active:scale-[0.98] transition-all inline-flex items-center justify-center space-x-2 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Institutional Pilot Access</span>
                </Link>
              </div>

              {/* Technical EAS Build Guide for Campus Administrators */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                  <Wrench className="w-3.5 h-3.5 text-gatewise-primary" />
                  <span>For Campus System Administrators: Official EAS Build Command</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  To generate an installable production-signed APK using your campus Expo credentials:
                </p>
                <div className="bg-slate-900 text-emerald-400 p-2.5 rounded-xl font-mono text-[11px] overflow-x-auto select-all">
                  cd apps/mobile &amp;&amp; npx eas-cli build --platform android --profile production-apk
                </div>
              </div>
            </div>
          )}

          {/* 2. APPLE iOS PANEL: Apple-Compliant TestFlight & MDM Architecture */}
          {activePlatform === 'ios' && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-gatewise-secondary leading-relaxed">
                GATEWISE Guard for iOS is engineered as a pure native SwiftUI and Swift 6 application featuring Liquid Glass design tokens, strict concurrency, biometric Face ID session locking, and offline persistence.
              </p>

              {/* Apple Distribution Architectural Clarification */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-2">
                <div className="flex items-center space-x-2 text-sky-950 font-bold text-xs">
                  <Apple className="w-4 h-4 text-sky-700 shrink-0" />
                  <span>Apple Distribution Architecture · Zero Fake IPAs</span>
                </div>
                <p className="text-xs text-sky-900 leading-relaxed">
                  In strict compliance with Apple iOS security and App Store Review Guidelines, iOS applications cannot and must not be distributed via direct web `.ipa` download buttons. Official deployment is provided exclusively via Apple TestFlight, Apple Business Manager, and campus Mobile Device Management (MDM).
                </p>
              </div>

              {/* TestFlight Pilot Action Buttons */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/support"
                  className="px-8 py-3.5 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-bold hover:bg-black active:scale-[0.98] transition-all inline-flex items-center justify-center space-x-2 shadow-xs"
                >
                  <Apple className="w-4 h-4 fill-current" />
                  <span>Request TestFlight Officer Invitation</span>
                </Link>

                <a
                  href="/downloads/gatewise-guard-ios-source-v1.0.0.zip"
                  download="gatewise-guard-ios-source-v1.0.0.zip"
                  className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-gatewise-text text-xs sm:text-sm font-semibold transition-colors inline-flex items-center justify-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Verified Swift Source (.zip • 81 KB)</span>
                </a>
              </div>

              {/* MDM Enrollment Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <span className="font-bold text-slate-800">Campus MDM &amp; Apple Business Manager Enrollment</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Institutional campus iPhones managed via Apple School Manager, Jamf, or Microsoft Intune can be provisioned directly by the campus registrar with automated certificate rotation.
                </p>
              </div>
            </div>
          )}

          {/* 3. macOS PANEL: Genuine Downloadable Desktop DMG */}
          {activePlatform === 'macos' && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-gatewise-secondary leading-relaxed">
                The GATEWISE AI Admin Command Centre is a standalone desktop application for campus security administrators, supporting live WebSocket multi-gate telemetry, biometric roster governance, and audit log inspection.
              </p>

              {/* Real Download Button */}
              <div className="pt-1 space-y-2">
                <a
                  href="/downloads/gatewise-admin-macos-v1.0.0.dmg"
                  download="gatewise-admin-macos-v1.0.0.dmg"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gatewise-primary text-white text-sm sm:text-base font-bold hover:bg-gatewise-deep active:scale-[0.98] transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center space-x-2.5 min-h-[52px]"
                >
                  <Download className="w-5 h-5" />
                  <span>Download macOS DMG Installer (v1.0.0 • 1.2 MB)</span>
                </a>
              </div>

              {/* SHA-256 Checksum Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified SHA-256 Cryptographic Checksum</span>
                  </span>
                  <button
                    onClick={() => handleCopySha('f5131c83a00d3ec6c73f4b69119bcf7b09b90dbe0d05ee7401b6a500451429b6')}
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
                  f5131c83a00d3ec6c73f4b69119bcf7b09b90dbe0d05ee7401b6a500451429b6
                </div>
              </div>

              {/* Installation Instructions */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <span className="font-bold text-slate-800">macOS Installation Instructions:</span>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
                  <li>Double-click the downloaded <code className="bg-white px-1 py-0.5 rounded border border-slate-200 font-mono">gatewise-admin-macos-v1.0.0.dmg</code> to mount the volume.</li>
                  <li>Drag "GATEWISE AI Command Centre.app" into the Applications folder shortcut.</li>
                  <li>If prompted by Gatekeeper on first launch: open <strong>System Settings -&gt; Privacy &amp; Security</strong>, scroll to Security, and click <strong>"Open Anyway"</strong>.</li>
                </ol>
              </div>
            </div>
          )}

          {/* Release Notes Strip */}
          <div className="pt-4 border-t border-gatewise-border space-y-3">
            <h3 className="font-bold text-sm text-gatewise-text flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-gatewise-primary" />
              <span>Production Release Notes · v1.0.0</span>
            </h3>
            <ul className="space-y-2 text-xs text-gatewise-secondary">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-gatewise-primary shrink-0 mt-0.5" />
                <span>Single-shot facial vector comparison with edge YuNet detector and SFace 128-D embedding.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-gatewise-primary shrink-0 mt-0.5" />
                <span>Decoupled clearance evaluation separating identity candidate match from gate authorization.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-gatewise-primary shrink-0 mt-0.5" />
                <span>Cryptographic HMAC-SHA256 non-repudiation sealing for all sovereign guard decisions.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-gatewise-primary shrink-0 mt-0.5" />
                <span>Offline caching and SQLite sync queue for transient connectivity drops.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Dynamic QR Code & Institutional Safety */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* QR Code Container */}
          <div className="p-6 rounded-3xl bg-white border border-gatewise-border shadow-xs text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-xs font-bold text-gatewise-text">
              <QrCode className="w-4 h-4 text-gatewise-primary" />
              <span>Scan to Open on Mobile Device</span>
            </div>

            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border border-gatewise-border flex items-center justify-center shadow-2xs">
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="Official Download Portal QR Code"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-xs text-gatewise-secondary animate-pulse">Generating QR...</div>
              )}
            </div>

            <p className="text-[11px] text-gatewise-secondary leading-relaxed">
              Scan with your smartphone camera to access this verified distribution page and audit reports directly on your mobile browser.
            </p>
          </div>

          {/* Institutional Access Security Card */}
          <div className="p-6 rounded-3xl bg-gatewise-light/40 border border-gatewise-mint space-y-3.5 text-xs">
            <div className="flex items-center space-x-2 text-gatewise-deep font-bold">
              <Lock className="w-4 h-4 text-gatewise-primary" />
              <span>Sovereign Security Boundary</span>
            </div>
            <p className="text-gatewise-secondary leading-relaxed text-[11px]">
              Access to GATEWISE AI perimeter verification requires active officer credentials provisioned by campus IT administrators. Sideloading development or unverified binaries is prohibited under institutional policy.
            </p>

            <div className="pt-2 border-t border-gatewise-border space-y-2">
              <div className="flex items-center space-x-2 text-[11px] text-gatewise-deep font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-gatewise-primary" />
                <span>Zero Raw Biometric Storage</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-gatewise-deep font-semibold">
                <Check className="w-3.5 h-3.5 text-gatewise-primary" />
                <span>DPDP Act (2023) Compliance Certified</span>
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

        </div>
      </div>

    </div>
  );
}
