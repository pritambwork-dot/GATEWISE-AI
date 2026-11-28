'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Search,
  Shield,
  Clock,
  RefreshCw,
  UserCheck,
  Lock,
} from 'lucide-react';
import { liveSync } from '@/lib/services/live-sync';
import { useAuth } from '@/lib/contexts/auth-context';

export default function ActivityAndAuditLogsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'GUARD' | 'ADMIN' | 'SUPER_ADMIN'>('ALL');
  const [auditLogs, setAuditLogs] = useState<any[]>(() => liveSync.getAuditLogs());
  const [refreshing, setRefreshing] = useState(false);

  const isSuperAdmin =
    user?.role === 'SUPER_ADMIN' || user?.employee_id?.toLowerCase() === 'pritam';

  useEffect(() => {
    setAuditLogs(liveSync.getAuditLogs());
    const unsub = liveSync.subscribe(() => {
      setAuditLogs([...liveSync.getAuditLogs()]);
    });
    liveSync.refreshAdminState().catch(() => {});
    return () => unsub();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await liveSync.refreshAdminState();
      setAuditLogs([...liveSync.getAuditLogs()]);
    } finally {
      setRefreshing(false);
    }
  };

  const loginEvents = useMemo(() => {
    return auditLogs
      .filter((log) => String(log.action || '').toUpperCase() === 'LOGIN_SUCCESS')
      .filter((log) => {
        if (roleFilter !== 'ALL' && String(log.actor_role || '').toUpperCase() !== roleFilter) {
          return false;
        }
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          String(log.actor_id || '').toLowerCase().includes(q) ||
          String(log.actor_email || '').toLowerCase().includes(q) ||
          String(log.actor_role || '').toLowerCase().includes(q)
        );
      });
  }, [auditLogs, roleFilter, searchQuery]);

  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return auditLogs;
    const q = searchQuery.toLowerCase();
    return auditLogs.filter(
      (log) =>
        String(log.actor_id || '').toLowerCase().includes(q) ||
        String(log.action || '').toLowerCase().includes(q) ||
        String(log.actor_role || '').toLowerCase().includes(q) ||
        String(log.target_id || '').toLowerCase().includes(q),
    );
  }, [auditLogs, searchQuery]);

  const formatTimestamp = (ts?: string) => {
    if (!ts) return '—';
    try {
      return new Date(ts).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      });
    } catch {
      return ts;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Activity &amp; Audit Logs
            </h1>
            {isSuperAdmin && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEF2FF] text-[#2F5BFF] border border-[#2F5BFF]/20">
                <Shield className="w-3 h-3" />
                SUPER ADMIN VIEW
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isSuperAdmin
              ? 'Full Super Admin visibility into all Guard & Admin login timestamps and gate audit events.'
              : 'Searchable administrative record of gate verification and system events.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#2F5BFF] text-xs font-semibold text-slate-700 cursor-pointer self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#2F5BFF] ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user ID (pritam, arnav, 123...), role, or action..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2F5BFF]"
          />
        </div>

        {isSuperAdmin && (
          <div className="inline-flex rounded-xl bg-white border border-slate-200 p-1 text-xs font-semibold">
            {(['ALL', 'GUARD', 'ADMIN', 'SUPER_ADMIN'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  roleFilter === r
                    ? 'bg-[#2F5BFF] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'ALL' ? 'All Roles' : r}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SUPER ADMIN: Guard & Admin Login Timestamps */}
      {isSuperAdmin ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#2F5BFF]" />
              <h2 className="text-sm font-bold text-slate-900">
                Guard &amp; Admin Login History ({loginEvents.length})
              </h2>
            </div>
            <span className="font-mono text-[11px] text-slate-500">
              Logged on every sign-in
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500">
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Login Date &amp; Time</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loginEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No matching login records found.
                    </td>
                  </tr>
                ) : (
                  loginEvents.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {ev.actor_id}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ev.actor_role === 'SUPER_ADMIN'
                              ? 'bg-[#EEF2FF] text-[#2F5BFF]'
                              : ev.actor_role === 'ADMIN'
                              ? 'bg-slate-100 text-slate-800'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {ev.actor_role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{ev.actor_email || '—'}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#2F5BFF]" />
                          {formatTimestamp(ev.timestamp || ev.created_at)}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {ev.changes?.gate_code ? `Gate ${ev.changes.gate_code}` : 'Dashboard Sign-In'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-center gap-3">
          <Lock className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Detailed Guard &amp; Admin login timestamps are restricted to the Super Admin account (
            <code className="font-mono font-bold text-slate-800">pritam</code>).
          </span>
        </div>
      )}

      {/* General Audit Trail */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-bold text-slate-900">
              System Audit Trail ({filteredLogs.length})
            </h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500">
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No audit events recorded yet.
                  </td>
                </tr>
              ) : (
                filteredLogs.slice(0, 50).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{log.actor_id}</td>
                    <td className="py-3 px-4 text-slate-600">{log.actor_role}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{log.target_id || '—'}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {formatTimestamp(log.timestamp || log.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
