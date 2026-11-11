'use client';

import React, { useState } from 'react';
import {
  Settings, Sliders, Shield, Database, Cpu, CheckCircle2,
  AlertTriangle, Save, RefreshCw, Lock, Sparkles, Building,
  Key, Clock, Check, HardDrive, Smartphone, Radio
} from 'lucide-react';

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState<'INSTITUTION' | 'BIOMETRICS' | 'SECURITY' | 'SERVICES'>('INSTITUTION');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    // Institution
    institutionName: 'Apex University of Technology',
    institutionCode: 'AUT-CAMPUS-HQ',
    primaryContact: 'security-admin@apex.edu',
    perimeterLockdownActive: false,

    // Biometrics
    autoAdmitThreshold: 0.90,
    reviewThreshold: 0.70,
    minFaceQualitySize: 60,
    allowMultipleFaces: false,

    // Security
    enforceMfaAdmin: true,
    guardSessionHours: 8,
    adminSessionHours: 4,
    auditRetentionDays: 365,
  });

  const handleSave = () => {
    setIsSaving(true);
    setSavedSuccess(false);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Institutional System Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Calibrate biometric confidence cutoffs, institutional security policies, and edge inference thresholds.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-800 text-white text-xs font-semibold hover:bg-teal-900 transition-all shadow-xs self-start md:self-auto"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : savedSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>Settings Persisted</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save System Settings</span>
            </>
          )}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>System configuration successfully updated and broadcast to edge terminals.</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex items-center space-x-1 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 w-fit overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('INSTITUTION')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
            activeTab === 'INSTITUTION'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Institutional Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('BIOMETRICS')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
            activeTab === 'BIOMETRICS'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Biometrics & Calibration</span>
        </button>

        <button
          onClick={() => setActiveTab('SECURITY')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
            activeTab === 'SECURITY'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security & Hardware Keys</span>
        </button>

        <button
          onClick={() => setActiveTab('SERVICES')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
            activeTab === 'SERVICES'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Architecture & Models</span>
        </button>
      </div>

      {/* Tab 1: Institutional Profile */}
      {activeTab === 'INSTITUTION' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Institutional Identity</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Organizational branding, emergency protocols, and perimeter contact points.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Institution Legal Name
              </label>
              <input
                type="text"
                value={settings.institutionName}
                onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Institutional Campus Code
              </label>
              <input
                type="text"
                value={settings.institutionCode}
                onChange={(e) => setSettings({ ...settings, institutionCode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Security Operations Center Email
              </label>
              <input
                type="email"
                value={settings.primaryContact}
                onChange={(e) => setSettings({ ...settings, primaryContact: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>

          {/* Emergency Perimeter Control */}
          <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2 text-rose-900 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Emergency Perimeter Lockdown Protocol</span>
              </div>
              <p className="text-[11px] text-rose-700">
                Instantly revokes auto-admission across all gates and enforces strict physical inspection by guards.
              </p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, perimeterLockdownActive: !settings.perimeterLockdownActive })}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                settings.perimeterLockdownActive
                  ? 'bg-rose-600 text-white shadow-rose-200'
                  : 'bg-white border border-rose-300 text-rose-700 hover:bg-rose-100'
              }`}
            >
              {settings.perimeterLockdownActive ? 'LOCKDOWN ACTIVE' : 'Initiate Lockdown'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Biometrics & Calibration */}
      {activeTab === 'BIOMETRICS' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Biometric Calibration Engine</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Control the sensitivity, confidence cutoffs, and quality filters for OpenCV YuNet and SFace models.
            </p>
          </div>

          <div className="space-y-5 text-xs">
            {/* Auto Admit Threshold Slider */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm">
                    Auto-Admission Cosine Threshold
                  </span>
                  <p className="text-xs text-slate-500">
                    Similarity required to clear candidate without human guard escalation. Recommended: 0.90
                  </p>
                </div>
                <span className="font-mono text-base font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-xl border border-teal-200 tabular-nums">
                  {(settings.autoAdmitThreshold * 100).toFixed(0)}% ({settings.autoAdmitThreshold.toFixed(2)})
                </span>
              </div>
              <input
                type="range"
                min="0.75"
                max="0.98"
                step="0.01"
                value={settings.autoAdmitThreshold}
                onChange={(e) => setSettings({ ...settings, autoAdmitThreshold: parseFloat(e.target.value) })}
                className="w-full accent-teal-700 cursor-pointer"
              />
            </div>

            {/* Review Threshold Slider */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm">
                    Potential Match / Guard Review Threshold
                  </span>
                  <p className="text-xs text-slate-500">
                    Cosine similarity floor where a candidate profile triggers manual guard inspection. Recommended: 0.70
                  </p>
                </div>
                <span className="font-mono text-base font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 tabular-nums">
                  {(settings.reviewThreshold * 100).toFixed(0)}% ({settings.reviewThreshold.toFixed(2)})
                </span>
              </div>
              <input
                type="range"
                min="0.50"
                max="0.80"
                step="0.01"
                value={settings.reviewThreshold}
                onChange={(e) => setSettings({ ...settings, reviewThreshold: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Min Face Quality */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm">
                    Minimum Face Detection Bounding Box Size
                  </span>
                  <p className="text-xs text-slate-500">
                    Rejects low-resolution distant faces to prevent spurious False Rejections. Recommended: 60px
                  </p>
                </div>
                <span className="font-mono text-base font-bold text-slate-800 bg-white px-3 py-1 rounded-xl border border-slate-200 tabular-nums">
                  {settings.minFaceQualitySize} px
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="120"
                step="5"
                value={settings.minFaceQualitySize}
                onChange={(e) => setSettings({ ...settings, minFaceQualitySize: parseInt(e.target.value) })}
                className="w-full accent-slate-800 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Security & Hardware Keys */}
      {activeTab === 'SECURITY' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Session & Access Control Policy</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enforce role-based access control, session timeouts, and cryptographic audit parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <label className="block text-slate-700 font-semibold">
                Guard Mobile Session Expiry
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={settings.guardSessionHours}
                  onChange={(e) => setSettings({ ...settings, guardSessionHours: parseInt(e.target.value) })}
                  className="w-24 px-3 py-2 rounded-xl bg-white border border-slate-200 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 tabular-nums"
                />
                <span className="text-slate-500">Hours per shift</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <label className="block text-slate-700 font-semibold">
                Administrator Web Session Expiry
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={settings.adminSessionHours}
                  onChange={(e) => setSettings({ ...settings, adminSessionHours: parseInt(e.target.value) })}
                  className="w-24 px-3 py-2 rounded-xl bg-white border border-slate-200 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 tabular-nums"
                />
                <span className="text-slate-500">Hours idle timeout</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900">Enforce Multi-Factor Authentication (MFA)</span>
              <p className="text-slate-500">
                Requires WebAuthn / FIDO2 hardware key or TOTP code for all admin logins.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.enforceMfaAdmin}
              onChange={(e) => setSettings({ ...settings, enforceMfaAdmin: e.target.checked })}
              className="w-5 h-5 accent-teal-700 rounded cursor-pointer"
            />
          </div>

          {/* Hardware Token Management Card */}
          <div className="p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <span className="flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-teal-600" />
                <span>Enrolled FIDO2 Hardware Keys</span>
              </span>
              <button className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors">
                + Register Key
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="font-semibold text-slate-800">YubiKey 5C NFC (Primary Admin)</div>
                  <div className="text-[10px] text-slate-400 font-mono">Enrolled: Nov 01, 2026 • Serial: #9842104</div>
                </div>
              </div>
              <span className="text-emerald-700 font-mono text-[10px] font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                VERIFIED
              </span>
            </div>
          </div>

          {/* HMAC Secret Info */}
          <div className="p-4 rounded-2xl bg-slate-950 text-white space-y-2 text-xs">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>HMAC-SHA256 Cryptographic Non-Repudiation Engine</span>
              </div>
              <span className="text-[10px] font-mono">ENCRYPTION: ACTIVE</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Every verification decision recorded by security officers is cryptographically hashed with server-held keys to produce non-tamperable audit logs.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Architecture & Models */}
      {activeTab === 'SERVICES' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Connected Engine Architecture</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Runtime status of the underlying machine vision models, cloud integrations, and vector indexes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* OpenCV YuNet */}
            <div className="p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">OpenCV Zoo YuNet Face Detector</span>
                <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ONLINE
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                ONNX runtime model loaded. Real-time bounding box and 5-point facial landmark regression.
              </p>
            </div>

            {/* OpenCV SFace */}
            <div className="p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">OpenCV Zoo SFace Recognizer</span>
                <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ONLINE
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                128-dimensional L2-normalized vector embedding generator. Zero cloud transmission of raw pixels.
              </p>
            </div>

            {/* Google Drive API */}
            <div className="p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Google Drive Reference Store</span>
                <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  AUTHENTICATED
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Scoped service account actively monitoring institutional reference photo directory.
              </p>
            </div>

            {/* Gemini AI Service */}
            <div className="p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Google Gemini 1.5 Flash AI</span>
                <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  READY
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Multimodal assistant available for exception summarization and audit synthesis.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
