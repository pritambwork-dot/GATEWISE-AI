'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, UserPlus, Search, Filter, ShieldCheck, Mail, Phone,
  Building, Calendar, CheckCircle2, AlertCircle, X, ChevronRight,
  RefreshCw, Check, Shield, FileText, Lock, ArrowUpRight
} from 'lucide-react';
import { api } from '@/lib/services/api';
import { InstitutionalIdentity } from '@/types';

export default function PeopleIdentitiesPage() {
  const [identities, setIdentities] = useState<InstitutionalIdentity[]>([]);
  const [selectedIdentity, setSelectedIdentity] = useState<InstitutionalIdentity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    person_id: '',
    full_name: '',
    category: 'STUDENT',
    department: '',
    designation: '',
    email: '',
    phone: '',
    clearance_level: 'LEVEL_1_GENERAL',
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const loadIdentities = async () => {
    setIsLoading(true);
    try {
      const data = await api.listIdentities();
      setIdentities(data);
    } catch (err) {
      console.error('Failed to load identities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIdentities();
  }, []);

  const filteredIdentities = useMemo(() => {
    return identities.filter((item) => {
      if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
      if (statusFilter !== 'ALL' && item.identity_status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.full_name.toLowerCase().includes(q);
        const matchesId = (item.person_id || item.institutional_id || '').toLowerCase().includes(q);
        const matchesDept = (item.department || '').toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesDept) return false;
      }
      return true;
    });
  }, [identities, categoryFilter, statusFilter, searchQuery]);

  const handleCreateIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setIsSubmitting(true);
    try {
      await api.createIdentity(formData);
      setIsCreateModalOpen(false);
      setFormData({
        person_id: '',
        full_name: '',
        category: 'STUDENT',
        department: '',
        designation: '',
        email: '',
        phone: '',
        clearance_level: 'LEVEL_1_GENERAL',
        valid_from: new Date().toISOString().split('T')[0],
        valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      await loadIdentities();
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create identity record');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stats
  const totalIdentities = identities.length;
  const activeCount = identities.filter(i => i.identity_status === 'ACTIVE').length;
  const studentCount = identities.filter(i => i.category === 'STUDENT').length;
  const facultyStaffCount = identities.filter(i => i.category === 'FACULTY' || i.category === 'STAFF').length;

  const categories = [
    { id: 'ALL', label: 'All Directory' },
    { id: 'STUDENT', label: 'Students' },
    { id: 'FACULTY', label: 'Faculty' },
    { id: 'STAFF', label: 'Staff' },
    { id: 'CONTRACTOR', label: 'Contractors' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Institutional Identity Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative directory of registered students, faculty, staff, and contractors with perimeter clearance levels.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={loadIdentities}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-600' : ''}`} />
            <span className="hidden sm:inline">Sync Registry</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-teal-800 text-white text-xs font-semibold hover:bg-teal-900 transition-all shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Enroll Identity</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Enrolled Total</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">{totalIdentities}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Identities in directory</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Active Clearance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">{activeCount}</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">Permitted gate ingress</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Students</span>
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">{studentCount}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Undergraduate & Graduate</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Faculty & Staff</span>
            <Building className="w-4 h-4 text-teal-800" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">{facultyStaffCount}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Academic & admin members</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  categoryFilter === cat.id
                    ? 'bg-teal-50 text-teal-900 ring-1 ring-teal-600/30 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
            >
              <option value="ALL">All Clearance Statuses</option>
              <option value="ACTIVE">Active Clearance</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="GRADUATED">Graduated</option>
              <option value="DEACTIVATED">Deactivated</option>
            </select>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Name, Institutional ID, or Department..."
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

      {/* Identities Directory Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Institutional ID</th>
                <th className="py-3 px-4">Full Legal Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Department / Division</th>
                <th className="py-3 px-4">Clearance Status</th>
                <th className="py-3 px-4">Photo Sync</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIdentities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-sm text-slate-800">No matching identities found</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Check your search query or reset category filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredIdentities.map((item) => {
                  const photosCount = item.reference_photos?.length || 0;
                  const isActive = item.identity_status === 'ACTIVE';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedIdentity(item)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80 tabular-nums">
                          {item.person_id || item.institutional_id}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{item.full_name}</div>
                        {item.email && <div className="text-[10px] text-slate-500">{item.email}</div>}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-800 ring-1 ring-teal-600/20">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-medium text-slate-800">{item.department || 'General'}</span>
                        {item.designation && <div className="text-[10px] text-slate-500">{item.designation}</div>}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20'
                              : 'bg-rose-50 text-rose-700 ring-1 ring-rose-500/20'
                          }`}
                        >
                          {item.identity_status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5 text-slate-600">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${photosCount > 0 ? 'text-teal-600' : 'text-amber-500'}`} />
                          <span className="text-[11px] font-mono tabular-nums">{photosCount} photos</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIdentity(item);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-2xs group-hover:border-slate-300"
                        >
                          Profile
                          <ChevronRight className="w-3 h-3 inline ml-0.5 text-slate-400 group-hover:text-teal-600" />
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

      {/* Identity Profile Drawer (Apple-style sheet) */}
      {selectedIdentity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-slate-200/80 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 border border-teal-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedIdentity.full_name}
                  </h3>
                  <div className="text-xs font-mono text-slate-500 tabular-nums">
                    {selectedIdentity.person_id || selectedIdentity.institutional_id} • {selectedIdentity.category}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedIdentity(null)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Core Information */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Department</span>
                    <span className="font-semibold text-slate-900">{selectedIdentity.department || 'Not Assigned'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Designation</span>
                    <span className="font-semibold text-slate-900">{selectedIdentity.designation || 'Member'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email Address</span>
                    <span className="font-mono text-slate-700">{selectedIdentity.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Contact Phone</span>
                    <span className="font-mono text-slate-700">{selectedIdentity.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Clearance Level</span>
                    <span className="font-semibold text-teal-800">{(selectedIdentity as any).clearance_level || 'LEVEL_1_GENERAL'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Account Status</span>
                    <span className="font-bold text-emerald-700">{selectedIdentity.identity_status}</span>
                  </div>
                </div>
              </div>

              {/* Reference Photos */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>Synchronized Reference Photos</span>
                  <span className="font-mono text-slate-500 text-[11px] tabular-nums">
                    {selectedIdentity.reference_photos?.length || 0} enrolled
                  </span>
                </div>
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50">
                  {selectedIdentity.reference_photos && selectedIdentity.reference_photos.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {selectedIdentity.reference_photos.map((photo: any, idx: number) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-200">
                          <img
                            src={photo.photo_url || photo.file_url}
                            alt={`Reference ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-slate-400 text-xs">
                      No physical photos attached. Automatically mapped via Google Drive sync folder.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedIdentity(null)}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enroll Identity Modal */}
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
                    Enroll New Institutional Identity
                  </h3>
                  <p className="text-xs text-slate-500">
                    Create record and assign perimeter access credentials.
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

            <form onSubmit={handleCreateIdentity} className="p-6 space-y-4">
              {createError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {createError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Person ID / Roll No</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STU-2024-001"
                    value={formData.person_id}
                    onChange={(e) => setFormData({ ...formData, person_id: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="STAFF">Staff</option>
                    <option value="CONTRACTOR">Contractor</option>
                    <option value="VISITOR">Visitor</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Clearance Level</label>
                  <select
                    value={formData.clearance_level}
                    onChange={(e) => setFormData({ ...formData, clearance_level: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="LEVEL_1_GENERAL">Level 1 — General Perimeter</option>
                    <option value="LEVEL_2_ACADEMIC">Level 2 — Academic Zones</option>
                    <option value="LEVEL_3_RESTRICTED">Level 3 — Restricted Labs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. MBA Scholar"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Institutional Email</label>
                  <input
                    type="email"
                    placeholder="aarav@apex.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  {isSubmitting ? 'Enrolling...' : 'Enroll Identity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
