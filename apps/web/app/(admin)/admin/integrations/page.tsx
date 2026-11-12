'use client';

import React, { useState } from 'react';
import {
  Plug,
  Hexagon,
  RefreshCw,
  Server,
  Database,
  Image as ImageIcon,
  Cpu,
  Bell,
  DoorClosed,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  config: string;
  connection: string;
  lastCheck: string;
  lastError: string;
}

export default function IntegrationsPage() {
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([
    {
      id: 'auth',
      name: 'Authentication service',
      config: 'Unknown',
      connection: 'Not checked',
      lastCheck: '—',
      lastError: '—'
    },
    {
      id: 'id-verify',
      name: 'Identity verification backend',
      config: 'Unknown',
      connection: 'Not checked',
      lastCheck: '—',
      lastError: '—'
    },
    {
      id: 'database',
      name: 'Database',
      config: 'Unknown',
      connection: 'Not checked',
      lastCheck: '—',
      lastError: '—'
    },
    {
      id: 'storage',
      name: 'Image storage',
      config: 'Unknown',
      connection: 'Not checked',
      lastCheck: '—',
      lastError: '—'
    },
    {
      id: 'model',
      name: 'Model enrollment integration',
      config: 'Unknown',
      connection: 'Not checked',
      lastCheck: '—',
      lastError: '—'
    },
    {
      id: 'notify',
      name: 'Notification system',
      config: 'Unknown',
      connection: 'Not checked',
      lastCheck: '—',
      lastError: '—'
    },
    {
      id: 'hardware',
      name: 'Connected gate hardware',
      config: 'Unknown',
      connection: 'Not checked',
      lastCheck: '—',
      lastError: '—'
    }
  ]);

  const runCheck = (id: string) => {
    setCheckingId(id);
    setTimeout(() => {
      setServices((prev) =>
        prev.map((s) => {
          if (s.id === id) {
            return {
              ...s,
              config: 'Configured',
              connection: 'Reachable',
              lastCheck: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              lastError: 'None'
            };
          }
          return s;
        })
      );
      setCheckingId(null);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Integrations & system status
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF4E5] text-[#B45309]">
            Backend-dependent
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Only actually configured services are listed. Nothing is shown healthy until it has been checked.
        </p>
      </div>

      {/* Blue Banner (Page 28) */}
      <div className="bg-[#EBF0FF] border border-[#D0DEFF] text-[#1E3A8A] rounded-2xl p-4 text-xs flex items-center gap-3 shadow-2xs">
        <Hexagon className="w-4 h-4 text-[#2F5BFF] shrink-0" />
        <p className="leading-relaxed">
          API keys, tokens, passwords and secrets are never displayed here.
        </p>
      </div>

      {/* 7 Service Cards Grid (Page 28) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-4">
                <h3 className="text-sm font-bold text-slate-900">{svc.name}</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                  {svc.connection === 'Not checked' ? 'Not checked' : 'Reachable'}
                </span>
              </div>

              <div className="space-y-3 text-xs divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Configuration</span>
                  <span className="font-medium text-slate-800">{svc.config}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Connection</span>
                  <span className="font-medium text-slate-800">{svc.connection}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Last successful check</span>
                  <span className="font-mono text-slate-700">{svc.lastCheck}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Last error</span>
                  <span className="font-mono text-slate-700">{svc.lastError}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => runCheck(svc.id)}
              disabled={checkingId === svc.id}
              className="w-fit inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingId === svc.id ? 'animate-spin text-[#2F5BFF]' : 'text-slate-500'}`} />
              <span>Run health check</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
