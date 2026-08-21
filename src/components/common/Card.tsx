import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-[#111116] border border-[#1f1f28] rounded-md p-5 transition-all duration-200',
        hoverEffect && 'hover:border-purple-500/40 hover:bg-[#16161d] hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};
