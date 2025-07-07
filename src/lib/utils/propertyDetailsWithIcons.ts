import { StaticImageData } from 'next/image';
import { PropertyDetail } from '../queries/server/propety/type';

// Import all available icons
import areaIcon from '../../../public/images/icons/squaremeter.svg';
import bedIcon from '../../../public/images/icons/bedroom.svg';
import bathIcon from '../../../public/images/icons/bath.svg';
import fullyFurnishedIcon from '../../../public/images/icons/fully-furnished.svg';
import parkingIcon from '../../../public/images/icons/car.svg';
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
