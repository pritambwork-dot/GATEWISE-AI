'use client';

import React from 'react';
import Link from 'next/link';
import {
  Smartphone, Download, ShieldCheck, CheckCircle2, AlertTriangle,
  ArrowRight, HelpCircle, Lock, Camera, Check, ChevronDown
} from 'lucide-react';

export default function InstallationGuidePage() {
  const steps = [
    {
      num: '01',
      title: 'Open the Official Download Page',
      desc: 'On your Android device browser (Chrome, Samsung Internet, or Firefox), navigate to the official GATEWISE AI website download section at /download.',
    },
    {
      num: '02',
      title: 'Download the Official APK File',
      desc: 'Tap the "Download APK" button. Your browser may display a confirmation dialogue noting that the file is an application installer (.apk). Confirm the download.',
    },
    {
      num: '03',
      title: 'Open the Downloaded Installer',
      desc: 'Once the download finishes, swipe down to open your Android notification tray and tap the completed download notification, or locate the file in your device "Files" or "My Files" app under Downloads.',
    },
    {
      num: '04',
      title: 'Allow Installation Source if Prompted',
      desc: 'Modern Android versions (Android 8.0 through 15) enforce scoped package installation. If your device displays "For your security, your phone is not allowed to install unknown apps from this source", tap Settings in the prompt and toggle "Allow from this source" for your browser or file manager only. Do not disable device-wide security.',
    },
    {
      num: '05',
      title: 'Confirm and Install GATEWISE AI',
      desc: 'Review the application installer prompt showing "Do you want to install this app?". Tap Install and allow Android Package Installer to complete the installation.',
    },
    {
      num: '06',
      title: 'Grant Required Camera Permission',
      desc: 'Open the newly installed GATEWISE AI application. When prompted, grant "While using the app" camera access. The camera is required to capture verification frames at perimeter checkpoint terminals.',
    },
    {
      num: '07',
      title: 'Sign In with Institutional Credentials',
      desc: 'Enter your assigned Security Guard Employee ID (e.g. SEC-G014) and institutional password. Your station post and daily shift permissions will be automatically locked and verified.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gatewise-primary bg-gatewise-light px-3 py-1 rounded-full border border-gatewise-mint">
          Field Operations Documentation
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gatewise-text tracking-tight">
          Android Installation &amp; Setup Guide
        </h1>
        <p className="text-sm text-gatewise-secondary leading-relaxed">
          Step-by-step instructions for installing and provisioning the official GATEWISE Guard APK on Android smartphones and ruggedized security terminals.
        </p>
      </div>

      {/* Critical Security Warning Card */}
      <div className="p-6 rounded-3xl bg-gatewise-light/40 border border-gatewise-mint space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-gatewise-deep font-bold">
          <Lock className="w-4 h-4 text-gatewise-primary" />
          <span>Institutional Account Requirement</span>
        </div>
        <p className="text-gatewise-secondary leading-relaxed">
          Installing GATEWISE AI does not grant institutional gate authority. Security personnel must be provisioned by a campus administrator and assigned to an active checkpoint station before verification operations can commence.
        </p>
      </div>

      {/* Steps List */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-gatewise-text">Installation Walkthrough</h2>
        <div className="space-y-4">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-gatewise-border shadow-xs flex items-start space-x-4"
            >
              <span className="font-mono text-sm font-black text-gatewise-primary bg-gatewise-light px-3 py-1.5 rounded-xl border border-gatewise-mint shrink-0">
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
          <span>Installation Troubleshooting &amp; FAQ</span>
        </h2>

        <div className="space-y-4 text-xs">
          <div className="p-5 rounded-2xl bg-white border border-gatewise-border space-y-2">
            <h4 className="font-bold text-gatewise-text">
              What should I do if Android displays "App Not Installed"?
            </h4>
            <p className="text-gatewise-secondary leading-relaxed">
              This usually occurs if an older build with a mismatched signing key is already on the device, or if your phone does not have sufficient internal storage. Uninstall any previous development versions before installing the official production release.
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
              What Android version is required?
            </h4>
            <p className="text-gatewise-secondary leading-relaxed">
              GATEWISE Guard supports Android 8.0 (Oreo / API level 26) through Android 15. Devices require a functional rear-facing camera with autofocus.
            </p>
          </div>
        </div>
      </div>

      {/* Download Action Footer */}
      <div className="p-8 rounded-3xl bg-white border border-gatewise-border shadow-xs text-center space-y-4">
        <h3 className="font-black text-lg text-gatewise-text">Ready to Begin?</h3>
        <p className="text-xs text-gatewise-secondary max-w-md mx-auto">
          Proceed to the official download centre to retrieve the verified APK binary.
        </p>
        <Link
          href="/download"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gatewise-primary text-white text-xs font-bold hover:bg-gatewise-deep transition-all shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Go to Download Page</span>
        </Link>
      </div>
    </div>
  );
}
