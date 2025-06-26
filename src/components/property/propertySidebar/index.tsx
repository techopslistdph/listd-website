'use client';
import React from 'react';

import { useUrlParams } from '@/hooks/useUrlParams';
import { useRouter } from 'nextjs-toploader/app';
import {
  BATHROOM_OPTIONS,
  BEDROOM_OPTIONS,
  PARKING_OPTIONS,
  PROPERTY_TYPES_WITH_BEDROOM_FILTER,
  PROPERTY_TYPES_WITH_PARKING_FILTER,
} from './types';
import { RangeSlider } from './RangeSlider';
import { InputFilter } from './InputFilter';
import { SelectFilter } from './SelectFilter';
import { NumberFilter } from './NumberFilter';
import Button from '@/components/common/Button';

const PropertySidebar = () => {
  const router = useRouter();
  const { getParam, updateParams, deleteParams } = useUrlParams();
  const propertyType = getParam('property');
  const activeBedrooms = getParam('minBedrooms') || getParam('maxBedrooms');
  const activeBathrooms = getParam('minBathrooms') || getParam('maxBathrooms');

  const showBedroomBathroomFilters =
    PROPERTY_TYPES_WITH_BEDROOM_FILTER.includes(propertyType || '');
  const showParkingFilters = PROPERTY_TYPES_WITH_PARKING_FILTER.includes(
    propertyType || ''
  );

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

  const handleParkingChange = (parking: string) => {
    console.log({ parking });
    /**
     * Todo: Implement parking filter
     */
  };

  const handleApplyFilters = () => {
    /**
     * Todo: Implement apply filters
     */
  };

  const handleResetFilters = () => {
    const params = deleteParams([
      'minBedrooms',
      'maxBedrooms',
      'minBathrooms',
      'maxBathrooms',
      'minPrice',
      'maxPrice',
      'minFloorArea',
      'maxFloorArea',
      'latitude',
      'longitude',
      'radius',
      'minLatitude',
      'maxLatitude',
      'minLongitude',
      'maxLongitude',
    ]);
    router.push(`/property?${params}`);
  };

  return (
    <aside className='pt-5 flex flex-col lg:max-w-74 xl:max-w-85 gap-6 lg:sticky top-5 bottom-10 h-fit border border-neutral-mid rounded-2xl p-5'>
      {showBedroomBathroomFilters && (
        <>
          <NumberFilter
            label='Bedrooms'
            options={BEDROOM_OPTIONS}
            activeValue={activeBedrooms || ''}
            onChange={handleBedroomChange}
          />

          <NumberFilter
            label='Bathrooms'
            options={BATHROOM_OPTIONS}
            activeValue={activeBathrooms || ''}
            onChange={handleBathroomChange}
          />
        </>
      )}

      {showParkingFilters && (
        <NumberFilter
          label='Parking'
          options={PARKING_OPTIONS}
          activeValue={''}
          onChange={handleParkingChange}
        />
      )}

      <RangeSlider />
      <InputFilter />
      <SelectFilter />

      <div className='flex flex-col xl:flex-row gap-2'>
        <Button className='flex px-4 justify-center' onClick={handleApplyFilters}>
          Apply Filters
        </Button>
        <Button
          variant='outlined'
          className='flex px-4 justify-center'
          onClick={handleResetFilters}
        >
          Reset Filters
        </Button>
      </div>
    </aside>
  );
};

export default PropertySidebar;
