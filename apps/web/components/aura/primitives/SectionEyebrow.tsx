'use client';
import React from 'react';

interface SectionEyebrowProps {
  label: string;
  tag?: string;
  className?: string;
}

export const SectionEyebrow: React.FC<SectionEyebrowProps> = ({
  label,
  tag,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
      <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
        {label}
      </span>
      {tag && (
        <span className="px-2 py-0.5 rounded-full border border-white/10 text-white/50 text-[11px] font-medium tracking-normal">
          {tag}
        </span>
      )}
    </div>
  );
};
