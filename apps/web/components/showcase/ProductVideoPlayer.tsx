'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Maximize2,
  FileText, Download, ShieldCheck, Film, ChevronDown, ChevronUp
} from 'lucide-react';

export default function ProductVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(28.84);
  const [showTranscript, setShowTranscript] = useState(false);

  const posterSrc = '/media/posters/gatewise-teaser.webp';
  const mp4Src = '/media/videos/gatewise-teaser-template.mp4';
  const webmSrc = '/media/videos/gatewise-teaser-template.webm';

  // Lock playbackRate strictly to 2.0 (2x speed)
  const apply2xSpeed = () => {
    if (videoRef.current) {
      if (videoRef.current.playbackRate !== 2.0) {
        videoRef.current.playbackRate = 2.0;
      }
    }
  };

  useEffect(() => {
    apply2xSpeed();
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 2.0;
      setDuration(videoRef.current.duration || 28.84);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = 2.0;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => {
          apply2xSpeed();
          setIsPlaying(true);
        })
        .catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = nextTime;
      setCurrentTime(nextTime);
      apply2xSpeed();
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section id="product-video" className="py-16 md:py-24 bg-gatewise-light/30 border-y border-gatewise-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gatewise-light/80 text-gatewise-deep border border-gatewise-mint/60 text-xs font-semibold">
            <Film className="w-3.5 h-3.5 text-gatewise-primary" />
            <span>Product Motion Showcase · 2x Speed</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gatewise-text tracking-tight">
            Watch GATEWISE AI in Action
          </h2>
          <p className="text-sm sm:text-base text-gatewise-secondary leading-relaxed">
            High-octane 60fps kinetic motion showcase demonstrating on-device guard verification, edge YuNet landmark detection, and campus command centre telemetry.
          </p>
        </div>

        {/* Video Player Container Card */}
        <div className="relative max-w-4xl mx-auto">
          <div
            ref={containerRef}
            className="relative rounded-3xl overflow-hidden bg-slate-950 border border-black/[0.12] shadow-2xl group"
          >
            {/* The Video Element */}
            <video
              ref={videoRef}
              poster={posterSrc}
              playsInline
              preload="metadata"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onLoadedData={apply2xSpeed}
              onPlay={apply2xSpeed}
              onRateChange={apply2xSpeed}
              onClick={togglePlay}
              className="w-full aspect-video object-cover cursor-pointer bg-slate-950 block"
            >
              <source src={mp4Src} type="video/mp4" />
              <source src={webmSrc} type="video/webm" />
              Your browser does not support the video tag.
            </video>

            {/* Big Center Play Button when paused */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[2px] transition-all cursor-pointer group-hover:bg-black/45"
              >
                <div className="w-20 h-20 rounded-full bg-gatewise-primary/95 text-white flex items-center justify-center shadow-2xl transform group-hover:scale-105 active:scale-95 transition-all">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
              </div>
            )}

            {/* Custom Bottom Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent pt-8 pb-3 px-4 sm:px-6 transition-opacity duration-300">
              
              {/* Timeline Scrubber */}
              <div className="relative flex items-center mb-2.5">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.05"
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Video timeline scrubber"
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-gatewise-mint hover:h-2 transition-all"
                />
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between text-white text-xs">
                
                {/* Left Controls: Play/Pause, Volume, Time */}
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 hover:text-gatewise-mint transition-colors cursor-pointer"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-1.5 hover:text-gatewise-mint transition-colors cursor-pointer"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
                  </button>

                  <span className="font-mono text-[11px] text-slate-300">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Right Controls: Fullscreen */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 hover:text-gatewise-mint transition-colors cursor-pointer"
                    aria-label="Toggle Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Transcript View & Download Bar */}
          <div className="mt-6 border border-gatewise-border rounded-2xl bg-white p-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-gatewise-primary shrink-0" />
                <span className="text-xs font-semibold text-gatewise-text">
                  Synchronised Narrative Transcript &amp; Video Specification
                </span>
              </div>
              <div className="flex items-center space-x-2 self-start sm:self-auto">
                <a
                  href="/media/videos/transcript.txt"
                  download="gatewise-showcase-transcript.txt"
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium text-gatewise-deep hover:bg-gatewise-light/60 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </a>
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-gatewise-light/50 text-gatewise-text text-xs font-medium hover:bg-gatewise-light transition-colors cursor-pointer"
                >
                  <span>{showTranscript ? 'Hide Details' : 'View Details'}</span>
                  {showTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Expandable Transcript Content */}
            {showTranscript && (
              <div className="mt-4 pt-4 border-t border-gatewise-border text-xs text-gatewise-secondary font-mono leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap bg-gatewise-light/20 p-3 rounded-xl">
{`GATEWISE AI — MOTION SHOWCASE SPECIFICATION & TRANSCRIPT
Duration: 28.84s • 60 FPS • High-Octane 2x Playback

00:00 - Kinetic Introduction
"EDGE BIOMETRIC INTELLIGENCE"
Bold centered typography: "GATEWISE" with "Sub-300ms" and "Sovereign" flanking.
Bottom horizon neon arc with status indicator: "AI system for end-to-end workflow automation and optimization".

00:02 - Live Ingress Queue & Vector Processing
Active Gate Telemetry at Gate-Main-02.
Dr. Maya Sharma (Cosine 0.984 [ACCESS GRANTED]), Officer Ramesh Verma (Active Duty Session Bound), Marcus Vance (Student Affairs), Visitor Pass #9042, Vehicle OD 02 AK 9142.
Dynamic action button: "Explore Gate Operations ->".

00:07 - Sovereign Perimeter Architecture Stack
Cascading isometric deck of modular architecture layers:
- Data Sync & WebSocket Feed
- Autonomous ANPR & Barrier Relay
- HMAC-SHA256 Non-Repudiation Vault
- SFace 128-D Vector Embeddings
- YuNet 28ms Face Landmark Detector
- Offline SQLite Continuity Engine

00:13 - Unified Platform Integration
"Connect every gate, guard & turnstile in one unified platform"
Orbiting architecture badges: 28ms YuNet, SFace 128-D, HMAC-256, Android Guard APK, Admin Command Desk.

00:15 - Institutional Metric Verification
Center glowing sphere: "<300ms End-to-End Verification SLA"
Key telemetry metrics:
- 128-D Zero Raw Photos Stored
- 98.4% Mean Cosine Match
- 100% On-Premise Deploy
- Audit DPDP Act Compliant
- 24/7 Offline Continuity

00:21 - Distributed Perimeter Network
"Full Perimeter Governance. Zero Cloud Leaks."
Orbiting checkpoint nodes: Gate-01, Gate-02, Admin Desk, Vehicle Barrier, Pedestrian Totem, SQLite Vault.

00:25 - Sovereign Operations Deployment
"Deploy sovereign, sub-second campus intelligence"
Portal link: www.gatewise.ai

00:27 - Brand Verification Lockup
Emerald Shield Checkmark brand identity with star flare.
"GATEWISE AI 1.0 — Institutional Access Architecture • Verified for IIM Sambalpur Campus"`}
              </div>
            )}

            {/* Privacy & Synthetic Disclosure Notice */}
            <div className="mt-3 pt-3 border-t border-gatewise-border/50 flex items-start space-x-2 text-[11px] text-gatewise-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-gatewise-primary flex-shrink-0 mt-0.5" />
              <span>
                <strong>Synthetic Privacy Guarantee:</strong> All demonstration video sequences, personnel names, biometric vectors, and gate coordinates were produced in an isolated staging sandbox. No genuine student or personnel PII is stored or presented.
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
