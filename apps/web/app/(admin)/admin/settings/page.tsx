'use client';

import React, { useState } from 'react';
import {
  Settings, Sliders, Shield, Database, Cpu, CheckCircle2,
  AlertTriangle, Save, RefreshCw, Lock, Sparkles, Building,
  Key, Clock, Check
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gatewise-text tracking-tight">
            Institutional System Configuration
          </h1>
          <p className="text-xs text-gatewise-secondary mt-1">
            Calibrate biometric confidence cutoffs, institutional security policies, and edge inference thresholds.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gatewise-primary text-white text-xs font-bold hover:bg-gatewise-deep transition-all shadow-xs self-start md:self-auto"
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
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>System configuration successfully updated and broadcast to edge terminals.</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-gatewise-border pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('INSTITUTION')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
            activeTab === 'INSTITUTION'
              ? 'bg-gatewise-primary text-white shadow-xs'
              : 'text-gatewise-secondary hover:text-gatewise-text hover:bg-background-secondary'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Institutional Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('BIOMETRICS')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
            activeTab === 'BIOMETRICS'
              ? 'bg-gatewise-primary text-white shadow-xs'
              : 'text-gatewise-secondary hover:text-gatewise-text hover:bg-background-secondary'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Biometrics & Computer Vision</span>
        </button>

        <button
          onClick={() => setActiveTab('SECURITY')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
            activeTab === 'SECURITY'
              ? 'bg-gatewise-primary text-white shadow-xs'
              : 'text-gatewise-secondary hover:text-gatewise-text hover:bg-background-secondary'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security & Sessions</span>
        </button>

        <button
          onClick={() => setActiveTab('SERVICES')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
            activeTab === 'SERVICES'
              ? 'bg-gatewise-primary text-white shadow-xs'
              : 'text-gatewise-secondary hover:text-gatewise-text hover:bg-background-secondary'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Cloud & AI Pipeline</span>
        </button>
      </div>

      {/* Tab 1: Institutional Profile */}
      {activeTab === 'INSTITUTION' && (
        <div className="p-6 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-black text-gatewise-text">Institutional Identity</h3>
            <p className="text-xs text-gatewise-secondary mt-0.5">
              Organizational branding and perimeter emergency settings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                Institution Legal Name
              </label>
              <input
                type="text"
                value={settings.institutionName}
                onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
              />
            </div>

            <div>
              <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                Institutional Campus Code
              </label>
              <input
                type="text"
                value={settings.institutionCode}
                onChange={(e) => setSettings({ ...settings, institutionCode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border font-mono text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
              />
            </div>

            <div>
              <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                Security Operations Center Contact
              </label>
              <input
                type="email"
                value={settings.primaryContact}
                onChange={(e) => setSettings({ ...settings, primaryContact: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border font-mono text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
              />
            </div>
          </div>

          {/* Emergency Perimeter Control */}
          <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Emergency Perimeter Lockdown Protocol</span>
              </div>
              <p className="text-[11px] text-rose-700">
                Immediately revokes all auto-admission and forces manual guard inspection on all perimeter gate terminals.
              </p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, perimeterLockdownActive: !settings.perimeterLockdownActive })}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                settings.perimeterLockdownActive
                  ? 'bg-rose-600 text-white'
                  : 'bg-white border border-rose-300 text-rose-700 hover:bg-rose-50'
              }`}
            >
              {settings.perimeterLockdownActive ? 'LOCKDOWN ACTIVE' : 'Initiate Lockdown'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Biometrics & Computer Vision */}
      {activeTab === 'BIOMETRICS' && (
        <div className="p-6 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-black text-gatewise-text">Biometric Calibration Engine</h3>
            <p className="text-xs text-gatewise-secondary mt-0.5">
              Control the sensitivity, confidence intervals, and quality cutoffs for the OpenCV YuNet & SFace models.
            </p>
          </div>

          <div className="space-y-5 text-xs">
            {/* Auto Admit Threshold Slider */}
            <div className="p-4 rounded-2xl bg-background-secondary/50 border border-gatewise-border space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-gatewise-text text-sm">
                    Auto-Admission Similarity Threshold
                  </span>
                  <p className="text-xs text-gatewise-secondary">
                    Cosine similarity required to automatically clear a candidate without guard escalation. Recommended: 0.90
                  </p>
                </div>
                <span className="font-mono text-base font-black text-gatewise-primary bg-gatewise-light px-3 py-1 rounded-xl border border-gatewise-mint">
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
                className="w-full accent-gatewise-primary cursor-pointer"
              />
            </div>

            {/* Review Threshold Slider */}
            <div className="p-4 rounded-2xl bg-background-secondary/50 border border-gatewise-border space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-gatewise-text text-sm">
                    Potential Match / Guard Review Threshold
                  </span>
                  <p className="text-xs text-gatewise-secondary">
                    Cosine similarity floor where a candidate profile is flagged for manual guard inspection. Recommended: 0.70
                  </p>
                </div>
                <span className="font-mono text-base font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
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
            <div className="p-4 rounded-2xl bg-background-secondary/50 border border-gatewise-border space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-gatewise-text text-sm">
                    Minimum Face Detection Bounding Box Size
                  </span>
                  <p className="text-xs text-gatewise-secondary">
                    Rejects low-resolution distant faces to prevent spurious False Rejections. Recommended: 60px
                  </p>
                </div>
                <span className="font-mono text-base font-black text-gatewise-text bg-white px-3 py-1 rounded-xl border border-gatewise-border">
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
                className="w-full accent-gatewise-text cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Security & Sessions */}
      {activeTab === 'SECURITY' && (
        <div className="p-6 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-black text-gatewise-text">Session & Access Control Policy</h3>
            <p className="text-xs text-gatewise-secondary mt-0.5">
              Enforce role-based access control, session timeouts, and cryptographic audit parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-background-secondary/50 border border-gatewise-border space-y-2">
              <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px]">
                Guard Mobile Session Expiry
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={settings.guardSessionHours}
                  onChange={(e) => setSettings({ ...settings, guardSessionHours: parseInt(e.target.value) })}
                  className="w-24 px-3 py-2 rounded-xl bg-white border border-gatewise-border font-mono text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                />
                <span className="text-gatewise-secondary font-medium">Hours per shift</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-background-secondary/50 border border-gatewise-border space-y-2">
              <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px]">
                Administrator Web Session Expiry
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={settings.adminSessionHours}
                  onChange={(e) => setSettings({ ...settings, adminSessionHours: parseInt(e.target.value) })}
                  className="w-24 px-3 py-2 rounded-xl bg-white border border-gatewise-border font-mono text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                />
                <span className="text-gatewise-secondary font-medium">Hours idle timeout</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-gatewise-border flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-gatewise-text">Enforce Multi-Factor Authentication (MFA)</span>
              <p className="text-gatewise-secondary">
                Requires TOTP hardware key or Authenticator code for all <code>ADMIN</code> and <code>SUPER_ADMIN</code> users.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.enforceMfaAdmin}
              onChange={(e) => setSettings({ ...settings, enforceMfaAdmin: e.target.checked })}
              className="w-5 h-5 accent-gatewise-primary rounded cursor-pointer"
            />
          </div>

          {/* HMAC Secret Info */}
          <div className="p-4 rounded-2xl bg-gatewise-text text-white space-y-2 text-xs">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>HMAC-SHA256 Cryptographic Non-Repudiation Engine</span>
              </div>
              <span className="text-[10px] font-mono">ENCRYPTION: ACTIVE</span>
            </div>
            <p className="text-gray-300 text-[11px] leading-relaxed">
              Every verification decision recorded by security officers is cryptographically hashed with server-held keys to produce non-tamperable audit logs.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Cloud & AI Pipeline */}
      {activeTab === 'SERVICES' && (
        <div className="p-6 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-black text-gatewise-text">Connected Engine Architecture</h3>
            <p className="text-xs text-gatewise-secondary mt-0.5">
              Runtime status of the underlying machine vision models, cloud integrations, and vector indexes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* OpenCV YuNet */}
            <div className="p-4 rounded-2xl border border-gatewise-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gatewise-text">OpenCV Zoo YuNet Face Detector</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ONLINE
                </span>
              </div>
              <p className="text-gatewise-secondary text-[11px]">
                ONNX runtime model loaded. Real-time bounding box and 5-point facial landmark regression.
              </p>
            </div>

            {/* OpenCV SFace */}
            <div className="p-4 rounded-2xl border border-gatewise-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gatewise-text">OpenCV Zoo SFace Recognizer</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ONLINE
                </span>
              </div>
              <p className="text-gatewise-secondary text-[11px]">
                128-dimensional L2-normalized vector embedding generator. Zero cloud transmission of raw pixels.
              </p>
            </div>

            {/* Google Drive API */}
            <div className="p-4 rounded-2xl border border-gatewise-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gatewise-text">Google Drive Reference Store</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  AUTHENTICATED
                </span>
              </div>
              <p className="text-gatewise-secondary text-[11px]">
                Scoped service account actively monitoring institutional reference photo directory.
              </p>
            </div>

            {/* Gemini AI Service */}
            <div className="p-4 rounded-2xl border border-gatewise-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gatewise-text">Google Gemini 1.5 Flash AI</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  READY
                </span>
              </div>
              <p className="text-gatewise-secondary text-[11px]">
                Multimodal assistant available for exception summarization and audit synthesis.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
