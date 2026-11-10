'use client';

import React from 'react';
import Link from 'next/link';
import {
  HelpCircle, ShieldAlert, LifeBuoy, Terminal, FileCode,
  ArrowRight, BookOpen, AlertTriangle, Lock
} from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gatewise-primary bg-gatewise-light px-3 py-1 rounded-full border border-gatewise-mint">
          Institutional Assistance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gatewise-text tracking-tight">
          Technical Support &amp; Field Operations
        </h1>
        <p className="text-sm text-gatewise-secondary leading-relaxed">
          Operational resources, deployment assistance, and emergency fallback protocols for campus gate administrators and IT staff.
        </p>
      </div>

      {/* Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-gatewise-light text-gatewise-primary flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-gatewise-text">Installation &amp; Sideloading</h3>
          <p className="text-xs text-gatewise-secondary leading-relaxed">
            Detailed instructions on deploying the GATEWISE Guard APK onto Android devices, granting scoped camera permissions, and initial sign-in.
          </p>
          <div className="pt-2">
            <Link
              href="/installation"
              className="text-xs font-bold text-gatewise-primary hover:text-gatewise-deep flex items-center space-x-1"
            >
              <span>View Installation Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-gatewise-light text-gatewise-primary flex items-center justify-center font-bold">
            <Terminal className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-gatewise-text">Administrator Command Centre</h3>
          <p className="text-xs text-gatewise-secondary leading-relaxed">
            Central management for campus gates, guard shift dispatching, Google Drive synchronization triggers, and audit log inspection.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/login"
              className="text-xs font-bold text-gatewise-primary hover:text-gatewise-deep flex items-center space-x-1"
            >
              <span>Admin Portal Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Emergency Fallback Protocol */}
      <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-3 text-xs">
        <div className="flex items-center space-x-2 text-amber-800 font-bold">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Perimeter Emergency Fallback Protocol</span>
        </div>
        <p className="text-amber-900 leading-relaxed">
          In the event of total campus electrical outage, loss of internet connectivity, or server downtime, checkpoint officers must switch to the Standard Physical Protocol: inspect government/institutional photo ID cards manually and record entries in the physical campus backup register. Human discretion remains sovereign at all times.
        </p>
      </div>

      {/* Internal Documentation Reference */}
      <div className="p-6 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-3 text-xs">
        <h3 className="font-bold text-sm text-gatewise-text">Local Documentation Architecture</h3>
        <p className="text-gatewise-secondary leading-relaxed">
          System administrators and DevOps engineers can consult the internal technical documentation stored within the codebase repository:
        </p>
        <div className="p-3 rounded-xl bg-background-secondary border border-gatewise-border font-mono text-[11px] space-y-1 text-gatewise-text">
          <div>• <code>docs/android/APK_INSTALLATION_GUIDE.md</code></div>
          <div>• <code>docs/android/APK_RELEASE_PROCESS.md</code></div>
          <div>• <code>docs/web/ADMIN_PORTAL_IMPLEMENTATION.md</code></div>
          <div>• <code>docs/backend/BACKEND_IMPLEMENTATION.md</code></div>
        </div>
      </div>
    </div>
  );
}
