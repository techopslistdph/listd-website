import { useState } from 'react';
import { properties } from '@/app/data';
import { StaticImageData } from 'next/image';

type PropertyDescription = {
  bedrooms?: number;
  baths?: number;
  area?: string;
  'fully furnished'?: boolean;
  parking?: boolean | number;
  'facing west'?: boolean;
};

type Property = {
  images: StaticImageData[];
  tag: string;
  price: string;
  title: string;
  slug: string;
  location: string;
  description: PropertyDescription[];
  isVerified: boolean;
  features: string[];
  googleMap: string;
  agent: {
    name: string;
    image: StaticImageData;
    whatsapp: string;
    email: string;
    isVerified: boolean;
    position: string;
  };
};

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

export const usePropertyFilter = () => {
  const [filteredProperties, setFilteredProperties] =
    useState<Property[]>(properties);

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...properties];

    // Filter by property type
    if (filters.propertyTypes.length > 0) {
      filtered = filtered.filter((property) =>
        filters.propertyTypes.includes(property.tag)
      );
    }

    // Apply filters based on property type
    filtered = filtered.filter((property) => {
      // Condominium filters
      if (property.tag === 'Condominium') {
        // Bedrooms filter
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

        // Bathrooms filter
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
      }

      // Warehouse filters
      if (property.tag === 'Warehouse') {
        // Parking filter
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
      }

      // House and Lot filters
      if (property.tag === 'House and Lot') {
        // Bedrooms filter
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

        // Bathrooms filter
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

        // Parking filter
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
      }

      // Land filters
      if (property.tag === 'Land') {
        // Parking filter
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
      }

      return true;
    });

    // Filter by price range
    if (filters.priceRange.min || filters.priceRange.max) {
      filtered = filtered.filter((property) => {
        const price = parseFloat(property.price.replace(/[^0-9.]/g, ''));
        const min = filters.priceRange.min
          ? parseFloat(filters.priceRange.min)
          : 0;
        const max = filters.priceRange.max
          ? parseFloat(filters.priceRange.max)
          : Infinity;
        return price >= min && price <= max;
      });
    }

    // Filter by square feet
    if (filters.squareFeet.min || filters.squareFeet.max) {
      filtered = filtered.filter((property) => {
        const area = property.description.find((d) => 'area' in d)?.area;
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
      filtered = filtered.filter((property) =>
        filters.features.every((feature) => property.features.includes(feature))
      );
    }

    setFilteredProperties(filtered);
  };

  return {
    filteredProperties,
    handleFilterChange,
  };
};
