import React from 'react';
import { Target, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';

interface ConfidenceInsightProps {
  confidenceBefore: number;
  overallScore: number;
}

export const ConfidenceInsight: React.FC<ConfidenceInsightProps> = ({ confidenceBefore, overallScore }) => {
  // Logic
  let insightText = "";
  let icon = null;
  let bgClass = "";
  let textClass = "";

  if (confidenceBefore === 5 && overallScore < 75) {
    insightText = "Overconfidence gap detected. You felt very confident, but there are still gaps in your understanding.";
    icon = <TrendingDown className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />;
    bgClass = "bg-amber-50 border-amber-200";
    textClass = "text-amber-800";
  } else if (confidenceBefore <= 2 && overallScore >= 80) {
    insightText = "You know more than you think! Your explanation was excellent despite your low initial confidence.";
    icon = <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />;
    bgClass = "bg-emerald-50 border-emerald-200";
    textClass = "text-emerald-800";
  } else {
    insightText = "Confidence and understanding are aligned. Your self-assessment matched your actual performance well.";
    icon = <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />;
    bgClass = "bg-blue-50 border-blue-200";
    textClass = "text-blue-800";
  }

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center">
        <Target className="w-4 h-4 mr-2 text-primary-500" />
        Confidence Insight
      </h3>
      <div className={`p-4 rounded-xl border flex items-start gap-3 shadow-sm ${bgClass}`}>
        {icon}
        <div>
          <p className={`text-sm font-medium leading-relaxed ${textClass}`}>{insightText}</p>
          <div className="mt-3 flex items-center gap-6 text-xs font-semibold">
            <div className="flex flex-col">
              <span className="text-slate-500 uppercase tracking-wider mb-1 text-[10px]">Initial Confidence</span>
              <span className="bg-white px-2 py-1 rounded border shadow-sm">{confidenceBefore} / 5</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500 uppercase tracking-wider mb-1 text-[10px]">Actual Score</span>
              <span className="bg-white px-2 py-1 rounded border shadow-sm">{overallScore} / 100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
