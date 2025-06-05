'use client';

import { useEffect, useState } from 'react';
import { Slider } from '../../ui/slider';
import { useUrlParams } from '@/hooks/useUrlParams';
import { useDebounce } from '@/hooks/useDebounce';
import { useRouter } from 'next-nprogress-bar';

function formatPrice(value: string) {
  const num = Number(value);
  if (num >= 1000000) return `${num / 1000000}M`;
  if (num >= 1000) return `${num / 1000}K`;
  return num;
}

export const RangeSlider = () => {
  const router = useRouter();
  const { getParam, updateParams } = useUrlParams();

  const minPrice = Number(getParam('minPrice')) || 0;
  const maxPrice = Number(getParam('maxPrice')) || 10000000;
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  const debouncedPriceRange = useDebounce(priceRange, 300);

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    const [min, max] = debouncedPriceRange;
    if (min !== minPrice || max !== maxPrice) {
      const params = updateParams({
        minPrice: min.toString(),
        maxPrice: max.toString(),
      });
      router.push(`/property?${params}`);
    }
  }, [debouncedPriceRange, minPrice, maxPrice, updateParams, router]);

  const handlePriceRangeSliderChange = (values: number[]) => {
    setPriceRange(values);
  };

  return (
    <div>
      <div className='font-bold text-xl mb-3'>Price Range</div>
      <div className='flex flex-col gap-4'>
        <Slider
          min={0}
          max={10000000}
          step={500000}
          value={priceRange}
          onValueChange={handlePriceRangeSliderChange}
        />
        <div className='flex items-center justify-between mt-2'>
          <div className='bg-neutral-light rounded-full px-8 py-2 text-sm font-medium w-36 flex items-center justify-center'>
            {formatPrice(priceRange[0].toString())}
          </div>
          <span className='mx-2 text-2xl font-bold'>-</span>
          <div className='bg-neutral-light rounded-full px-8 py-2 text-sm font-medium w-36 flex items-center justify-center'>
            {formatPrice(priceRange[1].toString())}
          </div>
        </div>
      </div>
    </div>
  );
};
