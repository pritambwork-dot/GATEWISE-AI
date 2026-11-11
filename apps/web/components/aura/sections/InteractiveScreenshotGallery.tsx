import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, ChevronLeft, ChevronRight, Smartphone, Monitor, Layers } from 'lucide-react';
import { SectionEyebrow } from '../primitives/SectionEyebrow';

interface ScreenItem {
  id: string;
  category: 'guard' | 'admin' | 'workflow';
  title: string;
  src: string;
  subtitle: string;
}

const SCREENS: ScreenItem[] = [
  // Guard App
  {
    id: 'g-02',
    category: 'guard',
    title: 'Guard Viewfinder (Idle)',
    subtitle: 'Ruggedized terminal optical framing',
    src: '/media/screenshots/guard/02_guard_viewfinder_idle.png',
  },
  {
    id: 'g-03',
    category: 'guard',
    title: 'YuNet Landmark Isolation',
    subtitle: '5-point real-time face detection HUD',
    src: '/media/screenshots/guard/03_guard_detecting_landmarks.png',
  },
  {
    id: 'g-04',
    category: 'guard',
    title: 'SFace Biometric Match',
    subtitle: '128-D cosine distance computation',
    src: '/media/screenshots/guard/04_guard_biometric_match.png',
  },
  {
    id: 'g-05',
    category: 'guard',
    title: 'Clearance Granted Event',
    subtitle: 'Automatic boom barrier actuation',
    src: '/media/screenshots/guard/05_guard_entry_granted.png',
  },
  {
    id: 'g-08',
    category: 'guard',
    title: 'Processing HUD Pipeline',
    subtitle: 'Hardware-accelerated edge inference',
    src: '/media/screenshots/guard/08_guard_processing_hud.png',
  },
  {
    id: 'g-10',
    category: 'guard',
    title: 'Visitor Intake Module',
    subtitle: 'Digital pass issuance & QR validation',
    src: '/media/screenshots/guard/10_guard_visitor_intake.png',
  },
  {
    id: 'g-11',
    category: 'guard',
    title: 'Activity & Audit Log',
    subtitle: 'Offline SQLite transaction history',
    src: '/media/screenshots/guard/11_guard_activity_history.png',
  },
  {
    id: 'g-12',
    category: 'guard',
    title: 'Guard Profile & SOP',
    subtitle: 'Post assignment and duty verification',
    src: '/media/screenshots/guard/12_guard_profile_sop.png',
  },

  // Admin Portal
  {
    id: 'a-02',
    category: 'admin',
    title: 'Command Centre Dashboard',
    subtitle: 'Real-time multi-gate telemetry & alerts',
    src: '/media/screenshots/admin/02_command_centre.png',
  },
  {
    id: 'a-03',
    category: 'admin',
    title: 'Live Perimeter Activity',
    subtitle: 'Streaming clearance logs & HMAC hashes',
    src: '/media/screenshots/admin/03_live_activity.png',
  },
  {
    id: 'a-04',
    category: 'admin',
    title: 'Identity Roster & Directory',
    subtitle: 'Student and staff biometric vector catalog',
    src: '/media/screenshots/admin/04_people_identities.png',
  },
  {
    id: 'a-05',
    category: 'admin',
    title: 'Enrollment Requests',
    subtitle: 'Registrar approval workflow for newcomers',
    src: '/media/screenshots/admin/05_enrollment_requests.png',
  },
  {
    id: 'a-06',
    category: 'admin',
    title: 'Visitor Passes System',
    subtitle: 'Pre-scheduled institutional guest access',
    src: '/media/screenshots/admin/06_visitor_passes.png',
  },
  {
    id: 'a-07',
    category: 'admin',
    title: 'Gate Posts Management',
    subtitle: 'Turnstile, barrier, and ANPR lane control',
    src: '/media/screenshots/admin/07_gate_posts.png',
  },
  {
    id: 'a-08',
    category: 'admin',
    title: 'Guard Management & Shifts',
    subtitle: 'Security roster deployment & active sessions',
    src: '/media/screenshots/admin/08_guard_management.png',
  },
  {
    id: 'a-10',
    category: 'admin',
    title: 'Analytics & Incident Audit',
    subtitle: 'Peak throughput and exception forensics',
    src: '/media/screenshots/admin/10_analytics_eval.png',
  },

  // Workflows
  {
    id: 'w-01',
    category: 'workflow',
    title: 'Connected Verification Flow',
    subtitle: 'Edge terminal to central ledger synchronization',
    src: '/media/screenshots/workflows/01_connected_verification_flow.png',
  },
  {
    id: 'w-02',
    category: 'workflow',
    title: 'Device Pair Composition',
    subtitle: 'Guard Android client + Command Centre macOS app',
    src: '/media/screenshots/workflows/02_device_pair_composition.png',
  },
];

export const InteractiveScreenshotGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'guard' | 'admin' | 'workflow'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredScreens = SCREENS.filter(
    (s) => activeCategory === 'all' || s.category === activeCategory
  );

  const selectedScreen = lightboxIndex !== null ? filteredScreens[lightboxIndex] : null;

  return (
    <section className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-16 md:py-24">
      {/* Eyebrow & Headline */}
      <div className="flex flex-col items-center text-center mb-10 space-y-4">
        <SectionEyebrow label="Interface Gallery" tag="24 Verified Screens" />
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Real Application Interface Gallery
        </h2>
        <p className="text-white/60 max-w-xl text-sm sm:text-base leading-relaxed">
          High-resolution captures from the operational Android Guard terminal and macOS Command Centre.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {[
            { id: 'all', label: 'All Screenshots', icon: Layers },
            { id: 'guard', label: 'Guard Mobile App', icon: Smartphone },
            { id: 'admin', label: 'Admin Command Centre', icon: Monitor },
            { id: 'workflow', label: 'Security Workflows', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-white text-black shadow-md'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Screen Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredScreens.map((screen, idx) => (
          <motion.div
            key={screen.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.04 }}
            onClick={() => setLightboxIndex(idx)}
            className="liquid-glass rounded-2xl overflow-hidden border border-white/10 group cursor-pointer hover:border-[#00d2ff]/50 transition-all flex flex-col justify-between"
          >
            {/* Screenshot Thumbnail */}
            <div className="relative aspect-[16/10] bg-black/60 overflow-hidden flex items-center justify-center">
              <img
                src={screen.src}
                alt={screen.title}
                className="w-full h-full object-cover object-top opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />

              {/* Hover Zoom Reticle */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="p-2.5 rounded-full bg-black/70 backdrop-blur-md border border-white/30 text-white">
                  <Maximize2 className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Caption */}
            <div className="p-4 bg-black/30 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white group-hover:text-[#00d2ff] transition-colors truncate">
                  {screen.title}
                </h4>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                  {screen.category}
                </span>
              </div>
              <p className="text-[11px] text-white/50 truncate">{screen.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
            onClick={() => setLightboxIndex(null)}
          >
            <div
              className="relative max-w-5xl w-full max-h-[90vh] liquid-glass rounded-3xl border border-white/20 overflow-hidden flex flex-col bg-black/95 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/50">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">{selectedScreen.title}</h3>
                  <p className="text-xs text-white/50">{selectedScreen.subtitle}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLightboxIndex((idx) => (idx! > 0 ? idx! - 1 : filteredScreens.length - 1))}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex((idx) => (idx! < filteredScreens.length - 1 ? idx! + 1 : 0))}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(null)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Image View */}
              <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-black/40">
                <img
                  src={selectedScreen.src}
                  alt={selectedScreen.title}
                  className="max-h-[72vh] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-white/10"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
