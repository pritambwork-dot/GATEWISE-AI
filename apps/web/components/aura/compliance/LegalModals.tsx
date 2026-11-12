import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Lock, FileText, CheckCircle2, AlertCircle, Cookie, Scale, Server, Cpu } from 'lucide-react';

export type LegalModalType = 'privacy' | 'terms' | 'security' | 'compliance' | 'cookies' | null;

export const LegalModals: React.FC = () => {
  const [activeModal, setActiveModal] = useState<LegalModalType>(null);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ modal: LegalModalType }>;
      if (customEvent.detail && customEvent.detail.modal) {
        setActiveModal(customEvent.detail.modal);
      }
    };
    window.addEventListener('open-legal-modal', handleOpen);
    return () => window.removeEventListener('open-legal-modal', handleOpen);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModal(null);
    };
    if (activeModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModal]);

  const closeModal = () => setActiveModal(null);

  return (
    <AnimatePresence>
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="liquid-glass relative w-full max-w-4xl max-h-[88vh] rounded-3xl border border-white/20 bg-[#0e1014]/95 backdrop-blur-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden z-10 text-white"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00d2ff]/20 to-[#3D81E3]/20 border border-white/10 flex items-center justify-center text-[#00d2ff]">
                  {activeModal === 'privacy' && <Shield className="w-5 h-5" />}
                  {activeModal === 'terms' && <Scale className="w-5 h-5" />}
                  {activeModal === 'security' && <Lock className="w-5 h-5" />}
                  {activeModal === 'compliance' && <FileText className="w-5 h-5" />}
                  {activeModal === 'cookies' && <Cookie className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {activeModal === 'privacy' && 'Zero-Image Privacy Policy'}
                    {activeModal === 'terms' && 'Institutional Terms of Service'}
                    {activeModal === 'security' && 'Security Whitepaper & Architecture'}
                    {activeModal === 'compliance' && 'ISO/IEC 27001 & DPDP Act 2023 Compliance'}
                    {activeModal === 'cookies' && 'Institutional Cookie Governance'}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-white/50 font-mono">
                    <span>SOVEREIGN PERIMETER STANDARD v2.4</span>
                    <span>•</span>
                    <span className="text-emerald-400">ACTIVE &amp; ENFORCED</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-white/80 leading-relaxed font-sans">
              {activeModal === 'privacy' && (
                <>
                  <div className="p-4 rounded-2xl bg-[#00d2ff]/10 border border-[#00d2ff]/20 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#00d2ff] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold text-white text-sm">Core Guarantee: Zero Persistent Image Storage</span>
                      <p className="text-xs text-white/80 leading-relaxed">
                        Under GATEWISE AI sovereign architecture, live camera feeds are processed exclusively in volatile RAM. 
                        Frames are translated into irreversible 128-dimensional floating-point embeddings and discarded within 300 milliseconds. 
                        No facial photograph is ever written to disk, flash memory, or secondary cloud storage.
                      </p>
                    </div>
                  </div>

                  <section className="space-y-2">
                    <h4 className="text-base font-bold text-white">1. Data Fiduciary &amp; Architectural Scope</h4>
                    <p>
                      GATEWISE Technologies Inc. provides sovereign biometric perimeter software to enterprise and academic institutions. 
                      In accordance with the India Digital Personal Data Protection (DPDP) Act 2023 and international privacy standards, 
                      the deploying organization operates as the Data Fiduciary, and GATEWISE AI serves strictly as the on-premises Data Processor.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-base font-bold text-white">2. Biometric Vectorization (SFace 128-D)</h4>
                    <p>
                      Enrollment templates consist exclusively of 128-dimensional cosine vector embeddings generated via the open SFace neural backbone. 
                      These mathematical vectors are mathematically irreversible; a face image cannot be reconstructed or reverse-engineered from 
                      a 128-D vector. All stored vector records are sealed at rest with AES-256-GCM hardware encryption.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-base font-bold text-white">3. Sovereign Human Guard Oversight</h4>
                    <p>
                      GATEWISE AI operates under human-in-the-loop mandate. AI inference serves as an ingress advisory assistant; final gate barrier 
                      actuation and campus access permissions remain strictly under the jurisdiction of authorized security personnel.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-base font-bold text-white">4. Data Subject Rights &amp; Erasure</h4>
                    <p>
                      Any enrolled faculty member, student, or campus visitor may request immediate review or complete revocation of their 
                      biometric enrollment. Upon receiving an erasure request through the institutional administrator portal, the corresponding 
                      cryptographic hash entry is purged instantaneously with verifiable zero-fill sanitization.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-base font-bold text-white">5. Data Protection Officer (DPO)</h4>
                    <p className="text-xs text-white/60 font-mono">
                      Inquiries: dpo@gatewiseai.internal • Escalation SLA: Under 24 Business Hours
                    </p>
                  </section>
                </>
              )}

              {activeModal === 'terms' && (
                <>
                  <section className="space-y-2">
                    <h4 className="text-base font-bold text-white">1. Institutional Software License</h4>
                    <p>
                      Use of GATEWISE AI software (including the Web Command Centre, macOS Menu Bar Suite, and Android Guard Terminal) 
                      is granted on a per-institution deployment basis. Deployment must align with institutional campus boundaries and 
                      authorized perimeter security gates.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-base font-bold text-white">2. Prohibited Uses &amp; Safety Mandate</h4>
                    <p>
                      GATEWISE AI shall not be deployed for unlawful surveillance, public square tracking, or discrimination. The software is 
                      engineered exclusively for authorized institutional entry validation, perimeter threat mitigation, and automated visitor pass management.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-base font-bold text-white">3. System Availability &amp; Offline Continuity SLA</h4>
                    <p>
                      Field Android terminals utilize encrypted local SQLite caches to maintain 100% verification continuity during campus-wide WAN or 
                      LAN outages. Gate logs synchronise automatically upon network restoration with cryptographic conflict resolution.
                    </p>
                  </section>
                </>
              )}

              {activeModal === 'security' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                      <div className="flex items-center gap-2 text-[#00d2ff]">
                        <Lock className="w-4 h-4" />
                        <span className="font-bold text-xs uppercase tracking-wider font-mono">Encryption at Rest</span>
                      </div>
                      <p className="text-xs text-white/70">
                        AES-256-GCM cipher with per-institution rotating keys, SQLCipher hardware acceleration, and PBKDF2 key derivation.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Server className="w-4 h-4" />
                        <span className="font-bold text-xs uppercase tracking-wider font-mono">In-Transit Protection</span>
                      </div>
                      <p className="text-xs text-white/70">
                        TLS 1.3 mutual authentication (mTLS) across all edge guard devices, gateway cameras, and the central command broker.
                      </p>
                    </div>
                  </div>

                  <section className="space-y-2">
                    <h4 className="text-base font-bold text-white">Cryptographic Tamper-Evident Audit Trail</h4>
                    <p>
                      Every verification attempt, guard override, and visitor entry is signed with SHA-256 HMAC and appended into an 
                      append-only cryptographic hash ledger. Any retroactive modification breaks the hash chain and raises instant high-priority 
                      security alarms across all active command desks.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-base font-bold text-white">Air-Gapped &amp; On-Premises Capability</h4>
                    <p>
                      GATEWISE AI operates completely independently of external cloud vendors. All AI inference (YuNet face detection + SFace feature 
                      extraction) executes directly on local edge hardware with zero external telemetry or cloud dependencies.
                    </p>
                  </section>
                </>
              )}

              {activeModal === 'compliance' && (
                <>
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white text-sm">DPDP Act 2023 (Digital Personal Data Protection)</span>
                        <p className="text-xs text-white/80 mt-1 leading-relaxed">
                          Complete technical compliance with Section 6 (Notice &amp; Consent), Section 8 (Data Fiduciary obligations), 
                          and Section 12 (Grievance Redressal Mechanism).
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                      <Shield className="w-5 h-5 text-[#00d2ff] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white text-sm">ISO/IEC 27001:2022 Information Security Management</span>
                        <p className="text-xs text-white/80 mt-1 leading-relaxed">
                          Adheres to Annex A controls for access control (A.9), cryptography (A.10), physical perimeter security (A.11), 
                          and incident management (A.16).
                        </p>
                      </div>
                    </div>
                  </div>

                  <section className="space-y-2 pt-2">
                    <h4 className="text-base font-bold text-white">Annual Third-Party Vulnerability Assessment</h4>
                    <p>
                      GATEWISE AI codebases undergo biannual independent black-box penetration testing and static application security testing (SAST). 
                      Certified reports are available to institutional enterprise compliance officers under non-disclosure agreement.
                    </p>
                  </section>
                </>
              )}

              {activeModal === 'cookies' && (
                <>
                  <section className="space-y-2">
                    <h4 className="text-base font-bold text-white">Cookie Classification &amp; Storage Architecture</h4>
                    <p>
                      GATEWISE AI adopts a zero-third-party tracking policy. We do not integrate advertising cookies, tracking pixels, or external 
                      social network beacons. Cookies are strictly categorized as follows:
                    </p>
                  </section>

                  <div className="space-y-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="font-bold text-xs text-white">1. Secure Authentication Tokens (`auth_token`, `csrf_token`)</span>
                      <p className="text-xs text-white/70 mt-1">
                        Purpose: Validates authorized guard and administrator sessions with HttpOnly, Secure, and SameSite=Strict flags.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="font-bold text-xs text-white">2. UI State (`gatewise_cookie_consent_v1`, `terminal_view_mode`)</span>
                      <p className="text-xs text-white/70 mt-1">
                        Purpose: Stores consent preferences, audio mute states, and command desk layout preferences locally on client device.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-white/10 bg-white/[0.02] flex items-center justify-between shrink-0">
              <span className="text-[11px] font-mono text-white/40">
                VERIFIED CRYPTOGRAPHIC COMPLIANCE • GATEWISE AI
              </span>
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-white/90 active:scale-95 transition-all cursor-pointer shadow-md"
              >
                Close Document
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
