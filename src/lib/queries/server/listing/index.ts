import { api } from '@/lib/fetch-wrapper';
import { ErrorResponse } from '../type';
import { API_ENDPOINTS } from '../api-endpoints';
import { BuildingDetails, BuildingPrediction } from './types';

// Types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  url?: string;
}

export interface Photo {
  url: string;
  caption?: string;
  order: number;
}

export interface CreateListingRequest {
  listingTypeId: string;
  propertyTypeId: string;
  streetAddress: string;
  barangayId: string;
  cityId: string;
  region: string;
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
  listingTitle: string;
  listingDescription: string;
  listingPrice: number;
  listingPriceFormatted: string;
  pricePerSqm: number;
  longitude: number;
  latitude: number;
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

interface LocationResponse {
  data: Array<{
    id: string;
    name: string;
    psgcCode: string;
  }> | null;
  total: number;
  page: number;
  pageSize: number;
}

interface AmenityResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Location queries
export const getCities = async (search: string) => {
  const response = await api.get<ApiResponse<LocationResponse> | ErrorResponse>(
    `${API_ENDPOINTS.locations.cities}?page=1&pageSize=10&search=${search}`
  );
  if ('error' in response) {
    throw new Error(response.error.message);
  }

  return response.data;
};

export const getBarangays = async (search: string, psgCode: string) => {
  const response = await api.get<ApiResponse<LocationResponse> | ErrorResponse>(
    `${API_ENDPOINTS.locations.barangays}?page=1&pageSize=10&search=${search}&cityPsgcCode=${psgCode}`
  );
  if ('error' in response) {
    throw new Error(response.error.message);
  }
  return response.data;
};

// Amenity queries
export const getAmenities = async () => {
  const response = await api.get<
    ApiResponse<AmenityResponse[]> | ErrorResponse
  >(API_ENDPOINTS.amenities.list);
  if ('error' in response) {
    throw new Error(response.error.message);
  }
  return response.data;
};

export const createAmenity = async (name: string) => {
  const response = await api.post<ApiResponse<AmenityResponse> | ErrorResponse>(
    API_ENDPOINTS.amenities.create,
    { name }
  );
  if ('error' in response) {
    throw new Error(response.error.message);
  }
  return response.data;
};

// Feature queries (similar to amenities)
export const getFeatures = async () => {
  const response = await api.get<
    ApiResponse<AmenityResponse[]> | ErrorResponse
  >(API_ENDPOINTS.features.list);
  if ('error' in response) {
    throw new Error(response.error.message);
  }
  return response.data;
};

export const createFeature = async (name: string) => {
  const response = await api.post<ApiResponse<AmenityResponse> | ErrorResponse>(
    API_ENDPOINTS.features.create,
    { name }
  );
  if ('error' in response) {
    throw new Error(response.error.message);
  }
  return response.data;
};

// Photo upload
export const uploadPhoto = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<ApiResponse<{ url: string }> | ErrorResponse>(
    API_ENDPOINTS.media.upload,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if ('error' in response) {
    throw new Error(response.error.message);
  }
  return response;
};

// Create listing functions
export const createCondominiumListing = async (data: CreateListingRequest) => {
  const response = await api.post<ApiResponse<unknown> | ErrorResponse>(
    API_ENDPOINTS.condominium.complete,
    data
  );
  if ('error' in response) {
    return { error: response.error.message };
  }
  return { response };
};

export const createWarehouseListing = async (data: CreateListingRequest) => {
  const response = await api.post<ApiResponse<unknown> | ErrorResponse>(
    API_ENDPOINTS.warehouse.complete,
    data
  );
  if ('error' in response) {
    return { error: response.error.message };
  }
  return { response };
};

export const createHouseAndLotListing = async (data: CreateListingRequest) => {
  const response = await api.post<ApiResponse<unknown> | ErrorResponse>(
    API_ENDPOINTS.houseAndLot.complete,
    data
  );
  if ('error' in response) {
    return { error: response.error.message };
  }
  return { response };
};

export const createVacantLotListing = async (data: CreateListingRequest) => {
  const response = await api.post<ApiResponse<unknown> | ErrorResponse>(
    API_ENDPOINTS.vacantLot.complete,
    data
  );
  if ('error' in response) {
    return { error: response.error.message };
  }
  return { response };
};

// Helper function to create listing based on property type
export const createListing = async (
  data: CreateListingRequest,
  propertyType: string
) => {
  try {
    // Then create the listing with the uploaded photos
    switch (propertyType.toLowerCase()) {
      case 'condominium':
        return createCondominiumListing(data);
      case 'warehouse':
        return createWarehouseListing(data);
      case 'house and lot':
        return createHouseAndLotListing(data);
      case 'vacant lot':
        return createVacantLotListing(data);
      default:
        throw new Error('Invalid property type');
    }
  } catch (error) {
    throw error;
  }
};

export const getBuildingSuggestions = async (query: string, jwt: string) => {
  api.setAuthToken(jwt);
  const response = await api.post<
    { success: boolean; data: BuildingPrediction[] } | ErrorResponse
  >(API_ENDPOINTS.building.autoComplete, { query });
  if ('error' in response) {
    console.log('error', response.error.message);
    return { error: response.error.message };
  }
  return response.data;
};

export const getBuildingDetails = async (placeId: string, jwt: string) => {
  api.setAuthToken(jwt);
  const response = await api.get<
    { success: boolean; data: BuildingDetails } | ErrorResponse
  >(`${API_ENDPOINTS.building.details(placeId)}`);
  if ('error' in response) {
    console.log('error', response.error.message);
    return { error: response.error.message };
  }
  return response.data;
};
