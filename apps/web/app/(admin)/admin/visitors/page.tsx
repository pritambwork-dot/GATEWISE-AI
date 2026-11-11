'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  QrCode, UserPlus, Search, Filter, CheckCircle2, LogIn, LogOut,
  Clock, Shield, Building, Phone, Calendar, RefreshCw, X, ChevronRight,
  AlertTriangle, Copy, Check, Radio, User, Sparkles
} from 'lucide-react';
import { api } from '@/lib/services/api';
import { VisitorPass } from '@/types';

export default function VisitorManagementPage() {
  const [visitors, setVisitors] = useState<VisitorPass[]>([]);
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorPass | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    visitor_name: '',
    phone: '',
    id_type: 'NATIONAL_ID',
    id_number: '',
    host_name: '',
    host_department: '',
    purpose: '',
    valid_date: new Date().toISOString().split('T')[0],
    valid_until_time: '18:00',
  });

  const loadVisitors = async () => {
    setIsLoading(true);
    try {
      const data = await api.listVisitors();
      setVisitors(data);
    } catch (err) {
      console.error('Failed to load visitor passes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => {
      if (statusFilter !== 'ALL' && v.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = v.visitor_name.toLowerCase().includes(q);
        const matchesCode = v.pass_code.toLowerCase().includes(q);
        const matchesHost = v.host_name.toLowerCase().includes(q);
        const matchesDept = v.host_department.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesHost && !matchesDept) return false;
      }
      return true;
    });
  }, [visitors, statusFilter, searchQuery]);

  const handleCreatePass = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await api.createVisitorPass(formData);
      setIsCreateModalOpen(false);
      setFormData({
        visitor_name: '',
        phone: '',
        id_type: 'NATIONAL_ID',
        id_number: '',
        host_name: '',
        host_department: '',
        purpose: '',
        valid_date: new Date().toISOString().split('T')[0],
        valid_until_time: '18:00',
      });
      await loadVisitors();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create visitor pass');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckIn = async (passCode: string) => {
    setActionLoading(passCode);
    try {
      await api.checkInVisitor(passCode);
      await loadVisitors();
      if (selectedVisitor?.pass_code === passCode) {
        setSelectedVisitor((prev) => prev ? { ...prev, status: 'CHECKED_IN', check_in_time: new Date().toISOString() } : null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to check-in visitor');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCheckOut = async (passCode: string) => {
    setActionLoading(passCode);
    try {
      await api.checkOutVisitor(passCode);
      await loadVisitors();
      if (selectedVisitor?.pass_code === passCode) {
        setSelectedVisitor((prev) => prev ? { ...prev, status: 'CHECKED_OUT', check_out_time: new Date().toISOString() } : null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to check-out visitor');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Metrics
  const total = visitors.length;
  const onCampus = visitors.filter(v => v.status === 'CHECKED_IN').length;
  const expected = visitors.filter(v => v.status === 'EXPECTED').length;
  const checkedOut = visitors.filter(v => v.status === 'CHECKED_OUT').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Institutional Visitor & Guest Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Issue pre-approved passes, monitor active on-campus guests, and log perimeter entry and exit times.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={loadVisitors}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-600' : ''}`} />
            <span className="hidden sm:inline">Sync Passes</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-teal-800 text-white text-xs font-semibold hover:bg-teal-900 transition-all shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Issue Visitor Pass</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>On Campus Now</span>
            <LogIn className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2 font-mono tabular-nums">{onCampus}</div>
          <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
            Active within perimeter
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Expected Today</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">{expected}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Awaiting arrival</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Checked Out Today</span>
            <LogOut className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">{checkedOut}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Departed stations</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Total Passes</span>
            <QrCode className="w-4 h-4 text-teal-800" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">{total}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Issued passes</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/80 overflow-x-auto">
          {['ALL', 'CHECKED_IN', 'EXPECTED', 'CHECKED_OUT', 'EXPIRED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All Passes' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="relative min-w-[280px] flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search visitor, code, host, or department..."
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

      {/* Visitors Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Pass Code</th>
                <th className="py-3 px-4">Visitor Name</th>
                <th className="py-3 px-4">Host & Department</th>
                <th className="py-3 px-4">Purpose of Visit</th>
                <th className="py-3 px-4">Valid Window</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Perimeter Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500">
                    <QrCode className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-sm text-slate-800">No visitor passes found</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Issue a new visitor pass or clear search filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredVisitors.map((v) => {
                  const isCheckedIn = v.status === 'CHECKED_IN';
                  const isCheckedOut = v.status === 'CHECKED_OUT';
                  const isExpected = v.status === 'EXPECTED';

                  return (
                    <tr
                      key={v.id}
                      onClick={() => setSelectedVisitor(v)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80 tabular-nums">
                          {v.pass_code}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{v.visitor_name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{v.phone}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{v.host_name}</div>
                        <div className="text-[10px] text-slate-500">{v.host_department}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-slate-700">{v.purpose}</span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono text-slate-700 tabular-nums">{v.valid_date}</div>
                        <div className="text-[10px] text-slate-400 font-mono tabular-nums">Until {v.valid_until_time}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isCheckedIn && (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>CHECKED IN</span>
                          </span>
                        )}
                        {isCheckedOut && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 ring-1 ring-slate-200 font-mono">
                            CHECKED OUT
                          </span>
                        )}
                        {isExpected && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-500/20 font-mono">
                            EXPECTED
                          </span>
                        )}
                        {!isCheckedIn && !isCheckedOut && !isExpected && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 ring-1 ring-rose-500/20 font-mono">
                            {v.status}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          {isExpected && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCheckIn(v.pass_code);
                              }}
                              disabled={actionLoading === v.pass_code}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-all"
                            >
                              <LogIn className="w-3 h-3 inline mr-1 text-teal-700" />
                              Check In
                            </button>
                          )}
                          {isCheckedIn && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCheckOut(v.pass_code);
                              }}
                              disabled={actionLoading === v.pass_code}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-all"
                            >
                              <LogOut className="w-3 h-3 inline mr-1 text-slate-600" />
                              Check Out
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVisitor(v);
                            }}
                            className="px-2 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 transition-all shadow-2xs"
                          >
                            Pass
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

      {/* Visitor Detail Pass Modal (Digital Credential Pass Card) */}
      {selectedVisitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200/80 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 border border-teal-200">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Visitor Pass Credentials
                  </h3>
                  <div className="text-xs font-mono text-slate-500 tabular-nums">
                    Pass Code: {selectedVisitor.pass_code}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedVisitor(null)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Digital Pass Card (Apple Wallet / Titanium aesthetic) */}
              <div className="p-5 rounded-2xl bg-slate-950 text-white space-y-3.5 border border-white/10 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                      Perimeter Ingress Pass
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(selectedVisitor.pass_code)}
                    className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="font-mono text-3xl font-black tracking-widest text-emerald-400 tabular-nums">
                  {selectedVisitor.pass_code}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 pt-3 border-t border-white/10">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Guest Name</span>
                    <span className="font-bold text-white text-sm">{selectedVisitor.visitor_name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Clearance</span>
                    <span className="font-mono text-emerald-400 font-semibold">{selectedVisitor.status}</span>
                  </div>
                </div>
              </div>

              {/* Host & Destination Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Host & Destination
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Host Sponsor</span>
                    <span className="font-bold text-slate-900">{selectedVisitor.host_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Department</span>
                    <span className="font-semibold text-slate-700">{selectedVisitor.host_department}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Purpose</span>
                    <span className="text-slate-800">{selectedVisitor.purpose}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Visitor Phone</span>
                    <span className="font-mono text-slate-700">{selectedVisitor.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Government ID</span>
                    <span className="font-mono text-slate-700">{selectedVisitor.id_type}: {selectedVisitor.id_number}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Valid Date</span>
                    <span className="font-mono text-slate-700 tabular-nums">{selectedVisitor.valid_date} ({selectedVisitor.valid_until_time})</span>
                  </div>
                </div>
              </div>

              {/* Timestamp telemetry */}
              <div className="p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Check-In Timestamp</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {selectedVisitor.check_in_time || selectedVisitor.check_in_at
                      ? new Date(selectedVisitor.check_in_time || selectedVisitor.check_in_at!).toLocaleString()
                      : 'Not checked in yet'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-500">Check-Out Timestamp</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {selectedVisitor.check_out_time || selectedVisitor.check_out_at
                      ? new Date(selectedVisitor.check_out_time || selectedVisitor.check_out_at!).toLocaleString()
                      : 'Pending departure'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedVisitor(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white transition-colors"
              >
                Close Pass
              </button>

              <div className="flex items-center space-x-2">
                {selectedVisitor.status === 'EXPECTED' && (
                  <button
                    onClick={() => handleCheckIn(selectedVisitor.pass_code)}
                    disabled={actionLoading === selectedVisitor.pass_code}
                    className="px-4 py-2 rounded-xl bg-teal-800 text-white text-xs font-semibold hover:bg-teal-900 transition-all shadow-xs flex items-center space-x-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Check In Guest</span>
                  </button>
                )}
                {selectedVisitor.status === 'CHECKED_IN' && (
                  <button
                    onClick={() => handleCheckOut(selectedVisitor.pass_code)}
                    disabled={actionLoading === selectedVisitor.pass_code}
                    className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs font-semibold hover:bg-slate-100 transition-all shadow-xs flex items-center space-x-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Check Out Guest</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Pass Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200/80 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 border border-teal-200">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Issue Pre-Approved Visitor Pass
                  </h3>
                  <p className="text-xs text-slate-500">
                    Generates a verifiable code for perimeter checkpoint entry.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePass} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Visitor Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya Roy"
                    value={formData.visitor_name}
                    onChange={(e) => setFormData({ ...formData, visitor_name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Govt ID Type</label>
                  <select
                    value={formData.id_type}
                    onChange={(e) => setFormData({ ...formData, id_type: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="NATIONAL_ID">Aadhaar / National ID</option>
                    <option value="PASSPORT">Passport</option>
                    <option value="DRIVING_LICENSE">Driving License</option>
                    <option value="OTHER">Other Institutional ID</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">ID Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5421 8901 2345"
                    value={formData.id_number}
                    onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Host Sponsor</label>
                  <input
                    type="text"
                    required
                    placeholder="Prof. K. Verma"
                    value={formData.host_name}
                    onChange={(e) => setFormData({ ...formData, host_name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Host Department</label>
                  <input
                    type="text"
                    required
                    placeholder="Computer Science"
                    value={formData.host_department}
                    onChange={(e) => setFormData({ ...formData, host_department: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  required
                  placeholder="Guest Lecture / Advisory Board Meeting"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Valid Date</label>
                  <input
                    type="date"
                    required
                    value={formData.valid_date}
                    onChange={(e) => setFormData({ ...formData, valid_date: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Valid Until Time</label>
                  <input
                    type="time"
                    required
                    value={formData.valid_until_time}
                    onChange={(e) => setFormData({ ...formData, valid_until_time: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-teal-800 text-white hover:bg-teal-900 transition-all shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Issuing Pass...' : 'Issue Visitor Pass'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
