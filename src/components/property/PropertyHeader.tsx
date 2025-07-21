/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image';
import { Heart, Share2 } from 'lucide-react';
import { handleShareProperty } from '@/lib/utils/ShareProperty';
import pinIcon from '../../../public/images/icons/pin.svg';
import { formatPrice } from './propertySidebar/RangeSlider';

interface PropertyHeaderProps {
  listingPrice: number;
  title: string;
  isPublished: boolean;
  location: string;
  isLiked: boolean;
  handleLikeProperty: () => void;
}

export function PropertyHeader({
  listingPrice,
  title,
  isPublished,
  location,
  isLiked = false,
  handleLikeProperty = () => {},
}: PropertyHeaderProps) {
  return (
    <div className='flex flex-col gap-2 p-5 rounded-lg mb-2 border'>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          {listingPrice && (
            <div className='text-xl md:text-4xl font-bold text-primary-main'>
              ₱{formatPrice(listingPrice)}
            </div>
          )}
        </div>
        <div className='flex items-center gap-2 lg:gap-6'>
          <button
            type='button'
            className='hover:text-primary-main cursor-pointer [&>svg]:hover:fill-primary-main'
            onClick={() => handleLikeProperty()}
          >
            <Heart
              className={`w-5 h-5 ${isLiked ? 'fill-primary-main' : ''}`}
            />
          </button>
          <button
            type='button'
            className='hover:text-primary-main cursor-pointer [&>svg]:hover:fill-primary-main'
            onClick={() =>
              handleShareProperty(title, location, listingPrice.toString())
            }
          >
            <Share2 className='w-5 h-5' />
          </button>
        </div>
      </div>
      <div className='flex flex-wrap items-start gap-2 mt-1'>
        <p className='text-xl lg:text-2xl font-semibold break-words'>
          {title}{' '}
        </p>
        {/* {isPublished && (
          <span className='bg-primary-mid text-white font-normal text-xs px-3 py-1 rounded-full flex-shrink-0'>
            Verified
          </span>
        )} */}
      </div>
      {location && (
        <div className='flex items-center text-neutral-mid gap-2 '>
          <Image src={pinIcon} alt='pin' width={15} height={15} />{' '}
          <p className='text-sm md:text-base font-medium'>{location}</p>
        </div>
      )}
    </div>
  );
}
