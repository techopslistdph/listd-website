'use client';
import React, { useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { properties } from '@/app/data';
import { Slider } from '../../ui/slider';
import { useUrlParams } from '@/hooks/useUrlParams';
import { useRouter } from 'next/navigation';
import {
  BATHROOM_OPTIONS,
  BEDROOM_OPTIONS,
  PROPERTY_TYPES_WITH_BEDROOM_FILTER,
  PROPERTY_TYPES_WITH_PARKING_FILTER,
} from './types';

function formatPrice(value: string) {
  const num = Number(value);
  if (num >= 1000000) return `${num / 1000000}M`;
  if (num >= 1000) return `${num / 1000}K`;
  return num;
}

const PropertySidebar = () => {
  const { getParam, updateParams } = useUrlParams();
  const propertyType = getParam('property');
  const router = useRouter();
  const activeBedrooms = getParam('minBedrooms') || getParam('maxBedrooms');
  const activeBathrooms = getParam('minBathrooms') || getParam('maxBathrooms');
  const showBedroomBathroomFilters =
    PROPERTY_TYPES_WITH_BEDROOM_FILTER.includes(propertyType || '');
  const showParkingFilters = PROPERTY_TYPES_WITH_PARKING_FILTER.includes(
    propertyType || ''
  );

  // Get unique features from all properties
  const uniqueFeatures = useMemo(() => {
    const featuresSet = new Set<string>();
    properties.forEach(property => {
      property.features.forEach(feature => {
        featuresSet.add(feature);
      });
    });
    return Array.from(featuresSet).sort();
  }, []);

  const handleBedroomChange = (bedrooms: string) => {

    if (bedrooms === BEDROOM_OPTIONS[BEDROOM_OPTIONS.length - 1].value) {
      const params = updateParams({
        maxBedrooms: null,
        minBedrooms: bedrooms,
      });
      router.push(`/property?${params}`);
      return;
    }

    const params = updateParams({
      minBedrooms: bedrooms,
      maxBedrooms: bedrooms,
    });
    router.push(`/property?${params}`);
  };

  const handleBathroomChange = (bathroom: string) => {
    if (bathroom === BATHROOM_OPTIONS[BATHROOM_OPTIONS.length - 1].value) {
      const params = updateParams({
        maxBathrooms: null,
        minBathrooms: bathroom,
      });
      router.push(`/property?${params}`);
      return;
    }

    const params = updateParams({
      minBathrooms: bathroom,
      maxBathrooms: bathroom,
    });
    router.push(`/property?${params}`);
  };

  const handleParkingChange = (parking: number | string) => {
    console.log({ parking });
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
    console.log({ type, value });
  };

  const handleSquareFeetChange = (type: 'min' | 'max', value: string) => {
    console.log({ type, value });
  };

  const handleFeatureChange = (feature: string) => {
    console.log({ feature });
  };

  const handleApplyFilters = () => {
    console.log('apply filters');
  };

  const handleResetFilters = () => {
    console.log('reset filters');
  };

  return (
    <aside className='sm:max-w-80 pt-5 flex flex-col gap-6 sm:sticky top-5 bottom-10 h-fit border border-neutral-mid rounded-2xl p-5'>
      {/* <div>
        <div className='font-bold text-xl mb-3'>Property</div>
        <div className='flex flex-col gap-2'>
          {['Condominium', 'Warehouse', 'House and Lot', 'Land'].map((type) => (
            <label key={type} className='flex items-center gap-2'>
              <input
                type='checkbox'
                className='accent-primary-main'
                checked={filters.propertyTypes.includes(type)}
                onChange={() => handlePropertyTypeChange(type)}
              />
              {type}
            </label>
          ))}
        </div>
      </div> */}

      {showBedroomBathroomFilters && (
        <>
          <div>
            <div className='font-bold text-xl mb-3'>Bedrooms</div>
            <div className='flex gap-2 flex-wrap'>
              {BEDROOM_OPTIONS.map(option => (
                <button
                  key={option.value}
                  className={`border border-primary-main cursor-pointer text-primary-main rounded-full px-3 py-1 text-sm font-medium ${
                    activeBedrooms === option.value
                      ? 'bg-primary-main text-white'
                      : ''
                  }`}
                  onClick={() => handleBedroomChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className='font-bold text-xl mb-3'>Bathrooms</div>
            <div className='flex gap-2 flex-wrap'>
              {BATHROOM_OPTIONS.map(option => (
                <button
                  key={option.value}
                  className={`border border-primary-main cursor-pointer text-primary-main rounded-full px-3 py-1 text-sm font-medium ${
                    activeBathrooms === option.value
                      ? 'bg-primary-main text-white'
                      : ''
                  }`}
                  onClick={() => handleBathroomChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {showParkingFilters && (
        <div>
          <div className='font-bold text-xl mb-3'>Parking</div>
          <div className='flex gap-2 flex-wrap'>
            {[1, 2, 3, '4+'].map(label => (
              <button
                key={label}
                className={`border border-primary-main cursor-pointer text-primary-main rounded-full px-3 py-1 text-sm font-medium ${
                  true ? 'bg-primary-main text-white' : ''
                }`}
                onClick={() => handleParkingChange(label)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className='font-bold text-xl mb-3'>Price Range</div>
        <div className='flex flex-col gap-4'>
          <Slider
            min={0}
            max={10000000}
            step={500000}
            value={[500000, 4000000]}
            onValueChange={([min, max]) => {
              handlePriceRangeChange('min', String(min));
              handlePriceRangeChange('max', String(max));
            }}
          />
          <div className='flex items-center justify-between mt-2'>
            <div className='bg-neutral-light rounded-full px-8 py-2 text-sm font-medium w-36 flex items-center justify-center'>
              {formatPrice('500000')}
            </div>
            <span className='mx-2 text-2xl font-bold'>-</span>
            <div className='bg-neutral-light rounded-full px-8 py-2 text-sm font-medium w-36 flex items-center justify-center'>
              {formatPrice('4000000')}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className='font-bold text-xl mb-3'>Square Meter</div>
        <div className='flex flex-col gap-2'>
          <input
            type='text'
            placeholder='Minimum'
            className='rounded-full focus:outline-none px-4 py-3 bg-neutral-light'
            value={'500000'}
            onChange={e => handleSquareFeetChange('min', e.target.value)}
          />
          <input
            type='text'
            placeholder='Maximum'
            className='rounded-full focus:outline-none px-4 py-3 bg-neutral-light'
            value={'4000000'}
            onChange={e => handleSquareFeetChange('max', e.target.value)}
          />
        </div>
      </div>

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

      <div className='flex gap-2'>
        <button
          className='bg-primary-main text-white rounded-full px-4 py-2 cursor-pointer hover:bg-primary-main/80'
          onClick={handleApplyFilters}
        >
          Apply Filters
        </button>
        <button
          className='border border-primary-main text-primary-main rounded-full px-4 py-2 cursor-pointer hover:bg-primary-main/10'
          onClick={handleResetFilters}
        >
          Reset Filters
        </button>
      </div>
    </aside>
  );
};

export default PropertySidebar;
