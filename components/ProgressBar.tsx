import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progress = Math.min(100, Math.max(0, ((current) / total) * 100));

  return (
    <div className="w-full max-w-3xl mx-auto mb-6 px-4 md:px-0">
      <div className="flex justify-between text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
        <span>Progress</span>
        <span>{current} / {total}</span>
      </div>
      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
        <div 
            className="h-full bg-blue-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;