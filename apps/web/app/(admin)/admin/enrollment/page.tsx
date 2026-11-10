'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck, CheckCircle2, XCircle, Clock, AlertCircle,
  Shield, UserCheck, RefreshCw, ChevronRight, X, MessageSquare,
  Building, User, Filter, ArrowUpRight
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
        setSelectedRequest(null);
        setActionMessage(null);
      }, 1500);
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
        setSelectedRequest(null);
        setActionMessage(null);
      }, 1500);
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gatewise-text tracking-tight">
            Field Enrollment Referrals
          </h1>
          <p className="text-xs text-gatewise-secondary mt-1">
            Review and adjudicate identity enrollment referrals initiated by field security guards at perimeter checkpoints.
          </p>
        </div>

        <button
          onClick={loadRequests}
          disabled={isLoading}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-gatewise-border bg-white text-xs font-semibold text-gatewise-secondary hover:text-gatewise-text hover:bg-background-secondary transition-all shadow-xs self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-gatewise-primary' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Total Referrals</span>
            <FileCheck className="w-4 h-4 text-gatewise-primary" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{total}</div>
          <span className="text-[10px] text-gatewise-secondary mt-0.5 block">Lifetime field submissions</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1.5 font-mono">{pending}</div>
          <span className="text-[10px] text-amber-700 font-medium mt-0.5 block">Requires administrator sign-off</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Approved</span>
            <CheckCircle2 className="w-4 h-4 text-gatewise-success" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{approved}</div>
          <span className="text-[10px] text-gatewise-success font-medium mt-0.5 block">Enrolled & indexed</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Rejected</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{rejected}</div>
          <span className="text-[10px] text-gatewise-secondary mt-0.5 block">Declined referrals</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-background-secondary border border-gatewise-border w-fit">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === st
                ? 'bg-white text-gatewise-text shadow-xs border border-gatewise-border'
                : 'text-gatewise-secondary hover:text-gatewise-text'
            }`}
          >
            {st === 'ALL' ? 'All Referrals' : st.replace(/_/g, ' ')}
            {st === 'PENDING' && pending > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[9px]">
                {pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Referrals Queue Table */}
      <div className="rounded-2xl bg-white border border-gatewise-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gatewise-border bg-background-secondary/60 text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary">
                <th className="py-3 px-4">Subject Candidate</th>
                <th className="py-3 px-4">Proposed Category</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Submitting Guard / Gate</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gatewise-border">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gatewise-secondary">
                    <FileCheck className="w-8 h-8 text-gatewise-border mx-auto mb-2" />
                    <p className="font-semibold text-sm text-gatewise-text">No enrollment referrals found</p>
                    <p className="text-xs text-gatewise-secondary mt-1">
                      {statusFilter !== 'ALL'
                        ? `No referrals currently matching status: ${statusFilter}`
                        : 'Field referrals submitted by guards on Android terminals will appear here.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const st = req.status || req.request_status || 'PENDING';
                  const isPending = st === 'PENDING';
                  const isApproved = st === 'APPROVED';
                  const isRejected = st === 'REJECTED';

                  return (
                    <tr
                      key={req.id}
                      onClick={() => {
                        setSelectedRequest(req);
                        setAdminNotes(req.admin_notes || req.administrator_notes || '');
                      }}
                      className="hover:bg-background-secondary/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-gatewise-text">{req.person_name}</div>
                        <div className="text-[10px] font-mono text-gatewise-secondary">Ref #{req.id.substring(0, 8)}</div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gatewise-light text-gatewise-deep border border-gatewise-mint">
                          {req.proposed_category}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-medium text-gatewise-text">{req.department}</span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-gatewise-text font-medium">Gate ID: {req.gate_id}</div>
                        <div className="text-[10px] font-mono text-gatewise-secondary">Guard: {req.submitted_by_guard_id}</div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono text-gatewise-text">
                          {new Date(req.submitted_at || req.created_at || Date.now()).toLocaleTimeString()}
                        </div>
                        <div className="text-[10px] text-gatewise-secondary font-mono">
                          {new Date(req.submitted_at || req.created_at || Date.now()).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isPending
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : isApproved
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {st}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(req);
                            setAdminNotes(req.admin_notes || req.administrator_notes || '');
                          }}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-gatewise-border bg-white text-gatewise-secondary hover:text-gatewise-text hover:bg-background-secondary transition-all"
                        >
                          {isPending ? 'Review & Adjudicate' : 'View Record'}
                          <ChevronRight className="w-3 h-3 inline ml-0.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Adjudication Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-gatewise-border shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gatewise-border flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gatewise-text">
                    Field Enrollment Adjudication
                  </h3>
                  <div className="text-xs font-mono text-gatewise-secondary">
                    Request ID: {selectedRequest.id}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-8 h-8 rounded-full border border-gatewise-border flex items-center justify-center text-gatewise-secondary hover:bg-background-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {actionMessage && (
                <div
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center space-x-2 ${
                    actionMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {actionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{actionMessage.text}</span>
                </div>
              )}

              {/* Referral Details */}
              <div className="p-4 rounded-2xl bg-background-secondary/50 border border-gatewise-border space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gatewise-secondary">
                  Field Referral Information
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Candidate Subject</span>
                    <span className="font-bold text-gatewise-text text-sm">{selectedRequest.person_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Proposed Affiliation</span>
                    <span className="font-semibold text-gatewise-primary">{selectedRequest.proposed_category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Department</span>
                    <span className="font-semibold text-gatewise-text">{selectedRequest.department}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Submitted Timestamp</span>
                    <span className="font-mono text-gatewise-text">
                      {new Date(selectedRequest.submitted_at || selectedRequest.created_at || Date.now()).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Checkpoint Location</span>
                    <span className="font-mono text-gatewise-text">Gate {selectedRequest.gate_id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Referring Guard</span>
                    <span className="font-mono text-gatewise-text">{selectedRequest.submitted_by_guard_id}</span>
                  </div>
                </div>
              </div>

              {/* Biometric Capture Notice */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start space-x-3 text-xs text-emerald-900">
                <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p>
                  Upon administrative approval, the reference face embedding generated at the terminal will be indexed into the institutional registry under compliant identity management protocols.
                </p>
              </div>

              {/* Adjudication Notes */}
              <div className="space-y-2">
                <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px]">
                  Administrator Adjudication Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide verification justification, institutional ID allocation, or rejection rationale..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20 placeholder:text-gatewise-secondary"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-background-secondary/60 border-t border-gatewise-border flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 rounded-xl border border-gatewise-border text-xs font-semibold text-gatewise-secondary hover:bg-white transition-colors"
              >
                Close
              </button>

              {(selectedRequest.status || selectedRequest.request_status || 'PENDING') === 'PENDING' ? (
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-all flex items-center space-x-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject Referral</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="px-5 py-2 rounded-xl bg-gatewise-primary text-white text-xs font-bold hover:bg-gatewise-deep transition-all shadow-xs flex items-center space-x-1.5"
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
                <div className="text-xs font-bold text-gatewise-secondary">
                  Adjudicated Status: {selectedRequest.status || selectedRequest.request_status}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
