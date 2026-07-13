import React from 'react';

export const NeuralNodePattern: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg className={`absolute inset-0 w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="neural-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1.5" className="fill-slate-300/40 animate-neural-pulse" />
          <circle cx="80" cy="40" r="2" className="fill-primary-300/30 animate-neural-pulse" style={{ animationDelay: '1s' }} />
          <circle cx="50" cy="80" r="1.5" className="fill-slate-300/40 animate-neural-pulse" style={{ animationDelay: '2s' }} />
          <path d="M20,20 L80,40 L50,80 Z" className="stroke-slate-300/10 fill-none stroke-[0.5]" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#neural-pattern)" />
    </svg>
  );
};
