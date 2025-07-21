'use client';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
}

export function PropertyMap({ latitude, longitude, title }: PropertyMapProps) {
  const [open, setOpen] = useState(false);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&q=${latitude},${longitude}&zoom=15`;
  return (
    <div className='mt-4 md:mt-6 rounded-lg mb-4 border'>
      <button
        className='flex items-center justify-between w-full font-semibold text-xl p-5 cursor-pointer focus:outline-none'
        onClick={() => setOpen(prev => !prev)}
        type='button'
      >
        <span className='text-xl lg:text-2xl leading-[30px] font-semibold break-words'>
          Location
        </span>
        <ChevronDown
          className={`transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <div className='w-full'>
          <div className='w-full h-[400px] overflow-hidden'>
            <iframe
              src={mapUrl}
              width='100%'
              height='100%'
              style={{ border: 0 }}
              allowFullScreen
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
              title={`Map location for ${title}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
