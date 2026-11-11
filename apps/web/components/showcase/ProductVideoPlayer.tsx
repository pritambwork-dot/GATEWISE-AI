'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw,
  FileText, Download, Check, ShieldCheck, Clock, Subtitles,
  ExternalLink, ChevronDown, ChevronUp
} from 'lucide-react';

interface StoryboardChapter {
  time: number;
  label: string;
  tag: string;
}

const CHAPTERS: StoryboardChapter[] = [
  { time: 0, label: 'Perimeter Bottlenecks', tag: '00:00 Intro' },
  { time: 12, label: 'Guard Mobile Verification', tag: '00:12 Guard HUD' },
  { time: 28, label: 'Admin Command Telemetry', tag: '00:28 Command Centre' },
  { time: 44, label: 'Cryptographic Audit Trail', tag: '00:44 HMAC Non-Repudiation' },
  { time: 58, label: 'Deployment Readiness', tag: '00:58 Conclusion' },
];

export default function ProductVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(65);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [transcriptContent, setTranscriptContent] = useState<string>('');

  // Fetch transcript content once
  useEffect(() => {
    fetch('/media/videos/transcript.txt')
      .then((res) => (res.ok ? res.text() : ''))
      .then((text) => setTranscriptContent(text))
      .catch(() => {});
  }, []);

  // Update time and duration
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 65);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
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
    }
  };

  const jumpToChapter = (timeInSeconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeInSeconds;
      setCurrentTime(timeInSeconds);
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const toggleCaptions = () => {
    if (!videoRef.current) return;
    const tracks = videoRef.current.textTracks;
    if (tracks && tracks.length > 0) {
      const mode = tracks[0].mode === 'showing' ? 'hidden' : 'showing';
      tracks[0].mode = mode;
      setCaptionsEnabled(mode === 'showing');
    }
  };

  const cyclePlaybackSpeed = () => {
    if (!videoRef.current) return;
    const speeds = [1, 1.25, 1.5];
    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIndex];
    videoRef.current.playbackRate = nextSpeed;
    setPlaybackSpeed(nextSpeed);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section id="product-video" className="py-16 md:py-24 bg-white/60 border-y border-gatewise-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gatewise-light/80 text-gatewise-deep border border-gatewise-mint/60 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-gatewise-primary" />
            <span>Master Product Walkthrough · 65s</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gatewise-text tracking-tight">
            See GATEWISE AI in Action
          </h2>
          <p className="text-sm sm:text-base text-gatewise-secondary leading-relaxed">
            Follow a real verification from the physical gate post to the central management dashboard. Experience how edge AI verification, offline safeguards, and instantaneous cryptographic audits converge.
          </p>
        </div>

        {/* Video Player Container */}
        <div className="max-w-5xl mx-auto">
          <div
            ref={containerRef}
            className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800 group"
          >
            {/* HTML5 Video Element */}
            <video
              ref={videoRef}
              className="w-full aspect-video object-cover cursor-pointer"
              poster="/media/posters/gatewise-overview.webp"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onClick={togglePlay}
              playsInline
              preload="metadata"
            >
              <source src="/media/videos/gatewise-overview.mp4" type="video/mp4" />
              <source src="/media/videos/gatewise-overview.webm" type="video/webm" />
              <track
                src="/media/videos/gatewise-overview.vtt"
                kind="subtitles"
                srcLang="en"
                label="English"
              />
              Your browser does not support the video tag.
            </video>

            {/* Big Center Play Button when paused */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] transition-all cursor-pointer group-hover:bg-black/40"
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
                  step="0.1"
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
                    className="p-1.5 hover:text-gatewise-mint transition-colors"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-1.5 hover:text-gatewise-mint transition-colors"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
                  </button>

                  <span className="font-mono text-[11px] text-slate-300">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Right Controls: CC, Speed, Fullscreen */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <button
                    onClick={toggleCaptions}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-all ${
                      captionsEnabled
                        ? 'bg-gatewise-mint text-slate-950 font-bold'
                        : 'bg-white/10 text-slate-300 hover:text-white'
                    }`}
                    title="Toggle Closed Captions (WebVTT)"
                  >
                    CC
                  </button>

                  <button
                    onClick={cyclePlaybackSpeed}
                    className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[11px] font-mono text-slate-300"
                    title="Change Playback Speed"
                  >
                    {playbackSpeed}x
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 hover:text-gatewise-mint transition-colors"
                    aria-label="Toggle Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Chapter Markers Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] font-semibold text-gatewise-secondary uppercase tracking-wider mr-1">
              Storyboard Scenes:
            </span>
            {CHAPTERS.map((ch, idx) => (
              <button
                key={idx}
                onClick={() => jumpToChapter(ch.time)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                  currentTime >= ch.time && (idx === CHAPTERS.length - 1 || currentTime < CHAPTERS[idx + 1].time)
                    ? 'bg-gatewise-primary text-white border-gatewise-primary shadow-xs'
                    : 'bg-white border-gatewise-border text-gatewise-text hover:border-gatewise-primary/50'
                }`}
              >
                <span className="font-mono text-[10px] opacity-75 mr-1.5">{ch.tag.split(' ')[0]}</span>
                <span>{ch.label}</span>
              </button>
            ))}
          </div>

          {/* Transcript View & Download Bar */}
          <div className="mt-6 border border-gatewise-border rounded-2xl bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-gatewise-primary" />
                <span className="text-xs font-semibold text-gatewise-text">
                  Synchronised Audio Transcript &amp; Scene Captions
                </span>
              </div>
              <div className="flex items-center space-x-2">
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
                  className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-gatewise-light/50 text-gatewise-text text-xs font-medium hover:bg-gatewise-light transition-colors"
                >
                  <span>{showTranscript ? 'Hide Text' : 'View Text'}</span>
                  {showTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Expandable Transcript Content */}
            {showTranscript && (
              <div className="mt-4 pt-4 border-t border-gatewise-border text-xs text-gatewise-secondary font-mono leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap bg-gatewise-light/20 p-3 rounded-xl">
                {transcriptContent || (
                  `GATEWISE AI MASTER PRODUCT WALKTHROUGH — TRANSCRIPT

00:00 - Scene 1: Perimeter Challenges & Real Gate Bottlenecks
High-density campus gates face severe congestion during shift and class changes. Traditional manual registers and slow centralized biometric systems cause friction, unauthorized tailgating, and lack verifiable audit trails.

00:12 - Scene 2: GATEWISE Guard Android Experience
Officer Ramesh Verma captures subject face. The edge YuNet detector isolates 5 facial landmarks in 28ms. An on-device SFace engine extracts a 128-D vector representation. No raw photographs leave the secure enclave.

00:28 - Scene 3: Admin Command Centre
Instantaneous multi-gate telemetry. Gate-Main-02 reflects Dr. Maya Sharma verified at 0.984 cosine similarity. Real-time exception notifications, visitor logs, and AI Assistant natural language queries.

00:44 - Scene 4: Connected Cryptographic Audit
Every single ingress decision is sealed with an HMAC-SHA256 non-repudiation signature. Even during total network disconnection, local SQLite queues preserve cryptographic continuity.

00:58 - Scene 5: Institutional Governance & Privacy
Sub-300ms verification SLA. 100% sovereign campus deployment. Zero third-party cloud data leaks.`
                )}
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
