import Image from 'next/image';
import React, { useState } from 'react';
import verified from '@/../public/images/icons/verified.png';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import file from '@/../public/images/icons/file.svg';
import image from '@/../public/images/icons/image.svg';
import { Input } from '../ui/input';
import send from '@/../public/images/icons/send.svg';

interface Conversation {
  id: string;
  property: {
    image: string;
    name: string;
  };
  lastMessage: string;
  lastDate: string;
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
  size: string;
  price: string;
}

interface Message {
  id: string;
  text: string;
  isMe: boolean;
  time: string;
}

interface Selected {
  user: User;
  propertyDetails: PropertyDetails;
  messages: Message[];
}

interface ChatProps {
  conversations: Conversation[];
  selectedId: string;
  setSelectedId: (id: string) => void;
  selected?: Selected;
}

const Chat: React.FC<ChatProps> = ({
  conversations,
  selectedId,
  setSelectedId,
  selected,
}) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className='flex flex-col gap-5 md:flex-row md:h-[85vh] mx-5 '>
      {/* Sidebar */}
      <aside className='w-full md:w-96 bg-white p-2 md:p-4 flex md:flex-col flex-row overflow-x-auto md:overflow-x-visible border-b md:border-b-0 border-[#eee]'>
        {conversations.map(conv => (
          <div
            key={conv.id}
            onClick={() => setSelectedId(conv.id)}
            className='flex items-center md:mb-4 mb-0 md:rounded-xl rounded-lg cursor-pointer p-2 min-w-[220px] md:min-w-0 md:w-full mr-2 md:mr-0'
          >
            <img
              src={conv.property.image}
              alt='property'
              className='w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover mr-2 md:mr-3'
            />
            <div className='flex-1'>
              <div className='font-bold text-sm md:text-base'>
                {conv.property.name}
              </div>
              <div className='text-gray-500 text-xs whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px] md:max-w-[180px]'>
                {conv.lastMessage}
              </div>
            </div>
            <div className='text-xs text-gray-300 ml-2 hidden md:block'>
              {conv.lastDate}
            </div>
            {selectedId === conv.id && (
              <span className='w-2 h-2 bg-primary-mid rounded-full inline-block ml-2' />
            )}
          </div>
        ))}
      </aside>

      {/* Main Chat Area */}
      <main className='flex-1 w-full p-2 md:p-8 flex flex-col'>
        {/* Header */}
        <div className='flex items-center mb-4 md:mb-6'>
          <img
            src={selected?.user.avatar}
            alt='avatar'
            className='w-8 h-8 md:w-10 md:h-10 rounded-full mr-2 md:mr-3'
          />
          <span className='font-semibold text-base md:text-lg'>
            {selected?.user.name}
          </span>
          {selected?.user.verified && (
            <Image
              src={verified}
              alt='verified icon'
              className='ml-1 w-4 h-4 md:w-6 md:h-6'
            />
          )}
        </div>
        {/* Property Card */}
        <Link
          href='/property/luxury-skyline-residences'
          className='bg-white rounded-xl shadow-md p-3 md:p-5 mb-4 md:mb-6 flex flex-col sm:flex-row gap-3 items-center w-full'
        >
          <img
            src={selected?.propertyDetails.image}
            alt='property'
            className='w-12 h-12 rounded-xl object-cover mr-3 md:mr-4'
          />
          <div className='flex-1'>
            <div className='font-bold text-sm md:text-base'>
              {selected?.propertyDetails.name}
            </div>
            <div className='text-gray-500 text-xs'>
              {selected?.propertyDetails.location}
            </div>
            <div className='text-gray-500 text-xs'>
              {selected?.propertyDetails.size}
            </div>
          </div>
          <div className='font-bold text-primary-main text-sm md:text-base'>
            {selected?.propertyDetails.price}
          </div>
          <ChevronRight className='w-6 h-6 md:w-8 md:h-8 hidden sm:block' />
        </Link>
        {/* Messages */}
        <div className='flex-1 overflow-y-auto mb-4 md:mb-6 flex flex-col gap-2 md:gap-4 mt-12'>
          {selected?.messages.map(msg => (
            <div
              key={msg.id}
              className={`flex w-full ${
                msg.isMe ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* If not me, show avatar */}
              {!msg.isMe && (
                <img
                  src={selected?.user.avatar}
                  alt='avatar'
                  className='w-8 h-8 md:w-10 md:h-10 rounded-full mr-2 md:mr-3 self-end mb-2'
                />
              )}
              <div
                className={`max-w-[90vw] md:max-w-xl flex flex-col justify-end ${
                  msg.isMe ? 'items-end ml-auto' : 'items-start mr-auto'
                }`}
              >
                <div
                  className={`rounded-xl px-3 py-2 md:px-4 md:py-3 text-sm shadow ${
                    msg.isMe
                      ? 'bg-primary-mid text-white shadow-violet-100'
                      : 'bg-neutral-light text-[#222]'
                  } `}
                >
                  {msg.text}
                </div>
                <div className='text-gray-400 text-xs md:text-sm m-1 md:m-2'>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Input */}
        <div className='flex items-center gap-2 md:gap-3'>
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
            />
            {inputValue && (
              <button type='button' className='p-1 cursor-pointer' tabIndex={0}>
                <Image
                  src={send}
                  alt='send'
                  className='w-6 h-6 md:w-7 md:h-7'
                />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
