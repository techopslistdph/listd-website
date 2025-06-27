import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/queries';
import {
  NearbyPropertiesResponse,
  PropertyLikeResponse,
  PropertyListResponse,
} from '../server/propety/type';
import { SearchParams } from '../server/propety';

const property = {
  getNearbyProperties: async (location: {
    lat: number | null;
    lng: number | null;
  }) => {
    const { lat, lng } = location;
    try {
      const response = await api.get<NearbyPropertiesResponse>(
        `/api/nearby-properties?latitude=${lat}&longitude=${lng}&pageSize=15`
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
        ...response.data,
        message: 'Nearby Properties fetched successfully',
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
        message: 'An unexpected error occurred',
      };
    }
  },

  likeProperty: async (propertyId: string) => {
    try {
      const response = await api.post<PropertyLikeResponse>(
        `/api/property-likes/${propertyId}/toggle`
      );

      return {
        success: true,
        ...response.data,
        message: 'Property liked successfully',
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
        message: 'An unexpected error occurred',
      };
    }
  },
};

export const useNearbyProperties = (location: {
  lat: number | null;
  lng: number | null;
}) => {
  return useQuery({
    queryKey: ['nearby-properties', location.lat, location.lng],
    queryFn: () => property.getNearbyProperties(location),
    enabled: location.lat !== null && location.lng !== null,
  });
};

export const useLikeProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (propertyId: string) => {
      return property.likeProperty(propertyId);
    },
    onSuccess: () => {
      // Invalidate user liked properties
      queryClient.invalidateQueries({
        queryKey: ['userLikedProperties'],
      });

      // Invalidate general properties queries
      queryClient.invalidateQueries({
        queryKey: ['properties'],
      });
    },
  });
};

export const usePropertiesByType = (searchParams: SearchParams) => {
  return useQuery({
    queryKey: ['properties', searchParams],
    queryFn: async () => {
      const { property, ...rest } = searchParams;

      // Create query parameters
      const queryParams = new URLSearchParams();
      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value);
        }
      });

      // Determine the correct API endpoint based on property type
      const endpointMap = {
        condominium: '/api/condominiums',
        'house-and-lot': '/api/house-and-lots',
        warehouse: '/api/warehouses',
        'vacant-lot': '/api/vacant-lots',
      };

      const endpoint = endpointMap[property];
      if (!endpoint) {
        throw new Error(`Invalid property type: ${property}`);
      }

      const response = await api.get<PropertyListResponse>(
        `${endpoint}?${queryParams.toString()}`
      );

      return response.data;
    },
    enabled: !!searchParams.property, // Only run query if property type is specified
  });
};
