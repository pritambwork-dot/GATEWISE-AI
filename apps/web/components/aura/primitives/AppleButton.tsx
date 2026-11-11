import React from 'react';
import { ChevronRight, ShieldCheck, Smartphone } from 'lucide-react';
import { AppleLogo } from './AppleLogo';

interface AppleButtonProps {
  label?: string;
  full?: boolean;
  icon?: 'apple' | 'android' | 'shield';
  onClick?: () => void;
  className?: string;
}

export const AppleButton: React.FC<AppleButtonProps> = ({
  label = 'Deploy Gatewise',
  full = false,
  icon = 'shield',
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-2.5 rounded-full bg-white text-black font-semibold text-sm px-6 py-3.5 transition-all duration-200 hover:bg-white/90 hover:shadow-[0_0_24px_rgba(255,255,255,0.25)] active:scale-[0.98] ${
        full ? 'w-full' : ''
      } ${className}`}
    >
      {icon === 'apple' && <AppleLogo className="w-4 h-4 text-black flex-shrink-0" />}
      {icon === 'android' && <Smartphone className="w-4 h-4 text-black flex-shrink-0" />}
      {icon === 'shield' && <ShieldCheck className="w-4 h-4 text-black flex-shrink-0" />}
      <span>{label}</span>
      <ChevronRight className="w-4 h-4 text-black transition-transform duration-200 group-hover:translate-x-[2px]" />
    </button>
  );
};
