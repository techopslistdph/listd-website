export type Step = 0 | 1 | 2 | 3;

export type PropertyType =
  | 'condominium'
  | 'warehouse'
  | 'house and lot'
  | 'land';

export type FormData = {
  // Step 1
  propertyType: PropertyType;
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
  fullyFurnished: boolean;
  facingWest: boolean;
  amenities: string[];
  features: string[];
  security: string[];
  images: File[];
  // Step 2
  title: string;
  description: string;
  forSale: boolean;
  // Step 3
  package: string;
  period: string;
  grossAskingPrice: string;
  downPaymentPercent: string;
  downPaymentPHP: string;
  commissionPercent: string;
  commissionPHP: string;
};

export const initialFormData: FormData = {
  propertyType: 'condominium',
  buildingName: '',
  state: '',
  city: '',
  barangay: '',
  street: '',
  zipCode: '',
  floorNo: '',
  floorArea: '',
  lotSize: '',
  lotType: [],
  ceilingHeight: '',
  bedrooms: 0,
  bathrooms: 0,
  parking: 0,
  fullyFurnished: false,
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
