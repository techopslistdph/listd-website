import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarFallback } from '../ui/avatar';

export default function TabSkeleton() {
  return (
    <div className='w-full'>
      {/* Header Section Skeleton */}
      <div className='mb-5 border-b border-neutral-mid/40 pb-5 flex flex-col md:flex-row gap-5 md:gap-0 items-center justify-between'>
        <div className='flex flex-col md:flex-row items-center gap-5'>
          {/* Avatar Skeleton */}
          <Avatar className='w-16 h-16 rounded-full border-primary-mid border-4'>
            <AvatarFallback>
              <Skeleton className='w-full h-full rounded-full' />
            </AvatarFallback>
          </Avatar>

          {/* Name and Verification Skeleton */}
          <div className='text-center md:text-left'>
            <div className='flex items-center gap-2 mb-1'>
              <Skeleton className='h-6 w-32' />
              <Skeleton className='h-6 w-6 rounded-full' />
            </div>
            <Skeleton className='h-4 w-16' />
          </div>
        </div>

        {/* Button Skeleton */}
        <Skeleton className='h-12 w-32 sm:w-44 md:w-auto' />
      </div>

      {/* Tabs Skeleton */}
      <Tabs defaultValue='profile-information' className='w-full'>
        <TabsList
          className='mb-8'
          style={{ borderColor: 'var(--primary-main)' }}
        >
          <TabsTrigger value='profile-information' disabled>
            Profile Information
          </TabsTrigger>
          <TabsTrigger value='edit-profile' disabled>
            Edit Profile
          </TabsTrigger>
          <TabsTrigger value='my-listing' disabled>
            My Listing
          </TabsTrigger>
          <TabsTrigger value='my-valuation' disabled>
            My Valuation
          </TabsTrigger>
          <TabsTrigger value='my-favorites' disabled>
            My Favorites
          </TabsTrigger>
          <TabsTrigger value='login-security' disabled>
            Login Security
          </TabsTrigger>
        </TabsList>

        {/* Content Skeleton */}
        <TabsContent value='profile-information'>
          <div className='space-y-6'>
            {/* Profile Information Content Skeleton */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-12 w-full' />
              </div>
              <div className='space-y-4'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-12 w-full' />
              </div>
              <div className='space-y-4'>
                <Skeleton className='h-4 w-16' />
                <Skeleton className='h-12 w-full' />
              </div>
              <div className='space-y-4'>
                <Skeleton className='h-4 w-28' />
                <Skeleton className='h-12 w-full' />
              </div>
            </div>

            {/* Additional content skeleton */}
            <div className='space-y-4'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-20 w-full' />
            </div>

            {/* Action buttons skeleton */}
            <div className='flex gap-4 pt-4'>
              <Skeleton className='h-10 w-24' />
              <Skeleton className='h-10 w-20' />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
