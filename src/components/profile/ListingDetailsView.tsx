import React from 'react';
import { Listing } from '@/app/data';
import Image, { StaticImageData } from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import areaIcon from '../../../public/images/icons/squaremeter.svg';
import bedIcon from '../../../public/images/icons/bedroom.svg';
import bathIcon from '../../../public/images/icons/bath.svg';
import fullyFurnishedIcon from '../../../public/images/icons/fully-furnished.svg';
import parkingIcon from '../../../public/images/icons/car.svg';
import facingWestIcon from '../../../public/images/icons/facing-west.svg';
import { Button } from '../ui/button';

interface ListingDetailsViewProps {
  listing: Listing;
  setUpdateDialogProperty: (listing: Listing) => void;
  setUpdateDialogOpen: (open: boolean) => void;
}

const iconMap: Record<string, StaticImageData> = {
  area: areaIcon,
  bedrooms: bedIcon,
  baths: bathIcon,
  parking: parkingIcon,
  'facing west': facingWestIcon,
  'fully furnished': fullyFurnishedIcon,
};

function getIconForKey(key: string): StaticImageData | undefined {
  return iconMap[key];
}

export default function ListingDetailsView({
  listing,
  setUpdateDialogProperty,
  setUpdateDialogOpen,
}: ListingDetailsViewProps) {
  return (
    <div className='bg-white rounded-2xl lg:rounded-3xl shadow-md p-4 lg:p-8'>
      {/* Main Image Slider */}
      <div className='w-full h-48 lg:h-64 rounded-xl lg:rounded-2xl overflow-hidden mb-4 lg:mb-6 flex items-center justify-center bg-gray-100'>
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          className='w-full h-full'
          style={{ borderRadius: '1rem' }}
        >
          {listing.images.map((img: StaticImageData, idx: number) => (
            <SwiperSlide key={idx}>
              <Image
                src={img}
                alt={`${listing.title} image ${idx + 1}`}
                className='object-cover w-full h-full'
                fill
                style={{ objectFit: 'cover' }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Title, Address, Price, Status, Verified */}
      <div className='flex flex-col lg:flex-row lg:items-center justify-between mb-2'>
        <div>
          <div className='text-xl lg:text-2xl font-bold mb-1'>
            {listing.title}
          </div>
          <div className='text-sm lg:text-base text-[var(--neutral-mid)] mb-1'>
            {listing.location}
          </div>
          <div className='text-lg lg:text-xl font-bold mb-1'>
            {listing.price}
          </div>
          <div className='text-xs lg:text-sm text-[var(--primary-mid)] font-semibold mb-1'>
            {listing.status}
          </div>
        </div>
        {listing.isVerified && (
          <div className='flex items-center gap-1 bg-[var(--primary-mid)] text-white px-2 w-24 justify-center lg:px-3 py-1 rounded-full text-xs font-medium mt-2 lg:mt-0'>
            <span className='text-xs text-white font-bold'>Verified</span>
          </div>
        )}
      </div>
      <hr className='my-3 lg:my-4' />
      {/* Description */}
      <div className='mb-3 lg:mb-4'>
        <div className='font-bold text-sm lg:text-base mb-1'>Description</div>
        <div className='text-[var(--neutral-main)] text-xs lg:text-sm'>
          {listing.descriptionText}
        </div>
      </div>
      {/* Property Details */}
      <div className='flex flex-wrap justify-between text-center gap-4 lg:gap-0 my-4 lg:my-8'>
        {listing.description.map(
          (
            item: Record<string, string | number | boolean | undefined>,
            idx: number
          ) => {
            const key = Object.keys(item)[0];
            const value = item[key];
            if (value === undefined || value === false) return null;
            const icon = getIconForKey(key);
            const isBoolean = typeof value === 'boolean';
            return (
              <div
                key={idx}
                className='flex flex-col items-center justify-center gap-1 text-[var(--neutral-main)] text-xs lg:text-sm w-1/3 lg:w-auto'
              >
                {icon && (
                  <Image
                    src={icon}
                    alt={key}
                    width={16}
                    height={16}
                    className='lg:w-5 lg:h-5'
                  />
                )}
                {isBoolean ? (
                  key
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())
                ) : (
                  <>
                    {String(value)}{' '}
                    {key === 'parking'
                      ? 'Parking'
                      : key === 'baths'
                      ? 'Bath'
                      : key === 'bedrooms'
                      ? 'Bedroom'
                      : key === 'area'
                      ? ''
                      : ''}
                  </>
                )}
              </div>
            );
          }
        )}
      </div>
      {/* Features */}
      {listing.features && listing.features.length > 0 && (
        <div className='mb-4 lg:mb-6'>
          <div className='font-bold text-sm lg:text-base mb-1'>Features</div>
          <div className='flex flex-wrap gap-2'>
            {listing.features.map((feature, idx) => (
              <span
                key={idx}
                className='bg-[var(--primary-mid)] text-white px-2 lg:px-3 py-1 rounded-full text-xs font-medium'
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Property Location (Map) */}
      <div className='mb-4 lg:mb-6'>
        <div className='font-bold text-sm lg:text-base mb-1'>
          Property location
        </div>
        <div className='w-full'>
          <div
            className='w-full h-[200px] lg:h-[400px] overflow-hidden iframe-div rounded-xl lg:rounded-2xl flex justify-center items-center'
            dangerouslySetInnerHTML={{ __html: listing.googleMap }}
          />
        </div>
      </div>
      {/* Update Status Button */}
      <div className='flex justify-end'>
        <Button
          variant='default'
          className='rounded-full py-3 lg:py-5 px-4 lg:px-8 w-full lg:w-44 bg-[var(--primary-main)] text-white hover:bg-[var(--primary-main)] border border-[var(--primary-main)] cursor-pointer text-sm lg:text-base'
          type='button'
          onClick={(e) => {
            e.stopPropagation();
            setUpdateDialogProperty(listing);
            setUpdateDialogOpen(true);
          }}
        >
          Update Status
        </Button>
      </div>
    </div>
  );
}
