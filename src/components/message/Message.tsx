/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { AlertCircle, Paperclip } from 'lucide-react';
import React, { useState } from 'react';
import ImagePopup from './ImagePopup';

export default function Message({
  msg,
  selected,
  handleRetryMessage,
}: {
  msg: any;
  selected: any;
  handleRetryMessage: any;
}) {
  const [imagePopupOpen, setImagePopupOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setImagePopupOpen(true);
  };

  // Filter only image attachments
  const imageAttachments =
    msg.attachments?.filter((attachment: any) =>
      attachment.fileType?.startsWith('image/')
    ) || [];

  // Filter non-image attachments
  const nonImageAttachments =
    msg.attachments?.filter(
      (attachment: any) => !attachment.fileType?.startsWith('image/')
    ) || [];

  return (
    <div
      key={msg.id}
      className={`flex w-full ${msg.isMe ? 'justify-end' : 'justify-start'}`}
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
          {msg.text && (
            <div className={`${msg.attachments?.length > 0 ? 'mb-2' : ''}`}>
              {msg.text}
            </div>
          )}

          {/* Render image attachments - show only 1 with count indicator */}
          {imageAttachments.length > 0 && (
            <div className='mb-2'>
              <div className='relative inline-block w-fit'>
                <img
                  src={imageAttachments[0].fileUrl}
                  alt={imageAttachments[0].fileName}
                  className='w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90'
                  onClick={() => handleImageClick(0)}
                />
                {imageAttachments.length > 1 && (
                  <div className='absolute top-0 right-0 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-bl-lg rounded-tr-lg'>
                    +{imageAttachments.length - 1}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Render non-image attachments */}
          {nonImageAttachments.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {nonImageAttachments.map((attachment: any) => (
                <a
                  key={attachment.id || attachment.fileUrl}
                  href={attachment.fileUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-black max-w-32'
                >
                  <Paperclip className='w-4 h-4 flex-shrink-0' />
                  <span className='text-sm truncate'>
                    {attachment.fileName}
                  </span>
                </a>
              ))}
            </div>
          )}

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

      {/* Image Popup */}
      {imageAttachments.length > 0 && (
        <ImagePopup
          open={imagePopupOpen}
          onOpenChange={setImagePopupOpen}
          attachments={msg.attachments}
          initialIndex={selectedImageIndex}
        />
      )}
    </div>
  );
}
