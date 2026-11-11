'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck, CheckCircle2, XCircle, Clock, AlertCircle,
  Shield, UserCheck, RefreshCw, ChevronRight, X, MessageSquare,
  Building, User, Filter, ArrowUpRight, Check, Eye
} from 'lucide-react';
import { api } from '@/lib/services/api';
import { EnrollmentReferral } from '@/types';

export default function EnrollmentRequestsPage() {
  const [requests, setRequests] = useState<EnrollmentReferral[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<EnrollmentReferral | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [adminNotes, setAdminNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const data = await api.listEnrollmentRequests();
      setRequests(data);
      if (data.length > 0 && !selectedRequest) {
        setSelectedRequest(data[0]);
        setAdminNotes(data[0].admin_notes || data[0].administrator_notes || '');
      }
    } catch (err) {
      console.error('Failed to load enrollment requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filteredRequests = requests.filter((r) => {
    const st = r.status || r.request_status || 'PENDING';
    if (statusFilter === 'ALL') return true;
    return st === statusFilter;
  });

  const handleApprove = async () => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    setActionMessage(null);
    try {
      await api.approveEnrollmentRequest(selectedRequest.id, adminNotes);
      setActionMessage({ type: 'success', text: 'Enrollment referral successfully approved and enrolled!' });
      setAdminNotes('');
      await loadRequests();
      setTimeout(() => {
        setActionMessage(null);
      }, 3000);
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to approve request' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    setActionMessage(null);
    try {
      await api.rejectEnrollmentRequest(selectedRequest.id, adminNotes);
      setActionMessage({ type: 'success', text: 'Enrollment referral rejected.' });
      setAdminNotes('');
      await loadRequests();
      setTimeout(() => {
        setActionMessage(null);
      }, 3000);
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to reject request' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Metrics
  const total = requests.length;
  const pending = requests.filter(r => (r.status || r.request_status) === 'PENDING').length;
  const approved = requests.filter(r => (r.status || r.request_status) === 'APPROVED').length;
  const rejected = requests.filter(r => (r.status || r.request_status) === 'REJECTED').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Field Enrollment Referrals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review and adjudicate identity enrollment referrals initiated by field security guards at perimeter checkpoints.
          </p>
        </div>

        <button
          onClick={loadRequests}
          disabled={isLoading}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-xs self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-600' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Total Referrals</span>
            <FileCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">{total}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Lifetime field submissions</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2 font-mono tabular-nums">{pending}</div>
          <span className="text-[11px] text-amber-700 font-medium mt-0.5 block">Requires sign-off</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">{approved}</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">Enrolled & indexed</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Rejected</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">{rejected}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Declined referrals</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 w-fit">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === st
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {st === 'ALL' ? 'All Referrals' : st.replace(/_/g, ' ')}
            {st === 'PENDING' && pending > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[9px] font-mono tabular-nums">
                {pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* iPadOS Master-Detail Split Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (Master List) */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/70 text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>Referrals In Queue</span>
            <span className="font-mono text-[11px] text-slate-500 tabular-nums">{filteredRequests.length} records</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
            {filteredRequests.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                No referrals found matching {statusFilter}.
              </div>
            ) : (
              filteredRequests.map((req) => {
                const st = req.status || req.request_status || 'PENDING';
                const isSelected = selectedRequest?.id === req.id;
                const isPending = st === 'PENDING';

                return (
                  <div
                    key={req.id}
                    onClick={() => {
                      setSelectedRequest(req);
                      setAdminNotes(req.admin_notes || req.administrator_notes || '');
                    }}
                    className={`p-4 cursor-pointer transition-all border-l-4 ${
                      isSelected
                        ? 'bg-teal-50/60 border-l-teal-600'
                        : 'hover:bg-slate-50 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm text-slate-900">{req.person_name}</div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                          isPending
                            ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-500/20'
                            : st === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20'
                            : 'bg-rose-50 text-rose-700 ring-1 ring-rose-500/20'
                        }`}
                      >
                        {st}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                      <span>{req.proposed_category}</span>
                      <span>•</span>
                      <span>{req.department}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono tabular-nums">
                      <span>Gate {req.gate_id}</span>
                      <span>{new Date(req.submitted_at || req.created_at || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (Detail Inspection Pane) */}
        <div className="lg:col-span-7">
          {selectedRequest ? (
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-200/80">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-bold text-lg">
                    {selectedRequest.person_name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{selectedRequest.person_name}</h2>
                    <div className="text-xs font-mono text-slate-500 mt-0.5 tabular-nums">
                      Referral ID: {selectedRequest.id}
                    </div>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold font-mono ${
                    (selectedRequest.status || selectedRequest.request_status || 'PENDING') === 'PENDING'
                      ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-500/20'
                      : (selectedRequest.status || selectedRequest.request_status) === 'APPROVED'
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20'
                      : 'bg-rose-50 text-rose-700 ring-1 ring-rose-500/20'
                  }`}
                >
                  {selectedRequest.status || selectedRequest.request_status || 'PENDING'}
                </span>
              </div>

              {actionMessage && (
                <div
                  className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 ${
                    actionMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {actionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{actionMessage.text}</span>
                </div>
              )}

              {/* Subject Metadata Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Field Referral Dossier
                </div>
                <div className="grid grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Proposed Category</span>
                    <span className="font-semibold text-slate-900">{selectedRequest.proposed_category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Assigned Department</span>
                    <span className="font-semibold text-slate-900">{selectedRequest.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Origination Terminal</span>
                    <span className="font-mono text-slate-800">Gate {selectedRequest.gate_id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Submitting Officer</span>
                    <span className="font-mono text-slate-800">{selectedRequest.submitted_by_guard_id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Submission Time</span>
                    <span className="font-mono text-slate-800 tabular-nums">
                      {new Date(selectedRequest.submitted_at || selectedRequest.created_at || Date.now()).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Biometric Status</span>
                    <span className="text-emerald-700 font-semibold">Single-Shot Vector Captured</span>
                  </div>
                </div>
              </div>

              {/* Zero-Knowledge Compliance Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start space-x-3 text-xs text-emerald-900">
                <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Upon administrative sign-off, the single-shot face embedding generated on the terminal is committed into the institutional vector database.
                </p>
              </div>

              {/* Clearance with 12px clearance between metadata and actions */}
              <div className="space-y-3 pt-1">
                <label className="block text-slate-700 font-semibold text-xs">
                  Administrator Adjudication Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Record justification, clearance restrictions, or rejection rationale..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 placeholder:text-slate-400"
                />
              </div>

              {/* Action Buttons (12px top clearance) */}
              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Adjudicated decisions are permanent and cryptographically recorded.
                </span>

                {(selectedRequest.status || selectedRequest.request_status || 'PENDING') === 'PENDING' ? (
                  <div className="flex items-center space-x-2.5">
                    <button
                      type="button"
                      onClick={handleReject}
                      disabled={isProcessing}
                      className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-all flex items-center space-x-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleApprove}
                      disabled={isProcessing}
                      className="px-5 py-2 rounded-xl bg-teal-800 text-white text-xs font-semibold hover:bg-teal-900 transition-all shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Enroll</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-semibold font-mono text-slate-500">
                    Decision: {selectedRequest.status || selectedRequest.request_status}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-12 text-center text-slate-400 text-xs">
              Select an enrollment referral from the master list to inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
