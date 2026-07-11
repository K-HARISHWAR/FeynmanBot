import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  colorClass?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  subtitle,
  colorClass = 'text-primary-600 bg-primary-50'
}) => {
  return (
    <div className="glass-card p-5 flex items-start space-x-4 transition-transform hover:-translate-y-1 duration-300">
      {icon && (
        <div className={`p-3 rounded-xl flex-shrink-0 ${colorClass}`}>
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};
