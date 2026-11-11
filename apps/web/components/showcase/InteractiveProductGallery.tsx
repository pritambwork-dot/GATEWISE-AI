'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Smartphone, Monitor, Search, X, ChevronLeft, ChevronRight,
  Maximize2, Minimize2, ZoomIn, ZoomOut, Download, ExternalLink,
  ShieldCheck, Filter, Layers, Check, Info, Sparkles
} from 'lucide-react';

export interface ScreenshotItem {
  id: string;
  title: string;
  category: 'guard' | 'admin' | 'verification' | 'visitors' | 'administration';
  platform: 'Android Guard' | 'Admin Portal' | 'Connected Architecture';
  aspect: 'desktop' | 'mobile';
  baseFilename: string;
  imageWebp: string;
  imagePng: string;
  dimensions: string;
  description: string;
  keyFeatures: string[];
}

const GALLERY_ITEMS: ScreenshotItem[] = [
  // --- GUARD SCREENS ---
  {
    id: 'guard-01',
    title: 'Guard Post Authentication',
    category: 'guard',
    platform: 'Android Guard',
    aspect: 'desktop',
    baseFilename: '01_guard_login',
    imageWebp: '/media/screenshots/guard/01_guard_login.webp',
    imagePng: '/media/screenshots/guard/01_guard_login.png',
    dimensions: '1440 x 900',
    description: 'Cryptographically bounded PIN login screen tying Officer Ramesh Verma to Gate-Main-02 hardware credentials.',
    keyFeatures: ['Hardware device binding', 'Sovereign local PIN', 'Post assignment verification']
  },
  {
    id: 'guard-02',
    title: 'Active Edge Viewfinder',
    category: 'verification',
    platform: 'Android Guard',
    aspect: 'desktop',
    baseFilename: '02_guard_viewfinder_idle',
    imageWebp: '/media/screenshots/guard/02_guard_viewfinder_idle.webp',
    imagePng: '/media/screenshots/guard/02_guard_viewfinder_idle.png',
    dimensions: '1440 x 900',
    description: 'Camera viewfinder awaiting subject entry with high-contrast daylight HUD and continuous frame rate indicator.',
    keyFeatures: ['30fps continuous pipeline', 'Dynamic boundary reticle', 'Outdoor sunlight visibility mode']
  },
  {
    id: 'guard-03',
    title: '5-Point Landmark Detection',
    category: 'verification',
    platform: 'Android Guard',
    aspect: 'desktop',
    baseFilename: '03_guard_detecting_landmarks',
    imageWebp: '/media/screenshots/guard/03_guard_detecting_landmarks.webp',
    imagePng: '/media/screenshots/guard/03_guard_detecting_landmarks.png',
    dimensions: '1440 x 900',
    description: 'YuNet neural network tracking eye pupils, nose tip, and mouth corners within 28ms to verify presentation quality.',
    keyFeatures: ['28ms YuNet edge inference', '5-point facial landmark grid', 'Pose tilt & blur assessment']
  },
  {
    id: 'guard-04',
    title: 'SFace Biometric Match',
    category: 'verification',
    platform: 'Android Guard',
    aspect: 'desktop',
    baseFilename: '04_guard_biometric_match',
    imageWebp: '/media/screenshots/guard/04_guard_biometric_match.webp',
    imagePng: '/media/screenshots/guard/04_guard_biometric_match.png',
    dimensions: '1440 x 900',
    description: 'On-device SFace engine extracting 128-D embedding and computing 0.984 cosine similarity against local vector cache.',
    keyFeatures: ['128-dimensional embedding', '0.984 Cosine similarity', 'Zero raw image storage']
  },
  {
    id: 'guard-05',
    title: 'Access Clearance Granted',
    category: 'verification',
    platform: 'Android Guard',
    aspect: 'desktop',
    baseFilename: '05_guard_entry_granted',
    imageWebp: '/media/screenshots/guard/05_guard_entry_granted.webp',
    imagePng: '/media/screenshots/guard/05_guard_entry_granted.png',
    dimensions: '1440 x 900',
    description: 'Immediate tactile admission screen displaying verified faculty profile, authorization tier, and barrier trigger pulse.',
    keyFeatures: ['Sub-300ms total latency', 'Turnstile relay pulse', 'Cryptographic admission badge']
  },
  {
    id: 'guard-06',
    title: 'Native Hardware Security',
    category: 'guard',
    platform: 'Android Guard',
    aspect: 'desktop',
    baseFilename: '06_guard_camera_permission',
    imageWebp: '/media/screenshots/guard/06_guard_camera_permission.webp',
    imagePng: '/media/screenshots/guard/06_guard_camera_permission.png',
    dimensions: '1440 x 900',
    description: 'Secure camera hardware initialization and cryptographic enclave validation for Android 10+ edge devices.',
    keyFeatures: ['Hardware keystore check', 'Secure buffer allocation', 'Tamper detection guard']
  },
  {
    id: 'guard-07',
    title: 'Offline Capture Review',
    category: 'guard',
    platform: 'Android Guard',
    aspect: 'desktop',
    baseFilename: '07_guard_capture_review',
    imageWebp: '/media/screenshots/guard/07_guard_capture_review.webp',
    imagePng: '/media/screenshots/guard/07_guard_capture_review.png',
    dimensions: '1440 x 900',
    description: 'Guard-in-the-loop fallback screen enabling secondary review and manual officer override during edge anomalies.',
    keyFeatures: ['Sovereign guard override', 'Reason code registration', 'Dual verification logs']
  },
  {
    id: 'guard-08',
    title: 'Edge Processing HUD',
    category: 'verification',
    platform: 'Android Guard',
    aspect: 'desktop',
    baseFilename: '08_guard_processing_hud',
    imageWebp: '/media/screenshots/guard/08_guard_processing_hud.webp',
    imagePng: '/media/screenshots/guard/08_guard_processing_hud.png',
    dimensions: '1440 x 900',
    description: 'Detailed telemetry overlay displaying inference duration, cosine distribution, and active turnstile relay status.',
    keyFeatures: ['Inference time telemetry', 'Memory cache statistics', 'Relay contact monitor']
  },
  {
    id: 'guard-09',
    title: 'Visitor Pass Directory',
    category: 'visitors',
    platform: 'Android Guard',
    aspect: 'desktop',
    baseFilename: '09_guard_visitor_directory',
    imageWebp: '/media/screenshots/guard/09_guard_visitor_directory.webp',
    imagePng: '/media/screenshots/guard/09_guard_visitor_directory.png',
    dimensions: '1440 x 900',
    description: 'Fast search directory of pre-approved guest visits, scheduled vendor passes, and VIP arrivals at the checkpoint.',
    keyFeatures: ['Instant offline search', 'Host department routing', 'Time-limited pass status']
  },
  {
    id: 'guard-10',
    title: 'Visitor Intake & QR Scan',
    category: 'visitors',
    platform: 'Android Guard',
    aspect: 'desktop',
    baseFilename: '10_guard_visitor_intake',
    imageWebp: '/media/screenshots/guard/10_guard_visitor_intake.webp',
    imagePng: '/media/screenshots/guard/10_guard_visitor_intake.png',
    dimensions: '1440 x 900',
    description: 'Rapid intake form for ad-hoc campus guests with instantaneous digital badge issue and ID verification.',
    keyFeatures: ['QR code fast scan', 'Vehicle registration capture', 'Host SMS notification trigger']
  },
  {
    id: 'guard-11',
    title: 'Local Ingress Ledger',
    category: 'guard',
    platform: 'Android Guard',
    aspect: 'desktop',
    baseFilename: '11_guard_activity_history',
    imageWebp: '/media/screenshots/guard/11_guard_activity_history.webp',
    imagePng: '/media/screenshots/guard/11_guard_activity_history.png',
    dimensions: '1440 x 900',
    description: 'On-device SQLite event queue showing recent verifications and automatic sync status with the central server.',
    keyFeatures: ['Offline-first SQLite queue', 'Zero data drop guarantee', 'Auto-sync reconnection']
  },
  {
    id: 'guard-12',
    title: 'Officer SOP & Post Profile',
    category: 'administration',
    platform: 'Android Guard',
    aspect: 'desktop',
    baseFilename: '12_guard_profile_sop',
    imageWebp: '/media/screenshots/guard/12_guard_profile_sop.webp',
    imagePng: '/media/screenshots/guard/12_guard_profile_sop.png',
    dimensions: '1440 x 900',
    description: 'Shift operational checklist, emergency campus protocols, and gate handover verification for security officers.',
    keyFeatures: ['Emergency lockdown button', 'Shift handover checklist', 'Post SOP quick reference']
  },

  // --- ADMIN PORTAL SCREENS ---
  {
    id: 'admin-01',
    title: 'Admin MFA Portal Access',
    category: 'admin',
    platform: 'Admin Portal',
    aspect: 'desktop',
    baseFilename: '01_admin_login',
    imageWebp: '/media/screenshots/admin/01_admin_login.webp',
    imagePng: '/media/screenshots/admin/01_admin_login.png',
    dimensions: '1440 x 900',
    description: 'Institutional security sign-in with hardware token and multi-factor challenge for access control directors.',
    keyFeatures: ['WebAuthn FIDO2 support', 'RBAC role enforcement', 'Brute-force mitigation']
  },
  {
    id: 'admin-02',
    title: 'Central Command Centre',
    category: 'admin',
    platform: 'Admin Portal',
    aspect: 'desktop',
    baseFilename: '02_command_centre',
    imageWebp: '/media/screenshots/admin/02_command_centre.webp',
    imagePng: '/media/screenshots/admin/02_command_centre.png',
    dimensions: '1440 x 900',
    description: 'Comprehensive campus security dashboard showing gate network status, active guard posts, and throughput volume.',
    keyFeatures: ['Multi-gate topology overview', 'Daily throughput counter', 'System health diagnostics']
  },
  {
    id: 'admin-03',
    title: 'Live Telemetry Stream',
    category: 'verification',
    platform: 'Admin Portal',
    aspect: 'desktop',
    baseFilename: '03_live_activity',
    imageWebp: '/media/screenshots/admin/03_live_activity.webp',
    imagePng: '/media/screenshots/admin/03_live_activity.png',
    dimensions: '1440 x 900',
    description: 'Sub-second WebSocket event feed streaming live entries, cosine matching scores, and cryptographic signature seals.',
    keyFeatures: ['Sub-second WebSocket feed', 'HMAC-SHA256 signature audit', 'Instant exception highlights']
  },
  {
    id: 'admin-04',
    title: 'Institutional Registry',
    category: 'administration',
    platform: 'Admin Portal',
    aspect: 'desktop',
    baseFilename: '04_people_identities',
    imageWebp: '/media/screenshots/admin/04_people_identities.webp',
    imagePng: '/media/screenshots/admin/04_people_identities.png',
    dimensions: '1440 x 900',
    description: 'Centralized personnel repository managing student, faculty, and contractor credentials and vector enrollment status.',
    keyFeatures: ['Search by ID / Department', 'Vector enrollment indicator', 'Access tier permissions']
  },
  {
    id: 'admin-05',
    title: 'Biometric Enrollment Approvals',
    category: 'admin',
    platform: 'Admin Portal',
    aspect: 'desktop',
    baseFilename: '05_enrollment_requests',
    imageWebp: '/media/screenshots/admin/05_enrollment_requests.webp',
    imagePng: '/media/screenshots/admin/05_enrollment_requests.png',
    dimensions: '1440 x 900',
    description: 'Administrative approval queue for student and staff vector onboarding with quality score validation.',
    keyFeatures: ['Multi-angle quality check', 'Identity document cross-check', 'Batch vector generation']
  },
  {
    id: 'admin-06',
    title: 'Visitor Pass Management',
    category: 'visitors',
    platform: 'Admin Portal',
    aspect: 'desktop',
    baseFilename: '06_visitor_passes',
    imageWebp: '/media/screenshots/admin/06_visitor_passes.webp',
    imagePng: '/media/screenshots/admin/06_visitor_passes.png',
    dimensions: '1440 x 900',
    description: 'Digital visitor management suite managing pre-approved guest invitations, campus escorts, and parking passes.',
    keyFeatures: ['Scheduled visitor passes', 'Host approval workflows', 'Blacklist alert triggers']
  },
  {
    id: 'admin-07',
    title: 'Gate Hardware Posts',
    category: 'administration',
    platform: 'Admin Portal',
    aspect: 'desktop',
    baseFilename: '07_gate_posts',
    imageWebp: '/media/screenshots/admin/07_gate_posts.webp',
    imagePng: '/media/screenshots/admin/07_gate_posts.png',
    dimensions: '1440 x 900',
    description: 'Turnstile controller mapping, network latency health, and emergency lockdown controls for all campus access points.',
    keyFeatures: ['Hardware latency monitoring', 'Global lockdown switch', 'Barrier controller relays']
  },
  {
    id: 'admin-08',
    title: 'Security Officer Roster',
    category: 'administration',
    platform: 'Admin Portal',
    aspect: 'desktop',
    baseFilename: '08_guard_management',
    imageWebp: '/media/screenshots/admin/08_guard_management.webp',
    imagePng: '/media/screenshots/admin/08_guard_management.png',
    dimensions: '1440 x 900',
    description: 'Guard deployment management, active shift logs, device pairing keys, and duty rosters across all campus gates.',
    keyFeatures: ['Post assignment matrix', 'Active session tracking', 'Officer credential lifecycle']
  },
  {
    id: 'admin-09',
    title: 'Sovereign Document Vault',
    category: 'admin',
    platform: 'Admin Portal',
    aspect: 'desktop',
    baseFilename: '09_drive_repository',
    imageWebp: '/media/screenshots/admin/09_drive_repository.webp',
    imagePng: '/media/screenshots/admin/09_drive_repository.png',
    dimensions: '1440 x 900',
    description: 'Encrypted document vault for campus security protocols, CCTV incident reports, and compliance certificates.',
    keyFeatures: ['AES-256 at rest', 'Role-scoped document access', 'Tamper-evident audit trail']
  },
  {
    id: 'admin-10',
    title: 'Throughput & Cosine Analytics',
    category: 'admin',
    platform: 'Admin Portal',
    aspect: 'desktop',
    baseFilename: '10_analytics_eval',
    imageWebp: '/media/screenshots/admin/10_analytics_eval.webp',
    imagePng: '/media/screenshots/admin/10_analytics_eval.png',
    dimensions: '1440 x 900',
    description: 'Statistical analytics detailing peak ingress hours, model cosine distributions, and false-rejection mitigation curves.',
    keyFeatures: ['Peak ingress heatmaps', 'Cosine threshold tuning', 'SLA compliance charts']
  },
  {
    id: 'admin-11',
    title: 'Policy Engine & HMAC Keys',
    category: 'administration',
    platform: 'Admin Portal',
    aspect: 'desktop',
    baseFilename: '11_system_settings',
    imageWebp: '/media/screenshots/admin/11_system_settings.webp',
    imagePng: '/media/screenshots/admin/11_system_settings.png',
    dimensions: '1440 x 900',
    description: 'System-wide security policy configuration, secret key rotation, retention schedules, and backup orchestrators.',
    keyFeatures: ['HMAC key rotation', 'Biometric policy tuning', 'Automated nightly backups']
  },
  {
    id: 'admin-12',
    title: 'AI Security Assistant Panel',
    category: 'administration',
    platform: 'Admin Portal',
    aspect: 'desktop',
    baseFilename: '12_ai_assistant_panel',
    imageWebp: '/media/screenshots/admin/12_ai_assistant_panel.webp',
    imagePng: '/media/screenshots/admin/12_ai_assistant_panel.png',
    dimensions: '1440 x 900',
    description: 'Natural language interface for querying access telemetry, detecting abnormal ingress patterns, and generating reports.',
    keyFeatures: ['Natural language queries', 'Anomaly pattern discovery', 'Automated shift briefings']
  },
];

type CategoryFilter = 'all' | 'guard' | 'admin' | 'verification' | 'visitors' | 'administration';

export default function InteractiveProductGallery() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState<'fit' | 'fill' | 'large'>('fit');

  // Filter items based on activeCategory and searchQuery
  const filteredItems = GALLERY_ITEMS.filter((item) => {
    const matchesCategory =
      activeCategory === 'all'
        ? true
        : activeCategory === 'guard'
        ? item.platform === 'Android Guard'
        : activeCategory === 'admin'
        ? item.platform === 'Admin Portal'
        : item.category === activeCategory;

    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keyFeatures.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Lightbox keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedItemIndex === null) return;
      if (e.key === 'Escape') {
        setSelectedItemIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedItemIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setSelectedItemIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
      }
    },
    [selectedItemIndex, filteredItems.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedItemIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedItemIndex]);

  const activeLightboxItem = selectedItemIndex !== null ? filteredItems[selectedItemIndex] : null;

  return (
    <section id="product-gallery" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gatewise-light/80 text-gatewise-deep border border-gatewise-mint/60 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5 text-gatewise-primary" />
          <span>Interactive Screenshot Gallery · 24 High-Res Screens</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gatewise-text tracking-tight">
          Inside GATEWISE AI
        </h2>
        <p className="text-sm sm:text-base text-gatewise-secondary leading-relaxed">
          Examine the exact production interfaces deployed across the Android guard APK and the web Command Centre. Every screen is purpose-built for high-speed perimeter oversight.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gatewise-border pb-6">
        
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {(
            [
              { key: 'all', label: 'All Screens', count: 24 },
              { key: 'guard', label: 'Guard App', count: 12 },
              { key: 'admin', label: 'Admin Portal', count: 12 },
              { key: 'verification', label: 'Verification Flow', count: 7 },
              { key: 'visitors', label: 'Visitor & Passes', count: 4 },
              { key: 'administration', label: 'Administration', count: 5 },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveCategory(tab.key);
                setSelectedItemIndex(null);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === tab.key
                  ? 'bg-gatewise-primary text-white shadow-xs'
                  : 'bg-white border border-gatewise-border text-gatewise-secondary hover:text-gatewise-text hover:border-gatewise-primary/40'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeCategory === tab.key ? 'bg-white/25 text-white' : 'bg-black/[0.04] text-gatewise-muted'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gatewise-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search screens, features..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white border border-gatewise-borderMedium focus:outline-none focus:ring-2 focus:ring-gatewise-primary/30 transition-all text-gatewise-text placeholder:text-gatewise-muted shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gatewise-muted hover:text-gatewise-text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Screenshots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setSelectedItemIndex(index)}
            className="group relative bg-white rounded-2xl border border-gatewise-borderMedium/80 shadow-2xs hover:shadow-xl hover:border-gatewise-primary/50 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
          >
            {/* Image Frame with Aspect Container */}
            <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden border-b border-gatewise-border">
              <picture>
                <source srcSet={item.imageWebp} type="image/webp" />
                <img
                  src={item.imagePng}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </picture>

              {/* Hover Overlay with Zoom Icon */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <div className="px-3.5 py-2 rounded-xl bg-white/95 text-gatewise-text text-xs font-semibold shadow-lg flex items-center space-x-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <Maximize2 className="w-3.5 h-3.5 text-gatewise-primary" />
                  <span>Inspect Screen (1440x900)</span>
                </div>
              </div>

              {/* Platform Chip */}
              <div className="absolute top-3 left-3 pointer-events-none">
                <span
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold backdrop-blur-md shadow-xs ${
                    item.platform === 'Android Guard'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-950/80 text-gatewise-mint border border-slate-700/50'
                  }`}
                >
                  {item.platform === 'Android Guard' ? (
                    <Smartphone className="w-3 h-3" />
                  ) : (
                    <Monitor className="w-3 h-3" />
                  )}
                  <span>{item.platform}</span>
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-base font-bold text-gatewise-text group-hover:text-gatewise-primary transition-colors tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-gatewise-secondary mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Key Features Pill Strip */}
              <div className="pt-2 flex flex-wrap gap-1.5">
                {item.keyFeatures.map((feat, fidx) => (
                  <span
                    key={fidx}
                    className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-md bg-gatewise-light/60 text-gatewise-deep border border-gatewise-mint/40"
                  >
                    <Check className="w-2.5 h-2.5 mr-1 text-gatewise-primary" />
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gatewise-border">
          <Info className="w-8 h-8 text-gatewise-muted mx-auto mb-2" />
          <h4 className="text-sm font-bold text-gatewise-text">No screens match your search</h4>
          <p className="text-xs text-gatewise-secondary mt-1">
            Try adjusting your query or click &apos;All Screens&apos; to view the complete catalog.
          </p>
        </div>
      )}

      {/* Full-Screen Interactive Lightbox Modal */}
      {activeLightboxItem && selectedItemIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 overflow-hidden animate-in fade-in duration-200"
        >
          {/* Top Modal Bar */}
          <div className="flex items-center justify-between text-white pb-3 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs text-slate-400">
                {selectedItemIndex + 1} of {filteredItems.length}
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                {activeLightboxItem.title}
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] font-medium text-slate-300">
                {activeLightboxItem.platform}
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => setLightboxZoom(lightboxZoom === 'fit' ? 'large' : 'fit')}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-xs flex items-center space-x-1"
                title="Toggle Zoom (Fit / 150%)"
              >
                {lightboxZoom === 'fit' ? <ZoomIn className="w-4 h-4" /> : <ZoomOut className="w-4 h-4" />}
                <span className="hidden sm:inline">{lightboxZoom === 'fit' ? 'Zoom 150%' : 'Fit'}</span>
              </button>

              <a
                href={activeLightboxItem.imagePng}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-xs flex items-center space-x-1"
                title="Open Raw High-Res PNG"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Raw PNG</span>
              </a>

              <button
                onClick={() => setSelectedItemIndex(null)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Center Image Display with Navigation Chevrons */}
          <div className="relative flex-1 flex items-center justify-center my-3 overflow-auto">
            {/* Previous Button */}
            <button
              onClick={() =>
                setSelectedItemIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1))
              }
              className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition-all shadow-xl"
              aria-label="Previous Screenshot"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Displayed Image */}
            <div
              className={`transition-all duration-300 flex items-center justify-center ${
                lightboxZoom === 'large' ? 'scale-150 cursor-grab max-w-none' : 'max-h-[75vh] max-w-[90vw]'
              }`}
            >
              <picture>
                <source srcSet={activeLightboxItem.imageWebp} type="image/webp" />
                <img
                  src={activeLightboxItem.imagePng}
                  alt={activeLightboxItem.title}
                  className="max-h-[75vh] max-w-[90vw] object-contain rounded-xl shadow-2xl border border-white/10"
                />
              </picture>
            </div>

            {/* Next Button */}
            <button
              onClick={() =>
                setSelectedItemIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0))
              }
              className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition-all shadow-xl"
              aria-label="Next Screenshot"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Bottom Metadata Card */}
          <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 sm:p-5 text-white max-w-4xl mx-auto w-full backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <span className="font-mono text-[11px] text-gatewise-mint uppercase tracking-wider font-semibold">
                  {activeLightboxItem.dimensions} • {activeLightboxItem.baseFilename}.png
                </span>
                <h4 className="text-base font-bold text-white tracking-tight">{activeLightboxItem.title}</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeLightboxItem.keyFeatures.map((feat, fidx) => (
                  <span
                    key={fidx}
                    className="px-2 py-0.5 rounded bg-white/10 text-slate-200 text-[11px] font-mono"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
              {activeLightboxItem.description}
            </p>

            <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
              <span>Press <strong>Esc</strong> to close • <strong>← / →</strong> to navigate</span>
              <span>Synthetic demonstration data • Privacy compliant</span>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
