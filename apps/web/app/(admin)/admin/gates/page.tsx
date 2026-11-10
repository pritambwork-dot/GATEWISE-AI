'use client';

import React, { useState, useEffect } from 'react';
import {
  DoorClosed, Plus, ShieldCheck, Activity, CheckCircle2,
  AlertTriangle, Clock, MapPin, RefreshCw, X, UserCheck,
  Settings, Check, Radio, ChevronRight
} from 'lucide-react';
import { api } from '@/lib/services/api';
import { GateStatus, GuardUser } from '@/types';

export default function GateManagementPage() {
  const [gates, setGates] = useState<GateStatus[]>([]);
  const [guards, setGuards] = useState<GuardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGate, setSelectedGate] = useState<GateStatus | null>(null);

  // Forms
  const [createForm, setCreateForm] = useState({
    gate_code: '',
    gate_name: '',
    location: '',
    operating_hours: '24/7 Operations',
    status: 'ACTIVE',
  });

  const [assignForm, setAssignForm] = useState({
    guard_id: '',
    shift_name: 'Morning Shift (06:00 - 14:00)',
  });

  const [editForm, setEditForm] = useState({
    gate_name: '',
    location: '',
    operating_hours: '',
    status: 'ACTIVE',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [gList, guardList] = await Promise.all([
        api.listGates(),
        api.listGuards('ACTIVE').catch(() => [])
      ]);
      setGates(gList);
      setGuards(guardList);
    } catch (err) {
      console.error('Failed to load gates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateGate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await api.createGate(createForm);
      setIsCreateModalOpen(false);
      setCreateForm({
        gate_code: '',
        gate_name: '',
        location: '',
        operating_hours: '24/7 Operations',
        status: 'ACTIVE',
      });
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create gate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignGuard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGate || !assignForm.guard_id) return;
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await api.assignGuardToGate({
        gate_id: selectedGate.id,
        guard_id: assignForm.guard_id,
        shift_name: assignForm.shift_name,
      });
      setIsAssignModalOpen(false);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to assign guard');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditGate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGate) return;
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await api.updateGate(selectedGate.id, editForm);
      setIsEditModalOpen(false);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update gate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (gate: GateStatus) => {
    setSelectedGate(gate);
    setEditForm({
      gate_name: gate.name,
      location: gate.location,
      operating_hours: gate.operating_hours || '24/7 Operations',
      status: gate.status,
    });
    setErrorMsg('');
    setIsEditModalOpen(true);
  };

  const openAssignModal = (gate: GateStatus) => {
    setSelectedGate(gate);
    setAssignForm({
      guard_id: guards[0]?.id || '',
      shift_name: 'Morning Shift (06:00 - 14:00)',
    });
    setErrorMsg('');
    setIsAssignModalOpen(true);
  };

  // Metrics
  const totalGates = gates.length;
  const activeGates = gates.filter(g => g.status === 'ACTIVE').length;
  const maintenanceGates = gates.filter(g => g.status === 'MAINTENANCE').length;
  const totalScans = gates.reduce((acc, g) => acc + (g.today_scans_count || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gatewise-text tracking-tight">
            Perimeter Gate & Terminal Management
          </h1>
          <p className="text-xs text-gatewise-secondary mt-1">
            Configure physical checkpoints, monitor terminal online health, and dispatch sovereign guards on duty.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-gatewise-border bg-white text-xs font-semibold text-gatewise-secondary hover:text-gatewise-text hover:bg-background-secondary transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-gatewise-primary' : ''}`} />
            <span>Sync Gates</span>
          </button>

          <button
            onClick={() => {
              setErrorMsg('');
              setIsCreateModalOpen(true);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gatewise-primary text-white text-xs font-bold hover:bg-gatewise-deep transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Gate Station</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Total Checkpoints</span>
            <DoorClosed className="w-4 h-4 text-gatewise-primary" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{totalGates}</div>
          <span className="text-[10px] text-gatewise-secondary mt-0.5 block">Configured perimeter posts</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Online & Active</span>
            <CheckCircle2 className="w-4 h-4 text-gatewise-success" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{activeGates}</div>
          <span className="text-[10px] text-gatewise-success font-medium mt-0.5 block">Operational telemetry live</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Under Maintenance</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{maintenanceGates}</div>
          <span className="text-[10px] text-gatewise-secondary mt-0.5 block">Diagnostics in progress</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Today's Total Scans</span>
            <Activity className="w-4 h-4 text-gatewise-teal" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{totalScans}</div>
          <span className="text-[10px] text-gatewise-secondary mt-0.5 block">Across all active gates</span>
        </div>
      </div>

      {/* Gates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gates.map((gate) => {
          const isActive = gate.status === 'ACTIVE';
          const isMaintenance = gate.status === 'MAINTENANCE';

          return (
            <div
              key={gate.id}
              className="p-5 rounded-2xl bg-white border border-gatewise-border shadow-xs hover:border-gatewise-primary/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Status & Code */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-gatewise-primary bg-gatewise-light px-2.5 py-1 rounded-lg border border-gatewise-mint">
                    {gate.code}
                  </span>
                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isMaintenance
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    <span>{gate.status}</span>
                  </span>
                </div>

                {/* Gate Name & Location */}
                <h3 className="text-base font-black text-gatewise-text mt-3">
                  {gate.name}
                </h3>
                <div className="flex items-center space-x-1.5 text-xs text-gatewise-secondary mt-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{gate.location}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] text-gatewise-secondary mt-1 font-mono">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span>{gate.operating_hours || '24/7 Operations'}</span>
                </div>

                {/* Assigned Guard Box */}
                <div className="mt-4 p-3 rounded-xl bg-background-secondary/60 border border-gatewise-border">
                  <span className="text-[10px] uppercase font-bold text-gatewise-secondary tracking-wider block">
                    Guard on Duty
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-gatewise-primary" />
                      <span className="text-xs font-bold text-gatewise-text">
                        {gate.active_guard_name || 'Station Unassigned'}
                      </span>
                    </div>
                    {gate.active_guard_employee_id && (
                      <span className="text-[10px] font-mono text-gatewise-secondary bg-white px-2 py-0.5 rounded border border-gatewise-border">
                        {gate.active_guard_employee_id}
                      </span>
                    )}
                  </div>
                </div>

                {/* Today's Scan Stats */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gatewise-border text-center">
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Scans</span>
                    <span className="font-mono font-bold text-gatewise-text text-xs">{gate.today_scans_count || 0}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gatewise-success block">Admitted</span>
                    <span className="font-mono font-bold text-gatewise-success text-xs">{gate.today_verified_count || 0}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Exceptions</span>
                    <span className="font-mono font-bold text-gatewise-text text-xs">{gate.today_denied_count || 0}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-5 pt-3 border-t border-gatewise-border">
                <button
                  onClick={() => openAssignModal(gate)}
                  className="px-3 py-1.5 rounded-xl border border-gatewise-border bg-white text-xs font-bold text-gatewise-text hover:bg-background-secondary transition-colors flex items-center justify-center space-x-1"
                >
                  <UserCheck className="w-3.5 h-3.5 text-gatewise-primary" />
                  <span>Assign</span>
                </button>
                <button
                  onClick={() => openEditModal(gate)}
                  className="px-3 py-1.5 rounded-xl border border-gatewise-border bg-white text-xs font-bold text-gatewise-secondary hover:text-gatewise-text hover:bg-background-secondary transition-colors flex items-center justify-center space-x-1"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configure</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Gate Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-gatewise-border shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gatewise-border flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gatewise-light flex items-center justify-center text-gatewise-primary border border-gatewise-mint">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gatewise-text">
                    Add Perimeter Gate Station
                  </h3>
                  <p className="text-xs text-gatewise-secondary">
                    Register a physical checkpoint post into the campus network.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full border border-gatewise-border flex items-center justify-center text-gatewise-secondary hover:bg-background-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGate} className="p-6 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                    Gate Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GATE-04"
                    value={createForm.gate_code}
                    onChange={(e) => setCreateForm({ ...createForm, gate_code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border font-mono text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                    Initial Status *
                  </label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20 cursor-pointer"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="OFFLINE">OFFLINE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                  Gate Display Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Complex Gate"
                  value={createForm.gate_name}
                  onChange={(e) => setCreateForm({ ...createForm, gate_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                />
              </div>

              <div>
                <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                  Campus Location / Sector *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. West Campus, Engineering Block A"
                  value={createForm.location}
                  onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                />
              </div>

              <div>
                <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                  Operating Hours
                </label>
                <input
                  type="text"
                  placeholder="e.g. 24/7 Operations or 06:00 - 22:00"
                  value={createForm.operating_hours}
                  onChange={(e) => setCreateForm({ ...createForm, operating_hours: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                />
              </div>

              <div className="pt-4 border-t border-gatewise-border flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
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
                    <span>Register Gate</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Guard Modal */}
      {isAssignModalOpen && selectedGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-gatewise-border shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gatewise-border flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gatewise-light flex items-center justify-center text-gatewise-primary border border-gatewise-mint">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gatewise-text">
                    Assign Guard to Station
                  </h3>
                  <p className="text-xs text-gatewise-secondary">
                    {selectedGate.code} — {selectedGate.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="w-8 h-8 rounded-full border border-gatewise-border flex items-center justify-center text-gatewise-secondary hover:bg-background-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignGuard} className="p-6 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                  Select Security Guard *
                </label>
                <select
                  value={assignForm.guard_id}
                  onChange={(e) => setAssignForm({ ...assignForm, guard_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20 cursor-pointer"
                >
                  <option value="">Select an active guard...</option>
                  {guards.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.full_name} ({g.employee_id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                  Deployment Shift
                </label>
                <select
                  value={assignForm.shift_name}
                  onChange={(e) => setAssignForm({ ...assignForm, shift_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20 cursor-pointer"
                >
                  <option value="Morning Shift (06:00 - 14:00)">Morning Shift (06:00 - 14:00)</option>
                  <option value="Day Shift (14:00 - 22:00)">Day Shift (14:00 - 22:00)</option>
                  <option value="Night Shift (22:00 - 06:00)">Night Shift (22:00 - 06:00)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gatewise-border flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gatewise-border text-gatewise-secondary font-semibold hover:bg-background-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !assignForm.guard_id}
                  className="px-5 py-2 rounded-xl bg-gatewise-primary text-white font-bold hover:bg-gatewise-deep transition-all shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Assigning...</span>
                    </>
                  ) : (
                    <span>Confirm Assignment</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Configure Gate Modal */}
      {isEditModalOpen && selectedGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-gatewise-border shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gatewise-border flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gatewise-light flex items-center justify-center text-gatewise-primary border border-gatewise-mint">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gatewise-text">
                    Configure Station: {selectedGate.code}
                  </h3>
                  <p className="text-xs text-gatewise-secondary">
                    Update operational status and terminal metadata.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full border border-gatewise-border flex items-center justify-center text-gatewise-secondary hover:bg-background-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditGate} className="p-6 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                  Operational Status *
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20 cursor-pointer"
                >
                  <option value="ACTIVE">ACTIVE (Fully Operational)</option>
                  <option value="MAINTENANCE">MAINTENANCE (Offline for Servicing)</option>
                  <option value="OFFLINE">OFFLINE (Terminal Decommissioned)</option>
                </select>
              </div>

              <div>
                <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                  Gate Display Name
                </label>
                <input
                  type="text"
                  value={editForm.gate_name}
                  onChange={(e) => setEditForm({ ...editForm, gate_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                />
              </div>

              <div>
                <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                  Campus Location
                </label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                />
              </div>

              <div>
                <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={editForm.operating_hours}
                  onChange={(e) => setEditForm({ ...editForm, operating_hours: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                />
              </div>

              <div className="pt-4 border-t border-gatewise-border flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
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
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
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
