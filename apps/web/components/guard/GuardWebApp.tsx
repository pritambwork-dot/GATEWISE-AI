'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  ShieldCheck,
  Camera,
  Search,
  Check,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  User,
  Users,
  Clock,
  ArrowRight,
  Phone,
  Building2,
  QrCode,
  SlidersHorizontal,
  RefreshCw,
  Zap,
  Globe,
  Lock,
  ChevronDown,
  X,
  FileText,
  Radio,
} from 'lucide-react';
import { liveSync } from '@/lib/services/live-sync';
import { VerificationEvent, VisitorPass } from '@/types';

export interface GuardWebAppProps {
  embedded?: boolean;
  onEventSynced?: (event: VerificationEvent) => void;
}

type TabType = 'verify' | 'activity' | 'visitors' | 'profile';
type VerificationStage = 'idle' | 'viewfinder' | 'verifying' | 'outcome';
type OutcomeType = 'AUTHORIZED' | 'DENIED' | 'PENDING';

interface MockSubject {
  id: string;
  name: string;
  nameHi: string;
  role: string;
  roleHi: string;
  department: string;
  category: 'Faculty' | 'Student' | 'Visitor' | 'Unknown';
  outcome: OutcomeType;
  score: number;
  reasonEn: string;
  reasonHi: string;
  photoUrl: string;
}

const MOCK_SUBJECTS: MockSubject[] = [
  {
    id: 'FAC-8041',
    name: 'Dr. Ananya Sharma',
    nameHi: 'डॉ. अनन्या शर्मा',
    role: 'Faculty, Strategic Management',
    roleHi: 'संकाय, रणनीतिक प्रबंधन',
    department: 'IIM Sambalpur',
    category: 'Faculty',
    outcome: 'AUTHORIZED',
    score: 0.984,
    reasonEn: 'Active faculty credentials. Full perimeter access granted.',
    reasonHi: 'सक्रिय संकाय क्रेडेंशियल्स। पूर्ण परिधि पहुंच स्वीकृत।',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
  },
  {
    id: 'STU-2024-089',
    name: 'Rahul Verma',
    nameHi: 'राहुल वर्मा',
    role: 'MBA Scholar (PGP 2024-26)',
    roleHi: 'एमबीए स्कॉलर (पीजीपी 2024-26)',
    department: 'IIM Sambalpur',
    category: 'Student',
    outcome: 'AUTHORIZED',
    score: 0.962,
    reasonEn: 'Registered scholar. Normal academic hours permitted.',
    reasonHi: 'पंजीकृत छात्र। सामान्य शैक्षणिक घंटे अनुमत।',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
  },
  {
    id: 'VIS-2024-031',
    name: 'Raghavan Iyer',
    nameHi: 'राघवन अय्यर',
    role: 'Executive Guest — MDP Programme',
    roleHi: 'कार्यकारी अतिथि — एमडीपी कार्यक्रम',
    department: 'Executive Development',
    category: 'Visitor',
    outcome: 'AUTHORIZED',
    score: 0.941,
    reasonEn: 'Pre-approved digital visitor pass verified.',
    reasonHi: 'पूर्व-अनुमोदित डिजिटल आगंतुक पास सत्यापित।',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
  },
  {
    id: 'UNK-9102',
    name: 'Unrecognized Subject',
    nameHi: 'अज्ञात व्यक्ति',
    role: 'No Active Roster Entry',
    roleHi: 'कोई सक्रिय रोस्टर प्रविष्टि नहीं',
    department: 'External Walk-in',
    category: 'Unknown',
    outcome: 'DENIED',
    score: 0.312,
    reasonEn: 'Identity not found in institutional database. Access denied.',
    reasonHi: 'संस्थान के डेटाबेस में पहचान नहीं मिली। प्रवेश अस्वीकृत।',
    photoUrl: '',
  },
  {
    id: 'REV-4012',
    name: 'Vikash Mohanty',
    nameHi: 'विकाश मोहंती',
    role: 'Temporary Contract Associate',
    roleHi: 'अस्थायी अनुबंध सहयोगी',
    department: 'Campus Operations',
    category: 'Visitor',
    outcome: 'PENDING',
    score: 0.688,
    reasonEn: 'Partial vector match. Supervisor confirmation required.',
    reasonHi: 'आंशिक मिलान। पर्यवेक्षक पुष्टि आवश्यक है।',
    photoUrl: '',
  },
];

export const GuardWebApp: React.FC<GuardWebAppProps> = ({ embedded = false, onEventSynced }) => {
  // Navigation & Language
  const [activeTab, setActiveTab] = useState<TabType>('verify');
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  // Live Data State
  const [events, setEvents] = useState<VerificationEvent[]>([]);
  const [visitors, setVisitors] = useState<VisitorPass[]>([]);
  const [activeRange, setActiveRange] = useState<'today' | '7d' | '30d'>('today');
  const [activityFilter, setActivityFilter] = useState<'all' | 'permitted' | 'denied' | 'pending'>('all');
  const [activitySearch, setActivitySearch] = useState('');
  const [visitorFilter, setVisitorFilter] = useState<'all' | 'expected' | 'inside' | 'checked_out'>('all');
  const [visitorSearch, setVisitorSearch] = useState('');

  // Verification Viewfinder State
  const [verificationStage, setVerificationStage] = useState<VerificationStage>('idle');
  const [selectedSubject, setSelectedSubject] = useState<MockSubject>(MOCK_SUBJECTS[0]);
  const [verifyingStep, setVerifyingStep] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [liveSyncToast, setLiveSyncToast] = useState<string | null>(null);

  // Register Visitor Modal State
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [newVisitorName, setNewVisitorName] = useState('');
  const [newVisitorPhone, setNewVisitorPhone] = useState('');
  const [newVisitorHost, setNewVisitorHost] = useState('');
  const [newVisitorDept, setNewVisitorDept] = useState('');
  const [newVisitorPurpose, setNewVisitorPurpose] = useState('');

  // Selected Event Receipt Modal
  const [selectedReceiptEvent, setSelectedReceiptEvent] = useState<VerificationEvent | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Load initial events & visitors from liveSync and subscribe
  useEffect(() => {
    setEvents(liveSync.getEvents());
    setVisitors(liveSync.getVisitors());

    const unsubscribe = liveSync.subscribe((msg) => {
      if (msg.type === 'VERIFICATION_EVENT') {
        setEvents(liveSync.getEvents());
      } else if (
        msg.type === 'VISITOR_REGISTERED' ||
        msg.type === 'VISITOR_CHECKED_IN' ||
        msg.type === 'VISITOR_CHECKED_OUT'
      ) {
        setVisitors(liveSync.getVisitors());
      }
    });

    return () => unsubscribe();
  }, []);

  // Web Camera Stream handler
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (verificationStage === 'viewfinder') {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'user' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
            setCameraActive(true);
          }
        })
        .catch(() => {
          setCameraActive(false);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const s = videoRef.current.srcObject as MediaStream;
        s.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [verificationStage]);

  // Trigger Biometric Verification Flow
  const handleStartVerification = () => {
    setVerificationStage('viewfinder');
  };

  const handleCapture = () => {
    setVerificationStage('verifying');
    setVerifyingStep(0);

    // Sequence through the 4 verification checkpoints from UI/UX spec (page 4)
    setTimeout(() => setVerifyingStep(1), 350); // Image quality
    setTimeout(() => setVerifyingStep(2), 700); // Face detection
    setTimeout(() => setVerifyingStep(3), 1100); // Identity matching
    setTimeout(() => {
      setVerifyingStep(4); // Institutional authorization
      setTimeout(() => {
        setVerificationStage('outcome');
      }, 400);
    }, 1500);
  };

  // Finalize Decision & Sync Live with Command Centre Dashboard
  const handleRecordDecision = (customOutcome?: OutcomeType) => {
    const outcome = customOutcome || selectedSubject.outcome;
    const isGranted = outcome === 'AUTHORIZED';
    const isDenied = outcome === 'DENIED';

    const newEvent = liveSync.addVerificationEvent(
      {
        gate_id: 'gate-01',
        gate_name: 'Main Gate 01',
        guard_id: 'GRD-101',
        guard_name: 'Vikram Singh',
        person_id: selectedSubject.id,
        person_name: selectedSubject.name,
        person_category: selectedSubject.category,
        outcome: isGranted
          ? 'VERIFIED_AUTHORIZED'
          : isDenied
          ? 'IDENTIFIED_UNAUTHORIZED'
          : 'POTENTIAL_MATCH',
        guard_decision: isGranted ? 'GRANT_ENTRY' : isDenied ? 'DENY_ENTRY' : 'ESCALATE_TO_ADMIN',
        similarity_score: selectedSubject.score,
        decision_reason: selectedSubject.reasonEn,
        candidate: {
          identity_id: selectedSubject.id,
          person_name: selectedSubject.name,
          person_id: selectedSubject.id,
          category: selectedSubject.category,
          department: selectedSubject.department,
          reference_photo_url: selectedSubject.photoUrl || '',
          similarity_score: selectedSubject.score,
        },
      },
      'GUARD_WEB_APP'
    );

    // Update local state and trigger callback
    setEvents(liveSync.getEvents());
    if (onEventSynced) onEventSynced(newEvent);

    // Show temporary live sync pulse
    setLiveSyncToast(
      lang === 'en'
        ? `Synced with Command Centre: ${selectedSubject.name} (${outcome})`
        : `कमांड सेंटर के साथ सिंक: ${selectedSubject.nameHi} (${outcome})`
    );
    setTimeout(() => setLiveSyncToast(null), 3000);

    setVerificationStage('idle');
  };

  // Register New Visitor
  const handleRegisterVisitorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisitorName || !newVisitorHost) return;

    const registered = liveSync.registerVisitor(
      {
        visitor_name: newVisitorName,
        phone: newVisitorPhone || '+91 98000 00000',
        id_type: 'Government ID',
        id_number: 'ID-' + Math.floor(1000 + Math.random() * 9000),
        host_name: newVisitorHost,
        host_department: newVisitorDept || 'Administration, IIM Sambalpur',
        purpose: newVisitorPurpose || 'Official Institutional Meeting',
      },
      'GUARD_WEB_APP'
    );

    setVisitors(liveSync.getVisitors());
    setRegisterModalOpen(false);
    setNewVisitorName('');
    setNewVisitorPhone('');
    setNewVisitorHost('');
    setNewVisitorDept('');
    setNewVisitorPurpose('');

    setLiveSyncToast(
      lang === 'en'
        ? `Visitor Registered & Synced: ${registered.visitor_name}`
        : `आगंतुक पंजीकृत और सिंक हुआ: ${registered.visitor_name}`
    );
    setTimeout(() => setLiveSyncToast(null), 3000);
  };

  // Check In / Check Out Visitor
  const handleCheckInVisitor = (id: string, name: string) => {
    liveSync.checkInVisitor(id, 'GUARD_WEB_APP');
    setVisitors(liveSync.getVisitors());
    setEvents(liveSync.getEvents());

    setLiveSyncToast(
      lang === 'en'
        ? `Checked In & Synced with Dashboard: ${name}`
        : `अंदर दर्ज किया गया और डैशबोर्ड से सिंक: ${name}`
    );
    setTimeout(() => setLiveSyncToast(null), 3000);
  };

  const handleCheckOutVisitor = (id: string, name: string) => {
    liveSync.checkOutVisitor(id, 'GUARD_WEB_APP');
    setVisitors(liveSync.getVisitors());

    setLiveSyncToast(
      lang === 'en'
        ? `Checked Out & Synced with Dashboard: ${name}`
        : `बाहर दर्ज किया गया और डैशबोर्ड से सिंक: ${name}`
    );
    setTimeout(() => setLiveSyncToast(null), 3000);
  };

  // Filtered Activities
  const filteredEvents = events.filter((ev) => {
    if (activityFilter === 'permitted' && ev.guard_decision !== 'GRANT_ENTRY') return false;
    if (activityFilter === 'denied' && ev.guard_decision !== 'DENY_ENTRY') return false;
    if (
      activityFilter === 'pending' &&
      ev.guard_decision !== 'PENDING' &&
      ev.guard_decision !== 'ESCALATE_TO_ADMIN'
    )
      return false;
    if (activitySearch) {
      const q = activitySearch.toLowerCase();
      const matchName = (ev.person_name || '').toLowerCase().includes(q);
      const matchId = (ev.person_id || '').toLowerCase().includes(q);
      const matchGate = (ev.gate_name || '').toLowerCase().includes(q);
      if (!matchName && !matchId && !matchGate) return false;
    }
    return true;
  });

  // Filtered Visitors
  const filteredVisitors = visitors.filter((v) => {
    if (visitorFilter === 'expected' && v.status !== 'EXPECTED') return false;
    if (visitorFilter === 'inside' && v.status !== 'CHECKED_IN') return false;
    if (visitorFilter === 'checked_out' && v.status !== 'CHECKED_OUT') return false;
    if (visitorSearch) {
      const q = visitorSearch.toLowerCase();
      const matchName = (v.visitor_name || '').toLowerCase().includes(q);
      const matchHost = (v.host_name || '').toLowerCase().includes(q);
      const matchCode = (v.pass_code || '').toLowerCase().includes(q);
      if (!matchName && !matchHost && !matchCode) return false;
    }
    return true;
  });

  // Counts
  const todayVerifications = events.length;
  const pendingReviews = events.filter((e) => e.guard_decision === 'ESCALATE_TO_ADMIN' || e.outcome === 'POTENTIAL_MATCH').length;
  const activeVisitors = visitors.filter((v) => v.status === 'CHECKED_IN').length;

  return (
    <div
      className={`relative flex flex-col w-full font-sans select-none overflow-hidden ${
        embedded
          ? 'h-full bg-[#070B1A] text-white rounded-[28px] border border-white/10 shadow-2xl'
          : 'min-h-screen bg-[#F6F7FB] text-[#070B1A]'
      }`}
    >
      {/* Top Status Bar & Language Switcher */}
      <div
        className={`px-4 sm:px-6 pt-3 pb-2.5 flex items-center justify-between border-b ${
          embedded
            ? 'bg-[#070B1A]/90 border-white/10 text-white'
            : 'bg-white border-black/5 text-[#070B1A]'
        }`}
      >
        {/* Left: Brand Mark + Gate info */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#2F5BFF] flex items-center justify-center text-white shadow-sm">
            {/* Gate Arch holding Teal Aperture (Brand Mark from Page 1) */}
            <div className="relative w-4 h-5 border-2 border-white border-b-0 rounded-t-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#12B5A6] -mt-1" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs tracking-tight">GATEWISE</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#12B5A6] text-white uppercase">
                Guard
              </span>
            </div>
            <span className={`text-[10px] ${embedded ? 'text-white/60' : 'text-black/50'}`}>
              Main Gate 01 · IIM Sambalpur
            </span>
          </div>
        </div>

        {/* Right: Language toggle & Live sync indicator */}
        <div className="flex items-center gap-2">
          {/* Live Sync Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1FB36B]/15 border border-[#1FB36B]/30 text-[10px] font-semibold text-[#1FB36B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1FB36B] animate-pulse" />
            <span>LIVE SYNC</span>
          </div>

          {/* Language Switcher English · हिंदी */}
          <div
            className={`flex items-center rounded-lg p-0.5 border text-[11px] font-medium ${
              embedded
                ? 'bg-white/5 border-white/10 text-white'
                : 'bg-black/5 border-black/10 text-[#070B1A]'
            }`}
          >
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded-md transition-all ${
                lang === 'en'
                  ? 'bg-[#2F5BFF] text-white font-bold shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`px-2 py-0.5 rounded-md transition-all ${
                lang === 'hi'
                  ? 'bg-[#2F5BFF] text-white font-bold shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>

      {/* Live Sync Toast Banner */}
      <AnimatePresence>
        {liveSyncToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-14 inset-x-4 z-50 py-2 px-3 rounded-xl bg-[#2F5BFF] text-white text-xs font-semibold shadow-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-2 truncate">
              <Zap className="w-3.5 h-3.5 text-[#12B5A6] shrink-0" />
              <span className="truncate">{liveSyncToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setLiveSyncToast(null)}
              className="text-white/80 hover:text-white ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area — Switches between the 4 Tabs */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* ========================================================= */}
        {/* TAB 1: VERIFY (Home Screen)                               */}
        {/* ========================================================= */}
        {activeTab === 'verify' && (
          <div className="space-y-4">
            {/* Guard Greeting Card (Page 2 & Page 21) */}
            <div
              className={`p-4 rounded-[20px] border flex items-center justify-between ${
                embedded
                  ? 'bg-gradient-to-r from-white/[0.06] to-white/[0.02] border-white/10'
                  : 'bg-white border-black/5 shadow-xs'
              }`}
            >
              <div>
                <p className={`text-xs ${embedded ? 'text-white/60' : 'text-black/50'}`}>
                  {lang === 'en' ? 'Good morning' : 'नमस्ते'}
                </p>
                <h3 className="text-base font-bold tracking-tight">Vikram Singh</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#1FB36B]" />
                  <span className={`text-[11px] ${embedded ? 'text-white/70' : 'text-black/60'}`}>
                    {lang === 'en' ? 'Main Gate 01 · On duty' : 'मुख्य द्वार 01 · ड्यूटी पर'}
                  </span>
                </div>
              </div>

              {/* Subject selector for instant testing / demonstration */}
              <div className="flex flex-col items-end">
                <span className={`text-[10px] uppercase font-bold mb-1 ${embedded ? 'text-white/50' : 'text-black/40'}`}>
                  {lang === 'en' ? 'Test Subject' : 'परीक्षण विषय'}
                </span>
                <select
                  value={selectedSubject.id}
                  onChange={(e) => {
                    const match = MOCK_SUBJECTS.find((s) => s.id === e.target.value);
                    if (match) setSelectedSubject(match);
                  }}
                  className={`text-xs font-semibold rounded-lg px-2 py-1.5 border outline-none cursor-pointer ${
                    embedded
                      ? 'bg-black/60 border-white/20 text-white'
                      : 'bg-[#F4F5F8] border-black/10 text-[#070B1A]'
                  }`}
                >
                  {MOCK_SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id} className="text-black bg-white">
                      {lang === 'en' ? s.name : s.nameHi} ({s.outcome})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Main Action Hero: Identity Verification Card (Page 2 / Page 21) */}
            <div
              className={`p-5 rounded-[20px] text-white relative overflow-hidden shadow-lg ${
                embedded
                  ? 'bg-gradient-to-br from-[#2F5BFF] to-[#1a3cb8]'
                  : 'bg-gradient-to-br from-[#2F5BFF] to-[#1242e6]'
              }`}
            >
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white">
                  <Camera className="w-5 h-5 text-white" />
                </div>

                <div>
                  <h2 className="text-lg font-bold tracking-tight">
                    {lang === 'en' ? 'Identity Verification' : 'पहचान सत्यापन'}
                  </h2>
                  <p className="text-xs text-white/80 leading-relaxed mt-1">
                    {lang === 'en'
                      ? 'Capture a face to check identity and entry rights in sub-300ms.'
                      : 'पहचान और प्रवेश अधिकारों की तुरंत जांच के लिए चेहरा कैप्चर करें।'}
                  </p>
                </div>

                {/* Primary Button (56px min height per spec page 1) */}
                <button
                  type="button"
                  onClick={handleStartVerification}
                  className="w-full min-h-[52px] rounded-full bg-white text-[#2F5BFF] font-extrabold text-sm hover:bg-white/95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer mt-1"
                >
                  <Camera className="w-4 h-4 text-[#2F5BFF]" />
                  <span>{lang === 'en' ? 'Start Verification' : 'सत्यापन शुरू करें'}</span>
                </button>
              </div>
            </div>

            {/* Readiness Strip (Page 2 / Page 21) */}
            <div
              className={`p-3 rounded-[16px] border flex items-center justify-between text-[11px] ${
                embedded
                  ? 'bg-white/[0.03] border-white/10 text-white/70'
                  : 'bg-white border-black/5 text-black/60 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1FB36B]" />
                <span>{lang === 'en' ? 'Network' : 'नेटवर्क'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1FB36B]" />
                <span>{lang === 'en' ? 'Camera' : 'कैमरा'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1FB36B]" />
                <span>{lang === 'en' ? 'Service' : 'सेवा'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1FB36B]" />
                <span>{lang === 'en' ? 'Session' : 'सत्र'}</span>
              </div>
            </div>

            {/* Today Counters Card (Page 19 / Page 21) */}
            <div
              className={`p-4 rounded-[20px] border ${
                embedded ? 'bg-white/[0.04] border-white/10' : 'bg-white border-black/5 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${embedded ? 'text-white/60' : 'text-black/50'}`}>
                  {lang === 'en' ? 'Today' : 'आज का सारांश'}
                </span>
                <span className="text-[10px] text-[#12B5A6] font-semibold">IIM Sambalpur</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div
                  className={`p-2.5 rounded-xl border ${
                    embedded ? 'bg-black/30 border-white/5' : 'bg-[#F6F7FB] border-black/5'
                  }`}
                >
                  <span className="block text-xl font-extrabold text-[#2F5BFF]">
                    {todayVerifications}
                  </span>
                  <span className={`text-[10px] leading-tight block mt-0.5 ${embedded ? 'text-white/60' : 'text-black/50'}`}>
                    {lang === 'en' ? 'Verifications' : 'सत्यापन'}
                  </span>
                </div>
                <div
                  className={`p-2.5 rounded-xl border ${
                    embedded ? 'bg-black/30 border-white/5' : 'bg-[#F6F7FB] border-black/5'
                  }`}
                >
                  <span className="block text-xl font-extrabold text-[#FFB547]">
                    {pendingReviews}
                  </span>
                  <span className={`text-[10px] leading-tight block mt-0.5 ${embedded ? 'text-white/60' : 'text-black/50'}`}>
                    {lang === 'en' ? 'Pending Review' : 'समीक्षा लंबित'}
                  </span>
                </div>
                <div
                  className={`p-2.5 rounded-xl border ${
                    embedded ? 'bg-black/30 border-white/5' : 'bg-[#F6F7FB] border-black/5'
                  }`}
                >
                  <span className="block text-xl font-extrabold text-[#12B5A6]">
                    {activeVisitors}
                  </span>
                  <span className={`text-[10px] leading-tight block mt-0.5 ${embedded ? 'text-white/60' : 'text-black/50'}`}>
                    {lang === 'en' ? 'Active Visitors' : 'सक्रिय आगंतुक'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity Mini List (Page 19 / Page 21) */}
            <div
              className={`p-4 rounded-[20px] border ${
                embedded ? 'bg-white/[0.04] border-white/10' : 'bg-white border-black/5 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${embedded ? 'text-white/60' : 'text-black/50'}`}>
                  {lang === 'en' ? 'Recent Activity' : 'हाल की गतिविधि'}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('activity')}
                  className="text-xs font-semibold text-[#2F5BFF] hover:underline"
                >
                  {lang === 'en' ? 'View all' : 'सभी देखें'} &rarr;
                </button>
              </div>

              <div className="space-y-2">
                {events.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedReceiptEvent(item)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                      embedded
                        ? 'bg-black/20 hover:bg-black/40 border-white/5'
                        : 'bg-[#F6F7FB] hover:bg-black/5 border-black/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-7 h-7 rounded-full bg-[#2F5BFF]/15 text-[#2F5BFF] font-bold text-xs flex items-center justify-center shrink-0">
                        {(item.person_name || 'U')[0]}
                      </div>
                      <div className="truncate">
                        <span className="font-semibold block truncate">
                          {item.person_name || 'Subject'}
                        </span>
                        <span className={`text-[10px] ${embedded ? 'text-white/50' : 'text-black/40'}`}>
                          {item.gate_name} · {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        item.guard_decision === 'GRANT_ENTRY' || item.outcome === 'VERIFIED_AUTHORIZED'
                          ? 'bg-[#1FB36B]/15 text-[#1FB36B] border border-[#1FB36B]/30'
                          : item.guard_decision === 'DENY_ENTRY' || item.outcome === 'IDENTIFIED_UNAUTHORIZED'
                          ? 'bg-[#C93338]/15 text-[#C93338] border border-[#C93338]/30'
                          : 'bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30'
                      }`}
                    >
                      {item.guard_decision === 'GRANT_ENTRY' || item.outcome === 'VERIFIED_AUTHORIZED'
                        ? lang === 'en'
                          ? 'Permitted'
                          : 'स्वीकृत'
                        : item.guard_decision === 'DENY_ENTRY' || item.outcome === 'IDENTIFIED_UNAUTHORIZED'
                        ? lang === 'en'
                          ? 'Denied'
                          : 'अस्वीकृत'
                        : lang === 'en'
                        ? 'Pending'
                        : 'लंबित'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: ACTIVITY                                           */}
        {/* ========================================================= */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold tracking-tight">
                  {lang === 'en' ? 'Activity Log' : 'गतिविधि लॉग'}
                </h3>
                <p className={`text-xs ${embedded ? 'text-white/60' : 'text-black/50'}`}>
                  Main Gate 01 · IIM Sambalpur
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEvents(liveSync.getEvents())}
                className="p-1.5 rounded-lg border text-xs flex items-center gap-1 hover:bg-white/5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Search Activity Input */}
            <div className="relative">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-3 ${embedded ? 'text-white/40' : 'text-black/40'}`} />
              <input
                type="text"
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                placeholder={lang === 'en' ? 'Search activity by name or ID...' : 'नाम या आईडी से खोजें...'}
                className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border outline-none ${
                  embedded
                    ? 'bg-black/40 border-white/10 text-white placeholder-white/40'
                    : 'bg-white border-black/10 text-[#070B1A] placeholder-black/40 shadow-xs'
                }`}
              />
            </div>

            {/* Status Filter Chips (Page 2 & Page 17) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {(['all', 'permitted', 'denied', 'pending'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActivityFilter(filter)}
                  className={`px-3 py-1.5 rounded-full capitalize font-semibold transition-all shrink-0 ${
                    activityFilter === filter
                      ? 'bg-[#2F5BFF] text-white shadow-xs'
                      : embedded
                      ? 'bg-white/5 text-white/70 hover:bg-white/10'
                      : 'bg-white text-black/60 border border-black/5 hover:bg-black/5'
                  }`}
                >
                  {filter === 'all'
                    ? lang === 'en'
                      ? 'All'
                      : 'सभी'
                    : filter === 'permitted'
                    ? lang === 'en'
                      ? 'Permitted'
                      : 'स्वीकृत'
                    : filter === 'denied'
                    ? lang === 'en'
                      ? 'Denied'
                      : 'अस्वीकृत'
                    : lang === 'en'
                    ? 'Pending'
                    : 'लंबित'}
                </button>
              ))}
            </div>

            {/* Activity List */}
            <div className="space-y-2">
              {filteredEvents.length === 0 ? (
                <div
                  className={`p-6 rounded-[20px] text-center border ${
                    embedded ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5'
                  }`}
                >
                  <p className="text-xs text-white/50">
                    {lang === 'en' ? 'No verification events match this filter.' : 'कोई गतिविधि नहीं मिली।'}
                  </p>
                </div>
              ) : (
                filteredEvents.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedReceiptEvent(item)}
                    className={`p-3.5 rounded-[16px] border flex items-center justify-between text-xs cursor-pointer transition-all hover:scale-[1.01] ${
                      embedded
                        ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10'
                        : 'bg-white hover:bg-[#FAFBFD] border-black/5 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-8 h-8 rounded-full bg-[#2F5BFF]/15 text-[#2F5BFF] font-bold text-xs flex items-center justify-center shrink-0">
                        {(item.person_name || 'U')[0]}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold truncate">{item.person_name}</span>
                          <span className={`text-[10px] ${embedded ? 'text-white/50' : 'text-black/40'}`}>
                            • {item.person_category || 'Personnel'}
                          </span>
                        </div>
                        <span className={`text-[10px] block ${embedded ? 'text-white/50' : 'text-black/40'}`}>
                          {item.gate_name} · {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.guard_decision === 'GRANT_ENTRY' || item.outcome === 'VERIFIED_AUTHORIZED'
                            ? 'bg-[#1FB36B]/15 text-[#1FB36B] border border-[#1FB36B]/30'
                            : item.guard_decision === 'DENY_ENTRY' || item.outcome === 'IDENTIFIED_UNAUTHORIZED'
                            ? 'bg-[#C93338]/15 text-[#C93338] border border-[#C93338]/30'
                            : 'bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30'
                        }`}
                      >
                        {item.guard_decision === 'GRANT_ENTRY' || item.outcome === 'VERIFIED_AUTHORIZED'
                          ? lang === 'en'
                            ? 'Permitted'
                            : 'स्वीकृत'
                          : item.guard_decision === 'DENY_ENTRY' || item.outcome === 'IDENTIFIED_UNAUTHORIZED'
                          ? lang === 'en'
                            ? 'Denied'
                            : 'अस्वीकृत'
                          : lang === 'en'
                          ? 'Pending'
                          : 'लंबित'}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: VISITORS                                           */}
        {/* ========================================================= */}
        {activeTab === 'visitors' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold tracking-tight">
                  {lang === 'en' ? 'Visitor Gate Pass' : 'आगंतुक गेट पास'}
                </h3>
                <p className={`text-xs ${embedded ? 'text-white/60' : 'text-black/50'}`}>
                  {lang === 'en' ? 'Pass verification and gate check-in' : 'पास सत्यापन और गेट चेक-इन'}
                </p>
              </div>

              {/* + Register Button (Teal from Page 1 & Page 2 spec) */}
              <button
                type="button"
                onClick={() => setRegisterModalOpen(true)}
                className="px-3.5 py-1.5 rounded-full bg-[#12B5A6] text-white text-xs font-bold hover:bg-[#10a395] active:scale-[0.98] transition-all flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <span>+ {lang === 'en' ? 'Register' : 'पंजीकरण'}</span>
              </button>
            </div>

            {/* Search Visitors Input */}
            <div className="relative">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-3 ${embedded ? 'text-white/40' : 'text-black/40'}`} />
              <input
                type="text"
                value={visitorSearch}
                onChange={(e) => setVisitorSearch(e.target.value)}
                placeholder={lang === 'en' ? 'Search visitors or pass codes...' : 'आगंतुक या पास कोड खोजें...'}
                className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border outline-none ${
                  embedded
                    ? 'bg-black/40 border-white/10 text-white placeholder-white/40'
                    : 'bg-white border-black/10 text-[#070B1A] placeholder-black/40 shadow-xs'
                }`}
              />
            </div>

            {/* Filter Tabs: All, Expected, Inside (Page 2 & Page 19) */}
            <div className="flex items-center gap-1.5 text-xs">
              {(['all', 'expected', 'inside', 'checked_out'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setVisitorFilter(filter)}
                  className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 ${
                    visitorFilter === filter
                      ? 'bg-[#12B5A6] text-white shadow-xs'
                      : embedded
                      ? 'bg-white/5 text-white/70 hover:bg-white/10'
                      : 'bg-white text-black/60 border border-black/5 hover:bg-black/5'
                  }`}
                >
                  {filter === 'all'
                    ? lang === 'en'
                      ? 'All'
                      : 'सभी'
                    : filter === 'expected'
                    ? lang === 'en'
                      ? 'Expected'
                      : 'अपेक्षित'
                    : filter === 'inside'
                    ? lang === 'en'
                      ? 'Inside'
                      : 'अंदर'
                    : lang === 'en'
                    ? 'Checked Out'
                    : 'बाहर'}
                </button>
              ))}
            </div>

            {/* Visitors List */}
            <div className="space-y-3">
              {filteredVisitors.map((v) => (
                <div
                  key={v.id}
                  className={`p-4 rounded-[20px] border space-y-3 ${
                    embedded ? 'bg-white/[0.04] border-white/10' : 'bg-white border-black/5 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{v.visitor_name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#2F5BFF]/10 text-[#2F5BFF] border border-[#2F5BFF]/20">
                          {v.pass_code}
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 ${embedded ? 'text-white/60' : 'text-black/50'}`}>
                        {lang === 'en' ? 'Host' : 'मेजबान'}: {v.host_name} ({v.host_department})
                      </p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        v.status === 'CHECKED_IN'
                          ? 'bg-[#12B5A6]/15 text-[#12B5A6] border border-[#12B5A6]/30'
                          : v.status === 'EXPECTED'
                          ? 'bg-[#2F5BFF]/15 text-[#2F5BFF] border border-[#2F5BFF]/30'
                          : 'bg-black/10 text-black/50'
                      }`}
                    >
                      {v.status === 'CHECKED_IN'
                        ? lang === 'en'
                          ? 'Inside'
                          : 'अंदर'
                        : v.status === 'EXPECTED'
                        ? lang === 'en'
                          ? 'Expected'
                          : 'अपेक्षित'
                        : lang === 'en'
                        ? 'Checked Out'
                        : 'बाहर'}
                    </span>
                  </div>

                  <div className={`text-[11px] space-y-0.5 pt-1 border-t ${embedded ? 'border-white/5 text-white/70' : 'border-black/5 text-black/60'}`}>
                    <div>• {lang === 'en' ? 'Purpose' : 'उद्देश्य'}: {v.purpose}</div>
                    <div>• {lang === 'en' ? 'Valid' : 'वैधता'}: {v.valid_date} ({v.valid_until_time})</div>
                  </div>

                  {/* Actions: Check In / Check Out */}
                  <div className="flex items-center gap-2 pt-1">
                    {v.status === 'EXPECTED' && (
                      <button
                        type="button"
                        onClick={() => handleCheckInVisitor(v.id, v.visitor_name)}
                        className="w-full py-2 rounded-xl bg-[#2F5BFF] hover:bg-[#254cd6] active:scale-[0.98] transition-all text-white font-bold text-xs shadow-xs"
                      >
                        {lang === 'en' ? 'Confirm Check-In' : 'प्रवेश दर्ज करें'}
                      </button>
                    )}
                    {v.status === 'CHECKED_IN' && (
                      <button
                        type="button"
                        onClick={() => handleCheckOutVisitor(v.id, v.visitor_name)}
                        className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-[0.98] transition-all text-xs font-semibold"
                      >
                        {lang === 'en' ? 'Record Check-Out' : 'निकास दर्ज करें'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PROFILE & SETTINGS                                 */}
        {/* ========================================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* Guard Avatar & Info (Page 6 & Page 20) */}
            <div
              className={`p-5 rounded-[20px] border flex flex-col items-center text-center space-y-2 ${
                embedded ? 'bg-white/[0.04] border-white/10' : 'bg-white border-black/5 shadow-xs'
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-[#2F5BFF] text-white text-xl font-bold flex items-center justify-center shadow-md">
                G
              </div>
              <div>
                <h3 className="text-base font-bold">Vikram Singh</h3>
                <span className={`text-xs ${embedded ? 'text-white/60' : 'text-black/50'}`}>
                  ID: GRD-101 · Active
                </span>
              </div>
            </div>

            {/* Assignment Details */}
            <div
              className={`p-4 rounded-[20px] border space-y-2.5 text-xs ${
                embedded ? 'bg-white/[0.04] border-white/10' : 'bg-white border-black/5 shadow-xs'
              }`}
            >
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className={embedded ? 'text-white/60' : 'text-black/50'}>Institution</span>
                <span className="font-semibold">IIM Sambalpur</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className={embedded ? 'text-white/60' : 'text-black/50'}>Assigned Gate</span>
                <span className="font-semibold">Main Gate 01</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className={embedded ? 'text-white/60' : 'text-black/50'}>Role</span>
                <span className="font-semibold">Security Officer / Guard</span>
              </div>
              <div className="flex justify-between py-1">
                <span className={embedded ? 'text-white/60' : 'text-black/50'}>Telemetry Sync</span>
                <span className="font-semibold text-[#1FB36B]">Instant WebSocket</span>
              </div>
            </div>

            {/* Switch to Admin Dashboard */}
            <a
              href="/admin"
              className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#12B5A6]" />
              <span>{lang === 'en' ? 'Open Command Centre Dashboard' : 'कमांड सेंटर डैशबोर्ड खोलें'}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* BOTTOM NAVIGATION BAR (Page 2 & Page 21)                   */}
      {/* ========================================================= */}
      <div
        className={`px-4 py-2 border-t flex items-center justify-around text-xs ${
          embedded
            ? 'bg-[#070B1A]/95 border-white/10 text-white'
            : 'bg-white border-black/5 text-[#070B1A] shadow-md'
        }`}
      >
        <button
          type="button"
          onClick={() => setActiveTab('verify')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'verify'
              ? 'text-[#2F5BFF] font-bold'
              : embedded
              ? 'text-white/50 hover:text-white'
              : 'text-black/40 hover:text-black'
          }`}
        >
          <Camera className="w-5 h-5" />
          <span className="text-[10px]">
            {lang === 'en' ? 'Verify' : 'सत्यापन'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'activity'
              ? 'text-[#2F5BFF] font-bold'
              : embedded
              ? 'text-white/50 hover:text-white'
              : 'text-black/40 hover:text-black'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px]">
            {lang === 'en' ? 'Activity' : 'गतिविधि'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('visitors')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'visitors'
              ? 'text-[#12B5A6] font-bold'
              : embedded
              ? 'text-white/50 hover:text-white'
              : 'text-black/40 hover:text-black'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px]">
            {lang === 'en' ? 'Visitors' : 'आगंतुक'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'profile'
              ? 'text-[#2F5BFF] font-bold'
              : embedded
              ? 'text-white/50 hover:text-white'
              : 'text-black/40 hover:text-black'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">
            {lang === 'en' ? 'Profile' : 'प्रोफ़ाइल'}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: CAMERA VIEWFINDER OVERLAY (Page 4)                */}
      {/* ========================================================= */}
      <AnimatePresence>
        {verificationStage === 'viewfinder' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#070B1A] flex flex-col justify-between p-4"
          >
            {/* Viewfinder Top Bar */}
            <div className="flex items-center justify-between text-white text-xs pt-2">
              <button
                type="button"
                onClick={() => setVerificationStage('idle')}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 font-semibold"
              >
                {lang === 'en' ? 'Cancel' : 'रद्द करें'}
              </button>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#12B5A6] animate-pulse" />
                <span className="font-mono text-[10px]">EDGE YUNET ACTIVE</span>
              </div>
            </div>

            {/* Center Oval Face Guide (Page 4 UI/UX Spec) */}
            <div className="relative flex-1 flex flex-col items-center justify-center my-4">
              {/* Optional real camera video element */}
              {cameraActive && (
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover rounded-3xl opacity-80"
                />
              )}

              {/* Oval Aperture Frame */}
              <div className="relative z-10 w-48 h-64 sm:w-56 sm:h-72 border-2 border-[#12B5A6] rounded-[50%] flex items-center justify-center shadow-[0_0_30px_rgba(18,181,166,0.3)] animate-pulse">
                {/* 5 Facial Landmark Tracking Crosshairs */}
                <div className="w-1.5 h-1.5 rounded-full bg-[#12B5A6] absolute top-20 left-16" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#12B5A6] absolute top-20 right-16" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#12B5A6] absolute top-32" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#12B5A6] absolute bottom-24 left-18" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#12B5A6] absolute bottom-24 right-18" />
              </div>

              <p className="relative z-10 text-xs text-white/80 font-medium text-center mt-4">
                {lang === 'en'
                  ? 'Centre one face in the oval. Hold steady.'
                  : 'अंडाकार फ्रेम में एक चेहरा केंद्रित करें। स्थिर रहें।'}
              </p>
            </div>

            {/* Shutter Bottom Control */}
            <div className="flex flex-col items-center pb-4 space-y-3">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleCapture}
                  className="w-16 h-16 rounded-full border-4 border-white/30 bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(255,255,255,0.4)] cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-[#2F5BFF] bg-white" />
                </button>
              </div>

              <span className="text-[10px] text-white/50">
                Subject: {lang === 'en' ? selectedSubject.name : selectedSubject.nameHi}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 2: VERIFYING STAGE (Page 4 UI/UX Spec)               */}
      {/* ========================================================= */}
      <AnimatePresence>
        {verificationStage === 'verifying' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#070B1A] text-white flex flex-col justify-between p-6"
          >
            <div className="pt-8">
              <h2 className="text-2xl font-bold tracking-tight text-center">
                {lang === 'en' ? 'Verifying' : 'सत्यापित किया जा रहा है'}
              </h2>
              <p className="text-xs text-white/60 text-center mt-1">
                {lang === 'en' ? 'Please keep the app open.' : 'कृपया ऐप खुला रखें।'}
              </p>
            </div>

            {/* 4 Checkpoint Steps (Page 4 UI/UX Spec) */}
            <div className="space-y-4 max-w-xs mx-auto w-full">
              {[
                { title: 'Image quality', titleHi: 'छवि गुणवत्ता', step: 1 },
                { title: 'Face detection', titleHi: 'चेहरा पहचान (YuNet)', step: 2 },
                { title: 'Identity matching', titleHi: 'पहचान मिलान (SFace 128-D)', step: 3 },
                { title: 'Institutional authorisation', titleHi: 'संस्थागत प्राधिकरण नीति', step: 4 },
              ].map((item) => {
                const isPassed = verifyingStep >= item.step;
                const isCurrent = verifyingStep === item.step - 1;

                return (
                  <div key={item.step} className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                        isPassed
                          ? 'bg-[#1FB36B] text-white'
                          : isCurrent
                          ? 'border-2 border-[#2F5BFF] border-t-transparent animate-spin'
                          : 'border border-white/20 text-white/40'
                      }`}
                    >
                      {isPassed ? <Check className="w-3.5 h-3.5" /> : null}
                    </div>
                    <span
                      className={`text-sm ${
                        isPassed
                          ? 'text-white font-semibold'
                          : isCurrent
                          ? 'text-[#2F5BFF] font-medium'
                          : 'text-white/40'
                      }`}
                    >
                      {lang === 'en' ? item.title : item.titleHi}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pb-6 text-center">
              <span className="text-[10px] text-white/40 font-mono">
                CRYPTO LEDGER READY • IIM SAMBALPUR
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 3: OUTCOME SCREEN (Page 2, 5, 17, 21)               */}
      {/* ========================================================= */}
      <AnimatePresence>
        {verificationStage === 'outcome' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#070B1A] text-white flex flex-col justify-between p-6 overflow-y-auto"
          >
            <div className="flex flex-col items-center text-center pt-4 space-y-3">
              {/* Big Circle Icon (Green for Auth, Red for Denied, Amber for Pending) */}
              {selectedSubject.outcome === 'AUTHORIZED' && (
                <div className="w-20 h-20 rounded-full bg-[#1FB36B] flex items-center justify-center text-white shadow-[0_0_35px_rgba(31,179,107,0.4)]">
                  <Check className="w-10 h-10 stroke-[3]" />
                </div>
              )}
              {selectedSubject.outcome === 'DENIED' && (
                <div className="w-20 h-20 rounded-full bg-[#C93338] flex items-center justify-center text-white shadow-[0_0_35px_rgba(201,51,56,0.4)]">
                  <AlertCircle className="w-10 h-10 stroke-[3]" />
                </div>
              )}
              {selectedSubject.outcome === 'PENDING' && (
                <div className="w-20 h-20 rounded-full bg-[#FFB547] flex items-center justify-center text-black shadow-[0_0_35px_rgba(255,181,71,0.4)]">
                  <span className="text-3xl font-extrabold">?</span>
                </div>
              )}

              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  {selectedSubject.outcome === 'AUTHORIZED'
                    ? lang === 'en'
                      ? 'Entry Authorised'
                      : 'नीति से स्वीकृत'
                    : selectedSubject.outcome === 'DENIED'
                    ? lang === 'en'
                      ? 'Entry Denied'
                      : 'प्रवेश अस्वीकृत'
                    : lang === 'en'
                    ? 'Pending Review'
                    : 'समीक्षा लंबित'}
                </h2>
                <p className="text-xs text-white/70 mt-1 max-w-xs">
                  {lang === 'en'
                    ? selectedSubject.reasonEn
                    : selectedSubject.reasonHi}
                </p>
              </div>
            </div>

            {/* Breakdown Table (Page 2 & Page 21) */}
            <div className="my-4 p-4 rounded-[20px] bg-white/[0.04] border border-white/10 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/60">{lang === 'en' ? 'Name' : 'नाम'}</span>
                <span className="font-bold">{lang === 'en' ? selectedSubject.name : selectedSubject.nameHi}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/60">{lang === 'en' ? 'Identity' : 'पहचान'}</span>
                <span className="font-semibold text-[#1FB36B]">
                  {selectedSubject.outcome !== 'DENIED' ? (lang === 'en' ? 'Verified' : 'सत्यापित') : (lang === 'en' ? 'Unregistered' : 'गैर-पंजीकृत')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/60">{lang === 'en' ? 'Authorisation' : 'प्राधिकरण'}</span>
                <span
                  className={`font-semibold ${
                    selectedSubject.outcome === 'AUTHORIZED'
                      ? 'text-[#1FB36B]'
                      : selectedSubject.outcome === 'DENIED'
                      ? 'text-[#C93338]'
                      : 'text-[#FFB547]'
                  }`}
                >
                  {selectedSubject.outcome === 'AUTHORIZED'
                    ? lang === 'en'
                      ? 'Permitted'
                      : 'स्वीकृत'
                    : selectedSubject.outcome === 'DENIED'
                    ? lang === 'en'
                      ? 'Denied'
                      : 'अस्वीकृत'
                    : lang === 'en'
                    ? 'Supervisor Referral'
                    : 'पर्यवेक्षक संदर्भ'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/60">{lang === 'en' ? 'Gate' : 'द्वार'}</span>
                <span>Main Gate 01</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white/60">{lang === 'en' ? 'Cosine Score' : 'कोसाइन स्कोर'}</span>
                <span className="font-mono text-[#12B5A6]">{selectedSubject.score}</span>
              </div>
            </div>

            {/* Bottom Actions (56px buttons from UI/UX spec page 1 & 2) */}
            <div className="space-y-2 pb-2">
              <button
                type="button"
                onClick={() => handleRecordDecision()}
                className="w-full min-h-[50px] rounded-full bg-[#2F5BFF] hover:bg-[#254cd6] active:scale-[0.98] transition-all text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {selectedSubject.outcome === 'AUTHORIZED'
                    ? lang === 'en'
                      ? 'Record Permitted Entry'
                      : 'अनुमत प्रवेश दर्ज करें'
                    : selectedSubject.outcome === 'DENIED'
                    ? lang === 'en'
                      ? 'Log Denied Entry'
                      : 'अस्वीकृत प्रवेश लॉग करें'
                    : lang === 'en'
                    ? 'Refer to Supervisor'
                    : 'व्यवस्थापक को भेजें'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setVerificationStage('idle')}
                className="w-full py-2.5 rounded-full text-xs text-white/60 hover:text-white"
              >
                {lang === 'en' ? 'Back to Verify' : 'वापस जाएँ'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 4: REGISTER VISITOR MODAL (Page 6 & Page 17)        */}
      {/* ========================================================= */}
      <AnimatePresence>
        {registerModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className={`w-full max-w-sm rounded-t-[28px] sm:rounded-[28px] p-5 space-y-4 ${
                embedded ? 'bg-[#070B1A] text-white border border-white/10' : 'bg-white text-[#070B1A]'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="font-bold text-base">
                  {lang === 'en' ? 'Register Visitor' : 'आगंतुक पंजीकरण'}
                </h3>
                <button
                  type="button"
                  onClick={() => setRegisterModalOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRegisterVisitorSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium mb-1 opacity-70">
                    {lang === 'en' ? 'Visitor Full Name' : 'आगंतुक का पूरा नाम'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={newVisitorName}
                    onChange={(e) => setNewVisitorName(e.target.value)}
                    placeholder="e.g. Alok Verma"
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      embedded ? 'bg-black/50 border-white/10' : 'bg-[#F4F5F8] border-black/10'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 opacity-70">
                    {lang === 'en' ? 'Contact Phone' : 'संपर्क फोन'}
                  </label>
                  <input
                    type="tel"
                    value={newVisitorPhone}
                    onChange={(e) => setNewVisitorPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      embedded ? 'bg-black/50 border-white/10' : 'bg-[#F4F5F8] border-black/10'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 opacity-70">
                    {lang === 'en' ? 'Host Faculty / Officer' : 'मेजबान संकाय / अधिकारी'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={newVisitorHost}
                    onChange={(e) => setNewVisitorHost(e.target.value)}
                    placeholder="e.g. Prof. Mahadeo Jaiswal"
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      embedded ? 'bg-black/50 border-white/10' : 'bg-[#F4F5F8] border-black/10'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 opacity-70">
                    {lang === 'en' ? 'Purpose of Visit' : 'आने का उद्देश्य'}
                  </label>
                  <input
                    type="text"
                    value={newVisitorPurpose}
                    onChange={(e) => setNewVisitorPurpose(e.target.value)}
                    placeholder="e.g. Advisory Council Review"
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      embedded ? 'bg-black/50 border-white/10' : 'bg-[#F4F5F8] border-black/10'
                    }`}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#12B5A6] text-white font-bold text-xs hover:bg-[#10a395] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    {lang === 'en' ? 'Register & Generate Pass' : 'पंजीकृत करें और पास बनाएं'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 5: RECEIPT VIEW MODAL (Page 5 UI/UX Spec)            */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedReceiptEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className={`w-full max-w-sm rounded-[24px] p-5 space-y-4 ${
                embedded ? 'bg-[#070B1A] text-white border border-white/10' : 'bg-white text-[#070B1A]'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#2F5BFF]" />
                  <h3 className="font-bold text-sm">
                    {lang === 'en' ? 'Verification Receipt' : 'सत्यापन रसीद'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReceiptEvent(null)}
                  className="p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="opacity-60">{lang === 'en' ? 'Reference' : 'संदर्भ'}</span>
                  <span className="font-mono">{selectedReceiptEvent.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="opacity-60">{lang === 'en' ? 'Name' : 'नाम'}</span>
                  <span className="font-bold">{selectedReceiptEvent.person_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="opacity-60">{lang === 'en' ? 'Time' : 'समय'}</span>
                  <span>{new Date(selectedReceiptEvent.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="opacity-60">{lang === 'en' ? 'Gate' : 'द्वार'}</span>
                  <span>{selectedReceiptEvent.gate_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="opacity-60">{lang === 'en' ? 'Decision' : 'निर्णय'}</span>
                  <span className="font-bold text-[#1FB36B]">
                    {selectedReceiptEvent.guard_decision}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="opacity-60">{lang === 'en' ? 'Ledger Signature' : 'लेज़र हस्ताक्षर'}</span>
                  <span className="font-mono text-[10px] truncate max-w-[150px]">
                    {selectedReceiptEvent.cryptographic_signature}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReceiptEvent(null)}
                  className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 font-semibold text-xs"
                >
                  {lang === 'en' ? 'Done' : 'पूर्ण'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
