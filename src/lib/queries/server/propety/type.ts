export interface PropertyDetailResponse {
  success: boolean;
  data: PropertyDetail;
  message?: string;
}

export interface NearbyPropertiesResponse {
  success: boolean;
  data: PropertyDetail[];
  message?: string;
  error?: {
    message: string;
  };
}

export interface NearbyLocationsResponse {
  success: boolean;
  data: {
    places: {
      placeId: string;
      name: string;
      address: string;
    }[];
  };
  places: {
    placeId: string;
    name: string;
    address: string;
  }[];
  message?: string;
  error?: {
    message: string;
  };
}

export type PropertyLikeResponse = {
  success: boolean;
  data: {
    propertyId: string;
    liked: boolean;
  };
  liked: boolean;
  message: string;
};

export interface PropertyListResponse {
  success: boolean;
  data: PropertyDetail[];
  message?: string;
  meta: PaginationMeta;
  error?: {
    message: string;
  };
}

export interface BarangayCityResponse {
  success: boolean;
  data: {
    data: {
      id: string;
      name: string;
      psgcCode: string;
    }[];
  };
  message?: string;
  error?: {
    message: string;
  };
}

export interface PropertyDetail {
  id: string;
  buildingSize: number;
  lotSize: number | null;
  floorArea: number | null;
  ceilingHeight: number | null;
  loadingDocks: number | null;
  numberOfBedrooms: number | null;
  numberOfBathrooms: number | null;
  numberOfParkingSpaces: number | null;
  hasSwimmingPool: boolean;
  hasGarden: boolean;
  hasTerrace: boolean;
  hasBalcony: boolean;
  hasSecurity: boolean;
  numberOfFloors: number | null;
  numberOfGarages: number | null;
  numberOfLivingRooms: number | null;
  numberOfDiningRooms: number | null;
  numberOfKitchens: number | null;
  numberOfMaidRooms: number | null;
  yearBuilt: number | null;
  furnishingStatus: string | null;
  property: PropertyDetails;
  isLiked: boolean;
}

export interface PropertyDetails {
  id: string;
  listingTitle: string;
  listingPrice: number;
  listingPriceFormatted: string;
  address: string;
  cityName: string;
  barangayName: string;
  longitude: number;
  latitude: number;
  propertyTypeName: string;
  listingTypeName: string;
  scrapeContactInfo: ScrapeContactInfo;
  images: PropertyImage[];
  listingDescription: string;
  listingDescriptionMarkdown: string;
}

interface ScrapeContactInfo {
  agentName: string;
  agencyName: string;
  extractedAt: string;
  phoneNumber: string;
  email: string;
}

export interface PropertyImage {
  id: string;
  imageUrl: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface AmenitiesAndFeaturesResponse {
  success: boolean;
  data: {
    data: AmenitiesAndFeatures[];
  };
  message?: string;
  error?: {
    message: string;
  };
}

export interface AmenitiesAndFeatures {
  id: string;
  name: string;
}

export interface CreateListingRequest {
  listingTypeId?: string;
  propertyTypeId?: string;
  streetAddress?: string;
  barangayId?: string;
  cityId?: string;
  region?: string;
  buildingName?: string;
  floorNumber?: number;
  floorArea?: number;
  furnishingStatus?: 'fully_furnished' | 'semi_furnished' | 'unfurnished';
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  numberOfParkingSpaces?: number;
  amenityIds?: string[];
  featureIds?: string[];
  photos: File[];
  lotSize?: number;
  ceilingHeight?: number;
  lotType?: string[];
  listingTitle?: string;
  listingDescription?: string;
  listingPrice?: number;
  listingPriceFormatted?: string;
  pricePerSqm?: number;
  longitude?: number;
  latitude?: number;
  isDraft: boolean;

  // House and Lot specific fields
  numberOfFloors?: number;
  numberOfGarages?: number;
  numberOfLivingRooms?: number;
  numberOfDiningRooms?: number;
  numberOfKitchens?: number;
  numberOfMaidRooms?: number;
  yearBuilt?: number;
  hasSwimmingPool?: boolean;
  hasGarden?: boolean;
  hasTerrace?: boolean;
  hasBalcony?: boolean;
  hasSecurity?: boolean;

  // Warehouse specific fields
  loadingDocks?: number;
  buildingSize?: number;
  securityFeatures?: string[];

  // Vacant Lot specific fields
  nearbyLocations?: string[];
}
