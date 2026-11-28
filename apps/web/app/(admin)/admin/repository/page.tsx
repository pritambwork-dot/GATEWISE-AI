'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Search,
  CheckCircle2,
  AlertTriangle,
  X,
  RefreshCw,
} from 'lucide-react';
import { liveSync } from '@/lib/services/live-sync';
import { extractFaceDescriptorFromFile } from '@/lib/biometrics';
import { RegisteredPerson } from '@/types';

export default function PhotographLibraryPage() {
  const [people, setPeople] = useState<RegisteredPerson[]>(() => liveSync.getPersons());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [qualityMsg, setQualityMsg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setPeople([...liveSync.getPersons()]);
    sync();
    const unsub = liveSync.subscribe(sync);
    liveSync.refreshAdminState().catch(() => {});
    return () => unsub();
  }, []);

  const peopleWithPhotos = useMemo(() => {
    return people
      .filter((p) => Boolean(p.photo_url))
      .filter((p) => {
        if (categoryFilter !== 'ALL' && p.category !== categoryFilter) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.full_name.toLowerCase().includes(q) ||
          (p.person_code || '').toLowerCase().includes(q) ||
          (p.department || '').toLowerCase().includes(q)
        );
      });
  }, [people, categoryFilter, searchQuery]);

  const completedCount = people.filter((p) => p.photo_url && p.enrollment_status === 'COMPLETED').length;
  const failedCount = people.filter((p) => p.photo_url && p.enrollment_status === 'FAILED').length;
  const unassignedCount = people.filter((p) => !p.photo_url).length;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQualityMsg('Running SSD MobileNetV1 + ResNet-34 128-D extraction...');
    const ext = await extractFaceDescriptorFromFile(file);
    if (ext.dataUrl) setPhotoPreview(ext.dataUrl);
    if (ext.ok) {
      setQualityMsg(`Face verified (${ext.width}x${ext.height}px, Quality ${ext.qualityScore}/100) — ready to upload.`);
    } else {
      setQualityMsg(ext.error || 'Could not detect a clear face in this photograph.');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPersonId || !photoPreview) return;
    setUploading(true);
    try {
      const res = await liveSync.uploadPersonPhoto(selectedPersonId, photoPreview, 'UPLOAD');
      if (res.ok) {
        setToast('Photograph uploaded and biometric template updated.');
        setModalOpen(false);
        setPhotoPreview(null);
        setQualityMsg(null);
      } else {
        setQualityMsg(res.error || 'Upload failed.');
      }
    } catch (err: any) {
      setQualityMsg(err?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Photograph &amp; Identity Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage institutional facial photographs stored in private Supabase buckets.
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
            onClick={() => {
              setSelectedPersonId(people[0]?.id || '');
              setPhotoPreview(null);
              setQualityMsg(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#2F5BFF] text-white hover:bg-[#254EDB] transition-colors shadow-xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload photograph</span>
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-[#EEF2FF] border border-[#2F5BFF]/20 text-xs font-semibold text-[#2F5BFF] flex items-center justify-between">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {toast}
          </span>
          <button type="button" onClick={() => setToast(null)} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-medium text-slate-600">Total photographs</span>
          <div className="mt-2 text-2xl font-bold text-slate-900">{peopleWithPhotos.length}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-medium text-slate-600">Enrollment-ready</span>
          <div className="mt-2 text-2xl font-bold text-[#2F5BFF]">{completedCount}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-medium text-slate-600">Failed enrollment</span>
          <div className="mt-2 text-2xl font-bold text-[#C93338]">{failedCount}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-medium text-slate-600">Missing photo</span>
          <div className="mt-2 text-2xl font-bold text-slate-700">{unassignedCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, person ID, or department..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2F5BFF]"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700"
        >
          <option value="ALL">All Categories</option>
          <option value="Student">Student</option>
          <option value="Faculty">Faculty</option>
          <option value="Staff">Staff</option>
          <option value="Visitor">Visitor</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500">
                <th className="py-3 px-4">Photograph</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Person ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Enrollment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {peopleWithPhotos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No photographs uploaded yet. Click &ldquo;Upload photograph&rdquo; to enroll a portrait.
                  </td>
                </tr>
              ) : (
                peopleWithPhotos.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <img
                        src={p.photo_url}
                        alt={p.full_name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                      />
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{p.full_name}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{p.person_code || p.id.slice(0, 8)}</td>
                    <td className="py-3 px-4 text-slate-600">{p.category}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.enrollment_status === 'COMPLETED'
                            ? 'bg-[#EEF2FF] text-[#2F5BFF]'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {p.enrollment_status || 'PENDING'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleUploadSubmit}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Upload Facial Photograph</h2>
              <button type="button" onClick={() => setModalOpen(false)} className="cursor-pointer">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-700 block">Select Person</label>
              <select
                value={selectedPersonId}
                onChange={(e) => setSelectedPersonId(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900"
              >
                {people.length === 0 && <option value="">No registered people found</option>}
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name} ({p.person_code || p.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-700 block">Choose Portrait File</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                required
                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#EEF2FF] file:text-[#2F5BFF] file:font-semibold cursor-pointer"
              />
            </div>

            {photoPreview && (
              <div className="flex justify-center">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-24 h-24 rounded-xl object-cover border border-slate-200"
                />
              </div>
            )}

            {qualityMsg && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[#2F5BFF] shrink-0 mt-0.5" />
                <span>{qualityMsg}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold border border-slate-200 text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading || !selectedPersonId || !photoPreview}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-[#2F5BFF] text-white disabled:opacity-50 cursor-pointer"
              >
                {uploading ? 'Uploading...' : 'Save Photograph'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
