'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function PropertyFeatures({ features }: { features: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className='mt-4 md:mt-6 p-5  rounded-lg mb-2 border'>
      <button
        className='flex items-center justify-between w-full font-semibold text-xl mb-2 cursor-pointer focus:outline-none'
        onClick={() => setOpen(prev => !prev)}
        type='button'
      >
        <span>Features</span>
        <ChevronDown
          className={`transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <div className='flex flex-wrap gap-2 mt-5'>
          {features.map((f, i) => (
            <span
              key={i}
              className='bg-primary-mid text-white px-3 py-1 rounded-full text-sm'
            >
              {f}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
