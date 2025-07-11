import { Step } from '../types';

export const stepFields: {
  [key: number]:
    | {
        [key: string]: string[];
      }
    | string[];
} = {
  0: {
    Condominium: [
      'propertyType',
      'buildingName',
      'floorNo',
      'floorArea',
      'bedrooms',
      'bathrooms',
      'parking',
      'fullyFurnished',
      'facingWest',
      'amenities',
      'features',
      'state',
      'city',
      'barangay',
      'street',
      'images',
    ],
    Warehouse: [
      'propertyType',
      'lotSize',
      'floorArea',
      'ceilingHeight',
      'parking',
      'amenities',
      'state',
      'city',
      'barangay',
      'street',
      'zipCode',
      'images',
    ],
    'House and lot': [
      'propertyType',
      'floorNo',
      'floorArea',
      'lotSize',
      'bedrooms',
      'bathrooms',
      'parking',
      'fullyFurnished',
      'facingWest',
      'amenities',
      'features',
      'state',
      'city',
      'barangay',
      'street',
      'zipCode',
      'images',
    ],
    'Vacant lot': [
      'propertyType',
      'lotSize',
      'lotType',
      'state',
      'city',
      'barangay',
      'street',
      'zipCode',
      'images',
    ],
  },
  1: ['title', 'description'],
  2: [
    'package',
    'period',
    'grossAskingPrice',
    'downPaymentPercent',
    'downPaymentPHP',
    'commissionPercent',
    'commissionPHP',
  ],
};

export const getFieldsToValidate = (
  step: Step,
  propertyType: string,
  isValuation: boolean = false
): string[] => {
  if (step === 0) {
    const step0Fields = stepFields[0] as { [key: string]: string[] };
    const fields = step0Fields[propertyType] || [];
    // Remove 'images' from validation if it's a valuation page
    return isValuation ? fields.filter(field => field !== 'images') : fields;
  }
  return stepFields[step] as string[];
};
