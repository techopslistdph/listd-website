import { useDebounce } from '@/hooks/useDebounce';
import { BuildingSuggestion } from '@/lib/queries/hooks/types/building';
import { useAddressSuggestions } from '@/lib/queries/hooks/use-building';
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';

interface LocationInputProps {
  setLocation: (
    location: {
      city: string;
      barangay: string;
      province: string;
      region: string;
    } | null
  ) => void;
  placeholder?: string;
  onPropertySearch?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  initialLocationValue?: string;
}

export default function LocationInput({
  setLocation,
  placeholder = 'Search for Location',
  onPropertySearch,
  searchValue,
  onSearchChange,
  initialLocationValue,
}: LocationInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<BuildingSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(true);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debouncedInput = useDebounce(inputValue, 300);

  const { data: buildingSuggestions, isLoading } =
    useAddressSuggestions(debouncedInput);

  // Initialize input value based on search value or location value
  useEffect(() => {
    if (searchValue && searchValue.trim()) {
      setInputValue(searchValue);
      setIsUserTyping(false); // Don't show loading for initial value
    } else if (initialLocationValue && initialLocationValue.trim()) {
      setInputValue(initialLocationValue);
      setIsUserTyping(false); // Don't show loading for initial value
    } else {
      setInputValue('');
      setIsUserTyping(true);
    }
  }, [searchValue, initialLocationValue]);

  // add loading when fetching suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedInput.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      try {
        setSuggestions(
          (buildingSuggestions?.data as unknown as BuildingSuggestion[]) || []
        );
        setShowSuggestions(
          (buildingSuggestions?.data as unknown as BuildingSuggestion[])
            ?.length > 0
        );
      } catch (error) {
        console.error('Error fetching building suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [buildingSuggestions, debouncedInput]);

  useEffect(() => {
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

  const handleSuggestionClick = async (suggestion: BuildingSuggestion) => {
    // Pass the location object to the parent component
    setLocation({
      barangay: suggestion.addressComponents.barangay,
      city: suggestion.addressComponents.city,
      province: suggestion.addressComponents.province,
      region: suggestion.addressComponents.region,
    });
    setInputValue(`${suggestion.formattedAddress}`);
    setShowSuggestions(false);
    setIsUserTyping(false); // Prevent loading state after selection
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsUserTyping(true);

    // Call parent's search change handler if provided
    if (onSearchChange) {
      onSearchChange(e);
    }

    // Clear location when user starts typing
    if (value.trim().length === 0) {
      setLocation(null);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // If there are suggestions, don't trigger property search
      if (suggestions.length > 0) {
        return;
      }

      // If user presses Enter without selecting a suggestion, trigger property search
      if (inputValue.trim().length > 0 && onPropertySearch) {
        onPropertySearch(e);
      }
    }
  };

  return (
    <div className='relative w-full'>
      <Input
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        value={inputValue}
        placeholder={placeholder}
        className='py-5 text-sm lg:text-base bg-neutral-light shadow-none border-none outline-none pr-12'
      />
      {isLoading && isUserTyping && (
        <div className='absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto'>
          <div className='flex gap-5 px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm'>
            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900'></div>
            <p> Loading...</p>
          </div>
        </div>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className='absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto'
        >
          {suggestions.map(suggestion => (
            <div
              key={suggestion.placeId}
              className='px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm'
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className='font-medium'>{suggestion.address}</div>
              <div className='text-gray-500 text-xs'>
                {suggestion.formattedAddress}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
