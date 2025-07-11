import { useState, useCallback, useRef, useMemo } from 'react';

interface OptimisticMessage {
  id: string;
  text: string;
  isMe: boolean;
  time: string;
  isOptimistic: boolean;
  isFailed?: boolean;
  tempId: string;
  createdAt: number;
}

export function useOptimisticMessages() {
  const [optimisticMessages, setOptimisticMessages] = useState<
    OptimisticMessage[]
  >([]);
  const pendingMessagesRef = useRef<Set<string>>(new Set());

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

  const clearOptimisticMessages = useCallback(() => {
    setOptimisticMessages([]);
    pendingMessagesRef.current.clear();
  }, []);

  // Create a stable reference for the messages count
  const messagesCount = useMemo(
    () => optimisticMessages.length,
    [optimisticMessages.length]
  );

  return {
    optimisticMessages,
    addOptimisticMessage,
    removeOptimisticMessage,
    markAsFailed,
    clearOptimisticMessages,
    hasPendingMessages: pendingMessagesRef.current.size > 0,
    messagesCount, // Add this stable reference
  };
}
