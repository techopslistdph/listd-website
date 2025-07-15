import { api, ApiError } from '@/lib/fetch-wrapper';
import { API_ENDPOINTS } from '../api-endpoints';
import { getClerkToken } from '@/lib/auth/clerk';
import { ConversationListResponse } from './types';

export const getConversations = async (page: number, limit: number) => {
  try {
    const { jwt: token } = await getClerkToken();
    api.setAuthToken(token);

    const response = await api.get<ConversationListResponse>(
      `${API_ENDPOINTS.messaging.conversations(page, limit)}`
    );

    return {
      success: true,
      ...response.data,
      message: 'Conversations fetched successfully',
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        data: null,
        message: error.message,
      };
    }
  }
};
