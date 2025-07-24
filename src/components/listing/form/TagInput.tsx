import { Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useState, useEffect, useRef } from 'react';

interface TagInputProps {
  label: string;
  value: Array<{ value: string; label: string }>;
  onChange: (value: Array<{ value: string; label: string }>) => void;
  placeholder: string;
  defaultOptions?: Array<{ value: string; label: string }>;
  error: string;
}

export function TagInput({
  label,
  value = [],
  onChange,
  placeholder,
  defaultOptions,
  error = '',
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter suggestions based on input value
    if (defaultOptions && inputValue.trim()) {
      const filtered = defaultOptions.filter(option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, defaultOptions]);

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newValue = inputValue.trim();

      // Check if the input matches any default option
      const matchingOption = defaultOptions?.find(
        option =>
          option.label.toLowerCase() === newValue.toLowerCase() ||
          option.value.toLowerCase() === newValue.toLowerCase()
      );

      if (
        matchingOption &&
        !value.some(item => item.value === matchingOption.value)
      ) {
        onChange([...value, matchingOption]);
      } else if (
        !matchingOption &&
        !value.some(item => item.value === newValue)
      ) {
        // If no match found, add the raw input as a fallback
        onChange([...value, { value: newValue, label: newValue }]);
      }

      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (suggestion: {
    value: string;
    label: string;
  }) => {
    if (!value.some(item => item.value === suggestion.value)) {
      onChange([...value, suggestion]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  return (
    <div className='space-y-4'>
      <Label>{label}</Label>
      <div className='relative'>
        <div
          className={`flex items-center bg-gray-50 rounded-full px-4 py-2 w-full ${error ? 'border border-red-500' : ''}`}
        >
          <div className='flex flex-wrap gap-2'>
            {value.map((item, i) => (
              <span
                key={i}
                className='bg-primary-light text-primary-mid px-2 py-1 rounded-xl text-xs sm:text-sm flex items-center font-normal'
              >
                {item.label}
                <button
                  className='ml-2 text-primary-mid hover:text-primary-main focus:outline-none'
                  onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <input
            className='flex-1 bg-transparent placeholder:text-sm lg:placeholder:text-base text-sm lg:text-base outline-none border-none px-2'
            placeholder={placeholder}
            onKeyDown={handleTagInput}
            onChange={handleInputChange}
            value={inputValue}
            style={{ minWidth: 0 }}
          />
          <Search className='ml-4 w-4 h-4 md:w-6 md:h-6 text-black' />
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className='absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto'
          >
            {suggestions.map(suggestion => (
              <div
                key={suggestion.value}
                className='px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm'
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.label}
              </div>
            ))}
          </div>
        )}
        {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
      </div>
    </div>
  );
}
