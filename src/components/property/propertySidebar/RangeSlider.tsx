'use client';

import { useEffect, useState } from 'react';
import { Slider } from '../../ui/slider';
import { useDebounce } from '@/hooks/useDebounce';

interface RangeSliderProps {
  minPrice: number;
  maxPrice: number;
  onPriceRangeChange: (min: number, max: number) => void;
}

function formatPrice(value: string) {
  const num = Number(value);
  if (num >= 1000000) return `${num / 1000000}M`;
  if (num >= 1000) return `${num / 1000}K`;
  return num;
}

export const RangeSlider = ({
  minPrice,
  maxPrice,
  onPriceRangeChange,
}: RangeSliderProps) => {
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const debouncedPriceRange = useDebounce(priceRange, 300);

  /**
   * Update local state when props change
   */
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  /**
   * Call parent callback when debounced values change
   */
  useEffect(() => {
    const [min, max] = debouncedPriceRange;
    if (min !== minPrice || max !== maxPrice) {
      onPriceRangeChange(min, max);
    }
  }, [debouncedPriceRange, minPrice, maxPrice, onPriceRangeChange]);

  const handlePriceRangeSliderChange = (values: number[]) => {
    setPriceRange(values);
  };

  return (
    <div>
      <div className='font-bold text-lg mb-3'>Price Range</div>
      <div className='flex flex-col gap-4'>
        <Slider
          min={0}
          max={10000000}
          step={500000}
          value={priceRange}
          onValueChange={handlePriceRangeSliderChange}
        />
        <div className='flex xl:flex-nowrap justify-center mt-2'>
          <div className='lg:w-full bg-neutral-light rounded-full px-8 py-2 text-sm font-medium w-1/4 flex items-center justify-center'>
            {formatPrice(priceRange[0].toString())}
          </div>
          <span className='mx-2 text-2xl font-bold'>-</span>
          <div className='lg:w-full bg-neutral-light rounded-full px-8 py-2 text-sm font-medium w-1/4 flex items-center justify-center'>
            {formatPrice(priceRange[1].toString())}
          </div>
        </div>
      </div>
    </div>
  );
};
