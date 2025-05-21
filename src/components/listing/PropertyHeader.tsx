import Image, { StaticImageData } from 'next/image';
import { Heart, Share2, Trash2 } from 'lucide-react';

interface PropertyHeaderProps {
  price: string;
  title: string;
  isVerified: boolean;
  location: string;
  pinIcon: StaticImageData;
}

export function PropertyHeader({
  price,
  title,
  isVerified,
  location,
  pinIcon,
}: PropertyHeaderProps) {
  return (
    <div className='flex flex-col gap-2  p-5  rounded-lg mb-2 border'>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <div className='text-3xl font-extrabold text-[var(--primary-main)]'>
            {price}
          </div>
        </div>
        <div className='flex items-center gap-6'>
          <button type='button' className='hover:text-[var(--primary-main)]'>
            <Heart className='w-5 h-5' />
          </button>
          <button type='button' className='hover:text-[var(--primary-main)]'>
            <Share2 className='w-5 h-5' />
          </button>
          <button type='button' className='hover:text-[var(--primary-main)]'>
            <Trash2 className='w-5 h-5' />
          </button>
        </div>
      </div>
      <div className='text-2xl font-semibold flex items-center gap-2 mt-1'>
        {title}{' '}
        {isVerified && (
          <span className='bg-[var(--primary-mid)]/80 text-white font-normal text-xs px-3 py-1 rounded-full'>
            Verified
          </span>
        )}
      </div>
      <div className='flex items-center text-gray-400 gap-2 mt-1'>
        <Image src={pinIcon} alt='pin' width={15} height={15} /> {location}
      </div>
    </div>
  );
}
