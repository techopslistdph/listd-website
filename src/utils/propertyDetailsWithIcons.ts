import { StaticImageData } from 'next/image';
import { PropertyDetail } from '../lib/queries/server/propety/type';

// Import all available icons
import areaIcon from '../../public/images/icons/squaremeter.svg';
import bedIcon from '../../public/images/icons/bedroom.svg';
import bathIcon from '../../public/images/icons/bath.svg';
import fullyFurnishedIcon from '../../public/images/icons/fully-furnished.svg';
import parkingIcon from '../../public/images/icons/car.svg';
import { LucideIcon } from 'lucide-react';

export interface PropertyDetailItem {
  key: string;
  label: string;
  value: string | number | boolean;
  icon: StaticImageData | LucideIcon | null;
  unit?: string;
  isBoolean?: boolean;
}

export interface PropertyDetailsWithIcons {
  numericDetails: PropertyDetailItem[];
  amenities: PropertyDetailItem[];
}

const iconMap: Record<string, StaticImageData | LucideIcon | null> = {
  // Numeric details
  buildingSize: areaIcon,
  lotSize: areaIcon,
  floorArea: areaIcon,
  ceilingHeight: areaIcon,
  loadingDocks: areaIcon,
  numberOfBedrooms: bedIcon,
  numberOfBathrooms: bathIcon,
  numberOfParkingSpaces: parkingIcon,
  numberOfFloors: areaIcon,
  numberOfGarages: parkingIcon,
  numberOfLivingRooms: fullyFurnishedIcon,
  numberOfDiningRooms: fullyFurnishedIcon,
  numberOfKitchens: fullyFurnishedIcon,
  numberOfMaidRooms: fullyFurnishedIcon,
  yearBuilt: fullyFurnishedIcon,

  // Other
  furnishingStatus: fullyFurnishedIcon,
};

const labelMap: Record<string, string> = {
  // Numeric details
  buildingSize: 'Building Size',
  lotSize: 'Lot Size',
  floorArea: 'Floor Area',
  ceilingHeight: 'Ceiling Height',
  loadingDocks: 'Loading Docks',
  numberOfBedrooms: 'Bedrooms',
  numberOfBathrooms: 'Bathrooms',
  numberOfParkingSpaces: 'Parking Spaces',
  numberOfFloors: 'No. of Floors',
  numberOfGarages: 'Garages',
  numberOfLivingRooms: 'Living Rooms',
  numberOfDiningRooms: 'Dining Rooms',
  numberOfKitchens: 'Kitchens',
  numberOfMaidRooms: 'Maid Rooms',
  yearBuilt: 'Year Built',

  // Other
  furnishingStatus: 'Furnishing Status',
};

const unitMap: Record<string, string> = {
  buildingSize: 'sqm',
  lotSize: 'sqm',
  floorArea: 'sqm',
  ceilingHeight: 'm',
  loadingDocks: '',
  numberOfBedrooms: '',
  numberOfBathrooms: '',
  numberOfParkingSpaces: '',
  numberOfFloors: '',
  numberOfGarages: '',
  numberOfLivingRooms: '',
  numberOfDiningRooms: '',
  numberOfKitchens: '',
  numberOfMaidRooms: '',
  yearBuilt: '',
};

/**
 * Processes PropertyDetail and returns structured data with icons for display
 */
export function getPropertyDetailsWithIcons(
  propertyDetail: PropertyDetail
): PropertyDetailsWithIcons {
  const numericDetails: PropertyDetailItem[] = [];
  const amenities: PropertyDetailItem[] = [];

  // Process numeric details
  const numericFields = [
    'buildingSize',
    'lotSize',
    'floorArea',
    'ceilingHeight',
    'loadingDocks',
    'numberOfBedrooms',
    'numberOfBathrooms',
    'numberOfParkingSpaces',
    'numberOfFloors',
    'numberOfGarages',
    'numberOfLivingRooms',
    'numberOfDiningRooms',
    'numberOfKitchens',
    'numberOfMaidRooms',
    'yearBuilt',
  ] as const;

  numericFields.forEach(field => {
    const value = propertyDetail[field];
    if (value !== null && value !== undefined) {
      const unit = unitMap[field];
      const displayValue = unit ? `${value} ${unit}` : String(value);

      numericDetails.push({
        key: field,
        label: labelMap[field],
        value: displayValue,
        icon: iconMap[field] || null,
        unit,
      });
    }
  });

  // Process furnishing status
  if (propertyDetail.furnishingStatus) {
    amenities.push({
      key: 'furnishingStatus',
      label: labelMap.furnishingStatus,
      value: propertyDetail.furnishingStatus
        .replace('_', ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      icon: iconMap.furnishingStatus || null,
    });
  }

  return {
    numericDetails,
    amenities,
  };
}

/**
 * Gets all available property details as a flat array
 */
export function getAllPropertyDetails(
  propertyDetail: PropertyDetail
): PropertyDetailItem[] {
  const { numericDetails, amenities } =
    getPropertyDetailsWithIcons(propertyDetail);
  return [...numericDetails, ...amenities];
}

// Helper function to get property details based on type (max 3)
export const getPropertyDetailsForType = (
  propertyDetail: PropertyDetail,
  propertyType: string
) => {
  const details: Array<{
    key: string;
    label: string;
    value: string;
    icon: StaticImageData;
  }> = [];

  // Define priority fields for each property type
  const fieldPriorities: Record<string, string[]> = {
    Condominium: ['numberOfBedrooms', 'numberOfBathrooms', 'lotSize'],
    'House and lot': ['numberOfBedrooms', 'numberOfBathrooms', 'lotSize'],
    Warehouse: ['lotSize'],
    'Vacant lot': ['lotSize'],
  };

  const iconMap: Record<string, StaticImageData | LucideIcon | null> = {
    numberOfBedrooms: bedIcon,
    numberOfBathrooms: bathIcon,
    lotSize: areaIcon,
  };

  const labelMap: Record<string, string> = {
    numberOfBedrooms: 'Bedroom',
    numberOfBathrooms: 'Bath',
    lotSize: 'Lot Size',
  };

  const unitMap: Record<string, string> = {
    numberOfBedrooms: ' Bedroom',
    numberOfBathrooms: ' Bath',
    lotSize: ' sqm ',
  };

  const priorityFields = fieldPriorities[propertyType] || [
    'numberOfBedrooms',
    'numberOfBathrooms',
    'lotSize',
  ];

  // Add fields based on priority, but only if they have values
  priorityFields.forEach(field => {
    const value = propertyDetail[field as keyof PropertyDetail];
    if (value !== null && value !== undefined && value !== 0) {
      const unit = unitMap[field];
      const displayValue = unit ? `${value}${unit}` : String(value);
      details.push({
        key: field,
        label: labelMap[field],
        value: displayValue,
        icon: iconMap[field] || areaIcon,
      });
    }
  });

  return details.slice(0, 3); // Ensure max 3 items
};
