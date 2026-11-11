'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck, Smartphone, Menu, X, ArrowRight, Download,
  Lock, CheckCircle2, ChevronRight, Activity, Terminal, Apple
} from 'lucide-react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Overview' },
    { href: '/#product-video', label: 'Video Demo' },
    { href: '/#product-gallery', label: 'Screenshots' },
    { href: '/showcase', label: 'Motion Lab' },
    { href: '/how-it-works', label: 'Architecture' },
    { href: '/security', label: 'Privacy' },
    { href: '/download', label: 'Downloads' },
  ];

  // If on the home landing page, render the full-screen cinematic experience directly
  if (pathname === '/') {
    return (
      <main className="w-full min-h-screen bg-[#0c0c0c] text-white selection:bg-[#3D81E3]/30 overflow-x-hidden font-sans">
        {children}
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-brand-mint selection:text-gatewise-deep font-sans">
      {/* Stageshow Top Telemetry Banner */}
      <div className="bg-[#17221c] text-[#d1ded7] text-[11px] py-1.5 px-4 font-mono border-b border-black/10 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">GATEWISE CLUSTER</span>
            <span className="text-[#879990] hidden sm:inline">• Node N-01 IIM Sambalpur Perimeter Active</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[#879990] shrink-0 text-[10px]">
            <span>SFace 128-D Cosine: <strong className="text-emerald-400 font-semibold">0.984 Avg</strong></span>
            <span>Edge YuNet: <strong className="text-white font-semibold">28ms</strong></span>
            <span>Audit: <strong className="text-white font-semibold">HMAC-SHA256</strong></span>
          </div>
        </div>
      </div>

      {/* Main Frosted Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-black/[0.06] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Mark */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gatewise-primary text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold tracking-tight text-gatewise-text leading-tight">
                  GATEWISE<span className="text-gatewise-primary font-black ml-0.5">AI</span>
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-gatewise-light text-gatewise-deep text-[10px] font-mono font-bold border border-gatewise-mint">
                  v1.0
                </span>
              </div>
              <span className="text-[10px] font-medium text-gatewise-secondary -mt-0.5">
                Perimeter Intelligence & Guard Oversight
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center p-1 rounded-full bg-black/[0.03] border border-black/[0.04]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white text-gatewise-text shadow-xs font-semibold'
                      : 'text-gatewise-secondary hover:text-gatewise-text hover:bg-black/[0.02]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden lg:flex items-center space-x-2.5">
            <Link
              href="/admin/login"
              className="text-xs font-semibold text-gatewise-secondary hover:text-gatewise-text px-3 py-1.5 rounded-lg hover:bg-black/[0.03] transition-colors flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-gatewise-secondary" />
              <span>Admin Desk</span>
            </Link>

            <Link
              href="/download"
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gatewise-primary text-white text-xs font-semibold hover:bg-gatewise-deep active:scale-95 transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Downloads</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              href="/download"
              className="px-3 py-1.5 rounded-full bg-gatewise-primary text-white text-xs font-semibold flex items-center space-x-1"
            >
              <Download className="w-3 h-3" />
              <span>Get App</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-gatewise-border text-gatewise-secondary hover:text-gatewise-text hover:bg-background-secondary"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-gatewise-border bg-white px-4 pt-2 pb-6 space-y-3 animate-in fade-in duration-150">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-xs font-semibold ${
                    pathname === link.href
                      ? 'bg-gatewise-light text-gatewise-deep font-bold'
                      : 'text-gatewise-secondary hover:bg-background-secondary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pt-2 border-t border-gatewise-border space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary px-1">
                Official Downloads
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <Link
                  href="/download?platform=android"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-center hover:bg-slate-100 transition-colors"
                >
                  <Smartphone className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <span className="text-[10px] font-bold text-gatewise-text block">Android APK</span>
                </Link>
                <Link
                  href="/download?platform=ios"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-center hover:bg-slate-100 transition-colors"
                >
                  <Apple className="w-4 h-4 text-slate-800 mx-auto mb-1" />
                  <span className="text-[10px] font-bold text-gatewise-text block">Apple iOS</span>
                </Link>
                <Link
                  href="/download?platform=macos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-center hover:bg-slate-100 transition-colors"
                >
                  <Terminal className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                  <span className="text-[10px] font-bold text-gatewise-text block">macOS DMG</span>
                </Link>
              </div>

              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl border border-gatewise-border text-xs font-bold text-gatewise-text flex items-center justify-center space-x-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-gatewise-primary" />
                <span>Admin Login</span>
              </Link>
              <Link
                href="/download"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-gatewise-primary text-white text-xs font-bold flex items-center justify-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open Download Centre (APK · IPA · DMG)</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">{children}</main>

      {/* Stageshow Ruled Footer */}
      <footer className="border-t border-black/[0.08] bg-white pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Summary */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-gatewise-primary text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-base font-bold text-gatewise-text">
                  GATEWISE<span className="text-gatewise-primary ml-0.5">AI</span>
                </span>
              </div>
              <p className="text-xs text-gatewise-secondary max-w-sm leading-relaxed">
                High-consequence institutional verification platform. Single-shot facial vector comparison, sovereign human guard oversight, and cryptographic non-repudiation logging for campus perimeters.
              </p>
              <div className="flex items-center space-x-2 text-[11px] text-gatewise-secondary font-mono pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Production Release • Android 8.0+ • Edge YuNet+SFace</span>
              </div>
            </div>

            {/* Architecture Column */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gatewise-text">
                Architecture
              </span>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/product" className="text-gatewise-secondary hover:text-gatewise-text transition-colors">
                    Platform Overview
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-gatewise-secondary hover:text-gatewise-text transition-colors">
                    Feature Specifications
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-gatewise-secondary hover:text-gatewise-text transition-colors">
                    8-Stage Verification Pipeline
                  </Link>
                </li>
                <li>
                  <Link href="/download" className="text-gatewise-secondary hover:text-gatewise-text transition-colors font-medium">
                    Downloads Hub (All Platforms)
                  </Link>
                </li>
                <li>
                  <Link href="/download?platform=android" className="text-gatewise-secondary hover:text-gatewise-text transition-colors">
                    Android Guard APK (v1.0.0)
                  </Link>
                </li>
                <li>
                  <Link href="/download?platform=ios" className="text-gatewise-secondary hover:text-gatewise-text transition-colors">
                    Apple iOS Guard (TestFlight &amp; MDM)
                  </Link>
                </li>
                <li>
                  <Link href="/download?platform=macos" className="text-gatewise-secondary hover:text-gatewise-text transition-colors">
                    macOS Admin Command Centre (DMG)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Security & Cryptography */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gatewise-text">
                Security & Trust
              </span>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/security" className="text-gatewise-secondary hover:text-gatewise-text transition-colors">
                    Zero Raw Biometric Storage
                  </Link>
                </li>
                <li>
                  <Link href="/installation" className="text-gatewise-secondary hover:text-gatewise-text transition-colors">
                    Deployment Guide
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gatewise-secondary hover:text-gatewise-text transition-colors">
                    Guard Operations FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-gatewise-secondary hover:text-gatewise-text transition-colors">
                    Technical Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Operations */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gatewise-text">
                Operations
              </span>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/admin/login" className="text-gatewise-secondary hover:text-gatewise-text flex items-center space-x-1.5 transition-colors">
                    <Lock className="w-3 h-3 text-gatewise-primary" />
                    <span>Admin Central Portal</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/activity" className="text-gatewise-secondary hover:text-gatewise-text transition-colors">
                    Audit Log Explorer
                  </Link>
                </li>
                <li>
                  <Link href="/admin/repository" className="text-gatewise-secondary hover:text-gatewise-text transition-colors">
                    Google Drive Biometric Sync
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright & Signatures */}
          <div className="mt-12 pt-6 border-t border-black/[0.06] flex flex-col md:flex-row items-center justify-between text-xs text-gatewise-secondary gap-4">
            <p>
              &copy; {new Date().getFullYear()} GATEWISE AI. Designed for institutional perimeter integrity & sovereign security operations.
            </p>
            <div className="flex items-center space-x-3 text-[11px] font-mono">
              <span className="px-2 py-0.5 rounded bg-black/[0.04]">Zero Cloud Biometrics</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-black/[0.04]">HMAC-SHA256 Signed</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-black/[0.04]">Sovereign Human Oversight</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
