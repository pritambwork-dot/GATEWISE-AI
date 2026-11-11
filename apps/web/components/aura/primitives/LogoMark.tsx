import React from 'react';

interface LogoMarkProps {
  className?: string;
}

export const LogoMark: React.FC<LogoMarkProps> = ({ className = 'w-8 h-8' }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full text-white"
      aria-label="GATEWISE AI Emblem"
    >
      {/* Outer Shield Boundary */}
      <path
        d="M20 3L6 8.5V18.5C6 27.5 12 35.5 20 38C28 35.5 34 27.5 34 18.5V8.5L20 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-90"
      />
      {/* Inner Biometric / Neural Node Core */}
      <path
        d="M20 10L12 14V20C12 25 15.5 29.5 20 31C24.5 29.5 28 25 28 20V14L20 10Z"
        fill="url(#gatewise-shield-grad)"
        fillOpacity="0.25"
        stroke="url(#gatewise-shield-grad)"
        strokeWidth="1.5"
      />
      {/* Center Key / Verification Reticle */}
      <circle cx="20" cy="19" r="3" fill="#00d2ff" />
      <path
        d="M20 22V26M18 24H22"
        stroke="#00d2ff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <defs>
        <linearGradient
          id="gatewise-shield-grad"
          x1="12"
          y1="10"
          x2="28"
          y2="31"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00d2ff" />
          <stop offset="0.5" stopColor="#3D81E3" />
          <stop offset="1" stopColor="#0B2551" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);
