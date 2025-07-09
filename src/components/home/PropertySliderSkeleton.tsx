import React from 'react';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function PropertySliderSkeleton() {
  return (
    // Skeleton component for property cards

    <Swiper
      spaceBetween={32}
      slidesPerView={1.2}
      breakpoints={{
        640: { slidesPerView: 1.2 },
        768: { slidesPerView: 2.2 },
        1024: { slidesPerView: 3.2 },
      }}
      modules={[Pagination]}
      className='property-swiper pb-8'
    >
      {[...Array(6)].map((_, idx) => (
        <SwiperSlide key={idx} className='max-w-[350px]'>
          <div className='bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col h-full mb-10'>
            {/* Image skeleton */}
            <div className='relative w-full min-w-[250px] min-h-[250px] md:min-w-[350px] md:min-h-[350px] bg-gray-200 animate-pulse'></div>

            {/* Content skeleton */}
            <div className='p-6 flex flex-col flex-1'>
              {/* Price skeleton */}
              <div className='h-6 md:h-7 bg-gray-200 rounded w-32 md:w-40 mb-2 animate-pulse'></div>

              {/* Title skeleton */}
              <div className='h-5 md:h-6 bg-gray-200 rounded w-full mb-1 animate-pulse'></div>

              {/* Location skeleton */}
              <div className='flex items-center'>
                <div className='w-4 h-4 bg-gray-200 rounded mr-2 animate-pulse'></div>
                <div className='h-4 bg-gray-200 rounded w-32 animate-pulse'></div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
