import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'almond' | 'suede' | 'velvet' | 'cornsilk' | 'rose' | 'purple' | 'cyan' | 'green' | 'yellow' | 'red' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'almond',
  size = 'sm',
  className = '',
}) => {
  const variantStyles = {
    almond: 'bg-[#D4C9B3]/20 text-[#D4C9B3] border-[#D4C9B3]/40',
    suede: 'bg-[#D4C9B3]/20 text-[#D4C9B3] border-[#D4C9B3]/40',
    velvet: 'bg-[#0D0D0D] text-[#D4C9B3] border-[#D4C9B3]/30',
    cornsilk: 'bg-[#FFF8DC]/20 text-[#FFF8DC] border-[#FFF8DC]/40',
    rose: 'bg-[#674846]/60 text-[#FFF8DC] border-[#674846]',
    purple: 'bg-purple-950/60 text-purple-300 border-purple-800/50',
    cyan: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/50',
    green: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50',
    yellow: 'bg-amber-950/60 text-amber-300 border-amber-800/50',
    red: 'bg-rose-950/60 text-rose-300 border-rose-800/50',
    gray: 'bg-[#1a1a24] text-gray-400 border-[#2b2b3a]',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-mono font-medium border rounded uppercase tracking-wider',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};
