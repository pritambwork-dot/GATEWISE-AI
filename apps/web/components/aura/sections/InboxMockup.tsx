import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  ShieldAlert,
  Camera,
  Car,
  QrCode,
  Search,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Activity,
  Layers,
  Fingerprint,
} from 'lucide-react';

interface EntryRecord {
  id: string;
  name: string;
  role: string;
  avatarLetter: string;
  avatarGradient: string;
  gate: string;
  time: string;
  decision: 'GRANTED' | 'FLAGGED' | 'REVIEW';
  cosineScore: number;
  mode: 'YuNet + SFace' | 'Pre-Approved QR' | 'ANPR Vehicle' | 'Emergency Pass';
  vehiclePlate?: string;
  hudImage: string;
  summary: string;
  hash: string;
  details: {
    enrollmentId: string;
    department: string;
    barrierStatus: string;
    guardOnDuty: string;
  };
}

const LIVE_ENTRIES: EntryRecord[] = [
  {
    id: 'ananya',
    name: 'Dr. Ananya Sharma',
    role: 'Dean of Academic Affairs',
    avatarLetter: 'A',
    avatarGradient: 'from-[#00d2ff] to-[#0B2551]',
    gate: 'Main Gate 01',
    time: '9:41 AM',
    decision: 'GRANTED',
    cosineScore: 0.884,
    mode: 'YuNet + SFace',
    hudImage: '/media/screenshots/guard/03_guard_detecting_landmarks.png',
    summary:
      'YuNet isolated 5 facial landmarks in 64ms. SFace on-device cosine match computed at 0.884 (threshold 0.72). Automatic gate release triggered.',
    hash: 'e89a3f2b4c109d7845ba012efc45d31290bbacde4120986754321fedcba09876',
    details: {
      enrollmentId: 'FAC-2021-084',
      department: 'Faculty of Computer Science',
      barrierStatus: 'Auto-lifted (Clearance ID #9841)',
      guardOnDuty: 'Guard Vikram Singh (Post 01)',
    },
  },
  {
    id: 'rahul',
    name: 'Rahul Verma',
    role: 'Senior Scholar (#2024-CS-084)',
    avatarLetter: 'R',
    avatarGradient: 'from-[#A4F4FD] to-[#091020]',
    gate: 'Academic Core Gate 02',
    time: '9:39 AM',
    decision: 'GRANTED',
    cosineScore: 0.792,
    mode: 'YuNet + SFace',
    hudImage: '/media/screenshots/guard/04_guard_biometric_match.png',
    summary:
      'Student pass validated against local edge SQLite database. Zero latency fallback engaged during momentary WAN latency.',
    hash: '3bc104fa8912e76d9018bcfa09148dceba902341efcb78901234567890abcdef',
    details: {
      enrollmentId: 'STU-2024-119',
      department: 'Information Systems PG',
      barrierStatus: 'Auto-lifted (Clearance ID #9840)',
      guardOnDuty: 'Guard Suresh Rao (Post 02)',
    },
  },
  {
    id: 'raghavan',
    name: 'Raghavan Iyer',
    role: 'VIP Guest — Dept of Science',
    avatarLetter: 'R',
    avatarGradient: 'from-[#f59e0b] to-[#78350f]',
    gate: 'Main Gate 01',
    time: '9:35 AM',
    decision: 'GRANTED',
    cosineScore: 0.941,
    mode: 'Pre-Approved QR',
    hudImage: '/media/screenshots/guard/05_guard_entry_granted.png',
    summary:
      'Digital guest invitation QR scanned. Identity matched against pre-uploaded sponsor clearance from Dean Office.',
    hash: 'f9410cb23456a192837465bcde0912fa8745bcde1234567890abcdef12345678',
    details: {
      enrollmentId: 'GST-2026-004',
      department: 'Invited Keynote Speaker',
      barrierStatus: 'Manual Guard Override Accepted',
      guardOnDuty: 'Guard Vikram Singh (Post 01)',
    },
  },
  {
    id: 'bluedart',
    name: 'BlueDart Logistics Van',
    role: 'Authorized Vendor (OD-15-B-4402)',
    avatarLetter: 'V',
    avatarGradient: 'from-[#10b981] to-[#064e3b]',
    gate: 'Service & Logistics 04',
    time: '9:28 AM',
    decision: 'GRANTED',
    cosineScore: 0.985,
    mode: 'ANPR Vehicle',
    vehiclePlate: 'OD-15-B-4402',
    hudImage: '/media/screenshots/guard/08_guard_processing_hud.png',
    summary:
      'ANPR high-speed camera matched license plate against daily commercial delivery schedule. Delivery bay access allocated.',
    hash: '12480a9bcde1234567890abcdef9876543210fedcba0987654321fedcba12345',
    details: {
      enrollmentId: 'VND-2026-440',
      department: 'Campus Courier Dispatch',
      barrierStatus: 'Heavy Vehicle Barrier Opened',
      guardOnDuty: 'Guard Priya Patel (Post 04)',
    },
  },
  {
    id: 'unregistered',
    name: 'Unregistered Individual',
    role: 'Unidentified Perimeter Approach',
    avatarLetter: '?',
    avatarGradient: 'from-[#ef4444] to-[#7f1d1d]',
    gate: 'Faculty Enclave Gate 03',
    time: '9:15 AM',
    decision: 'FLAGGED',
    cosineScore: 0.381,
    mode: 'YuNet + SFace',
    hudImage: '/media/screenshots/guard/02_guard_viewfinder_idle.png',
    summary:
      'No enrolled biometrics found matching subject. Cosine distance 0.381 falls below safe 0.72 threshold. Perimeter barrier kept sealed.',
    hash: '99887766554433221100aabbccddeeff00112233445566778899aabbccddeeff',
    details: {
      enrollmentId: 'UNKNOWN-INCIDENT-09',
      department: 'Visitor Intake Required',
      barrierStatus: 'SEALED — Guard Escalation Prompted',
      guardOnDuty: 'Guard Ramesh Sen (Post 03)',
    },
  },
];

export const InboxMockup: React.FC = () => {
  const [activeEntryId, setActiveEntryId] = useState<string>('ananya');
  const [activeGateTab, setActiveGateTab] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'hud' | 'video'>('hud');
  const [barrierOverrideNotice, setBarrierOverrideNotice] = useState<string | null>(null);

  const selectedRecord =
    LIVE_ENTRIES.find((e) => e.id === activeEntryId) || LIVE_ENTRIES[0];

  const filteredEntries = LIVE_ENTRIES.filter((entry) => {
    const matchesSearch =
      entry.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      entry.role.toLowerCase().includes(searchFilter.toLowerCase()) ||
      entry.gate.toLowerCase().includes(searchFilter.toLowerCase());

    if (activeGateTab === 'all') return matchesSearch;
    if (activeGateTab === 'gate01') return matchesSearch && entry.gate.includes('Gate 01');
    if (activeGateTab === 'gate02') return matchesSearch && entry.gate.includes('Gate 02');
    if (activeGateTab === 'flagged') return matchesSearch && entry.decision === 'FLAGGED';
    return matchesSearch;
  });

  const triggerBarrierRelease = () => {
    setBarrierOverrideNotice(`Manual Barrier Clearance Issued for ${selectedRecord.name}`);
    setTimeout(() => setBarrierOverrideNotice(null), 3500);
  };

  return (
    <section id="operations" className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{
          duration: 0.9,
          delay: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="liquid-glass relative rounded-2xl overflow-hidden border border-white/10 bg-[#0c0e12]/95 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.9)]"
      >
        {/* Title Bar */}
        <div className="h-11 px-4 sm:px-6 flex items-center justify-between border-b border-white/10 bg-black/40 select-none">
          {/* Traffic lights */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]/40" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]/40" />
            <span className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]/40" />
          </div>

          {/* Center Title */}
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00d2ff]" />
            <span className="text-xs text-white/70 font-semibold tracking-tight">
              GATEWISE AI — Perimeter Command Centre &amp; On-Device Guard Telemetry
            </span>
          </div>

          {/* Status indicators */}
          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-white/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>SECURE ENCLAVE ACTIVE</span>
          </div>
        </div>

        {/* Override Notification Banner */}
        <AnimatePresence>
          {barrierOverrideNotice && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-emerald-500/15 border-b border-emerald-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-300 font-mono"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{barrierOverrideNotice}</span>
              </div>
              <span className="text-[10px] text-emerald-400/70">Cryptographically Signed · Ledger Updated</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Body Grid: 3-pane responsive desktop layout */}
        <div className="grid grid-cols-12 h-[640px] text-xs">
          {/* 1. Left Column: Perimeter Infrastructure & Gate Posts */}
          <div className="col-span-12 sm:col-span-4 lg:col-span-3 border-r border-white/10 bg-black/40 p-4 flex flex-col justify-between">
            <div className="space-y-5">
              {/* Emergency Lockdown Action */}
              <button
                type="button"
                onClick={() => {
                  setBarrierOverrideNotice('ALL PERIMETER BARRIERS LOCKED · ALERT TRANSMITTED');
                  setTimeout(() => setBarrierOverrideNotice(null), 3500);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-semibold px-3 py-2.5 transition-all active:scale-[0.98] shadow-md shadow-red-950/40"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Perimeter Protocol Lock</span>
              </button>

              {/* Gate Navigation Filters */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono font-semibold block mb-2">
                  Active Gate Posts
                </span>
                <nav className="space-y-1">
                  {[
                    { id: 'all', label: 'All Campus Gates', count: 420 },
                    { id: 'gate01', label: 'Main Gate 01', count: 184 },
                    { id: 'gate02', label: 'Academic Core 02', count: 92 },
                    { id: 'flagged', label: 'Flagged Exceptions', count: 3, alert: true },
                  ].map((item) => {
                    const isActive = activeGateTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveGateTab(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-white/10 text-white font-semibold'
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              item.alert ? 'bg-rose-500 animate-pulse' : 'bg-[#00d2ff]'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                            item.alert
                              ? 'bg-rose-500/20 text-rose-300'
                              : isActive
                              ? 'bg-white/20 text-white'
                              : 'text-white/40'
                          }`}
                        >
                          {item.count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Verification Engines Section */}
              <div className="pt-3 border-t border-white/10">
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono font-semibold block mb-2.5">
                  Edge Engines Online
                </span>
                <div className="space-y-2">
                  {[
                    { name: 'YuNet 5-Point Mesh', status: '64ms Edge', color: 'bg-[#00d2ff]' },
                    { name: 'SFace 128-D Cosine', status: 'Cosine 0.72', color: 'bg-[#A4F4FD]' },
                    { name: 'ANPR Vehicle Scanner', status: '4K Camera', color: 'bg-[#f59e0b]' },
                    { name: 'HMAC-SHA256 Ledger', status: 'Immutable', color: 'bg-[#10b981]' },
                  ].map((engine) => (
                    <div
                      key={engine.name}
                      className="flex items-center justify-between text-xs text-white/70 py-1 px-1.5 rounded hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${engine.color}`} />
                        <span>{engine.name}</span>
                      </div>
                      <span className="text-[10px] text-white/40 font-mono">{engine.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Guard Telemetry */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
              <span className="font-mono">Device: Samsung XCover 6</span>
              <span className="text-emerald-400 font-mono">BAT 94%</span>
            </div>
          </div>

          {/* 2. Center Column: Live Verification Event Stream */}
          <div className="col-span-12 sm:col-span-8 lg:col-span-4 border-r border-white/10 flex flex-col bg-black/20 overflow-hidden">
            {/* Search Header */}
            <div className="p-3.5 border-b border-white/10 bg-black/30">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search identity, vehicle, roll..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#00d2ff]/50 transition-colors"
                />
              </div>
            </div>

            {/* Event List */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
              {filteredEntries.map((entry) => {
                const isSelected = entry.id === activeEntryId;
                const isGranted = entry.decision === 'GRANTED';

                return (
                  <div
                    key={entry.id}
                    onClick={() => setActiveEntryId(entry.id)}
                    className={`p-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white/10 border-l-2 border-[#00d2ff] text-white'
                        : 'hover:bg-white/5 text-white/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 font-medium text-white">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isGranted ? 'bg-emerald-400' : 'bg-rose-500 animate-ping'
                          }`}
                        />
                        <span className="font-semibold">{entry.name}</span>
                      </div>
                      <span className="text-[11px] text-white/40 font-mono">{entry.time}</span>
                    </div>

                    <div className="text-xs text-white/60 mb-2 truncate">{entry.role}</div>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 font-mono">
                        {entry.gate}
                      </span>
                      <span
                        className={`font-mono font-semibold ${
                          isGranted ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {entry.decision === 'GRANTED'
                          ? `Match: ${(entry.cosineScore * 100).toFixed(1)}%`
                          : 'BREACH FLAGGED'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Right Column: Verification Dossier & Viewfinder HUD */}
          <div className="hidden lg:flex col-span-5 flex-col bg-black/10 overflow-hidden">
            {/* Toolbar */}
            <div className="h-11 px-5 border-b border-white/10 flex items-center justify-between bg-black/30">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('hud')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    viewMode === 'hud'
                      ? 'bg-white/15 text-white'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  Edge Viewfinder HUD
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('video')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    viewMode === 'video'
                      ? 'bg-white/15 text-white'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Play className="w-3 h-3 text-[#00d2ff]" />
                  <span>Real Video Demo</span>
                </button>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10px] text-white/40">
                <span>GATE #01</span>
                <span>•</span>
                <span className="text-emerald-400">ONLINE</span>
              </div>
            </div>

            {/* Dossier Content */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {/* Header Card */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${selectedRecord.avatarGradient} flex items-center justify-center font-bold text-sm text-white shadow-md`}
                  >
                    {selectedRecord.avatarLetter}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{selectedRecord.name}</h3>
                    <p className="text-xs text-white/50">{selectedRecord.role}</p>
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    selectedRecord.decision === 'GRANTED'
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                  }`}
                >
                  {selectedRecord.decision}
                </div>
              </div>

              {/* Viewfinder / Video Stage */}
              <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black/60 aspect-video flex items-center justify-center">
                {viewMode === 'hud' ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={selectedRecord.hudImage}
                      alt="Guard camera HUD"
                      className="w-full h-full object-cover opacity-85"
                    />
                    {/* Real-time HUD graphics */}
                    <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none">
                      <div className="flex items-center justify-between text-[10px] font-mono text-white/80">
                        <span className="bg-black/60 px-2 py-0.5 rounded border border-white/10">
                          MODE: {selectedRecord.mode}
                        </span>
                        <span className="bg-[#00d2ff]/20 text-[#00d2ff] px-2 py-0.5 rounded border border-[#00d2ff]/40">
                          SIMILARITY: {(selectedRecord.cosineScore * 100).toFixed(1)}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-white/70">
                        <span>LATENCY: 242ms</span>
                        <span>BARRIER: {selectedRecord.details.barrierStatus}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    src="/media/videos/guard-app-demo.mp4"
                  />
                )}
              </div>

              {/* AI Verification Analysis */}
              <div className="liquid-glass rounded-xl p-3.5 border border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 text-[#00d2ff] font-semibold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>On-Device Edge Analysis</span>
                </div>
                <p className="text-white/80 text-[11px] leading-relaxed">
                  {selectedRecord.summary}
                </p>
              </div>

              {/* Immutable Cryptographic Signature Card */}
              <div className="rounded-xl p-3 bg-white/[0.02] border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-white/50 font-mono">
                  <span>HMAC-SHA256 LEDGER SIGNATURE</span>
                  <span className="text-emerald-400">NON-REPUDIATION VERIFIED</span>
                </div>
                <p className="text-[10px] font-mono text-white/60 break-all bg-black/40 p-2 rounded border border-white/5">
                  {selectedRecord.hash}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={triggerBarrierRelease}
                  className="flex-1 py-2.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Authorize Gate Barrier</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBarrierOverrideNotice(`Secondary Inspection Requested for ${selectedRecord.name}`);
                    setTimeout(() => setBarrierOverrideNotice(null), 3500);
                  }}
                  className="px-3.5 py-2.5 rounded-lg border border-white/15 text-white/80 hover:text-white hover:bg-white/5 text-xs font-medium transition-colors"
                >
                  Flag for Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
