'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/lib/contexts/auth-context';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [employeeId, setEmployeeId] = useState('ADM-001');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(employeeId, password);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const setCredentials = (emp: string, pass: string) => {
    setEmployeeId(emp);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 antialiased">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gatewise-primary flex items-center justify-center text-white mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-gatewise-text tracking-tight">
            GATEWISE<span className="text-gatewise-primary ml-0.5">AI</span>
          </h1>
          <p className="text-xs text-gatewise-secondary font-medium">
            Institutional Administration & Gate Command Centre
          </p>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] text-emerald-800 font-semibold">
            <span>IIM Sambalpur Security Directorate</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-3xl bg-white border border-gatewise-border shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-gatewise-text">Sign In to Command Centre</h2>
            <p className="text-xs text-gatewise-secondary">
              Authorized institutional security administrators only.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start space-x-2.5 text-xs text-rose-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gatewise-text">Employee ID / Email</label>
              <div className="relative">
                <User className="w-4 h-4 text-gatewise-secondary/60 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. ADM-001"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gatewise-border bg-background/50 text-xs text-gatewise-text placeholder:text-gatewise-secondary/50 focus:border-gatewise-primary focus:ring-1 focus:ring-gatewise-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gatewise-text">Security Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gatewise-secondary/60 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gatewise-border bg-background/50 text-xs text-gatewise-text placeholder:text-gatewise-secondary/50 focus:border-gatewise-primary focus:ring-1 focus:ring-gatewise-primary outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gatewise-primary text-white font-bold text-xs hover:bg-gatewise-deep flex items-center justify-center space-x-2 transition-all shadow-sm disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Authenticate & Enter'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-4 border-t border-gatewise-border/70 space-y-2">
            <span className="text-[10px] font-bold text-gatewise-secondary/70 uppercase tracking-wider block">
              Quick Test Credentials
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCredentials('ADM-001', 'admin123')}
                className="p-2 rounded-xl border border-gatewise-border hover:bg-background-secondary text-left transition-colors"
              >
                <span className="text-[11px] font-bold text-gatewise-text block">Administrator</span>
                <span className="text-[10px] text-gatewise-secondary block font-mono">ADM-001</span>
              </button>
              <button
                type="button"
                onClick={() => setCredentials('SUPER-001', 'super123')}
                className="p-2 rounded-xl border border-gatewise-border hover:bg-background-secondary text-left transition-colors"
              >
                <span className="text-[11px] font-bold text-gatewise-text block">Super Admin</span>
                <span className="text-[10px] text-gatewise-secondary block font-mono">SUPER-001</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center justify-center space-x-2 text-[11px] text-gatewise-secondary">
          <ShieldAlert className="w-3.5 h-3.5 text-gatewise-secondary/70" />
          <span>Access strictly restricted to authorized institutional personnel.</span>
        </div>
      </div>
    </div>
  );
}
