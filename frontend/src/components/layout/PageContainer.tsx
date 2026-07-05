import React from 'react';
import { Navbar } from './Navbar';

export const PageContainer: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className={`flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
        {children}
      </main>
    </div>
  );
};
