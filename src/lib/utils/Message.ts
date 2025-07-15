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
  attachments?: any[];
}

// Add function to create optimistic conversation
export const createOptimisticConversation = (
  conversationId: string,
  property: any,
  lastMessage: string,
  tempId: string
): Conversations & { isOptimistic: boolean; tempId: string } => {
  return {
    id: conversationId,
    property: {
      name: property.listingTitle || 'Property',
      image:
        (property as any)?.imageUrl || property.images?.[0]?.imageUrl || '',
    },
    lastMessage,
    lastDate: 'Now',
    isRead: false,
    isOptimistic: true,
    tempId,
  };
};

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
          null,
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
        (conversationData.data.propertyData?.property as any)?.imageUrl || null,
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

// Update transformConversations to handle optimistic conversations
export const transformConversations = (
  conversationsData: any,
  userProfile: any,
  optimisticConversations: any[] = []
) => {
  const realConversations = conversationsData?.success
    ? (
        conversationsData.data as unknown as ConversationListResponse['data']
      )?.map(conv => ({
        id: conv.id,
        property: {
          name: conv.propertyData?.property?.listingTitle,
          image: (conv.propertyData?.property as any)?.imageUrl || '',
        },
        lastMessage:
          conv.lastMessage?.content ||
          (conv.lastMessage?.attachments ? 'Sent an image' : 'No messages yet'),
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

  return [...realConversations, ...optimisticConversations];
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
        attachments: msg.attachments,
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
 * Filter out optimistic messages that are likely duplicates to prevent flickering
 */
export const combineMessages = (
  serverMessages: OptimisticMessage[],
  optimisticMessages: OptimisticMessage[]
): OptimisticMessage[] => {
  // Filter out optimistic messages that have likely been confirmed by server
  const filteredOptimisticMessages = optimisticMessages.filter(
    optimisticMsg => {
      // Keep failed messages so user can retry
      if (optimisticMsg.isFailed) return true;

      // Quick check - if there's a very recent server message with same content,
      // temporarily hide the optimistic message to prevent flickering
      const hasRecentMatch = serverMessages.some(serverMsg => {
        const timeDiff = Math.abs(
          serverMsg.createdAt - optimisticMsg.createdAt
        );

        if (!serverMsg.isMe || timeDiff > 3000) return false; // Within 3 seconds only

        // For text messages, check exact text match
        if (optimisticMsg.text && serverMsg.text) {
          return (
            serverMsg.text === optimisticMsg.text &&
            (serverMsg.attachments?.length || 0) ===
              (optimisticMsg.attachments?.length || 0)
          );
        }

        // For image-only messages, be more careful with matching
        if (!optimisticMsg.text && !serverMsg.text) {
          const optAttachmentCount = optimisticMsg.attachments?.length || 0;
          const serverAttachmentCount = serverMsg.attachments?.length || 0;

          return (
            optAttachmentCount > 0 &&
            optAttachmentCount === serverAttachmentCount &&
            timeDiff < 2000 // Tighter window for image-only messages
          );
        }

        return false;
      });

      return !hasRecentMatch;
    }
  );

  const combined = [...serverMessages, ...filteredOptimisticMessages];

  // Sort by timestamp with stable sorting for same timestamps
  return combined.sort((a, b) => {
    const timeDiff = a.createdAt - b.createdAt;
    if (timeDiff !== 0) return timeDiff;

    // For same timestamp, prioritize server messages over optimistic
    if (a.isOptimistic && !b.isOptimistic) return 1;
    if (!a.isOptimistic && b.isOptimistic) return -1;

    return 0;
  });
};

/**
 * Create an optimistic message for immediate display
 */
export const createOptimisticMessage = (
  text: string,
  isMe: boolean = true,
  attachments?: any[]
): OptimisticMessage => {
  const now = Date.now();
  // Use a more deterministic temp ID based on content and timestamp
  const contentHash = text + (attachments?.length || 0);
  const tempId = `temp-${now}-${contentHash.length}`;

  const message = {
    id: tempId,
    text,
    isMe,
    time: new Date(now).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    createdAt: now,
    isOptimistic: true,
    tempId,
    attachments: attachments?.map((att, index) => ({
      ...att,
      // Ensure each attachment has a stable ID
      id: att.id || `${tempId}-attachment-${index}`,
    })),
  };

  return message;
};

/**
 * Check if optimistic messages should be removed based on server confirmation
 */
export const shouldRemoveOptimisticMessage = (
  serverMessages: OptimisticMessage[],
  optimisticMessages: OptimisticMessage[]
): string[] => {
  if (!serverMessages || serverMessages.length === 0) return [];

  const tempIdsToRemove: string[] = [];

  // Check each optimistic message against all server messages
  optimisticMessages.forEach(optimisticMsg => {
    if (!optimisticMsg.isMe || optimisticMsg.isFailed) return;

    // Find matching server messages within a reasonable time window
    const matchingServerMessage = serverMessages.find(serverMsg => {
      if (!serverMsg.isMe) return false;

      // Time-based matching - server message should be after optimistic message
      const isWithinTimeWindow =
        serverMsg.createdAt >= optimisticMsg.createdAt - 2000 && // Allow 2s before (clock differences)
        serverMsg.createdAt <= optimisticMsg.createdAt + 30000; // Allow 30s after

      if (!isWithinTimeWindow) return false;

      // Content matching
      const textMatches = optimisticMsg.text === serverMsg.text;
      const attachmentCountMatches =
        (optimisticMsg.attachments?.length || 0) ===
        (serverMsg.attachments?.length || 0);

      // For text messages, require exact text match
      if (optimisticMsg.text && serverMsg.text) {
        return textMatches && attachmentCountMatches;
      }

      // For image-only messages, match by attachment count and filename if available
      if (!optimisticMsg.text && !serverMsg.text && attachmentCountMatches) {
        // Additional validation for image messages
        if ((optimisticMsg.attachments?.length || 0) > 0) {
          // Try to match filenames if available
          const optimisticFileNames =
            optimisticMsg.attachments?.map(att => att.fileName) || [];
          const serverFileNames =
            serverMsg.attachments?.map(att => att.fileName) || [];

          // If we have filenames, use them for matching
          if (optimisticFileNames.length > 0 && serverFileNames.length > 0) {
            const filenamesMatch = optimisticFileNames.every(name =>
              serverFileNames.includes(name)
            );
            return filenamesMatch;
          }

          // Otherwise, just match by count and time window
          return true;
        }
      }

      return false;
    });

    if (matchingServerMessage) {
      tempIdsToRemove.push(optimisticMsg.tempId);
    }
  });

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
