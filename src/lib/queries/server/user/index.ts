import { api, ApiError } from '@/lib/fetch-wrapper';
import { UserProfileResponse } from './types';
import { getClerkToken } from '@/lib/auth/clerk';
import { API_ENDPOINTS } from '../api-endpoints';

export const getUserProfile = async () => {
  const { jwt: token } = await getClerkToken();

  if (!token) {
    return {
      success: false,
      data: null,
      message: 'No token found - Unauthorized',
    };
  }
  api.setAuthToken(token);

  try {
    const response = await api.get<UserProfileResponse>(API_ENDPOINTS.users.me);

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
};
