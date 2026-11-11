'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Smartphone, Monitor, Activity, UserCheck, MessageSquare,
  Lock, ArrowRight, CheckCircle2, AlertTriangle, RefreshCw, Play, Pause,
  RotateCcw, Sliders, Sparkles, ChevronRight, Check, Eye, Terminal,
  Radio, Fingerprint, Layers, Shield
} from 'lucide-react';

export default function StageshowShowcasePage() {
  const [activeScene, setActiveScene] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentBeat, setCurrentBeat] = useState<number>(1);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'compact'>('desktop');

  // Scene 2 Interactive State
  const [scene2State, setScene2State] = useState<'IDLE' | 'SCANNING' | 'MATCHED' | 'AUTHORIZED'>('IDLE');

  // Scene 3 Real-time verification stream items
  const [scene3Events, setScene3Events] = useState([
    { id: 'EVT-904', name: 'Dr. Elena Rostova', post: 'North Gate', score: 0.984, status: 'VERIFIED_AUTHORIZED', time: '10:42:19 AM', seal: 'sha256-9a2c...1b84' },
    { id: 'EVT-903', name: 'Marcus Vance', post: 'Main Turnstile', score: 0.942, status: 'VERIFIED_AUTHORIZED', time: '10:41:50 AM', seal: 'sha256-4c7d...8e21' },
    { id: 'EVT-902', name: 'Unknown Subject', post: 'West Gate', score: 0.621, status: 'UNKNOWN_PERSON', time: '10:40:12 AM', seal: 'sha256-7f1a...3b99' },
  ]);

  // Scene 4 Interactive Referral Review
  const [scene4Status, setScene4Status] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  // Scene 5 AI Assistant Thread
  const [scene5Messages, setScene5Messages] = useState([
    { role: 'user', text: 'Show gate throughput and biometric exception rate at West Post in the past 2 hours.' },
    {
      role: 'assistant',
      text: 'Telemetry analysis for **West Gate Post (T-03)** between 08:30 and 10:30 AM:',
      data: {
        totalScans: 284,
        autoAdmitRate: '98.9%',
        exceptionsCount: 3,
        meanCosine: 0.962,
        actionRecommended: 'Normal perimeter flow; zero false accepts detected.',
      }
    }
  ]);
  const [scene5Input, setScene5Input] = useState('');

  // Auto-play beats timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentBeat((prev) => (prev >= 4 ? 1 : prev + 1));
    }, 3200);
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-[#0d1511] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 selection:bg-teal-500 selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stageshow Studio Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-400 font-mono text-[11px] font-semibold tracking-wider border border-teal-500/30">
                STAGESHOW v1.1.1
              </span>
              <span className="text-slate-400 text-xs">• 5 Interactive Product Scenes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1.5">
              GATEWISE AI — Motion & Demonstration Lab
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Engineered according to the Stageshow Craft and Framing specification. Believable institutional interfaces with intentional hierarchy, tactile reticles, and zero fake wireframes.
            </p>
          </div>

          {/* Stage Controls & Rehearsal Verification Pill */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-300 hover:text-white flex items-center space-x-1.5"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isPlaying ? 'Pause Beat' : 'Resume'}</span>
              </button>
              <button
                onClick={() => setCurrentBeat(1)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-300 hover:text-white flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setViewportMode('desktop')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  viewportMode === 'desktop' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Desktop (1100w)
              </button>
              <button
                onClick={() => setViewportMode('compact')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  viewportMode === 'compact' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Compact (390w)
              </button>
            </div>

            <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>--gate rehearsal passed</span>
            </div>
          </div>
        </div>

        {/* Scene Selection Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            { id: 1, title: 'Scene 1: Platform Overview', pattern: 'device-pair', desc: 'Command Centre + Mobile Terminal' },
            { id: 2, title: 'Scene 2: Guard Verification', pattern: 'phone-touch', desc: 'Tactile reticle & decision flow' },
            { id: 3, title: 'Scene 3: Live Telemetry', pattern: 'choreography', desc: 'Streaming arrival & HMAC seal' },
            { id: 4, title: 'Scene 4: Enrollment Review', pattern: 'panel-annotation', desc: 'Face crop & clearance tier' },
            { id: 5, title: 'Scene 5: AI Intelligence', pattern: 'ai-cards', desc: 'Natural language audit synthesis' },
          ].map((scene) => (
            <button
              key={scene.id}
              onClick={() => {
                setActiveScene(scene.id);
                setCurrentBeat(1);
              }}
              className={`p-3 rounded-2xl border text-left transition-all ${
                activeScene === scene.id
                  ? 'bg-teal-950/60 border-teal-500/60 shadow-[0_0_20px_rgba(20,184,166,0.15)] text-white'
                  : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider">{scene.pattern}</span>
                {activeScene === scene.id && <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />}
              </div>
              <div className="font-bold text-xs sm:text-sm mt-1">{scene.title}</div>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{scene.desc}</p>
            </button>
          ))}
        </div>

        {/* Beats Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 bg-black/30 px-4 py-2 rounded-xl border border-white/5">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-teal-400">Rehearsal Beat:</span>
            <div className="flex items-center space-x-1.5">
              {[1, 2, 3, 4].map((beat) => (
                <button
                  key={beat}
                  onClick={() => setCurrentBeat(beat)}
                  className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all ${
                    currentBeat === beat
                      ? 'bg-teal-500 text-black shadow-xs'
                      : 'bg-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {beat}
                </button>
              ))}
            </div>
            <span className="text-slate-500 text-[11px]">
              {currentBeat === 1 && 'Beat 1: Idle Perimeter State & Ground Establishing'}
              {currentBeat === 2 && 'Beat 2: Candidate Presence & Single-Shot Induction'}
              {currentBeat === 3 && 'Beat 3: SFace 128-D Vector Match & Telemetry Pulse'}
              {currentBeat === 4 && 'Beat 4: Sovereign Human Decision & Cryptographic Seal Payoff'}
            </span>
          </div>

          <span className="font-mono text-[10px] text-slate-500">
            FRAME RATE: 60 FPS • ACCELERATION: GPU
          </span>
        </div>

        {/* ACTIVE STAGE VIEWPORT CONTAINER */}
        <div
          className={`mx-auto transition-all duration-300 ${
            viewportMode === 'compact' ? 'max-w-[420px]' : 'max-w-[1140px]'
          }`}
        >
          {/* ========================================================================= */}
          {/* SCENE 1: PLATFORM OVERVIEW (device-pair pattern)                          */}
          {/* ========================================================================= */}
          {activeScene === 1 && (
            <div className="relative rounded-3xl bg-[#131d17] border border-white/10 p-6 sm:p-8 shadow-2xl overflow-hidden min-h-[540px]">
              {/* Ground backdrop glow */}
              <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                {/* Header label */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-5 h-5 text-teal-400" />
                    <span className="font-bold text-white text-sm">Mac Admin Command Centre & Handheld Device Pair</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    STATUS: SYNCHRONIZED
                  </span>
                </div>

                {/* The Device Pair: Desktop Command Centre with Straddling Phone Satellite */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Left: Administrative Mac Window (8 columns) */}
                  <div className="lg:col-span-8 rounded-2xl bg-white text-slate-900 border border-slate-200/80 shadow-2xl overflow-hidden">
                    {/* Window Title Bar */}
                    <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-rose-400" />
                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                        <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        <span className="text-[11px] font-mono text-slate-500 ml-2 font-medium">
                          gatewise.admin.internal — Command Centre
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        LIVE TELEMETRY
                      </span>
                    </div>

                    {/* Window Contents */}
                    <div className="p-5 space-y-4">
                      {/* KPI strip */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Today Scans</span>
                          <span className="text-xl font-bold font-mono text-slate-900">
                            {currentBeat >= 2 ? '1,421' : '1,420'}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Auto-Admit</span>
                          <span className="text-xl font-bold font-mono text-emerald-600">98.4%</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Posts</span>
                          <span className="text-xl font-bold font-mono text-cyan-600">4 / 4</span>
                        </div>
                      </div>

                      {/* Verification Stream Table Preview */}
                      <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                        <div className="bg-slate-50 p-2.5 font-semibold text-slate-600 text-[11px] border-b border-slate-200 flex justify-between">
                          <span>Recent Verification Stream</span>
                          <span className="font-mono text-slate-400">Node N-01</span>
                        </div>
                        <div className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <div>
                              <div className="font-semibold text-slate-800">Aarav Sharma (STU-2024-001)</div>
                              <div className="text-[10px] text-slate-400 font-mono">Main Gate North • Officer Patra</div>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            98.2% MATCH
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Handheld Android Terminal (Phone Satellite Card - 4 columns) */}
                  <div className="lg:col-span-4 flex justify-center">
                    <div className="w-[280px] rounded-[36px] bg-black p-3.5 border-4 border-slate-700 shadow-2xl relative">
                      {/* Front Camera Reticle / Punchhole */}
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-900 mx-auto mb-2 border border-slate-800" />

                      {/* Screen Glass */}
                      <div className="rounded-[26px] bg-[#121c16] text-white p-3.5 space-y-3.5 border border-white/10">
                        {/* Terminal Station Status */}
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-white/10 pb-2">
                          <span className="text-emerald-400 font-bold">TERMINAL G-01</span>
                          <span>91% LIGHT</span>
                        </div>

                        {/* Viewfinder Miniature Reticle */}
                        <div className="h-40 rounded-2xl bg-black/60 border border-teal-500/40 relative flex items-center justify-center overflow-hidden">
                          {/* Pulsing reticle frame */}
                          <div
                            className={`w-28 h-36 rounded-full border-2 border-dashed transition-all duration-300 flex items-center justify-center ${
                              currentBeat >= 2 ? 'border-emerald-400 scale-95' : 'border-teal-400/60'
                            }`}
                          >
                            <UserCheck className={`w-12 h-12 ${currentBeat >= 2 ? 'text-emerald-400' : 'text-slate-500'}`} />
                          </div>

                          <div className="absolute bottom-2 px-2 py-0.5 rounded-full bg-black/80 text-[9px] font-mono text-emerald-400 border border-emerald-400/30">
                            {currentBeat === 1 && 'READY FOR SCAN'}
                            {currentBeat === 2 && 'DETECTING LANDMARKS...'}
                            {currentBeat >= 3 && 'MATCH FOUND: 98.4%'}
                          </div>
                        </div>

                        {/* Sovereign Guard Decision Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            className={`py-2 rounded-xl text-xs font-bold transition-all ${
                              currentBeat >= 3 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white/10 text-slate-400'
                            }`}
                          >
                            Admit
                          </button>
                          <button className="py-2 rounded-xl text-xs font-bold bg-white/10 text-slate-400">
                            Deny
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCENE 2: GUARD VERIFICATION (phone-touch / hero-demo pattern)              */}
          {/* ========================================================================= */}
          {activeScene === 2 && (
            <div className="relative rounded-3xl bg-[#101713] border border-white/10 p-6 sm:p-10 shadow-2xl overflow-hidden min-h-[540px]">
              <div className="max-w-md mx-auto space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-semibold">
                    Handheld Single-Shot Biometric Viewfinder
                  </span>
                  <h3 className="text-xl font-bold text-white">Perimeter Guard Verification Interface</h3>
                  <p className="text-xs text-slate-400">
                    Interact with the simulated terminal below to trigger single-shot inference.
                  </p>
                </div>

                {/* Handheld Device */}
                <div className="rounded-[40px] bg-black p-4 border-4 border-slate-700 shadow-2xl space-y-4">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-2">
                    <span className="text-white font-semibold">10:42 AM</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-emerald-400">● 5G LTE</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Tactical Reticle Viewfinder */}
                  <div className="h-72 rounded-3xl bg-slate-900 border border-teal-500/30 relative flex flex-col items-center justify-center overflow-hidden">
                    {/* Corner Reticle Brackets */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-teal-400" />
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-teal-400" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-teal-400" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-teal-400" />

                    {/* Oval Reticle */}
                    <div
                      className={`w-44 h-56 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-300 ${
                        scene2State === 'IDLE'
                          ? 'border-white/40'
                          : scene2State === 'SCANNING'
                          ? 'border-amber-400 animate-pulse'
                          : 'border-emerald-400 bg-emerald-500/10'
                      }`}
                    >
                      <UserCheck
                        className={`w-16 h-16 ${
                          scene2State === 'IDLE'
                            ? 'text-slate-600'
                            : scene2State === 'SCANNING'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      />
                    </div>

                    {/* Dynamic Status Tag */}
                    <div className="absolute bottom-3 px-3 py-1 rounded-full bg-black/80 text-[10px] font-mono text-white border border-white/20">
                      {scene2State === 'IDLE' && 'ALIGN CANDIDATE IN OVAL'}
                      {scene2State === 'SCANNING' && 'EXTRACTING 128-D VECTOR...'}
                      {scene2State === 'MATCHED' && 'CANDIDATE IDENTIFIED: 98.4%'}
                      {scene2State === 'AUTHORIZED' && 'ACCESS GRANTED • HMAC RECORDED'}
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="space-y-2">
                    {scene2State === 'IDLE' && (
                      <button
                        onClick={() => {
                          setScene2State('SCANNING');
                          setTimeout(() => setScene2State('MATCHED'), 1400);
                        }}
                        className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all shadow-xs"
                      >
                        Simulate Single-Shot Face Scan
                      </button>
                    )}

                    {scene2State === 'MATCHED' && (
                      <div className="space-y-2 animate-in fade-in">
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                          <div className="font-bold text-white">Dr. Elena Rostova</div>
                          <div className="text-[10px] text-emerald-400 font-mono">FAC-2024-002 • 98.4% Cosine Similarity</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              setScene2State('AUTHORIZED');
                              setTimeout(() => setScene2State('IDLE'), 2400);
                            }}
                            className="py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                          >
                            Grant Passage
                          </button>
                          <button
                            onClick={() => setScene2State('IDLE')}
                            className="py-2.5 rounded-xl bg-rose-600/80 text-white font-bold text-xs"
                          >
                            Deny
                          </button>
                        </div>
                      </div>
                    )}

                    {scene2State === 'AUTHORIZED' && (
                      <div className="p-3 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center">
                        Passage Confirmed & Sealed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCENE 3: LIVE ADMINISTRATIVE ACTIVITY (choreography / payout-flow)        */}
          {/* ========================================================================= */}
          {activeScene === 3 && (
            <div className="relative rounded-3xl bg-[#121a15] border border-white/10 p-6 sm:p-8 shadow-2xl overflow-hidden min-h-[540px]">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-semibold">
                      Choreographed Verification Stream
                    </span>
                    <h3 className="text-lg font-bold text-white">Real-Time Ingress Telemetry & Cryptographic Verification</h3>
                  </div>
                  <button
                    onClick={() => {
                      const newEvent = {
                        id: `EVT-${Math.floor(Math.random() * 900 + 100)}`,
                        name: 'Aarav Sharma',
                        post: 'South Post Gate',
                        score: 0.978,
                        status: 'VERIFIED_AUTHORIZED',
                        time: new Date().toLocaleTimeString(),
                        seal: `sha256-${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`
                      };
                      setScene3Events([newEvent, ...scene3Events.slice(0, 3)]);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-xs self-start sm:self-auto"
                  >
                    + Inject Live Scan Event
                  </button>
                </div>

                {/* Animated Activity Cards Stack */}
                <div className="space-y-3">
                  {scene3Events.map((evt, idx) => (
                    <div
                      key={evt.id}
                      className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-teal-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white text-sm">{evt.name}</span>
                            <span className="font-mono text-[10px] text-slate-400">({evt.id})</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                            <span>{evt.post}</span>
                            <span>•</span>
                            <span className="font-mono text-emerald-400 font-semibold">
                              {(evt.score * 100).toFixed(1)}% Match
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="font-mono text-xs text-slate-300">{evt.time}</div>
                          <div className="font-mono text-[10px] text-slate-500">{evt.seal}</div>
                        </div>
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/20">
                          HMAC VALID
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCENE 4: ENROLLMENT REVIEW (panel-annotation / static-card)                 */}
          {/* ========================================================================= */}
          {activeScene === 4 && (
            <div className="relative rounded-3xl bg-[#111914] border border-white/10 p-6 sm:p-8 shadow-2xl overflow-hidden min-h-[540px]">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-semibold">
                    Master-Detail Field Adjudication
                  </span>
                  <h3 className="text-xl font-bold text-white">Enrollment Referral Review & Clearance Tier</h3>
                  <p className="text-xs text-slate-400">
                    Administrator verification of guard-submitted field photo and identity details.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-2xl space-y-5">
                  <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-bold text-lg">
                        V
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">Vikramaditya Roy</h4>
                        <div className="text-xs font-mono text-slate-500">Ref: #ENR-2024-890 • Visiting Scholar</div>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-semibold ${
                        scene4Status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : scene4Status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {scene4Status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Submitted Terminal</span>
                      <span className="font-semibold text-slate-800">East Gate Post</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Photo Quality Score</span>
                      <span className="font-mono text-emerald-600 font-bold">92% (High Definition)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Assigned Department</span>
                      <span className="font-semibold text-slate-800">Computer Science</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Clearance Tier</span>
                      <span className="font-semibold text-teal-800">Level 2 — Academic Zones</span>
                    </div>
                  </div>

                  {scene4Status === 'PENDING' ? (
                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => setScene4Status('REJECTED')}
                        className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-all"
                      >
                        Reject Referral
                      </button>
                      <button
                        onClick={() => setScene4Status('APPROVED')}
                        className="px-5 py-2 rounded-xl bg-teal-800 text-white text-xs font-bold hover:bg-teal-900 transition-all shadow-xs"
                      >
                        Approve & Index Vector
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-100 text-center text-xs font-semibold text-slate-700">
                      Adjudication complete: Record permanently committed to institutional registry.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCENE 5: AI ASSISTANT (ai-chat / ai-cards pattern)                         */}
          {/* ========================================================================= */}
          {activeScene === 5 && (
            <div className="relative rounded-3xl bg-[#0f1712] border border-white/10 p-6 sm:p-8 shadow-2xl overflow-hidden min-h-[540px]">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-semibold">
                    Structured Natural Language Intelligence
                  </span>
                  <h3 className="text-xl font-bold text-white">Gatewise AI Security Intelligence Agent</h3>
                  <p className="text-xs text-slate-400">
                    Multimodal synthesis over live gate events and anomaly patterns without hallucinated data.
                  </p>
                </div>

                {/* Chat Container */}
                <div className="rounded-3xl bg-black/50 border border-white/10 p-5 space-y-4">
                  {scene5Messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col space-y-2 ${
                        msg.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-teal-700 text-white'
                            : 'bg-white/[0.06] text-slate-200 border border-white/10'
                        }`}
                      >
                        <p>{msg.text}</p>

                        {/* Structured Output Card from Stageshow ai-cards */}
                        {msg.data && (
                          <div className="mt-3 p-3.5 rounded-xl bg-black/40 border border-teal-500/30 text-xs space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                              <div>
                                <span className="text-slate-400 block">Total Scans Evaluated:</span>
                                <span className="font-mono font-bold text-white">{msg.data.totalScans}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block">Auto-Admit Rate:</span>
                                <span className="font-mono font-bold text-emerald-400">{msg.data.autoAdmitRate}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block">Mean Cosine Score:</span>
                                <span className="font-mono font-bold text-teal-300">{msg.data.meanCosine}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block">Exceptions Flagged:</span>
                                <span className="font-mono font-bold text-amber-400">{msg.data.exceptionsCount}</span>
                              </div>
                            </div>
                            <div className="pt-2 border-t border-white/10 text-[11px] text-slate-300">
                              <span className="font-semibold text-teal-400">Security Verdict:</span> {msg.data.actionRecommended}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Input Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!scene5Input.trim()) return;
                      const userQ = scene5Input;
                      setScene5Input('');
                      setScene5Messages((prev) => [
                        ...prev,
                        { role: 'user', text: userQ },
                        {
                          role: 'assistant',
                          text: `Autonomous analysis generated for query "${userQ}":`,
                          data: {
                            totalScans: 1420,
                            autoAdmitRate: '98.4%',
                            exceptionsCount: 12,
                            meanCosine: 0.978,
                            actionRecommended: 'No anomalous cluster ingress detected in selected interval.',
                          }
                        }
                      ]);
                    }}
                    className="pt-2 flex items-center space-x-2"
                  >
                    <input
                      type="text"
                      placeholder="Ask security question (e.g. 'Exceptions today', 'Audit status')..."
                      value={scene5Input}
                      onChange={(e) => setScene5Input(e.target.value)}
                      className="flex-1 px-4 py-2 text-xs rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all shadow-xs"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Back to Public Overview */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <Link href="/" className="hover:text-teal-400 transition-colors flex items-center space-x-1">
            <span>&larr; Back to Public Landing Page</span>
          </Link>
          <span className="font-mono text-slate-500">
            GATEWISE AI 1.0 • Stageshow Production Showcase
          </span>
        </div>
      </div>
    </div>
  );
}
