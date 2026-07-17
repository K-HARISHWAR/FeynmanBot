import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, AlertTriangle } from 'lucide-react';

interface KnowledgeGapMapProps {
  topic: string;
  understood: string[];
  partial: string[];
  missing: string[];
  misconceptions: string[];
}

export const KnowledgeGapMap: React.FC<KnowledgeGapMapProps> = ({ topic, understood, partial, missing, misconceptions }) => {
  const hasItems = understood.length > 0 || partial.length > 0 || missing.length > 0 || misconceptions.length > 0;

  if (!hasItems) {
    return (
      <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-sm">
        Not enough data to map knowledge gaps for this session.
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="mb-6 text-center">
        <h3 className="inline-block px-4 py-2 bg-slate-800 text-white font-bold rounded-lg shadow-sm text-sm">
          {topic}
        </h3>
        <div className="h-6 w-px bg-slate-300 mx-auto mt-1"></div>
      </div>
      
      <div className="space-y-4">
        {understood.length > 0 && (
          <div className="relative pl-8">
            <div className="absolute left-3 top-2 w-px h-full bg-slate-200 -z-10"></div>
            <div className="absolute left-0 top-1 bg-white dark:bg-slate-800 rounded-full p-0.5 border-2 border-emerald-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 mb-2">Understood</h4>
            <div className="flex flex-wrap gap-2">
              {understood.map((item, i) => (
                <span key={`u-${i}`} className="text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 px-2 py-1 rounded-md">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {partial.length > 0 && (
          <div className="relative pl-8">
            <div className="absolute left-3 top-2 w-px h-full bg-slate-200 -z-10"></div>
            <div className="absolute left-0 top-1 bg-white dark:bg-slate-800 rounded-full p-0.5 border-2 border-amber-500">
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-2">Partially Understood</h4>
            <div className="flex flex-wrap gap-2">
              {partial.map((item, i) => (
                <span key={`p-${i}`} className="text-xs bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 px-2 py-1 rounded-md">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {missing.length > 0 && (
          <div className="relative pl-8">
            <div className="absolute left-3 top-2 w-px h-full bg-slate-200 -z-10"></div>
            <div className="absolute left-0 top-1 bg-white dark:bg-slate-800 rounded-full p-0.5 border-2 border-slate-400">
              <XCircle className="w-4 h-4 text-slate-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Missing Concepts</h4>
            <div className="flex flex-wrap gap-2">
              {missing.map((item, i) => (
                <span key={`m-${i}`} className="text-xs bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 px-2 py-1 rounded-md">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {misconceptions.length > 0 && (
          <div className="relative pl-8">
            <div className="absolute left-0 top-1 bg-white dark:bg-slate-800 rounded-full p-0.5 border-2 border-rose-500">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <h4 className="text-sm font-bold text-rose-800 dark:text-rose-400 mb-2">Misconceptions</h4>
            <div className="flex flex-col gap-2">
              {misconceptions.map((item, i) => (
                <span key={`mc-${i}`} className="text-xs bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 px-3 py-2 rounded-md">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
