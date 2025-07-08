/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { ClockIcon } from 'lucide-react';
import { useGetUserValuation } from '@/lib/queries/hooks/use-user-profile';
import PropertySkeleton from './PropertySkeleton';
import staticImageSample from '../../../public/images/condo5.png';
import Image from 'next/image';

export default function ValuationListing() {
  const { data: userValuations, isLoading } = useGetUserValuation();

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
        {userValuations?.data?.map((item: any) => (
          <div
            key={item?.id}
            className='flex flex-col lg:flex-row bg-white rounded-2xl lg:rounded-3xl shadow-2xl shadow-[#F7EFFD] p-4 lg:p-6 w-full lg:items-stretch mb-2 transition'
          >
            {/* Image */}
            <div className='flex-shrink-0 flex items-center mb-4 lg:mb-0'>
              <Image
                src={staticImageSample}
                alt='static image'
                width={240}
                height={200}
                className='w-full lg:w-60 h-48 lg:h-56 object-cover rounded-xl lg:rounded-2xl'
              />
            </div>
            {/* Details */}
            <div className='flex flex-col justify-between lg:ml-8 flex-1'>
              <div>
                <span className='px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm font-medium bg-primary-light text-primary-main mb-2 inline-block'>
                  {item?.inputPayload?.transactionType
                    ?.replace('-', ' ')
                    .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </span>
                <div className='text-lg lg:text-xl font-bold mb-1'>
                  {item?.inputPayload.buildingName || 'Untitled Valuation'}
                </div>
                {(item?.inputPayload?.location ||
                  item?.inputPayload?.location?.address ||
                  item?.inputPayload?.location?.city ||
                  item?.inputPayload?.location?.barangay) && (
                  <div className='flex items-center text-gray-400 text-sm lg:text-base mb-1'>
                    <svg
                      className='w-4 h-4 lg:w-5 lg:h-5 mr-1'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                    </svg>
                    {item.inputPayload.location || 'Location Not Available'}
                  </div>
                )}

                <div className='flex flex-col justify-between items-start gap-2 lg:gap-0 mt-5'>
                  <div className='flex flex-col text-gray-400 text-sm lg:text-base mb-1'>
                    <span className='font-medium text-black mr-2'>
                      Price value
                    </span>
                    <span className='flex items-center gap-1'>
                      <ClockIcon className='w-3 h-3 lg:w-4 lg:h-4 mr-1' />
                      as of{' '}
                      {new Date(
                        item?.aiResult?.valuationDate
                      ).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className='flex items-end justify-end h-full'>
                    <div className='text-lg lg:text-xl font-bold text-primary-main'>
                      {Number(item?.aiResult?.estimated).toLocaleString(
                        'en-US',
                        {
                          style: 'currency',
                          currency: 'PHP',
                        }
                      ) || 'Price not available'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
