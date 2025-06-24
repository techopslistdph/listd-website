import { api, ApiError } from '@/lib/fetch-wrapper';
import { UserProfileResponse } from '../server/user/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserSchemaType } from '@/components/profile/EditProfile';

const userProfile = {
  getProfile: async () => {
    try {
      const response = await api.get<UserProfileResponse>(`/api/users/profile`);
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
      const response = await api.put(`/api/users/profile`, {
        name: data.firstName + ' ' + data.lastName,
        ...data,
      });

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
};

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => userProfile.getProfile(),
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
