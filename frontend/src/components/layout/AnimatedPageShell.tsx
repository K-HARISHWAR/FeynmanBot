import React from 'react';
import { AnimatedLearningBackground } from '../background/AnimatedLearningBackground';
import type { BackgroundVariant } from '../background/AnimatedLearningBackground';

interface AnimatedPageShellProps {
  children: React.ReactNode;
  variant: BackgroundVariant;
  className?: string;
}

export const AnimatedPageShell: React.FC<AnimatedPageShellProps> = ({ 
  children, 
  variant,
  className = ''
}) => {
  return (
    <div className={`relative min-h-full ${className}`}>
      <AnimatedLearningBackground variant={variant} />
      {/* We add a small relative container if needed, but since AnimatedLearningBackground is absolute inset-0 with z-[-1], 
          the children will naturally render above it. */}
      {children}
    </div>
  );
};
