import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, Film,
  ShieldCheck, Cpu, Activity, Fingerprint, Lock, CheckCircle2, Gauge
} from 'lucide-react';
import { SectionEyebrow } from '../primitives/SectionEyebrow';

const VIDEOS = [
  {
    id: 'teaser',
    label: 'Official Product Launch Film',
    shortLabel: 'Launch Film',
    src: '/media/videos/gatewise-launch-film.mp4',
    badge: 'OFFICIAL 1080P',
    tag: 'CINEMATIC LAUNCH',
    desc: 'Official GATEWISE AI product launch film: sub-300ms on-device edge biometric verification, sovereign perimeter defense, and real-time institutional command desk.',
    telemetry: {
      engine: 'YuNet + SFace 128-D',
      latency: '142ms Total Edge Pipeline',
      status: 'VERIFIED [0.984 COSINE]',
      post: 'Gate-Main-02 Terminal Ingress',
    },
  },
];

export const ProductVideoTeaser: React.FC = () => {
  const [activeVideoId, setActiveVideoId] = useState('teaser');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVideo = VIDEOS.find((v) => v.id === activeVideoId) || VIDEOS[0];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [activeVideoId, isPlaying, playbackSpeed]);

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

  const cycleSpeed = () => {
    setPlaybackSpeed((prev) => {
      if (prev === 1.0) return 1.5;
      if (prev === 1.5) return 2.0;
      return 1.0;
    });
  };

  return (
    <section id="motion-showcase" className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-24">
      {/* Eyebrow & Headline */}
      <div className="flex flex-col items-center text-center mb-8 sm:mb-10 space-y-3 sm:space-y-4">
        <SectionEyebrow label="Official Product Showcase" tag="GATEWISE AI 1.0" />
        <h2 className="text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-white">
          Experience GATEWISE AI in Action
        </h2>
        <p className="text-white/60 max-w-2xl text-xs sm:text-sm lg:text-base leading-relaxed px-2">
          Official product launch film: sub-300ms on-device edge biometric verification, sovereign perimeter defense, and zero-image privacy.
        </p>

        {VIDEOS.length > 1 && (
          <div className="w-full flex items-center justify-start sm:justify-center gap-2 pt-2 overflow-x-auto no-scrollbar pb-1 px-1">
            {VIDEOS.map((tab) => {
              const isActive = tab.id === activeVideoId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveVideoId(tab.id)}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 min-h-[38px] ${
                    isActive
                      ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)] font-bold'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Film className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-black' : 'text-[#00d2ff]'}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-black/10 text-black' : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Player Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="liquid-glass relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-black/80 shadow-[0_25px_80px_rgba(0,0,0,0.8)] aspect-video w-full group"
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#00d2ff]/10 via-transparent to-[#3D81E3]/10 pointer-events-none" />

        {/* HUD Corner Brackets */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-l-2 border-[#00d2ff]/60 pointer-events-none z-20" />
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-r-2 border-[#00d2ff]/60 pointer-events-none z-20" />
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-l-2 border-[#00d2ff]/60 pointer-events-none z-20" />
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-r-2 border-[#00d2ff]/60 pointer-events-none z-20" />

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
        <div className="absolute top-0 inset-x-0 p-3 sm:p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between pointer-events-none select-none z-10">
          <div className="flex items-center gap-2 sm:gap-3 truncate pr-2">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="flex items-center gap-1.5 sm:gap-2 truncate">
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                <span className="hidden sm:inline">{currentVideo.label}</span>
                <span className="sm:hidden">{currentVideo.shortLabel}</span>
              </span>
              <span className="px-1.5 sm:px-2 py-0.5 rounded bg-white/10 text-[9px] sm:text-[10px] font-mono text-[#00d2ff] border border-white/10 shrink-0">
                {currentVideo.tag}
              </span>
            </div>
            <span className="text-xs text-white/40 hidden md:inline">•</span>
            <span className="text-xs text-white/50 font-mono hidden md:inline">
              {playbackSpeed === 1.0 ? 'Cinematic 1.0x' : `${playbackSpeed}x Speed`}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto shrink-0">
            {/* Speed toggle pill */}
            <button
              type="button"
              onClick={cycleSpeed}
              className="px-2.5 py-1 rounded-full bg-black/75 hover:bg-black/95 border border-white/20 text-white text-[11px] font-mono font-bold backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer min-h-[36px]"
              title="Toggle speed (1.0x, 1.5x, 2.0x)"
            >
              <Gauge className="w-3 h-3 text-[#00d2ff]" />
              <span>{playbackSpeed}x</span>
            </button>

            {/* Audio Mute/Unmute toggle */}
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-black/75 hover:bg-black/95 border border-white/20 text-white text-xs font-medium backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] min-w-[36px] justify-center"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span className="hidden sm:inline">{isMuted ? 'Unmute Audio' : 'Muted'}</span>
            </button>

            {/* Fullscreen */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 sm:p-2 rounded-full bg-black/75 hover:bg-black/95 border border-white/20 text-white backdrop-blur-md transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Biometric HUD Overlay Strip (desktop) */}
        <div className="absolute top-16 left-6 hidden lg:flex flex-col gap-1.5 pointer-events-none select-none z-10 font-mono text-[10px]">
          <div className="px-2.5 py-1 rounded bg-black/60 border border-white/10 text-white/80 backdrop-blur-md flex items-center gap-2">
            <Cpu className="w-3 h-3 text-[#00d2ff]" />
            <span>PIPELINE: {currentVideo.telemetry.engine}</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-black/60 border border-white/10 text-emerald-400 backdrop-blur-md flex items-center gap-2">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>STATUS: {currentVideo.telemetry.status}</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-black/60 border border-white/10 text-white/60 backdrop-blur-md flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-white/50" />
            <span>NODE: {currentVideo.telemetry.post}</span>
          </div>
        </div>

        {/* Mobile Minimal Floating Play/Pause Pill over video canvas */}
        <div className="sm:hidden absolute bottom-3 right-3 pointer-events-auto z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={togglePlay}
            className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            {isPlaying ? <Pause className="w-3 h-3 text-white" /> : <Play className="w-3 h-3 fill-white text-white" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
        </div>

        {/* Desktop Bottom Description & Playback HUD */}
        <div className="hidden sm:flex absolute bottom-4 inset-x-6 p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/15 items-center justify-between gap-3 select-none z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#00d2ff]" />
              <span className="text-xs font-bold text-white">{currentVideo.label}</span>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                ● {playbackSpeed}X SPEED
              </span>
            </div>
            <p className="text-xs text-white/70 max-w-3xl leading-relaxed">
              {currentVideo.desc}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={togglePlay}
              className="px-4 py-2 rounded-full bg-white text-black text-xs font-bold hover:bg-white/90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-black" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Description Card - Rendered cleanly BELOW the video to prevent canvas occlusion */}
      <div className="sm:hidden mt-3 liquid-glass rounded-2xl p-4 border border-white/10 bg-black/60 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00d2ff]" />
            <span className="text-xs font-bold text-white">{currentVideo.label}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {playbackSpeed}X SPEED
          </span>
        </div>
        <p className="text-xs text-white/70 leading-relaxed">
          {currentVideo.desc}
        </p>
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/50">
          <span>{currentVideo.telemetry.engine}</span>
          <span className="text-emerald-400 font-semibold">{currentVideo.telemetry.status}</span>
        </div>
      </div>
    </section>
  );
};
