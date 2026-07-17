import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Search } from 'lucide-react';

interface AutocompleteInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  quickStartChips?: string[];
  error?: string;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  label,
  value,
  onChange,
  quickStartChips = [],
  error,
  className = '',
  ...props
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce the fetch
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value || value.length < 2) {
        setSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(value)}&limit=5&origin=*&format=json`);
        const data = await res.json();
        // data[1] contains the array of suggested strings
        if (data && data[1]) {
          setSuggestions(data[1]);
          if (data[1].length > 0) setShowDropdown(true);
        }
      } catch (err) {
        console.error("Failed to fetch autocomplete suggestions", err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setShowDropdown(false);
  };

  return (
    <div className="w-full relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>
      
      <div className="relative">
        <input
          className={`input-field pr-10 text-slate-900 dark:text-white bg-white/80 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-600 ${error ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' : ''} ${className}`}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowDropdown(true);
          }}
          {...props}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Dropdown Suggestions */}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white/90 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-60 overflow-auto overflow-x-hidden">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="px-4 py-2 hover:bg-primary-50 dark:hover:bg-slate-700 cursor-pointer text-slate-800 dark:text-slate-200 transition-colors"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      
      {error && <p className="mt-1 text-sm text-rose-500">{error}</p>}

      {/* Quick Start Chips */}
      {quickStartChips.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {quickStartChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onChange(chip);
                setShowDropdown(false);
              }}
              className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full hover:bg-primary-50 dark:hover:bg-slate-700 hover:text-primary-700 dark:hover:text-primary-300 hover:border-primary-200 dark:hover:border-slate-600 transition-all"
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
