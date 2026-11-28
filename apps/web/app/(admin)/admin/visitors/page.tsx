'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  CheckCircle2,
  X,
  RefreshCw,
} from 'lucide-react';
import { liveSync } from '@/lib/services/live-sync';
import { extractFaceDescriptorFromFile } from '@/lib/biometrics';
import { RegisteredPerson } from '@/types';

export default function VisitorManagementPage() {
  const [people, setPeople] = useState<RegisteredPerson[]>(() => liveSync.getPersons());
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [purpose, setPurpose] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [faceEmbedding, setFaceEmbedding] = useState<number[] | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setPeople([...liveSync.getPersons()]);
    sync();
    const unsub = liveSync.subscribe(sync);
    liveSync.refreshAdminState().catch(() => {});
    return () => unsub();
  }, []);

  const visitors = useMemo(() => {
    return people
      .filter((p) => p.category === 'Visitor' || p.category === 'Contractor' || p.category === 'Delivery' || p.category === 'Temporary Staff')
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.full_name.toLowerCase().includes(q) ||
          (p.phone || '').toLowerCase().includes(q) ||
          (p.department || '').toLowerCase().includes(q)
        );
      });
  }, [people, searchQuery]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = await extractFaceDescriptorFromFile(file);
    if (ext.dataUrl) setPhotoPreview(ext.dataUrl);
    if (ext.ok && ext.embedding) setFaceEmbedding(ext.embedding);
  };

  const handleRegisterVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    setSubmitting(true);
    try {
      await liveSync.addPerson({
        full_name: fullName.trim(),
        phone: phone.trim() || undefined,
        category: 'Visitor',
        department: department.trim() || 'Guest Visit',
        registration_notes: purpose.trim() || 'Registered via Admin Visitor Desk',
        account_status: 'TEMPORARILY_AUTHORIZED',
        creation_source: 'ADMIN_CREATED',
        created_by_id: 'ADMIN',
        created_by_name: 'Administrator',
        valid_from: new Date().toISOString(),
        photo_url: photoPreview || undefined,
        face_embedding: faceEmbedding,
        authorized_gates: ['GATE-01', 'GATE-02'],
        valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
      setNotice(`Visitor "${fullName.trim()}" registered and synced to central database.`);
      setModalOpen(false);
      setFullName('');
      setPhone('');
      setDepartment('');
      setPurpose('');
      setPhotoPreview(null);
      setFaceEmbedding(undefined);
    } catch (err: any) {
      setNotice(err?.message || 'Failed to register visitor.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Visitor Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Register and manage temporary campus visitors synced live to gate terminals.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start">
          <button
            type="button"
            onClick={() => liveSync.refreshAdminState()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:border-[#2F5BFF] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#2F5BFF]" />
            <span>Sync</span>
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register visitor</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-[#EEF2FF] border border-[#2F5BFF]/20 text-xs font-semibold text-[#2F5BFF] flex items-center justify-between">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {notice}
          </span>
          <button type="button" onClick={() => setNotice(null)} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search visitors by name, phone, or organization..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2F5BFF]"
        />
      </div>

      {/* Visitors Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500">
                <th className="py-3 px-4">Visitor</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {visitors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <UserCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No visitors registered yet. Click &ldquo;Register visitor&rdquo; to issue a pass.
                  </td>
                </tr>
              ) : (
                visitors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-semibold text-slate-900">{v.full_name}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{v.phone || '—'}</td>
                    <td className="py-3 px-4 text-slate-600">{v.department || '—'}</td>
                    <td className="py-3 px-4 text-slate-600">{v.registration_notes || '—'}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF2FF] text-[#2F5BFF]">
                        {v.account_status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Visitor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleRegisterVisitor}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Register Visitor</h2>
              <button type="button" onClick={() => setModalOpen(false)} className="cursor-pointer">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Visitor full name"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Organization / Host</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Company or Host Name"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Visit Purpose</label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Meeting / Delivery / Maintenance"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Visitor Photograph (Optional)</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-[#EEF2FF] file:text-[#2F5BFF] file:font-semibold"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-full font-semibold border border-slate-200 text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !fullName.trim()}
                className="px-5 py-2 rounded-full font-semibold bg-[#2F5BFF] text-white disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Registering...' : 'Register Visitor'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
