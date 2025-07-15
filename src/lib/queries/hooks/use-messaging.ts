/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/queries';
import {
  ConversationListResponse,
  ConversationResponse,
  CreateConversationRequest,
  MessageListResponse,
  MessageResponse,
  SendMessageRequest,
  MarkMessageReadRequest,
} from '../server/messaging/types';
import { property } from './use-property';

const messaging = {
  createConversation: async (data: CreateConversationRequest) => {
    try {
      const response = await api.post<ConversationResponse>(
        '/api/messaging/conversations',
        data
      );

      return {
        success: true,
        data: response.data,
        message: 'Conversation created successfully',
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

  getConversations: async (params: { page?: number; limit?: number }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await api.get<ConversationListResponse>(
        `/api/messaging/conversations?${queryParams.toString()}`
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
      return {
        success: false,
        data: null,
        message: 'An unexpected error occurred',
      };
    }
  },

  getConversation: async (conversationId: string) => {
    try {
      const response = await api.get<ConversationResponse>(
        `/api/messaging/conversations/${conversationId}`
      );

      return {
        success: true,
        data: response.data,
        message: 'Conversation fetched successfully',
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

  sendMessage: async (conversationId: string, data: SendMessageRequest) => {
    try {
      //upload the attachments first
      const uploadedAttachments = data?.attachments?.map(
        async (attachment: any) => {
          const uploadResult = await property.uploadImage(attachment);
          if (!uploadResult.success) {
            throw new Error('Failed to upload attachment');
          }
          return {
            fileUrl: uploadResult.data,
            fileName: attachment?.name,
            fileSize: attachment?.size,
            fileType: attachment?.type,
          };
        }
      );
      const uploadedImages = uploadedAttachments
        ? await Promise.all(uploadedAttachments)
        : [];

      let messageData;
      if (uploadedImages.length > 0) {
        messageData = {
          content: data.content,
          attachments: uploadedImages,
        };
      } else {
        messageData = {
          content: data.content,
        };
      }

      const response = await api.post<MessageResponse>(
        `/api/messaging/conversations/${conversationId}/messages`,
        messageData
      );
      return {
        success: true,
        ...response.data,
        message: 'Message sent successfully',
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

  getMessages: async (
    conversationId: string,
    params: { page?: number; limit?: number }
  ) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await api.get<MessageListResponse>(
        `/api/messaging/conversations/${conversationId}/messages?${queryParams.toString()}`
      );

      return {
        success: true,
        ...response.data,
        message: 'Messages fetched successfully',
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

  markMessagesAsRead: async (data: MarkMessageReadRequest) => {
    try {
      const response = await api.post<{ success: boolean; message: string }>(
        '/api/messaging/messages/read',
        data
      );

      if ('error' in response) {
        return {
          success: false,
          data: null,
          message: 'An unexpected error occurred',
        };
      }

      return {
        success: true,
        message: 'Messages marked as read successfully',
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
};

// React Query hooks
export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateConversationRequest) => {
      return messaging.createConversation(data);
    },
    onSuccess: () => {
      // Invalidate ALL conversation queries (partial match)
      queryClient.invalidateQueries({
        queryKey: ['messaging', 'conversations'],
      });
    },
  });
};

export const useConversations = (
  params: { page?: number; limit?: number } = {}
) => {
  return useQuery({
    queryKey: ['messaging', 'conversations', params], // ✅ Include params
    queryFn: () => messaging.getConversations(params),
    refetchInterval: 10000,
  });
};

export const useConversation = (conversationId: string) => {
  return useQuery({
    queryKey: ['messaging', 'conversations', conversationId],
    queryFn: () => messaging.getConversation(conversationId),
    enabled: !!conversationId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      conversationId,
      data,
    }: {
      conversationId: string;
      data: SendMessageRequest;
    }) => {
      return messaging.sendMessage(conversationId, data);
    },
    onSuccess: (_, { conversationId }) => {
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({
        queryKey: ['messaging', 'conversations', conversationId, 'messages'],
      });
      // Invalidate ALL conversations queries (partial match)
      queryClient.invalidateQueries({
        queryKey: ['messaging', 'conversations'],
      });
    },
  });
};

export const useMessages = (
  conversationId: string,
  params: { page?: number; limit?: number } = {},
  options?: {
    refetchInterval?: number | false;
    refetchIntervalInBackground?: boolean;
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: [
      'messaging',
      'conversations',
      conversationId,
      'messages',
      params,
    ],
    queryFn: () => messaging.getMessages(conversationId, params),
    enabled: options?.enabled ?? !!conversationId,
    refetchInterval: options?.refetchInterval,
    refetchIntervalInBackground: options?.refetchIntervalInBackground,
  });
};

export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: MarkMessageReadRequest) => {
      return messaging.markMessagesAsRead(data);
    },
    onSuccess: () => {
      // Invalidate ALL conversations queries (partial match)
      queryClient.invalidateQueries({
        queryKey: ['messaging', 'conversations'],
      });
    },
  });
};
