import React from 'react';

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  colorClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  label, 
  value, 
  max = 100,
  colorClass = 'bg-primary-500' 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-semibold text-slate-900">{value}/{max}</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full ${colorClass} transition-all duration-1000 ease-out`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
