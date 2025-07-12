import React from 'react';
import { Skeleton } from '../ui/skeleton';

export function ChatSkeletonDesktop() {
  return (
    <>
      <Skeleton className='h-8 w-48 mb-4' />
      <Skeleton className='h-32 w-full mb-4' />
      <div className='space-y-4'>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className='h-16 w-3/4' />
        ))}
      </div>
    </>
  );
}

export function MessagesSkeletonMobile() {
  return (
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
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className='bg-white border-b border-gray-200 p-4 flex items-center w-full gap-2'>
      <Skeleton className='w-14 h-14 rounded-xl' />
      <div className='flex-1'>
        <Skeleton className='h-4 w-3/4 mb-2' />
        <Skeleton className='h-3 w-1/2' />
      </div>
      <Skeleton className='w-16 h-4' />
      <Skeleton className='w-6 h-6' />
    </div>
  );
}

export function ConversationsSkeletonMobile() {
  return (
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
  );
}
