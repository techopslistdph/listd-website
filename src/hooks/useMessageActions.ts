/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import {
  useSendMessage,
  useCreateConversation,
} from '@/lib/queries/hooks/use-messaging';
import { createOptimisticMessage, OptimisticMessage } from '@/utils/Message';

interface AttachmentPreview {
  file: File;
  preview: string;
  id: string;
}

interface UseMessageActionsProps {
  selectedId: string;
  selected?: any;
  onConversationCreated?: (
    conversationId: string,
    messageContent: string
  ) => void;
  setInputValue: (value: string) => void;
  setAttachments: (attachments: AttachmentPreview[]) => void;
  attachments: AttachmentPreview[];
  // Add optimistic message handlers
  onAddOptimisticMessage: (message: OptimisticMessage) => void;
  onRemoveOptimisticMessage: (tempId: string) => void;
  onMarkAsFailed: (tempId: string) => void;
}

export function useMessageActions({
  selectedId,
  selected,
  onConversationCreated,
  setInputValue,
  setAttachments,
  attachments,
  onAddOptimisticMessage,
  onRemoveOptimisticMessage,
  onMarkAsFailed,
}: UseMessageActionsProps) {
  const sendMessage = useSendMessage();
  const createConversation = useCreateConversation();

  const handleSendMessage = useCallback(
    async (inputValue: string) => {
      if (!inputValue.trim() && attachments.length === 0) return;

      // Handle draft conversation
      if (selectedId === 'draft' && selected?.isDraft && selected?.draftData) {
        const { propertyId, propertyOwnerId } = selected.draftData;

        const optimisticMessage = createOptimisticMessage(
          inputValue,
          true,
          attachments.map(att => ({
            fileUrl: att.preview, // Use the preview URL for display
            fileName: att.file.name,
            fileType: att.file.type,
            id: att.id,
          }))
        );

        onAddOptimisticMessage(optimisticMessage);
        const messageContent = inputValue;
        setInputValue('');
        setAttachments([]);

        try {
          // Create conversation first using the IDs from URL
          const conversationResult = await createConversation.mutateAsync({
            propertyId: propertyId,
            participantId: propertyOwnerId,
          });

          if (conversationResult.success && conversationResult.data) {
            // Send message to the new conversation
            await sendMessage.mutateAsync({
              conversationId: conversationResult.data.id,
              data: {
                content: messageContent,
                attachments: attachments.map(att => att.file),
              },
            });

            // Remove the optimistic message after successful creation and sending
            onRemoveOptimisticMessage(optimisticMessage.tempId);

            // Notify parent component with message content
            onConversationCreated?.(conversationResult.data.id, messageContent);
          } else {
            console.error(
              'Failed to create conversation:',
              conversationResult.message
            );
            onMarkAsFailed(optimisticMessage.tempId);
          }
        } catch (error) {
          console.error(
            'Error creating conversation and sending message:',
            error
          );
          onMarkAsFailed(optimisticMessage.tempId);
        }
        return;
      }

      // Handle regular conversation
      if (!selectedId || selectedId === 'draft') return;

      const optimisticMessage = createOptimisticMessage(
        inputValue,
        true,
        attachments.map(att => ({
          fileUrl: att.preview, // Use the preview URL for display
          fileName: att.file.name,
          fileType: att.file.type,
          id: att.id,
        }))
      );

      onAddOptimisticMessage(optimisticMessage);
      setInputValue('');
      setAttachments([]);

      sendMessage.mutate(
        {
          conversationId: selectedId,
          data: {
            content: inputValue,
            attachments: attachments.map(att => att.file),
          },
        },
        {
          onError: () => {
            onMarkAsFailed(optimisticMessage.tempId);
          },
        }
      );
    },
    [
      selectedId,
      selected,
      attachments,
      onAddOptimisticMessage,
      onRemoveOptimisticMessage,
      onMarkAsFailed,
      sendMessage,
      createConversation,
      onConversationCreated,
      setInputValue,
      setAttachments,
    ]
  );

  const handleRetryMessage = useCallback(
    (tempId: string) => {
      // This function needs access to optimisticMessages which should be passed from the parent
      // For now, we'll return a function that can be called with the optimisticMessages
      return (optimisticMessages: OptimisticMessage[]) => {
        const failedMessage = optimisticMessages.find(
          msg => msg.tempId === tempId
        );
        if (!failedMessage) return;

        // Remove the failed message
        onRemoveOptimisticMessage(tempId);

        // Resend the message
        sendMessage.mutate(
          {
            conversationId: selectedId,
            data: { content: failedMessage.text },
          },
          {
            onError: () => {
              // Re-add as failed if it fails again
              onAddOptimisticMessage({ ...failedMessage, isFailed: true });
            },
          }
        );
      };
    },
    [selectedId, onRemoveOptimisticMessage, sendMessage, onAddOptimisticMessage]
  );

  return {
    handleSendMessage,
    handleRetryMessage,
    isPending: sendMessage.isPending || createConversation.isPending,
  };
}
