import { api, ApiError } from '@/lib/fetch-wrapper';
import { API_ENDPOINTS } from '../api-endpoints';
import { getClerkToken } from '@/lib/auth/clerk';
import { UserProfileResponse } from '../../hooks/types/user';

export const getUser = async () => {
  try {
    const { jwt: token } = await getClerkToken();
    api.setAuthToken(token);

    const response = await api.get<UserProfileResponse>(API_ENDPOINTS.users.me);
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
      message: 'User fetched successfully',
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
};
