import React from 'react';

interface LogoMarkProps {
  className?: string;
}

export const LogoMark: React.FC<LogoMarkProps> = ({ className = 'w-8 h-8' }) => (
  <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-label="GATEWISE AI Emblem"
    >
      {/* Cobalt Squircle Background (#2F5BFF) */}
      <rect width="48" height="48" rx="14" fill="#2F5BFF" />
      
      {/* Gate Arch Entry (#FFFFFF) */}
      <path
        d="M17 33V23C17 19.134 20.134 16 24 16C27.866 16 31 19.134 31 23V33"
        stroke="#FFFFFF"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Base Ground Threshold Bar */}
      <path
        d="M12 33H36"
        stroke="#FFFFFF"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Teal Aperture - Verified Face (#12B5A6) */}
      <circle cx="24" cy="23" r="3.5" fill="#12B5A6" />
    </svg>
  </div>
);
