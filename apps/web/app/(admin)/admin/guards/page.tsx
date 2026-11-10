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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gatewise-text tracking-tight">
            Security Guard & Operator Directory
          </h1>
          <p className="text-xs text-gatewise-secondary mt-1">
            Manage guard credentials, monitor station assignments, and enforce session security policies.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadGuards}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-gatewise-border bg-white text-xs font-semibold text-gatewise-secondary hover:text-gatewise-text hover:bg-background-secondary transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-gatewise-primary' : ''}`} />
            <span>Sync Guards</span>
          </button>

          <button
            onClick={() => {
              setErrorMessage('');
              setIsInviteModalOpen(true);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gatewise-primary text-white text-xs font-bold hover:bg-gatewise-deep transition-all shadow-xs"
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
        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Total Guards</span>
            <Shield className="w-4 h-4 text-gatewise-primary" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{total}</div>
          <span className="text-[10px] text-gatewise-secondary mt-0.5 block">Registered security officers</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Active & Eligible</span>
            <CheckCircle2 className="w-4 h-4 text-gatewise-success" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{active}</div>
          <span className="text-[10px] text-gatewise-success font-medium mt-0.5 block">Permitted terminal access</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Currently On Duty</span>
            <DoorClosed className="w-4 h-4 text-gatewise-teal" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{onDuty}</div>
          <span className="text-[10px] text-gatewise-secondary mt-0.5 block">Assigned to active gate</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Suspended</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{suspended}</div>
          <span className="text-[10px] text-gatewise-secondary mt-0.5 block">Access denied at gate</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gatewise-border shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-background-secondary border border-gatewise-border">
          {['ALL', 'ACTIVE', 'SUSPENDED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-white text-gatewise-text shadow-xs border border-gatewise-border'
                  : 'text-gatewise-secondary hover:text-gatewise-text'
              }`}
            >
              {st === 'ALL' ? 'All Guards' : st}
            </button>
          ))}
        </div>

        <div className="relative min-w-[280px] flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gatewise-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Officer Name, Employee ID, or Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text placeholder:text-gatewise-secondary focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gatewise-secondary hover:text-gatewise-text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Guards Table */}
      <div className="rounded-2xl bg-white border border-gatewise-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gatewise-border bg-background-secondary/60 text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary">
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Officer Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Active Station</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gatewise-border">
              {filteredGuards.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gatewise-secondary">
                    <Shield className="w-8 h-8 text-gatewise-border mx-auto mb-2" />
                    <p className="font-semibold text-sm text-gatewise-text">No security guards found</p>
                    <p className="text-xs text-gatewise-secondary mt-1">
                      Enroll a guard to grant Android terminal verification authority.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredGuards.map((g) => {
                  const isActive = g.account_status === 'ACTIVE';

                  return (
                    <tr
                      key={g.id}
                      onClick={() => setSelectedGuard(g)}
                      className="hover:bg-background-secondary/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-gatewise-primary bg-gatewise-light px-2.5 py-1 rounded-md border border-gatewise-mint">
                          {g.employee_id}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-gatewise-text">{g.full_name}</div>
                        <div className="text-[10px] text-gatewise-secondary font-mono">{g.role}</div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono text-gatewise-text">{g.email || 'None on record'}</span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {g.assigned_gate ? (
                          <div className="flex items-center space-x-1.5">
                            <DoorClosed className="w-3.5 h-3.5 text-gatewise-primary" />
                            <span className="font-semibold text-gatewise-text">{g.assigned_gate.code} — {g.assigned_gate.name}</span>
                          </div>
                        ) : (
                          <span className="text-gatewise-secondary italic">Unassigned</span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {g.account_status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleToggleStatus(g)}
                            disabled={actionLoading === g.id}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                              isActive
                                ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                                : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {isActive ? 'Suspend' : 'Activate'}
                          </button>

                          <button
                            onClick={() => handleRevokeSessions(g.id)}
                            disabled={actionLoading === g.id}
                            className="px-2 py-1 text-xs font-semibold rounded-lg border border-gatewise-border bg-white text-gatewise-secondary hover:text-gatewise-text transition-all"
                            title="Revoke active mobile sessions"
                          >
                            <LogOut className="w-3.5 h-3.5 inline mr-1" />
                            Revoke
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

      {/* Guard Detail Drawer */}
      {selectedGuard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-gatewise-border shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gatewise-border flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gatewise-light flex items-center justify-center text-gatewise-primary border border-gatewise-mint">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gatewise-text">
                    {selectedGuard.full_name}
                  </h3>
                  <div className="text-xs font-mono text-gatewise-secondary">
                    {selectedGuard.employee_id} • {selectedGuard.role}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedGuard(null)}
                className="w-8 h-8 rounded-full border border-gatewise-border flex items-center justify-center text-gatewise-secondary hover:bg-background-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="p-4 rounded-2xl bg-background-secondary/50 border border-gatewise-border space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gatewise-secondary">
                  Account Details
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Employee ID</span>
                    <span className="font-mono font-bold text-gatewise-text">{selectedGuard.employee_id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Account Status</span>
                    <span className={`font-bold ${selectedGuard.account_status === 'ACTIVE' ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {selectedGuard.account_status}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Email</span>
                    <span className="font-mono text-gatewise-text">{selectedGuard.email || 'None on record'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Current Station</span>
                    <span className="font-semibold text-gatewise-text">
                      {selectedGuard.assigned_gate ? selectedGuard.assigned_gate.name : 'Unassigned'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Terminal Security Policy */}
              <div className="p-4 rounded-2xl border border-gatewise-border space-y-2 text-xs">
                <div className="flex items-center space-x-1.5 font-bold text-gatewise-text">
                  <Lock className="w-4 h-4 text-gatewise-primary" />
                  <span>Terminal Access Security</span>
                </div>
                <p className="text-xs text-gatewise-secondary leading-relaxed">
                  Security guards possess sovereign verification decision authority at perimeter checkpoints. All gate events are signed with the guard's HMAC token.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-background-secondary/60 border-t border-gatewise-border flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedGuard(null)}
                className="px-4 py-2 rounded-xl border border-gatewise-border text-xs font-semibold text-gatewise-secondary hover:bg-white transition-colors"
              >
                Close
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleStatus(selectedGuard)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedGuard.account_status === 'ACTIVE'
                      ? 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {selectedGuard.account_status === 'ACTIVE' ? 'Suspend Access' : 'Activate Access'}
                </button>

                <button
                  onClick={() => handleRevokeSessions(selectedGuard.id)}
                  className="px-3 py-1.5 rounded-xl border border-gatewise-border bg-white text-gatewise-text text-xs font-bold hover:bg-background-secondary transition-all"
                >
                  Revoke Device
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enroll Guard Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-gatewise-border shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gatewise-border flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gatewise-light flex items-center justify-center text-gatewise-primary border border-gatewise-mint">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gatewise-text">
                    Enroll Security Guard
                  </h3>
                  <p className="text-xs text-gatewise-secondary">
                    Create credentials for the Android mobile application.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="w-8 h-8 rounded-full border border-gatewise-border flex items-center justify-center text-gatewise-secondary hover:bg-background-secondary transition-colors"
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
                <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                  Employee ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GRD-004"
                  value={inviteForm.employee_id}
                  onChange={(e) => setInviteForm({ ...inviteForm, employee_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border font-mono text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                />
              </div>

              <div>
                <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Vance"
                  value={inviteForm.full_name}
                  onChange={(e) => setInviteForm({ ...inviteForm, full_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                />
              </div>

              <div>
                <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                  Official Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. m.vance@security.institution.edu"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border font-mono text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                />
              </div>

              <div>
                <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                  Initial Password (Optional)
                </label>
                <input
                  type="password"
                  placeholder="Leave blank for default institutional password"
                  value={inviteForm.password}
                  onChange={(e) => setInviteForm({ ...inviteForm, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border font-mono text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                />
              </div>

              <div className="pt-4 border-t border-gatewise-border flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gatewise-border text-gatewise-secondary font-semibold hover:bg-background-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gatewise-primary text-white font-bold hover:bg-gatewise-deep transition-all shadow-xs flex items-center space-x-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Register Officer</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
