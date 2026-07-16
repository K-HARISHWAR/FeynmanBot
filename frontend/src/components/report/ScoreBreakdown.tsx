import React from 'react';
import { ProgressBar } from '../common/ProgressBar';

interface ScoreBreakdownProps {
  overall: number;
  accuracy: number;
  clarity: number;
  completeness: number;
  exampleQuality?: number;
  misconceptionRisk: 'Low' | 'Medium' | 'High';
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({
  overall,
  accuracy,
  clarity,
  completeness,
  exampleQuality,
  misconceptionRisk
}) => {
  let glowClass = 'shadow-[0_0_20px_rgba(244,63,94,0.15)]'; // rose
  if (overall >= 85) glowClass = 'shadow-[0_0_20px_rgba(16,185,129,0.2)]'; // emerald
  else if (overall >= 70) glowClass = 'shadow-[0_0_20px_rgba(14,165,233,0.2)]'; // blue
  else if (overall >= 50) glowClass = 'shadow-[0_0_20px_rgba(245,158,11,0.2)]'; // amber

  return (
    <div className={`glass-card p-6 transition-shadow duration-500 ${glowClass}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Score Breakdown</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Detailed analysis of your explanation</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-3xl font-extrabold text-primary-600 dark:text-primary-400">{overall}</span>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Overall Score</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <ProgressBar label="Accuracy" value={accuracy} colorClass="bg-emerald-500" />
        <ProgressBar label="Clarity" value={clarity} colorClass="bg-blue-500" />
        <ProgressBar label="Completeness" value={completeness} colorClass="bg-purple-500" />
        
        {exampleQuality !== undefined && (
          <ProgressBar label="Example Quality" value={exampleQuality} colorClass="bg-amber-500" />
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Misconception Risk</span>
        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
          misconceptionRisk === 'High' ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300' :
          misconceptionRisk === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' :
          'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
        }`}>
          {misconceptionRisk}
        </span>
      </div>
    </div>
  );
};
