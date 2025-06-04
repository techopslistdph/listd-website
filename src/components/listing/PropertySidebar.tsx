'use client';
import React, { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { properties } from '@/app/data';
import { Slider } from '../ui/slider';

interface PropertySidebarProps {
  onFilterChange: (filters: {
    propertyTypes: string[];
    bedrooms: (number | string)[];
    bathrooms: (number | string)[];
    parking: (number | string)[];
    priceRange: { min: string; max: string };
    squareFeet: { min: string; max: string };
    features: string[];
  }) => void;
  initialPropertyType?: string[];
}

interface Filters {
  propertyTypes: string[];
  bedrooms: (number | string)[];
  bathrooms: (number | string)[];
  parking: (number | string)[];
  priceRange: { min: string; max: string };
  squareFeet: { min: string; max: string };
  features: string[];
}

function formatPrice(value: string) {
  const num = Number(value);
  if (num >= 1000000) return `${num / 1000000}M`;
  if (num >= 1000) return `${num / 1000}K`;
  return num;
}

const PropertySidebar = ({
  onFilterChange,
  initialPropertyType = ['Condominium'],
}: PropertySidebarProps) => {
  const [filters, setFilters] = useState<Filters>({
    propertyTypes: initialPropertyType,
    bedrooms: [],
    bathrooms: [],
    parking: [],
    priceRange: { min: '', max: '' },
    squareFeet: { min: '', max: '' },
    features: [],
  });

  // Get unique features from all properties
  const uniqueFeatures = useMemo(() => {
    const featuresSet = new Set<string>();
    properties.forEach((property) => {
      property.features.forEach((feature) => {
        featuresSet.add(feature);
      });
    });
    return Array.from(featuresSet).sort();
  }, []);

  const handleBedroomChange = (bedroom: number | string) => {
    setFilters((prev) => {
      const updated = prev.bedrooms.includes(bedroom)
        ? prev.bedrooms.filter((b) => b !== bedroom)
        : [...prev.bedrooms, bedroom];
      return { ...prev, bedrooms: updated };
    });
  };

  const handleBathroomChange = (bathroom: number | string) => {
    setFilters((prev) => {
      const updated = prev.bathrooms.includes(bathroom)
        ? prev.bathrooms.filter((b) => b !== bathroom)
        : [...prev.bathrooms, bathroom];
      return { ...prev, bathrooms: updated };
    });
  };

  const handleParkingChange = (parking: number | string) => {
    setFilters((prev) => {
      const updated = prev.parking.includes(parking)
        ? prev.parking.filter((p) => p !== parking)
        : [...prev.parking, parking];
      return { ...prev, parking: updated };
    });
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: { ...prev.priceRange, [type]: value },
    }));
  };

  const handleSquareFeetChange = (type: 'min' | 'max', value: string) => {
    setFilters((prev) => ({
      ...prev,
      squareFeet: { ...prev.squareFeet, [type]: value },
    }));
  };

  const handleFeatureChange = (feature: string) => {
    setFilters((prev) => {
      const updated = prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature];
      return { ...prev, features: updated };
    });
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    const reset = {
      propertyTypes: initialPropertyType,
      bedrooms: [],
      bathrooms: [],
      parking: [],
      priceRange: { min: '', max: '' },
      squareFeet: { min: '', max: '' },
      features: [],
    };
    setFilters(reset);
    onFilterChange(reset);
  };

  const showBedroomBathroomFilters = filters.propertyTypes.some(
    (type) => type === 'Condominium' || type === 'House and Lot'
  );

  const showParkingFilters = filters.propertyTypes.some(
    (type) => type === 'Warehouse' || type === 'House and Lot'
  );

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
              {['Studio', 1, 2, 3, '4+'].map((label) => (
                <button
                  key={label}
                  className={`border border-primary-main cursor-pointer text-primary-main rounded-full px-3 py-1 text-sm font-medium ${
                    filters.bedrooms.includes(label)
                      ? 'bg-primary-main text-white'
                      : ''
                  }`}
                  onClick={() => handleBedroomChange(label)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className='font-bold text-xl mb-3'>Bathrooms</div>
            <div className='flex gap-2 flex-wrap'>
              {[1, 2, 3, 4, '5+'].map((label) => (
                <button
                  key={label}
                  className={`border border-primary-main cursor-pointer text-primary-main rounded-full px-3 py-1 text-sm font-medium ${
                    filters.bathrooms.includes(label)
                      ? 'bg-primary-main text-white'
                      : ''
                  }`}
                  onClick={() => handleBathroomChange(label)}
                >
                  {label}
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
            {[1, 2, 3, '4+'].map((label) => (
              <button
                key={label}
                className={`border border-primary-main cursor-pointer text-primary-main rounded-full px-3 py-1 text-sm font-medium ${
                  filters.parking.includes(label)
                    ? 'bg-primary-main text-white'
                    : ''
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
            value={[
              filters.priceRange.min ? Number(filters.priceRange.min) : 500000,
              filters.priceRange.max ? Number(filters.priceRange.max) : 4000000,
            ]}
            onValueChange={([min, max]) => {
              handlePriceRangeChange('min', String(min));
              handlePriceRangeChange('max', String(max));
            }}
          />
          <div className='flex items-center justify-between mt-2'>
            <div className='bg-neutral-light rounded-full px-8 py-2 text-sm font-medium w-36 flex items-center justify-center'>
              {formatPrice(filters.priceRange.min || '500000')}
            </div>
            <span className='mx-2 text-2xl font-bold'>-</span>
            <div className='bg-neutral-light rounded-full px-8 py-2 text-sm font-medium w-36 flex items-center justify-center'>
              {formatPrice(filters.priceRange.max || '4000000')}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className='font-bold text-xl mb-3'>Square Feet</div>
        <div className='flex flex-col gap-2'>
          <input
            type='text'
            placeholder='Minimum'
            className='rounded-full focus:outline-none px-4 py-3 bg-neutral-light'
            value={filters.squareFeet.min}
            onChange={(e) => handleSquareFeetChange('min', e.target.value)}
          />
          <input
            type='text'
            placeholder='Maximum'
            className='rounded-full focus:outline-none px-4 py-3 bg-neutral-light'
            value={filters.squareFeet.max}
            onChange={(e) => handleSquareFeetChange('max', e.target.value)}
          />
        </div>
      </div>

      <div>
        <div className='font-bold text-xl mb-3'>Features & Amenities</div>
        <Select
          onValueChange={handleFeatureChange}
          value={filters.features.length > 0 ? filters.features[0] : ''}
        >
          <SelectTrigger className='rounded-full focus:outline-none text-base px-4 py-6 bg-neutral-light w-full'>
            <SelectValue placeholder='feature & amenities' />
          </SelectTrigger>
          <SelectContent>
            {uniqueFeatures.map((feature) => (
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
