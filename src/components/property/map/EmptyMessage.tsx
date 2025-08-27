import React from 'react';

export default function EmptyMessage() {
  return (
    <div className='absolute top-5 left-5 right-5 transform   z-10 bg-white rounded-lg shadow-lg p-6 text-center max-w-sm'>
      <h3 className='text-lg font-semibold text-gray-800 mb-2'>
        No Properties Found
      </h3>
      <p className='text-gray-600 text-sm'>
        Oops! We couldn&apos;t find any properties matching your search in this
        area.
      </p>
      <p className='text-gray-500 text-xs mt-2'>
        Try adjusting your search criteria or drawing a larger area.
      </p>
    </div>
  );
}
