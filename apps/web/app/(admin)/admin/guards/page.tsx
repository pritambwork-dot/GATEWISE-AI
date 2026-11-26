'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Shield,
  Search,
  Plus,
  CheckCircle2,
  AlertOctagon,
  SlidersHorizontal,
  UserX,
  UserCheck,
  FileText,
  X,
  Key,
  Lock,
  Unlock,
  History,
  UserPlus,
} from 'lucide-react';
import { liveSync } from '@/lib/services/live-sync';
import {
  GuardAccount,
  GuardPermissions,
  RegisteredPerson,
  AuditLogEntry,
} from '@/types';

function SecurityGuardsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'list' | 'permissions' | 'guard_created' | 'audit'>(
    tabParam === 'permissions'
      ? 'permissions'
      : tabParam === 'guard_created'
      ? 'guard_created'
      : tabParam === 'audit'
      ? 'audit'
      : 'list'
  );

  const [guards, setGuards] = useState<GuardAccount[]>(() => liveSync.getGuards());
  const [persons, setPersons] = useState<RegisteredPerson[]>(() => liveSync.getPersons());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => liveSync.getAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');

  // Add Guard Modal
  const [addGuardOpen, setAddGuardOpen] = useState(false);
  const [newBadge, setNewBadge] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newGateCode, setNewGateCode] = useState('GATE-01');
  const [newGateName, setNewGateName] = useState('Main Gate 01');
  const [newShift, setNewShift] = useState('Day Shift (06:00 - 18:00)');
  const [newRegMode, setNewRegMode] = useState<'APPROVAL_REQUIRED' | 'DIRECT_PERMISSION'>('APPROVAL_REQUIRED');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (tabParam === 'permissions' || tabParam === 'guard_created' || tabParam === 'audit' || tabParam === 'list') {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  useEffect(() => {
    liveSync.refreshAdminState().then(() => {
      setGuards(liveSync.getGuards());
      setPersons(liveSync.getPersons());
      setAuditLogs(liveSync.getAuditLogs());
    });
    const unsub = liveSync.subscribe(() => {
      setGuards(liveSync.getGuards());
      setPersons(liveSync.getPersons());
      setAuditLogs(liveSync.getAuditLogs());
    });
    return () => unsub();
  }, []);

  const handleCreateGuard = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await liveSync.createGuard({
        badge_number: newBadge.trim().toUpperCase() || `GRD-${Math.floor(200 + Math.random() * 700)}`,
        username: newUsername.trim().toLowerCase(),
        full_name: newName.trim(),
        assigned_gate_code: newGateCode,
        assigned_gate_name: newGateName,
        shift_name: newShift,
        registration_mode: newRegMode,
      });
      setGuards(liveSync.getGuards());
      setAuditLogs(liveSync.getAuditLogs());
      setAddGuardOpen(false);
      setNewBadge('');
      setNewUsername('');
      setNewName('');
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const togglePermission = async (guardId: string, field: keyof GuardPermissions, value: any) => {
    await liveSync.updateGuardPermissions(guardId, { [field]: value });
    setGuards(liveSync.getGuards());
    setAuditLogs(liveSync.getAuditLogs());
  };

  const handleModeSwitch = async (guardId: string, mode: 'APPROVAL_REQUIRED' | 'DIRECT_PERMISSION') => {
    await liveSync.updateGuardPermissions(guardId, {
      registration_mode: mode,
      can_create_person_directly: mode === 'DIRECT_PERMISSION',
    });
    setGuards(liveSync.getGuards());
    setAuditLogs(liveSync.getAuditLogs());
  };

  const filteredGuards = guards.filter((g) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      g.full_name.toLowerCase().includes(q) ||
      g.badge_number.toLowerCase().includes(q) ||
      g.assigned_gate_name.toLowerCase().includes(q)
    );
  });

  const guardCreatedPersons = persons.filter((p) => p.creation_source === 'GUARD_CREATED');
  const permissionAudits = auditLogs.filter(
    (a) =>
      a.resource_type === 'guard_permissions' ||
      a.resource_type === 'guards' ||
      a.action.includes('GUARD')
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Guard Management &amp; Permissions
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#2F5BFF]">
              Admin-Controlled RBAC
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create guard credentials, assign gates, configure Mode 1 (Approval Required) vs Mode 2 (Direct Creation), and revoke access instantly.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddGuardOpen(true)}
          className="px-4 py-2.5 rounded-full text-xs font-bold bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-md flex items-center gap-1.5 w-fit cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Guard Account</span>
        </button>
      </div>

      {/* Sub-Tabs */}
      <div className="inline-flex flex-wrap items-center p-1 bg-white border border-slate-200 rounded-full shadow-xs text-xs font-medium text-slate-600 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('list')}
          className={`px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
            activeTab === 'list' ? 'bg-[#2F5BFF] text-white shadow-xs font-bold' : 'hover:text-slate-900'
          }`}
        >
          Guard Roster ({guards.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('permissions')}
          className={`px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
            activeTab === 'permissions' ? 'bg-[#2F5BFF] text-white shadow-xs font-bold' : 'hover:text-slate-900'
          }`}
        >
          Guard Permissions Management
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('guard_created')}
          className={`px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
            activeTab === 'guard_created' ? 'bg-[#2F5BFF] text-white shadow-xs font-bold' : 'hover:text-slate-900'
          }`}
        >
          Guard-Created Records ({guardCreatedPersons.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
            activeTab === 'audit' ? 'bg-[#2F5BFF] text-white shadow-xs font-bold' : 'hover:text-slate-900'
          }`}
        >
          Permission Audit Log ({permissionAudits.length})
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: GUARD ROSTER                                       */}
      {/* ========================================================= */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search guards by badge ID, name, or gate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 outline-none focus:border-[#2F5BFF]"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-3">GUARD &amp; BADGE</th>
                    <th className="px-5 py-3">ASSIGNED GATE &amp; SHIFT</th>
                    <th className="px-5 py-3">REGISTRATION MODE</th>
                    <th className="px-5 py-3">ACCOUNT STATUS</th>
                    <th className="px-5 py-3 text-right">ADMIN CONTROLS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGuards.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center space-y-2.5">
                          <Shield className="w-8 h-8 text-slate-300" />
                          <p className="text-sm font-semibold text-slate-700">No guard accounts configured yet</p>
                          <p className="text-xs text-slate-400 max-w-md">
                            Create guard accounts via <strong>+ Create Guard Account</strong> or authenticate from the Guard Mobile App to begin configuring permissions.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredGuards.map((g) => (
                      <tr key={g.id} className="hover:bg-slate-50/70">
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-slate-900">{g.full_name}</div>
                          <div className="font-mono text-[10px] text-[#2F5BFF] font-bold">
                            {g.badge_number} · @{g.username}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-800">{g.assigned_gate_name} ({g.assigned_gate_code})</div>
                          <div className="text-[11px] text-slate-400">{g.shift_name}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              g.permissions.registration_mode === 'DIRECT_PERMISSION'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {g.permissions.registration_mode === 'DIRECT_PERMISSION'
                              ? 'Mode 2: Direct Creation'
                              : 'Mode 1: Approval Required'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              g.account_status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {g.account_status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveTab('permissions')}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                            >
                              Configure Permissions
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                const next = g.account_status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
                                await liveSync.updateGuardStatus(g.badge_number, next);
                                setGuards(liveSync.getGuards());
                              }}
                              className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                                g.account_status === 'ACTIVE'
                                  ? 'bg-rose-50 text-[#C93338] border border-rose-200 hover:bg-rose-100'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              }`}
                            >
                              {g.account_status === 'ACTIVE' ? 'Revoke Access' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: GUARD PERMISSIONS MANAGEMENT (SECTION 2C)          */}
      {/* ========================================================= */}
      {activeTab === 'permissions' && (
        <div className="space-y-4">
          <div className="bg-[#EBF0FF] border border-[#D0DEFF] text-[#1E3A8A] rounded-2xl p-4 text-xs flex items-start gap-3">
            <SlidersHorizontal className="w-4 h-4 text-[#2F5BFF] shrink-0 mt-0.5" />
            <div>
              <strong>Guard Permissions Management:</strong> Choose between{' '}
              <strong>Mode 1: Approval Required (Default)</strong> and{' '}
              <strong>Mode 2: Direct Registration Permission</strong>. Direct creation never grants permanent unrestricted access — policy limits apply and every change is logged.
            </div>
          </div>

          {guards.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
              <Key className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No guards registered for permission control</p>
              <p className="text-xs text-slate-400">
                Create a guard account first to customize their registration modes and scanning rights.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {guards.map((g) => (
                <div key={g.id} className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{g.full_name}</h3>
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold text-[#2F5BFF]">
                          {g.badge_number}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            g.account_status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {g.account_status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Gate: {g.assigned_gate_name} ({g.assigned_gate_code}) · Last updated:{' '}
                        {new Date(g.permissions.updated_at).toLocaleString()}
                      </p>
                    </div>

                    {/* Registration Mode Selector */}
                    <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                      <button
                        type="button"
                        onClick={() => handleModeSwitch(g.id, 'APPROVAL_REQUIRED')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                          g.permissions.registration_mode === 'APPROVAL_REQUIRED'
                            ? 'bg-white text-[#2F5BFF] shadow-xs'
                            : 'text-slate-600'
                        }`}
                      >
                        Mode 1: Approval Required
                      </button>
                      <button
                        type="button"
                        onClick={() => handleModeSwitch(g.id, 'DIRECT_PERMISSION')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                          g.permissions.registration_mode === 'DIRECT_PERMISSION'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'text-slate-600'
                        }`}
                      >
                        Mode 2: Direct Creation
                      </button>
                    </div>
                  </div>

                  {/* Policy for Mode 2 Direct Records */}
                  {g.permissions.registration_mode === 'DIRECT_PERMISSION' && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-amber-900 block">
                          Direct Registration Record Policy (Non-Permanent Guard Scope)
                        </span>
                        <span className="text-[11px] text-amber-700">
                          Defines how records created directly by this guard behave in the central database.
                        </span>
                      </div>
                      <select
                        value={g.permissions.direct_record_policy}
                        onChange={(e) =>
                          togglePermission(g.id, 'direct_record_policy', e.target.value)
                        }
                        className="px-3 py-2 rounded-lg border border-amber-300 bg-white text-xs font-semibold text-slate-900 outline-none"
                      >
                        <option value="TEMPORARY_ONLY">Temporary Access Only (12h)</option>
                        <option value="ACTIVE_LIMITED">Active with Limited Scope (24h)</option>
                        <option value="PENDING_FINAL_REVIEW">Pending Final Admin Review</option>
                      </select>
                    </div>
                  )}

                  {/* Granular 7 Permission Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    {[
                      {
                        key: 'can_submit_registration_requests',
                        label: 'Submit Registration Requests',
                        desc: 'Send Mode 1 approval requests to admin',
                      },
                      {
                        key: 'can_create_person_directly',
                        label: 'Create Person Directly (Mode 2)',
                        desc: 'Bypass request queue and write guard-created records',
                      },
                      {
                        key: 'can_register_vehicles',
                        label: 'Register Vehicles',
                        desc: 'Associate license plates with new records',
                      },
                      {
                        key: 'can_capture_upload_photos',
                        label: 'Capture & Upload Photos',
                        desc: 'Allow camera biometric & plate capture',
                      },
                      {
                        key: 'can_edit_own_created_records',
                        label: 'Edit Own Created Records',
                        desc: 'Modify records tagged with this guard ID',
                      },
                      {
                        key: 'can_record_entry_exit',
                        label: 'Record Entry & Exit',
                        desc: 'Confirm verified ingress/egress transactions',
                      },
                      {
                        key: 'can_view_limited_history',
                        label: 'View Limited Scan History',
                        desc: 'Inspect own recent scans on mobile app',
                      },
                    ].map((item) => {
                      const enabled = Boolean(g.permissions[item.key as keyof GuardPermissions]);
                      return (
                        <label
                          key={item.key}
                          className={`p-3 rounded-xl border flex items-start justify-between gap-2 cursor-pointer transition-all ${
                            enabled ? 'bg-slate-50 border-[#2F5BFF]/30' : 'bg-white border-slate-200 opacity-75'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-slate-900">{item.label}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(e) =>
                              togglePermission(
                                g.id,
                                item.key as keyof GuardPermissions,
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 accent-[#2F5BFF] mt-0.5 cursor-pointer"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: GUARD-CREATED RECORDS REVIEW                       */}
      {/* ========================================================= */}
      {activeTab === 'guard_created' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3">PERSON &amp; ID</th>
                  <th className="px-5 py-3">CREATOR GUARD</th>
                  <th className="px-5 py-3">ACCESS STATUS</th>
                  <th className="px-5 py-3">NOTES</th>
                  <th className="px-5 py-3 text-right">ADMIN REVIEW</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {guardCreatedPersons.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                      <p className="text-sm font-semibold text-slate-700">No guard-created records yet</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Records created directly by Mode 2 guards will appear here immediately for administrative review.
                      </p>
                    </td>
                  </tr>
                ) : (
                  guardCreatedPersons.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{p.full_name}</div>
                        <div className="font-mono text-[10px] text-[#2F5BFF]">{p.person_code} · {p.category}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-800">{p.created_by_name}</div>
                        <div className="font-mono text-[10px] text-slate-400">
                          {p.created_by_id} · {new Date(p.registration_date).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {p.account_status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">
                        {p.registration_notes || p.department}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => liveSync.updatePerson(p.id, { account_status: 'ACTIVE_AUTHORIZED' })}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold cursor-pointer"
                        >
                          Approve Access
                        </button>
                        <button
                          type="button"
                          onClick={() => liveSync.updatePerson(p.id, { account_status: 'SUSPENDED' })}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 text-[#C93338] border border-rose-200 font-bold cursor-pointer"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: PERMISSION AUDIT LOG                               */}
      {/* ========================================================= */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3">TIMESTAMP</th>
                  <th className="px-5 py-3">ACTION</th>
                  <th className="px-5 py-3">TARGET GUARD</th>
                  <th className="px-5 py-3">ACTOR</th>
                  <th className="px-5 py-3">RESULT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissionAudits.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                      <p className="text-sm font-semibold text-slate-700">No permission changes logged yet</p>
                    </td>
                  </tr>
                ) : (
                  permissionAudits.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3 font-mono text-[11px] text-slate-500">
                        {new Date(a.timestamp).toLocaleString()}
                      </td>
                      <td className="px-5 py-3 font-bold text-slate-900">{a.action}</td>
                      <td className="px-5 py-3 font-mono text-[#2F5BFF]">{a.resource_id}</td>
                      <td className="px-5 py-3 text-slate-600">{a.actor_email}</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                          {a.result}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CREATE GUARD ACCOUNT MODAL                                */}
      {/* ========================================================= */}
      {addGuardOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateGuard}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#2F5BFF]" />
                <h3 className="font-bold text-base text-slate-900">Create Security Guard Account</h3>
              </div>
              <button
                type="button"
                onClick={() => setAddGuardOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                {formError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Guard Badge ID *</label>
                  <input
                    type="text"
                    required
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value.toUpperCase())}
                    placeholder="e.g. GRD-101"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-mono uppercase outline-none focus:border-[#2F5BFF]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="guard.id"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2F5BFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Officer full name"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2F5BFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Gate</label>
                  <select
                    value={newGateCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      setNewGateCode(code);
                      setNewGateName(
                        code === 'GATE-01'
                          ? 'Main Gate 01'
                          : code === 'GATE-02'
                          ? 'Academic Core Gate 02'
                          : code === 'GATE-03'
                          ? 'Executive Housing Gate'
                          : 'Service Gate 04'
                      );
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#2F5BFF]"
                  >
                    <option value="GATE-01">Main Gate 01</option>
                    <option value="GATE-02">Academic Core Gate 02</option>
                    <option value="GATE-03">Executive Housing Gate</option>
                    <option value="GATE-04">Service Gate 04</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Reg Mode</label>
                  <select
                    value={newRegMode}
                    onChange={(e) => setNewRegMode(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#2F5BFF]"
                  >
                    <option value="APPROVAL_REQUIRED">Mode 1: Approval Required</option>
                    <option value="DIRECT_PERMISSION">Mode 2: Direct Creation</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAddGuardOpen(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold border border-slate-200 text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full text-xs font-bold bg-[#2F5BFF] text-white shadow-md cursor-pointer"
              >
                Create Guard
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function SecurityGuardsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-slate-400">Loading Guard Management...</div>}>
      <SecurityGuardsContent />
    </Suspense>
  );
}
