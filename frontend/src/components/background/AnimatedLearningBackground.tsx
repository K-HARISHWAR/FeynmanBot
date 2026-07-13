import React from 'react';
import { FloatingConceptCard } from './FloatingConceptCard';
import { NeuralNodePattern } from './NeuralNodePattern';

export type BackgroundVariant = 'landing' | 'teach' | 'report' | 'dashboard' | 'history';

interface AnimatedLearningBackgroundProps {
  variant: BackgroundVariant;
}

export const AnimatedLearningBackground: React.FC<AnimatedLearningBackgroundProps> = ({ variant }) => {
  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none animated-bg">
      {variant === 'landing' && (
        <>
          {/* Soft gradient blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-200/20 rounded-full blur-[100px] animate-drift" />
          <div className="absolute top-[20%] right-[-5%] w-[40%] h-[60%] bg-sky-200/20 rounded-full blur-[120px] animate-drift" style={{ animationDelay: '-5s' }} />
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[40%] bg-indigo-200/20 rounded-full blur-[100px] animate-drift" style={{ animationDelay: '-10s' }} />
          
          <NeuralNodePattern className="opacity-40" />
          
          {/* Floating Concept Cards */}
          <div className="hidden md:block">
            <FloatingConceptCard keyword="Simplify" position={{ top: '25%', left: '15%' }} delay="0s" />
            <FloatingConceptCard keyword="Teach" position={{ top: '65%', left: '10%' }} delay="-2s" size="sm" />
            <FloatingConceptCard keyword="Reflect" position={{ top: '35%', left: '80%' }} delay="-4s" />
            <FloatingConceptCard keyword="Improve" position={{ top: '70%', left: '75%' }} delay="-1s" size="sm" />
          </div>
        </>
      )}

      {variant === 'teach' && (
        <>
          <div className="absolute top-[30%] left-[10%] w-[30%] h-[40%] bg-violet-200/15 rounded-full blur-[100px] animate-pulse-soft" />
          <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-sky-200/15 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '-1s' }} />
          
          {/* Subtle horizontal timeline-inspired line */}
          <div className="absolute top-[10%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-300/20 to-transparent" />
          <div className="absolute top-[50%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-300/20 to-transparent" />
        </>
      )}

      {variant === 'report' && (
        <>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-emerald-50/40 via-transparent to-primary-50/30" />
          <NeuralNodePattern className="opacity-60" />
          <div className="absolute top-[20%] left-[20%] w-[20%] h-[20%] bg-emerald-200/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-indigo-200/15 rounded-full blur-[100px]" />
        </>
      )}

      {(variant === 'dashboard' || variant === 'history') && (
        <>
          <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[50%] bg-primary-100/30 rounded-full blur-[120px] animate-orbit-slow" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[40%] bg-sky-100/30 rounded-full blur-[100px] animate-orbit-slow" style={{ animationDirection: 'reverse', animationDuration: '25s' }} />
          
          {/* Subtle mesh background */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </>
      )}
    </div>
  );
};
