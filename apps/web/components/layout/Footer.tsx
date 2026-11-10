import React from 'react';
import { ShieldCheck, Lock, ExternalLink, HardDrive } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gatewise-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-gatewise-primary flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-gatewise-text">GATEWISE<span className="text-gatewise-primary">AI</span></span>
            </div>
            <p className="text-xs text-gatewise-secondary leading-relaxed">
              Institutional Gate Verification & Visitor Identification System engineered for educational institutions, research institutes, and secure enterprise campuses.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-gatewise-secondary">
              <span className="inline-block w-2 h-2 rounded-full bg-gatewise-success animate-pulse"></span>
              <span>Central Node: IIM Sambalpur Campus</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gatewise-text mb-3">Institutional Modules</h4>
            <ul className="space-y-2 text-xs text-gatewise-secondary">
              <li className="hover:text-gatewise-primary cursor-pointer">Android Guard Mobile Terminal</li>
              <li className="hover:text-gatewise-primary cursor-pointer">Central Command Centre</li>
              <li className="hover:text-gatewise-primary cursor-pointer">Google Drive Directory Sync</li>
              <li className="hover:text-gatewise-primary cursor-pointer">Walk-in Visitor Pass Issuance</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gatewise-text mb-3">Privacy & Compliance</h4>
            <ul className="space-y-2 text-xs text-gatewise-secondary">
              <li className="flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-gatewise-primary" />
                <span>Zero Continuous Video Surveillance</span>
              </li>
              <li className="flex items-center space-x-1">
                <HardDrive className="w-3.5 h-3.5 text-gatewise-primary" />
                <span>Zero Raw Live Photo Retention</span>
              </li>
              <li>SHA-256 Cryptographic Audit Logs</li>
              <li>Human-in-the-Loop Sovereign Control</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gatewise-text mb-3">Release & Governance</h4>
            <p className="text-xs text-gatewise-secondary mb-2">
              Official Production Release 1.0.0. Signed APK cryptographic hash:
            </p>
            <div className="p-2 rounded bg-background-secondary border border-gatewise-border text-[10px] font-mono text-gatewise-secondary break-all">
              sha256: 8a4f91e32d0c1589b4f2c00a4e76d542ef891024bc681b
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gatewise-border flex flex-col sm:flex-row items-center justify-between text-xs text-gatewise-muted">
          <p>© 2026 GATEWISE AI · Indian Institute of Management Sambalpur. All institutional rights reserved.</p>
          <p className="mt-2 sm:mt-0">High-Fidelity Engineering · Google Stitch Approved Specification</p>
        </div>
      </div>
    </footer>
  );
};
