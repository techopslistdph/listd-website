/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';
import {
  useConversations,
  useConversation,
  useMessages,
  useMarkMessagesAsRead,
} from '@/lib/queries/hooks/use-messaging';
import { useGetProfile } from '@/lib/queries/hooks/use-user-profile';
import {
  getDraftConversation,
  clearDraftConversation,
} from '@/lib/utils/draftConversation';
import { getSelectedData, transformConversations } from '@/lib/utils/Message';
import {
  ConversationListResponse,
  MessageListResponse,
} from '@/lib/queries/server/messaging/types';

export function useMessaging() {
  const { data: userProfile } = useGetProfile();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ReturnType<
    typeof getDraftConversation
  > | null>(null);
  const [optimisticConversation, setOptimisticConversation] = useState<any>(
    null
  );

  // Initial check for a draft conversation from local storage
  useEffect(() => {
    const draftConversation = getDraftConversation();
    if (draftConversation) {
      setDraft(draftConversation);
      setSelectedId('draft');
    }
  }, []);

  const {
    data: conversationsData,
    isLoading: conversationsLoading,
    refetch: refetchConversations,
  } = useConversations({
    page: 1,
    limit: 20,
  });

  // When conversations load, check if the draft corresponds to an existing conversation
  useEffect(() => {
    if (draft && conversationsData?.success) {
      const existing = (
        conversationsData.data as unknown as ConversationListResponse['data']
      )?.find(
        c =>
          c.propertyId === draft.propertyId &&
          (c.participant.id === draft.propertyOwnerId ||
            c.initiator.id === draft.propertyOwnerId)
      );

      if (existing) {
        setSelectedId(existing.id);
        setDraft(null);
        clearDraftConversation();
      }
    }
  }, [draft, conversationsData]);

  // Set the default selected conversation
  useEffect(() => {
    if (
      !selectedId &&
      !draft &&
      conversationsData?.success &&
      (conversationsData.data as unknown as ConversationListResponse['data'])
        ?.length > 0
    ) {
      setSelectedId(
        (
          conversationsData.data as unknown as ConversationListResponse['data']
        )[0]?.id
      );
    }
  }, [conversationsData, selectedId, draft]);

  const isDraftSelected = selectedId === 'draft';
  const conversationId = isDraftSelected ? '' : selectedId || '';

  const { data: conversationData, isLoading: conversationLoading } =
    useConversation(conversationId);
  const { data: messagesData, isLoading: messagesLoading } = useMessages(
    conversationId,
    { page: 1, limit: 50 },
    {
      refetchInterval: !isDraftSelected && !!selectedId ? 10000 : false,
      enabled: !isDraftSelected && !!selectedId,
    }
  );

  const { mutate: markMessagesAsRead } = useMarkMessagesAsRead();

  // Effect to mark messages as read
  useEffect(() => {
    if (isDraftSelected || !messagesData?.success) return;

    const messages =
      (messagesData.data as unknown as MessageListResponse['data']) || [];
    const lastMessage = messages[messages.length - 1];

    if (
      lastMessage &&
      !lastMessage.isRead &&
      lastMessage.sender.id !== userProfile?.data?.id
    ) {
      markMessagesAsRead({ messageIds: [lastMessage.id] });
    }
  }, [
    selectedId,
    messagesData,
    userProfile?.data?.id,
    markMessagesAsRead,
    isDraftSelected,
  ]);

  const allConversations = useMemo(() => {
    const transformed = transformConversations(conversationsData, userProfile);
    if (draft) {
      return [
        {
          id: 'draft',
          property: {
            name: draft.property.property?.listingTitle || 'Property',
            image:
              (draft.property.property as any)?.imageUrl ||
              draft.property.property.images[0]?.imageUrl ||
              '',
          },
          lastMessage: 'Start a conversation...',
          lastDate: 'Now',
          unreadCount: 0,
          isRead: false,
        },
        ...transformed,
      ];
    }
    return transformed;
  }, [conversationsData, userProfile, draft]);

  const selected = useMemo(
    () =>
      getSelectedData(
        selectedId,
        draft,
        conversationData,
        messagesData,
        userProfile?.data?.id || ''
      ),
    [selectedId, draft, conversationData, messagesData, userProfile?.data?.id]
  );

  const handleConversationCreated = (
    conversationId: string,
    messageContent: string
  ) => {
    const optimisticData = {
      id: conversationId,
      user: {
        name:
          draft?.property.property?.scrapeContactInfo?.agentName ||
          'Property Owner',
        avatar: '/images/profile.png',
        verified: true,
      },
      propertyDetails: {
        name: draft?.property.property?.listingTitle || 'Property',
        propertyId: draft?.property.property?.id || '',
        specificPropertyId: draft?.property.property?.id || '',
        propertyType: draft?.property.property?.propertyType?.name || '',
        location:
          draft?.property.property?.address ||
          `${draft?.property.property?.barangayName || ''} ${draft?.property.property?.cityName || ''}`,
        price:
          draft?.property.property?.listingPrice?.toLocaleString('en-PH', {
            style: 'currency',
            currency: 'PHP',
          }) || 'N/A',
        image:
          (draft?.property.property as any)?.imageUrl ||
          draft?.property.property.images[0]?.imageUrl ||
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
    setDraft(null);
    clearDraftConversation();
    refetchConversations();
  };

  useEffect(() => {
    if (optimisticConversation && conversationData?.success) {
      setOptimisticConversation(null);
    }
  }, [optimisticConversation, conversationData]);

  return {
    userProfile,
    allConversations,
    selectedId,
    setSelectedId,
    selected: optimisticConversation || selected,
    isLoading:
      conversationsLoading ||
      (!!selectedId && !isDraftSelected && (conversationLoading || messagesLoading)),
    handleConversationCreated,
  };
}
