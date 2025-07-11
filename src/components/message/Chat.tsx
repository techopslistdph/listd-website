/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import verified from '@/../public/images/icons/verified.png';
import Link from 'next/link';
import { ChevronRight, AlertCircle, ArrowLeft } from 'lucide-react';
import file from '@/../public/images/icons/file.svg';
import image from '@/../public/images/icons/image.svg';
import { Input } from '../ui/input';
import send from '@/../public/images/icons/send.svg';
import { Skeleton } from '../ui/skeleton';
import {
  useMarkMessagesAsRead,
  useSendMessage,
} from '@/lib/queries/hooks/use-messaging';
import {
  Message,
  MessageListResponse,
} from '@/lib/queries/server/messaging/types';
import { useOptimisticMessages } from '@/hooks/useOptimisticMessages';

interface Conversation {
  id: string;
  property: {
    image: string;
    name: string;
  };
  lastMessage: string;
  lastDate: string;
  isRead: boolean;
}

interface User {
  avatar: string;
  name: string;
  verified?: boolean;
}

interface PropertyDetails {
  image: string;
  name: string;
  location: string;
  price: string;
}

interface OptimisticMessage {
  id: string;
  text: string;
  isMe: boolean;
  time: string;
  createdAt: number; // Add this field for proper sorting
  isOptimistic: boolean;
  isFailed?: boolean;
  tempId: string;
}

interface Selected {
  user: User;
  propertyDetails: PropertyDetails;
  messages: Message[] | undefined;
}

interface ChatProps {
  conversations: Conversation[];
  selectedId: string;
  setSelectedId: (id: string) => void;
  selected?: Selected;
  isLoading: boolean;
  userId: string;
}

export default function Chat({
  conversations,
  selectedId,
  setSelectedId,
  selected,
  isLoading,
  userId,
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
  const transformedMessages = selected?.messages
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
      createdAt: new Date(msg.createdAt).getTime(), // Add createdAt for sorting
      isOptimistic: false,
      tempId: '',
    }));

  // Combine server messages with optimistic messages
  const allMessages: OptimisticMessage[] = [
    ...(transformedMessages || []),
    ...optimisticMessages,
  ].sort((a, b) => {
    // Sort by createdAt timestamp instead of formatted time string
    return a.createdAt - b.createdAt;
  });

  // Remove optimistic messages that have been confirmed by server
  useEffect(() => {
    if (!transformedMessages) return;

    const serverMessageTexts = transformedMessages.map(msg => msg.text);

    // Remove optimistic messages that now exist in server messages
    optimisticMessages.forEach(optimisticMsg => {
      if (serverMessageTexts.includes(optimisticMsg.text)) {
        removeOptimisticMessage(optimisticMsg.tempId);
      }
    });
  }, [transformedMessages, optimisticMessages, removeOptimisticMessage]);

  const handleSendMessage = () => {
    if (!selectedId || !inputValue.trim()) return;

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const optimisticMessage: OptimisticMessage = {
      id: tempId,
      text: inputValue,
      isMe: true,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      createdAt: Date.now(), // Add createdAt timestamp
      isOptimistic: true,
      tempId,
    };

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
          markAsFailed(tempId);
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
              <div className='space-y-3'>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className='flex items-center p-3 rounded-xl'>
                    <Skeleton className='w-12 h-12 rounded-xl mr-3' />
                    <div className='flex-1'>
                      <Skeleton className='h-4 w-3/4 mb-2' />
                      <Skeleton className='h-3 w-1/2' />
                    </div>
                    <Skeleton className='w-12 h-3 ml-2' />
                  </div>
                ))}
              </div>
            ) : (
              <div className='space-y-3'>
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
              <div className='bg-white border-b border-gray-200 p-4 flex items-center w-full gap-2'>
                <Skeleton className='w-14 h-14 rounded-xl' />
                <div className='flex-1'>
                  <Skeleton className='h-4 w-3/4 mb-2' />
                  <Skeleton className='h-3 w-1/2' />
                </div>
                <Skeleton className='w-16 h-4' />
                <Skeleton className='w-6 h-6' />
              </div>
            ) : (
              <Link
                href='/property/luxury-skyline-residences'
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
                <div className='space-y-4'>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className='flex w-full justify-start'>
                      <Skeleton className='w-8 h-8 rounded-full mr-2 self-end mb-2' />
                      <div className='max-w-[80vw] flex flex-col justify-end items-start mr-auto'>
                        <Skeleton className='h-12 w-48 rounded-xl' />
                        <Skeleton className='h-3 w-16 mt-2' />
                      </div>
                    </div>
                  ))}
                </div>
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
              <button className='bg-none border-none text-xl cursor-pointer'>
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
              </button>
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
      <aside className='hidden lg:flex md:w-96 bg-white p-4 flex-col border-r border-gray-200'>
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
          <>
            <Skeleton className='h-8 w-48 mb-4' />
            <Skeleton className='h-32 w-full mb-4' />
            <div className='space-y-4'>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className='h-16 w-3/4' />
              ))}
            </div>
          </>
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
              href='/property/luxury-skyline-residences'
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
              <button className='bg-none border-none text-xl cursor-pointer'>
                <Image src={file} alt='upload file' className='w-7 h-7' />
              </button>
              <button className='bg-none border-none text-xl cursor-pointer'>
                <Image src={image} alt='upload image' className='w-7 h-7' />
              </button>
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
