import { Attachment } from '@/lib/queries/server/messaging/types';
import { useState, useCallback, useRef, useMemo } from 'react';

interface OptimisticMessage {
  id: string;
  text: string;
  isMe: boolean;
  attachments?: Attachment[];
  time: string;
  isOptimistic: boolean;
  isFailed?: boolean;
  tempId: string;
  createdAt: number;
}

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

export function useOptimisticMessages() {
  const [optimisticMessages, setOptimisticMessages] = useState<
    OptimisticMessage[]
  >([]);
  const [optimisticConversations, setOptimisticConversations] = useState<
    OptimisticConversation[]
  >([]);
  const pendingMessagesRef = useRef<Set<string>>(new Set());
  const pendingConversationsRef = useRef<Set<string>>(new Set());

  const addOptimisticMessage = useCallback((message: OptimisticMessage) => {
    setOptimisticMessages(prev => [...prev, message]);
    pendingMessagesRef.current.add(message.tempId);
  }, []);

  const removeOptimisticMessage = useCallback((tempId: string) => {
    setOptimisticMessages(prev => prev.filter(msg => msg.tempId !== tempId));
    pendingMessagesRef.current.delete(tempId);
  }, []);

  const markAsFailed = useCallback((tempId: string) => {
    setOptimisticMessages(prev =>
      prev.map(msg =>
        msg.tempId === tempId ? { ...msg, isFailed: true } : msg
      )
    );
  }, []);

  const addOptimisticConversation = useCallback(
    (conversation: OptimisticConversation) => {
      setOptimisticConversations(prev => [...prev, conversation]);
      pendingConversationsRef.current.add(conversation.tempId);
    },
    []
  );

  const removeOptimisticConversation = useCallback((tempId: string) => {
    setOptimisticConversations(prev =>
      prev.filter(conv => conv.tempId !== tempId)
    );
    pendingConversationsRef.current.delete(tempId);
  }, []);

  const clearOptimisticMessages = useCallback(() => {
    setOptimisticMessages([]);
    pendingMessagesRef.current.clear();
  }, []);

  const clearOptimisticConversations = useCallback(() => {
    setOptimisticConversations([]);
    pendingConversationsRef.current.clear();
  }, []);

  const clearAllOptimistic = useCallback(() => {
    clearOptimisticMessages();
    clearOptimisticConversations();
  }, [clearOptimisticMessages, clearOptimisticConversations]);

  // Create stable references for the counts
  const messagesCount = useMemo(
    () => optimisticMessages.length,
    [optimisticMessages.length]
  );

  const conversationsCount = useMemo(
    () => optimisticConversations.length,
    [optimisticConversations.length]
  );

  return {
    optimisticMessages,
    optimisticConversations,
    addOptimisticMessage,
    removeOptimisticMessage,
    markAsFailed,
    addOptimisticConversation,
    removeOptimisticConversation,
    clearOptimisticMessages,
    clearOptimisticConversations,
    clearAllOptimistic,
    hasPendingMessages: pendingMessagesRef.current.size > 0,
    hasPendingConversations: pendingConversationsRef.current.size > 0,
    messagesCount,
    conversationsCount,
  };
}
