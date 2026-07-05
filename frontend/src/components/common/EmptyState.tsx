import React from 'react';
import { BookOpen } from 'lucide-react';

export const EmptyState: React.FC<{ title: string, description: string, icon?: React.ReactNode }> = ({ 
  title, 
  description, 
  icon = <BookOpen className="w-12 h-12 text-slate-300" />
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-slate-200 border-dashed">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-slate-500 max-w-sm">{description}</p>
    </div>
  );
};
