/* eslint-disable @typescript-eslint/no-explicit-any */
import { api, ApiError } from '@/lib/fetch-wrapper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserSchemaType } from '@/components/profile/EditProfile';
import { ListingResponse } from './types/property';
import { UserProfileResponse, userValuationResponse } from './types/user';

const userProfile = {
  getProfile: async () => {
    try {
      const response = await api.get<UserProfileResponse>(`/api/users/profile`);
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
        message: 'User profile fetched successfully',
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

  updateProfile: async (data: UserSchemaType) => {
    try {
      const response = await api.put<UserProfileResponse>(
        `/api/users/profile`,
        {
          name: data.firstName + ' ' + data.lastName,
          ...data,
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
        data: response,
        message: 'User profile updated successfully',
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw new Error('An unexpected error occurred while updating profile');
    }
  },

  getUserLikedProperties: async () => {
    try {
      // use any for now
      const response = await api.get<any>(`/api/property-likes/my-likes`);

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
        message: 'Liked properties fetched successfully',
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
          error instanceof ApiError
            ? error.message
            : 'An unexpected error occurred while fetching liked properties',
      };
    }
  },

  getUserListings: async (params: {
    status: 'draft' | 'published' | 'closed';
  }) => {
    try {
      const response = await api.get<ListingResponse>(
        `/api/users/listings?status=${params.status}`
      );

      if ('error' in response) {
        return {
          success: false,
          data: [],
          message: response?.error?.message || 'An unexpected error occurred',
        };
      }

      return {
        success: true,
        ...response.data,
        message: 'User listings fetched successfully',
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          data: [],
          message: error.message,
        };
      }
      return {
        success: false,
        data: [],
        message: 'An unexpected error occurred',
      };
    }
  },

  getUserValuations: async () => {
    try {
      const response = await api.get<userValuationResponse>(`/api/valuations`);

      if ('error' in response) {
        return {
          success: false,
          data: [],
          message: response?.error?.message || 'An unexpected error occurred',
        };
      }

      return {
        success: true,
        data: response.data,
        message: 'User listings fetched successfully',
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          data: [],
          message: error.message,
        };
      }
      return {
        success: false,
        data: [],
        message: 'An unexpected error occurred',
      };
    }
  },
};

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => userProfile.getProfile(),
  });
};

export const useGetUserLikedProperties = () => {
  return useQuery({
    queryKey: ['userLikedProperties'],
    queryFn: () => userProfile.getUserLikedProperties(),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userProfile.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

export const useGetUserListings = (params: {
  status: 'draft' | 'published' | 'closed';
}) => {
  return useQuery({
    queryKey: ['userListings', params.status],
    queryFn: () => userProfile.getUserListings(params),
    enabled: !!params.status,
  });
};

export const useGetUserValuation = () => {
  return useQuery({
    queryKey: ['userValuation'],
    queryFn: () => userProfile.getUserValuations(),
  });
};
