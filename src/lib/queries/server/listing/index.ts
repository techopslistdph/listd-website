import { api, ApiError } from '@/lib/fetch-wrapper';
import { API_ENDPOINTS } from '../api-endpoints';
import { getClerkToken } from '@/lib/auth/clerk';
import { ListingResponse } from '../../hooks/types/property';

export const getUserListings = async (status: string) => {
  try {
    const { jwt: token } = await getClerkToken();
    api.setAuthToken(token);

    const response = await api.get<ListingResponse>(
      `${API_ENDPOINTS.users.listing(status)}`
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
      message: 'Listings fetched successfully',
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
};
