'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Settings,
  Hexagon,
  ShieldAlert,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  FileText,
  Sliders,
  Building,
  Key
} from 'lucide-react';

function AdminSettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'institution';
  const [activeMainTab, setActiveMainTab] = useState<'settings' | 'states' | 'help'>(
    initialTab === 'states' ? 'states' : initialTab === 'help' ? 'help' : 'settings'
  );
  const [subTab, setSubTab] = useState<'institution' | 'preferences' | 'security' | 'data' | 'support'>('institution');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'states') {
      setActiveMainTab('states');
    } else if (tabParam === 'help') {
      setActiveMainTab('help');
    } else {
      setActiveMainTab('settings');
    }
  }, [searchParams]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Navigation Switcher between Settings, System States & Help */}
      <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-full shadow-xs text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveMainTab('settings')}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            activeMainTab === 'settings'
              ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
              : 'hover:text-slate-900 text-slate-600'
          }`}
        >
          Settings
        </button>
        <button
          onClick={() => setActiveMainTab('states')}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            activeMainTab === 'states'
              ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
              : 'hover:text-slate-900 text-slate-600'
          }`}
        >
          System States & Dialogs
        </button>
        <button
          onClick={() => setActiveMainTab('help')}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            activeMainTab === 'help'
              ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
              : 'hover:text-slate-900 text-slate-600'
          }`}
        >
          Help & Support
        </button>
      </div>

      {/* VIEW 1: Settings (Page 29) */}
      {activeMainTab === 'settings' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Settings
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
                Confirmed core capability
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Controls appear only where the backend can enforce them.
            </p>
          </div>

          {/* Subtabs (Page 29) */}
          <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-full shadow-xs text-xs font-medium text-slate-600">
            {(['institution', 'preferences', 'security', 'data', 'support'] as const).map((tab) => {
              const labels = {
                institution: 'Institution',
                preferences: 'Preferences',
                security: 'Security',
                data: 'Data management',
                support: 'Support'
              };
              return (
                <button
                  key={tab}
                  onClick={() => setSubTab(tab)}
                  className={`px-4 py-1.5 rounded-full transition-colors ${
                    subTab === tab
                      ? 'bg-[#2F5BFF] text-white shadow-xs font-semibold'
                      : 'hover:text-slate-900 text-slate-600'
                  }`}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>

          {/* 5 Section Cards (Page 29) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Institution details</h3>
              <p className="text-xs text-slate-500">Name, address and identifiers.</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
                Confirmed core capability
              </span>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Departments</h3>
              <p className="text-xs text-slate-500">Departments used across registration.</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
                Confirmed core capability
              </span>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Registration categories</h3>
              <p className="text-xs text-slate-500">Student, faculty, worker, visiting person, vehicle.</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
                Confirmed core capability
              </span>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Access groups</h3>
              <p className="text-xs text-slate-500">Reusable access rules.</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF4E5] text-[#B45309]">
                Backend-dependent
              </span>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Gate configuration</h3>
              <p className="text-xs text-slate-500">Checkpoints and assignments.</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E6F8F6] text-[#0F766E]">
                Hardware-dependent
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: System States & Dialogs (Page 30) */}
      {activeMainTab === 'states' && (
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                System states & dialogs
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
                Confirmed core capability
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              How loading, zero, error, unconfigured and protected states look, plus confirmation dialogs.
            </p>
          </div>

          {/* 6 State Cards (Page 30) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Loading */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Loading</h3>
              <div className="space-y-2.5 animate-pulse">
                <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                <div className="h-4 bg-slate-200 rounded-md w-full" />
              </div>
              <p className="text-xs text-slate-400 pt-2">
                Skeletons only. Distinct from zero, error and unconfigured.
              </p>
            </div>

            {/* 2. Zero state */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Zero state</h3>
              <div className="text-3xl font-bold text-slate-900">0</div>
              <p className="text-xs text-slate-500">
                Shown only after a successful response with no records.
              </p>
            </div>

            {/* 3. Error state */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-rose-600">Error state</h3>
              <p className="text-xs text-slate-600">
                The request failed. Nothing is shown as zero.
              </p>
              <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs">
                Retry
              </button>
            </div>

            {/* 4. Not configured */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-amber-700">Not configured</h3>
              <p className="text-xs text-slate-600">
                The endpoint or integration does not exist yet. The feature is not shown as working.
              </p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-[#FFF4E5] text-[#B45309]">
                Configuration required
              </span>
            </div>

            {/* 5. Role-gated photograph */}
            <div className="bg-[#0B0F19] text-white rounded-2xl p-6 shadow-md space-y-3">
              <h3 className="text-sm font-bold text-slate-200">Role-gated photograph</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Restricted. Your role cannot view biometric images. Access attempts are logged.
              </p>
            </div>

            {/* 6. Session expired */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Session expired</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                For your security you were signed out. Sign in again to continue.
              </p>
            </div>
          </div>

          {/* Confirmation Dialogs Showcase (Page 30 Bottom) */}
          <div className="space-y-4 pt-4">
            <h2 className="text-base font-bold text-slate-900">Confirmation dialogs</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Dialog 1: Replace approved photograph? */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Replace approved photograph?</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    The current approved photograph is retained in the approval history. The new one returns to Pending and is not enrolled until approved.
                  </p>
                </div>
                <div className="space-y-2 pt-2">
                  <button className="w-full py-2 rounded-full text-xs font-semibold bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs">
                    Replace photograph
                  </button>
                  <button className="w-full py-2 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
                    Cancel
                  </button>
                </div>
              </div>

              {/* Dialog 2: Suspend this account? */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Suspend this account?</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    The user is signed out of all sessions and cannot sign in until reinstated. The action is recorded with your name and time.
                  </p>
                </div>
                <div className="space-y-2 pt-2">
                  <button className="w-full py-2 rounded-full text-xs font-semibold bg-[#C93338] text-white hover:bg-[#B3262B] transition-colors shadow-xs">
                    Suspend account
                  </button>
                  <button className="w-full py-2 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
                    Cancel
                  </button>
                </div>
              </div>

              {/* Dialog 3: Change administrator role? */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Change administrator role?</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Permissions change immediately. The previous role is kept in the audit log.
                  </p>
                </div>
                <div className="space-y-2 pt-2">
                  <button className="w-full py-2 rounded-full text-xs font-semibold bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs">
                    Change role
                  </button>
                  <button className="w-full py-2 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
                    Cancel
                  </button>
                </div>
              </div>

              {/* Dialog 4: Sign out? */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Sign out?</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    You will need to sign in again. Your session ends on this device.
                  </p>
                </div>
                <div className="space-y-2 pt-2">
                  <button className="w-full py-2 rounded-full text-xs font-semibold bg-[#C93338] text-white hover:bg-[#B3262B] transition-colors shadow-xs">
                    Sign out
                  </button>
                  <button className="w-full py-2 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Help & Support (Page 31) */}
      {activeMainTab === 'help' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Help & support
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
                Confirmed core capability
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Guidance for administrators.
            </p>
          </div>

          {/* Blue Banner (Page 31) */}
          <div className="bg-[#EBF0FF] border border-[#D0DEFF] text-[#1E3A8A] rounded-2xl p-4 text-xs flex items-center gap-3 shadow-2xs">
            <Hexagon className="w-4 h-4 text-[#2F5BFF] shrink-0" />
            <p className="leading-relaxed">
              Support details come only from real institutional channels. None are configured yet.
            </p>
          </div>

          {/* 5 Cards (Page 31) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Help centre</h3>
              <p className="text-xs text-slate-500">
                How to verify a visitor, read a result and fix a camera problem.
              </p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
                Confirmed core capability
              </span>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Administrative guidance</h3>
              <p className="text-xs text-slate-500">
                Registering people, approving photographs and reviewing events.
              </p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
                Confirmed core capability
              </span>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Documentation links</h3>
              <p className="text-xs text-slate-500">
                Appear where your institution provides them.
              </p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF4E5] text-[#B45309]">
                Backend-dependent
              </span>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Support information</h3>
              <p className="text-xs text-slate-500">[real support channel]</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF4E5] text-[#B45309]">
                Backend-dependent
              </span>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">System warnings</h3>
              <p className="text-xs text-slate-500">Shown when a service reports a problem.</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF4E5] text-[#B45309]">
                Backend-dependent
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-slate-500">Loading settings...</div>}>
      <AdminSettingsContent />
    </React.Suspense>
  );
}
