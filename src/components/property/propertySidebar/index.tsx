'use client';
import React, { useMemo, useState } from 'react';

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
import { usePropertyFilters } from '@/hooks/usePropertyFilters';
import { MultiSelectOption } from '@/components/ui/multi-select';
import { useAmenitiesAndFeatures } from '@/lib/queries/hooks/use-amenities';

const PropertySidebar = () => {
  const router = useRouter();
  const { getParam, updateParams, deleteParams } = useUrlParams();
  const { 
    filters, 
    hasChanges, 
    updateFilter, 
    updateMultipleFilters, 
    resetFilters, 
    getApplicableFilters 
  } = usePropertyFilters();

  const { data, isLoading } = useAmenitiesAndFeatures()
  const [amenities, features] = data || []
  

  const amenitiesOptions: MultiSelectOption[] = useMemo(() => {
    if (!amenities?.data?.data.length) return []
    return amenities.data.data.map(amenity => ({
      label: amenity.name,
      value: amenity.id,
    }))
  }, [amenities])

  const featuresOptions: MultiSelectOption[] = useMemo(() => {
    if (!features?.data?.data.length) return []
    return features.data.data.map(feature => ({
      label: feature.name,
      value: feature.id,
    }))
  }, [features])

  
  const [isApplying, setIsApplying] = useState(false);
  
  const propertyType = getParam('property');

  const showBedroomBathroomFilters =
    PROPERTY_TYPES_WITH_BEDROOM_FILTER.includes(propertyType || '');
    
  const showParkingFilters = PROPERTY_TYPES_WITH_PARKING_FILTER.includes(
    propertyType || ''
  );

  const handleBedroomChange = (bedrooms: string) => {
    if (bedrooms === BEDROOM_OPTIONS[BEDROOM_OPTIONS.length - 1].value) {
      updateMultipleFilters({
        maxBedrooms: undefined,
        minBedrooms: bedrooms,
      });
      return;
    }

    updateMultipleFilters({
      minBedrooms: bedrooms,
      maxBedrooms: bedrooms,
    });
  };

  const handleBathroomChange = (bathroom: string) => {
    if (bathroom === BATHROOM_OPTIONS[BATHROOM_OPTIONS.length - 1].value) {
      updateMultipleFilters({
        maxBathrooms: undefined,
        minBathrooms: bathroom,
      });
      return;
    }

    updateMultipleFilters({
      minBathrooms: bathroom,
      maxBathrooms: bathroom,
    });
  };

  const handleParkingChange = (parking: string) => {
    if (parking === PARKING_OPTIONS[PARKING_OPTIONS.length - 1].value) {
      updateMultipleFilters({
        maxParking: undefined,
        minParking: parking,
      });
      return;
    }

    updateMultipleFilters({
      minParking: parking,
      maxParking: parking,
    });
  };

  const handleApplyFilters = async () => {
    setIsApplying(true);
    try {
      const applicableFilters = getApplicableFilters();
      const params = updateParams(applicableFilters);
      router.push(`/property?${params}`);
    } finally {
      setIsApplying(false);
    }
  };

  const handleResetFilters = async () => {
    setIsApplying(true);
    try {
      resetFilters();
      const params = deleteParams([
        'minBedrooms',
        'maxBedrooms',
        'minBathrooms',
        'maxBathrooms',
        'minParking',
        'maxParking',
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
        'amenityIds',
        'featureIds',
      ]);
      router.push(`/property?${params}`);
    } finally {
      setIsApplying(false);
    }
  };

  const getActiveBedroomValue = () => {
    if (filters.minBedrooms && filters.maxBedrooms) {
      return filters.minBedrooms === filters.maxBedrooms ? filters.minBedrooms : filters.minBedrooms;
    }
    return filters.minBedrooms || filters.maxBedrooms || '';
  };

  const getActiveBathroomValue = () => {
    if (filters.minBathrooms && filters.maxBathrooms) {
      return filters.minBathrooms === filters.maxBathrooms ? filters.minBathrooms : filters.minBathrooms;
    }
    return filters.minBathrooms || filters.maxBathrooms || '';
  };

  const getActiveParkingValue = () => {
    if (filters.minParking && filters.maxParking) {
      return filters.minParking === filters.maxParking ? filters.minParking : filters.minParking;
    }
    return filters.minParking || filters.maxParking || '';
  };

  return (
    <aside className='pt-5 flex flex-col lg:max-w-74 xl:max-w-85 gap-6 lg:sticky top-5 bottom-10 h-fit border border-neutral-mid rounded-2xl p-5'>
      {showBedroomBathroomFilters && (
        <>
          <NumberFilter
            label='Bedrooms'
            options={BEDROOM_OPTIONS}
            activeValue={getActiveBedroomValue()}
            onChange={handleBedroomChange}
          />

          <NumberFilter
            label='Bathrooms'
            options={BATHROOM_OPTIONS}
            activeValue={getActiveBathroomValue()}
            onChange={handleBathroomChange}
          />
        </>
      )}

      {showParkingFilters && (
        <NumberFilter
          label='Parking'
          options={PARKING_OPTIONS}
          activeValue={getActiveParkingValue()}
          onChange={handleParkingChange}
        />
      )}

      <RangeSlider 
        minPrice={Number(filters.minPrice) || 0}
        maxPrice={Number(filters.maxPrice) || 10000000}
        onPriceRangeChange={(min, max) => {
          updateMultipleFilters({
            minPrice: min.toString(),
            maxPrice: max.toString(),
          });
        }}
      />
      
      <InputFilter 
        minFloorArea={filters.minFloorArea || ''}
        maxFloorArea={filters.maxFloorArea || ''}
        onFloorAreaChange={(min, max) => {
          updateMultipleFilters({
            minFloorArea: min || undefined,
            maxFloorArea: max || undefined,
          });
        }}
      />
      
      <SelectFilter 
        placeholder='Amenities'
        options={amenitiesOptions}
        isLoading={isLoading}
        selectedFeatures={filters.amenityIds || []}
        onFeaturesChange={(amenities) => {
          updateFilter('amenityIds', amenities);
        }}
      />

      <SelectFilter 
        placeholder='Features'
        options={featuresOptions}
        isLoading={isLoading}
        selectedFeatures={filters.featureIds || []}
        onFeaturesChange={(features) => {
          updateFilter('featureIds', features);
        }}
      />
      

      <div className='flex flex-col xl:flex-row gap-2'>
        <Button 
          className={`flex px-4 justify-center relative ${hasChanges ? 'bg-primary-main' : ''}`}
          onClick={handleApplyFilters}
          disabled={isApplying}
        >
          {isApplying ? 'Applying...' : 'Apply Filters'}
          {hasChanges && (
            <span className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full'></span>
          )}
        </Button>
        <Button
          variant='outlined'
          className='flex px-4 justify-center'
          onClick={handleResetFilters}
          disabled={isApplying}
        >
          {isApplying ? 'Resetting...' : 'Reset Filters'}
        </Button>
      </div>
    </aside>
  );
};

export default PropertySidebar;
