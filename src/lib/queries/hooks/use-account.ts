import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/fetch-wrapper';
import { toast } from 'sonner';

interface DeactivateAccountResponse {
  success: boolean;
  message: string;
  error?: {
    message: string;
  };
}

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

const accountService = {
  deactivateAccount: async (): Promise<DeactivateAccountResponse> => {
    try {
      const response = await api.patch<DeactivateAccountResponse>(
        '/api/users/deactivate'
      );

      if ('error' in response) {
        return {
          success: false,
          message: response.error?.message || 'Failed to deactivate account',
        };
      }

      return {
        success: true,
        message: 'Account deactivated successfully',
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
  activateAccount: async (): Promise<DeactivateAccountResponse> => {
    try {
      const response = await api.patch<DeactivateAccountResponse>(
        '/api/users/deactivate?lock=false'
      );

      if ('error' in response) {
        return {
          success: false,
          message: response.error?.message || 'Failed to deactivate account',
        };
      }

      return {
        success: true,
        message: 'Account deactivated successfully',
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

  deleteAccount: async (): Promise<DeactivateAccountResponse> => {
    try {
      const response =
        await api.delete<DeactivateAccountResponse>('/api/users/account');

      if ('error' in response) {
        return {
          success: false,
          message: response.error?.message || 'Failed to delete account',
        };
      }

      return {
        success: true,
        message: 'Account deleted successfully',
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

export const useDeactivateAccount = () => {
  return useMutation({
    mutationFn: accountService.deactivateAccount,
    onSuccess: data => {
      if (data.success) {
        toast.success(data.message);
        // Redirect to logout or home page after deactivation
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error('Failed to deactivate account. Please try again.');
    },
  });
};

export const useActivateAccount = () => {
  return useMutation({
    mutationFn: accountService.activateAccount,
    onSuccess: data => {
      if (data.success) {
        toast.success(data.message);
        // Redirect to login page after activation
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error('Failed to deactivate account. Please try again.');
    },
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: accountService.deleteAccount,
    onSuccess: data => {
      if (data.success) {
        toast.success(data.message);
        // Redirect to logout or home page after deletion
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } else {
        toast.error(data.message);
      }
    },
  });
};

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountService.updatePassword,
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
