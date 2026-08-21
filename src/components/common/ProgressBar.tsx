import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: string;
  color?: 'purple' | 'cyan' | 'green';
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 'h-2.5',
  color = 'purple',
  showPercentage = false,
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  const colorClasses = {
    purple: 'bg-gradient-to-r from-purple-600 to-indigo-500 shadow-[0_0_10px_rgba(139,92,246,0.6)]',
    cyan: 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]',
    green: 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.6)]',
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
