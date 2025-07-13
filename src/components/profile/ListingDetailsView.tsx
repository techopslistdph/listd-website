 
 
import React from 'react';
import 'swiper/css';

import { PropertyDetail } from '@/lib/queries/server/propety/type';
import { ArrowLeft } from 'lucide-react';
import { PropertyImages } from '../listing/PropertyImages';
import PropertyDetailsDisplay from '../listing/PropertyDetailsDisplay';
import { Button } from '../ui/button';

interface ListingDetailsViewProps {
  listing: PropertyDetail;
  setUpdateDialogProperty: (listing: PropertyDetail) => void;
  setUpdateDialogOpen: (open: boolean) => void;
  setShowDetails: (show: boolean) => void;
}

export default function ListingDetailsView({
  listing,
  setUpdateDialogProperty,
  setUpdateDialogOpen,
  setShowDetails,
}: ListingDetailsViewProps) {
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&q=${listing.property.latitude},${listing.property.longitude}&zoom=15`;
  return (
    <div className='bg-white p-4 lg:p-8'>
      {/* back button */}
      <button
        className='flex items-center gap-2 text-primary-mid font-bold cursor-pointer text-sm lg:text-base mb-5'
        onClick={() => setShowDetails(false)}
      >
        <ArrowLeft className='w-4 h-4 lg:w-5 lg:h-5' />
        Back
      </button>
      {/* Images */}
      {listing.property.images.length > 0 && (
        <div className='mb-4 lg:mb-6'>
          <PropertyImages
            images={listing.property.images}
            title={listing.property.listingTitle}
          />
        </div>
      )}

      {/* Title, Address, Price, Status, Verified */}
      <div className='flex flex-col lg:flex-row lg:items-start justify-between mb-2'>
        <div className='flex flex-col gap-1 flex-1 min-w-0'>
          <div className='text-xl lg:text-2xl font-bold mb-1 break-words overflow-hidden'>
            {listing.property.listingTitle}
          </div>
          {listing.property.address ||
            (listing.property.barangayName && (
              <div className='flex items-center text-neutral-mid text-sm lg:text-base mb-1'>
                <svg
                  className='w-4 h-4 lg:w-5 lg:h-5 mr-1'
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
                {listing.property.address ||
                  `${listing.property.cityName}, ${listing.property.barangayName}`}
              </div>
            ))}
          <div className='text-lg lg:text-xl font-bold mb-1'>
            {listing.property.listingPrice &&
              listing.property.listingPrice.toLocaleString('en-US', {
                style: 'currency',
                currency: 'PHP',
              })}
          </div>
          <div className='text-sm lg:text-base text-primary-mid font-semibold mb-1'>
            {listing.property.listingTypeName.toLowerCase().includes('buy')
              ? 'For Sale'
              : listing.property.listingTypeName.toLowerCase().includes('rent')
                ? 'For Rent'
                : ''}
          </div>
        </div>
        {listing.property.isPublished && (
          <div className='flex items-center gap-1 bg-primary-mid text-white px-2 w-24 justify-center lg:px-3 py-1 rounded-full text-xs font-medium mt-2 lg:mt-0'>
            <span className='text-xs text-white font-bold'>Verified</span>
          </div>
        )}
      </div>
      <hr className='my-3 lg:my-4' />
      <div className='space-y-5 lg:space-y-6'>
        {/* Description */}
        <div className=''>
          <div className='font-bold text-base lg:text-lg mb-1'>Description</div>
          <div className='text-neutral-main text-sm lg:text-base'>
            {listing.property.listingDescription}
          </div>
          <div className='font-bold text-base lg:text-lg mt-5'>Details</div>
          <PropertyDetailsDisplay
            propertyDetail={listing}
            className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full mt-3'
          />
        </div>

        {/* Property Features & Amenities */}
        <div className=''>
          <div className='font-bold text-base lg:text-lg mb-2'>
            Property Features & Amenities
          </div>
          <div className='flex flex-wrap gap-2'>
            {listing.property.features.map((f, i) => (
              <span
                key={i}
                className='bg-primary-mid text-white px-3 py-1 rounded-full text-sm'
              >
                {f.name}
              </span>
            ))}
            {listing.property.amenities.map((a, i) => (
              <span
                key={i}
                className='bg-primary-mid text-white px-3 py-1 rounded-full text-sm'
              >
                {a.name}
              </span>
            ))}
          </div>
        </div>
        {/* Property Location (Map) */}
        <div className=''>
          <div className='font-bold text-base lg:text-lg mb-2'>
            Property location
          </div>
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
                title={`Map location for ${listing.property.listingTitle}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Update Status Button */}
      <div className='flex justify-end mt-5'>
        <Button
          variant='default'
          className='rounded-full py-3 lg:py-5 px-4 lg:px-8 w-full lg:w-44 bg-primary-main text-white hover:bg-primary-main border border-primary-main cursor-pointer text-sm lg:text-base'
          type='button'
          onClick={e => {
            e.stopPropagation();
            setUpdateDialogProperty(listing);
            setUpdateDialogOpen(true);
          }}
        >
          Update Status
        </Button>
     
      </div>
    </div>
  );
}
