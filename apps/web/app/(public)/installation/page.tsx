'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Smartphone, Download, ShieldCheck, CheckCircle2, AlertTriangle,
  ArrowRight, HelpCircle, Lock, Camera, Check, ChevronDown,
  Apple, Monitor, Terminal, FileText
} from 'lucide-react';

type GuidePlatform = 'android' | 'ios' | 'macos';

export default function InstallationGuidePage() {
  const [activeTab, setActiveTab] = useState<GuidePlatform>('android');

  const androidSteps = [
    {
      num: '01',
      title: 'Open Official Download Hub',
      desc: 'On your Android device browser (Chrome, Samsung Internet, or Firefox), navigate to /download and select the Android (APK) tab.',
    },
    {
      num: '02',
      title: 'Download Signed APK',
      desc: 'Tap "Download APK (885 KB)". If Chrome warns "File might be harmful", tap "Download anyway". This is standard Android verification for direct enterprise APK packages.',
    },
    {
      num: '03',
      title: 'Open Downloaded Installer',
      desc: 'Swipe down your notification shade and tap the completed download notification, or locate gatewise-guard-v1.0.0-release.apk in your Files app under Downloads.',
    },
    {
      num: '04',
      title: 'Enable "Install Unknown Apps" for Browser',
      desc: 'If Android prompts "For your security, your phone is not allowed to install unknown apps from this source", tap Settings and toggle "Allow from this source" for your browser only.',
    },
    {
      num: '05',
      title: 'Confirm Installation',
      desc: 'Tap Install on the package installer dialogue and allow Android Package Installer to complete installation.',
    },
    {
      num: '06',
      title: 'Grant Camera Permission',
      desc: 'Open GATEWISE Guard and select "While using the app" for camera permissions to enable real-time 5-point YuNet facial HUD verification.',
    },
    {
      num: '07',
      title: 'Sign In with Officer Credentials',
      desc: 'Enter your assigned Security Officer ID (e.g. SEC-G014) and institutional PIN. Your station post and daily shift permissions will be locked and verified.',
    },
  ];

  const iosSteps = [
    {
      num: '01',
      title: 'Choose Installation Method',
      desc: 'Open /download on your iPhone or iPad. You can install via TestFlight Public Beta, Sideloading (AltStore / SideStore), or Enterprise MDM.',
    },
    {
      num: '02',
      title: 'Option A: Apple TestFlight (Recommended)',
      desc: 'Tap "Open TestFlight Beta" from the download centre. Tap "Accept" in the TestFlight app, then tap "Install" to download GATEWISE Guard directly to your home screen.',
    },
    {
      num: '03',
      title: 'Option B: Sideloading (.ipa Package)',
      desc: 'Download gatewise-guard-ios-v1.0.0.ipa (814 KB). Open your preferred sideload tool (AltStore, SideStore, or Apple Configurator 2) and select the downloaded IPA to sign and install.',
    },
    {
      num: '04',
      title: 'Option C: Enterprise Mobile Device Management',
      desc: 'Campus IT administrators can distribute GATEWISE Guard via Apple Business Manager, Jamf, or Microsoft Intune using the Over-The-Air manifest.plist.',
    },
    {
      num: '05',
      title: 'Trust Enterprise Profile (If Sideloading)',
      desc: 'Go to iPhone Settings -> General -> VPN & Device Management. Tap your developer or institutional certificate and tap "Trust".',
    },
    {
      num: '06',
      title: 'Launch & Enable Face ID',
      desc: 'Launch GATEWISE Guard, authorize Camera access for the perimeter reticle, and enable Face ID for seamless biometric session unlocks.',
    },
  ];

  const macosSteps = [
    {
      num: '01',
      title: 'Download Desktop Disk Image (.dmg)',
      desc: 'Navigate to /download, select the macOS (DMG) tab, and click "Download macOS DMG Installer (1.2 MB)".',
    },
    {
      num: '02',
      title: 'Mount the DMG File',
      desc: 'Double-click gatewise-admin-macos-v1.0.0.dmg in your Downloads folder to mount the disk image volume.',
    },
    {
      num: '03',
      title: 'Drag to Applications',
      desc: 'Drag the "GATEWISE AI Command Centre.app" icon into the Applications folder shortcut provided in the window.',
    },
    {
      num: '04',
      title: 'Launch the Application',
      desc: 'Open Launchpad or Applications and click "GATEWISE AI Command Centre" to run.',
    },
    {
      num: '05',
      title: 'macOS Gatekeeper Verification (First Launch)',
      desc: 'If macOS displays an unidentified developer prompt: open System Settings -> Privacy & Security -> Security section, and click "Open Anyway".',
    },
    {
      num: '06',
      title: 'Sign In to Campus Administration',
      desc: 'Authenticate using your administrator credentials or WebAuthn hardware security key to access live perimeter telemetry.',
    },
  ];

  const activeSteps = activeTab === 'android' ? androidSteps : activeTab === 'ios' ? iosSteps : macosSteps;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 space-y-8 sm:space-y-12">
      
      {/* Header */}
      <div className="space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gatewise-primary bg-gatewise-light px-3 py-1 rounded-full border border-gatewise-mint">
          Field Operations Documentation
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gatewise-text tracking-tight">
          Installation &amp; Deployment Guides
        </h1>
        <p className="text-sm sm:text-base text-gatewise-secondary leading-relaxed">
          Step-by-step instructions for installing and provisioning GATEWISE AI across Android smartphones, Apple iOS devices, and macOS administration consoles.
        </p>
      </div>

      {/* Platform Switcher */}
      <div className="bg-black/[0.04] p-1.5 rounded-2xl border border-black/[0.06] flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => setActiveTab('android')}
          className={`flex items-center justify-center space-x-2 py-3 sm:py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] ${
            activeTab === 'android'
              ? 'bg-white text-gatewise-deep shadow-xs'
              : 'text-gatewise-secondary hover:text-gatewise-text'
          }`}
        >
          <Smartphone className={`w-4 h-4 ${activeTab === 'android' ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span>Android (APK)</span>
        </button>

        <button
          onClick={() => setActiveTab('ios')}
          className={`flex items-center justify-center space-x-2 py-3 sm:py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] ${
            activeTab === 'ios'
              ? 'bg-white text-gatewise-deep shadow-xs'
              : 'text-gatewise-secondary hover:text-gatewise-text'
          }`}
        >
          <Apple className={`w-4 h-4 ${activeTab === 'ios' ? 'text-slate-900' : 'text-slate-400'}`} />
          <span>Apple iOS (IPA / TestFlight)</span>
        </button>

        <button
          onClick={() => setActiveTab('macos')}
          className={`flex items-center justify-center space-x-2 py-3 sm:py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] ${
            activeTab === 'macos'
              ? 'bg-white text-gatewise-deep shadow-xs'
              : 'text-gatewise-secondary hover:text-gatewise-text'
          }`}
        >
          <Monitor className={`w-4 h-4 ${activeTab === 'macos' ? 'text-purple-600' : 'text-slate-400'}`} />
          <span>macOS Desktop (DMG)</span>
        </button>
      </div>

      {/* Critical Security Warning Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gatewise-light/40 border border-gatewise-mint space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-gatewise-deep font-bold">
          <Lock className="w-4 h-4 text-gatewise-primary" />
          <span>Institutional Boundary Requirement</span>
        </div>
        <p className="text-gatewise-secondary leading-relaxed">
          Installing GATEWISE AI does not grant institutional gate authority. Security personnel and administrators must be provisioned by a campus IT administrator and assigned to an active checkpoint before verification operations can commence.
        </p>
      </div>

      {/* Steps List */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-gatewise-text">
          {activeTab === 'android' && 'Android APK Installation Walkthrough'}
          {activeTab === 'ios' && 'Apple iOS Installation & Provisioning Walkthrough'}
          {activeTab === 'macos' && 'macOS Command Centre DMG Installation Walkthrough'}
        </h2>

        <div className="space-y-3.5">
          {activeSteps.map((s, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-gatewise-border shadow-xs flex items-start space-x-4"
            >
              <span className="font-mono text-xs sm:text-sm font-black text-gatewise-primary bg-gatewise-light px-3 py-1.5 rounded-xl border border-gatewise-mint shrink-0">
                {s.num}
              </span>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-gatewise-text">{s.title}</h3>
                <p className="text-xs text-gatewise-secondary leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Troubleshooting Section */}
      <div className="space-y-6 pt-6 border-t border-gatewise-border">
        <h2 className="text-xl font-black text-gatewise-text flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-gatewise-primary" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-4 text-xs">
          <div className="p-5 rounded-2xl bg-white border border-gatewise-border space-y-2">
            <h4 className="font-bold text-gatewise-text">
              How do I verify the integrity of my downloaded package?
            </h4>
            <p className="text-gatewise-secondary leading-relaxed">
              Every official release has its SHA-256 checksum published on the download page. You can verify your binary in terminal using: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">shasum -a 256 &lt;filename&gt;</code>.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gatewise-border space-y-2">
            <h4 className="font-bold text-gatewise-text">
              Does GATEWISE AI run in the background when not in use?
            </h4>
            <p className="text-gatewise-secondary leading-relaxed">
              No. GATEWISE Guard strictly operates in manual single-shot mode. The camera is only active while the viewfinder is visible during an active verification scan.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gatewise-border space-y-2">
            <h4 className="font-bold text-gatewise-text">
              Can unauthorized users access gate controls?
            </h4>
            <p className="text-gatewise-secondary leading-relaxed">
              No. The application requires an authenticated session signed by the central institutional authority. Every decision is cryptographically sealed with HMAC-SHA256 non-repudiation.
            </p>
          </div>
        </div>
      </div>

      {/* Download Action Footer */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gatewise-border shadow-xs text-center space-y-4">
        <h3 className="font-black text-lg text-gatewise-text">Ready to Download?</h3>
        <p className="text-xs text-gatewise-secondary max-w-md mx-auto">
          Visit the official distribution centre to download the verified APK, iOS package, or macOS DMG.
        </p>
        <Link
          href="/download"
          className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-gatewise-primary text-white text-xs sm:text-sm font-bold hover:bg-gatewise-deep transition-all shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Open Download Centre</span>
        </Link>
      </div>
    </div>
  );
}
