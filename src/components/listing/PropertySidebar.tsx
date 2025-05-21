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

const PropertySidebar = ({ onFilterChange }: PropertySidebarProps) => {
  const [filters, setFilters] = useState<Filters>({
    propertyTypes: ['Condominium'],
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

  const handlePropertyTypeChange = (type: string) => {
    setFilters((prev) => {
      const updated = prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...prev.propertyTypes, type];
      return { ...prev, propertyTypes: updated };
    });
  };

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
      propertyTypes: ['Condominium'],
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
    (type) =>
      type === 'Warehouse' || type === 'House and Lot' || type === 'Land'
  );

  return (
    <aside className='max-w-72 pt-5 flex flex-col gap-6 sticky top-0 bottom-10 h-fit'>
      <div>
        <div className='font-bold text-xl mb-3'>Property</div>
        <div className='flex flex-col gap-2'>
          {['Condominium', 'Warehouse', 'House and Lot', 'Land'].map((type) => (
            <label key={type} className='flex items-center gap-2'>
              <input
                type='checkbox'
                className='accent-[var(--primary-main)]'
                checked={filters.propertyTypes.includes(type)}
                onChange={() => handlePropertyTypeChange(type)}
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {showBedroomBathroomFilters && (
        <>
          <div>
            <div className='font-bold text-xl mb-3'>Bedrooms</div>
            <div className='flex gap-2 flex-wrap'>
              {['Studio', 1, 2, 3, '4+'].map((label) => (
                <button
                  key={label}
                  className={`border border-[var(--primary-main)] cursor-pointer text-[var(--primary-main)] rounded-full px-3 py-1 text-sm font-medium ${
                    filters.bedrooms.includes(label)
                      ? 'bg-[var(--primary-main)] text-white'
                      : 'bg-white'
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
                  className={`border border-[var(--primary-main)] cursor-pointer text-[var(--primary-main)] rounded-full px-3 py-1 text-sm font-medium ${
                    filters.bathrooms.includes(label)
                      ? 'bg-[var(--primary-main)] text-white'
                      : 'bg-white'
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
                className={`border border-[var(--primary-main)] cursor-pointer text-[var(--primary-main)] rounded-full px-3 py-1 text-sm font-medium ${
                  filters.parking.includes(label)
                    ? 'bg-[var(--primary-main)] text-white'
                    : 'bg-white'
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
        <div className='flex flex-col gap-2'>
          <input
            type='text'
            placeholder='Minimum'
            className='rounded-full focus:outline-none px-4 py-3 bg-[var(--neutral-light)]'
            value={filters.priceRange.min}
            onChange={(e) => handlePriceRangeChange('min', e.target.value)}
          />
          <input
            type='text'
            placeholder='Maximum'
            className='rounded-full focus:outline-none px-4 py-3 bg-[var(--neutral-light)]'
            value={filters.priceRange.max}
            onChange={(e) => handlePriceRangeChange('max', e.target.value)}
          />
        </div>
      </div>

      <div>
        <div className='font-bold text-xl mb-3'>Square Feet</div>
        <div className='flex flex-col gap-2'>
          <input
            type='text'
            placeholder='Minimum'
            className='rounded-full focus:outline-none px-4 py-3 bg-[var(--neutral-light)]'
            value={filters.squareFeet.min}
            onChange={(e) => handleSquareFeetChange('min', e.target.value)}
          />
          <input
            type='text'
            placeholder='Maximum'
            className='rounded-full focus:outline-none px-4 py-3 bg-[var(--neutral-light)]'
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
          <SelectTrigger className='rounded-full focus:outline-none text-base px-4 py-6 bg-[var(--neutral-light)] w-full'>
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
          className='bg-[var(--primary-main)] text-white rounded-full px-4 py-2 cursor-pointer hover:bg-[var(--primary-main)]/80'
          onClick={handleApplyFilters}
        >
          Apply Filters
        </button>
        <button
          className='border border-[var(--primary-main)] text-[var(--primary-main)] rounded-full px-4 py-2 cursor-pointer hover:bg-[var(--primary-main)]/10'
          onClick={handleResetFilters}
        >
          Reset Filters
        </button>
      </div>
    </aside>
  );
};

export default PropertySidebar;
