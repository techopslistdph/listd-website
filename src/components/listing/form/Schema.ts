import { z } from 'zod';

const propertyTypeEnum = z.enum([
  'Condominium',
  'Warehouse',
  'House and lot',
  'Vacant lot',
]);

export const furnishingStatusEnum = z.enum([
  'fully_furnished',
  'semi_furnished',
  'unfurnished',
]);

const packageEnum = z.enum(['free', 'paid']);

const baseSchema = {
  // Common fields for all property types
  propertyType: propertyTypeEnum,
  propertyTypeId: z.string(),
  listingType: z.string(),
  listingTypeId: z.string(),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  barangay: z.string().min(1, 'Barangay is required'),
  street: z.string().min(1, 'Street is required'),
  images: z.array(z.instanceof(File)).min(3, 'At least 3 images are required'),
  // Step 2
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title cannot exceed 255 characters'),
  description: z.string().min(1, 'Description is required'),
  forSale: z.boolean(),
  // Step 3
  package: packageEnum,
  period: z.string(),
  grossAskingPrice: z.coerce.number().min(1, 'Must be 1 or greater'),
  downPaymentPercent: z.string().optional(),
  downPaymentPHP: z.string().optional(),
  commissionPercent: z.string().optional(),
  commissionPHP: z.string().optional(),
  // Common optional fields
  nearbyLocations: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .optional(),
  amenities: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .optional(),
  features: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .optional(),
  security: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .optional(),
  longitude: z.coerce.number().optional(),
  latitude: z.coerce.number().optional(),
};

export const listingFormSchema = z.discriminatedUnion('propertyType', [
  // Condominium specific schema
  z.object({
    ...baseSchema,
    propertyType: z.literal('Condominium'),
    buildingName: z.string().min(1, 'Building name is required'),
    floorNo: z.coerce.number().min(1, 'Must be 1 or greater'),
    floorArea: z.coerce.number().min(1, 'Must be 1 or greater'),
    bedrooms: z.coerce.number().min(0, 'Must be 0 or greater'),
    bathrooms: z.coerce.number().min(0, 'Must be 0 or greater'),
    parking: z.coerce.number().min(0, 'Must be 0 or greater'),
    fullyFurnished: furnishingStatusEnum,
    facingWest: z.boolean(),
    amenities: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    ),
    features: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    ),
  }),
  // Warehouse specific schema
  z.object({
    ...baseSchema,
    propertyType: z.literal('Warehouse'),
    lotSize: z.coerce.number().min(0, 'Must be 0 or greater'),
    floorArea: z.coerce.number().min(0, 'Must be 0 or greater'),
    ceilingHeight: z
      .string()
      .min(1, 'Ceiling height is required')
      .max(50, 'Ceiling height cannot exceed 50 meters'),
    parking: z.coerce.number().min(0, 'Must be 0 or greater'),
    nearbyLocations: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    ),
    loadingDocks: z.coerce
      .number()
      .min(0, 'Must be 0 or greater')
      .max(50, 'Number of loading docks cannot exceed 50'),
    buildingSize: z.coerce.number().min(0, 'Must be 0 or greater'),
  }),
  // House and Lot specific schema
  z.object({
    ...baseSchema,
    propertyType: z.literal('House and lot'),
    numberOfFloors: z.coerce
      .number()
      .min(1, 'Number of floors must be 1 or greater')
      .max(10, 'Number of floors cannot exceed 10'),
    floorArea: z.coerce.number().min(0, 'Must be 0 or greater'),
    lotSize: z.string().min(1, 'Lot size is required'),
    bedrooms: z.coerce.number().min(0, 'Must be 0 or greater'),
    bathrooms: z.coerce.number().min(0, 'Must be 0 or greater'),
    parking: z.coerce.number().min(0, 'Must be 0 or greater'),
    fullyFurnished: furnishingStatusEnum,
    facingWest: z.boolean(),
    amenities: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    ),
    features: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    ),
    numberOfGarages: z.coerce
      .number()
      .min(0, 'Must be 0 or greater')
      .max(5, 'Number of garages cannot exceed 5'),
    numberOfLivingRooms: z.coerce
      .number()
      .min(0, 'Must be 0 or greater')
      .max(10, 'Number of living rooms cannot exceed 10'),
    numberOfDiningRooms: z.coerce
      .number()
      .min(0, 'Must be 0 or greater')
      .max(5, 'Number of dining rooms cannot exceed 5'),
    numberOfKitchens: z.coerce
      .number()
      .min(0, 'Must be 0 or greater')
      .max(5, 'Number of kitchens cannot exceed 5'),
    numberOfMaidRooms: z.coerce
      .number()
      .min(0, 'Must be 0 or greater')
      .max(5, 'Number of maid rooms cannot exceed 5'),
    yearBuilt: z.coerce
      .number()
      .min(1900, 'Year must be 1900 or later')
      .max(new Date().getFullYear(), 'Year must be current year or earlier'),
  }),
  // Vacant Lot specific schema
  z.object({
    ...baseSchema,
    propertyType: z.literal('Vacant lot'),
    lotSize: z.coerce.number().min(1, 'Lot size is required'),
    nearbyLocations: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    ),
    parking: z.coerce.number().min(0, 'Must be 0 or greater'),
  }),
]);

export type ListingFormData = z.infer<typeof listingFormSchema>;
