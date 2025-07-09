import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/fetch-wrapper';
import { toast } from 'sonner';

interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

interface PasswordUpdateResponse {
  success: boolean;
  message: string;
  error?: {
    message: string;
  };
}

const passwordService = {
  updatePassword: async (
    data: PasswordUpdateData
  ): Promise<PasswordUpdateResponse> => {
    try {
      const response = await api.put<PasswordUpdateResponse>(
        '/api/user/password',
        data
      );

      if ('error' in response) {
        return {
          success: false,
          message: response.error?.message || 'Failed to update password',
        };
      }

      return {
        success: true,
        message: 'Password updated successfully',
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          message: error.message,
        };
      }
      return {
        success: false,
        message: 'An unexpected error occurred',
      };
    }
  },
};

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: passwordService.updatePassword,
    onSuccess: data => {
      if (data.success) {
        toast.success(data.message);
        // Invalidate user profile to refresh any password-related info
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      } else {
        toast.error(data.message);
      }
    },
    onError: error => {
      console.log('error', error);
      toast.error('Failed to update password. Please try again.');
    },
  });
};
