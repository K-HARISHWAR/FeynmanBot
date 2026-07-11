import React from 'react';
import { ArrowRight, Sparkles, Check } from 'lucide-react';

interface ExplanationComparisonProps {
  original?: string;
  improved: string;
  improvements: string[];
}

export const ExplanationComparison: React.FC<ExplanationComparisonProps> = ({ original, improved, improvements }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-slate-300"></div>
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Your Original Explanation</h4>
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
            {original || "Original explanation not available for this session."}
          </p>
        </div>
        
        <div className="glass-card p-5 relative overflow-hidden bg-primary-50/50 border-primary-100">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
          <h4 className="text-sm font-bold text-primary-700 uppercase tracking-wider mb-3 flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            Improved Explanation
          </h4>
          <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-medium">
            {improved}
          </p>
        </div>
      </div>
      
      {improvements.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
            <ArrowRight className="w-4 h-4 mr-2 text-slate-400" />
            What Improved
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {improvements.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
