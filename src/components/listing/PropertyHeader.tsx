import Image, { StaticImageData } from 'next/image';
import { Heart, Share2 } from 'lucide-react';
import { formatPrice } from '@/utils/numberUtils';

interface PropertyHeaderProps {
  price: number;
  title: string;
  isVerified: boolean;
  location: string;
  pinIcon: StaticImageData;
  isLiked: boolean;
  handleLikeProperty: () => void;
}

export function PropertyHeader({
  price,
  title,
  isVerified,
  location,
  pinIcon,
  isLiked = false,
  handleLikeProperty = () => {},
}: PropertyHeaderProps) {
  return (
    <div className='flex flex-col gap-2 p-5 rounded-lg mb-2 border'>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          {price && (
            <div className='text-xl md:text-3xl font-extrabold text-primary-main'>
              ₱ {formatPrice(price)}
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
          >
            <Share2 className='w-5 h-5' />
          </button>
        </div>
      </div>
      <div className='text-xl lg:text-2xl font-semibold flex items-center gap-2 mt-1'>
        {title}{' '}
        {isVerified && (
          <span className='bg-primary-mid/80 text-white font-normal text-xs px-3 py-1 rounded-full'>
            Verified
          </span>
        )}
      </div>
      {location && (
        <div className='flex items-center text-gray-400 gap-2 mt-1'>
          <Image src={pinIcon} alt='pin' width={15} height={15} />{' '}
          <p className='text-sm md:text-base'>{location}</p>
        </div>
      )}
    </div>
  );
}
