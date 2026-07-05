import React, { forwardRef } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`input-field min-h-[120px] resize-y ${error ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-rose-500">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
