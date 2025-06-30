import { ListingFormData } from './Schema';

export type Step = 0 | 1 | 2 | 3;

export type PropertyType =
  | 'Condominium'
  | 'Warehouse'
  | 'House and lot'
  | 'Vacant lot';

export type FormData = ListingFormData;

const baseInitialData = {
  state: '',
  city: '',
  barangay: '',
  street: '',
  zipCode: '',
  images: [],
  title: '',
  description: '',
  forSale: true,
  package: 'free',
  period: '',
  grossAskingPrice: '',
  downPaymentPercent: '',
  downPaymentPHP: '',
  commissionPercent: '',
  commissionPHP: '',
};

export const initialFormData: FormData = {
  ...baseInitialData,
  propertyType: 'Condominium',
  buildingName: '',
  floorNo: '',
  floorArea: '',
  lotSize: '',
  bedrooms: 0,
  bathrooms: 0,
  parking: 0,
  ceilingHeight: '',
  fullyFurnished: 'unfurnished',
  facingWest: false,
  amenities: [],
  features: [],
  lotType: [],
  security: [],
  numberOfFloors: 1,
  numberOfGarages: 0,
  numberOfLivingRooms: 0,
  numberOfDiningRooms: 0,
  numberOfKitchens: 0,
  numberOfMaidRooms: 0,
  yearBuilt: 0,
  hasSwimmingPool: false,
  hasGarden: false,
  hasTerrace: false,
  hasBalcony: false,
  hasSecurity: false,
  nearbyLocations: [],
  loadingDocks: 0,
  buildingSize: 0,
} as FormData;
