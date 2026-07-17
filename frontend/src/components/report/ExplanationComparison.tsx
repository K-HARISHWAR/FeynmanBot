import React from 'react';
import { ArrowRight, Sparkles, Check } from 'lucide-react';

interface ExplanationComparisonProps {
  original?: string;
  improved: string;
  improvements: string[];
}

const renderFormattedText = (text?: string) => {
  if (!text) return "Explanation not available.";
  return text.split('\n').map((paragraph, pIdx) => {
    if (!paragraph.trim()) return null;
    
    const parts = paragraph.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    
    return (
      <p key={pIdx} className="mb-3 last:mb-0">
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-1 rounded">{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={i} className="text-slate-700 dark:text-slate-300 italic">{part.slice(1, -1)}</em>;
          }
          return <span key={i}>{part}</span>;
        })}
      </p>
    );
  });
};

export const ExplanationComparison: React.FC<ExplanationComparisonProps> = ({ original, improved, improvements }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-slate-300"></div>
          <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Your Original Explanation</h4>
          <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">
            {renderFormattedText(original)}
          </div>
        </div>
        
        <div className="glass-card p-6 relative overflow-hidden bg-primary-50/50 dark:bg-primary-900/30 border-primary-100 dark:border-primary-800">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
          <h4 className="text-sm font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wider mb-4 flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            Improved Explanation
          </h4>
          <div className="text-slate-800 dark:text-slate-200 text-[15px] leading-relaxed">
            {renderFormattedText(improved)}
          </div>
        </div>
      </div>
      
      {improvements.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center">
            <ArrowRight className="w-4 h-4 mr-2 text-slate-400" />
            What Improved
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {improvements.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
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
