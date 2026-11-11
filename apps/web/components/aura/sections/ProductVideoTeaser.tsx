'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, Film } from 'lucide-react';
import { SectionEyebrow } from '../primitives/SectionEyebrow';

const VIDEOS = [
  {
    id: 'teaser',
    label: '4K Motion Teaser',
    src: '/media/videos/gatewise-teaser-uploaded.mp4',
    badge: 'CINEMATIC 2X',
    desc: 'Official 4K product motion teaser demonstrating multi-factor gate verification and sovereign campus operations.',
  },
  {
    id: 'admin',
    label: 'Command Centre Walkthrough',
    src: '/media/videos/admin-portal-demo.mp4',
    badge: 'ADMIN PORTAL',
    desc: 'Centralized institutional command centre: live gate feeds, identity roster, guard management, and incident escalation.',
  },
  {
    id: 'guard',
    label: 'Guard Mobile App Demo',
    src: '/media/videos/guard-app-demo.mp4',
    badge: 'ANDROID GUARD',
    desc: 'Sub-300ms edge camera face match, offline identity cache, and biometric verification on handheld ruggedized terminal.',
  },
  {
    id: 'overview',
    label: 'Platform Overview',
    src: '/media/videos/gatewise-overview.mp4',
    badge: 'FULL SYSTEM',
    desc: 'End-to-end sovereign perimeter architecture, hardware actuators, and cryptographic audit ledger overview.',
  },
];

export const ProductVideoTeaser: React.FC = () => {
  const [activeVideoId, setActiveVideoId] = useState('teaser');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVideo = VIDEOS.find((v) => v.id === activeVideoId) || VIDEOS[0];

  // Enforce 2x playback speed as requested
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 2.0;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [activeVideoId, isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else {
        videoRef.current.requestFullscreen().catch(() => {});
      }
    }
  };

  return (
    <section className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-16 md:py-24">
      {/* Eyebrow & Headline */}
      <div className="flex flex-col items-center text-center mb-10 space-y-4">
        <SectionEyebrow label="Cinematic Showcase" tag="Real Product Video" />
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-white">
          See GATEWISE AI in Action
        </h2>
        <p className="text-white/60 max-w-xl text-sm sm:text-base leading-relaxed">
          Real application screen captures and motion walkthroughs. No fake mockups or static illustrations.
        </p>

        {/* Video selector tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {VIDEOS.map((tab) => {
            const isActive = tab.id === activeVideoId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveVideoId(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)]'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Film className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-[#00d2ff]'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-black/10 text-black' : 'bg-white/10 text-white/50'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Video Player Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="liquid-glass relative rounded-3xl overflow-hidden border border-white/15 bg-black/80 shadow-[0_25px_80px_rgba(0,0,0,0.8)] aspect-video w-full group"
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#00d2ff]/10 via-transparent to-[#3D81E3]/10 pointer-events-none" />

        {/* The Video Element */}
        <video
          ref={videoRef}
          key={currentVideo.src}
          src={currentVideo.src}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover cursor-pointer"
          onClick={togglePlay}
        />

        {/* Ambient Top Overlay Header */}
        <div className="absolute top-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/30 to-transparent flex items-center justify-between pointer-events-none select-none">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-white tracking-tight">
              {currentVideo.label}
            </span>
            <span className="text-xs text-white/40 hidden sm:inline">•</span>
            <span className="text-xs text-white/50 font-mono hidden sm:inline">2.0x Dynamic Speed</span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={toggleMute}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white text-xs font-medium backdrop-blur-md transition-all flex items-center gap-1.5"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span className="hidden sm:inline">{isMuted ? 'Unmute Audio' : 'Muted'}</span>
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white backdrop-blur-md transition-all"
              aria-label="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Description Pill */}
        <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 p-4 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 select-none">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#00d2ff]" />
              <span className="text-xs font-semibold text-white">{currentVideo.label}</span>
            </div>
            <p className="text-xs text-white/70 max-w-2xl leading-relaxed">
              {currentVideo.desc}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={togglePlay}
              className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-black" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
