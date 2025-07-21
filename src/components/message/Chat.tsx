/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import verified from '@/../public/images/icons/verified.png';
import Link from 'next/link';
import {
  ChevronRight,
  ArrowLeft,
  Paperclip,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { Input } from '../ui/input';
import send from '@/../public/images/icons/send.svg';
import { useMessageActions } from '@/hooks/useMessageActions';
import { DraftConversation } from '@/lib/utils/draftConversation';
import {
  combineMessages,
  Conversations,
  OptimisticMessage,
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
import Message from './Message';
import ConversationItem from './ConversationItem';

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
  // Add optimistic message props
  optimisticMessages: OptimisticMessage[];
  onAddOptimisticMessage: (message: OptimisticMessage) => void;
  onRemoveOptimisticMessage: (tempId: string) => void;
  onMarkAsFailed: (tempId: string) => void;
}

interface AttachmentPreview {
  file: File;
  preview: string;
  id: string;
}

export default function Chat({
  conversations,
  selectedId,
  setSelectedId,
  selected,
  isLoading,
  userId,
  onConversationCreated,
  optimisticMessages,
  onAddOptimisticMessage,
  onRemoveOptimisticMessage,
  onMarkAsFailed,
}: ChatProps) {
  const [inputValue, setInputValue] = useState('');
  const [attachments, setAttachments] = useState<AttachmentPreview[]>([]);
  const [mobileView, setMobileView] = useState<'conversations' | 'messages'>(
    'conversations'
  );
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const mobileMessagesRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { handleSendMessage, handleRetryMessage, isPending } =
    useMessageActions({
      selectedId,
      selected,
      onConversationCreated,
      setInputValue,
      setAttachments,
      attachments,
      // Pass optimistic message handlers
      onAddOptimisticMessage,
      onRemoveOptimisticMessage,
      onMarkAsFailed,
    });

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
    tempIdsToRemove.forEach(tempId => onRemoveOptimisticMessage(tempId));
  }, [transformedMessages, optimisticMessages, onRemoveOptimisticMessage]);

  // Handle file selection
  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    isImage: boolean = false
  ) => {
    const files = event.target.files;
    if (!files) return;

    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedImageTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    const allowedFileTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    Array.from(files).forEach(file => {
      if (file.size > maxFileSize) {
        alert('File size must be less than 10MB');
        return;
      }

      if (isImage && !allowedImageTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }

      if (!isImage && !allowedFileTypes.includes(file.type)) {
        alert('Please select a valid file (PDF, DOC, DOCX)');
        return;
      }

      const preview = isImage ? URL.createObjectURL(file) : '';
      const attachment: AttachmentPreview = {
        file,
        preview,
        id: `${Date.now()}-${Math.random()}`,
      };

      setAttachments(prev => [...prev, attachment]);
    });

    // Reset input
    event.target.value = '';
  };

  // Remove attachment
  const removeAttachment = (id: string) => {
    setAttachments(prev => {
      const attachment = prev.find(att => att.id === id);
      if (attachment?.preview) {
        URL.revokeObjectURL(attachment.preview);
      }
      return prev.filter(att => att.id !== id);
    });
  };

  const onSendMessage = () => {
    handleSendMessage(inputValue);

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
  };

  const onRetryMessage = (tempId: string) => {
    const retryHandler = handleRetryMessage(tempId);
    retryHandler(optimisticMessages);
  };

  useEffect(() => {
    if (selectedId) {
      setMobileView('messages');
    }
  }, [selectedId]);

  const handleBackToConversations = () => {
    setMobileView('conversations');
  };

  // Render attachment preview
  const renderAttachmentPreview = (attachment: AttachmentPreview) => {
    const isImage = attachment.file.type.startsWith('image/');

    return (
      <div key={attachment.id} className='relative inline-block mr-2 mb-2'>
        {isImage ? (
          <div className='relative'>
            <img
              src={attachment.preview}
              alt={attachment.file.name}
              className='w-20 h-20 object-cover rounded-lg'
            />
            <button
              onClick={() => removeAttachment(attachment.id)}
              className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600'
            >
              <X className='w-3 h-3' />
            </button>
          </div>
        ) : (
          <div className='relative bg-gray-100 p-3 rounded-lg border'>
            <div className='flex items-center gap-2'>
              <Paperclip className='w-4 h-4 text-gray-500' />
              <span className='text-xs text-gray-700 truncate max-w-32'>
                {attachment.file.name}
              </span>
              <button
                onClick={() => removeAttachment(attachment.id)}
                className='text-red-500 hover:text-red-600'
              >
                <X className='w-3 h-3' />
              </button>
            </div>
          </div>
        )}
      </div>
    );
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
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    selectedId={selectedId}
                    isMobile={true}
                    setSelectedId={setSelectedId}
                    setMobileView={setMobileView}
                    selected={selected}
                  />
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
                  src={
                    selected?.propertyDetails.image ||
                    'https://www.trical.co.nz/modules/custom/legrand_ecat/assets/img/no-image.png'
                  }
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
                  <Message
                    key={msg.id}
                    msg={msg}
                    selected={selected}
                    handleRetryMessage={onRetryMessage}
                  />
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

            {/* Mobile Input */}
            <div className='flex items-center gap-2 md:gap-3 p-4 border-t border-gray-200'>
              <button
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className='w-5 h-5 text-gray-500' />
              </button>
              <button
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                onClick={() => imageInputRef.current?.click()}
              >
                <ImageIcon className='w-5 h-5 text-gray-500' />
              </button>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type='file'
                accept='.pdf,.doc,.docx'
                multiple
                onChange={e => handleFileSelect(e, false)}
                className='hidden'
              />
              <input
                ref={imageInputRef}
                type='file'
                accept='image/*'
                multiple
                onChange={e => handleFileSelect(e, true)}
                className='hidden'
              />

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
                      onSendMessage();
                    }
                  }}
                />
                {(inputValue || attachments.length > 0) && (
                  <button
                    type='button'
                    className='p-1 cursor-pointer disabled:opacity-50'
                    tabIndex={0}
                    onClick={onSendMessage}
                    disabled={isPending}
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

            {/* Attachment previews */}
            {attachments.length > 0 && (
              <div className='px-4 pb-4 border-t border-gray-200'>
                <div className='flex flex-wrap gap-2'>
                  {attachments.map(renderAttachmentPreview)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className='hidden lg:flex md:w-96 bg-white p-4 flex-col border-r gap-3 border-gray-200 max-h-[85vh] overflow-y-auto'>
        {conversations.map(conv => (
          <ConversationItem
            key={conv.id}
            conv={conv}
            selectedId={selectedId}
            isMobile={false}
            setSelectedId={setSelectedId}
            setMobileView={setMobileView}
            selected={selected}
          />
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
                src={
                  selected?.propertyDetails.image ||
                  'https://www.trical.co.nz/modules/custom/legrand_ecat/assets/img/no-image.png'
                }
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
                  <Message
                    key={msg.id}
                    msg={msg}
                    selected={selected}
                    handleRetryMessage={onRetryMessage}
                  />
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
            {/* Input */}
            <div className='flex items-center gap-3'>
              <button
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className='w-6 h-6 text-gray-500' />
              </button>
              <button
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                onClick={() => imageInputRef.current?.click()}
              >
                <ImageIcon className='w-6 h-6 text-gray-500' />
              </button>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type='file'
                accept='.pdf,.doc,.docx'
                multiple
                onChange={e => handleFileSelect(e, false)}
                className='hidden'
              />
              <input
                ref={imageInputRef}
                type='file'
                accept='image/*'
                multiple
                onChange={e => handleFileSelect(e, true)}
                className='hidden'
              />

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
                      onSendMessage();
                    }
                  }}
                />
                {(inputValue || attachments.length > 0) && (
                  <button
                    type='button'
                    className='p-1 cursor-pointer disabled:opacity-50'
                    tabIndex={0}
                    onClick={onSendMessage}
                    disabled={isPending}
                  >
                    <Image src={send} alt='send' className='w-7 h-7' />
                  </button>
                )}
              </div>
            </div>

            {/* Attachment previews */}
            {attachments.length > 0 && (
              <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
                <div className='flex flex-wrap gap-2'>
                  {attachments.map(renderAttachmentPreview)}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
