import React from 'react';

interface FloatingConceptCardProps {
  keyword: string;
  position: { top: string; left: string };
  delay?: string;
  size?: 'sm' | 'md';
}

export const FloatingConceptCard: React.FC<FloatingConceptCardProps> = ({ 
  keyword, 
  position, 
  delay = '0s',
  size = 'md'
}) => {
  return (
    <div 
      className={`absolute flex items-center justify-center rounded-xl bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-float-slow motion-safe-animation ${size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm'}`}
      style={{
        ...position,
        animationDelay: delay,
      }}
    >
      <span className="font-medium text-primary-800/80 tracking-wide">{keyword}</span>
    </div>
  );
};
