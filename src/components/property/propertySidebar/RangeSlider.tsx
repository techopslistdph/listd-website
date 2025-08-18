'use client';

import { useEffect, useState } from 'react';
import { Slider } from '../../ui/slider';
import { PriceRangeResponse } from '@/lib/queries/server/propety/type';
import { formatPrice } from '@/utils/formatPriceUtils';
import { calculateDynamicStep } from '@/utils/numberUtils';

interface RangeSliderProps {
  priceRanges: PriceRangeResponse;
  minPrice?: number;
  maxPrice?: number;
  onPriceRangeChange: (min: number, max: number) => void;
}

export const RangeSlider = ({
  priceRanges,
  minPrice = priceRanges.data?.minPrice,
  maxPrice = priceRanges.data?.maxPrice,
  onPriceRangeChange,
}: RangeSliderProps) => {
  const minPriceRange = priceRanges.data?.minPrice || 0;
  const maxPriceRange = priceRanges.data?.maxPrice || 0;

  const [priceRange, setPriceRange] = useState([
    minPrice || minPriceRange,
    maxPrice || maxPriceRange,
  ]);
  const [isMinFocused, setIsMinFocused] = useState(false);
  const [isMaxFocused, setIsMaxFocused] = useState(false);

  // Calculate dynamic step based on the maximum price range
  const dynamicStep = calculateDynamicStep(maxPriceRange);

  useEffect(() => {
    setPriceRange([minPrice || minPriceRange, maxPrice || maxPriceRange]);
  }, [minPrice, maxPrice, minPriceRange, maxPriceRange]);

  const handlePriceRangeSliderChange = (values: number[]) => {
    setPriceRange(values);
    onPriceRangeChange(values[0], values[1]);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    const numValue = rawValue ? parseInt(rawValue, 10) : minPriceRange;

    // Allow typing without validation - just update the field being typed
    if (!isNaN(numValue)) {
      setPriceRange([numValue, priceRange[1]]);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    const numValue = rawValue ? parseInt(rawValue, 10) : maxPriceRange;

    // Allow typing without validation - just update the field being typed
    if (!isNaN(numValue)) {
      setPriceRange([priceRange[0], numValue]);
    }
  };

  const handleMinPriceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
    const validatedValue = Math.max(
      minPriceRange,
      Math.min(value || minPriceRange, maxPriceRange)
    );
    const newRange = [validatedValue, Math.max(validatedValue, priceRange[1])];
    setPriceRange(newRange);
    onPriceRangeChange(newRange[0], newRange[1]);
    setIsMinFocused(false);
  };

  const handleMaxPriceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
    const validatedValue = Math.min(value || maxPriceRange, maxPriceRange);
    const newRange = [Math.min(validatedValue, priceRange[0]), validatedValue];
    setPriceRange(newRange);
    onPriceRangeChange(newRange[0], newRange[1]);
    setIsMaxFocused(false);
  };

  return (
    <div>
      <div className='font-bold text-lg mb-3'>Price Range</div>
      <div className='flex flex-col gap-4'>
        <Slider
          min={minPriceRange}
          max={maxPriceRange}
          step={dynamicStep}
          value={priceRange}
          onValueChange={handlePriceRangeSliderChange}
        />
        <div className='flex xl:flex-nowrap justify-center mt-2 gap-2'>
          <input
            type='text'
            value={
              isMinFocused
                ? priceRange[0].toString()
                : formatPrice(priceRange[0].toString())
            }
            onChange={handleMinPriceChange}
            onBlur={handleMinPriceBlur}
            onFocus={() => setIsMinFocused(true)}
            className='lg:w-full bg-neutral-light rounded-full px-4 py-2 text-sm font-medium w-1/4 flex items-center justify-center text-center border border-transparent focus:border-primary focus:outline-none'
          />
          <span className='mx-1 text-2xl font-bold'>-</span>
          <input
            type='text'
            value={
              isMaxFocused
                ? priceRange[1].toString()
                : formatPrice(priceRange[1].toString())
            }
            onChange={handleMaxPriceChange}
            onBlur={handleMaxPriceBlur}
            onFocus={() => setIsMaxFocused(true)}
            className='lg:w-full bg-neutral-light rounded-full px-4 py-2 text-sm font-medium w-1/4 flex items-center justify-center text-center border border-transparent focus:border-primary focus:outline-none'
          />
        </div>
      </div>
    </div>
  );
};
