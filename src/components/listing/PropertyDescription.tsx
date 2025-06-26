'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Image, { StaticImageData } from 'next/image';
import areaIcon from '../../../public/images/icons/squaremeter.svg';
import bedIcon from '../../../public/images/icons/bedroom.svg';
import bathIcon from '../../../public/images/icons/bath.svg';
import fullyFurnishedIcon from '../../../public/images/icons/fully-furnished.svg';
import parkingIcon from '../../../public/images/icons/car.svg';
import facingWestIcon from '../../../public/images/icons/facing-west.svg';

interface PropertyDescriptionProps {
  description: string;
  details: Record<string, string | number | boolean | undefined>[];
}

const iconMap: Record<string, StaticImageData> = {
  area: areaIcon,
  lotSize: areaIcon,
  bedrooms: bedIcon,
  baths: bathIcon,
  parking: parkingIcon,
  'facing west': facingWestIcon,
  'fully furnished': fullyFurnishedIcon,
  // Add more mappings as needed
};

function getIconForKey(key: string): StaticImageData | undefined {
  return iconMap[key];
}

export default function PropertyDescription({
  description,
  details,
}: PropertyDescriptionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className='mt-4 md:mt-6 p-5 rounded-lg mb-2 border'>
      <button
        className='flex items-center justify-between w-full font-semibold text-xl mb-2 cursor-pointer focus:outline-none'
        onClick={() => setOpen(prev => !prev)}
        type='button'
      >
        <span>Description</span>
        <ChevronDown
          className={`transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <div className=' mt-5'>
          <div className='mb-5 text-neutral-main'>{description}</div>
          {details.length > 0 && (
            <div className='flex gap-8  flex-wrap items-center'>
              {details?.map((item, idx) => {
                const key = Object.keys(item)[0];
                const value = item[key];
                if (value === undefined || value === false) return null;
                const icon = getIconForKey(key);
                const isBoolean = typeof value === 'boolean';
                return (
                  <div
                    key={idx}
                    className='flex flex-col items-center justify-center gap-1 text-neutral-mid text-sm'
                  >
                    {icon && (
                      <Image src={icon} alt={key} width={20} height={20} />
                    )}
                    {isBoolean ? (
                      key
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, l => l.toUpperCase())
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
                                ? 'Floor Area'
                                : key === 'lotSize'
                                  ? 'Lot Size'
                                  : key === 'floors'
                                    ? 'Floor'
                                    : key === 'garages'
                                      ? 'Garage'
                                      : key === 'livingRooms'
                                        ? 'Living Room'
                                        : key === 'diningRooms'
                                          ? 'Dining Room'
                                          : key === 'kitchens'
                                            ? 'Kitchen'
                                            : key === 'maidRooms'
                                              ? 'Maid Room'
                                              : key === 'yearBuilt'
                                                ? 'Year Built'
                                                : key === 'furnishingStatus'
                                                  ? 'Furnishing'
                                                  : ''}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
