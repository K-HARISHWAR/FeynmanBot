import React, { useState } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';

const CHALLENGES = [
  "Try explaining this without using technical jargon.",
  "Can you use a real-life analogy?",
  "Explain it like you are teaching a 10-year-old.",
  "What is the simplest real-world example of this?",
  "Imagine I know absolutely nothing about this. Where do we start?"
];

export const ExplainSimplerButton: React.FC = () => {
  const [challenge, setChallenge] = useState<string | null>(null);

  const generateChallenge = () => {
    let newChallenge;
    do {
      newChallenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
    } while (newChallenge === challenge && CHALLENGES.length > 1);
    setChallenge(newChallenge);
  };

  return (
    <div className="mt-4">
      {!challenge ? (
        <button
          onClick={generateChallenge}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-lg transition-colors border border-primary-200"
          type="button"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          Challenge me to explain simpler
        </button>
      ) : (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start space-x-3 shadow-sm animate-float">
          <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-grow">
            <p className="text-sm font-medium text-amber-900">{challenge}</p>
          </div>
          <button onClick={generateChallenge} className="text-amber-500 hover:text-amber-700 p-1" title="Get another challenge" type="button">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
