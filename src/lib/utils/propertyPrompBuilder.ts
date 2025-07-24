// src/lib/utils/propertyPromptBuilder.ts

import { ListingFormData } from '@/components/listing/form/Schema';
import { AiGeneratePrompt } from '@/lib/queries/hooks/types/ai-generate';

/**
 * Extracts all relevant form fields based on property type
 */
export function extractFormFields(formData: ListingFormData) {
  const propertyType = formData.propertyType;

  // Common fields that exist across all property types
  const commonFields = {
    street: formData.street,
    barangay: formData.barangay,
    city: formData.city,
    state: formData.state,
    listingType: formData.listingType,
    grossAskingPrice: formData.grossAskingPrice,
    downPaymentPercent: formData.downPaymentPercent,
    downPaymentPHP: formData.downPaymentPHP,
    commissionPercent: formData.commissionPercent,
    commissionPHP: formData.commissionPHP,
    nearbyLocations: formData.nearbyLocations,
    amenities: formData.amenities,
    features: formData.features,
    security: formData.security,
    longitude: formData.longitude,
    latitude: formData.latitude,
  };

  // Property type specific fields
  const specificFields = getPropertySpecificFields(formData, propertyType);

  return { ...commonFields, ...specificFields };
}

/**
 * Gets property type specific fields
 */
function getPropertySpecificFields(
  formData: ListingFormData,
  propertyType: string
) {
  switch (propertyType) {
    case 'Condominium':
      if (formData.propertyType === 'Condominium') {
        return {
          buildingName: formData.buildingName,
          floorNo: formData.floorNo,
          floorArea: formData.floorArea,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          parking: formData.parking,
          fullyFurnished: formData.fullyFurnished,
          facingWest: formData.facingWest,
        };
      }
      break;
    case 'Warehouse':
      if (formData.propertyType === 'Warehouse') {
        return {
          lotSize: formData.lotSize,
          floorArea: formData.floorArea,
          ceilingHeight: formData.ceilingHeight,
          parking: formData.parking,
          loadingDocks: formData.loadingDocks,
          buildingSize: formData.buildingSize,
        };
      }
      break;
    case 'House and lot':
      if (formData.propertyType === 'House and lot') {
        return {
          numberOfFloors: formData.numberOfFloors,
          floorArea: formData.floorArea,
          lotSize: formData.lotSize,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          parking: formData.parking,
          fullyFurnished: formData.fullyFurnished,
          facingWest: formData.facingWest,
          numberOfGarages: formData.numberOfGarages,
          numberOfLivingRooms: formData.numberOfLivingRooms,
          numberOfDiningRooms: formData.numberOfDiningRooms,
          numberOfKitchens: formData.numberOfKitchens,
          numberOfMaidRooms: formData.numberOfMaidRooms,
          yearBuilt: formData.yearBuilt,
        };
      }
      break;
    case 'Vacant lot':
      if (formData.propertyType === 'Vacant lot') {
        return {
          lotSize: formData.lotSize,
          parking: formData.parking,
        };
      }
      break;
    default:
      return {};
  }
  return {};
}

/**
 * Validates required fields for AI generation
 */
export function validateRequiredFields(formData: ListingFormData) {
  if (!formData.propertyType) {
    return { isValid: false, message: 'Please select a property type first' };
  }

  if (!formData.street || !formData.barangay || !formData.city) {
    return {
      isValid: false,
      message:
        'Please provide complete address information (street, barangay, city)',
    };
  }

  // if (!formData.title) {
  //   return { isValid: false, message: 'Please enter a request prompt first' };
  // }

  return { isValid: true, message: '' };
}

/**
 * Builds comprehensive AI prompt from form data
 */
export function buildPropertyPrompt(
  formData: ListingFormData,
  type: 'title' | 'description' | 'valuation_generation',
  request?: string
): AiGeneratePrompt {
  const fields = extractFormFields(formData);
  const listingType = fields.listingType;
  const transactionType = listingType.toLowerCase().includes('buy')
    ? 'for-sale'
    : 'for-rent';

  // Build location string
  const locationParts = [
    fields.street,
    fields.barangay,
    fields.city,
    fields.state,
    fields.buildingName,
  ].filter(Boolean);

  const location = locationParts.join(', ');

  // Build context object with all available fields
  const context: AiGeneratePrompt['context'] = {
    ...(fields.floorArea && { floorArea: Number(fields.floorArea) }),
    ...(fields.lotSize && { lotSize: Number(fields.lotSize) }),
    ...(fields.bedrooms && { bedrooms: Number(fields.bedrooms) }),
    ...(fields.bathrooms && { bathrooms: Number(fields.bathrooms) }),
    ...(fields.parking && { parking: Number(fields.parking) }),
    ...(fields.buildingName && { buildingName: fields.buildingName }),
    ...(fields.floorNo && { floorNo: fields.floorNo }),
    ...(fields.grossAskingPrice && {
      grossAskingPrice: fields.grossAskingPrice,
    }),
    ...(fields.downPaymentPercent && {
      downPaymentPercent: fields.downPaymentPercent,
    }),
    ...(fields.downPaymentPHP && { downPaymentPHP: fields.downPaymentPHP }),
    ...(fields.commissionPercent && {
      commissionPercent: fields.commissionPercent,
    }),
    ...(fields.commissionPHP && { commissionPHP: fields.commissionPHP }),
    ...(fields.nearbyLocations &&
      fields.nearbyLocations.length > 0 && {
        nearbyLocations: fields.nearbyLocations.map(item => item.label),
      }),
    ...(fields.amenities &&
      fields.amenities.length > 0 && {
        amenities: fields.amenities.map(item => item.label),
      }),
    ...(fields.features &&
      fields.features.length > 0 && {
        features: fields.features.map(item => item.label),
      }),
    ...(fields.security &&
      fields.security.length > 0 && {
        security: fields.security.map(item => item.label),
      }),
    ...(transactionType && { transactionType }),
  };

  // Add property type specific fields
  const propertyType = formData.propertyType;
  if (propertyType === 'Condominium' && context) {
    context.fullyFurnished = fields.fullyFurnished;
    context.facingWest = fields.facingWest;
  } else if (propertyType === 'Warehouse' && context) {
    context.ceilingHeight = fields.ceilingHeight;
    context.loadingDocks = fields.loadingDocks;
    context.buildingSize = fields.buildingSize;
  } else if (propertyType === 'House and lot' && context) {
    context.numberOfFloors = fields.numberOfFloors;
    context.numberOfGarages = fields.numberOfGarages;
    context.numberOfLivingRooms = fields.numberOfLivingRooms;
    context.numberOfDiningRooms = fields.numberOfDiningRooms;
    context.numberOfKitchens = fields.numberOfKitchens;
    context.numberOfMaidRooms = fields.numberOfMaidRooms;
    context.yearBuilt = fields.yearBuilt;
    context.fullyFurnished = fields.fullyFurnished;
    context.facingWest = fields.facingWest;
  }

  let baseInstruction = '';
  switch (type) {
    case 'title':
      baseInstruction =
        'Write a compelling and concise title for the property using the provided context.';
      break;
    case 'description':
      baseInstruction =
        'Craft a detailed, engaging, and informative property description based on the given context.';
      break;
    case 'valuation_generation':
      baseInstruction = `Estimate the market value of this ${listingType.toLowerCase()?.includes('buy') ? 'for sale' : 'for rent'} ${propertyType.replaceAll('-', ' ')} located in ${location}. Include a brief analysis of its rental potential if applicable. Do not return a value of 0 PHP.`;
      break;
    default:
      baseInstruction =
        'Generate useful content for the property listing based on the provided context.';
  }

  const creativityInstruction =
    'Use only the provided information to generate your response. Do not ask follow-up questions. Be clear, highly creative, and professional. Make the result stand out and feel original.';

  const requestTitle =
    request && request.trim() !== ''
      ? `${baseInstruction} The user also gave this input: "${request.trim()}". Use it as inspiration and enhance or refine it based on the context. ${creativityInstruction}`
      : `${baseInstruction} ${creativityInstruction}`;

  return {
    request: requestTitle,
    propertyType: propertyType.toLowerCase().split(' ').join('-'),
    requestType: type,
    ...(location && { location }),
    context,
  };
}

/**
 * Utility function to get a summary of available fields for debugging
 */
export function getFieldSummary(formData: ListingFormData) {
  const fields = extractFormFields(formData);
  const summary = {
    propertyType: formData.propertyType,
    location: `${fields.street}, ${fields.barangay}, ${fields.city}`,
    hasBasicInfo: !!(fields.street && fields.barangay && fields.city),
    hasPricing: !!fields.grossAskingPrice,
    hasSizeInfo: !!(fields.floorArea || fields.lotSize),
    hasRoomInfo: !!(fields.bedrooms || fields.bathrooms),
    hasAmenities: !!(fields.amenities?.length || fields.features?.length),
    totalFields: Object.keys(fields).length,
  };

  return summary;
}
