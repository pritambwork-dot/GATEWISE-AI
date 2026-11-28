'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  Car,
  Shield,
  Check,
  X,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Clock,
  Search,
  User,
  Users,
  LogOut,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  FileText,
  Smartphone,
  Plus,
  UserPlus,
  Eye,
  EyeOff,
  Zap,
  ShieldCheck,
  Lock,
  ChevronDown,
  RotateCcw,
  Upload,
} from 'lucide-react';
import { liveSync } from '@/lib/services/live-sync';
import { api } from '@/lib/services/api';
import {
  extractFaceDescriptorFromFile,
  extractFaceDescriptorFromDataUrl,
  preloadFaceVisionModels,
} from '@/lib/biometrics';
import { captureAndReadPlateFromVideo } from '@/lib/anpr';
import {
  VerificationEvent,
  VisitorPass,
  RegistrationRequest,
  VerificationResult,
  GuardPermissions,
} from '@/types';

export interface GuardWebAppProps {
  embedded?: boolean;
  onEventSynced?: (event: VerificationEvent) => void;
}

type TabType = 'verify' | 'requests' | 'activity' | 'visitors' | 'profile';
type VerificationStage = 'idle' | 'viewfinder_face' | 'viewfinder_vehicle' | 'verifying' | 'outcome';
type OutcomeCaseType = 'CASE_1_VERIFIED' | 'CASE_2_PARTIALLY_VERIFIED' | 'CASE_3_NOT_VERIFIED' | 'ACCESS_DENIED';

interface VerificationScenario {
  id: string;
  labelEn: string;
  labelHi: string;
  expectedCase: OutcomeCaseType;
  personName: string;
  personNameHi: string;
  personId: string;
  category: string;
  department: string;
  photoUrl: string;
  vehiclePlate: string;
  vehicleModel: string;
  vehicleMatched: boolean;
  isAssociated: boolean;
  score: number;
  failureReasonEn?: string;
  failureReasonHi?: string;
}

const PRESET_SCENARIOS: VerificationScenario[] = [
  {
    id: 'scen-1',
    labelEn: 'Scenario 1: Person & Vehicle Verified (Green)',
    labelHi: 'परिदृश्य 1: व्यक्ति और वाहन दोनों सत्यापित (हरा)',
    expectedCase: 'CASE_1_VERIFIED',
    personName: 'Dr. Rahul Sharma',
    personNameHi: 'डॉ. राहुल शर्मा',
    personId: 'FAC-8041',
    category: 'Faculty',
    department: 'Operations & Strategy, IIM Sambalpur',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    vehiclePlate: 'OD-15-AB-1234',
    vehicleModel: 'Tata Safari XZA+ (White)',
    vehicleMatched: true,
    isAssociated: true,
    score: 0.984,
  },
  {
    id: 'scen-2',
    labelEn: 'Scenario 2: Person Found, Vehicle Unregistered (Amber)',
    labelHi: 'परिदृश्य 2: व्यक्ति मिला, वाहन पंजीकृत नहीं (पीला)',
    expectedCase: 'CASE_2_PARTIALLY_VERIFIED',
    personName: 'Dr. Ananya Sharma',
    personNameHi: 'डॉ. अनन्या शर्मा',
    personId: 'FAC-8042',
    category: 'Faculty',
    department: 'Dean Academics, IIM Sambalpur',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    vehiclePlate: 'OD-02-XY-9999',
    vehicleModel: 'Commercial Taxi / Unregistered',
    vehicleMatched: false,
    isAssociated: false,
    score: 0.976,
    failureReasonEn: 'Vehicle OD-02-XY-9999 is not associated with this institutional account.',
    failureReasonHi: 'वाहन OD-02-XY-9999 इस संस्थागत खाते से संबद्ध नहीं है।',
  },
  {
    id: 'scen-3',
    labelEn: 'Scenario 3: Unknown Person, Registered Vehicle (Red)',
    labelHi: 'परिदृश्य 3: अज्ञात व्यक्ति, पंजीकृत वाहन (लाल)',
    expectedCase: 'CASE_3_NOT_VERIFIED',
    personName: 'Unregistered Driver',
    personNameHi: 'अज्ञात चालक',
    personId: 'UNKNOWN',
    category: 'Unknown',
    department: 'External Walk-in',
    photoUrl: '',
    vehiclePlate: 'OD-15-AB-1234',
    vehicleModel: 'Tata Safari XZA+',
    vehicleMatched: true,
    isAssociated: false,
    score: 0.312,
    failureReasonEn: 'Driver face does not match the registered owner (Dr. Rahul Sharma).',
    failureReasonHi: 'चालक का चेहरा पंजीकृत स्वामी से मेल नहीं खाता।',
  },
  {
    id: 'scen-4',
    labelEn: 'Scenario 4: Person & Vehicle Not Found (Red -> Add Person)',
    labelHi: 'परिदृश्य 4: कोई रिकॉर्ड नहीं मिला (लाल -> नया व्यक्ति)',
    expectedCase: 'CASE_3_NOT_VERIFIED',
    personName: 'Alok Verma (New Visitor)',
    personNameHi: 'आलोक वर्मा (नया आगंतुक)',
    personId: 'UNKNOWN',
    category: 'Visitor',
    department: 'External Guest',
    photoUrl: '',
    vehiclePlate: 'OD-15-X-3321',
    vehicleModel: 'Sedan (Unregistered)',
    vehicleMatched: false,
    isAssociated: false,
    score: 0.245,
    failureReasonEn: 'No matching authorized record was found in the centralized database.',
    failureReasonHi: 'केंद्रीकृत डेटाबेस में कोई मेल खाता रिकॉर्ड नहीं मिला।',
  },
  {
    id: 'scen-5',
    labelEn: 'Scenario 5: Expired Permission (Access Denied)',
    labelHi: 'परिदृश्य 5: समाप्त अनुमति (प्रवेश अस्वीकृत)',
    expectedCase: 'ACCESS_DENIED',
    personName: 'Vikram Patel',
    personNameHi: 'विक्रम पटेल',
    personId: 'STU-2024-112',
    category: 'Student',
    department: 'MBA 2024-26, IIM Sambalpur',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    vehiclePlate: 'OD-15-Q-8890',
    vehicleModel: 'Hyundai Creta SX',
    vehicleMatched: true,
    isAssociated: true,
    score: 0.961,
    failureReasonEn: 'Institutional gate clearance has expired for this student account.',
    failureReasonHi: 'इस छात्र खाते के लिए संस्थागत गेट अनुमति समाप्त हो गई है।',
  },
];

export const GuardWebApp: React.FC<GuardWebAppProps> = ({ embedded = false, onEventSynced }) => {
  // -------------------------------------------------------------------------
  // AUTHENTICATION STATE (Strict Isolation)
  // -------------------------------------------------------------------------
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('gatewise_guard_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const [accountId, setAccountId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotAccountId, setForgotAccountId] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // -------------------------------------------------------------------------
  // APP NAVIGATION & LANGUAGE
  // -------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<TabType>('verify');
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  // Guard Officer Session
  const [activeOfficer, setActiveOfficer] = useState({
    id: 'GRD-101',
    name: 'Officer Vikram Singh',
    nameHi: 'अधिकारी विक्रम सिंह',
    gate: 'Main Gate 01',
    gateCode: 'GATE-01',
    shift: 'Day Shift (06:00 - 18:00)',
  });

  // Live Guard Permissions synchronized from Admin Dashboard
  const [guardPermissions, setGuardPermissions] = useState<GuardPermissions>(() =>
    liveSync.getGuardPermissions('GRD-101')
  );

  // -------------------------------------------------------------------------
  // VERIFICATION WORKFLOW & CAMERA
  // -------------------------------------------------------------------------
  const [currentScenario, setCurrentScenario] = useState<VerificationScenario>(PRESET_SCENARIOS[0]);
  const [scanFaceInput, setScanFaceInput] = useState<string>('');
  const [scanPlateInput, setScanPlateInput] = useState<string>('');
  const [imageQualityMode, setImageQualityMode] = useState<'GOOD' | 'POOR' | 'MULTI_FACE'>('GOOD');
  const [capturedFacePreview, setCapturedFacePreview] = useState<string | null>(null);
  const [capturedFaceEmbedding, setCapturedFaceEmbedding] = useState<number[] | undefined>(undefined);
  const [capturedFaceQuality, setCapturedFaceQuality] = useState<number | null>(null);

  const [verificationStage, setVerificationStage] = useState<VerificationStage>('idle');
  const [verifyingStep, setVerifyingStep] = useState<number>(0);
  const [scanningPlate, setScanningPlate] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<VerificationResult | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const attachVideoRef = React.useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el && streamRef.current && el.srcObject !== streamRef.current) {
      el.srcObject = streamRef.current;
      el.play().catch(() => {});
    }
  }, []);

  // -------------------------------------------------------------------------
  // NEW PERSON REGISTRATION REQUEST FORM STATE
  // -------------------------------------------------------------------------
  const [regModalOpen, setRegModalOpen] = useState(false);
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCategory, setRegCategory] = useState<'Visitor' | 'Contractor' | 'VIP' | 'Delivery' | 'Temporary Staff'>('Visitor');
  const [regPurpose, setRegPurpose] = useState('');
  const [regDuration, setRegDuration] = useState('Full Day');
  const [regVehiclePlate, setRegVehiclePlate] = useState('');
  const [regNotes, setRegNotes] = useState('');
  const [regSubmitting, setRegSubmitting] = useState(false);

  // -------------------------------------------------------------------------
  // LIVE TELEMETRY & DATA LISTS
  // -------------------------------------------------------------------------
  const [events, setEvents] = useState<VerificationEvent[]>([]);
  const [visitors, setVisitors] = useState<VisitorPass[]>([]);
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);

  useEffect(() => {
    setEvents(liveSync.getEvents());
    setRequests(liveSync.getRegistrationRequests());
  }, []);
  const [liveSyncToast, setLiveSyncToast] = useState<string | null>(null);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const [selectedReceiptEvent, setSelectedReceiptEvent] = useState<VerificationEvent | null>(null);
  const [activitySearch, setActivitySearch] = useState('');
  const [activityFilter, setActivityFilter] = useState<'all' | 'permitted' | 'denied' | 'pending'>('all');

  // Real-time synchronization (including instant Admin permission changes & revocation)
  useEffect(() => {
    if (!isAuthenticated) return;

    try {
      const rawSess = sessionStorage.getItem('gatewise_guard_session');
      if (rawSess) {
        const parsed = JSON.parse(rawSess);
        setActiveOfficer((prev) => ({
          ...prev,
          id: parsed.guardId || prev.id,
          name: parsed.guardName || prev.name,
          gate: parsed.gateName || prev.gate,
          gateCode: parsed.gateId || parsed.stationId || prev.gateCode,
        }));
      }
    } catch {}

    liveSync.refreshGuardState().then(() => {
      setGuardPermissions(liveSync.getGuardPermissions(activeOfficer.id));
      setEvents(liveSync.getEvents());
      setRequests(liveSync.getRegistrationRequests());
    });

    const unsubscribe = liveSync.subscribe((msg) => {
      const latestGuards = liveSync.getGuards();
      const myGuard = latestGuards.find(
        (g) => g.badge_number === activeOfficer.id || g.username === activeOfficer.id.toLowerCase(),
      );
      if (myGuard && myGuard.account_status !== 'ACTIVE') {
        setIsAuthenticated(false);
        sessionStorage.removeItem('gatewise_guard_auth');
        sessionStorage.removeItem('gatewise_guard_token');
        sessionStorage.removeItem('gatewise_guard_session');
        setAuthError('Your guard session was suspended/deactivated by an administrator.');
        return;
      }
      if (myGuard?.permissions) {
        setGuardPermissions(myGuard.permissions);
      }
      setEvents(liveSync.getEvents());
      setRequests(liveSync.getRegistrationRequests());

      if (msg.type === 'GUARD_PERMISSIONS_UPDATED') {
        setLiveSyncToast(
          myGuard?.permissions?.can_create_person_directly
            ? lang === 'en'
              ? 'Admin granted Direct Person Creation permission (Mode 2).'
              : 'व्यवस्थापक ने प्रत्यक्ष व्यक्ति पंजीकरण अनुमति दी (मोड 2)।'
            : lang === 'en'
            ? 'Registration mode updated by Administrator.'
            : 'पंजीकरण मोड व्यवस्थापक द्वारा अद्यतन किया गया।',
        );
      }
    });

    return () => unsubscribe();
  }, [lang, activeOfficer.id, isAuthenticated]);

  // Clean auto-dismiss toast
  useEffect(() => {
    if (liveSyncToast) {
      const timer = setTimeout(() => setLiveSyncToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [liveSyncToast]);

  // Handle Live Camera Stream with unconditional video element mount + constraint fallback
  useEffect(() => {
    const isViewfinder =
      verificationStage === 'viewfinder_face' || verificationStage === 'viewfinder_vehicle';

    const stopActiveStream = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
    };

    if (!isViewfinder) {
      stopActiveStream();
      setCameraError(null);
      return;
    }

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraActive(false);
      setCameraError(
        'Browser live camera requires HTTPS & camera permissions. Tap "Native Camera / Photo" below.',
      );
      return;
    }

    let cancelled = false;
    setCameraError(null);

    const openCamera = async () => {
      stopActiveStream();
      try {
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { exact: 'environment' },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
        } catch {
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: { exact: 'environment' } },
              audio: false,
            });
          } catch {
            // Secondary preference for rear camera by device label or ideal environment constraint
            const devices = await navigator.mediaDevices.enumerateDevices().catch(() => []);
            const rearCam = devices.find(
              (d) =>
                d.kind === 'videoinput' &&
                /back|rear|environment|world/i.test(d.label || '') &&
                !/front|user|selfie/i.test(d.label || ''),
            );
            stream = await navigator.mediaDevices.getUserMedia({
              video: rearCam
                ? { deviceId: { exact: rearCam.deviceId } }
                : { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
              audio: false,
            });
          }
        }

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          try {
            await videoRef.current.play();
          } catch {
            // autoPlay + playsInline will begin playback once metadata arrives
          }
        }
        setCameraActive(true);
      } catch (err: any) {
        if (cancelled) return;
        setCameraActive(false);
        const errName = err?.name || '';
        if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
          setCameraError(
            'Camera access blocked. Allow back camera permission in browser settings or use "Native Camera / Photo" below.',
          );
        } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError' || errName === 'OverconstrainedError') {
          setCameraError(
            'Phone rear camera unavailable in this browser. Tap "Native Camera / Photo" below to capture.',
          );
        } else {
          setCameraError(
            `Rear camera unavailable (${err?.message || 'hardware error'}). Use "Native Camera / Photo" below.`,
          );
        }
      }
    };

    openCamera();

    return () => {
      cancelled = true;
      stopActiveStream();
    };
  }, [verificationStage]);

  // -------------------------------------------------------------------------
  // AUTHENTICATION LOGIC (Centralized Guard Roster + Immediate Revocation)
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // AUTHENTICATION HANDLERS (Real Cloud Auth + Backend Active Status Check)
  // -------------------------------------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const id = accountId.trim();
    const pass = password.trim();

    try {
      const res = await api.guardLogin(id, pass);
      setActiveOfficer({
        id: res.user.employee_id,
        name: res.user.full_name,
        nameHi: res.user.full_name,
        gate: (res.user as any).gate_name || 'Main Gate 01',
        gateCode: (res.user as any).gate_id || 'G-01',
        shift: 'Active Shift',
      });
      setIsAuthenticated(true);
      await liveSync.refreshGuardState();
      setGuardPermissions(liveSync.getGuardPermissions(res.user.employee_id));
      setEvents(liveSync.getEvents());
      setRequests(liveSync.getRegistrationRequests());
    } catch (err: any) {
      setAuthError(err?.message || (lang === 'en' ? 'Invalid account ID or password.' : 'खाता आईडी या पासवर्ड अमान्य है।'));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = () => {
    const guardToken =
      typeof window !== 'undefined' ? sessionStorage.getItem('gatewise_guard_token') : null;
    if (guardToken) {
      fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${guardToken}`,
        },
        body: JSON.stringify({}),
      }).catch(() => {});
    }
    setIsAuthenticated(false);
    sessionStorage.removeItem('gatewise_guard_auth');
    sessionStorage.removeItem('gatewise_guard_token');
    sessionStorage.removeItem('gatewise_guard_session');
    setSignOutModalOpen(false);
    setAccountId('');
    setPassword('');
    setAuthError(null);
  };

  // -------------------------------------------------------------------------
  // VERIFICATION ENGINE EXECUTION (Queries Centralized Cloud Backend)
  // -------------------------------------------------------------------------
  const handleGuardFaceFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    autoVerify = false,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const ext = await extractFaceDescriptorFromFile(file);
    if (!ext.ok || !ext.dataUrl) {
      setLiveSyncToast(ext.error || 'Invalid or blurry photo captured.');
      setCapturedFacePreview(null);
      setCapturedFaceEmbedding(undefined);
      setCapturedFaceQuality(ext.qualityScore ?? 10);
      return;
    }
    setCapturedFacePreview(ext.dataUrl);
    setCapturedFaceEmbedding(ext.embedding);
    setCapturedFaceQuality(ext.qualityScore ?? 85);
    if (autoVerify) {
      await executePipelineVerification({
        overrideCapture: { dataUrl: ext.dataUrl, embedding: ext.embedding },
      });
      return;
    }
    setLiveSyncToast(
      lang === 'en'
        ? `Face image ready (Quality ${ext.qualityScore}/100) — tap Verify to check central DB.`
        : `चेहरे की छवि तैयार (गुणवत्ता ${ext.qualityScore}/100)।`,
    );
  };

  const captureFromLiveVideo = async (): Promise<{
    ok: boolean;
    dataUrl?: string;
    embedding?: number[];
    error?: string;
  }> => {
    const videoEl = videoRef.current;
    if (!videoEl || !cameraActive || videoEl.videoWidth === 0 || videoEl.readyState < 2) {
      return {
        ok: false,
        error:
          lang === 'en'
            ? 'Live camera frame is not ready yet. Allow camera access or tap "Native Camera / Photo".'
            : 'कैमरा फ्रेम तैयार नहीं है। अनुमति दें या "कैमरा / फोटो" दबाएँ।',
      };
    }
    const maxDim = 720;
    const vw = videoEl.videoWidth;
    const vh = videoEl.videoHeight;
    const scale = Math.min(maxDim / vw, maxDim / vh, 1);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(48, Math.round(vw * scale));
    canvas.height = Math.max(48, Math.round(vh * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { ok: false, error: 'Unable to initialize camera frame canvas.' };
    }
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const ext = await extractFaceDescriptorFromDataUrl(dataUrl);
    if (!ext.ok) {
      return {
        ok: false,
        error: ext.error || 'Captured frame was blurry or too dark. Hold steady and retry.',
      };
    }
    setCapturedFacePreview(ext.dataUrl || dataUrl);
    setCapturedFaceEmbedding(ext.embedding);
    setCapturedFaceQuality(ext.qualityScore ?? 85);
    return { ok: true, dataUrl: ext.dataUrl || dataUrl, embedding: ext.embedding };
  };

  const startFaceScan = () => {
    setCameraError(null);
    if (!embedded) {
      preloadFaceVisionModels().catch(() => {});
    }
    setVerificationStage('viewfinder_face');
  };

  const handleAutoReadPlateFromCamera = async (): Promise<string | undefined> => {
    const videoEl = videoRef.current;
    if (!videoEl || !cameraActive) return scanPlateInput.trim() || undefined;
    setScanningPlate(true);
    try {
      const res = await captureAndReadPlateFromVideo(videoEl);
      if (res.ok && res.plate) {
        setScanPlateInput(res.plate);
        setLiveSyncToast(
          lang === 'en'
            ? `ANPR OCR detected plate ${res.plate} (${res.confidence ?? 0}% conf).`
            : `ANPR ने प्लेट ${res.plate} पढ़ी।`,
        );
        return res.plate;
      }
      if (res.error && !scanPlateInput.trim()) {
        setCameraError(res.error);
      }
      return scanPlateInput.trim() || undefined;
    } finally {
      setScanningPlate(false);
    }
  };

  const startVehicleScan = () => {
    setCameraError(null);
    setVerificationStage('viewfinder_vehicle');
  };

  const executePipelineVerification = async (options?: {
    fromViewfinder?: 'face' | 'vehicle';
    overrideCapture?: { dataUrl?: string; embedding?: number[] };
  }) => {
    let captured: { dataUrl?: string; embedding?: number[] } = {};

    if (options?.overrideCapture) {
      captured = options.overrideCapture;
    } else if (options?.fromViewfinder === 'face') {
      const liveCap = await captureFromLiveVideo();
      if (!liveCap.ok) {
        setCameraError(liveCap.error || 'Failed to capture live face frame.');
        setLiveSyncToast(liveCap.error || 'Failed to capture live face frame.');
        return;
      }
      captured = { dataUrl: liveCap.dataUrl, embedding: liveCap.embedding };
    }

    let plateFromAnpr: string | undefined;
    if (options?.fromViewfinder === 'vehicle') {
      // If guard already scanned a face, preserve it; auto-read license plate via Tesseract LSTM if input is empty
      if (capturedFacePreview && capturedFaceEmbedding) {
        captured = { dataUrl: capturedFacePreview, embedding: capturedFaceEmbedding };
      }
      if (!scanPlateInput.trim() && cameraActive && videoRef.current) {
        plateFromAnpr = await handleAutoReadPlateFromCamera();
      }
    } else if (capturedFacePreview && capturedFaceEmbedding) {
      captured = { dataUrl: capturedFacePreview, embedding: capturedFaceEmbedding };
    }

    setVerificationStage('verifying');
    setVerifyingStep(1);

    try {
      setVerifyingStep(2);
      const plateToVerify = (plateFromAnpr || scanPlateInput).trim() || undefined;
      setVerifyingStep(3);

      const result = await liveSync.verifyIdentityAndVehicle({
        face_image: captured.dataUrl,
        face_embedding: captured.embedding,
        vehicle_plate: plateToVerify,
        guard_id: activeOfficer.id,
        guard_name: activeOfficer.name,
        gate_id: activeOfficer.gateCode,
        direction: 'ENTRY',
      });

      setVerifyingStep(4);
      setCurrentResult(result);
      setEvents(liveSync.getEvents());
      setVerificationStage('outcome');
    } catch (err: any) {
      setVerificationStage('idle');
      setLiveSyncToast(err?.message || 'Verification engine error.');
    }
  };

  const handleConfirmDecision = async (decision: 'GRANT_ENTRY' | 'DENY_ENTRY') => {
    if (!currentResult) return;
    if (decision === 'GRANT_ENTRY' && !guardPermissions.can_record_entry_exit) {
      setLiveSyncToast('Permission denied: Entry recording permission revoked by administrator.');
      return;
    }

    const isGranted = decision === 'GRANT_ENTRY';
    try {
      const evtRes = await liveSync.recordGateEvent({
        verification_code: currentResult.verification_code,
        event_type: 'ENTRY',
        person_code: currentResult.person?.id,
        person_name: currentResult.person?.name || 'Subject',
        vehicle_plate: currentResult.vehicle?.normalized_plate || scanPlateInput.trim() || undefined,
        gate_code: activeOfficer.gateCode,
        verification_outcome: currentResult.case_outcome,
        guard_decision: isGranted ? 'ALLOW' : 'REJECT',
        similarity_score: currentResult.person?.confidence_score,
        rejection_reason: !isGranted ? currentResult.failure_reason || 'Denied by Guard' : undefined,
      });

      setEvents(liveSync.getEvents());
      if (onEventSynced && evtRes?.event) onEventSynced(evtRes.event);
      setLiveSyncToast(
        isGranted
          ? lang === 'en'
            ? 'Entry recorded in Central PostgreSQL.'
            : 'प्रवेश केंद्रीय डेटाबेस में दर्ज किया गया।'
          : lang === 'en'
          ? 'Entry denial logged to Admin Command Centre.'
          : 'प्रवेश अस्वीकृति लॉग की गई।',
      );
      setVerificationStage('idle');
      setCurrentResult(null);
    } catch (err: any) {
      setLiveSyncToast(err?.message || 'Failed recording gate event.');
    }
  };

  // -------------------------------------------------------------------------
  // NEW PERSON WORKFLOW A (REQUEST) vs WORKFLOW B (DIRECT CREATION)
  // -------------------------------------------------------------------------
  const openRegistrationFlow = (prefillName?: string, prefillPlate?: string, prefillPurpose?: string) => {
    if (!guardPermissions.can_submit_registration_requests && !guardPermissions.can_create_person_directly) {
      setLiveSyncToast(
        lang === 'en'
          ? 'Permission Denied: Admin has disabled registration rights for this guard account.'
          : 'अनुमति अस्वीकृत: व्यवस्थापक ने इस गार्ड के लिए पंजीकरण अधिकार अक्षम कर दिए हैं।'
      );
      return;
    }
    if (prefillName !== undefined) setRegFullName(prefillName);
    if (prefillPlate !== undefined) setRegVehiclePlate(prefillPlate);
    if (prefillPurpose !== undefined) setRegPurpose(prefillPurpose);
    setRegModalOpen(true);
  };

  const handleNewPersonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim()) return;

    setRegSubmitting(true);

    try {
      if (guardPermissions.can_create_person_directly) {
        const created = await liveSync.createPersonDirectlyByGuard({
          full_name: regFullName.trim(),
          phone: regPhone.trim() || undefined,
          category: regCategory,
          purpose: regPurpose.trim() || 'Institutional Visit',
          vehicle_plate: regVehiclePlate.trim() ? regVehiclePlate.trim().toUpperCase() : undefined,
          guard_id: activeOfficer.id,
          guard_name: activeOfficer.name,
          face_photo_url: capturedFacePreview || undefined,
          face_embedding: capturedFaceEmbedding,
        });
        setLiveSyncToast(
          lang === 'en'
            ? `Direct Record Created (${created.person_code}) [${created.account_status}]. Synced to Central DB.`
            : `प्रत्यक्ष रिकॉर्ड बनाया गया (${created.person_code})। केंद्रीय डेटाबेस में सहेजा गया।`
        );
        setActiveTab('verify');
      } else {
        const created = await liveSync.submitRegistrationRequest({
          submitted_by_guard_id: activeOfficer.id,
          submitted_by_guard_name: activeOfficer.name,
          gate_id: activeOfficer.gateCode,
          full_name: regFullName.trim(),
          phone: regPhone.trim() || undefined,
          category: regCategory,
          purpose: regPurpose.trim() || 'Institutional Visit',
          expected_duration: regDuration,
          vehicle_plate: regVehiclePlate.trim() ? regVehiclePlate.trim().toUpperCase() : undefined,
          additional_notes: regNotes.trim() || undefined,
          face_photo_url: capturedFacePreview || undefined,
          face_embedding: capturedFaceEmbedding,
        });
        setRequests(liveSync.getRegistrationRequests());
        setActiveTab('requests');
        setLiveSyncToast(
          lang === 'en'
            ? `Request ${created.request_code} sent for Admin approval.`
            : `अनुरोध ${created.request_code} व्यवस्थापक अनुमोदन हेतु भेजा गया।`
        );
      }

      setRegModalOpen(false);
      setRegFullName('');
      setRegPhone('');
      setRegPurpose('');
      setRegVehiclePlate('');
      setRegNotes('');
    } catch (err: any) {
      setLiveSyncToast(err?.message || 'Registration action blocked by server RBAC.');
    } finally {
      setRegSubmitting(false);
    }
  };

  // Today counters
  const todayVerifications = events.length;
  const pendingRequestsCount = requests.filter((r) => r.status === 'PENDING_APPROVAL').length;
  const activeVisitors = visitors.filter((v) => v.status === 'CHECKED_IN').length;

  // Filtered lists
  const filteredEvents = events.filter((ev) => {
    if (activityFilter === 'permitted') return ev.guard_decision === 'GRANT_ENTRY' || ev.outcome === 'VERIFIED_AUTHORIZED' || ev.outcome === 'CASE_1_VERIFIED';
    if (activityFilter === 'denied') return ev.guard_decision === 'DENY_ENTRY' || ev.outcome === 'ACCESS_DENIED';
    if (activityFilter === 'pending') return ev.guard_decision === 'ESCALATED' || ev.outcome === 'CASE_2_PARTIALLY_VERIFIED';
    return true;
  }).filter((ev) => {
    if (!activitySearch) return true;
    const q = activitySearch.toLowerCase();
    return (ev.person_name || '').toLowerCase().includes(q) || (ev.person_id || '').toLowerCase().includes(q);
  });

  // =========================================================================
  // SCREEN 1: GUARD LOGIN (Section 3 Screen 1)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div
        className={`relative flex flex-col justify-between w-full h-full font-sans select-none p-6 ${
          embedded
            ? 'min-h-[640px] bg-[#F6F7FB] text-[#070B1A] rounded-[28px] border border-black/10 shadow-xl'
            : 'min-h-screen bg-[#F6F7FB] text-[#070B1A]'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#2F5BFF] flex items-center justify-center text-white shadow-md">
            <div className="relative w-5 h-6 border-2 border-white border-b-0 rounded-t-full flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#12B5A6] -mt-1.5" />
            </div>
          </div>

          {/* Language Switcher */}
          <div
            className={`flex items-center rounded-lg p-0.5 border text-xs font-medium ${
              false
                ? 'bg-white/5 border-white/10 text-white'
                : 'bg-black/5 border-black/10 text-[#070B1A]'
            }`}
          >
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-md transition-all ${
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
              className={`px-2.5 py-1 rounded-md transition-all ${
                lang === 'hi'
                  ? 'bg-[#2F5BFF] text-white font-bold shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="my-auto space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2F5BFF]/15 border border-[#2F5BFF]/30 text-[10px] font-bold text-[#2F5BFF] uppercase tracking-wider mb-2">
              <Shield className="w-3 h-3 text-[#2F5BFF]" />
              <span>{lang === 'en' ? 'Guard Security Terminal' : 'गार्ड सुरक्षा टर्मिनल'}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {lang === 'en' ? 'Welcome back' : 'वापस स्वागत है'}
            </h1>
            <p className={`text-sm mt-1.5 ${false ? 'text-white/60' : 'text-black/50'}`}>
              {lang === 'en'
                ? 'Sign in to the official IIM Sambalpur gate terminal.'
                : 'आईआईएम संबलपुर आधिकारिक गेट टर्मिनल में साइन इन करें।'}
            </p>
          </div>

          {/* Error Banner */}
          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl bg-[#C93338]/10 border border-[#C93338]/30 text-xs font-semibold text-[#C93338] flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </motion.div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1.5 opacity-80">
                {lang === 'en' ? 'Account ID' : 'खाता आईडी'}
              </label>
              <input
                type="text"
                required
                value={accountId}
                onChange={(e) => {
                  setAccountId(e.target.value);
                  setAuthError(null);
                }}
                placeholder="GRD-101"
                className={`w-full px-4 py-3 rounded-2xl text-sm border outline-none font-medium transition-all ${
                  false
                    ? 'bg-black/40 border-white/10 text-white placeholder-white/30 focus:border-[#2F5BFF]'
                    : 'bg-white border-black/10 text-[#070B1A] placeholder-black/30 focus:border-[#2F5BFF] shadow-xs'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold opacity-80">
                  {lang === 'en' ? 'Password' : 'पासवर्ड'}
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setAuthError(null);
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-4 pr-16 py-3 rounded-2xl text-sm border outline-none font-medium transition-all ${
                    false
                      ? 'bg-black/40 border-white/10 text-white placeholder-white/30 focus:border-[#2F5BFF]'
                      : 'bg-white border-black/10 text-[#070B1A] placeholder-black/30 focus:border-[#2F5BFF] shadow-xs'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-xs font-semibold text-[#2F5BFF] hover:underline cursor-pointer"
                >
                  {showPassword
                    ? lang === 'en'
                      ? 'Hide'
                      : 'छुपाएँ'
                    : lang === 'en'
                    ? 'Show'
                    : 'दिखाएँ'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full min-h-[52px] rounded-full bg-[#2F5BFF] hover:bg-[#254cd6] active:scale-[0.98] transition-all text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              {authLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{lang === 'en' ? 'Sign In' : 'साइन इन करें'}</span>
              )}
            </button>
          </form>

          {/* Forgot Password */}
          <div className="pt-2 text-center space-y-2">
            <div>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className={`text-xs ${
                  false ? 'text-white/60 hover:text-white' : 'text-black/50 hover:text-black'
                } hover:underline`}
              >
                {lang === 'en' ? 'Forgot password?' : 'पासवर्ड भूल गए?'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 text-center space-y-1">
          <p className={`text-xs font-semibold ${false ? 'text-white/50' : 'text-black/40'}`}>
            {lang === 'en' ? 'Authorised security guards only' : 'केवल अधिकृत सुरक्षा गार्ड'}
          </p>
          <span className="text-[10px] text-[#12B5A6] font-mono">
            IIM Sambalpur Campus Security Directorate
          </span>
        </div>

        {/* Forgot Password Sheet */}
        <AnimatePresence>
          {forgotModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center p-0"
            >
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className={`w-full rounded-t-[28px] p-6 space-y-4 ${
                  false ? 'bg-[#070B1A] text-white border-t border-white/10' : 'bg-white text-[#070B1A]'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h3 className="text-lg font-bold">
                    {lang === 'en' ? 'Forgot password' : 'पासवर्ड भूल गए'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotModalOpen(false);
                      setForgotSent(false);
                    }}
                    className="p-1 rounded-full hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs opacity-70 leading-relaxed">
                  {lang === 'en'
                    ? 'Enter your guard account ID to send a recovery request to the Security Command Centre.'
                    : 'सुरक्षा कमांड सेंटर को पुनर्प्राप्ति अनुरोध भेजने के लिए अपनी गार्ड आईडी दर्ज करें।'}
                </p>

                {forgotSent ? (
                  <div className="p-3.5 rounded-2xl bg-[#1FB36B]/15 border border-[#1FB36B]/30 text-xs font-semibold text-[#1FB36B]">
                    {lang === 'en'
                      ? 'Request dispatched to Security Directorate.'
                      : 'अनुरोध सुरक्षा निदेशालय को भेज दिया गया है।'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={forgotAccountId}
                      onChange={(e) => setForgotAccountId(e.target.value)}
                      placeholder="GRD-101"
                      className={`w-full px-4 py-3 rounded-2xl text-xs border outline-none ${
                        false ? 'bg-black/50 border-white/10 text-white' : 'bg-[#F4F5F8] border-black/10'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setForgotSent(true)}
                      className="w-full py-3 rounded-full bg-[#2F5BFF] text-white font-bold text-xs"
                    >
                      {lang === 'en' ? 'Send Recovery Request' : 'पुनर्प्राप्ति अनुरोध भेजें'}
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED GUARD MOBILE INTERFACE
  // =========================================================================
  return (
    <div
      className={`relative flex flex-col w-full font-sans select-none overflow-hidden ${
        embedded
          ? 'h-full bg-[#F6F7FB] text-[#070B1A] rounded-[28px] border border-black/10 shadow-xl'
          : 'min-h-screen bg-[#F6F7FB] text-[#070B1A]'
      }`}
    >
      {/* Top Status Bar */}
      <div
        className={`px-4 sm:px-6 pt-3 pb-2.5 flex items-center justify-between border-b ${
          false
            ? 'bg-[#070B1A]/90 border-white/10 text-white'
            : 'bg-white border-black/5 text-[#070B1A]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#2F5BFF] flex items-center justify-center text-white shadow-sm">
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
            <span className={`text-[10px] ${false ? 'text-white/60' : 'text-black/50'}`}>
              {activeOfficer.gate} · IIM Sambalpur
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Sync Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2F5BFF]/10 border border-[#2F5BFF]/25 text-[10px] font-semibold text-[#2F5BFF]">
            <span>LIVE SYNC</span>
          </div>

          {/* Language Switcher */}
          <div
            className={`flex items-center rounded-lg p-0.5 border text-[11px] font-medium ${
              false
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
              className="text-white/80 hover:text-white ml-2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* ========================================================= */}
        {/* TAB 1: VERIFY (Screen 2: Main Scanning Interface)         */}
        {/* ========================================================= */}
        {activeTab === 'verify' && (
          <div className="space-y-4">
            {/* Guard Profile Summary */}
            <div
              className={`p-4 rounded-[20px] border flex items-center justify-between ${
                false
                  ? 'bg-gradient-to-r from-white/[0.06] to-white/[0.02] border-white/10'
                  : 'bg-white border-black/5 shadow-xs'
              }`}
            >
              <div>
                <p className={`text-xs ${false ? 'text-white/60' : 'text-black/50'}`}>
                  {lang === 'en' ? 'Duty Station' : 'ड्यूटी स्टेशन'}
                </p>
                <h3 className="text-sm font-bold tracking-tight">
                  {lang === 'en' ? activeOfficer.name : activeOfficer.nameHi}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#1FB36B]" />
                  <span className={`text-[11px] ${false ? 'text-white/70' : 'text-black/60'}`}>
                    {activeOfficer.gate} · {lang === 'en' ? 'On duty' : 'ड्यूटी पर'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className={`text-[10px] uppercase font-bold mb-1 ${false ? 'text-white/50' : 'text-black/40'}`}>
                  {lang === 'en' ? 'Live Cloud Sync' : 'केंद्रीय सिंक'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2F5BFF]/10 text-[#2F5BFF] text-[10px] font-bold border border-[#2F5BFF]/25">
                  PostgreSQL Active
                </span>
              </div>
            </div>

            {/* SCREEN 2: TWO PROMINENT SCANNING OPTIONS (Section 3 Prompt) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Option A: Scan Face */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={startFaceScan}
                className="p-4 rounded-[22px] bg-gradient-to-br from-[#2F5BFF] to-[#1e40af] text-white flex flex-col items-start justify-between shadow-lg relative overflow-hidden text-left min-h-[140px] cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-white/70 block">
                    {lang === 'en' ? 'Option A' : 'विकल्प क'}
                  </span>
                  <h3 className="text-base font-extrabold leading-tight">
                    {lang === 'en' ? 'Scan Face' : 'चेहरा स्कैन करें'}
                  </h3>
                  <p className="text-[10px] text-white/80 mt-1">
                    {lang === 'en' ? 'Biometric YuNet match' : 'बायोमेट्रिक पहचान मिलान'}
                  </p>
                </div>
              </motion.button>

              {/* Option B: Scan Vehicle */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={startVehicleScan}
                className="p-4 rounded-[22px] bg-gradient-to-br from-[#12B5A6] to-[#0d8277] text-white flex flex-col items-start justify-between shadow-lg relative overflow-hidden text-left min-h-[140px] cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-white/70 block">
                    {lang === 'en' ? 'Option B' : 'विकल्प ख'}
                  </span>
                  <h3 className="text-base font-extrabold leading-tight">
                    {lang === 'en' ? 'Scan Vehicle' : 'वाहन स्कैन करें'}
                  </h3>
                  <p className="text-[10px] text-white/80 mt-1">
                    {lang === 'en' ? 'ANPR plate OCR' : 'नंबर प्लेट एएनपीआर'}
                  </p>
                </div>
              </motion.button>
            </div>

            {/* COMBINED SCANNING ACTION (Face + Vehicle in one session) */}
            <div
              className={`p-4 rounded-[22px] border space-y-3 ${
                false ? 'bg-white/[0.04] border-white/10' : 'bg-white border-black/5 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2F5BFF]" />
                  <span className="font-bold text-xs">
                    {lang === 'en' ? 'Combined Verification Session' : 'संयुक्त सत्यापन सत्र (चेहरा + वाहन)'}
                  </span>
                </div>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    guardPermissions.can_create_person_directly
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-blue-50 text-[#2F5BFF] border-blue-200'
                  }`}
                >
                  {guardPermissions.can_create_person_directly ? 'Mode 2: Direct Create' : 'Mode 1: Approval Req'}
                </span>
              </div>

              {/* Captured Biometric Frame & Vehicle Plate Input */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold opacity-60 mb-1">
                    {lang === 'en' ? 'Face Photo Scan' : 'चेहरा फोटो स्कैन'}
                  </label>
                  <label
                    className={`w-full px-2.5 py-2 rounded-xl border text-xs flex items-center gap-2 cursor-pointer ${
                      false ? 'bg-black/40 border-white/10 text-white' : 'bg-[#F4F5F8] border-black/10 text-[#070B1A]'
                    }`}
                  >
                    {capturedFacePreview ? (
                      <img src={capturedFacePreview} alt="Face" className="w-5 h-5 rounded-full object-cover shrink-0" />
                    ) : (
                      <Camera className="w-3.5 h-3.5 text-[#2F5BFF] shrink-0" />
                    )}
                    <span className="truncate font-semibold">
                      {capturedFacePreview
                        ? `Q:${capturedFaceQuality ?? 85}`
                        : lang === 'en'
                        ? 'Upload / Snap Face'
                        : 'फोटो चुनें'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      data-testid="guard-face-upload"
                      onChange={handleGuardFaceFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-[10px] font-bold opacity-60 mb-1">
                    {lang === 'en' ? 'Plate (blank = pedestrian)' : 'वाहन नंबर'}
                  </label>
                  <input
                    type="text"
                    data-testid="guard-plate-input"
                    value={scanPlateInput}
                    onChange={(e) => setScanPlateInput(e.target.value.toUpperCase())}
                    placeholder="OD02AB1234"
                    className={`w-full px-2.5 py-2 rounded-xl border text-xs font-mono uppercase outline-none ${
                      false ? 'bg-black/40 border-white/10 text-white' : 'bg-[#F4F5F8] border-black/10 text-[#070B1A]'
                    }`}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => executePipelineVerification()}
                className="w-full min-h-[50px] rounded-full bg-[#2F5BFF] hover:bg-[#254cd6] active:scale-[0.98] transition-all text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-[#12B5A6]" />
                <span>
                  {lang === 'en'
                    ? 'Verify Face + Vehicle Together'
                    : 'चेहरा और वाहन एक साथ सत्यापित करें'}
                </span>
              </button>
            </div>

            {/* NEW PERSON REGISTRATION SHORTCUT (Respects Admin Permission Mode) */}
            <button
              type="button"
              onClick={() => openRegistrationFlow(scanFaceInput || '', scanPlateInput || '')}
              className={`w-full p-3.5 rounded-[18px] border border-dashed flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                guardPermissions.can_create_person_directly
                  ? 'border-amber-400/50 bg-amber-500/10 text-amber-700 hover:bg-amber-500/15'
                  : false
                  ? 'border-white/20 bg-white/[0.02] text-white/80 hover:bg-white/[0.06]'
                  : 'border-[#2F5BFF]/30 bg-[#2F5BFF]/5 text-[#2F5BFF] hover:bg-[#2F5BFF]/10'
              }`}
            >
              <UserPlus className="w-4 h-4 text-[#12B5A6]" />
              <span>
                {guardPermissions.can_create_person_directly
                  ? lang === 'en'
                    ? '+ ADD NEW PERSON (Direct Creation Mode)'
                    : '+ नया व्यक्ति जोड़ें (प्रत्यक्ष पंजीकरण)'
                  : lang === 'en'
                  ? '+ ADD NEW PERSON (Request Approval)'
                  : '+ नया व्यक्ति जोड़ें (अनुमोदन अनुरोध)'}
              </span>
            </button>

            {/* Today Counters Summary */}
            <div
              className={`p-4 rounded-[20px] border ${
                false ? 'bg-white/[0.04] border-white/10' : 'bg-white border-black/5 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${false ? 'text-white/60' : 'text-black/50'}`}>
                  {lang === 'en' ? 'Today at Gate 01' : 'आज गेट 01 पर'}
                </span>
                <span className="text-[10px] text-[#12B5A6] font-semibold">IIM Sambalpur</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className={`p-2.5 rounded-xl border ${false ? 'bg-black/30 border-white/5' : 'bg-[#F6F7FB] border-black/5'}`}>
                  <span className="block text-xl font-extrabold text-[#2F5BFF]">
                    {todayVerifications}
                  </span>
                  <span className={`text-[10px] leading-tight block mt-0.5 ${false ? 'text-white/60' : 'text-black/50'}`}>
                    {lang === 'en' ? 'Verifications' : 'सत्यापन'}
                  </span>
                </div>
                <div className={`p-2.5 rounded-xl border ${false ? 'bg-black/30 border-white/5' : 'bg-[#F6F7FB] border-black/5'}`}>
                  <span className="block text-xl font-extrabold text-[#FFB547]">
                    {pendingRequestsCount}
                  </span>
                  <span className={`text-[10px] leading-tight block mt-0.5 ${false ? 'text-white/60' : 'text-black/50'}`}>
                    {lang === 'en' ? 'Pending Req' : 'लंबित अनुरोध'}
                  </span>
                </div>
                <div className={`p-2.5 rounded-xl border ${false ? 'bg-black/30 border-white/5' : 'bg-[#F6F7FB] border-black/5'}`}>
                  <span className="block text-xl font-extrabold text-[#12B5A6]">
                    {activeVisitors}
                  </span>
                  <span className={`text-[10px] leading-tight block mt-0.5 ${false ? 'text-white/60' : 'text-black/50'}`}>
                    {lang === 'en' ? 'Active Inside' : 'सक्रिय अंदर'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: REQUESTS (Section 4: Registration Workflow)       */}
        {/* ========================================================= */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold tracking-tight">
                  {lang === 'en' ? 'Registration Requests' : 'पंजीकरण अनुरोध'}
                </h3>
                <p className={`text-xs ${false ? 'text-white/60' : 'text-black/50'}`}>
                  {lang === 'en'
                    ? 'Submitted by guards for administrator approval'
                    : 'व्यवस्थापक अनुमोदन हेतु प्रस्तुत अनुरोध'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRegModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#2F5BFF] text-white text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'New' : 'नया'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {requests.length === 0 ? (
                <div className={`p-6 rounded-[20px] text-center border ${false ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5'}`}>
                  <p className="text-xs text-white/50">
                    {lang === 'en' ? 'No pending registration requests.' : 'कोई लंबित अनुरोध नहीं।'}
                  </p>
                </div>
              ) : (
                requests.map((req) => (
                  <div
                    key={req.id}
                    className={`p-4 rounded-[20px] border space-y-2.5 ${
                      false ? 'bg-white/[0.04] border-white/10' : 'bg-white border-black/5 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{req.full_name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#2F5BFF]/10 text-[#2F5BFF] border border-[#2F5BFF]/20">
                            {req.request_code}
                          </span>
                        </div>
                        <span className={`text-[11px] block mt-0.5 ${false ? 'text-white/60' : 'text-black/50'}`}>
                          {req.category} · {req.purpose}
                        </span>
                      </div>

                      {/* Status Badges Matching Section 4 */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
                          req.status === 'APPROVED'
                            ? 'bg-[#1FB36B]/15 text-[#1FB36B] border border-[#1FB36B]/30'
                            : req.status === 'REJECTED'
                            ? 'bg-[#C93338]/15 text-[#C93338] border border-[#C93338]/30'
                            : req.status === 'ADDITIONAL_INFO_REQUIRED'
                            ? 'bg-[#2F5BFF]/15 text-[#2F5BFF] border border-[#2F5BFF]/30'
                            : 'bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30'
                        }`}
                      >
                        {req.status === 'APPROVED'
                          ? lang === 'en'
                            ? 'Approved'
                            : 'स्वीकृत'
                          : req.status === 'REJECTED'
                          ? lang === 'en'
                            ? 'Rejected'
                            : 'अस्वीकृत'
                          : req.status === 'ADDITIONAL_INFO_REQUIRED'
                          ? lang === 'en'
                            ? 'Info Required'
                            : 'जानकारी चाहिए'
                          : lang === 'en'
                          ? 'Pending Approval'
                          : 'अनुमोदन लंबित'}
                      </span>
                    </div>

                    <div className={`text-[11px] space-y-1 pt-1 border-t ${false ? 'border-white/5 text-white/70' : 'border-black/5 text-black/60'}`}>
                      {req.vehicle_plate && (
                        <div className="flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-[#12B5A6]" />
                          <span>Vehicle: {req.vehicle_plate}</span>
                        </div>
                      )}
                      <div>• Duration: {req.expected_duration}</div>
                      {req.phone && <div>• Phone: {req.phone}</div>}
                      {req.review_notes && (
                        <div className="text-[10px] text-amber-400 font-medium">
                          Admin note: {req.review_notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ACTIVITY                                           */}
        {/* ========================================================= */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold tracking-tight">
                  {lang === 'en' ? 'Scanning History' : 'स्कैनिंग इतिहास'}
                </h3>
                <p className={`text-xs ${false ? 'text-white/60' : 'text-black/50'}`}>
                  {activeOfficer.gate} · IIM Sambalpur
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEvents(liveSync.getEvents())}
                className="p-1.5 rounded-lg border text-xs flex items-center gap-1 hover:bg-white/5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-3 ${false ? 'text-white/40' : 'text-black/40'}`} />
              <input
                type="text"
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                placeholder={lang === 'en' ? 'Search activity by name or ID...' : 'नाम या आईडी से खोजें...'}
                className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border outline-none ${
                  false
                    ? 'bg-black/40 border-white/10 text-white placeholder-white/40'
                    : 'bg-white border-black/10 text-[#070B1A] placeholder-black/40 shadow-xs'
                }`}
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {(['all', 'permitted', 'denied', 'pending'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActivityFilter(filter)}
                  className={`px-3 py-1.5 rounded-full capitalize font-semibold transition-all shrink-0 ${
                    activityFilter === filter
                      ? 'bg-[#2F5BFF] text-white shadow-xs'
                      : false
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

            <div className="space-y-2">
              {filteredEvents.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedReceiptEvent(item)}
                  className={`p-3 rounded-2xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                    false
                      ? 'bg-black/20 hover:bg-black/40 border-white/5'
                      : 'bg-white hover:bg-black/5 border-black/5 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-8 h-8 rounded-full bg-[#2F5BFF]/15 text-[#2F5BFF] font-bold text-xs flex items-center justify-center shrink-0">
                      {(item.person_name || 'U')[0]}
                    </div>
                    <div className="truncate">
                      <span className="font-semibold block truncate">
                        {item.person_name || 'Subject'}
                      </span>
                      <span className={`text-[10px] ${false ? 'text-white/50' : 'text-black/40'}`}>
                        {item.gate_name} · {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      item.guard_decision === 'GRANT_ENTRY' || item.outcome === 'VERIFIED_AUTHORIZED' || item.outcome === 'CASE_1_VERIFIED'
                        ? 'bg-[#1FB36B]/15 text-[#1FB36B] border border-[#1FB36B]/30'
                        : item.guard_decision === 'DENY_ENTRY' || item.outcome === 'ACCESS_DENIED'
                        ? 'bg-[#C93338]/15 text-[#C93338] border border-[#C93338]/30'
                        : 'bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30'
                    }`}
                  >
                    {item.guard_decision === 'GRANT_ENTRY' || item.outcome === 'VERIFIED_AUTHORIZED' || item.outcome === 'CASE_1_VERIFIED'
                      ? lang === 'en'
                        ? 'Permitted'
                        : 'स्वीकृत'
                      : item.guard_decision === 'DENY_ENTRY' || item.outcome === 'ACCESS_DENIED'
                      ? lang === 'en'
                        ? 'Denied'
                        : 'अस्वीकृत'
                      : lang === 'en'
                      ? 'Partially Verified'
                      : 'आंशिक सत्यापित'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: VISITORS                                           */}
        {/* ========================================================= */}
        {activeTab === 'visitors' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold tracking-tight">
                  {lang === 'en' ? 'Visitor Passes' : 'आगंतुक पास'}
                </h3>
                <p className={`text-xs ${false ? 'text-white/60' : 'text-black/50'}`}>
                  {activeOfficer.gate} · IIM Sambalpur
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {visitors.map((v) => (
                <div
                  key={v.id}
                  className={`p-4 rounded-[20px] border space-y-3 ${
                    false ? 'bg-white/[0.04] border-white/10' : 'bg-white border-black/5 shadow-xs'
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
                      <p className={`text-xs mt-0.5 ${false ? 'text-white/60' : 'text-black/50'}`}>
                        {lang === 'en' ? 'Host' : 'मेजबान'}: {v.host_name}
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

                  <div className={`text-[11px] space-y-0.5 pt-1 border-t ${false ? 'border-white/5 text-white/70' : 'border-black/5 text-black/60'}`}>
                    <div>• {lang === 'en' ? 'Purpose' : 'उद्देश्य'}: {v.purpose}</div>
                    <div>• {lang === 'en' ? 'Valid' : 'वैधता'}: {v.valid_date} ({v.valid_until_time})</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: PROFILE (Guards ONLY — Zero Admin Access)          */}
        {/* ========================================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div
              className={`p-5 rounded-[20px] border flex flex-col items-center text-center space-y-2 ${
                false ? 'bg-white/[0.04] border-white/10' : 'bg-white border-black/5 shadow-xs'
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-[#2F5BFF] text-white text-xl font-bold flex items-center justify-center shadow-md">
                G
              </div>
              <div>
                <h3 className="text-base font-bold">
                  {lang === 'en' ? activeOfficer.name : activeOfficer.nameHi}
                </h3>
                <span className={`text-xs ${false ? 'text-white/60' : 'text-black/50'}`}>
                  Badge ID: {activeOfficer.id} · Active On Duty
                </span>
              </div>
            </div>

            <div
              className={`p-4 rounded-[20px] border space-y-2.5 text-xs ${
                false ? 'bg-white/[0.04] border-white/10' : 'bg-white border-black/5 shadow-xs'
              }`}
            >
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className={false ? 'text-white/60' : 'text-black/50'}>Institution</span>
                <span className="font-semibold">IIM Sambalpur</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className={false ? 'text-white/60' : 'text-black/50'}>Assigned Gate</span>
                <span className="font-semibold">{activeOfficer.gate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className={false ? 'text-white/60' : 'text-black/50'}>Assigned Shift</span>
                <span className="font-semibold">{activeOfficer.shift}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className={false ? 'text-white/60' : 'text-black/50'}>Role Authorization</span>
                <span className="font-semibold text-[#12B5A6]">Security Guard (Operational Terminal Only)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className={false ? 'text-white/60' : 'text-black/50'}>RBAC Isolation</span>
                <span className="font-semibold text-[#1FB36B]">Strictly Isolated from Admin Registry</span>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={() => setSignOutModalOpen(true)}
              className="w-full py-3.5 rounded-2xl bg-[#C93338]/10 hover:bg-[#C93338]/20 border border-[#C93338]/30 text-[#C93338] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              <LogOut className="w-4 h-4" />
              <span>{lang === 'en' ? 'Sign Out Guard Terminal' : 'गार्ड टर्मिनल साइन आउट करें'}</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* BOTTOM NAVIGATION BAR (Strict Guard Role Access)          */}
      {/* ========================================================= */}
      <div
        className={`px-2 py-2 border-t flex items-center justify-around text-xs ${
          false
            ? 'bg-[#070B1A]/95 border-white/10 text-white'
            : 'bg-white border-black/5 text-[#070B1A] shadow-md'
        }`}
      >
        <button
          type="button"
          onClick={() => setActiveTab('verify')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'verify' ? 'text-[#2F5BFF] font-bold' : false ? 'text-white/50' : 'text-black/40'
          }`}
        >
          <Camera className="w-5 h-5" />
          <span className="text-[10px]">{lang === 'en' ? 'Scan' : 'स्कैन'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer relative ${
            activeTab === 'requests' ? 'text-[#2F5BFF] font-bold' : false ? 'text-white/50' : 'text-black/40'
          }`}
        >
          <UserPlus className="w-5 h-5" />
          {pendingRequestsCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-[#FFB547]" />
          )}
          <span className="text-[10px]">{lang === 'en' ? 'Requests' : 'अनुरोध'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'activity' ? 'text-[#2F5BFF] font-bold' : false ? 'text-white/50' : 'text-black/40'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px]">{lang === 'en' ? 'History' : 'इतिहास'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('visitors')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'visitors' ? 'text-[#12B5A6] font-bold' : false ? 'text-white/50' : 'text-black/40'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px]">{lang === 'en' ? 'Passes' : 'पास'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'profile' ? 'text-[#2F5BFF] font-bold' : false ? 'text-white/50' : 'text-black/40'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">{lang === 'en' ? 'Guard' : 'गार्ड'}</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* CAMERA VIEWFINDER (Option A: Face Scan)                   */}
      {/* ========================================================= */}
      <AnimatePresence>
        {verificationStage === 'viewfinder_face' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed sm:absolute inset-0 z-50 bg-[#070B1A] flex flex-col justify-between p-4 overflow-y-auto"
          >
            <div className="flex items-center justify-between text-white text-xs pt-2 gap-2">
              <button
                type="button"
                onClick={() => setVerificationStage('idle')}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 font-semibold cursor-pointer shrink-0"
              >
                {lang === 'en' ? 'Cancel' : 'रद्द करें'}
              </button>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#12B5A6]/20 border border-[#12B5A6]/40 text-[#12B5A6] font-mono text-[10px]">
                <span className={`w-1.5 h-1.5 rounded-full ${cameraActive ? 'bg-[#12B5A6] animate-pulse' : 'bg-amber-400'}`} />
                <span>{cameraActive ? 'REAR CAMERA ACTIVE' : 'REAR CAMERA STANDBY'}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 font-mono text-[10px] shrink-0">
                BACK CAM ONLY
              </span>
            </div>

            <div className="relative flex-1 min-h-[280px] flex flex-col items-center justify-center my-3 rounded-3xl overflow-hidden bg-black/50 border border-white/10">
              <video
                ref={attachVideoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
                  cameraActive ? 'opacity-95' : 'opacity-0'
                }`}
              />

              {/* Oval Face Guide */}
              <div className="relative z-10 w-48 h-64 sm:w-56 sm:h-72 border-2 border-[#12B5A6] rounded-[50%] flex items-center justify-center shadow-[0_0_30px_rgba(18,181,166,0.3)] animate-pulse pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-[#12B5A6] absolute top-20 left-16" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#12B5A6] absolute top-20 right-16" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#12B5A6] absolute top-32" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#12B5A6] absolute bottom-24 left-18" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#12B5A6] absolute bottom-24 right-18" />
              </div>

              {cameraError ? (
                <div className="relative z-10 mt-4 mx-4 px-3 py-2 rounded-2xl bg-rose-950/90 border border-rose-400/40 text-rose-100 text-[11px] font-medium text-center max-w-xs">
                  {cameraError}
                </div>
              ) : (
                <p className="relative z-10 text-xs text-white/90 font-medium text-center mt-4 bg-black/60 px-3 py-1.5 rounded-full">
                  {cameraActive
                    ? lang === 'en'
                      ? 'Centre face in the oval & tap shutter to verify.'
                      : 'चेहरा फ्रेम में रखें और सत्यापन हेतु बटन दबाएँ।'
                    : lang === 'en'
                    ? 'Starting rear camera stream...'
                    : 'बैक कैमरा शुरू हो रहा है...'}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center pb-3 space-y-2.5">
              <button
                type="button"
                data-testid="guard-face-shutter"
                onClick={() => executePipelineVerification({ fromViewfinder: 'face' })}
                className="w-16 h-16 rounded-full border-4 border-white/30 bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(255,255,255,0.4)] cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full border-2 border-[#2F5BFF] bg-white" />
              </button>
              <span className="text-[10px] text-white/70">
                {lang === 'en' ? 'Tap Shutter to Capture & Compare Biometrics' : 'कैप्चर करने के लिए दबाएँ'}
              </span>

              <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-semibold cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-[#12B5A6]" />
                <span>
                  {lang === 'en' ? 'Native Back Camera / Photo' : 'बैक कैमरा / फोटो अपलोड'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  data-testid="viewfinder-face-native-upload"
                  onChange={(e) => handleGuardFaceFileUpload(e, true)}
                  className="hidden"
                />
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* CAMERA VIEWFINDER (Option B: Vehicle ANPR Scan)           */}
      {/* ========================================================= */}
      <AnimatePresence>
        {verificationStage === 'viewfinder_vehicle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed sm:absolute inset-0 z-50 bg-[#070B1A] flex flex-col justify-between p-4 overflow-y-auto"
          >
            <div className="flex items-center justify-between text-white text-xs pt-2 gap-2">
              <button
                type="button"
                onClick={() => setVerificationStage('idle')}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 font-semibold cursor-pointer shrink-0"
              >
                {lang === 'en' ? 'Cancel' : 'रद्द करें'}
              </button>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2F5BFF]/20 border border-[#2F5BFF]/40 text-[#2F5BFF] font-mono text-[10px]">
                <span className={`w-1.5 h-1.5 rounded-full ${cameraActive ? 'bg-[#2F5BFF] animate-pulse' : 'bg-amber-400'}`} />
                <span>REAR ANPR {cameraActive ? 'LIVE' : 'STANDBY'}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 font-mono text-[10px] shrink-0">
                BACK CAM ONLY
              </span>
            </div>

            <div className="relative flex-1 min-h-[280px] flex flex-col items-center justify-center my-3 rounded-3xl overflow-hidden bg-black/50 border border-white/10">
              <video
                ref={attachVideoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
                  cameraActive ? 'opacity-90' : 'opacity-0'
                }`}
              />

              {/* Number Plate Rectangular Guide + Manual Correction Input */}
              <div className="relative z-10 w-72 p-3 border-2 border-[#2F5BFF] rounded-2xl flex flex-col items-center justify-center shadow-[0_0_30px_rgba(47,91,255,0.4)] bg-black/60 backdrop-blur-xs space-y-2">
                <div className="text-white/70 font-mono text-[10px]">
                  VEHICLE REGISTRATION PLATE
                </div>
                <input
                  type="text"
                  value={scanPlateInput}
                  onChange={(e) => setScanPlateInput(e.target.value.toUpperCase())}
                  placeholder="OD02AB1234"
                  className="w-full px-3 py-1.5 rounded-lg bg-white/10 border border-white/25 font-mono text-sm tracking-widest text-[#12B5A6] font-bold text-center uppercase outline-none"
                />
                {cameraActive && (
                  <button
                    type="button"
                    disabled={scanningPlate}
                    onClick={() => handleAutoReadPlateFromCamera()}
                    className="w-full py-1.5 rounded-lg bg-[#2F5BFF] hover:bg-[#1E44E0] disabled:opacity-60 text-white text-[11px] font-bold tracking-wide cursor-pointer transition-colors"
                  >
                    {scanningPlate
                      ? 'Reading Plate (LSTM OCR)...'
                      : lang === 'en'
                      ? 'Auto-Read Plate (ANPR OCR)'
                      : 'प्लेट ऑटो-रीड (ANPR)'}
                  </button>
                )}
              </div>

              {cameraError ? (
                <div className="relative z-10 mt-4 mx-4 px-3 py-2 rounded-2xl bg-rose-950/90 border border-rose-400/40 text-rose-100 text-[11px] font-medium text-center max-w-xs">
                  {cameraError}
                </div>
              ) : (
                <p className="relative z-10 text-xs text-white/90 font-medium text-center mt-4 bg-black/60 px-3 py-1.5 rounded-full">
                  {lang === 'en'
                    ? 'Enter or confirm license plate above & tap verify.'
                    : 'ऊपर वाहन नंबर की पुष्टि करें और सत्यापित करें।'}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center pb-3 space-y-2.5">
              <button
                type="button"
                onClick={() => executePipelineVerification({ fromViewfinder: 'vehicle' })}
                className="w-16 h-16 rounded-full border-4 border-white/30 bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(255,255,255,0.4)] cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full border-2 border-[#12B5A6] bg-white" />
              </button>
              <span className="text-[10px] text-white/70">
                {lang === 'en' ? 'Tap to Verify Vehicle Plate' : 'नंबर प्लेट सत्यापित करें'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* VERIFYING STAGE PIPELINE                                  */}
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
                {lang === 'en' ? 'Verifying Credentials' : 'क्रेडेंशियल्स सत्यापित किए जा रहे हैं'}
              </h2>
              <p className="text-xs text-white/60 text-center mt-1">
                {lang === 'en'
                  ? 'Comparing biometric representation against centralized administrator database.'
                  : 'केंद्रीकृत व्यवस्थापक डेटाबेस से बायोमेट्रिक तुलना जारी है।'}
              </p>
            </div>

            <div className="space-y-4 max-w-xs mx-auto w-full">
              {[
                { title: 'Image quality & lighting validation', titleHi: 'छवि गुणवत्ता व प्रकाश सत्यापन', step: 1 },
                { title: 'SSD MobileNetV1 + ResNet-34 128-D match', titleHi: 'चेहरा पहचान (SSD MobileNetV1 + ResNet-34)', step: 2 },
                { title: 'Tesseract LSTM ANPR normalization', titleHi: 'वाहन नंबर प्लेट ANPR OCR', step: 3 },
                { title: 'Centralized institutional authorization', titleHi: 'केंद्रीकृत संस्थागत प्राधिकरण जांच', step: 4 },
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
                      className={`text-xs ${
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
                CENTRALIZED DB VERIFICATION • IIM SAMBALPUR
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* SCREEN 3: VERIFICATION RESULTS (Section 3 Cases 1, 2, 3)  */}
      {/* ========================================================= */}
      <AnimatePresence>
        {verificationStage === 'outcome' && currentResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#070B1A] text-white flex flex-col justify-between p-6 overflow-y-auto"
          >
            {/* Outcome Icon & Title */}
            <div className="flex flex-col items-center text-center pt-2 space-y-3">
              {currentResult.case_outcome === 'CASE_1_VERIFIED' && (
                <div className="w-20 h-20 rounded-full bg-[#1FB36B] flex items-center justify-center text-white shadow-[0_0_35px_rgba(31,179,107,0.4)]">
                  <Check className="w-10 h-10 stroke-[3]" />
                </div>
              )}
              {(currentResult.case_outcome === 'CASE_2_PARTIALLY_VERIFIED' || currentResult.case_outcome === 'MANUAL_REVIEW_REQUIRED') && (
                <div className="w-20 h-20 rounded-full bg-[#FFB547] flex items-center justify-center text-black shadow-[0_0_35px_rgba(255,181,71,0.4)]">
                  <AlertTriangle className="w-10 h-10 stroke-[2.5]" />
                </div>
              )}
              {(currentResult.case_outcome === 'CASE_3_NOT_VERIFIED' || currentResult.case_outcome === 'ACCESS_DENIED' || currentResult.case_outcome === 'ACCESS_EXPIRED') && (
                <div className="w-20 h-20 rounded-full bg-[#C93338] flex items-center justify-center text-white shadow-[0_0_35px_rgba(201,51,56,0.4)]">
                  <AlertCircle className="w-10 h-10 stroke-[3]" />
                </div>
              )}

              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase opacity-70 block">
                  STATUS
                </span>
                <h2
                  className={`text-2xl font-extrabold tracking-tight ${
                    currentResult.case_outcome === 'CASE_1_VERIFIED'
                      ? 'text-[#1FB36B]'
                      : currentResult.case_outcome === 'CASE_2_PARTIALLY_VERIFIED' || currentResult.case_outcome === 'MANUAL_REVIEW_REQUIRED'
                      ? 'text-[#FFB547]'
                      : 'text-[#C93338]'
                  }`}
                >
                  {currentResult.status_title}
                </h2>
                <p className="text-xs text-white/70 mt-1 max-w-xs leading-relaxed">
                  {currentResult.case_outcome === 'CASE_1_VERIFIED'
                    ? lang === 'en'
                      ? 'Person and vehicle successfully verified against institutional records.'
                      : 'व्यक्ति और वाहन दोनों संस्थागत रिकॉर्ड के अनुसार सफलतापूर्वक सत्यापित।'
                    : currentResult.case_outcome === 'CASE_2_PARTIALLY_VERIFIED'
                    ? lang === 'en'
                      ? 'Person is recognized, but vehicle is not registered or associated.'
                      : 'व्यक्ति की पहचान हो गई, परंतु वाहन पंजीकृत या संबद्ध नहीं है।'
                    : currentResult.failure_reason || (lang === 'en' ? 'No matching authorized record found.' : 'कोई रिकॉर्ड नहीं मिला।')}
                </p>
              </div>
            </div>

            {/* Structured Result Card matching Section 3 specifications */}
            <div className="my-3 p-4 rounded-[22px] bg-white/[0.04] border border-white/10 space-y-2.5 text-xs">
              {currentResult.person && (
                <>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/60">Person:</span>
                    <span className="font-bold">{currentResult.person.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/60">Face:</span>
                    <span className={currentResult.person.face_matched ? 'text-[#1FB36B] font-bold' : 'text-[#C93338] font-bold'}>
                      {currentResult.person.face_matched ? 'Match found' : 'No match'}
                      {currentResult.person.confidence_score ? ` (${(currentResult.person.confidence_score > 1 ? currentResult.person.confidence_score : currentResult.person.confidence_score * 100).toFixed(1)}%)` : ''}
                    </span>
                  </div>
                </>
              )}
              {currentResult.vehicle?.license_plate && (
                <>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/60">Vehicle:</span>
                    <span className="font-mono font-bold">{currentResult.vehicle.license_plate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/60">Vehicle:</span>
                    <span
                      className={
                        currentResult.vehicle.vehicle_matched && currentResult.vehicle.is_associated_with_person
                          ? 'text-[#1FB36B] font-bold'
                          : 'text-[#FFB547] font-bold'
                      }
                    >
                      {currentResult.vehicle.vehicle_matched && currentResult.vehicle.is_associated_with_person
                        ? 'Match found'
                        : currentResult.vehicle.vehicle_matched
                        ? 'Match found (different owner)'
                        : 'Unregistered'}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/60">Access:</span>
                <span
                  className={
                    currentResult.access_decision === 'AUTHORIZED'
                      ? 'text-[#1FB36B] font-bold'
                      : currentResult.access_decision === 'PARTIALLY_AUTHORIZED' || currentResult.access_decision === 'MANUAL_REVIEW_REQUIRED'
                      ? 'text-[#FFB547] font-bold'
                      : 'text-[#C93338] font-bold'
                  }
                >
                  {currentResult.access_decision}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white/60">Timestamp:</span>
                <span className="font-mono text-[10px] text-white/50">
                  {new Date(currentResult.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>

            {/* ACTIONS ACCORDING TO CASE SPECIFICATIONS */}
            <div className="space-y-2 pb-2">
              {/* CASE 1 ACTIONS: Record Entry & Cancel */}
              {currentResult.case_outcome === 'CASE_1_VERIFIED' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleConfirmDecision('GRANT_ENTRY')}
                    className="w-full min-h-[52px] rounded-full bg-[#1FB36B] hover:bg-[#199457] active:scale-[0.98] transition-all text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-5 h-5" />
                    <span>{lang === 'en' ? 'Record Entry' : 'प्रवेश दर्ज करें'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationStage('idle')}
                    className="w-full py-2.5 rounded-full text-xs text-white/60 hover:text-white cursor-pointer"
                  >
                    {lang === 'en' ? 'Cancel' : 'रद्द करें'}
                  </button>
                </>
              )}

              {/* CASE 2 ACTIONS: Request Vehicle Registration & Deny Entry */}
              {currentResult.case_outcome === 'CASE_2_PARTIALLY_VERIFIED' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setVerificationStage('idle');
                      openRegistrationFlow(
                        currentResult.person?.name || '',
                        currentResult.vehicle?.license_plate || '',
                        'Vehicle addition for registered person'
                      );
                    }}
                    className="w-full min-h-[50px] rounded-full bg-[#FFB547] text-black font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Car className="w-4 h-4 text-black" />
                    <span>{lang === 'en' ? 'Request Vehicle Registration' : 'वाहन पंजीकरण का अनुरोध करें'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirmDecision('DENY_ENTRY')}
                    className="w-full py-3 rounded-full bg-[#C93338]/20 border border-[#C93338]/40 text-[#C93338] font-bold text-xs cursor-pointer hover:bg-[#C93338]/30"
                  >
                    {lang === 'en' ? 'Deny Entry / Escalate' : 'प्रवेश अस्वीकार करें / आगे भेजें'}
                  </button>
                </>
              )}

              {/* MANUAL REVIEW (POOR LIGHTING / MULTIPLE FACES) */}
              {currentResult.case_outcome === 'MANUAL_REVIEW_REQUIRED' && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVerificationStage('idle')}
                    className="py-3 rounded-full bg-[#FFB547] text-black font-extrabold text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Retry Scan' : 'पुनः प्रयास'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirmDecision('DENY_ENTRY')}
                    className="py-3 rounded-full bg-[#C93338]/20 border border-[#C93338]/40 text-[#C93338] font-bold text-xs cursor-pointer"
                  >
                    <span>{lang === 'en' ? 'Escalate / Deny' : 'अस्वीकृत'}</span>
                  </button>
                </div>
              )}

              {/* CASE 3 / EXPIRED / DENIED ACTIONS */}
              {(currentResult.case_outcome === 'CASE_3_NOT_VERIFIED' ||
                currentResult.case_outcome === 'ACCESS_DENIED' ||
                currentResult.case_outcome === 'ACCESS_EXPIRED') && (
                <>
                  {currentResult.case_outcome === 'CASE_3_NOT_VERIFIED' && (
                    <button
                      type="button"
                      onClick={() => {
                        setVerificationStage('idle');
                        openRegistrationFlow(
                          currentResult.person?.name !== 'UNREGISTERED' && currentResult.person?.name !== 'Unrecognized Individual'
                            ? currentResult.person?.name || ''
                            : '',
                          currentResult.vehicle?.license_plate || ''
                        );
                      }}
                      className="w-full min-h-[50px] rounded-full bg-[#2F5BFF] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>
                        {guardPermissions.can_create_person_directly
                          ? lang === 'en'
                            ? 'Add New Person (Direct Mode)'
                            : 'नया व्यक्ति जोड़ें (प्रत्यक्ष मोड)'
                          : lang === 'en'
                          ? 'Request New Person Registration'
                          : 'नया व्यक्ति पंजीकरण का अनुरोध करें'}
                      </span>
                    </button>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setVerificationStage('idle')}
                      className="py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Retry Scan' : 'पुनः प्रयास'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConfirmDecision('DENY_ENTRY')}
                      className="py-2.5 rounded-full bg-[#C93338]/20 border border-[#C93338]/40 text-[#C93338] font-semibold text-xs flex items-center justify-center cursor-pointer hover:bg-[#C93338]/30"
                    >
                      <span>{lang === 'en' ? 'Deny Entry' : 'प्रवेश अस्वीकृत'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL: NEW PERSON REGISTRATION REQUEST (Section 4 Prompt) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {regModalOpen && (
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
              className={`w-full max-w-sm rounded-t-[28px] sm:rounded-[28px] p-5 space-y-3.5 max-h-[90vh] overflow-y-auto ${
                false ? 'bg-[#070B1A] text-white border border-white/10' : 'bg-white text-[#070B1A]'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <UserPlus className={`w-5 h-5 ${guardPermissions.can_create_person_directly ? 'text-amber-500' : 'text-[#2F5BFF]'}`} />
                  <div>
                    <h3 className="font-bold text-sm">
                      {guardPermissions.can_create_person_directly
                        ? lang === 'en'
                          ? 'Direct Person Registration'
                          : 'प्रत्यक्ष व्यक्ति पंजीकरण'
                        : lang === 'en'
                        ? 'Request New Person Registration'
                        : 'नया व्यक्ति पंजीकरण अनुरोध'}
                    </h3>
                    <p className="text-[10px] opacity-60">
                      {guardPermissions.can_create_person_directly
                        ? `Mode 2 Authorized (${guardPermissions.direct_record_policy}) · Tagged GUARD_CREATED`
                        : lang === 'en'
                        ? 'Submits PENDING request for Admin approval'
                        : 'व्यवस्थापक अनुमोदन हेतु लंबित अनुरोध'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRegModalOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleNewPersonSubmit} className="space-y-2.5 text-xs">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">
                    {lang === 'en' ? 'Full Name' : 'पूरा नाम'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Alok Verma"
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      false ? 'bg-black/50 border-white/10 text-white' : 'bg-[#F4F5F8] border-black/10'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">
                      {lang === 'en' ? 'Mobile Number' : 'मोबाइल नंबर'}
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98000 00000"
                      className={`w-full px-3 py-2 rounded-xl border outline-none ${
                        false ? 'bg-black/50 border-white/10 text-white' : 'bg-[#F4F5F8] border-black/10'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">
                      {lang === 'en' ? 'Person Category' : 'श्रेणी'}
                    </label>
                    <select
                      value={regCategory}
                      onChange={(e: any) => setRegCategory(e.target.value)}
                      className={`w-full px-2 py-2 rounded-xl border outline-none ${
                        false ? 'bg-black/50 border-white/10 text-white' : 'bg-[#F4F5F8] border-black/10'
                      }`}
                    >
                      <option value="Visitor">Visitor</option>
                      <option value="Contractor">Contractor</option>
                      <option value="VIP">VIP</option>
                      <option value="Delivery">Delivery</option>
                      <option value="Temporary Staff">Temporary Staff</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">
                      {lang === 'en' ? 'Vehicle Reg Plate' : 'वाहन नंबर'}
                    </label>
                    <input
                      type="text"
                      value={regVehiclePlate}
                      onChange={(e) => setRegVehiclePlate(e.target.value)}
                      placeholder="OD-15-X-3321"
                      className={`w-full px-3 py-2 rounded-xl border outline-none font-mono uppercase ${
                        false ? 'bg-black/50 border-white/10 text-white' : 'bg-[#F4F5F8] border-black/10'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">
                      {lang === 'en' ? 'Expected Duration' : 'अनुमानित अवधि'}
                    </label>
                    <select
                      value={regDuration}
                      onChange={(e) => setRegDuration(e.target.value)}
                      className={`w-full px-2 py-2 rounded-xl border outline-none ${
                        false ? 'bg-black/50 border-white/10 text-white' : 'bg-[#F4F5F8] border-black/10'
                      }`}
                    >
                      <option value="2 Hours">2 Hours</option>
                      <option value="Full Day">Full Day</option>
                      <option value="3 Days">3 Days</option>
                      <option value="1 Week">1 Week</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 opacity-80">
                    {lang === 'en' ? 'Purpose of Visit' : 'आने का उद्देश्य'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={regPurpose}
                    onChange={(e) => setRegPurpose(e.target.value)}
                    placeholder="e.g. Advisory Council Review Meeting"
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      false ? 'bg-black/50 border-white/10 text-white' : 'bg-[#F4F5F8] border-black/10'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 opacity-80">
                    {lang === 'en' ? 'Additional Notes' : 'अतिरिक्त टिप्पणी'}
                  </label>
                  <textarea
                    rows={2}
                    value={regNotes}
                    onChange={(e) => setRegNotes(e.target.value)}
                    placeholder="Host details, gate number, or special requests..."
                    className={`w-full px-3 py-1.5 rounded-xl border outline-none resize-none ${
                      false ? 'bg-black/50 border-white/10 text-white' : 'bg-[#F4F5F8] border-black/10'
                    }`}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={regSubmitting}
                    className="w-full py-3 rounded-full bg-[#2F5BFF] hover:bg-[#254cd6] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {regSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>
                        {guardPermissions.can_create_person_directly
                          ? lang === 'en'
                            ? 'Create Record in Central DB'
                            : 'डेटाबेस में सीधे सहेजें'
                          : lang === 'en'
                          ? 'Submit Registration Request'
                          : 'पंजीकरण अनुरोध प्रस्तुत करें'}
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* SIGN OUT CONFIRMATION BOTTOM SHEET                        */}
      {/* ========================================================= */}
      <AnimatePresence>
        {signOutModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center p-0"
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className={`w-full rounded-t-[28px] p-6 space-y-4 text-center ${
                false ? 'bg-[#070B1A] text-white border-t border-white/10' : 'bg-white text-[#070B1A]'
              }`}
            >
              <h3 className="text-xl font-bold">
                {lang === 'en' ? 'Sign out Guard Terminal?' : 'गार्ड टर्मिनल साइन आउट करें?'}
              </h3>
              <p className="text-xs opacity-70 max-w-xs mx-auto leading-relaxed">
                {lang === 'en'
                  ? 'Your session on this mobile gate terminal will end. Sign in credentials will be required to re-open.'
                  : 'इस गेट टर्मिनल पर आपका सत्र समाप्त हो जाएगा। पुनः खोलने के लिए क्रेडेंशियल आवश्यक होंगे।'}
              </p>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full min-h-[50px] rounded-full bg-[#C93338] hover:bg-[#b02a2f] active:scale-[0.98] transition-all text-white font-bold text-sm shadow-md cursor-pointer"
                >
                  {lang === 'en' ? 'Confirm Sign Out' : 'साइन आउट की पुष्टि करें'}
                </button>
                <button
                  type="button"
                  onClick={() => setSignOutModalOpen(false)}
                  className="w-full py-2.5 rounded-full text-xs font-semibold opacity-70 hover:opacity-100 cursor-pointer"
                >
                  {lang === 'en' ? 'Cancel' : 'रद्द करें'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL: VERIFICATION RECEIPT DETAILS                       */}
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
                false ? 'bg-[#070B1A] text-white border border-white/10' : 'bg-white text-[#070B1A]'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#2F5BFF]" />
                  <h3 className="font-bold text-sm">
                    {lang === 'en' ? 'Verification Log Receipt' : 'सत्यापन लॉग रसीद'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReceiptEvent(null)}
                  className="p-1 rounded-full hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="opacity-60">Event ID</span>
                  <span className="font-mono">{selectedReceiptEvent.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="opacity-60">Person</span>
                  <span className="font-bold">{selectedReceiptEvent.person_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="opacity-60">Gate Station</span>
                  <span>{selectedReceiptEvent.gate_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="opacity-60">Officer</span>
                  <span>{selectedReceiptEvent.guard_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="opacity-60">Decision</span>
                  <span className="font-bold text-[#1FB36B]">{selectedReceiptEvent.guard_decision}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="opacity-60">Ledger Hash</span>
                  <span className="font-mono text-[10px] truncate max-w-[150px]">
                    {selectedReceiptEvent.cryptographic_signature}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReceiptEvent(null)}
                  className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 font-semibold text-xs cursor-pointer"
                >
                  {lang === 'en' ? 'Close' : 'बंद करें'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
