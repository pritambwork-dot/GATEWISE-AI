'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield, UserPlus, Search, Filter, ShieldCheck, ShieldAlert,
  AlertTriangle, RefreshCw, X, ChevronRight, UserX, UserCheck,
  LogOut, Lock, Key, Mail, Building, CheckCircle2, DoorClosed
} from 'lucide-react';
import { api } from '@/lib/services/api';
import { GuardUser } from '@/types';

export default function GuardManagementPage() {
  const [guards, setGuards] = useState<GuardUser[]>([]);
  const [selectedGuard, setSelectedGuard] = useState<GuardUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Actions
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [inviteForm, setInviteForm] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    password: '',
  });

  const loadGuards = async () => {
    setIsLoading(true);
    try {
      const data = await api.listGuards();
      setGuards(data);
    } catch (err) {
      console.error('Failed to load guards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGuards();
  }, []);

  const filteredGuards = useMemo(() => {
    return guards.filter((g) => {
      if (statusFilter !== 'ALL' && g.account_status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = g.full_name.toLowerCase().includes(q);
        const matchesId = g.employee_id.toLowerCase().includes(q);
        const matchesEmail = (g.email || '').toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesEmail) return false;
      }
      return true;
    });
  }, [guards, statusFilter, searchQuery]);

  const handleInviteGuard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await api.inviteGuard(inviteForm);
      setIsInviteModalOpen(false);
      setInviteForm({
        employee_id: '',
        full_name: '',
        email: '',
        password: '',
      });
      setSuccessMessage('Guard credentials generated and registered!');
      setTimeout(() => setSuccessMessage(''), 3000);
      await loadGuards();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create guard account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (guard: GuardUser) => {
    const newStatus = guard.account_status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setActionLoading(guard.id);
    try {
      await api.updateGuardStatus(guard.id, { account_status: newStatus });
      await loadGuards();
      if (selectedGuard?.id === guard.id) {
        setSelectedGuard((prev) => prev ? { ...prev, account_status: newStatus as any } : null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update guard status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeSessions = async (guardId: string) => {
    if (!confirm('Are you sure you want to revoke all active sessions for this guard? They will be signed out on all mobile devices.')) return;
    setActionLoading(guardId);
    try {
      await api.revokeGuardSessions(guardId);
      alert('Active mobile sessions revoked successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to revoke guard sessions');
    } finally {
      setActionLoading(null);
    }
  };

  // Metrics
  const total = guards.length;
  const active = guards.filter(g => g.account_status === 'ACTIVE').length;
  const suspended = guards.filter(g => g.account_status === 'SUSPENDED').length;
  const onDuty = guards.filter(g => g.assigned_gate).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Security Guard & Operator Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage guard credentials, monitor station assignments, and enforce session security policies.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={loadGuards}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-600' : ''}`} />
            <span className="hidden sm:inline">Sync Directory</span>
          </button>

          <button
            onClick={() => {
              setErrorMessage('');
              setIsInviteModalOpen(true);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-teal-800 text-white text-xs font-semibold hover:bg-teal-900 transition-all shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Enroll Guard</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Total Guards</span>
            <Shield className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">{total}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Registered security officers</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Active & Eligible</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">{active}</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">Permitted terminal access</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>On Duty Now</span>
            <DoorClosed className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">{onDuty}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Assigned to active posts</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Suspended</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">{suspended}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Terminal access locked</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/80">
          {['ALL', 'ACTIVE', 'SUSPENDED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All Guards' : st}
            </button>
          ))}
        </div>

        <div className="relative min-w-[280px] flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search officer name, ID, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Guards Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Officer ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Assigned Gate Post</th>
                <th className="py-3 px-4">Active Shift</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuards.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-sm text-slate-800">No security officers found</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Enroll a new guard or clear active filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredGuards.map((guard) => {
                  const isActive = guard.account_status === 'ACTIVE';

                  return (
                    <tr
                      key={guard.id}
                      onClick={() => setSelectedGuard(guard)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80 tabular-nums">
                          {guard.employee_id}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{guard.full_name}</div>
                        {guard.email && <div className="text-[10px] text-slate-500">{guard.email}</div>}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {guard.assigned_gate ? (
                          <div className="flex items-center space-x-1.5 text-teal-800 font-semibold">
                            <DoorClosed className="w-3.5 h-3.5 text-teal-600" />
                            <span>{guard.assigned_gate.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-slate-700 font-mono text-[11px]">
                          {guard.assigned_gate?.shift || 'Standby'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20'
                              : 'bg-rose-50 text-rose-700 ring-1 ring-rose-500/20'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span>{guard.account_status}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(guard);
                            }}
                            disabled={actionLoading === guard.id}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                              isActive
                                ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                                : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {isActive ? 'Suspend' : 'Activate'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedGuard(guard);
                            }}
                            className="px-2 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 transition-all shadow-2xs"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guard Detail Modal */}
      {selectedGuard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200/80 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 border border-teal-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Security Officer Dossier
                  </h3>
                  <div className="text-xs font-mono text-slate-500 tabular-nums">
                    {selectedGuard.employee_id} • {selectedGuard.full_name}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedGuard(null)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Officer Name</span>
                    <span className="font-bold text-slate-900">{selectedGuard.full_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Employee ID</span>
                    <span className="font-mono font-bold text-slate-900">{selectedGuard.employee_id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Email Address</span>
                    <span className="font-mono text-slate-700">{selectedGuard.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Current Status</span>
                    <span className="font-semibold text-emerald-700">{selectedGuard.account_status}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Assigned Gate</span>
                    <span className="font-semibold text-teal-800">{selectedGuard.assigned_gate?.name || 'Unassigned'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Shift Roster</span>
                    <span className="font-mono text-slate-700">{selectedGuard.assigned_gate?.shift || 'Standby'}</span>
                  </div>
                </div>
              </div>

              {/* Session Security */}
              <div className="p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span className="flex items-center space-x-1.5">
                    <Key className="w-4 h-4 text-teal-600" />
                    <span>Mobile Device Session Management</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Active JWT tokens issued to this guard for Android Gatewise Guard terminals can be revoked instantly in case of device loss or security compromise.
                </p>
                <button
                  onClick={() => handleRevokeSessions(selectedGuard.id)}
                  disabled={actionLoading === selectedGuard.id}
                  className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-all"
                >
                  Revoke All Mobile Sessions
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedGuard(null)}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enroll Guard Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200/80 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 border border-teal-200">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Enroll Security Officer
                  </h3>
                  <p className="text-xs text-slate-500">
                    Create credentials for Android mobile guard terminal.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteGuard} className="p-6 space-y-4 text-xs">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Employee ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GRD-004"
                  value={inviteForm.employee_id}
                  onChange={(e) => setInviteForm({ ...inviteForm, employee_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Full Officer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inspector Ramesh Patra"
                  value={inviteForm.full_name}
                  onChange={(e) => setInviteForm({ ...inviteForm, full_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Institutional Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="ramesh@security.apex.edu"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Initial Passcode / Secret *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={inviteForm.password}
                  onChange={(e) => setInviteForm({ ...inviteForm, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-teal-800 text-white hover:bg-teal-900 transition-all shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Enrolling...' : 'Enroll Officer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
