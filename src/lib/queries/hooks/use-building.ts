import { api } from '@/lib/fetch-wrapper';
import { useQuery } from '@tanstack/react-query';
import { BuildingSuggestionsResponse } from './types/building';

const building = {
  getBuildingSuggestions: async (query: string) => {
    try {
      const response = await api.post<BuildingSuggestionsResponse>(
        `/api/google-maps/address-autocomplete`,
        {
          query,
        }
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
        data: response.data?.predictions || [],
        message: 'Building suggestions fetched successfully',
      };
    } catch (error) {
      console.error('Error fetching building suggestions:', error);
      return {
        success: false,
        data: null,
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      };
    }
  },
  getAddressSuggestions: async (query: string) => {
    try {
      const response = await api.post<BuildingSuggestionsResponse>(
        `/api/google-maps/city-region-autocomplete`,
        {
          query,
        }
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
        data: response.data?.predictions || [],
        message: 'Building suggestions fetched successfully',
      };
    } catch (error) {
      console.error('Error fetching building suggestions:', error);
      return {
        success: false,
        data: null,
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      };
    }
  },
};

export const useBuildingSuggestions = (query: string) => {
  return useQuery({
    queryKey: ['building-suggestions', query],
    queryFn: () => building.getBuildingSuggestions(query),
    enabled: !!query, // Only run query if property type is specified
  });
};

export const useAddressSuggestions = (query: string) => {
  return useQuery({
    queryKey: ['address-suggestions', query],
    queryFn: () => building.getAddressSuggestions(query),
    enabled: !!query,
  });
};
