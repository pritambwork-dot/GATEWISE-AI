import Link from 'next/link';
import { ShieldCheck, ArrowRight, Download, Monitor, Smartphone } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-12">
      {/* Brand Header */}
      <header className="flex items-center justify-between pb-6 border-b border-gatewise-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gatewise-primary flex items-center justify-center text-white font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gatewise-text">GATEWISE<span className="text-gatewise-primary ml-1">AI</span></h1>
            <p className="text-xs text-gatewise-secondary">IIM Sambalpur Campus Security</p>
          </div>
        </div>

        <nav className="flex items-center space-x-4 text-xs font-semibold">
          <Link href="/product" className="text-gatewise-secondary hover:text-gatewise-text">Product</Link>
          <Link href="/features" className="text-gatewise-secondary hover:text-gatewise-text">Features</Link>
          <Link href="/download" className="text-gatewise-secondary hover:text-gatewise-text">Download APK</Link>
          <Link href="/admin" className="px-3.5 py-1.5 rounded-lg bg-gatewise-primary text-white hover:bg-gatewise-deep transition-all">
            Admin Portal
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <div className="max-w-3xl space-y-6 pt-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gatewise-light text-gatewise-deep text-xs font-semibold border border-gatewise-primary/20">
          <span className="w-2 h-2 rounded-full bg-gatewise-success animate-pulse"></span>
          <span>Engineering Foundation Initialized</span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-extrabold text-gatewise-text tracking-tight leading-tight">
          AI-assisted institutional gate verification with human sovereignty.
        </h2>

        <p className="text-base text-gatewise-secondary leading-relaxed">
          GATEWISE AI combines single-shot camera facial recognition, decoupled institutional clearance records, and immutable cryptographic audit logging. The AI assists the guard; it never replaces human judgment.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/download"
            className="px-5 py-3 rounded-xl bg-gatewise-primary text-white text-xs font-bold hover:bg-gatewise-deep transition-all shadow-sm flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Guard APK (v1.0.0)</span>
          </Link>
          <Link
            href="/admin"
            className="px-5 py-3 rounded-xl bg-white border border-gatewise-border text-gatewise-text text-xs font-bold hover:bg-background-secondary transition-all flex items-center space-x-2"
          >
            <Monitor className="w-4 h-4 text-gatewise-teal" />
            <span>Open Administrator Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
