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
        'bg-[#141414] border border-[#D4C9B3]/25 rounded-md p-5 transition-all duration-200',
        hoverEffect && 'hover:border-[#D4C9B3]/60 hover:bg-[#1a1a1a] hover:shadow-[0_0_20px_rgba(212,201,179,0.2)]',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};
