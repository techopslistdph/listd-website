export interface PropertyDetailResponse {
  success: boolean;
  data: PropertyDetail;
}

export interface PropertyListResponse {
  success: boolean;
  data: PropertyDetail[];
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
  property: PropertyDetails;
}

interface PropertyDetails {
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
