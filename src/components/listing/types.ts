export type Step = 0 | 1 | 2 | 3;

export type PropertyType =
  | 'condominium'
  | 'warehouse'
  | 'house and lot'
  | 'land';

export type FurnishingStatus =
  | 'fully_furnished'
  | 'semi_furnished'
  | 'unfurnished';

export type FormData = {
  // Step 1
  propertyType: PropertyType;
  propertyTypeId: string;
  listingTypeId: string;
  buildingName: string;
  state: string;
  city: string;
  barangay: string;
  street: string;
  zipCode: string;
  floorNo: string;
  floorArea: string;
  lotSize: string;
  lotType: string[];
  ceilingHeight: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  fullyFurnished: FurnishingStatus;
  facingWest: boolean;
  amenities: string[];
  features: string[];
  security: string[];
  longitude: number;
  latitude: number;
  images: File[];
  // Step 2
  title: string;
  description: string;
  forSale: boolean;
  // Step 3
  package: 'free' | 'paid';
  period: string;
  grossAskingPrice: string;
  downPaymentPercent: string;
  downPaymentPHP: string;
  commissionPercent: string;
  commissionPHP: string;
};

export const initialFormData: FormData = {
  propertyType: 'condominium',
  propertyTypeId: '',
  listingTypeId: '',
  buildingName: '',
  state: '',
  city: '',
  barangay: '',
  street: '',
  zipCode: '',
  floorNo: '',
  longitude: 0,
  latitude: 0,
  floorArea: '',
  lotSize: '',
  lotType: [],
  ceilingHeight: '',
  bedrooms: 0,
  bathrooms: 0,
  parking: 0,
  fullyFurnished: 'unfurnished',
  facingWest: false,
  amenities: [],
  features: [],
  security: [],
  images: [],
  title: '',
  description: '',
  forSale: true,
  package: 'free',
  period: '5',
  grossAskingPrice: '',
  downPaymentPercent: '',
  downPaymentPHP: '',
  commissionPercent: '',
  commissionPHP: '',
};
