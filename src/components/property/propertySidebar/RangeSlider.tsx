'use client';

import { useEffect, useState } from 'react';
import { Slider } from '../../ui/slider';
import { PriceRangeResponse } from '@/lib/queries/server/propety/type';

interface RangeSliderProps {
  priceRanges: PriceRangeResponse;
  minPrice?: number;
  maxPrice?: number;
  onPriceRangeChange: (min: number, max: number) => void;
}

function formatPrice(value: string | number): string {
  const num = Number(value);
  if (isNaN(num)) return '0';

  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  return num.toFixed(2);
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


  useEffect(() => {
    setPriceRange([minPrice || minPriceRange, maxPrice || maxPriceRange]);
  }, [minPrice, maxPrice, minPriceRange, maxPriceRange]);

  

  const handlePriceRangeSliderChange = (values: number[]) => {
    setPriceRange(values);
    onPriceRangeChange(values[0], values[1]);
  };

  return (
    <div>
      <div className='font-bold text-xl mb-3'>Price Range</div>
      <div className='flex flex-col gap-4'>
        <Slider
          min={minPriceRange}
          max={maxPriceRange}
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
