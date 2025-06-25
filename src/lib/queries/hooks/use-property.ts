import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/queries';
import { NearbyPropertiesResponse } from '../server/propety/type';

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

export const useLikeProperty = (propertyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/property-likes/${propertyId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to like property');
      }

      const data = await response.json();
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nearby-properties'] });
    },
  });
};
// export function useNearbyPropertiesMutation() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: property.getNearbyProperties,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['nearby-properties'] });
//     },
//   });
// }
