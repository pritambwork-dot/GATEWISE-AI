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
  Check,
  AlertTriangle,
  XCircle,
  Activity
} from 'lucide-react';
import { api } from '@/lib/services/api';
import { useLanguage } from '@/lib/contexts/language-context';
import { liveSync } from '@/lib/services/live-sync';
import { DashboardMetrics, VerificationEvent } from '@/types';

const appleSpring = { type: 'spring', stiffness: 500, damping: 35 };
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 28 },
  },
};

export default function InstitutionOverviewPage() {
  const { language, t } = useLanguage();
  const [activeRange, setActiveRange] = useState<'today' | '7d' | '30d' | 'custom'>('today');
  const [chartRange, setChartRange] = useState<'today' | '7d' | '30d' | 'custom'>('today');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [events, setEvents] = useState<VerificationEvent[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [activeVisitorsCount, setActiveVisitorsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('not yet');

  const fetchOverviewData = async () => {
    setLoading(true);
    try {
      const [metricsRes, eventsRes] = await Promise.allSettled([
        api.getDashboardMetrics(),
        api.getRecentEvents(undefined, 25)
      ]);

      const localEvents = liveSync.getEvents();
      const localRequests = liveSync.getRegistrationRequests();
      const localVisitors = liveSync.getVisitors();

      if (metricsRes.status === 'fulfilled' && metricsRes.value) {
        setMetrics(metricsRes.value);
      }

      if (eventsRes.status === 'fulfilled' && Array.isArray(eventsRes.value) && eventsRes.value.length > 0) {
        setEvents(eventsRes.value);
      } else {
        setEvents(localEvents);
      }

      setPendingCount(localRequests.filter((r) => r.status === 'PENDING_APPROVAL').length);
      setActiveVisitorsCount(localVisitors.filter((v) => v.status === 'CHECKED_IN').length);
      setLastRefreshedTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    } catch {
      // Backend offline; retain live sync state
    } finally {
      setLoading(false);
    }
  };

  const [liveSyncNotice, setLiveSyncNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchOverviewData();

    // Subscribe to live events from Guard Web App
    const unsubscribe = liveSync.subscribe((msg) => {
      if (msg.type === 'VERIFICATION_EVENT') {
        const newEvent = msg.payload as VerificationEvent;
        setEvents((prev) => [newEvent, ...prev.slice(0, 24)]);
        setMetrics((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            total_scans_today: (prev.total_scans_today || 0) + 1,
            total_exceptions_today:
              newEvent.guard_decision === 'DENY_ENTRY' || newEvent.outcome === 'IDENTIFIED_UNAUTHORIZED'
                ? (prev.total_exceptions_today || 0) + 1
                : prev.total_exceptions_today || 0,
          };
        });
        setLastRefreshedTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
        setLiveSyncNotice(`Field Terminal Event: ${newEvent.person_name || 'Subject'} (${newEvent.guard_decision}) at ${newEvent.gate_name}`);
        setTimeout(() => setLiveSyncNotice(null), 4000);
      } else if (
        msg.type === 'REGISTRATION_REQUEST_CREATED' ||
        msg.type === 'REGISTRATION_REQUEST_APPROVED' ||
        msg.type === 'REGISTRATION_REQUEST_REJECTED'
      ) {
        setPendingCount(liveSync.getRegistrationRequests().filter((r) => r.status === 'PENDING_APPROVAL').length);
      } else if (msg.type === 'VISITOR_CHECKED_IN' || msg.type === 'VISITOR_CHECKED_OUT') {
        setActiveVisitorsCount(liveSync.getVisitors().filter((v) => v.status === 'CHECKED_IN').length);
      }
    });

    return () => unsubscribe();
  }, []);

  const formatEventTime = (isoString?: string) => {
    if (!isoString) return '—';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Real metrics strictly derived from backend or live terminal telemetry (0 when idle)
  const totalScans = Math.max(metrics?.total_scans_today ?? 0, events.length);
  const verifiedIds = events.filter(
    (e) => e.outcome === 'VERIFIED_AUTHORIZED' || e.outcome === 'CASE_1_VERIFIED'
  ).length;
  const authEntries = events.filter((e) => e.guard_decision === 'GRANT_ENTRY').length;
  const deniedEntries = Math.max(
    metrics?.total_exceptions_today ?? 0,
    events.filter((e) => e.guard_decision === 'DENY_ENTRY' || e.outcome === 'DENIED_ENTRY' || e.outcome === 'ACCESS_DENIED').length
  );
  const referredEntries = events.filter(
    (e) => e.outcome === 'REFERRED_SECURITY' || e.outcome === 'CASE_2_PARTIALLY_VERIFIED'
  ).length;
  const completedVerifs = events.length || totalScans;
  const pendingReviews = Math.max(metrics?.pending_enrollment_referrals ?? 0, pendingCount);
  const activeVisitors = Math.max(metrics?.active_visitors_on_campus ?? 0, activeVisitorsCount);
  const activeGuards = new Set(events.map((e) => e.guard_id).filter(Boolean)).size;
  const activeGates = metrics?.active_gates_count ?? (metrics?.gates?.length || 0);

  const verificationPct = totalScans > 0 ? ((completedVerifs / totalScans) * 100).toFixed(1) + '%' : '—';
  const deniedPct = totalScans > 0 ? ((deniedEntries / totalScans) * 100).toFixed(1) + '%' : '0%';
  const permittedPct = totalScans > 0 ? ((authEntries / totalScans) * 100).toFixed(1) + '%' : '0%';

  const formattedToday = new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-7xl mx-auto pb-12"
    >
      {/* ── Page Header ────────────────────────────────────────────── */}
      <AnimatePresence>
        {liveSyncNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/90 shadow-xs flex items-center justify-between text-xs text-emerald-900"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold">⚡ Live Sync Event:</span>
              <span>{liveSyncNotice}</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-700 font-semibold uppercase">
              Field Terminal Synced
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 font-medium mb-1">
            {formattedToday} · {language === 'hi' ? 'आईआईएम संबलपुर परिसर डेस्क' : 'IIM Sambalpur Campus Desk'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {t.overviewHeading}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.overviewSubheading}
          </p>
        </div>

        {/* Date Filter & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented Range Control */}
          <div className="inline-flex items-center p-1 bg-white border border-slate-200/90 rounded-full shadow-2xs text-xs font-medium text-slate-600">
            {(['today', '7d', '30d', 'custom'] as const).map((r) => {
              const labels = {
                today: t.rangeToday,
                '7d': t.range7Days,
                '30d': t.range30Days,
                custom: t.rangeCustom
              };
              const active = activeRange === r;
              return (
                <button
                  key={r}
                  onClick={() => setActiveRange(r)}
                  className={`relative px-3.5 py-1.5 rounded-full transition-colors cursor-pointer ${
                    active ? 'text-white font-bold' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="apple-overview-range-pill"
                      transition={appleSpring}
                      className="absolute inset-0 rounded-full bg-[#2F5BFF] shadow-xs"
                    />
                  )}
                  <span className="relative z-10">{labels[r]}</span>
                </button>
              );
            })}
          </div>

          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={fetchOverviewData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#2F5BFF]' : 'text-slate-500'}`} />
            <span>{language === 'hi' ? 'ताज़ा करें' : 'Refresh'}</span>
          </motion.button>

          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'hi' ? 'निर्यात' : 'Export'}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ── Polling Notice ────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex items-center gap-2 text-xs text-slate-500">
        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
        <span>
          {language === 'hi'
            ? 'रीयल-टाइम सुरक्षा टेलीमेट्री सक्रिय। आईआईएम संबलपुर गेट्स पर सभी प्रमाणीकरण स्थानीय रूप से सत्यापित हैं।'
            : (lastRefreshedTime === 'not yet'
              ? 'Real-time security telemetry active. Operating nominal on-device inference.'
              : `Last refreshed at ${lastRefreshedTime}. Real-time security telemetry active.`)}
        </span>
      </motion.div>

      {/* ── 9 Metric Cards Grid ───────────────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Total Guard Scans */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-700">{t.metricTotalScans}</span>
            <div className="w-8 h-8 rounded-lg bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center shadow-2xs">
              <Scan className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {totalScans.toLocaleString()}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              {language === 'hi' ? 'सक्रिय स्ट्रीम' : 'Active Stream'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {t.metricTotalScansDesc}
          </p>
          <div className="mt-4 border-b border-dashed border-[#2F5BFF]/30" />
        </div>

        {/* 2. Completed Verifications */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-700">{t.metricCompletedVerifications}</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shadow-2xs">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {completedVerifs.toLocaleString()}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
              {verificationPct}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {t.metricCompletedVerificationsDesc}
          </p>
          <div className="mt-4 border-b border-dashed border-slate-300" />
        </div>

        {/* 3. Verified Identities */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-700">{t.metricVerifiedIdentities}</span>
            <div className="w-8 h-8 rounded-lg bg-[#EBF0FF] text-[#2F5BFF] flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {verifiedIds.toLocaleString()}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
              {language === 'hi' ? 'एस-फेस मिलान' : 'SFace Matched'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {t.metricVerifiedIdentitiesDesc}
          </p>
          <div className="mt-4 border-b border-dashed border-[#2F5BFF]/30" />
        </div>

        {/* 4. Authorised Entries */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-700">{t.metricAuthorizedEntries}</span>
            <div className="w-8 h-8 rounded-lg bg-[#E8F8EE] text-[#1FB36B] flex items-center justify-center shadow-2xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {authEntries.toLocaleString()}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              {language === 'hi' ? 'गेट खुला' : 'Gate Open'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {t.metricAuthorizedEntriesDesc}
          </p>
          <div className="mt-4 border-b border-dashed border-[#1FB36B]/30" />
        </div>

        {/* 5. Denied Entries */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-700">{t.metricDeniedEntries}</span>
            <div className="w-8 h-8 rounded-lg bg-[#FEECEC] text-[#C93338] flex items-center justify-center shadow-2xs">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {deniedEntries.toLocaleString()}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
              {deniedPct}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {t.metricDeniedEntriesDesc}
          </p>
          <div className="mt-4 border-b border-dashed border-[#C93338]/30" />
        </div>

        {/* 6. Pending Reviews */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-700">{t.metricPendingReviews}</span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF4E5] text-[#D97706] flex items-center justify-center shadow-2xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {pendingReviews.toLocaleString()}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
              {language === 'hi' ? 'कतार में' : 'In Queue'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {t.metricPendingReviewsDesc}
          </p>
          <div className="mt-4 border-b border-dashed border-amber-300" />
        </div>

        {/* 7. Active Visitors */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-700">{t.metricActiveVisitors}</span>
            <div className="w-8 h-8 rounded-lg bg-[#E6F8F6] text-[#0F766E] flex items-center justify-center shadow-2xs">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {activeVisitors.toLocaleString()}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200">
              {language === 'hi' ? 'परिसर में' : 'On Campus'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {t.metricActiveVisitorsDesc}
          </p>
          <div className="mt-4 border-b border-dashed border-[#12B5A6]/30" />
        </div>

        {/* 8. Active Security Guards */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-700">{t.metricActiveGuards}</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {activeGuards.toLocaleString()}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              {language === 'hi' ? 'ड्यूटी पर' : 'On Duty'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {t.metricActiveGuardsDesc}
          </p>
          <div className="mt-4 border-b border-dashed border-indigo-200" />
        </div>

        {/* 9. Active Gates */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-700">{t.metricActiveGates}</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shadow-2xs">
              <DoorClosed className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {activeGates.toLocaleString()}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200">
              {language === 'hi' ? `${activeGates} चेकपॉइंट` : `${activeGates} Checkpoints`}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {t.metricActiveGatesDesc}
          </p>
          <div className="mt-4 border-b border-dashed border-sky-200" />
        </div>
      </motion.div>

      {/* ── Blue Callout Banner ───────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="bg-[#EBF0FF] border border-[#D0DEFF] text-[#1E3A8A] rounded-2xl p-4 text-xs flex items-start gap-3 shadow-2xs"
      >
        <Info className="w-4 h-4 text-[#2F5BFF] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {t.nominalCallout}
        </p>
      </motion.div>

      {/* ── Dual Panel: Verification Activity & Outcomes ─────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Verification activity chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">{t.activityGraphTitle}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{t.activityGraphSubtitle}</p>
              </div>

              {/* Range pills */}
              <div className="inline-flex items-center p-1 bg-slate-50 border border-slate-200 rounded-full text-xs">
                {(['today', '7d', '30d', 'custom'] as const).map((r) => {
                  const labels = {
                    today: t.rangeToday,
                    '7d': t.range7Days,
                    '30d': t.range30Days,
                    custom: t.rangeCustom
                  };
                  return (
                    <button
                      key={r}
                      onClick={() => setChartRange(r)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                        chartRange === r ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {labels[r]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-600 mb-6">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2F5BFF]" /> {t.metricTotalScans}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7DA4FF]" /> {t.metricCompletedVerifications}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#12B5A6]" /> {t.metricVerifiedIdentities}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1FB36B]" /> {t.badgeAuthorized}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C93338]" /> {t.badgeDenied}
              </span>
            </div>

            {/* Light Theme Activity Bar Graph */}
            <div className="h-64 rounded-xl border border-slate-100 bg-slate-50/50 p-4 flex flex-col justify-end">
              {events.length === 0 && (!metrics?.hourly_traffic || metrics.hourly_traffic.length === 0) ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
                  <Activity className="w-7 h-7 text-slate-300" />
                  <p className="text-xs font-medium text-slate-600">
                    {language === 'hi' ? 'आज कोई सत्यापन स्कैन दर्ज नहीं किया गया' : 'No verification scans recorded today'}
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    {language === 'hi' ? 'फ़ील्ड गार्ड टर्मिनल से लाइव स्कैन होते ही यहाँ गतिविधि ग्राफ़ दिखेगा।' : 'Activity bars will populate automatically as guards verify identities.'}
                  </p>
                </div>
              ) : (
                <div className="flex items-end justify-between gap-3 h-48 px-2">
                  {(metrics?.hourly_traffic && metrics.hourly_traffic.length > 0
                    ? metrics.hourly_traffic.map((slot) => ({
                        time: slot.hour,
                        total: Math.min(100, Math.max(8, (slot.verified_entries + slot.denied_entries) * 10)),
                        auth: Math.min(100, Math.max(8, slot.verified_entries * 10)),
                      }))
                    : ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'].map((hr) => {
                        const hrPrefix = parseInt(hr.split(':')[0], 10);
                        const slotEvts = events.filter((e) => {
                          const h = new Date(e.timestamp).getHours();
                          return h >= hrPrefix && h < hrPrefix + 2;
                        });
                        const authCount = slotEvts.filter((e) => e.guard_decision === 'GRANT_ENTRY').length;
                        return {
                          time: hr,
                          total: slotEvts.length > 0 ? Math.min(100, slotEvts.length * 20) : 4,
                          auth: authCount > 0 ? Math.min(100, authCount * 20) : 0,
                        };
                      })
                  ).map((slot) => (
                    <div key={slot.time} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="w-full flex items-end justify-center gap-1 h-36">
                        <div
                          style={{ height: `${slot.total}%` }}
                          className="w-3 rounded-t-sm bg-[#2F5BFF]/85 group-hover:bg-[#2F5BFF] transition-all"
                          title={`Total: ${slot.total}`}
                        />
                        <div
                          style={{ height: `${slot.auth}%` }}
                          className="w-3 rounded-t-sm bg-[#1FB36B]/85 group-hover:bg-[#1FB36B] transition-all"
                          title={`Authorised: ${slot.auth}`}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{slot.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Outcomes & Gate Activity */}
        <div className="lg:col-span-5 space-y-6">
          {/* Outcomes */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">{t.outcomesTitle}</h2>
            
            <div className="flex items-center gap-6">
              {/* Donut representation */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F1F5F9" strokeWidth="14" />
                  {totalScans > 0 && (
                    <circle
                      cx="50" cy="50" r="40" fill="transparent"
                      stroke="#1FB36B" strokeWidth="14"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * (authEntries / Math.max(1, totalScans)))}
                    />
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-extrabold text-slate-900 block leading-none">{permittedPct}</span>
                  <span className="text-[9px] text-slate-400 uppercase font-mono mt-0.5">
                    {language === 'hi' ? 'स्वीकृत' : 'Permitted'}
                  </span>
                </div>
              </div>

              {/* Status breakdown */}
              <div className="flex-1 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1FB36B]" /> {t.badgeAuthorized}
                  </span>
                  <span className="text-slate-900 font-bold font-mono">{authEntries.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C93338]" /> {t.badgeDenied}
                  </span>
                  <span className="text-slate-900 font-bold font-mono">{deniedEntries.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2F5BFF]" /> {t.badgeReferred}
                  </span>
                  <span className="text-slate-900 font-bold font-mono">{referredEntries.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> {language === 'hi' ? 'लंबित' : 'Pending'}
                  </span>
                  <span className="text-slate-900 font-bold font-mono">{pendingReviews.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-300" /> {language === 'hi' ? 'सेवा अनुपलब्ध' : 'Service Unavailable'}
                  </span>
                  <span className="text-slate-400 font-mono">0</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
              {language === 'hi' ? 'सेवा विफलता अथवा अनुपलब्ध परिणाम को कभी भी अस्वीकृत पहचान नहीं माना जाता।' : 'A service failure or unavailable result is never counted as a denied identity.'}
            </div>
          </div>

          {/* Gate Activity */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">{t.gateActivityTitle}</h2>
              <Link href="/admin/gates" className="text-xs font-semibold text-[#2F5BFF] hover:underline">
                {language === 'hi' ? 'गेट प्रबंधित करें' : 'Manage gates'}
              </Link>
            </div>

            {/* Live Gate Checkpoints */}
            {(!metrics?.gates || metrics.gates.length === 0) ? (
              <div className="py-8 text-center space-y-2 border border-dashed border-slate-200 rounded-xl bg-slate-50/40">
                <DoorClosed className="w-6 h-6 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">
                  {language === 'hi' ? 'कोई सक्रिय गेट चेकपॉइंट कनेक्ट नहीं है' : 'No active gate checkpoints connected'}
                </p>
                <p className="text-[11px] text-slate-400 px-4">
                  {language === 'hi' ? 'नए चेकपॉइंट जोड़ने के लिए गेट प्रबंधन खोलें।' : 'Configure gates in Manage gates to stream checkpoint status.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {metrics.gates.map((g) => (
                  <div key={g.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-mono text-[10px] font-bold">
                        {g.code}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block">{g.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {g.location}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {g.status === 'ACTIVE' ? (language === 'hi' ? 'सक्रिय' : 'Active') : g.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Recent Activity Stream Table ─────────────────────────── */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">{t.recentStreamTitle}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t.recentStreamSubtitle}</p>
          </div>
          <Link href="/admin/verification" className="text-xs font-semibold text-[#2F5BFF] hover:underline flex items-center gap-1">
            <span>{language === 'hi' ? 'सत्यापन केंद्र खोलें' : 'Open Verification Centre'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 px-2">{t.colTime}</th>
                <th className="pb-3 px-3">{t.colIdentity}</th>
                <th className="pb-3 px-3">{t.colGateGuard}</th>
                <th className="pb-3 px-3">{t.colScore}</th>
                <th className="pb-3 px-3">{t.colOutcome}</th>
                <th className="pb-3 px-2 text-right">{t.colAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Shield className="w-7 h-7 text-slate-300" />
                      <p className="text-xs font-semibold text-slate-600">
                        {language === 'hi' ? 'अभी तक कोई सत्यापन रिकॉर्ड नहीं हुआ है' : 'No verification events recorded yet'}
                      </p>
                      <p className="text-[11px] text-slate-400 max-w-md">
                        {language === 'hi' ? 'जब गार्ड मोबाइल ऐप से किसी व्यक्ति या वाहन को सत्यापित करेगा, तो डेटा यहाँ दिखाई देगा।' : 'Live verification scans confirmed from authenticated mobile guard terminals will stream here automatically.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : events.map((ev) => {
                const isAuth = ev.outcome === 'VERIFIED_AUTHORIZED';
                const isDenied = ev.outcome === 'DENIED_ENTRY' || ev.outcome === 'ACCESS_DENIED';
                const isReferred = ev.outcome === 'REFERRED_SECURITY' || ev.outcome === 'POTENTIAL_MATCH';
                const photoUrl = ev.candidate?.reference_photo_url;
                const personId = ev.candidate?.identity_id || ev.person_id || 'ID Pending';

                return (
                  <tr key={ev.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-2 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {formatEventTime(ev.timestamp)}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center">
                            {ev.person_name ? ev.person_name.charAt(0) : '?'}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-slate-900 block">{ev.person_name || 'Unregistered'}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{personId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium whitespace-nowrap">
                      {ev.gate_name || 'Main Gate 01'}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px]">
                      {ev.similarity_score !== undefined ? (
                        <span className={`font-bold ${ev.similarity_score >= 0.9 ? 'text-emerald-600' : ev.similarity_score >= 0.75 ? 'text-amber-600' : 'text-rose-600'}`}>
                          {(ev.similarity_score * 100).toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                          isAuth
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isDenied
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : isReferred
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {isAuth ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : isDenied ? (
                          <XCircle className="w-3 h-3 text-rose-600" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                        )}
                        <span>{isAuth ? t.badgeAuthorized : isDenied ? t.badgeDenied : isReferred ? t.badgeReferred : (ev.outcome || 'VERIFIED')}</span>
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Link
                        href={`/admin/verification`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2F5BFF] hover:underline"
                      >
                        <span>{t.auditLink}</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
