/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import verified from '@/../public/images/icons/verified.png';
import Link from 'next/link';
import { ChevronRight, AlertCircle, ArrowLeft } from 'lucide-react';
// import file from '@/../public/images/icons/file.svg';
// import image from '@/../public/images/icons/image.svg';
import { Input } from '../ui/input';
import send from '@/../public/images/icons/send.svg';
import {
  useMarkMessagesAsRead,
  useSendMessage,
  useCreateConversation,
} from '@/lib/queries/hooks/use-messaging';
import { useOptimisticMessages } from '@/hooks/useOptimisticMessages';
import { DraftConversation } from '@/lib/utils/draftConversation';
import {
  combineMessages,
  Conversations,
  createOptimisticMessage,
  getOldOptimisticMessages,
  Selected,
  shouldRemoveOptimisticMessage,
  transformMessages,
} from '@/lib/utils/Message';
import {
  ChatSkeletonDesktop,
  ConversationsSkeletonMobile,
  MessagesSkeletonMobile,
  PropertyCardSkeleton,
} from './Skeleton';
import { Skeleton } from '../ui/skeleton';

interface ChatProps {
  conversations: Conversations[];
  selectedId: string;
  setSelectedId: (id: string) => void;
  selected?: Selected & {
    isDraft?: boolean;
    draftData?: DraftConversation;
  };
  isLoading: boolean;
  userId: string;
  onConversationCreated?: (
    conversationId: string,
    messageContent: string
  ) => void;
}

export default function Chat({
  conversations,
  selectedId,
  setSelectedId,
  selected,
  isLoading,
  userId,
  onConversationCreated,
}: ChatProps) {
  const [inputValue, setInputValue] = useState('');
  const [mobileView, setMobileView] = useState<'conversations' | 'messages'>(
    'conversations'
  );
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const mobileMessagesRef = useRef<HTMLDivElement>(null);
  const {
    optimisticMessages,
    addOptimisticMessage,
    removeOptimisticMessage,
    markAsFailed,
  } = useOptimisticMessages();

  const sendMessage = useSendMessage();
  const createConversation = useCreateConversation();

  // Auto-scroll to bottom when new messages arrive (desktop)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [selected?.messages, optimisticMessages]);

  // Auto-scroll to bottom for mobile messages
  useEffect(() => {
    if (mobileMessagesRef.current && mobileView === 'messages') {
      mobileMessagesRef.current.scrollTop =
        mobileMessagesRef.current.scrollHeight;
    }
  }, [selected?.messages, optimisticMessages, mobileView]);

  // Transform messages for Chat component
  const transformedMessages = transformMessages(selected?.messages, userId);

  // Combine server messages with optimistic messages
  const allMessages = combineMessages(transformedMessages, optimisticMessages);

  // Remove optimistic messages that have been confirmed by server
  useEffect(() => {
    const tempIdsToRemove = shouldRemoveOptimisticMessage(
      transformedMessages,
      optimisticMessages
    );
    tempIdsToRemove.forEach(tempId => removeOptimisticMessage(tempId));
  }, [transformedMessages, optimisticMessages, removeOptimisticMessage]);

  // Add a new effect to handle optimistic message removal when conversation changes
  useEffect(() => {
    const oldOptimisticTempIds = getOldOptimisticMessages(
      optimisticMessages,
      selectedId
    );
    oldOptimisticTempIds.forEach(tempId => removeOptimisticMessage(tempId));
  }, [selectedId, optimisticMessages, removeOptimisticMessage]);

  // Update the handleSendMessage function to use explicit IDs
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Handle draft conversation
    if (selectedId === 'draft' && selected?.isDraft && selected?.draftData) {
      const { propertyId, propertyOwnerId } = selected.draftData;

      const optimisticMessage = createOptimisticMessage(inputValue);
      addOptimisticMessage(optimisticMessage);
      const messageContent = inputValue;
      setInputValue('');

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
            data: { content: messageContent },
          });

          // Remove the optimistic message after successful creation and sending
          removeOptimisticMessage(optimisticMessage.tempId);

          // Notify parent component with message content
          onConversationCreated?.(conversationResult.data.id, messageContent);
        } else {
          console.error(
            'Failed to create conversation:',
            conversationResult.message
          );
          markAsFailed(optimisticMessage.tempId);
        }
      } catch (error) {
        console.error(
          'Error creating conversation and sending message:',
          error
        );
        markAsFailed(optimisticMessage.tempId);
      }
      return;
    }

    // Handle regular conversation
    if (!selectedId || selectedId === 'draft') return;

    const optimisticMessage = createOptimisticMessage(inputValue);
    addOptimisticMessage(optimisticMessage);
    setInputValue('');

    // Force scroll to bottom immediately after adding optimistic message
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
      if (mobileMessagesRef.current && mobileView === 'messages') {
        mobileMessagesRef.current.scrollTop =
          mobileMessagesRef.current.scrollHeight;
      }
    }, 0);

    sendMessage.mutate(
      {
        conversationId: selectedId,
        data: { content: inputValue },
      },
      {
        onError: () => {
          markAsFailed(optimisticMessage.tempId);
        },
      }
    );
  };

  const handleRetryMessage = (tempId: string) => {
    const failedMessage = optimisticMessages.find(msg => msg.tempId === tempId);
    if (!failedMessage) return;

    // Remove the failed message
    removeOptimisticMessage(tempId);

    // Resend the message
    sendMessage.mutate(
      {
        conversationId: selectedId,
        data: { content: failedMessage.text },
      },
      {
        onError: () => {
          // Re-add as failed if it fails again
          addOptimisticMessage({ ...failedMessage, isFailed: true });
        },
      }
    );
  };

  // Switch to messages view when a conversation is selected on mobile
  useEffect(() => {
    if (selectedId) {
      setMobileView('messages');
    }
  }, [selectedId]);

  // Mark messages as read when conversation is selected
  const { mutate: markMessagesAsRead } = useMarkMessagesAsRead();
  const handleConversationSelect = (
    conversationId: string,
    isMobile = false
  ) => {
    setSelectedId(conversationId);
    if (isMobile) {
      setMobileView('messages');
    }
    if (selected?.messages && selected?.messages.length > 0) {
      markMessagesAsRead({
        messageIds: selected?.messages.map(msg => msg.id) || [],
      });
    }
  };

  const handleBackToConversations = () => {
    setMobileView('conversations');
  };

  return (
    <div className='flex flex-col gap-5 md:flex-row md:h-[85vh] mx-5'>
      {/* Mobile Conversations View */}
      <div className='lg:hidden w-full'>
        {mobileView === 'conversations' ? (
          <div className='bg-white p-4'>
            <h2 className='text-xl font-bold mb-4'>Messages</h2>
            {isLoading ? (
              <ConversationsSkeletonMobile />
            ) : (
              <div className='space-y-3 max-h-[80vh] overflow-y-auto'>
                {conversations.map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => handleConversationSelect(conv.id, true)}
                    className='flex items-center cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition-colors'
                  >
                    <img
                      src={conv.property.image}
                      alt='property'
                      className='w-14 h-14 rounded-xl object-cover mr-3'
                    />
                    <div className='flex-1'>
                      <div className='font-bold text-base line-clamp-2'>
                        {conv.property.name}
                      </div>
                      <div className='text-gray-500 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]'>
                        {conv.lastMessage}
                      </div>
                    </div>
                    <div className='text-xs text-gray-300 ml-2'>
                      {conv.lastDate}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className='w-full h-[85vh] flex flex-col'>
            {/* Mobile Header */}
            <div className='flex items-center p-4 border-b border-gray-200'>
              <button
                onClick={handleBackToConversations}
                className='mr-3 p-1 hover:bg-gray-100 rounded-lg'
              >
                <ArrowLeft className='w-5 h-5' />
              </button>
              {isLoading ? (
                <>
                  <Skeleton className='w-10 h-10 rounded-full mr-3' />
                  <Skeleton className='h-4 w-24' />
                </>
              ) : (
                <>
                  <img
                    src={selected?.user.avatar}
                    alt='avatar'
                    className='w-10 h-10 rounded-full mr-3'
                  />
                  <span className='font-semibold text-sm md:text-base'>
                    {selected?.user.name}
                  </span>
                  {selected?.user.verified && (
                    <Image
                      src={verified}
                      alt='verified icon'
                      className='ml-1 w-4 h-4 md:w-6 md:h-6'
                    />
                  )}
                </>
              )}
            </div>

            {/* Mobile Property Card */}
            {isLoading ? (
              <PropertyCardSkeleton />
            ) : (
              <Link
                href={`/property/${selected?.propertyDetails.specificPropertyId}?property=${selected?.propertyDetails.propertyType.toLowerCase().split(' ').join('-')}`}
                className='bg-white border-b border-gray-200 p-4 flex items-center w-full gap-2'
              >
                <img
                  src={selected?.propertyDetails.image}
                  alt='property'
                  className='w-14 h-14 rounded-xl object-cover'
                />
                <div className='flex-1'>
                  <div className='font-bold text-sm md:text-base line-clamp-2'>
                    {selected?.propertyDetails.name}
                  </div>
                  <div className='text-gray-500 text-xs md:text-sm line-clamp-1'>
                    {selected?.propertyDetails.location}
                  </div>
                </div>
                <div className='font-bold text-primary-main text-base'>
                  {selected?.propertyDetails.price}
                </div>
                <ChevronRight className='w-6 h-6' />
              </Link>
            )}

            {/* Mobile Messages - Updated with mobile ref */}
            <div
              ref={mobileMessagesRef}
              className='flex-1 overflow-y-auto p-4 flex flex-col gap-4'
            >
              {isLoading ? (
                <MessagesSkeletonMobile />
              ) : allMessages && allMessages.length > 0 ? (
                allMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex w-full ${
                      msg.isMe ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {!msg.isMe && (
                      <img
                        src={selected?.user.avatar}
                        alt='avatar'
                        className='w-8 h-8 rounded-full mr-2 self-end mb-2'
                      />
                    )}

                    <div
                      className={`max-w-[80vw] flex flex-col justify-end ${
                        msg.isMe ? 'items-end ml-auto' : 'items-start mr-auto'
                      }`}
                    >
                      <div
                        className={`rounded-xl px-4 py-3 text-sm shadow relative ${
                          msg.isMe
                            ? 'bg-primary-mid text-white shadow-violet-100'
                            : 'bg-neutral-light text-[#222]'
                        } ${msg.isOptimistic ? 'opacity-70' : ''} ${
                          msg?.isFailed ? 'border border-red-300' : ''
                        }`}
                      >
                        {msg.text}
                        {msg.isOptimistic && (
                          <div className='absolute -bottom-1 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse' />
                        )}
                      </div>
                      <div className='flex items-center gap-2 text-gray-400 text-xs m-2'>
                        <span>{msg.time}</span>
                        {msg?.isFailed && (
                          <div className='flex items-center gap-1 text-red-500'>
                            <AlertCircle className='w-3 h-3' />
                            <span className='text-xs'>Failed to send</span>
                            <button
                              onClick={() => handleRetryMessage(msg.tempId)}
                              className='text-xs underline hover:no-underline'
                            >
                              Retry
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='flex-1 flex items-center justify-center'>
                  <div className='text-center text-gray-500'>
                    <div className='text-lg font-medium mb-2'>
                      No messages yet
                    </div>
                    <div className='text-sm'>
                      Start the conversation by sending a message
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Input - Keep the exact same input implementation */}
            <div className='flex items-center gap-2 md:gap-3 p-4 border-t border-gray-200'>
              {/* <button className='bg-none border-none text-xl cursor-pointer'>
                <Image
                  src={file}
                  alt='upload file'
                  className='w-6 h-6 md:w-7 md:h-7'
                />
              </button>
              <button className='bg-none border-none text-xl cursor-pointer'>
                <Image
                  src={image}
                  alt='upload image'
                  className='w-6 h-6 md:w-7 md:h-7'
                />
              </button> */}
              <div className='relative flex-1 flex gap-2'>
                <Input
                  type='text'
                  placeholder='Write something here...'
                  className='w-full rounded-xl border border-[#eee] px-3 py-2 md:px-4 md:py-3 text-sm outline-none pr-12'
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={sendMessage.isPending}
                />
                {inputValue && (
                  <button
                    type='button'
                    className='p-1 cursor-pointer disabled:opacity-50'
                    tabIndex={0}
                    onClick={handleSendMessage}
                    disabled={sendMessage.isPending}
                  >
                    <Image
                      src={send}
                      alt='send'
                      className='w-6 h-6 md:w-7 md:h-7'
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className='hidden lg:flex md:w-96 bg-white p-4 flex-col border-r border-gray-200 max-h-[85vh] overflow-y-auto'>
        {conversations.map(conv => (
          <div
            key={conv.id}
            onClick={() => handleConversationSelect(conv.id, false)}
            className='flex items-center mb-4 cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition-colors'
          >
            <img
              src={conv.property.image}
              alt='property'
              className='w-12 h-12 rounded-xl object-cover mr-3'
            />
            <div className='flex-1'>
              <div className='font-bold text-base line-clamp-2'>
                {conv.property.name}
              </div>
              <div className='text-gray-500 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]'>
                {conv.lastMessage}
              </div>
            </div>
            <div className='text-xs text-gray-300 ml-2'>{conv.lastDate}</div>
            {!conv.isRead && (
              <span className='w-2 h-2 bg-primary-mid rounded-full inline-block ml-2' />
            )}
          </div>
        ))}
      </aside>

      {/* Desktop Messages View */}
      <main className='hidden lg:flex flex-1 w-full flex-col pb-5'>
        {isLoading ? (
          <ChatSkeletonDesktop />
        ) : (
          <>
            {/* Header */}
            <div className='flex items-center mb-6 border-b pb-3 border-primary-main/10'>
              <img
                src={selected?.user.avatar}
                alt='avatar'
                className='w-10 h-10 rounded-full mr-3'
              />
              <span className='font-semibold text-lg'>
                {selected?.user.name}
              </span>
              {selected?.user.verified && (
                <Image
                  src={verified}
                  alt='verified icon'
                  className='ml-1 w-6 h-6'
                />
              )}
            </div>
            {/* Property Card */}
            <Link
              href={`/property/${selected?.propertyDetails.specificPropertyId}?property=${selected?.propertyDetails.propertyType.toLowerCase().split(' ').join('-')}`}
              className='bg-white rounded-xl shadow-md p-5 mb-6 flex flex-row gap-3 items-center w-full'
            >
              <img
                src={selected?.propertyDetails.image}
                alt='property'
                className='w-12 h-12 rounded-xl object-cover mr-4'
              />
              <div className='flex-1'>
                <div className='font-bold text-base'>
                  {selected?.propertyDetails.name}
                </div>
                <div className='text-gray-500 text-xs'>
                  {selected?.propertyDetails.location}
                </div>
              </div>
              <div className='font-bold text-primary-main text-base'>
                {selected?.propertyDetails.price}
              </div>
              <ChevronRight className='w-8 h-8' />
            </Link>
            {/* Messages */}
            <div
              ref={messagesContainerRef}
              className='flex-1 overflow-y-auto mb-6 flex flex-col gap-4 pr-5'
            >
              {allMessages && allMessages.length > 0 ? (
                allMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex w-full ${
                      msg.isMe ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {!msg.isMe && (
                      <img
                        src={selected?.user.avatar}
                        alt='avatar'
                        className='w-10 h-10 rounded-full mr-3 self-end mb-2'
                      />
                    )}

                    <div
                      className={`max-w-xl flex flex-col justify-end ${
                        msg.isMe ? 'items-end ml-auto' : 'items-start mr-auto'
                      }`}
                    >
                      <div
                        className={`rounded-xl px-4 py-3 text-sm shadow relative ${
                          msg.isMe
                            ? 'bg-primary-mid text-white shadow-violet-100'
                            : 'bg-neutral-light text-[#222]'
                        } ${msg.isOptimistic ? 'opacity-70' : ''} ${
                          msg?.isFailed ? 'border border-red-300' : ''
                        }`}
                      >
                        {msg.text}
                        {msg.isOptimistic && (
                          <div className='absolute -bottom-1 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse' />
                        )}
                      </div>
                      <div className='flex items-center gap-2 text-gray-400 text-sm m-2'>
                        <span>{msg.time}</span>
                        {msg?.isFailed && (
                          <div className='flex items-center gap-1 text-red-500'>
                            <AlertCircle className='w-3 h-3' />
                            <span className='text-xs'>Failed to send</span>
                            <button
                              onClick={() => handleRetryMessage(msg.tempId)}
                              className='text-xs underline hover:no-underline'
                            >
                              Retry
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='flex-1 flex items-center justify-center'>
                  <div className='text-center text-gray-500'>
                    <div className='text-lg font-medium mb-2'>
                      No messages yet
                    </div>
                    <div className='text-sm'>
                      Start the conversation by sending a message
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Input - Keep the exact same input implementation */}
            <div className='flex items-center gap-3'>
              {/* <button className='bg-none border-none text-xl cursor-pointer'>
                <Image src={file} alt='upload file' className='w-7 h-7' />
              </button>
              <button className='bg-none border-none text-xl cursor-pointer'>
                <Image src={image} alt='upload image' className='w-7 h-7' />
              </button> */}
              <div className='relative flex-1 flex gap-2'>
                <Input
                  type='text'
                  placeholder='Write something here...'
                  className='w-full rounded-xl border border-[#eee] px-4 py-3 text-sm outline-none pr-12'
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={sendMessage.isPending}
                />
                {inputValue && (
                  <button
                    type='button'
                    className='p-1 cursor-pointer disabled:opacity-50'
                    tabIndex={0}
                    onClick={handleSendMessage}
                    disabled={sendMessage.isPending}
                  >
                    <Image src={send} alt='send' className='w-7 h-7' />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
