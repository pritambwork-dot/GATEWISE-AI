'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  QrCode, UserPlus, Search, Filter, CheckCircle2, LogIn, LogOut,
  Clock, Shield, Building, Phone, Calendar, RefreshCw, X, ChevronRight,
  AlertTriangle, Copy, Check
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gatewise-text tracking-tight">
            Institutional Visitor & Guest Management
          </h1>
          <p className="text-xs text-gatewise-secondary mt-1">
            Issue pre-approved passes, monitor active on-campus guests, and log perimeter entry and exit times.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadVisitors}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-gatewise-border bg-white text-xs font-semibold text-gatewise-secondary hover:text-gatewise-text hover:bg-background-secondary transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-gatewise-primary' : ''}`} />
            <span>Sync Passes</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gatewise-primary text-white text-xs font-bold hover:bg-gatewise-deep transition-all shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Issue Visitor Pass</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Currently On Campus</span>
            <LogIn className="w-4 h-4 text-gatewise-primary" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{onCampus}</div>
          <span className="text-[10px] text-gatewise-success font-medium mt-0.5 block">Active within perimeter</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Expected Today</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{expected}</div>
          <span className="text-[10px] text-gatewise-secondary mt-0.5 block">Awaiting arrival</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Checked Out Today</span>
            <LogOut className="w-4 h-4 text-gatewise-teal" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{checkedOut}</div>
          <span className="text-[10px] text-gatewise-secondary mt-0.5 block">Exited via gate terminals</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Total Passes</span>
            <QrCode className="w-4 h-4 text-gatewise-deep" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{total}</div>
          <span className="text-[10px] text-gatewise-secondary mt-0.5 block">Issued in registry</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gatewise-border shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-background-secondary border border-gatewise-border">
          {['ALL', 'CHECKED_IN', 'EXPECTED', 'CHECKED_OUT', 'EXPIRED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-white text-gatewise-text shadow-xs border border-gatewise-border'
                  : 'text-gatewise-secondary hover:text-gatewise-text'
              }`}
            >
              {st === 'ALL' ? 'All Passes' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="relative min-w-[280px] flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gatewise-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Visitor Name, Pass Code, or Host..."
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

      {/* Visitors Table */}
      <div className="rounded-2xl bg-white border border-gatewise-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gatewise-border bg-background-secondary/60 text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary">
                <th className="py-3 px-4">Pass Code</th>
                <th className="py-3 px-4">Visitor Name</th>
                <th className="py-3 px-4">Host & Department</th>
                <th className="py-3 px-4">Purpose of Visit</th>
                <th className="py-3 px-4">Valid Window</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Perimeter Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gatewise-border">
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gatewise-secondary">
                    <QrCode className="w-8 h-8 text-gatewise-border mx-auto mb-2" />
                    <p className="font-semibold text-sm text-gatewise-text">No visitor passes found</p>
                    <p className="text-xs text-gatewise-secondary mt-1">
                      Issue a new pass to pre-authorize visitor ingress.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredVisitors.map((v) => {
                  const isCheckedIn = v.status === 'CHECKED_IN';
                  const isExpected = v.status === 'EXPECTED';

                  return (
                    <tr
                      key={v.id}
                      onClick={() => setSelectedVisitor(v)}
                      className="hover:bg-background-secondary/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-gatewise-primary bg-gatewise-light px-2.5 py-1 rounded-md border border-gatewise-mint">
                          {v.pass_code}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-gatewise-text">{v.visitor_name}</div>
                        <div className="text-[10px] text-gatewise-secondary font-mono">{v.phone}</div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-gatewise-text">{v.host_name}</div>
                        <div className="text-[10px] text-gatewise-secondary">{v.host_department}</div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-gatewise-text font-medium">{v.purpose}</span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono text-gatewise-text">{v.valid_date}</div>
                        <div className="text-[10px] text-gatewise-secondary">Until {v.valid_until_time}</div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isCheckedIn
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isExpected
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}
                        >
                          {v.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5" onClick={(e) => e.stopPropagation()}>
                          {isExpected && (
                            <button
                              onClick={() => handleCheckIn(v.pass_code)}
                              disabled={actionLoading === v.pass_code}
                              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gatewise-primary text-white hover:bg-gatewise-deep transition-all shadow-xs flex items-center space-x-1"
                            >
                              <LogIn className="w-3 h-3" />
                              <span>Check In</span>
                            </button>
                          )}
                          {isCheckedIn && (
                            <button
                              onClick={() => handleCheckOut(v.pass_code)}
                              disabled={actionLoading === v.pass_code}
                              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-gatewise-border bg-white text-gatewise-text hover:bg-background-secondary transition-all shadow-xs flex items-center space-x-1"
                            >
                              <LogOut className="w-3 h-3" />
                              <span>Check Out</span>
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedVisitor(v)}
                            className="px-2 py-1 text-xs font-semibold rounded-lg border border-gatewise-border bg-white text-gatewise-secondary hover:text-gatewise-text transition-all"
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

      {/* Visitor Detail Drawer */}
      {selectedVisitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-gatewise-border shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gatewise-border flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gatewise-light flex items-center justify-center text-gatewise-primary border border-gatewise-mint">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gatewise-text">
                    Visitor Pass Credentials
                  </h3>
                  <div className="text-xs font-mono text-gatewise-secondary">
                    Pass Code: {selectedVisitor.pass_code}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedVisitor(null)}
                className="w-8 h-8 rounded-full border border-gatewise-border flex items-center justify-center text-gatewise-secondary hover:bg-background-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Pass Token Card */}
              <div className="p-5 rounded-2xl bg-gatewise-text text-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                    Perimeter Authorization Token
                  </span>
                  <button
                    onClick={() => handleCopyCode(selectedVisitor.pass_code)}
                    className="flex items-center space-x-1 text-xs text-gray-300 hover:text-white"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-2xl font-black tracking-widest text-emerald-300">
                  {selectedVisitor.pass_code}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-300 pt-2 border-t border-white/10">
                  <span>Authorized Guest: <b className="text-white">{selectedVisitor.visitor_name}</b></span>
                  <span className="font-mono">{selectedVisitor.status}</span>
                </div>
              </div>

              {/* Visit Details */}
              <div className="p-4 rounded-2xl bg-background-secondary/50 border border-gatewise-border space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gatewise-secondary">
                  Host & Destination
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Host Sponsor</span>
                    <span className="font-bold text-gatewise-text">{selectedVisitor.host_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Department</span>
                    <span className="font-semibold text-gatewise-text">{selectedVisitor.host_department}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Purpose</span>
                    <span className="text-gatewise-text">{selectedVisitor.purpose}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Visitor Phone</span>
                    <span className="font-mono text-gatewise-text">{selectedVisitor.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Government ID</span>
                    <span className="font-mono text-gatewise-text">{selectedVisitor.id_type}: {selectedVisitor.id_number}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Valid Date</span>
                    <span className="font-mono text-gatewise-text">{selectedVisitor.valid_date} ({selectedVisitor.valid_until_time})</span>
                  </div>
                </div>
              </div>

              {/* Timestamp telemetry */}
              <div className="p-4 rounded-2xl border border-gatewise-border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gatewise-secondary">Check-In Timestamp</span>
                  <span className="font-mono font-bold text-gatewise-text">
                    {selectedVisitor.check_in_time || selectedVisitor.check_in_at
                      ? new Date(selectedVisitor.check_in_time || selectedVisitor.check_in_at!).toLocaleString()
                      : 'Not checked in yet'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gatewise-border">
                  <span className="text-gatewise-secondary">Check-Out Timestamp</span>
                  <span className="font-mono font-bold text-gatewise-text">
                    {selectedVisitor.check_out_time || selectedVisitor.check_out_at
                      ? new Date(selectedVisitor.check_out_time || selectedVisitor.check_out_at!).toLocaleString()
                      : 'Pending departure'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-background-secondary/60 border-t border-gatewise-border flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedVisitor(null)}
                className="px-4 py-2 rounded-xl border border-gatewise-border text-xs font-semibold text-gatewise-secondary hover:bg-white transition-colors"
              >
                Close
              </button>

              <div className="flex items-center space-x-2">
                {selectedVisitor.status === 'EXPECTED' && (
                  <button
                    onClick={() => handleCheckIn(selectedVisitor.pass_code)}
                    disabled={actionLoading === selectedVisitor.pass_code}
                    className="px-4 py-2 rounded-xl bg-gatewise-primary text-white text-xs font-bold hover:bg-gatewise-deep transition-all shadow-xs flex items-center space-x-1"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Check In Guest</span>
                  </button>
                )}
                {selectedVisitor.status === 'CHECKED_IN' && (
                  <button
                    onClick={() => handleCheckOut(selectedVisitor.pass_code)}
                    disabled={actionLoading === selectedVisitor.pass_code}
                    className="px-4 py-2 rounded-xl border border-gatewise-border bg-white text-gatewise-text text-xs font-bold hover:bg-background-secondary transition-all shadow-xs flex items-center space-x-1"
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
          <div className="bg-white rounded-3xl border border-gatewise-border shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gatewise-border flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gatewise-light flex items-center justify-center text-gatewise-primary border border-gatewise-mint">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gatewise-text">
                    Issue Pre-Approved Visitor Pass
                  </h3>
                  <p className="text-xs text-gatewise-secondary">
                    Generates a verifiable code for perimeter checkpoint entry.
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

            <form onSubmit={handleCreatePass} className="p-6 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                    Visitor Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Michael Thorne"
                    value={formData.visitor_name}
                    onChange={(e) => setFormData({ ...formData, visitor_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                    Phone Contact *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border font-mono text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                    ID Verification Type *
                  </label>
                  <select
                    value={formData.id_type}
                    onChange={(e) => setFormData({ ...formData, id_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20 cursor-pointer"
                  >
                    <option value="NATIONAL_ID">National ID / Aadhar</option>
                    <option value="PASSPORT">Passport</option>
                    <option value="DRIVERS_LICENSE">Driver's License</option>
                    <option value="OTHER">Other Institutional Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                    ID Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DL-9831-4091"
                    value={formData.id_number}
                    onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border font-mono text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                    Institutional Host Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Arthur Pendelton"
                    value={formData.host_name}
                    onChange={(e) => setFormData({ ...formData, host_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                    Host Department *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mechanical Engineering"
                    value={formData.host_department}
                    onChange={(e) => setFormData({ ...formData, host_department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                  Purpose of Campus Visit *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Guest Lecture, Lab Inspection, Contractor Maintenance"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                    Valid Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.valid_date}
                    onChange={(e) => setFormData({ ...formData, valid_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                    Valid Until Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.valid_until_time}
                    onChange={(e) => setFormData({ ...formData, valid_until_time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                  />
                </div>
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
                      <span>Generating Pass...</span>
                    </>
                  ) : (
                    <span>Issue Pass</span>
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
