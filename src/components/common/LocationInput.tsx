import { useDebounce } from '@/hooks/useDebounce';
import { BuildingSuggestion } from '@/lib/queries/hooks/types/building';
import { useBuildingSuggestions } from '@/lib/queries/hooks/use-building';
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';

export default function LocationInput({
  setLocation,
}: {
  setLocation: (
    location: {
      city: string;
      barangay: string;
      province: string;
    } | null
  ) => void;
}) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<BuildingSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debouncedInput = useDebounce(inputValue, 300);

  const { data: buildingSuggestions, isLoading } =
    useBuildingSuggestions(debouncedInput);

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
    console.log(suggestion);
    // Pass the coordinates object instead of just the string
    setLocation({
      barangay: suggestion.addressComponents.barangay,
      city: suggestion.addressComponents.city,
      province: suggestion.addressComponents.province,
    });
    setInputValue(suggestion.address);
    setShowSuggestions(false);
  };
  return (
    <div className='relative'>
      <Input
        // value={inputValue}
        onChange={e => {
          setInputValue(e.target.value);
        }}
        value={inputValue}
        placeholder='Search for Location'
        className='mb-2 px-6 py-5 text-sm lg:text-base'
      />
      {isLoading && (
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
              <div className='font-medium'>{suggestion.buildingName}</div>
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
