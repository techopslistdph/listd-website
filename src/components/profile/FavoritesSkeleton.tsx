import React from 'react';

export default function FavoritesSkeleton() {
  return (
    <div className='lg:p-8'>
      {/* Title and subtitle skeleton */}
      <div className='mb-4 lg:mb-6'>
        <div className='h-8 lg:h-9 bg-gray-200 rounded-lg w-64 lg:w-80 mb-2 animate-pulse'></div>
        <div className='h-4 lg:h-5 bg-gray-200 rounded w-80 lg:w-96 animate-pulse'></div>
      </div>

      {/* Property List Skeleton */}
      <div className='flex flex-col gap-4 lg:gap-8'>
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className='flex flex-col lg:flex-row bg-white rounded-2xl lg:rounded-3xl shadow-2xl shadow-[#F7EFFD] p-4 lg:p-6 w-full lg:items-stretch relative min-h-[260px]'
          >
            {/* Image skeleton */}
            <div className='flex-shrink-0 flex items-center mb-4 lg:mb-0'>
              <div className='w-full lg:w-60 h-48 lg:h-56 bg-gray-200 rounded-xl lg:rounded-2xl animate-pulse'></div>
            </div>

            {/* Details skeleton */}
            <div className='flex flex-col justify-between lg:ml-8 flex-1'>
              <div>
                {/* Price skeleton */}
                <div className='h-6 lg:h-7 bg-gray-200 rounded w-32 lg:w-40 mb-2 animate-pulse'></div>

                {/* Title skeleton */}
                <div className='h-5 lg:h-6 bg-gray-200 rounded w-full lg:w-3/4 mb-2 animate-pulse'></div>

                {/* Address skeleton */}
                <div className='flex items-center mb-3 lg:mb-4'>
                  <div className='w-4 h-4 lg:w-5 lg:h-5 bg-gray-200 rounded mr-2 animate-pulse'></div>
                  <div className='h-4 lg:h-5 bg-gray-200 rounded w-48 lg:w-64 animate-pulse'></div>
                </div>

                {/* Agent skeleton */}
                <div className='flex items-center mb-3 lg:mb-4'>
                  <div className='w-4 h-4 lg:w-5 lg:h-5 bg-gray-200 rounded mr-2 animate-pulse'></div>
                  <div className='h-4 lg:h-5 bg-gray-200 rounded w-32 lg:w-40 animate-pulse'></div>
                  <div className='w-3 lg:w-4 h-3 lg:h-4 bg-gray-200 rounded ml-2 animate-pulse'></div>
                </div>
              </div>

              {/* Features skeleton */}
              <div className='flex flex-wrap gap-4 lg:gap-8 text-gray-400 text-sm lg:text-base'>
                <div className='flex text-gray-400 text-base gap-5 mb-2'>
                  {[...Array(3)].map((_, featureIndex) => (
                    <div key={featureIndex} className='flex flex-col gap-1'>
                      <div className='w-6 h-6 bg-gray-200 rounded animate-pulse'></div>
                      <div className='h-4 bg-gray-200 rounded w-16 animate-pulse'></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons skeleton */}
              <div className='flex justify-end mt-2 gap-4 lg:gap-0'>
                <div className='flex flex-col lg:flex-row gap-2 lg:gap-4 w-full lg:w-auto'>
                  <div className='h-12 lg:h-14 bg-gray-200 rounded-full w-full lg:w-44 animate-pulse'></div>
                  <div className='h-12 lg:h-14 bg-gray-200 rounded-full w-full lg:w-44 animate-pulse'></div>
                </div>
              </div>
            </div>

            {/* Heart icon skeleton */}
            <div className='absolute top-4 right-4 lg:top-6 lg:right-6'>
              <div className='w-5 h-5 lg:w-7 lg:h-7 bg-gray-200 rounded animate-pulse'></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
