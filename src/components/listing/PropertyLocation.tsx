'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface PropertyLocationProps {
  googleMap: string;
}

export default function PropertyLocation({ googleMap }: PropertyLocationProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className='mt-4 md:mt-6 rounded-lg mb-4 border'>
      <button
        className='flex items-center justify-between w-full font-semibold text-xl p-5 cursor-pointer focus:outline-none'
        onClick={() => setOpen((prev) => !prev)}
        type='button'
      >
        <span>Location</span>
        <ChevronDown
          className={`transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <div className='w-full'>
          <div
            className='w-full h-[400px] overflow-hidden iframe-div flex justify-center items-center'
            dangerouslySetInnerHTML={{ __html: googleMap }}
          />
        </div>
      )}
    </div>
  );
}
