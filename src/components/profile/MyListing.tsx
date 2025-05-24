import { PhoneIcon } from 'lucide-react';
import React from 'react';
import verified from '@/../public/images/icons/verified.png';
import Image from 'next/image';
const listings = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    status: 'For Lease',
    price: '₱ 9.6M',
    title: 'San Lorenzo Place',
    address: 'EDSA corner Chino Roces Avenue, Makati City',
    agent: 'Danica Ong',
    verified: true,
    details: {
      bedroom: 1,
      bath: 1,
      sqm: 26,
    },
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    status: 'For Lease',
    price: '₱ 9.6M',
    title: 'San Lorenzo Place',
    address: 'EDSA corner Chino Roces Avenue, Makati City',
    agent: 'Danica Ong',
    verified: true,
    details: {
      bedroom: 1,
      bath: 1,
      sqm: 26,
    },
  },
];

export default function MyListing() {
  return (
    <div className='p-8'>
      {/* Title and subtitle */}
      <h1 className='text-2xl font-semibold mb-1'>Manage your Listing</h1>
      <p className='text-gray-400 mb-6'>
        Organize and update your property listings
      </p>

      {/* Tabs */}
      <div className='flex bg-gray-100 rounded-full mb-6 w-full'>
        <button className='flex-1 py-2 rounded-full bg-[#4B23A0] text-white font-medium transition'>
          Published
        </button>
        <button className='flex-1 py-2 rounded-full text-gray-500 font-medium transition'>
          Closed
        </button>
        <button className='flex-1 py-2 rounded-full text-gray-500 font-medium transition'>
          Drafts
        </button>
      </div>

      {/* Listings */}
      <div className='space-y-8'>
        {listings.map((listing) => (
          <div
            key={listing.id}
            className='flex bg-white rounded-3xl shadow-md p-6 items-center gap-5 mx-auto'
          >
            {/* Image */}
            <img
              src={listing.image}
              alt={listing.title}
              className='w-56 h-56 object-cover rounded-2xl'
            />
            {/* Details */}
            <div className='flex-1'>
              <div className='flex items-center mb-2'>
                <span className='bg-[var(--primary-light)] text-[var(--primary-main)] px-3 py-1 rounded-lg text-sm font-medium mr-4'>
                  {listing.status}
                </span>
              </div>
              <div className='text-[#4B23A0] font-bold text-xl mb-1'>
                {listing.price}
              </div>
              <div className='text-lg font-semibold mb-1'>{listing.title}</div>
              <div className='flex items-center text-gray-400 text-sm mb-1'>
                <svg
                  className='w-4 h-4 mr-1'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
                {listing.address}
              </div>
              <div className='flex items-center text-gray-400 text-sm mb-10 gap-1'>
                <PhoneIcon className='w-4' />
                {listing.agent}
                {listing.verified && (
                  <Image src={verified} alt='verified' className='w-4' />
                )}
              </div>
              <div className='flex space-x-6 text-gray-400 text-sm'>
                <div className='flex items-center'>
                  <svg
                    className='w-4 h-4 mr-1'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M8 10h.01M12 10h.01M16 10h.01M21 16v-2a4 4 0 00-3-3.87M3 16v-2a4 4 0 013-3.87m0 0A4 4 0 0112 4a4 4 0 016 6.13'
                    />
                  </svg>{' '}
                  {listing.details.bedroom} Bedroom
                </div>
                <div className='flex items-center'>
                  <svg
                    className='w-4 h-4 mr-1'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M7 10V6a5 5 0 0110 0v4M5 20h14a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z'
                    />
                  </svg>{' '}
                  {listing.details.bath} Bath
                </div>
                <div className='flex items-center'>
                  <svg
                    className='w-4 h-4 mr-1'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M4 6h16M4 10h16M4 14h16M4 18h16'
                    />
                  </svg>{' '}
                  {listing.details.sqm} sqm
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
