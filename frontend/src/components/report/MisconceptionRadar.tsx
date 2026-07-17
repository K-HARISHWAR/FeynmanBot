import React from 'react';
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface MisconceptionRadarProps {
  misconceptions: string[];
  weaknesses: string[];
}

export const MisconceptionRadar: React.FC<MisconceptionRadarProps> = ({ misconceptions, weaknesses }) => {
  return (
    <div className="space-y-4">
      {misconceptions.length > 0 ? (
        <div className="space-y-3">
          {misconceptions.map((mc, idx) => (
            <div key={`mc-${idx}`} className="bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-xl p-4 flex items-start gap-3 shadow-sm">
              <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-800 dark:text-rose-400 mb-1 flex items-center gap-2">
                  Misconception Detected
                  <span className="text-[10px] uppercase tracking-wider bg-rose-200 dark:bg-rose-800 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full">Needs Review</span>
                </h4>
                <p className="text-sm text-rose-700 dark:text-rose-300">{mc}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 mb-1">Clear Understanding</h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">No major misconceptions detected in your explanation.</p>
          </div>
        </div>
      )}

      {weaknesses.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-500" />
            Areas to Improve
          </h4>
          <ul className="space-y-2">
            {weaknesses.map((w, idx) => (
              <li key={`w-${idx}`} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-lg shadow-sm">
                <span className="text-amber-500 shrink-0 mt-0.5">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
