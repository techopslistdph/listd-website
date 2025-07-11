/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import {
  useConversations,
  useConversation,
  useMessages,
  useMarkMessagesAsRead,
  // useMarkMessagesAsRead,
} from '@/lib/queries/hooks/use-messaging';
import Chat from '@/components/message/Chat';
import LoadingSpinner from '@/components/ui/loading-spinner';
import {
  Conversation,
  ConversationListResponse,
  MessageListResponse,
} from '@/lib/queries/server/messaging/types';
import { useGetProfile } from '@/lib/queries/hooks/use-user-profile';

export default function MessagePage() {
  const { data: userProfile } = useGetProfile();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Fetch conversations
  const { data: conversationsData, isLoading: conversationsLoading } =
    useConversations({
      page: 1,
      limit: 20,
    });

  // Set first conversation as selected when data loads
  useEffect(() => {
    if (
      conversationsData?.success &&
      (conversationsData.data as unknown as ConversationListResponse['data'])
        ?.length &&
      (conversationsData.data as unknown as ConversationListResponse['data'])
        ?.length > 0 &&
      !selectedId
    ) {
      setSelectedId(
        (
          conversationsData.data as unknown as ConversationListResponse['data']
        )[0]?.id as unknown as string
      );
    }
  }, [conversationsData, selectedId]);

  // Fetch selected conversation details
  const { data: conversationData, isLoading: conversationLoading } =
    useConversation(selectedId || '');

  const { data: messagesData, isLoading: messagesLoading } = useMessages(
    selectedId || '',
    { page: 1, limit: 50 },
    {
      refetchInterval: selectedId ? 10000 : false,
    }
  );

  // Mark messages as read when conversation is selected
  const { mutate: markMessagesAsRead } = useMarkMessagesAsRead();
  useEffect(() => {
    const messages = messagesData?.success
      ? (messagesData.data as unknown as MessageListResponse['data'])
      : [];
    if (!messages || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage &&
      !lastMessage.isRead &&
      lastMessage.sender.id !== userProfile?.data?.id
    ) {
      markMessagesAsRead({
        messageIds: [lastMessage.id], // Only the last message
      });
    }
  }, [selectedId, messagesData, userProfile?.data?.id, markMessagesAsRead]);

  // Transform data for Chat component
  const transformedConversations = conversationsData?.success
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

  // Determine if current user is initiator or participant and get the other user's info
  const getOtherUser = (conversation: Conversation) => {
    if (conversation?.initiator?.id === userProfile?.data?.id) {
      return conversation?.participant;
    } else {
      return conversation?.initiator;
    }
  };

  const otherUser = getOtherUser(conversationData?.data as Conversation);
  const selected = conversationData?.data
    ? {
        user: {
          name: otherUser?.name || 'Unknown User',
          avatar: otherUser?.profile || '/images/profile.png',
          verified: true,
        },
        propertyDetails: {
          name: conversationData?.data?.propertyData?.property?.listingTitle,
          location:
            conversationData?.data?.propertyData?.property?.address ||
            `${conversationData?.data?.propertyData?.property?.barangayName || ''} ${conversationData?.data?.propertyData?.property?.cityName || ''}`,
          price:
            conversationData?.data?.propertyData?.property?.listingPrice.toLocaleString(
              'en-PH',
              {
                style: 'currency',
                currency: 'PHP',
              }
            ),
          image:
            (conversationData?.data?.propertyData?.property as any)?.imageUrl ||
            '',
        },
        messages: messagesData?.success
          ? (messagesData.data as unknown as MessageListResponse['data'])
          : [],
      }
    : undefined;

  if (conversationsLoading) {
    return <LoadingSpinner size='lg' />;
  }
  return (
    <div className='container max-w-[1300px] mx-auto'>
      <Chat
        conversations={transformedConversations}
        selectedId={selectedId || ''}
        setSelectedId={setSelectedId}
        selected={selected}
        userId={userProfile?.data?.id || ''}
        isLoading={conversationLoading || messagesLoading}
      />
    </div>
  );
}
