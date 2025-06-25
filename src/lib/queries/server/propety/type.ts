export interface PropertyDetailResponse {
  success: boolean;
  data: PropertyDetail;
  message?: string;
}

export interface NearbyPropertiesResponse {
  success: boolean;
  data: PropertyDetail[];
  message?: string;
}

export interface PropertyListResponse {
  success: boolean;
  data: PropertyDetail[];
  message?: string;
  meta: PaginationMeta;
}

export interface PropertyDetail {
  id: string;
  buildingSize: number;
  lotSize: number | null;
  floorArea: number | null;
  ceilingHeight: number | null;
  loadingDocks: number | null;
  isLiked: boolean;
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
