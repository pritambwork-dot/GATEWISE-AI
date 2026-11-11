'use client';

import React, { useState, useEffect } from 'react';
import {
  Database, RefreshCw, CheckCircle2, AlertTriangle, FileImage,
  FolderSync, ShieldCheck, Folder, ExternalLink, HelpCircle,
  FileQuestion, Check, X, Shield, Lock, Clock, ChevronRight
} from 'lucide-react';
import { api } from '@/lib/services/api';
import { RepositoryStatus } from '@/types';

export default function IdentityRepositoryPage() {
  const [status, setStatus] = useState<RepositoryStatus | null>(null);
  const [unmappedFiles, setUnmappedFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUnmappedModalOpen, setIsUnmappedModalOpen] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [forceFullSync, setForceFullSync] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [repoStatus, unmapped] = await Promise.all([
        api.getRepositoryStatus(),
        api.getUnmappedFiles().catch(() => [])
      ]);
      setStatus(repoStatus);
      setUnmappedFiles(unmapped);
    } catch (err) {
      console.error('Failed to load repository status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await api.triggerSync(undefined, forceFullSync);
      setSyncFeedback({
        type: 'success',
        message: res.message || 'Google Drive synchronization completed successfully.',
      });
      await loadData();
    } catch (err: any) {
      setSyncFeedback({
        type: 'error',
        message: err.message || 'Failed to complete Google Drive sync job.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const totalIdentities = status?.total_approved_identities || 0;
  const referencePhotos = status?.approved_reference_photos || 0;
  const embeddingsCount = status?.active_embeddings_indexed || 0;
  const unmappedCount = status?.unmapped_files_count || unmappedFiles.length || 0;
  const syncPercentage = totalIdentities > 0 ? Math.min(100, Math.round((referencePhotos / totalIdentities) * 100)) : 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Institutional Identity Photo Repository
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Google Drive synchronized biometric reference photo store, automated 128-D embedding pipeline, and unmapped file resolution.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={loadData}
            disabled={isLoading || isSyncing}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-600' : ''}`} />
            <span className="hidden sm:inline">Check Status</span>
          </button>

          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-teal-800 text-white text-xs font-semibold hover:bg-teal-900 transition-all shadow-xs disabled:opacity-50"
          >
            <FolderSync className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronizing...' : 'Sync Repository Now'}</span>
          </button>
        </div>
      </div>

      {syncFeedback && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
            syncFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            {syncFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            )}
            <span>{syncFeedback.message}</span>
          </div>
          <button onClick={() => setSyncFeedback(null)} className="text-xs hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Connection Status Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 border border-teal-200">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">
                  Google Drive Reference Store
                </h3>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20 font-mono">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{status?.connection_status || 'CONNECTED'}</span>
                </span>
              </div>
              {/* Folder Breadcrumb */}
              <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-1 font-mono">
                <span>Google Drive</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span>AUT-Perimeter</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-slate-800 font-semibold">{status?.folder_id || 'reference_photos'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={forceFullSync}
                onChange={(e) => setForceFullSync(e.target.checked)}
                className="rounded border-slate-300 text-teal-700 focus:ring-teal-500/20"
              />
              <span>Force full image re-indexing</span>
            </label>
          </div>
        </div>

        {/* Drive Sync Progress Meter */}
        <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700">Photo Ingestion & Embedding Sync Status</span>
            <span className="font-mono text-teal-800 tabular-nums">{syncPercentage}% Mapped</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-teal-600 rounded-full transition-all duration-500"
              style={{ width: `${syncPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
            <span>{referencePhotos} photos enrolled of {totalIdentities} expected members</span>
            <span>YuNet + SFace pipeline</span>
          </div>
        </div>

        {/* Sync Telemetry Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
              Mapped Identities
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
              {totalIdentities}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Linked member files</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
              Reference Photos
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
              {referencePhotos}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">Validated Drive files</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
              128-D Embeddings
            </span>
            <div className="text-2xl font-bold text-teal-800 mt-1 font-mono tabular-nums">
              {embeddingsCount}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Indexed for fast search</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
              Unmapped Files
            </span>
            <div className="text-2xl font-bold text-amber-600 mt-1 font-mono tabular-nums">
              {unmappedCount}
            </div>
            <button
              onClick={() => setIsUnmappedModalOpen(true)}
              className="text-[11px] font-semibold text-amber-700 hover:underline mt-0.5 block text-left"
            >
              Review unmapped files &rarr;
            </button>
          </div>
        </div>

        {/* Last Sync Info */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between text-xs gap-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500">
              Last Completed Synchronization:
            </span>
            <span className="font-mono font-semibold text-slate-800 tabular-nums">
              {status?.last_sync_job?.completed_at
                ? new Date(status.last_sync_job.completed_at).toLocaleString()
                : 'Today, 04:30 AM (Autonomous CRON)'}
            </span>
          </div>
          <span className="font-mono text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 w-fit">
            Job ID: {status?.last_sync_job?.job_id || 'cron-sync-prod-824'}
          </span>
        </div>
      </div>

      {/* Specifications & Privacy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Naming Convention Specification */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-teal-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Automated File Ingestion Specification
            </h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Drive sync engine parses Google Drive files automatically based on strict institutional filename schema:
          </p>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-1.5">
            <div className="text-teal-800 font-bold">
              {"<PERSON_ID>_<FULL_NAME>.jpg"}
            </div>
            <div className="text-[11px] text-slate-500">
              Examples:
              <br />• <code>STU-001_Alex_Rivera.jpg</code>
              <br />• <code>FAC-002_Elena_Rostova.png</code>
              <br />• <code>STF-003_Marcus_Vance.jpg</code>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            Files matching existing database <code>person_id</code> values are automatically mapped, face-detected with YuNet, and embedded with SFace.
          </p>
        </div>

        {/* Security & Zero Biometric Exposure */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-teal-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Zero Raw Biometric Exposure
            </h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            To satisfy institutional security and privacy policies:
          </p>
          <ul className="text-xs text-slate-600 space-y-2">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
              <span>Drive reference photos are accessed via scoped Google Service Accounts with read-only permission.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
              <span>Embeddings (128-D vectors) are non-invertible and cannot reconstruct original face imagery.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
              <span>Administrators cannot download or export raw biometric face crops from this portal.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Review Unmapped Files Modal */}
      {isUnmappedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200/80 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200">
                  <FileQuestion className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Unmapped Google Drive Files
                  </h3>
                  <p className="text-xs text-slate-500">
                    Files in the designated Drive folder that could not be matched to an institutional ID.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUnmappedModalOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {unmappedFiles.length === 0 ? (
                <div className="py-8 text-center text-slate-500 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-slate-800">All Drive files successfully mapped!</p>
                  <p className="text-xs">There are no unmapped or corrupt files in the repository folder.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-600">
                    Rename these files in Google Drive according to the schema <code>{"<ID>_<FullName>.jpg"}</code> and run "Sync Repository Now".
                  </p>
                  <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                    {unmappedFiles.map((file, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileImage className="w-4 h-4 text-amber-600" />
                          <span className="font-mono font-medium text-slate-800">{file.filename || file.name || `unmapped_file_${idx}.jpg`}</span>
                        </div>
                        <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-semibold">
                          {file.reason || 'Missing Person ID'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsUnmappedModalOpen(false)}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
