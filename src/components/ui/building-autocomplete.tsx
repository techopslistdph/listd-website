import { useState, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useBuildingSuggestions } from '@/lib/queries/hooks/use-building';
import { BuildingSuggestion } from '@/lib/queries/hooks/types/building';

interface BuildingAutocompleteProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export function BuildingAutocomplete({
  name,
  label,
  placeholder,
  required = true,
}: BuildingAutocompleteProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<BuildingSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const form = useFormContext();
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
  }, [buildingSuggestions]);

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
    form.setValue(name, suggestion.buildingName, { shouldValidate: true });
    setInputValue(suggestion.formattedAddress);
    setShowSuggestions(false);
    try {
      if (suggestion.addressComponents) {
        const addressComponent = suggestion.addressComponents;
        const street = addressComponent.route;
        const barangay = addressComponent.barangay;
        const city = addressComponent.city;

        const state = addressComponent.region;
        const postalCode = addressComponent.postalCode;

        // Update form fields
        form.setValue('street', street, { shouldValidate: true });
        form.setValue('barangay', barangay, { shouldValidate: true });
        form.setValue('city', city, { shouldValidate: true });
        form.setValue('state', state, { shouldValidate: true });
        form.setValue('longitude', suggestion.coordinates.longitude, {
          shouldValidate: true,
        });
        form.setValue('latitude', suggestion.coordinates.latitude, {
          shouldValidate: true,
        });
        form.setValue('postalCode', postalCode, { shouldValidate: true });
      }
    } catch (error) {
      console.error('Error fetching building details:', error);
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-col w-full'>
          <FormLabel className='text-xs sm:text-sm'>
            {label}
            {required && <span className='text-red-500'>*</span>}
          </FormLabel>
          <FormControl>
            <div className='relative'>
              <Input
                {...field}
                // value={inputValue}
                onChange={e => {
                  setInputValue(e.target.value);
                  field.onChange(e.target.value);
                }}
                placeholder={placeholder}
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
                  {suggestions
                    .filter(
                      suggestion =>
                        suggestion.buildingName &&
                        suggestion.buildingName.trim()
                    )
                    .map(suggestion => (
                      <div
                        key={suggestion.placeId}
                        className='px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm'
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className='font-medium'>
                          {suggestion.buildingName}
                        </div>
                        <div className='text-gray-500 text-xs'>
                          {suggestion.formattedAddress}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
