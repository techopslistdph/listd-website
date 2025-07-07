'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import PropertyDetailsDisplay from './PropertyDetailsDisplay';
import { PropertyDetail } from '@/lib/queries/server/propety/type';

interface PropertyDescriptionProps {
  description: string;
  propertyDetail: PropertyDetail;
}

export default function PropertyDescription({
  description,
  propertyDetail,
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
          <PropertyDetailsDisplay
            propertyDetail={propertyDetail}
            className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4  w-full'
          />
        </div>
      )}
    </div>
  );
}
