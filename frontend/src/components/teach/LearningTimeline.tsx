import React from 'react';
import { BookOpen, MessageCircle, CheckCircle, Brain, FileText } from 'lucide-react';

interface LearningTimelineProps {
  currentStep: number;
}

const STEPS = [
  { id: 0, label: 'Topic', icon: <BookOpen className="w-4 h-4" /> },
  { id: 1, label: 'Explain', icon: <MessageCircle className="w-4 h-4" /> },
  { id: 2, label: 'Q1', icon: <CheckCircle className="w-4 h-4" /> },
  { id: 3, label: 'Q2', icon: <CheckCircle className="w-4 h-4" /> },
  { id: 4, label: 'Q3', icon: <CheckCircle className="w-4 h-4" /> },
  { id: 5, label: 'Evaluate', icon: <Brain className="w-4 h-4" /> },
  { id: 6, label: 'Report', icon: <FileText className="w-4 h-4" /> }
];

export const LearningTimeline: React.FC<LearningTimelineProps> = ({ currentStep }) => {
  return (
    <div className="w-full py-4 px-2 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[500px]">
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center relative z-10">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive ? 'bg-primary-500 text-white border-primary-500 shadow-md ring-4 ring-primary-100 scale-110' :
                    isCompleted ? 'bg-primary-100 text-primary-600 border-primary-500' :
                    'bg-white text-slate-400 border-slate-200'
                  }`}
                >
                  {step.icon}
                </div>
                <span className={`text-xs mt-2 font-medium ${isActive ? 'text-primary-700' : isCompleted ? 'text-primary-600' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
              
              {index < STEPS.length - 1 && (
                <div className="flex-grow h-1 mx-2 rounded-full overflow-hidden bg-slate-200">
                  <div 
                    className="h-full bg-primary-500 transition-all duration-500 ease-out"
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
