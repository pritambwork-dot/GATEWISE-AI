'use client';

import React from 'react';
import Link from 'next/link';
import {
  Eye, Users, DoorClosed, ShieldCheck, Activity, Cpu,
  Database, Lock, CheckCircle2, Clock, Smartphone, Monitor
} from 'lucide-react';

export default function FeaturesPage() {
  const featureCategories = [
    {
      title: 'Computer Vision & Verification Pipeline',
      desc: 'On-device and edge-assisted deep learning vision models tailored for outdoor gate conditions.',
      icon: Eye,
      items: [
        { name: 'YuNet 5-Point Landmark Detection', desc: 'Real-time face detection capable of finding subjects under varying tilt, yaw, and outdoor lighting.' },
        { name: 'SFace 128-D Vector Embeddings', desc: 'Generates non-invertible mathematical representations with cosine similarity distance computation.' },
        { name: 'Automated Image Quality Filtering', desc: 'Rejects blurry, over-exposed, or distant faces under 60px before running verification to prevent false alarms.' },
        { name: 'Decoupled Evaluation Engine', desc: 'Independent verification scores for candidate identity match versus institutional clearance authorization.' },
      ]
    },
    {
      title: 'Identity Repository & Google Drive Synchronization',
      desc: 'Zero-effort identity management synchronized directly from existing institutional photo repositories.',
      icon: Database,
      items: [
        { name: 'Google Drive Scoped Ingestion', desc: 'Monitors designated Drive folders for standardized student and staff photo uploads.' },
        { name: 'Deterministic Filename Parser', desc: 'Maps files like STU-001_Alex_Rivera.jpg automatically into the central PostgreSQL/SQLite database.' },
        { name: 'Unmapped File Resolution', desc: 'Flags improperly named or duplicate reference images for quick administrator correction.' },
        { name: 'Zero Cloud Biometric Storage', desc: 'Embeddings are calculated and stored locally; raw biometric images never leak to third-party clouds.' },
      ]
    },
    {
      title: 'Perimeter Checkpoint & Guard Station Control',
      desc: 'Empowering security officers with clear visual feedback while enforcing strict accountability.',
      icon: ShieldCheck,
      items: [
        { name: 'Human Sovereign Oversight', desc: 'Verification algorithms provide advisory confidence; human guards make all final entry decisions.' },
        { name: 'HMAC-SHA256 Cryptographic Non-Repudiation', desc: 'Every Grant or Deny action is digitally sealed with the officer’s session key.' },
        { name: 'Offline Transient Queue', desc: 'Guards continue verifying passes even during intermittent network dropouts.' },
        { name: 'Field Enrollment Referrals', desc: 'Guards can refer unmapped guests or new staff directly to the central administrator queue.' },
      ]
    },
    {
      title: 'Campus Visitor & Contractor Management',
      desc: 'Fast, dignified guest check-in without paper logbooks or perimeter bottleneck congestion.',
      icon: DoorClosed,
      items: [
        { name: 'Pre-Approved Digital Passes', desc: 'Department hosts can issue authorized passes with validity timeframes prior to guest arrival.' },
        { name: 'Fast QR Check-In / Check-Out', desc: 'Officers scan visitor pass codes instantly at the gate to register entry and departure.' },
        { name: 'Real-Time Campus Guest Census', desc: 'Command Centre displays the exact number of active external visitors currently on campus grounds.' },
        { name: 'Automated Pass Expiry', desc: 'Passes automatically expire past their designated operating window to prevent unauthorized re-entry.' },
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-2xl space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gatewise-primary bg-gatewise-light px-3 py-1 rounded-full border border-gatewise-mint">
          Technical Capabilities
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gatewise-text tracking-tight">
          Enterprise Security Features
        </h1>
        <p className="text-sm text-gatewise-secondary leading-relaxed">
          Comprehensive feature specifications for institutional campus perimeters, research facilities, and educational institutions.
        </p>
      </div>

      {/* Feature Categories */}
      <div className="space-y-12">
        {featureCategories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div key={idx} className="p-8 sm:p-10 rounded-3xl bg-white border border-gatewise-border shadow-xs space-y-6">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gatewise-light text-gatewise-primary flex items-center justify-center font-bold border border-gatewise-mint">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gatewise-text">{cat.title}</h2>
                  <p className="text-xs text-gatewise-secondary mt-0.5">{cat.desc}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {cat.items.map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-background-secondary/60 border border-gatewise-border space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-gatewise-primary shrink-0" />
                      <h3 className="font-bold text-xs text-gatewise-text">{item.name}</h3>
                    </div>
                    <p className="text-xs text-gatewise-secondary leading-relaxed pl-6">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
