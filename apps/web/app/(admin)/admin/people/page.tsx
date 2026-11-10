'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, UserPlus, Search, Filter, ShieldCheck, Mail, Phone,
  Building, Calendar, CheckCircle2, AlertCircle, X, ChevronRight,
  RefreshCw, Check, Shield, FileText, Lock
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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gatewise-text tracking-tight">
            Institutional Identity Registry
          </h1>
          <p className="text-xs text-gatewise-secondary mt-1">
            Authoritative directory of registered students, faculty, staff, and contractors with perimeter clearance levels.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadIdentities}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-gatewise-border bg-white text-xs font-semibold text-gatewise-secondary hover:text-gatewise-text hover:bg-background-secondary transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-gatewise-primary' : ''}`} />
            <span>Sync Registry</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gatewise-primary text-white text-xs font-bold hover:bg-gatewise-deep transition-all shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Enroll Identity</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Enrolled Total</span>
            <Users className="w-4 h-4 text-gatewise-primary" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{totalIdentities}</div>
          <span className="text-[10px] text-gatewise-secondary mt-0.5 block">Identities in database</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Active Clearance</span>
            <CheckCircle2 className="w-4 h-4 text-gatewise-success" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{activeCount}</div>
          <span className="text-[10px] text-gatewise-success font-medium mt-0.5 block">Permitted gate ingress</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Students</span>
            <ShieldCheck className="w-4 h-4 text-gatewise-teal" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{studentCount}</div>
          <span className="text-[10px] text-gatewise-secondary mt-0.5 block">Undergraduate & Graduate</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-gatewise-border shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary flex items-center justify-between">
            <span>Faculty & Staff</span>
            <Building className="w-4 h-4 text-gatewise-deep" />
          </div>
          <div className="text-2xl font-black text-gatewise-text mt-1.5 font-mono">{facultyStaffCount}</div>
          <span className="text-[10px] text-gatewise-secondary mt-0.5 block">Academic & administrative staff</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gatewise-border shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="STUDENT">Students</option>
            <option value="FACULTY">Faculty</option>
            <option value="STAFF">Staff</option>
            <option value="CONTRACTOR">Contractors</option>
            <option value="VISITOR">Visitors</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Clearance</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="GRADUATED">Graduated</option>
            <option value="DEACTIVATED">Deactivated</option>
          </select>
        </div>

        <div className="relative min-w-[280px] flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gatewise-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Name, Institutional ID, or Dept..."
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

      {/* Identities Directory Table */}
      <div className="rounded-2xl bg-white border border-gatewise-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gatewise-border bg-background-secondary/60 text-[11px] font-bold uppercase tracking-wider text-gatewise-secondary">
                <th className="py-3 px-4">Person ID</th>
                <th className="py-3 px-4">Full Legal Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Department / Division</th>
                <th className="py-3 px-4">Clearance Status</th>
                <th className="py-3 px-4">Photo Sync</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gatewise-border">
              {filteredIdentities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gatewise-secondary">
                    <Users className="w-8 h-8 text-gatewise-border mx-auto mb-2" />
                    <p className="font-semibold text-sm text-gatewise-text">No matching identities found</p>
                    <p className="text-xs text-gatewise-secondary mt-1">
                      Check your search query or clear the filters.
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
                      className="hover:bg-background-secondary/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-gatewise-text bg-background-secondary px-2 py-0.5 rounded border border-gatewise-border">
                          {item.person_id || item.institutional_id}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-gatewise-text">{item.full_name}</div>
                        {item.email && <div className="text-[10px] text-gatewise-secondary">{item.email}</div>}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gatewise-light text-gatewise-deep border border-gatewise-mint">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-medium text-gatewise-text">{item.department}</span>
                        {item.designation && <div className="text-[10px] text-gatewise-secondary">{item.designation}</div>}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {item.identity_status}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5 text-gatewise-secondary">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${photosCount > 0 ? 'text-gatewise-primary' : 'text-amber-500'}`} />
                          <span className="text-[11px] font-medium">{photosCount} synced</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIdentity(item);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-gatewise-border bg-white text-gatewise-secondary hover:text-gatewise-text hover:bg-background-secondary transition-all"
                        >
                          View Profile
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

      {/* Identity Profile Drawer */}
      {selectedIdentity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-gatewise-border shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gatewise-border flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gatewise-light flex items-center justify-center text-gatewise-primary border border-gatewise-mint">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gatewise-text">
                    {selectedIdentity.full_name}
                  </h3>
                  <div className="text-xs font-mono text-gatewise-secondary">
                    {selectedIdentity.person_id || selectedIdentity.institutional_id} • {selectedIdentity.category}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedIdentity(null)}
                className="w-8 h-8 rounded-full border border-gatewise-border flex items-center justify-center text-gatewise-secondary hover:bg-background-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Core Information */}
              <div className="p-4 rounded-2xl bg-background-secondary/50 border border-gatewise-border space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gatewise-secondary">
                  Institutional Profile
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Department</span>
                    <span className="font-bold text-gatewise-text">{selectedIdentity.department}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Designation / Role</span>
                    <span className="font-bold text-gatewise-text">{selectedIdentity.designation || 'Standard Member'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Email Contact</span>
                    <span className="font-mono text-gatewise-text">{selectedIdentity.email || 'None on record'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gatewise-secondary block">Phone Number</span>
                    <span className="font-mono text-gatewise-text">{selectedIdentity.phone || 'None on record'}</span>
                  </div>
                </div>
              </div>

              {/* Biometric Reference Synchronization */}
              <div className="p-4 rounded-2xl border border-gatewise-border space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-gatewise-text flex items-center space-x-1.5">
                    <Shield className="w-4 h-4 text-gatewise-primary" />
                    <span>Biometric Face Embeddings</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    SFace 128-D Model
                  </span>
                </div>
                <p className="text-xs text-gatewise-secondary leading-relaxed">
                  {selectedIdentity.reference_photos?.length || 0} reference images indexed and verified via Google Drive institutional repository.
                </p>
                <div className="p-2.5 rounded-xl bg-background-secondary/60 text-[11px] text-gatewise-secondary flex items-center justify-between">
                  <span>Privacy Protection</span>
                  <span className="font-semibold text-gatewise-text">Raw frames withheld per institutional privacy policy</span>
                </div>
              </div>

              {/* Perimeter Clearance Details */}
              <div className="p-4 rounded-2xl border border-gatewise-border space-y-2">
                <div className="text-xs font-bold text-gatewise-text flex items-center space-x-1.5">
                  <Lock className="w-4 h-4 text-gatewise-primary" />
                  <span>Gate Ingress Authorization</span>
                </div>
                {selectedIdentity.access_authorizations && selectedIdentity.access_authorizations.length > 0 ? (
                  <div className="space-y-2 pt-1">
                    {selectedIdentity.access_authorizations.map((auth) => (
                      <div key={auth.id} className="p-2.5 rounded-xl bg-background-secondary/40 border border-gatewise-border text-xs flex items-center justify-between">
                        <div>
                          <div className="font-bold text-gatewise-text">{auth.access_status}</div>
                          <div className="text-[10px] text-gatewise-secondary">
                            Valid: {auth.valid_from ? new Date(auth.valid_from).toLocaleDateString() : 'Active'} -{' '}
                            {auth.valid_until ? new Date(auth.valid_until).toLocaleDateString() : 'Indefinite'}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono bg-white px-2 py-1 rounded border border-gatewise-border text-gatewise-primary font-bold">
                          All Perimeter Gates
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gatewise-secondary">
                    Clearance is governed by default institutional category policy.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-background-secondary/60 border-t border-gatewise-border flex justify-end">
              <button
                onClick={() => setSelectedIdentity(null)}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-gatewise-primary text-white hover:bg-gatewise-deep transition-all shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enroll Identity Modal */}
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
                    Enroll New Institutional Identity
                  </h3>
                  <p className="text-xs text-gatewise-secondary">
                    Creates an authoritative record in the central institutional database.
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

            <form onSubmit={handleCreateIdentity} className="p-6 space-y-4 text-xs">
              {createError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {createError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                    Institutional Person ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STU-009 or FAC-003"
                    value={formData.person_id}
                    onChange={(e) => setFormData({ ...formData, person_id: e.target.value })}
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
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                    Institutional Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20 cursor-pointer"
                  >
                    <option value="STUDENT">STUDENT</option>
                    <option value="FACULTY">FACULTY</option>
                    <option value="STAFF">STAFF</option>
                    <option value="CONTRACTOR">CONTRACTOR</option>
                    <option value="VISITOR">VISITOR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                    Department / Division *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                    Designation (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Associate Professor"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. s.jenkins@institution.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                    Clearance Level
                  </label>
                  <select
                    value={formData.clearance_level}
                    onChange={(e) => setFormData({ ...formData, clearance_level: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-secondary border border-gatewise-border text-gatewise-text focus:outline-none focus:ring-2 focus:ring-gatewise-primary/20 cursor-pointer"
                  >
                    <option value="LEVEL_1_GENERAL">LEVEL 1 - General Perimeter</option>
                    <option value="LEVEL_2_STAFF">LEVEL 2 - Staff & Labs</option>
                    <option value="LEVEL_3_RESTRICTED">LEVEL 3 - Restricted Facilities</option>
                    <option value="LEVEL_4_HIGH_SECURITY">LEVEL 4 - High Security</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gatewise-secondary font-bold uppercase tracking-wider text-[10px] mb-1">
                    Valid Until Date
                  </label>
                  <input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
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
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Register Identity</span>
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
