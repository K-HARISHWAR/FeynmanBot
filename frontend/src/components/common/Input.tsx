import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`input-field ${error ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-rose-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
