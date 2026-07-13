import React from 'react';
import { Bot, Loader2 } from 'lucide-react';

export type BotStatus = 'idle' | 'listening' | 'thinking' | 'confused' | 'ready' | 'evaluating';

interface TeachModeStatusProps {
  status: BotStatus;
}

const STATUS_CONFIG = {
  idle: { text: "Ready to learn from you.", color: "text-slate-500", bg: "bg-slate-100", border: "border-slate-200", animation: "", glow: "shadow-[0_0_15px_rgba(99,102,241,0.15)]" },
  listening: { text: "FeynmanBot is reading your explanation...", color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200", animation: "animate-pulse", glow: "shadow-[0_0_20px_rgba(14,165,233,0.3)]" },
  thinking: { text: "FeynmanBot is thinking of a question...", color: "text-primary-500", bg: "bg-primary-50", border: "border-primary-200", animation: "animate-pulse-soft", glow: "shadow-[0_0_20px_rgba(139,92,246,0.3)]" },
  confused: { text: "FeynmanBot found something unclear.", color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200", animation: "animate-bounce", glow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]" },
  ready: { text: "FeynmanBot is ready for your answer.", color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200", animation: "", glow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]" },
  evaluating: { text: "FeynmanBot is evaluating your understanding.", color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-200", animation: "animate-pulse-soft", glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]" },
};

export const TeachModeStatus: React.FC<TeachModeStatusProps> = ({ status }) => {
  const config = STATUS_CONFIG[status];
  const isProcessing = status === 'listening' || status === 'thinking' || status === 'evaluating';

  return (
    <div className={`flex items-center space-x-4 p-4 rounded-2xl border transition-colors duration-500 ${config.bg} ${config.border}`}>
      <div className={`relative flex items-center justify-center w-12 h-12 rounded-full bg-white border border-white/50 transition-shadow duration-500 ${config.animation} ${config.glow}`}>
        <Bot className={`w-6 h-6 ${config.color}`} />
        {isProcessing && (
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.color.replace('text', 'bg')}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${config.color.replace('text', 'bg')}`}></span>
          </span>
        )}
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800">FeynmanBot</h4>
        <div className="flex items-center mt-0.5">
          {isProcessing && <Loader2 className={`w-3 h-3 mr-1.5 animate-spin ${config.color}`} />}
          <p className={`text-sm font-medium ${config.color}`}>{config.text}</p>
        </div>
      </div>
    </div>
  );
};
