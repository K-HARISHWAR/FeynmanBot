import React from 'react';
import { User, Baby, MessageSquare, BookOpen, Briefcase } from 'lucide-react';

interface AIStudentModeSelectorProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
  disabled?: boolean;
}

const MODES = [
  { id: 'Friendly Beginner', icon: <User className="w-5 h-5" />, desc: 'Supportive, simple questions' },
  { id: 'Curious Child', icon: <Baby className="w-5 h-5" />, desc: 'Very simple why/how questions' },
  { id: 'Confused Classmate', icon: <MessageSquare className="w-5 h-5" />, desc: 'Asks about unclear parts' },
  { id: 'Strict Examiner', icon: <BookOpen className="w-5 h-5" />, desc: 'Deeper conceptual checks' },
  { id: 'Interview Panel', icon: <Briefcase className="w-5 h-5" />, desc: 'Concise interview-style' }
];

export const AIStudentModeSelector: React.FC<AIStudentModeSelectorProps> = ({ selectedMode, onSelectMode, disabled }) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Select AI Student Persona</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            disabled={disabled}
            onClick={() => onSelectMode(mode.id)}
            className={`relative overflow-hidden group p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
              selectedMode === mode.id 
                ? 'bg-primary-50 dark:bg-primary-900/40 border-primary-500 shadow-md transform -translate-y-1 ring-2 ring-primary-200 dark:ring-primary-900' 
                : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-500 hover:bg-slate-50 dark:hover:bg-slate-700'
            } ${disabled ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
          >
            <div className={`p-2 rounded-full mb-2 transition-colors ${selectedMode === mode.id ? 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
              {mode.icon}
            </div>
            <span className={`text-sm font-medium transition-colors ${selectedMode === mode.id ? 'text-primary-900 dark:text-primary-100' : 'text-slate-700 dark:text-slate-300'}`}>
              {mode.id}
            </span>
            <div className="absolute inset-0 bg-slate-900/90 dark:bg-slate-800/95 flex flex-col items-center justify-center p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm z-10 pointer-events-none">
              <span className="text-xs text-white font-medium text-center">{mode.desc}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
