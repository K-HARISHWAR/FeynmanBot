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
      <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Select AI Student Persona</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            disabled={disabled}
            onClick={() => onSelectMode(mode.id)}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
              selectedMode === mode.id 
                ? 'bg-primary-50 border-primary-500 shadow-md transform -translate-y-1 ring-2 ring-primary-200' 
                : 'bg-white border-slate-200 hover:border-primary-300 hover:bg-slate-50'
            } ${disabled ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
          >
            <div className={`p-2 rounded-full mb-2 ${selectedMode === mode.id ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'}`}>
              {mode.icon}
            </div>
            <span className={`text-sm font-medium ${selectedMode === mode.id ? 'text-primary-900' : 'text-slate-700'}`}>
              {mode.id}
            </span>
            <span className="text-xs text-slate-500 mt-1">{mode.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
