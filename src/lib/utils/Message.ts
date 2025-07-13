/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Conversation,
  ConversationListResponse,
  Message,
  MessageListResponse,
} from '../queries/server/messaging/types';
import { DraftConversation } from './draftConversation';

export interface Conversations {
  id: string;
  property: {
    image: string;
    name: string;
  };
  lastMessage: string;
  lastDate: string;
  isRead: boolean;
}

export interface PropertyDetails {
  propertyId: string;
  specificPropertyId: string;
  propertyType: string;
  image: string;
  name: string;
  location: string;
  price: string;
}

export interface Selected {
  user: {
    avatar: string;
    name: string;
    verified?: boolean;
  };
  propertyDetails: PropertyDetails;
  messages: Message[] | undefined;
}

// Types for optimistic messages
export interface OptimisticMessage {
  id: string;
  text: string;
  isMe: boolean;
  time: string;
  createdAt: number;
  isOptimistic: boolean;
  isFailed?: boolean;
  tempId: string;
}

// Handle selected conversation data
export const getSelectedData = (
  selectedId: string | null,
  draftConversation: DraftConversation | null,
  conversationData: any,
  messagesData: any | null,
  userId: string
) => {
  if (selectedId === 'draft' && draftConversation) {
    return {
      user: {
        name:
          draftConversation.property.property?.scrapeContactInfo?.agentName ||
          'Property Owner',
        avatar: '/images/profile.png',
        verified: true,
      },
      propertyDetails: {
        name: draftConversation.property.property?.listingTitle || 'Property',
        propertyId: draftConversation.property.property?.id,
        specificPropertyId: draftConversation.property.property?.id || '',
        propertyType:
          draftConversation.property.property?.propertyType?.name || '',
        location:
          draftConversation.property.property?.address ||
          `${draftConversation.property.property?.barangayName || ''} ${draftConversation.property.property?.cityName || ''}`,
        price:
          draftConversation.property.property?.listingPrice?.toLocaleString(
            'en-PH',
            {
              style: 'currency',
              currency: 'PHP',
            }
          ) || 'N/A',
        image:
          (draftConversation.property.property as any)?.imageUrl ||
          draftConversation.property.property.images[0]?.imageUrl ||
          '',
      },
      messages: [], // No messages for draft conversation
      isDraft: true,
      draftData: draftConversation,
    };
  }
  // Regular conversation data
  if (!conversationData?.data) return undefined;

  const getOtherUser = (conversation: Conversation) => {
    if (conversation?.initiator?.id === userId) {
      return conversation?.participant;
    } else {
      return conversation?.initiator;
    }
  };

  const otherUser = getOtherUser(conversationData.data as Conversation);
  return {
    user: {
      name: otherUser?.name || 'Unknown User',
      avatar: otherUser?.profile || '/images/profile.png',
      verified: true,
    },
    propertyDetails: {
      name: conversationData.data.propertyData?.property?.listingTitle,
      location:
        conversationData.data.propertyData?.property?.address ||
        `${conversationData.data.propertyData?.property?.barangayName || ''} ${conversationData.data.propertyData?.property?.cityName || ''}`,
      price:
        conversationData.data.propertyData?.property?.listingPrice.toLocaleString(
          'en-PH',
          {
            style: 'currency',
            currency: 'PHP',
          }
        ),
      image:
        (conversationData.data.propertyData?.property as any)?.imageUrl || '',
      propertyId: conversationData.data.propertyData?.property?.id || '',
      specificPropertyId: conversationData.data.propertyData?.id || '',
      propertyType:
        conversationData.data.propertyData?.property?.propertyType?.name || '',
    },
    messages: messagesData?.success
      ? (messagesData.data as unknown as MessageListResponse['data'])
      : [],
    isDraft: false,
  };
};

export const transformConversations = (
  conversationsData: any,
  userProfile: any
) => {
  return conversationsData?.success
    ? (
        conversationsData.data as unknown as ConversationListResponse['data']
      )?.map(conv => ({
        id: conv.id,
        property: {
          name: conv.propertyData?.property?.listingTitle,
          image: (conv.propertyData?.property as any)?.imageUrl || '',
        },
        lastMessage: conv.lastMessage?.content || 'No messages yet',
        lastDate: conv.lastMessage
          ? new Date(conv.lastMessage.createdAt).toLocaleDateString()
          : new Date(conv.createdAt).toLocaleDateString(),
        unreadCount: conv.unreadCount,
        isRead: conv.lastMessage
          ? conv.lastMessage.isRead ||
            conv.lastMessage.sender.id === userProfile?.data?.id
          : true,
      }))
    : [];
};

/**
 * Transform server messages to OptimisticMessage format for Chat component
 */
export const transformMessages = (
  messages: MessageListResponse['data'] | undefined,
  userId: string
): OptimisticMessage[] => {
  return (
    messages
      ?.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      ?.map((msg: MessageListResponse['data'][number]) => ({
        id: msg.id,
        text: msg.content,
        isMe: msg.sender.id === userId,
        time: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        createdAt: new Date(msg.createdAt).getTime(),
        isOptimistic: false,
        tempId: '',
      })) || []
  );
};

/**
 * Combine server messages with optimistic messages and sort by timestamp
 */
export const combineMessages = (
  serverMessages: OptimisticMessage[],
  optimisticMessages: OptimisticMessage[]
): OptimisticMessage[] => {
  return [...serverMessages, ...optimisticMessages].sort(
    (a, b) => a.createdAt - b.createdAt
  );
};

/**
 * Create an optimistic message for immediate display
 */
export const createOptimisticMessage = (
  text: string,
  isMe: boolean = true
): OptimisticMessage => {
  const tempId = `temp-${Date.now()}-${Math.random()}`;
  return {
    id: tempId,
    text,
    isMe,
    time: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    createdAt: Date.now(),
    isOptimistic: true,
    tempId,
  };
};

/**
 * Check if optimistic messages should be removed based on server confirmation
 */
export const shouldRemoveOptimisticMessage = (
  serverMessages: OptimisticMessage[],
  optimisticMessages: OptimisticMessage[]
): string[] => {
  if (!serverMessages || serverMessages.length === 0) return [];

  const latestServerMessage = serverMessages[serverMessages.length - 1];
  const tempIdsToRemove: string[] = [];

  // Only check if the latest message is from the current user (our sent message)
  if (latestServerMessage.isMe) {
    // Find and mark matching optimistic messages for removal
    optimisticMessages.forEach(optimisticMsg => {
      if (
        optimisticMsg.isMe &&
        optimisticMsg.text === latestServerMessage.text &&
        optimisticMsg.createdAt <= latestServerMessage.createdAt
      ) {
        tempIdsToRemove.push(optimisticMsg.tempId);
      }
    });
  }

  return tempIdsToRemove;
};

/**
 * Check for old optimistic messages that should be cleaned up
 */
export const getOldOptimisticMessages = (
  optimisticMessages: OptimisticMessage[],
  selectedId: string,
  maxAgeMs: number = 5000
): string[] => {
  if (
    optimisticMessages.length === 0 ||
    selectedId === 'draft' ||
    selectedId === ''
  ) {
    return [];
  }

  const now = Date.now();
  return optimisticMessages
    .filter(msg => msg.isOptimistic && now - msg.createdAt > maxAgeMs)
    .map(msg => msg.tempId);
};
