import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMemo, useState } from 'react';

interface SelectFilterProps {
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
}

/**
 * Mock features data - in a real app, this would come from an API
 */
const AVAILABLE_FEATURES = [
  'Swimming Pool',
  'Gym',
  'Parking',
  'Security',
  'Garden',
  'Balcony',
  'Air Conditioning',
  'Furnished',
  'Pet Friendly',
  'Near Mall',
  'Near School',
  'Near Hospital',
];

export const SelectFilter = ({ selectedFeatures, onFeaturesChange }: SelectFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFeatureToggle = (feature: string) => {
    const isSelected = selectedFeatures.includes(feature);
    let newFeatures: string[];
    
    if (isSelected) {
      newFeatures = selectedFeatures.filter(f => f !== feature);
    } else {
      newFeatures = [...selectedFeatures, feature];
    }
    
    onFeaturesChange(newFeatures);
  };

  const displayValue = useMemo(() => {
    if (selectedFeatures.length === 0) return '';
    if (selectedFeatures.length === 1) return selectedFeatures[0];
    return `${selectedFeatures.length} features selected`;
  }, [selectedFeatures]);

  return (
    <div>
      <div className='font-bold text-xl mb-3'>Features & Amenities</div>
      <Select open={isOpen} onOpenChange={setIsOpen} value={displayValue}>
        <SelectTrigger className='rounded-full focus:outline-none text-base px-4 py-6 bg-neutral-light w-full'>
          <SelectValue placeholder='Select features & amenities' />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_FEATURES.map(feature => {
            const isSelected = selectedFeatures.includes(feature);
            return (
              <SelectItem 
                key={feature} 
                value={feature}
                onSelect={(e) => {
                  e.preventDefault();
                  handleFeatureToggle(feature);
                }}
                className={`cursor-pointer ${isSelected ? 'bg-primary-light text-primary-dark' : ''}`}
              >
                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={isSelected}
                    onChange={() => handleFeatureToggle(feature)}
                    className='rounded'
                  />
                  {feature}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      
      {selectedFeatures.length > 0 && (
        <div className='mt-2 flex flex-wrap gap-1'>
          {selectedFeatures.map(feature => (
            <span
              key={feature}
              className='inline-flex items-center gap-1 px-2 py-1 bg-primary-light text-primary-dark text-xs rounded-full'
            >
              {feature}
              <button
                onClick={() => handleFeatureToggle(feature)}
                className='hover:bg-primary-main hover:text-white rounded-full w-4 h-4 flex items-center justify-center'
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
