'use client';

import React from 'react';

export const GatewiseLogo: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const boxClass =
    size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  const svgClass =
    size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';

  return (
    <span
      className={`${boxClass} bg-[#2F5BFF] flex items-center justify-center text-white shrink-0 ${className}`}
    >
      <svg viewBox="0 0 32 32" className={svgClass} fill="none" aria-hidden="true">
        <path
          d="M9 24V15C9 11.134 12.134 8 16 8C19.866 8 23 11.134 23 15V24"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path d="M6 24H26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="16" cy="15" r="2.2" fill="white" />
      </svg>
    </span>
  );
};
