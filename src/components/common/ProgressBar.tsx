import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: string;
  color?: 'purple' | 'cyan' | 'green' | 'cornsilk' | 'rose';
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 'h-2.5',
  color = 'cornsilk',
  showPercentage = false,
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  const colorClasses = {
    cornsilk: 'bg-gradient-to-r from-[#674846] via-[#b58d7c] to-[#FFF8DC] shadow-[0_0_10px_rgba(255,248,220,0.5)]',
    rose: 'bg-gradient-to-r from-[#674846] to-[#8c5f5c] shadow-[0_0_10px_rgba(103,72,70,0.6)]',
    purple: 'bg-gradient-to-r from-[#674846] to-[#FFF8DC] shadow-[0_0_10px_rgba(255,248,220,0.5)]',
    cyan: 'bg-gradient-to-r from-[#674846] to-[#FFF8DC] shadow-[0_0_10px_rgba(255,248,220,0.5)]',
    green: 'bg-gradient-to-r from-emerald-600 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.6)]',
  };

  return (
    <div className="w-full space-y-1">
      {showPercentage && (
        <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
          <span>Progress</span>
          <span className="text-white font-bold">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={`w-full bg-[#1b1b24] border border-[#262633] rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} ${colorClasses[color]} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
