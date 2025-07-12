/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import {
  useConversations,
  useConversation,
  useMessages,
  useMarkMessagesAsRead,
} from '@/lib/queries/hooks/use-messaging';
import Chat from '@/components/message/Chat';
import LoadingSpinner from '@/components/ui/loading-spinner';
import {
  ConversationListResponse,
  MessageListResponse,
} from '@/lib/queries/server/messaging/types';
import { useGetProfile } from '@/lib/queries/hooks/use-user-profile';
import {
  getDraftConversation,
  clearDraftConversation,
} from '@/lib/utils/draftConversation';
import Link from 'next/link';
import { getSelectedData, transformConversations } from '@/lib/utils/Message';

export default function MessagePage() {
  const { data: userProfile } = useGetProfile();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draftConversation, setDraftConversation] =
    useState<ReturnType<typeof getDraftConversation>>(null);
  // const [pendingConversationId, setPendingConversationId] = useState<
  //   string | null
  // >(null);
  const [optimisticConversation, setOptimisticConversation] =
    useState<any>(null);
  const [hasCheckedDraft, setHasCheckedDraft] = useState(false);

  // Check for draft conversation on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const draft = getDraftConversation();
    if (draft) {
      setDraftConversation(draft);
      setSelectedId('draft');
    }
    setHasCheckedDraft(true);
  }, []);

  // Check if there's an existing conversation with the same property and owner
  const { data: conversationsData, isLoading: conversationsLoading } =
    useConversations({
      page: 1,
      limit: 20,
    });

  // Check for existing conversation when draft is loaded
  useEffect(() => {
    if (draftConversation && conversationsData?.success) {
      const existingConversation = (
        conversationsData.data as unknown as ConversationListResponse['data']
      )?.find(
        conv =>
          conv.propertyId === draftConversation.propertyId &&
          (conv.participant.id === draftConversation.propertyOwnerId ||
            conv.initiator.id === draftConversation.propertyOwnerId)
      );

      if (existingConversation) {
        setSelectedId(existingConversation.id);
        setDraftConversation(null);
        clearDraftConversation();
      }
    }
  }, [draftConversation, conversationsData]);

  // Set first conversation as selected when data loads (only if no draft and no existing selection)
  useEffect(() => {
    // Only auto-select if there is NO draft and NO selection
    if (!hasCheckedDraft) return; // Wait until draft check is done
    if (draftConversation || selectedId) return;

    if (
      conversationsData?.success &&
      (conversationsData.data as unknown as ConversationListResponse['data'])
        ?.length > 0
    ) {
      setSelectedId(
        (
          conversationsData.data as unknown as ConversationListResponse['data']
        )[0]?.id as unknown as string
      );
    }
  }, [conversationsData, selectedId, draftConversation, hasCheckedDraft]);

  // Fetch selected conversation details (only for real conversations)
  const { data: conversationData, isLoading: conversationLoading } =
    useConversation(selectedId === 'draft' ? '' : selectedId || '');

  const { data: messagesData, isLoading: messagesLoading } = useMessages(
    selectedId === 'draft' ? '' : selectedId || '',
    { page: 1, limit: 50 },
    {
      refetchInterval: selectedId && selectedId !== 'draft' ? 10000 : false,
      enabled: selectedId !== 'draft' && !!selectedId,
    }
  );

  // Mark messages as read when conversation is selected
  const { mutate: markMessagesAsRead } = useMarkMessagesAsRead();
  useEffect(() => {
    if (selectedId === 'draft') return;

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
        messageIds: [lastMessage.id],
      });
    }
  }, [selectedId, messagesData, userProfile?.data?.id, markMessagesAsRead]);

  // Transform conversations data

  // Add draft conversation to the list if it exists (but not if we have a pending conversation)
  const allConversations = draftConversation
    ? [
        {
          id: 'draft',
          property: {
            name:
              draftConversation.property.property?.listingTitle || 'Property',
            image:
              (draftConversation.property.property as any)?.imageUrl ||
              draftConversation.property.property.images[0].imageUrl ||
              '',
          },
          lastMessage: 'Start a conversation...',
          lastDate: 'Now',
          unreadCount: 0,
          isRead: false,
        },
        ...transformConversations(conversationsData, userProfile),
      ]
    : transformConversations(conversationsData, userProfile);

  const selected = getSelectedData(
    selectedId,
    draftConversation,
    conversationData,
    messagesData,
    userProfile?.data?.id || ''
  );

  // Handle conversation creation success
  const handleConversationCreated = (
    conversationId: string,
    messageContent: string
  ) => {
    // Create optimistic conversation data
    const optimisticData = {
      id: conversationId,
      user: {
        name:
          draftConversation?.property.property?.scrapeContactInfo?.agentName ||
          'Property Owner',
        avatar: '/images/profile.png',
        verified: true,
      },
      propertyDetails: {
        name: draftConversation?.property.property?.listingTitle || 'Property',
        propertyId: draftConversation?.property.property?.id || '',
        specificPropertyId: draftConversation?.property.property?.id || '',
        propertyType:
          draftConversation?.property.property?.propertyType?.name || '',
        location:
          draftConversation?.property.property?.address ||
          `${draftConversation?.property.property?.barangayName || ''} ${draftConversation?.property.property?.cityName || ''}`,
        price:
          draftConversation?.property.property?.listingPrice?.toLocaleString(
            'en-PH',
            {
              style: 'currency',
              currency: 'PHP',
            }
          ) || 'N/A',
        image:
          (draftConversation?.property.property as any)?.imageUrl ||
          draftConversation?.property.property.images[0].imageUrl ||
          '',
      },
      messages: [
        {
          id: `temp-${Date.now()}`,
          content: messageContent,
          sender: { id: userProfile?.data?.id || '' },
          createdAt: new Date().toISOString(),
          isRead: false,
        },
      ],
    };

    setOptimisticConversation(optimisticData);
    setSelectedId(conversationId);
    setDraftConversation(null);
    clearDraftConversation();
  };

  // Clear optimistic data when real data loads
  useEffect(() => {
    if (optimisticConversation && conversationData?.success) {
      setOptimisticConversation(null);
    }
  }, [optimisticConversation, conversationData]);

  if (conversationsLoading) {
    return <LoadingSpinner size='lg' />;
  }

  if (allConversations.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-[50vh] md:h-[80vh]'>
        <p className='text-4xl md:text-5xl lg:text-6xl font-bold text-primary-main'>
          Listd
        </p>
        <h2 className='text-base lg:text-xl font-medium text-center my-2'>
          You have no messages yet.
        </h2>
        <Link
          href='/'
          className='text-sm font-medium text-center text-primary-main'
        >
          Browse Properties
        </Link>
      </div>
    );
  }

  return (
    <div className='container max-w-[1300px] mx-auto'>
      <Chat
        conversations={allConversations}
        selectedId={selectedId || ''}
        setSelectedId={setSelectedId}
        selected={selected}
        userId={userProfile?.data?.id || ''}
        isLoading={conversationLoading || messagesLoading}
        onConversationCreated={handleConversationCreated}
      />
    </div>
  );
}
