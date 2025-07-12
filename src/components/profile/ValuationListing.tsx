/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useGetUserValuation } from '@/lib/queries/hooks/use-user-profile';
import PropertySkeleton from './PropertySkeleton';
import Image from 'next/image';

import ValuationModal from './ValuationModal';

export default function ValuationListing() {
  const { data: userValuations, isLoading, refetch } = useGetUserValuation();

  // Refetch data when component mounts
  React.useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className='lg:p-8'>
      <h1 className='text-xl lg:text-2xl font-semibold mb-1'>
        Manage your Valuation
      </h1>
      <p className='text-sm lg:text-base text-gray-400 mb-4 lg:mb-6'>
        Organize and update your property valuation
      </p>
      {isLoading && <PropertySkeleton />}

      <div className='flex flex-col gap-4 lg:gap-8'>
        {userValuations?.data?.length === 0 && (
          <div className='flex flex-col items-center justify-center mt-12 lg:mt-24'>
            <Image
              src={'/images/icons/empty.svg'}
              alt='No listings'
              width={150}
              height={50}
              className='mb-4 lg:mb-8 lg:w-[204px] lg:h-[67px]'
            />
            <div className='text-xl lg:text-2xl font-bold text-primary-main mb-2 text-center'>
              {'No valuations to show.'}
            </div>
            <div className='text-sm lg:text-base text-gray-400 text-center'>
              {"You don't have any valuations yet."}
            </div>
          </div>
        )}
        {userValuations?.data?.map((item: any) => (
          <ValuationModal key={item?.id} valuation={item} />
        ))}
      </div>
    </div>
  );
}
