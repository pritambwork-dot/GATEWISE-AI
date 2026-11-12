import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { SectionEyebrow } from '../primitives/SectionEyebrow';

export const ProductVideoTeaser: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

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

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else {
        videoRef.current.requestFullscreen().catch(() => {});
      }
    }
  };

  return (
    <section id="motion-showcase" className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-20">
      {/* Eyebrow & Headline */}
      <div className="flex flex-col items-center text-center mb-6 sm:mb-10 space-y-3 sm:space-y-4">
        <SectionEyebrow label="Product Showcase" tag="GATEWISE AI" />
        <h2 className="text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-white">
          Experience GATEWISE AI in Action
        </h2>
      </div>

      {/* Video Player Frame - Zero Typography, Pure Video Experience */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="liquid-glass relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-black/90 shadow-[0_25px_80px_rgba(0,0,0,0.85)] aspect-video w-full group cursor-pointer"
        onClick={togglePlay}
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#12B5A6]/10 via-transparent to-[#2F5BFF]/10 pointer-events-none" />

        {/* The Pure Video Element */}
        <video
          ref={videoRef}
          src="/media/videos/gatewise-launch-film.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Minimal Icon-Only Floating Controls (Zero Typography, Pure Icons) */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
          {/* Play / Pause */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all flex items-center justify-center cursor-pointer shadow-lg active:scale-95"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white text-white" />
            ) : (
              <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />
            )}
          </button>

          {/* Mute / Unmute */}
          <button
            type="button"
            onClick={toggleMute}
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all flex items-center justify-center cursor-pointer shadow-lg active:scale-95"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#1FB36B]" />
            )}
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all flex items-center justify-center cursor-pointer shadow-lg active:scale-95"
            aria-label="Fullscreen"
          >
            <Maximize2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </motion.div>
    </section>
  );
};
