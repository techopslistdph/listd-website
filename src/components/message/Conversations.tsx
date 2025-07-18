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
import { getSelectedData, transformConversations } from '@/lib/utils/Message';
import { useOptimisticMessages } from '@/hooks/useOptimisticMessages';
import Link from 'next/link';

// Add optimistic conversation interface
interface OptimisticConversation {
  id: string;
  property: {
    name: string;
    image: string;
  };
  lastMessage: string;
  lastDate: string;
  unreadCount: number;
  isRead: boolean;
  isOptimistic: boolean;
  tempId: string;
}

export default function Conversations({
  conversations,
}: {
  conversations: ConversationListResponse['data'] | null | undefined;
}) {
  const { data: userProfile } = useGetProfile();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draftConversation, setDraftConversation] =
    useState<ReturnType<typeof getDraftConversation>>(null);

  const [optimisticConversation, setOptimisticConversation] =
    useState<any>(null);
  const [optimisticConversations, setOptimisticConversations] = useState<
    OptimisticConversation[]
  >([]);
  const [hasCheckedDraft, setHasCheckedDraft] = useState(false);

  // Add optimistic messages hook
  const {
    optimisticMessages,
    addOptimisticMessage,
    removeOptimisticMessage,
    markAsFailed,
  } = useOptimisticMessages();

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

  // Add draft conversation to the list if it exists (but not if we have a pending conversation)
  const realConversations = transformConversations(
    conversationsData,
    userProfile
  );

  // Filter out optimistic conversations that now exist in real data
  const filteredOptimisticConversations = optimisticConversations.filter(
    optimisticConv =>
      !realConversations.some(realConv => realConv.id === optimisticConv.id)
  );

  const allConversations = draftConversation
    ? [
        {
          id: 'draft',
          property: {
            name:
              draftConversation.property.property?.listingTitle || 'Property',
            image:
              (draftConversation.property.property as any)?.imageUrl ||
              draftConversation.property.property.images[0]?.imageUrl ||
              '',
          },
          lastMessage: 'Start a conversation...',
          lastDate: 'Now',
          unreadCount: 0,
          isRead: false,
        },
        ...realConversations,
        ...filteredOptimisticConversations,
      ]
    : [...realConversations, ...filteredOptimisticConversations];

  const selected = getSelectedData(
    selectedId,
    draftConversation,
    conversationData,
    messagesData,
    userProfile?.data?.id || ''
  );

  // Override selected data with optimistic data when available
  const finalSelected = optimisticConversation || selected;

  // Determine if we should show loading state
  const shouldShowLoading = () => {
    // Don't show loading if we have optimistic data
    if (optimisticConversation) return false;

    // Don't show loading for draft conversations
    if (selectedId === 'draft') return false;

    // Show loading for real conversations that are loading
    return conversationLoading || messagesLoading;
  };

  // Handle conversation creation success
  const handleConversationCreated = (
    conversationId: string,
    messageContent: string
  ) => {
    // Create optimistic conversation data for the conversation list
    const optimisticConv: OptimisticConversation = {
      id: conversationId,
      property: {
        name: draftConversation?.property.property?.listingTitle || 'Property',
        image:
          (draftConversation?.property.property as any)?.imageUrl ||
          draftConversation?.property.property.images[0]?.imageUrl ||
          '',
      },
      lastMessage: messageContent,
      lastDate: 'Now',
      unreadCount: 0,
      isRead: false,
      isOptimistic: true,
      tempId: `conv-${Date.now()}`,
    };

    // Add optimistic conversation to the list
    setOptimisticConversations(prev => [...prev, optimisticConv]);

    // Create optimistic conversation data for the chat view
    const optimisticData = {
      id: conversationId,
      user: {
        name: draftConversation?.propertyOwnerName || 'Property Owner',
        avatar:
          draftConversation?.propertyOwnerProfile || '/images/profile.png',
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
          draftConversation?.property.property.images[0]?.imageUrl ||
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

  // Clear optimistic conversations when real conversations data loads
  useEffect(() => {
    if (optimisticConversations.length > 0 && conversationsData?.success) {
      // Remove optimistic conversations that now exist in real data
      const realConversationIds = new Set(
        (
          conversationsData.data as unknown as ConversationListResponse['data']
        )?.map(conv => conv.id) || []
      );

      setOptimisticConversations(prev =>
        prev.filter(conv => !realConversationIds.has(conv.id))
      );
    }
  }, [optimisticConversations.length, conversationsData]);

  if (conversationsLoading) {
    return <LoadingSpinner size='lg' />;
  }
  if (
    conversations?.length === 0 &&
    !selected &&
    !selectedId &&
    !draftConversation &&
    !optimisticConversation &&
    optimisticConversations.length === 0
  ) {
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
        selected={finalSelected}
        userId={userProfile?.data?.id || ''}
        isLoading={shouldShowLoading()}
        onConversationCreated={handleConversationCreated}
        optimisticMessages={optimisticMessages}
        onAddOptimisticMessage={addOptimisticMessage}
        onRemoveOptimisticMessage={removeOptimisticMessage}
        onMarkAsFailed={markAsFailed}
      />
    </div>
  );
}
