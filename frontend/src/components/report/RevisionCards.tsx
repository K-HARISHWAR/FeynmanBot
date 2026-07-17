import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface RevisionCardProps {
  question: string;
  answer: string;
  category?: string;
}

const RevisionCard: React.FC<RevisionCardProps> = ({ question, answer, category }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full hover:border-primary-300 transition-colors">
      <div className="p-4 flex-grow cursor-pointer" onClick={() => setShowAnswer(!showAnswer)}>
        {category && (
          <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] uppercase font-bold tracking-wider rounded-md mb-3">
            {category}
          </span>
        )}
        <p className="text-sm font-bold text-slate-800 leading-relaxed mb-4">{question}</p>
        
        {showAnswer ? (
          <div className="pt-3 border-t border-slate-100 animate-in fade-in duration-300">
            <p className="text-sm text-slate-700 leading-relaxed">{answer}</p>
          </div>
        ) : (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-center text-primary-500 group-hover:text-primary-600 transition-colors">
              <Eye className="w-4 h-4 mr-1.5" />
              <span className="text-xs font-semibold">Click to show {category === 'Practice' ? 'question' : 'answer'}</span>
            </div>
        )}
      </div>
      {showAnswer && (
        <button 
          onClick={(e) => { e.stopPropagation(); setShowAnswer(false); }}
          className="w-full py-2 bg-slate-50 border-t border-slate-200 text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center justify-center"
        >
          <EyeOff className="w-3.5 h-3.5 mr-1.5" /> Hide {category === 'Practice' ? 'Question' : 'Answer'}
        </button>
      )}
    </div>
  );
};

interface RevisionCardsListProps {
  cards: RevisionCardProps[];
}

export const RevisionCards: React.FC<RevisionCardsListProps> = ({ cards }) => {
  if (!cards || cards.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((card, i) => (
        <RevisionCard key={i} {...card} />
      ))}
    </div>
  );
};
