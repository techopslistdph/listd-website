import { useState } from 'react';
import { Listing } from '@/app/data';

type PropertyDescription = {
  bedrooms?: number;
  baths?: number;
  area?: string;
  'fully furnished'?: boolean;
  parking?: boolean | number;
  'facing west'?: boolean;
};

type Property = Listing;

type FilterState = {
  propertyTypes: string[];
  bedrooms: (number | string)[];
  bathrooms: (number | string)[];
  parking: (number | string)[];
  priceRange: { min: string; max: string };
  squareFeet: { min: string; max: string };
  features: string[];
};

function hasBedrooms(
  desc: PropertyDescription
): desc is PropertyDescription & { bedrooms: number } {
  return 'bedrooms' in desc && typeof desc.bedrooms === 'number';
}

function hasBaths(
  desc: PropertyDescription
): desc is PropertyDescription & { baths: number } {
  return 'baths' in desc && typeof desc.baths === 'number';
}

function hasParking(
  desc: PropertyDescription
): desc is PropertyDescription & { parking: number } {
  return 'parking' in desc && typeof desc.parking === 'number';
}

function parsePriceString(price: string): number {
  // Remove currency symbols and spaces
  const cleaned = price.replace(/[₱, ]/g, '').toUpperCase();
  // Match number and optional multiplier
  const match = cleaned.match(/^([\d.]+)([KM]?)$/);
  if (!match) return 0;
  const [, num, multiplier] = match;
  let value = parseFloat(num);
  if (multiplier === 'M') value *= 1_000_000;
  if (multiplier === 'K') value *= 1_000;
  return value;
}

// function formatNumber(num: number): string {
//   return num.toLocaleString('en-US', {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });
// }

export const usePropertyFilter = (initialProperties: Property[]) => {
  const [filteredProperties, setFilteredProperties] =
    useState<Property[]>(initialProperties);

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...initialProperties];

    // Apply filters based on property type
    if (filters.propertyTypes.length > 0) {
      filtered = filtered.filter(property =>
        filters.propertyTypes.includes(property.tag)
      );
    }

    // Apply filters based on property type
    filtered = filtered.filter(property => {
      // Bedrooms filter (apply to all property types)
      if (filters.bedrooms.length > 0) {
        const bedroomDesc = property.description.find(hasBedrooms);
        if (!bedroomDesc || !hasBedrooms(bedroomDesc)) return false;
        const bedroomCount = bedroomDesc.bedrooms;
        if (filters.bedrooms.includes('4+')) {
          if (bedroomCount < 4) return false;
        } else if (!filters.bedrooms.includes(bedroomCount)) {
          return false;
        }
      }

      // Parking filter (apply to all property types)
      if (filters.parking.length > 0) {
        const parkingDesc = property.description.find(hasParking);
        if (!parkingDesc || !hasParking(parkingDesc)) return false;
        const parkingCount = parkingDesc.parking;
        if (filters.parking.includes('4+')) {
          if (parkingCount < 4) return false;
        } else if (!filters.parking.includes(parkingCount)) {
          return false;
        }
      }

      // Bathrooms filter (apply to all property types)
      if (filters.bathrooms.length > 0) {
        const bathroomDesc = property.description.find(hasBaths);
        if (!bathroomDesc || !hasBaths(bathroomDesc)) return false;
        const bathroomCount = bathroomDesc.baths;
        if (filters.bathrooms.includes('5+')) {
          if (bathroomCount < 5) return false;
        } else if (!filters.bathrooms.includes(bathroomCount)) {
          return false;
        }
      }

      return true;
    });

    // Filter by price range
    if (filters.priceRange.min || filters.priceRange.max) {
      filtered = filtered.filter(property => {
        const price = parsePriceString(property.price);
        const min = filters.priceRange.min
          ? parsePriceString(filters.priceRange.min)
          : 0;
        const max = filters.priceRange.max
          ? parsePriceString(filters.priceRange.max)
          : Infinity;

        return price >= min && price <= max;
      });
    }

    // Filter by square feet
    if (filters.squareFeet.min || filters.squareFeet.max) {
      filtered = filtered.filter(property => {
        const area = property.description.find(d => 'area' in d)?.area;
        if (!area) return false;

        const areaValue = parseInt(area.toString().replace(/[^0-9]/g, ''));
        const min = filters.squareFeet.min
          ? parseInt(filters.squareFeet.min)
          : 0;
        const max = filters.squareFeet.max
          ? parseInt(filters.squareFeet.max)
          : Infinity;
        return areaValue >= min && areaValue <= max;
      });
    }

    // Filter by features
    if (filters.features.length > 0) {
      filtered = filtered.filter(property =>
        filters.features.every(feature => property.features.includes(feature))
      );
    }

    setFilteredProperties(filtered);
  };

  return {
    filteredProperties,
    handleFilterChange,
  };
};
