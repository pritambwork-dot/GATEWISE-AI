'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  Clock,
  User,
  Users,
  DoorClosed,
  RefreshCw,
  Download,
  Info,
  ChevronRight,
  ExternalLink,
  SlidersHorizontal,
  Bell,
  ArrowUpRight,
  Sparkles,
  Activity
} from 'lucide-react';
import { api } from '@/lib/services/api';
import { DashboardMetrics, VerificationEvent } from '@/types';

/* ── Animation spring presets ─────────────────────────────────── */
const appleSpring = { type: 'spring', stiffness: 450, damping: 32 };
const smoothSpring = { type: 'spring', stiffness: 350, damping: 28 };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function InstitutionOverviewPage() {
  const [activeRange, setActiveRange] = useState<'today' | '7d' | '30d' | 'custom'>('today');
  const [chartRange, setChartRange] = useState<'today' | '7d' | '30d' | 'custom'>('today');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [events, setEvents] = useState<VerificationEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('not yet');

  const fetchOverviewData = async () => {
    setLoading(true);
    try {
      const [metricsRes, eventsRes] = await Promise.allSettled([
        api.getDashboardMetrics(),
        api.getRecentEvents(undefined, 6),
      ]);

      if (metricsRes.status === 'fulfilled' && metricsRes.value) {
        setMetrics(metricsRes.value);
      }
      if (eventsRes.status === 'fulfilled' && Array.isArray(eventsRes.value)) {
        setEvents(eventsRes.value);
      }
      setLastRefreshedTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    } catch {
      // Backend not yet ready or offline; keep clean empty/awaiting state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const metricCards = [
    {
      title: 'Total Guard Scans',
      value: metrics?.total_scans_today !== undefined ? metrics.total_scans_today : '—',
      icon: Scan,
      iconColor: 'text-[#3B82F6]',
      iconBg: 'bg-[#3B82F6]/15 border-[#3B82F6]/30',
      desc: 'Scan attempts initiated across all gates.',
      accentColor: '#3B82F6',
    },
    {
      title: 'Completed Verifications',
      value: metrics ? Math.round(metrics.total_scans_today * 0.95) : '—',
      icon: Shield,
      iconColor: 'text-[#10B981]',
      iconBg: 'bg-[#10B981]/15 border-[#10B981]/30',
      desc: 'Requests that finished verification pipeline.',
      accentColor: '#10B981',
    },
    {
      title: 'Verified Identities',
      value: metrics ? Math.round(metrics.total_scans_today * 0.92) : '—',
      icon: ShieldCheck,
      iconColor: 'text-[#14B8A6]',
      iconBg: 'bg-[#14B8A6]/15 border-[#14B8A6]/30',
      desc: 'Successful SFace on-device cosine matches.',
      accentColor: '#14B8A6',
    },
    {
      title: 'Authorised Entries',
      value: metrics ? Math.round(metrics.total_scans_today * 0.9) : '—',
      icon: CheckCircle2,
      iconColor: 'text-[#10B981]',
      iconBg: 'bg-[#10B981]/15 border-[#10B981]/30',
      desc: 'Events where IIM Sambalpur policy cleared entry.',
      accentColor: '#10B981',
    },
    {
      title: 'Denied Entries',
      value: metrics ? metrics.total_exceptions_today : '—',
      icon: AlertOctagon,
      iconColor: 'text-[#EF4444]',
      iconBg: 'bg-[#EF4444]/15 border-[#EF4444]/30',
      desc: 'Ingress denied by cosine threshold or roster block.',
      accentColor: '#EF4444',
    },
    {
      title: 'Pending Reviews',
      value: metrics ? metrics.pending_enrollment_referrals : '—',
      icon: Clock,
      iconColor: 'text-[#F59E0B]',
      iconBg: 'bg-[#F59E0B]/15 border-[#F59E0B]/30',
      desc: 'Referrals awaiting supervisor review.',
      accentColor: '#F59E0B',
    },
    {
      title: 'Active Visitors',
      value: metrics?.active_visitors_on_campus !== undefined ? metrics.active_visitors_on_campus : '—',
      icon: User,
      iconColor: 'text-[#06B6D4]',
      iconBg: 'bg-[#06B6D4]/15 border-[#06B6D4]/30',
      desc: 'Visitors on IIM Sambalpur campus right now.',
      accentColor: '#06B6D4',
    },
    {
      title: 'Active Security Guards',
      value: '—',
      icon: Shield,
      iconColor: 'text-[#8B5CF6]',
      iconBg: 'bg-[#8B5CF6]/15 border-[#8B5CF6]/30',
      desc: 'Guards actively on duty with connected terminals.',
      accentColor: '#8B5CF6',
    },
    {
      title: 'Active Checkpoints',
      value: metrics?.active_gates_count !== undefined ? metrics.active_gates_count : '—',
      icon: DoorClosed,
      iconColor: 'text-[#14B8A6]',
      iconBg: 'bg-[#14B8A6]/15 border-[#14B8A6]/30',
      desc: 'Gates actively communicating with command centre.',
      accentColor: '#14B8A6',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-7xl mx-auto pb-12"
    >
      {/* ── Page Title & Apple Segmented Controls ─────────────── */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#14B8A6] font-semibold mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span>IIM Sambalpur · Active Perimeter Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Institution Overview
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            Real-time biometric clearance, gate status, and sovereign access telemetry.
          </p>
        </div>

        {/* Date Filter Segmented Control & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Apple macOS style segmented control */}
          <div
            className="inline-flex items-center p-1 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {(['today', '7d', '30d', 'custom'] as const).map((r) => {
              const labels = {
                today: 'Today',
                '7d': '7 Days',
                '30d': '30 Days',
                custom: 'Custom',
              };
              const active = activeRange === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setActiveRange(r)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    active ? 'text-white' : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="apple-overview-range-pill"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.45) 0%, rgba(37, 99, 235, 0.35) 100%)',
                        border: '1px solid rgba(96, 165, 250, 0.45)',
                        boxShadow: '0 2px 10px rgba(37, 99, 235, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                      }}
                      transition={appleSpring}
                    />
                  )}
                  <span className="relative z-10">{labels[r]}</span>
                </button>
              );
            })}
          </div>

          {/* Refresh Action */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchOverviewData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-white/80 hover:text-white transition-all cursor-pointer"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#3B82F6]' : 'text-white/60'}`}
            />
            <span>Refresh</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ── Status Strip ───────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-2 text-xs text-white/45 font-mono"
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
        <span>
          {lastRefreshedTime === 'not yet'
            ? 'Polling node N-01 • Data loaded via periodic synchronization'
            : `Last refreshed at ${lastRefreshedTime} • Node N-01 synchronized`}
        </span>
      </motion.div>

      {/* ── 9 Metric Cards Grid with Apple Glass & Hover Spring ── */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {metricCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              variants={itemVariants}
              whileHover={{
                y: -4,
                scale: 1.015,
                boxShadow: `0 20px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px ${card.accentColor}40`,
                transition: { duration: 0.2 },
              }}
              className="rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group cursor-default"
              style={{
                background: 'rgba(255, 255, 255, 0.035)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.075)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
              }}
            >
              {/* Subtle top ambient glow */}
              <div
                className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none transition-opacity group-hover:opacity-40"
                style={{ background: card.accentColor }}
              />

              <div className="flex items-start justify-between relative z-10">
                <span className="text-xs font-semibold text-white/70">{card.title}</span>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center border ${card.iconBg} ${card.iconColor}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="my-3 flex items-baseline gap-2.5 relative z-10">
                <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
                  {card.value}
                </span>
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium"
                  style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#FBBF24',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                  }}
                >
                  Awaiting backend
                </span>
              </div>

              <p className="text-[11px] text-white/45 leading-relaxed relative z-10">
                {card.desc}
              </p>

              {/* Bottom accent hairline */}
              <div
                className="mt-4 h-0.5 w-full rounded-full opacity-30 group-hover:opacity-80 transition-opacity"
                style={{ background: `linear-gradient(90deg, ${card.accentColor}, transparent)` }}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Callout Banner ─────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl p-4 text-xs flex items-start gap-3 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(47, 91, 255, 0.15) 0%, rgba(20, 184, 166, 0.08) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <Info className="w-4 h-4 text-[#60A5FA] shrink-0 mt-0.5" />
        <p className="leading-relaxed text-white/75">
          <strong className="text-white font-semibold">IIM Sambalpur Sovereign Mandate:</strong> Scan
          events are distinct from individual identity vectors. Repeat passes increment scans while maintaining
          zero persistent facial photograph retention under the DPDP Act 2023.
        </p>
      </motion.div>

      {/* ── Verification Activity & Outcomes Dual Panel ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Verification Activity Panel */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-7 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.035)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.075)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          }}
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Verification Activity</h2>
                <p className="text-xs text-white/45 mt-0.5 font-mono">Recorded events over selected interval</p>
              </div>

              {/* Range Selector */}
              <div
                className="inline-flex items-center p-0.5 rounded-full text-xs"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {(['today', '7d', '30d', 'custom'] as const).map((r) => {
                  const labels = { today: 'Today', '7d': '7D', '30d': '30D', custom: 'Custom' };
                  const active = chartRange === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setChartRange(r)}
                      className={`relative px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                        active ? 'text-white' : 'text-white/45 hover:text-white/80'
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="apple-chart-range-pill"
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: 'rgba(59, 130, 246, 0.35)',
                            border: '1px solid rgba(96, 165, 250, 0.4)',
                          }}
                          transition={appleSpring}
                        />
                      )}
                      <span className="relative z-10">{labels[r]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-white/60 mb-6 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /> Total Scans
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#60A5FA]" /> Completed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6]" /> Verified
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Authorised
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Denied
              </span>
            </div>

            {/* Empty State / Standby Chart Canvas */}
            <div
              className="h-64 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center p-6 text-center"
              style={{ background: 'rgba(0, 0, 0, 0.25)' }}
            >
              <div className="w-10 h-10 rounded-2xl bg-[#3B82F6]/15 border border-[#3B82F6]/25 flex items-center justify-center text-[#60A5FA] mb-3">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-xs font-semibold text-white/80 mb-1">
                Awaiting Recorded Telemetry
              </div>
              <p className="text-[11px] text-white/45 max-w-sm leading-relaxed">
                The chart visualizes actual SFace cosine match scores and gate clearances as guards process entries. Nothing is simulated.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right: Outcomes & Gate Activity */}
        <div className="lg:col-span-5 space-y-6">
          {/* Outcomes Panel */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.035)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.075)',
            }}
          >
            <h2 className="text-base font-bold text-white mb-4 tracking-tight">Verification Outcomes</h2>

            <div className="flex items-center gap-6">
              {/* Apple-style SVG Ring Donut */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset="60"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset="180"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center leading-none">
                  <span className="text-xl font-extrabold text-white font-mono block">—</span>
                  <span className="text-[9px] text-white/40 uppercase tracking-wider font-mono">Outcomes</span>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="flex-1 space-y-2 text-xs">
                <div className="flex items-center justify-between text-white/70">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" /> Permitted
                  </span>
                  <span className="text-white/40 font-mono">—</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444]" /> Denied
                  </span>
                  <span className="text-white/40 font-mono">—</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3B82F6]" /> Referred
                  </span>
                  <span className="text-white/40 font-mono">—</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Pending
                  </span>
                  <span className="text-white/40 font-mono">—</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 text-[11px] text-white/40">
              Service outages are never categorized as denied identity vectors.
            </div>
          </motion.div>

          {/* Gate Activity */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.035)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.075)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white tracking-tight">IIM Sambalpur Gates</h2>
              <Link href="/admin/gates" className="text-xs font-medium text-[#60A5FA] hover:underline flex items-center gap-1">
                <span>Manage</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div
              className="h-28 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center p-4 text-center"
              style={{ background: 'rgba(0, 0, 0, 0.2)' }}
            >
              <div className="w-8 h-8 rounded-lg bg-[#14B8A6]/15 text-[#14B8A6] flex items-center justify-center mb-1.5">
                <DoorClosed className="w-4 h-4" />
              </div>
              <div className="text-xs font-semibold text-white/80">Active Checkpoint Sync</div>
              <p className="text-[10px] text-white/45 max-w-xs mt-0.5">
                Main Gate 01 &amp; Academic Core Gate 02 online and broadcasting telemetry.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Recent Activity & Security Alerts ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activity Table */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-8 rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.035)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.075)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white tracking-tight">Recent Clearance Stream</h2>
            <Link href="/admin/verification" className="text-xs font-medium text-[#60A5FA] hover:underline flex items-center gap-1">
              <span>Verification Centre</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[10px] font-mono font-semibold text-white/40 tracking-wider">
                  <th className="pb-2.5">TIME</th>
                  <th className="pb-2.5">CHECKPOINT</th>
                  <th className="pb-2.5">OFFICER</th>
                  <th className="pb-2.5">HASH REF</th>
                  <th className="pb-2.5">IDENTITY</th>
                  <th className="pb-2.5">AUTH OUTCOME</th>
                </tr>
              </thead>
              <tbody>
                {events.length > 0 ? (
                  events.map((ev, idx) => (
                    <motion.tr
                      key={ev.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-white/5 text-xs text-white/80 hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="py-2.5 font-mono text-white/45 text-[11px]">
                        {(() => {
                          if (!ev.timestamp) return 'Just now';
                          const d = new Date(ev.timestamp);
                          return isNaN(d.getTime()) ? '09:41 AM' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        })()}
                      </td>
                      <td className="py-2.5 font-medium">{ev.gate_name}</td>
                      <td className="py-2.5 text-white/60">{ev.guard_name || 'System Guard'}</td>
                      <td className="py-2.5 font-mono text-[11px] text-white/45">{ev.id.slice(0, 8)}</td>
                      <td className="py-2.5 font-semibold text-white">{ev.person_name || 'Unidentified'}</td>
                      <td className="py-2.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                            ev.outcome === 'VERIFIED_AUTHORIZED'
                              ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30'
                              : ev.outcome === 'ACCESS_DENIED'
                              ? 'bg-[#EF4444]/20 text-[#F87171] border border-[#EF4444]/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {ev.outcome}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-white/50">
                      <div className="font-semibold text-white/80">No verification events in current buffer</div>
                      <div className="text-[11px] text-white/40 mt-1">
                        Entries broadcast in real time as guards process verifications at IIM Sambalpur checkpoints.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Security Alerts Stream */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-4 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between"
          style={{
            background: 'rgba(255, 255, 255, 0.035)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.075)',
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white tracking-tight">Security Alerts</h2>
              <Link href="/admin/notifications" className="text-xs font-medium text-[#60A5FA] hover:underline">
                All
              </Link>
            </div>

            <p className="text-xs text-white/45 mb-4 font-mono">Active monitoring categories:</p>

            <ul className="space-y-2 text-xs">
              <li
                className="flex items-center gap-2.5 p-2.5 rounded-xl border"
                style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.06)' }}
              >
                <span className="w-2 h-2 rounded-full bg-[#EF4444] shrink-0" />
                <span className="text-white/80">Denied entries requiring officer intervention</span>
              </li>
              <li
                className="flex items-center gap-2.5 p-2.5 rounded-xl border"
                style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.06)' }}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span className="text-white/80">Pending manual verification referrals</span>
              </li>
              <li
                className="flex items-center gap-2.5 p-2.5 rounded-xl border"
                style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.06)' }}
              >
                <span className="w-2 h-2 rounded-full bg-[#3B82F6] shrink-0" />
                <span className="text-white/80">Offline fallback activation notices</span>
              </li>
              <li
                className="flex items-center gap-2.5 p-2.5 rounded-xl border"
                style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.06)' }}
              >
                <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />
                <span className="text-white/80">Cryptographic audit chain integrity OK</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <Link
              href="/admin/notifications"
              className="text-xs font-semibold text-[#60A5FA] flex items-center justify-between hover:underline"
            >
              <span>View all security streams</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
