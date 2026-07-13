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
          <h3 className="text-lg font-bold text-slate-800">Score Breakdown</h3>
          <p className="text-sm text-slate-500">Detailed analysis of your explanation</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-3xl font-extrabold text-primary-600">{overall}</span>
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
      
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">Misconception Risk</span>
        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
          misconceptionRisk === 'High' ? 'bg-rose-100 text-rose-700' :
          misconceptionRisk === 'Medium' ? 'bg-amber-100 text-amber-700' :
          'bg-emerald-100 text-emerald-700'
        }`}>
          {misconceptionRisk}
        </span>
      </div>
    </div>
  );
};
