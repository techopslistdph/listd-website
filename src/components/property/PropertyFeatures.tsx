'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function PropertyFeatures({
  features,
  amenities,
}: {
  features: { id: string; name: string }[];
  amenities: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);

  const featuresList = [...new Set(features.map(f => f.name))];
  const amenitiesList = [...new Set(amenities.map(a => a.name))];
  return (
    <div className='mt-4 md:mt-6 p-5  rounded-lg mb-2 border'>
      <button
        className='flex items-center justify-between w-full font-semibold text-xl mb-2 cursor-pointer focus:outline-none'
        onClick={() => setOpen(prev => !prev)}
        type='button'
      >
        <span className='text-xl lg:text-2xl leading-[30px] font-semibold break-words'>
          Features & Amenities
        </span>
        <ChevronDown
          className={`transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <div className='flex flex-wrap gap-2 mt-5'>
          {featuresList.map((f, i) => (
            <span
              key={i}
              className='bg-primary-mid text-white px-3 py-2 rounded-full text-xs'
            >
              {f}
            </span>
          ))}
          {amenitiesList.map((a, i) => (
            <span
              key={i}
              className='bg-primary-mid text-white px-3 py-2 rounded-full text-xs'
            >
              {a}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
