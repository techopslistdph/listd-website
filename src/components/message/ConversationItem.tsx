/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { useMarkMessagesAsRead } from '@/lib/queries/hooks/use-messaging';
import React from 'react';

export default function ConversationItem({
  conv,
  selectedId,
  isMobile,
  setSelectedId,
  setMobileView,
  selected,
}: {
  conv: any;
  selectedId: any;
  isMobile: any;
  setSelectedId: any;
  setMobileView: any;
  selected: any;
}) {
  const { mutate: markMessagesAsRead } = useMarkMessagesAsRead();

  const isOptimistic = conv.isOptimistic;
  const isSelected = selectedId === conv.id;
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
        messageIds: selected?.messages.map((msg: any) => msg.id) || [],
      });
    }
  };

  // Use a unique key that includes optimistic status
  const uniqueKey = isOptimistic
    ? `optimistic-${conv.tempId}`
    : `real-${conv.id}`;

  return (
    <div
      key={uniqueKey}
      onClick={() => handleConversationSelect(conv.id, isMobile)}
      className={`flex items-center cursor-pointer p-2 rounded-xl transition-colors ${
        isSelected ? 'bg-secondary-main/5  shadow-md' : 'hover:bg-gray-50'
      } ${isOptimistic ? 'opacity-70' : ''}`}
    >
      <div className='relative'>
        <img
          src={
            conv.property.image ||
            'https://www.trical.co.nz/modules/custom/legrand_ecat/assets/img/no-image.png'
          }
          alt='property'
          className='w-14 h-14 rounded-xl object-cover mr-3'
        />
        {isOptimistic && (
          <div className='absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse' />
        )}
      </div>
      <div className='flex-1'>
        <div className={`font-bold text-base line-clamp-2 text-gray-900`}>
          {conv.property.name}
        </div>
        <div
          className={`text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] text-gray-500`}
        >
          {conv.lastMessage}
        </div>
      </div>
      <div
        className={`text-xs ml-2 ${
          isSelected ? 'text-white/60' : 'text-gray-300'
        }`}
      >
        {conv.lastDate}
      </div>
    </div>
  );
}
