import { api, ApiError } from '@/lib/fetch-wrapper';
import { ErrorResponse } from '../type';
import {
  AmenitiesAndFeaturesResponse,
  PriceRangeResponse,
  PropertyDetailResponse,
  PropertyListResponse,
} from './type';
import { API_ENDPOINTS } from '../api-endpoints';
import { getClerkToken } from '@/lib/auth/clerk';

const getCondominiums = async (
  queryParams: string,
  sessionId: string | null
) => {
  try {
    if (sessionId) {
      const { jwt: token } = await getClerkToken();
      api.setAuthToken(token);
    }
    const response = await api.get<PropertyListResponse | ErrorResponse>(
      `${API_ENDPOINTS.condominium.list}?${queryParams}`
    );
    if ('error' in response) {
      return {
        success: false,
        data: null,
        message: response?.error?.message || 'An unexpected error occurred',
      };
    }

    return {
      success: true,
      data: {
        data: response.data.data,
        meta: response.data.meta,
      },
      message: 'Properties fetched successfully',
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

const getHouseAndLots = async (
  queryParams: string,
  sessionId: string | null
) => {
  try {
    if (sessionId) {
      const { jwt: token } = await getClerkToken();
      api.setAuthToken(token);
    }

    const response = await api.get<PropertyListResponse | ErrorResponse>(
      `${API_ENDPOINTS.houseAndLot.list}?${queryParams}`
    );

    if ('error' in response) {
      return {
        success: false,
        data: null,
        message: response?.error?.message || 'An unexpected error occurred',
      };
    }
    return {
      success: true,
      data: response.data,
      message: 'Properties fetched successfully',
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

const getWarehouses = async (queryParams: string, sessionId: string | null) => {
  try {
    if (sessionId) {
      const { jwt: token } = await getClerkToken();
      api.setAuthToken(token);
    }

    const response = await api.get<PropertyListResponse | ErrorResponse>(
      `${API_ENDPOINTS.warehouse.list}?${queryParams}`
    );
    if ('error' in response) {
      return {
        success: false,
        data: null,
        message: response?.error?.message || 'An unexpected error occurred',
      };
    }
    return {
      success: true,
      data: response.data,
      message: 'Properties fetched successfully',
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

const getLots = async (queryParams: string, sessionId: string | null) => {
  try {
    if (sessionId) {
      const { jwt: token } = await getClerkToken();
      api.setAuthToken(token);
    }

    const response = await api.get<PropertyListResponse | ErrorResponse>(
      `${API_ENDPOINTS.vacantLot.list}?${queryParams}`
    );
    if ('error' in response) {
      return {
        success: false,
        data: null,
        message: response?.error?.message || 'An unexpected error occurred',
      };
    }
    return {
      success: true,
      data: response.data,
      message: 'Properties fetched successfully',
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

const condominiumById = async (id: string, sessionId: string | null) => {
  try {
    if (sessionId) {
      const { jwt: token } = await getClerkToken();
      api.setAuthToken(token);
    }
    const response = await api.get<PropertyDetailResponse | ErrorResponse>(
      `${API_ENDPOINTS.condominium.byId(id)}`
    );

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        data: null,
        message: error.message,
      };
    }
    return {
      success: false,
      data: null,
      message: 'An unexpected error occurred',
    };
  }
};

const houseAndLotById = async (id: string, sessionId: string | null) => {
  try {
    if (sessionId) {
      const { jwt: token } = await getClerkToken();
      api.setAuthToken(token);
    }
    const response = await api.get<PropertyDetailResponse | ErrorResponse>(
      `${API_ENDPOINTS.houseAndLot.byId(id)}`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        data: null,
        message: error.message,
      };
    }

    return {
      success: false,
      data: null,
      message: 'An unexpected error occurred',
    };
  }
};

const warehouseById = async (id: string, sessionId: string | null) => {
  try {
    if (sessionId) {
      const { jwt: token } = await getClerkToken();
      api.setAuthToken(token);
    }
    const response = await api.get<PropertyDetailResponse | ErrorResponse>(
      `${API_ENDPOINTS.warehouse.byId(id)}`
    );

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        data: null,
        message: error.message,
      };
    }
    return {
      success: false,
      data: null,
      message: 'An unexpected error occurred',
    };
  }
};

const vacantLotById = async (id: string, sessionId: string | null) => {
  try {
    if (sessionId) {
      const { jwt: token } = await getClerkToken();
      api.setAuthToken(token);
    }
    const response = await api.get<PropertyDetailResponse | ErrorResponse>(
      `${API_ENDPOINTS.vacantLot.byId(id)}`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        data: null,
        message: error.message,
      };
    }
    return {
      success: false,
      data: null,
      message: 'An unexpected error occurred',
    };
  }
};

export const PROPERTY_TYPES_MAPPING = {
  condominium: getCondominiums,
  'house-and-lot': getHouseAndLots,
  warehouse: getWarehouses,
  'vacant-lot': getLots,
};

export const PROPERTY_TYPES_BY_ID_MAPPING = {
  condominium: condominiumById,
  'house-and-lot': houseAndLotById,
  warehouse: warehouseById,
  'vacant-lot': vacantLotById,
};

export type SearchParams = {
  property: keyof typeof PROPERTY_TYPES_MAPPING;
  type: string;
  search?: string;
  maxBedrooms?: string;
  minBedrooms?: string;
  minBathrooms?: string;
  maxBathrooms?: string;
  minPrice?: string;
  maxPrice?: string;
  minFloorArea?: string;
  maxFloorArea?: string;
  amenityIds?: string;
  featureIds?: string;
  propertyTypeId?: string;
  listingTypeId?: string;
  city?: string;
  barangay?: string;
  province?: string;
  minLatitude?: string;
  maxLatitude?: string;
  minLongitude?: string;
  maxLongitude?: string;
  latitude?: string;
  longitude?: string;
  radius?: string;
};

export const getProperties = async (
  { property, ...rest }: SearchParams,
  sessionId: string | null
) => {
  const fetchProperties = PROPERTY_TYPES_MAPPING[property];

  const queryParams = new URLSearchParams();

  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value);
    }
  });

  console.log('queryParams', queryParams);

  try {
    const response = (await fetchProperties(
      queryParams.toString(),
      sessionId
    )) as unknown as PropertyListResponse;

    return response;
  } catch (error) {
    return {
      success: false,
      data: null,
      message:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

export const getPropertyById = async ({
  property,
  id,
  sessionId,
}: {
  property: SearchParams['property'];
  id: string;
  sessionId: string | null;
}) => {
  const fetchProperty = PROPERTY_TYPES_BY_ID_MAPPING[property];
  const response = await fetchProperty(id, sessionId);
  return response;
};

export const getFeatures = async () => {
  try {
    const response = await api.get<
      AmenitiesAndFeaturesResponse | ErrorResponse
    >(`${API_ENDPOINTS.features.list}`);
    if ('error' in response) {
      return {
        success: false,
        data: null,
        message: response?.error?.message || 'An unexpected error occurred',
      };
    }

    // Filter out 'Other' and get unique feature names
    const uniqueFeatures = response.data.data
      .filter((feature: { name: string }) => feature.name !== 'Other')
      .filter(
        (feature: { name: string }, index: number, self: { name: string }[]) =>
          index ===
          self.findIndex((f: { name: string }) => f.name === feature.name)
      );

    return {
      success: true,
      data: {
        uniqueFeatures,
      },
      message: 'Features fetched successfully',
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        data: null,
        message: error.message,
      };
    }
    return {
      success: false,
      data: null,
      message:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

export const getAmenities = async () => {
  try {
    const response = await api.get<
      AmenitiesAndFeaturesResponse | ErrorResponse
    >(`${API_ENDPOINTS.amenities.list}`);
    if ('error' in response) {
      return {
        success: false,
        data: null,
        message: response?.error?.message || 'An unexpected error occurred',
      };
    }

    // Filter out 'Other' and get unique feature names
    const uniqueAmenities = response.data.data
      .filter((amenity: { name: string }) => amenity.name !== 'Other')
      .filter(
        (amenity: { name: string }, index: number, self: { name: string }[]) =>
          index ===
          self.findIndex((f: { name: string }) => f.name === amenity.name)
      );

    return {
      success: true,
      data: {
        uniqueAmenities,
      },
      message: 'Amenities fetched successfully',
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        data: null,
        message: error.message,
      };
    }
    return {
      success: false,
      data: null,
      message:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

export const getPriceRanges = async (
  propertyTypeId: string,
  listingTypeId: string,
  search?: string
) => {
  try {
    const response = await api.get<PriceRangeResponse | ErrorResponse>(
      `${API_ENDPOINTS.priceRange.list}?propertyTypeId=${propertyTypeId}&listingTypeId=${listingTypeId}&search=${search}`
    );

    if ('error' in response) {
      return {
        success: false,
        data: null,
        message: response?.error?.message || 'An unexpected error occurred',
      };
    }
    return {
      success: true,
      data: response.data,
      message: 'Price ranges fetched successfully',
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};
