import { properties } from '@/app/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMemo } from 'react';

export const SelectFilter = () => {
  const uniqueFeatures = useMemo(() => {
    const featuresSet = new Set<string>();
    properties.forEach(property => {
      property.features.forEach(feature => {
        featuresSet.add(feature);
      });
    });
    return Array.from(featuresSet).sort();
  }, []);

  const handleFeatureChange = (feature: string) => {
    console.log({ feature });
  };

  return (
    <div>
      <div className='font-bold text-xl mb-3'>Features & Amenities</div>
      <Select
        onValueChange={handleFeatureChange}
        // Todo: fetch features from server
        value={''}
      >
        <SelectTrigger className='rounded-full focus:outline-none text-base px-4 py-6 bg-neutral-light w-full'>
          <SelectValue placeholder='feature & amenities' />
        </SelectTrigger>
        <SelectContent>
          {uniqueFeatures.map(feature => (
            <SelectItem key={feature} value={feature}>
              {feature}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
