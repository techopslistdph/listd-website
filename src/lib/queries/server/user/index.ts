import { api, ApiError } from '@/lib/fetch-wrapper';
import { UserProfile, UserProfileResponse } from './types';
import { getClerkToken } from '@/lib/auth/clerk';
import { API_ENDPOINTS } from '../api-endpoints';

export const getUserProfile = async () => {
  const token = await getClerkToken();

  if (!token) {
    return {
      success: false,
      data: null,
      message: 'No token found - Unauthorized',
    };
  }
  api.setAuthToken(token.jwt);

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

export const updateUserProfile = async (data: UserProfile) => {
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
    const response = await api.put<UserProfileResponse>(
      API_ENDPOINTS.users.update,
      data
    );

    return {
      success: true,
      data: response.data,
      message: 'User profile updated successfully',
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
