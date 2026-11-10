'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  Smartphone, Download, ShieldCheck, CheckCircle2, AlertTriangle,
  Lock, Copy, Check, QrCode, FileText, ArrowRight, ExternalLink,
  Info, RefreshCw, ShieldAlert
} from 'lucide-react';

interface ReleaseMetadata {
  application: string;
  platform: string;
  release_channel: string;
  published: boolean;
  version_name: string | null;
  version_code: number | null;
  minimum_android_version: string | null;
  file_name: string | null;
  file_size_bytes: number | null;
  download_url: string | null;
  sha256: string | null;
  release_date: string | null;
  release_notes: string[];
  package_identifier: string;
  verification_status: string;
}

export default function DownloadPage() {
  const [release, setRelease] = useState<ReleaseMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedSha, setCopiedSha] = useState(false);

  useEffect(() => {
    // 1. Fetch official release metadata
    fetch('/releases/android-release.json')
      .then((res) => {
        if (!res.ok) throw new Error('Release metadata unavailable');
        return res.json();
      })
      .then((data: ReleaseMetadata) => {
        setRelease(data);
      })
      .catch((err) => {
        console.error('Failed to load release metadata:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // 2. Generate QR code for mobile device scanning pointing to this download page
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      QRCode.toDataURL(currentUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#176346',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, []);

  const handleCopySha = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  const isDownloadReady = release && release.published && !!release.download_url && !!release.sha256;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-2xl space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gatewise-primary bg-gatewise-light px-3 py-1 rounded-full border border-gatewise-mint">
          Official Release Centre
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gatewise-text tracking-tight">
          Download GATEWISE AI for Android
        </h1>
        <p className="text-sm text-gatewise-secondary leading-relaxed">
          Official institutional release of the GATEWISE Guard mobile application for authorized security personnel and gate operators.
        </p>
      </div>

      {/* Main Release Card & QR Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Release Details & Download Action */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gatewise-border">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gatewise-primary text-white flex items-center justify-center font-bold shadow-xs">
                <Smartphone className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gatewise-text">GATEWISE Guard</h2>
                <p className="text-xs text-gatewise-secondary font-mono mt-0.5">
                  Package: {release?.package_identifier || 'com.gatewiseai.guard'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  isDownloadReady
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isDownloadReady ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                <span>{isDownloadReady ? 'Official Release Published' : 'Release Pipeline Verification Pending'}</span>
              </span>
            </div>
          </div>

          {/* Release Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-background-secondary/60 border border-gatewise-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gatewise-secondary block">
                Release Version
              </span>
              <span className="font-mono font-bold text-gatewise-text text-sm mt-1 block">
                v{release?.version_name || '1.0.0'} (Build {release?.version_code || 1})
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-background-secondary/60 border border-gatewise-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gatewise-secondary block">
                Distribution Channel
              </span>
              <span className="font-mono font-bold text-gatewise-text text-sm mt-1 block uppercase">
                {release?.release_channel || 'production'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-background-secondary/60 border border-gatewise-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gatewise-secondary block">
                Compatibility
              </span>
              <span className="font-medium text-gatewise-text text-xs mt-1 block">
                {release?.minimum_android_version || 'Android 8.0+'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-background-secondary/60 border border-gatewise-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gatewise-secondary block">
                APK File Size
              </span>
              <span className="font-mono font-bold text-gatewise-text text-sm mt-1 block">
                {release?.file_size_bytes
                  ? `${(release.file_size_bytes / (1024 * 1024)).toFixed(1)} MB`
                  : 'Pending EAS Build'}
              </span>
            </div>
          </div>

          {/* Cryptographic SHA-256 Checksum Container */}
          <div className="p-4 rounded-2xl bg-background-secondary border border-gatewise-border space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gatewise-text flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-gatewise-primary" />
                <span>Cryptographic SHA-256 Binary Seal</span>
              </span>
              {release?.sha256 && (
                <button
                  onClick={() => handleCopySha(release.sha256!)}
                  className="flex items-center space-x-1 text-[11px] font-bold text-gatewise-primary hover:text-gatewise-deep"
                >
                  {copiedSha ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSha ? 'Copied' : 'Copy Checksum'}</span>
                </button>
              )}
            </div>

            <p className="font-mono text-[11px] text-gatewise-secondary break-all bg-white p-2.5 rounded-xl border border-gatewise-border">
              {release?.sha256 || 'SHA-256 checksum will be generated and signed upon final EAS binary publication.'}
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 space-y-3">
            {isDownloadReady ? (
              <a
                href={release?.download_url || '#'}
                download={release?.file_name || 'gatewise-guard-v1.0.0.apk'}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gatewise-primary text-white text-xs sm:text-sm font-bold hover:bg-gatewise-deep transition-all shadow-sm inline-flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Signed APK (v{release?.version_name})</span>
              </a>
            ) : (
              <div className="space-y-2">
                <button
                  disabled
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gray-200 text-gray-500 text-xs sm:text-sm font-bold cursor-not-allowed inline-flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download APK (Release Pending Verification)</span>
                </button>
                <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Publication Notice:</strong> The official Android production APK is undergoing security verification and EAS build certification. Sideloading development or unverified binaries is prohibited under institutional policy.
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Release Notes */}
          <div className="pt-4 border-t border-gatewise-border space-y-3">
            <h3 className="font-bold text-sm text-gatewise-text flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-gatewise-primary" />
              <span>Release Notes · v{release?.version_name || '1.0.0'}</span>
            </h3>
            <ul className="space-y-2 text-xs text-gatewise-secondary">
              {(release?.release_notes || []).map((note, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gatewise-primary shrink-0 mt-0.5" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: QR Code & Security Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* QR Code Container */}
          <div className="p-6 rounded-3xl bg-white border border-gatewise-border shadow-xs text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-xs font-bold text-gatewise-text">
              <QrCode className="w-4 h-4 text-gatewise-primary" />
              <span>Scan to Open on Android Device</span>
            </div>

            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border border-gatewise-border flex items-center justify-center shadow-2xs">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="Download Page QR Code" className="w-full h-full object-contain" />
              ) : (
                <div className="text-xs text-gatewise-secondary animate-pulse">Generating QR...</div>
              )}
            </div>

            <p className="text-[11px] text-gatewise-secondary leading-relaxed">
              Scan with your Android smartphone camera to open this official release page directly on your mobile browser.
            </p>
          </div>

          {/* Institutional Access Notice */}
          <div className="p-6 rounded-3xl bg-gatewise-light/40 border border-gatewise-mint space-y-3 text-xs">
            <div className="flex items-center space-x-2 text-gatewise-deep font-bold">
              <Lock className="w-4 h-4 text-gatewise-primary" />
              <span>Institutional Access Boundary</span>
            </div>
            <p className="text-gatewise-secondary leading-relaxed">
              Downloading and installing the GATEWISE Guard APK does not grant institutional gate access. An authenticated officer account and assigned perimeter checkpoint are required to perform verifications.
            </p>
            <div className="pt-2 border-t border-gatewise-border">
              <Link
                href="/installation"
                className="text-xs font-bold text-gatewise-primary hover:text-gatewise-deep flex items-center space-x-1"
              >
                <span>Read Step-by-Step Installation Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
