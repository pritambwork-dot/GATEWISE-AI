'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck, Smartphone, Menu, X, ArrowRight, Download,
  ExternalLink, Lock, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/product', label: 'Product' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/features', label: 'Features' },
    { href: '/security', label: 'Security' },
    { href: '/download', label: 'Download' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-gatewise-light selection:text-gatewise-deep font-sans">
      {/* Top Banner Notice */}
      <div className="bg-gatewise-deep text-white text-[11px] py-1.5 px-4 text-center font-medium border-b border-gatewise-primary/30">
        <span className="opacity-90">Official Institutional Technology Platform for Campus Security &amp; Visitor Identification</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gatewise-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gatewise-primary text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-gatewise-deep transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-gatewise-text leading-tight">
                GATEWISE<span className="text-gatewise-primary ml-0.5">AI</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-gatewise-secondary -mt-0.5">
                Perimeter Security
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gatewise-light text-gatewise-deep'
                      : 'text-gatewise-secondary hover:text-gatewise-text hover:bg-background-secondary'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/admin/login"
              className="text-xs font-bold text-gatewise-secondary hover:text-gatewise-text px-3 py-1.5 transition-colors"
            >
              Admin Sign In
            </Link>

            <Link
              href="/download"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gatewise-primary text-white text-xs font-bold hover:bg-gatewise-deep transition-all shadow-xs"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Download for Android</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/download"
              className="px-3 py-1.5 rounded-lg bg-gatewise-primary text-white text-xs font-bold"
            >
              Download
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
          <div className="md:hidden border-b border-gatewise-border bg-white px-4 pt-2 pb-6 space-y-3 animate-in fade-in duration-150">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-sm font-bold ${
                    pathname === link.href
                      ? 'bg-gatewise-light text-gatewise-deep'
                      : 'text-gatewise-secondary hover:bg-background-secondary text-gatewise-text'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="pt-3 border-t border-gatewise-border space-y-2">
              <Link
                href="/installation"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-semibold text-gatewise-secondary hover:text-gatewise-text"
              >
                Installation Guide &rarr;
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-bold text-gatewise-text hover:bg-background-secondary rounded-xl"
              >
                Administrator Portal Sign In
              </Link>
              <Link
                href="/download"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-gatewise-primary text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download for Android</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-1">{children}</main>

      {/* Official Footer */}
      <footer className="bg-white border-t border-gatewise-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand column */}
            <div className="col-span-2 space-y-4">
              <Link href="/" className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-gatewise-primary text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-base font-black text-gatewise-text">
                  GATEWISE<span className="text-gatewise-primary ml-0.5">AI</span>
                </span>
              </Link>
              <p className="text-xs text-gatewise-secondary max-w-sm leading-relaxed">
                Connected institutional gate verification platform. AI-assisted face matching with sovereign human guard oversight and cryptographic audit logging.
              </p>
              <div className="flex items-center space-x-2 text-[11px] text-gatewise-secondary font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Production Release · Android 8.0+</span>
              </div>
            </div>

            {/* Product Column */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gatewise-secondary">
                Product
              </span>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/product" className="text-gatewise-secondary hover:text-gatewise-text">
                    Overview
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-gatewise-secondary hover:text-gatewise-text">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-gatewise-secondary hover:text-gatewise-text">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/download" className="text-gatewise-secondary hover:text-gatewise-text">
                    Android APK
                  </Link>
                </li>
              </ul>
            </div>

            {/* Security & Guides Column */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gatewise-secondary">
                Security &amp; Guides
              </span>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/security" className="text-gatewise-secondary hover:text-gatewise-text">
                    Privacy &amp; Cryptography
                  </Link>
                </li>
                <li>
                  <Link href="/installation" className="text-gatewise-secondary hover:text-gatewise-text">
                    Installation Guide
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gatewise-secondary hover:text-gatewise-text">
                    Operational FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-gatewise-secondary hover:text-gatewise-text">
                    Technical Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Administration Column */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gatewise-secondary">
                Administration
              </span>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/admin/login" className="text-gatewise-secondary hover:text-gatewise-text flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-gatewise-primary" />
                    <span>Admin Portal</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/activity" className="text-gatewise-secondary hover:text-gatewise-text">
                    Telemetry Logs
                  </Link>
                </li>
                <li>
                  <Link href="/admin/repository" className="text-gatewise-secondary hover:text-gatewise-text">
                    Drive Repository
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright & Disclaimer */}
          <div className="mt-12 pt-6 border-t border-gatewise-border flex flex-col md:flex-row items-center justify-between text-xs text-gatewise-secondary gap-4">
            <p>
              &copy; {new Date().getFullYear()} GATEWISE AI. All rights reserved. Built for institutional campus perimeter security.
            </p>
            <div className="flex items-center space-x-4 text-[11px]">
              <span>Zero-Exposure Biometrics</span>
              <span>•</span>
              <span>HMAC-SHA256 Signed</span>
              <span>•</span>
              <span>Sovereign Guard Oversight</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
