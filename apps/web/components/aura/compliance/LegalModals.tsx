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
            className="relative w-full max-w-4xl max-h-[88vh] border border-[#0A0E1A] bg-white shadow-[8px_8px_0px_#2F5BFF] flex flex-col overflow-hidden z-10 text-[#0A0E1A]"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#DCE1EC] flex items-center justify-between shrink-0 bg-[#FAF9F6]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#EEF2FF] border border-[#2F5BFF]/30 flex items-center justify-center text-[#2F5BFF]">
                  {activeModal === 'privacy' && <Shield className="w-5 h-5" />}
                  {activeModal === 'terms' && <Scale className="w-5 h-5" />}
                  {activeModal === 'security' && <Lock className="w-5 h-5" />}
                  {activeModal === 'compliance' && <FileText className="w-5 h-5" />}
                  {activeModal === 'cookies' && <Cookie className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0A0E1A] tracking-tight">
                    {activeModal === 'privacy' && 'Zero-Image Privacy Policy'}
                    {activeModal === 'terms' && 'Institutional Terms of Service'}
                    {activeModal === 'security' && 'Security Whitepaper & Architecture'}
                    {activeModal === 'compliance' && 'ISO/IEC 27001 & DPDP Act 2023 Compliance'}
                    {activeModal === 'cookies' && 'Institutional Cookie Governance'}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-[#475569] font-mono">
                    <span>SOVEREIGN PERIMETER STANDARD v2.4</span>
                    <span>•</span>
                    <span className="text-[#15803D] font-bold">ACTIVE &amp; ENFORCED</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 bg-white hover:bg-[#F2F4F8] border border-[#DCE1EC] text-[#475569] hover:text-[#0A0E1A] transition-all flex items-center justify-center cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-[#475569] leading-relaxed font-sans">
              {activeModal === 'privacy' && (
                <>
                  <div className="p-4 bg-[#EEF2FF] border border-[#2F5BFF]/25 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2F5BFF] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold text-[#0A0E1A] text-sm">Core Guarantee: Zero Persistent Public Exposure</span>
                      <p className="text-xs text-[#475569] leading-relaxed">
                        Under GATEWISE AI sovereign architecture, live camera feeds are analyzed and converted into 128-dimensional cosine vector embeddings with private signed storage access controlled strictly by Administrator RBAC.
                      </p>
                    </div>
                  </div>

                  <section className="space-y-2">
                    <h4 className="text-base font-bold text-[#0A0E1A]">1. Data Fiduciary &amp; Architectural Scope</h4>
                    <p>
                      GATEWISE Technologies Inc. provides sovereign biometric perimeter software to enterprise and academic institutions. 
                      In accordance with the India Digital Personal Data Protection (DPDP) Act 2023 and international privacy standards, 
                      the deploying organization operates as the Data Fiduciary, and GATEWISE AI serves strictly as the Data Processor.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-base font-bold text-[#0A0E1A]">2. Biometric Vectorization (SFace 128-D)</h4>
                    <p>
                      Enrollment templates consist of 128-dimensional cosine vector embeddings paired with private authenticated bucket paths. Stored records are protected via row-level security and HTTPS TLS encryption.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-base font-bold text-[#0A0E1A]">3. Sovereign Human Guard Oversight</h4>
                    <p>
                      GATEWISE AI operates under human-in-the-loop mandate. AI inference serves as an ingress advisory assistant; final gate barrier 
                      actuation and campus access permissions remain strictly under the jurisdiction of authorized security personnel.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-base font-bold text-[#0A0E1A]">4. Data Subject Rights &amp; Erasure</h4>
                    <p>
                      Any enrolled faculty member, student, or campus visitor may request immediate review or complete revocation of their 
                      biometric enrollment through the institutional administrator portal.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-base font-bold text-[#0A0E1A]">5. Data Protection Officer (DPO)</h4>
                    <p className="text-xs text-[#475569] font-mono">
                      Inquiries: dpo@gatewiseai.internal • Escalation SLA: Under 24 Business Hours
                    </p>
                  </section>
                </>
              )}

              {activeModal === 'terms' && (
                <>
                  <section className="space-y-2">
                    <h4 className="text-base font-bold text-[#0A0E1A]">1. Institutional Software License</h4>
                    <p>
                      Use of GATEWISE AI software (including the Web Command Centre and Smartphone Guard Web Terminal) 
                      is granted on a per-institution deployment basis aligned with campus perimeter gates.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-base font-bold text-[#0A0E1A]">2. Prohibited Uses &amp; Safety Mandate</h4>
                    <p>
                      GATEWISE AI shall not be deployed for unlawful surveillance, public square tracking, or discrimination. The software is 
                      engineered exclusively for authorized institutional entry validation and visitor management.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-base font-bold text-[#0A0E1A]">3. System Availability &amp; Realtime Auditability</h4>
                    <p>
                      Verification results and entry/exit logs synchronize across the centralized PostgreSQL cluster with cryptographic HMAC-SHA256 signatures.
                    </p>
                  </section>
                </>
              )}

              {activeModal === 'security' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                    <div className="p-4 bg-[#FAF9F6] border border-[#DCE1EC] space-y-1.5">
                      <div className="flex items-center gap-2 text-[#2F5BFF]">
                        <Lock className="w-4 h-4" />
                        <span className="font-bold text-xs uppercase tracking-wider font-mono">Encryption at Rest</span>
                      </div>
                      <p className="text-xs text-[#475569]">
                        AES-256 storage encryption with private signed URLs and row-level database access policies.
                      </p>
                    </div>

                    <div className="p-4 bg-[#FAF9F6] border border-[#DCE1EC] space-y-1.5">
                      <div className="flex items-center gap-2 text-[#15803D]">
                        <Server className="w-4 h-4" />
                        <span className="font-bold text-xs uppercase tracking-wider font-mono">In-Transit Protection</span>
                      </div>
                      <p className="text-xs text-[#475569]">
                        TLS 1.3 encryption and HMAC-SHA256 bearer tokens across all guard terminals and admin command desks.
                      </p>
                    </div>
                  </div>

                  <section className="space-y-2">
                    <h4 className="text-base font-bold text-[#0A0E1A]">Cryptographic Tamper-Evident Audit Trail</h4>
                    <p>
                      Every verification attempt, guard override, and visitor entry is signed with SHA-256 HMAC and appended into an 
                      audit ledger visible to institutional administrators.
                    </p>
                  </section>
                </>
              )}

              {activeModal === 'compliance' && (
                <>
                  <div className="space-y-3">
                    <div className="p-4 bg-[#15803D]/10 border border-[#15803D]/25 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#0A0E1A] text-sm">DPDP Act 2023 (Digital Personal Data Protection)</span>
                        <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                          Technical alignment with notice, consent, data fiduciary governance, and grievance redressal obligations.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-[#FAF9F6] border border-[#DCE1EC] flex items-start gap-3">
                      <Shield className="w-5 h-5 text-[#2F5BFF] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#0A0E1A] text-sm">ISO/IEC 27001:2022 Information Security Alignment</span>
                        <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                          Follows Annex A controls for RBAC access governance, cryptography, physical perimeter security, and audit logging.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeModal === 'cookies' && (
                <>
                  <section className="space-y-2">
                    <h4 className="text-base font-bold text-[#0A0E1A]">Cookie Classification &amp; Storage Architecture</h4>
                    <p>
                      GATEWISE AI adopts a zero-third-party tracking policy. Cookies and tokens are strictly categorized as follows:
                    </p>
                  </section>

                  <div className="space-y-3 pt-2">
                    <div className="p-3.5 bg-[#FAF9F6] border border-[#DCE1EC]">
                      <span className="font-bold text-xs text-[#0A0E1A]">1. Secure Authentication Tokens</span>
                      <p className="text-xs text-[#475569] mt-1">
                        Validates authorized guard and administrator sessions against backend database status checks.
                      </p>
                    </div>

                    <div className="p-3.5 bg-[#FAF9F6] border border-[#DCE1EC]">
                      <span className="font-bold text-xs text-[#0A0E1A]">2. UI State Preferences</span>
                      <p className="text-xs text-[#475569] mt-1">
                        Stores operator language preferences (English / हिंदी) and cookie consent status locally.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-[#DCE1EC] bg-[#FAF9F6] flex items-center justify-between shrink-0">
              <span className="text-[11px] font-mono text-[#475569]">
                VERIFIED CRYPTOGRAPHIC COMPLIANCE • GATEWISE AI
              </span>
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 bg-[#2F5BFF] text-white font-mono uppercase tracking-[0.08em] font-bold text-xs hover:bg-[#1E44E0] transition-all cursor-pointer"
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
