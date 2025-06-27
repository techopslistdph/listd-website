'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import verified from '@/../public/images/icons/verified.png';
import areaIcon from '../../../public/images/icons/squaremeter.svg';
import bedIcon from '../../../public/images/icons/bedroom.svg';
import bathIcon from '../../../public/images/icons/bath.svg';
import { PhoneIcon } from 'lucide-react';
import { Button } from '../ui/button';

import { useGetUserLikedProperties } from '@/lib/queries/hooks/use-user-profile';
import { filterProperties } from '@/lib/utils/filterProperty';
import { PropertyDetail } from '@/lib/queries/server/propety/type';
import { useLikeProperty } from '@/lib/queries/hooks/use-property';
import FavoritesSkeleton from './FavoritesSkeleton';
import ConfirmationDialog from './ConfirmationDialog';

// Helper function to extract property features from the backend response
const getPropertyFeatures = (property: PropertyDetail) => {
  return {
    numberOfBedrooms: property.numberOfBedrooms,
    numberOfBathrooms: property.numberOfBathrooms,
    floorArea: property.floorArea,
    lotSize: property.lotSize,
  };
};

export default function MyFavorites() {
  const { data: userLikedProperties, isLoading } = useGetUserLikedProperties();
  const [showModal, setShowModal] = useState(false);
  const [propertyToRemove, setPropertyToRemove] = useState<string | null>(null);
  const { mutate: likeProperty } = useLikeProperty();

  const handleHeartClick = (propertyId: string) => {
    setPropertyToRemove(propertyId);
    setShowModal(true);
  };

  const handleRemove = () => {
    if (propertyToRemove) {
      likeProperty(propertyToRemove);
      setPropertyToRemove(null);
      setShowModal(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setPropertyToRemove(null);
  };

  if (isLoading) {
    return <FavoritesSkeleton />;
  }

  if (!userLikedProperties?.success) {
    return (
      <div>
        <h1 className='text-xl lg:text-2xl font-semibold mb-1'>
          Manage your Favorites
        </h1>
        <p className='text-sm lg:text-base text-gray-400 mb-6'>
          Organize and update your property listings
        </p>
        <div className='text-red-500 text-center mt-12 text-lg'>
          Error: {userLikedProperties?.message}
        </div>
      </div>
    );
  }

  // filter properties that have images and has valid image url
  const filteredProperties = filterProperties(userLikedProperties?.data);

  return (
    <div className='lg:p-8'>
      {/* Title and subtitle */}
      <h1 className='text-xl lg:text-2xl font-semibold mb-1'>
        Manage your Listing
      </h1>
      <p className='text-sm lg:text-base text-gray-400 mb-6'>
        Organize and update your property listings
      </p>
      {/* Property List */}
      <div className='flex flex-col gap-4 lg:gap-8'>
        {filteredProperties?.length === 0 ? (
          <div className='flex flex-col items-center justify-center mt-12 lg:mt-24'>
            <Image
              src={'/images/icons/empty.svg'}
              alt='No favorites'
              width={150}
              height={50}
              className='mb-4 lg:mb-8 lg:w-[204px] lg:h-[67px]'
            />
            <div className='text-xl lg:text-2xl font-bold text-[#2D0C7E] mb-2 text-center'>
              No favorites to show.
            </div>
            <div className='text-sm lg:text-base text-gray-400 text-center'>
              {userLikedProperties?.message ||
                'You don&apos;t have any favorite properties yet.'}
            </div>
          </div>
        ) : (
          // use any for now
          filteredProperties?.map((property: PropertyDetail) => {
            const features = getPropertyFeatures(property);
            return (
              <div
                key={property.id}
                className='flex flex-col lg:flex-row bg-white rounded-2xl lg:rounded-3xl shadow-2xl shadow-[#F7EFFD] p-4 lg:p-6 w-full lg:items-stretch relative min-h-[260px]'
              >
                {/* Image */}
                <div className='flex-shrink-0 flex items-center mb-4 lg:mb-0'>
                  <Image
                    src={property?.property?.images[0].imageUrl}
                    alt={property?.property?.listingTitle}
                    width={240}
                    height={200}
                    className='w-full lg:w-60 h-48 lg:h-56 object-cover rounded-xl mb-auto lg:rounded-2xl'
                  />
                </div>
                {/* Details */}
                <div className='flex flex-col justify-between lg:ml-8 flex-1'>
                  <div>
                    <div className='text-[#4B23A0] font-bold text-xl lg:text-2xl mb-1'>
                      {property?.property?.listingPriceFormatted}
                    </div>
                    <div className='text-lg lg:text-xl font-semibold mb-1'>
                      {property?.property?.listingTitle}
                    </div>
                    {property?.property?.address && (
                      <div className='flex items-center text-gray-400 text-sm lg:text-base mb-1'>
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
                        {property?.property?.address}
                      </div>
                    )}
                    {property?.property?.scrapeContactInfo?.agentName && (
                      <div className='flex items-center text-gray-400 text-sm lg:text-base mb-3 lg:mb-4'>
                        <PhoneIcon className='w-4 h-4 lg:w-5 lg:h-5 mr-1' />
                        {property.property.scrapeContactInfo.agentName}
                        <Image
                          src={verified}
                          alt='verified'
                          className='w-3 lg:w-4 ml-1'
                        />
                      </div>
                    )}
                  </div>
                  <div className='flex flex-wrap gap-4 lg:gap-8 text-gray-400 text-sm lg:text-base'>
                    <div className='flex text-gray-400 text-base gap-5 mb-2'>
                      {features.numberOfBedrooms && (
                        <div className='flex flex-col gap-1'>
                          <Image src={bedIcon} alt='bed' />
                          <span>{features.numberOfBedrooms} Bedroom</span>
                        </div>
                      )}
                      {features.numberOfBathrooms && (
                        <div className='flex flex-col gap-1'>
                          <Image src={bathIcon} alt='bath' />
                          <span>{features.numberOfBathrooms} Bath</span>
                        </div>
                      )}
                      {features.floorArea && (
                        <div className='flex flex-col gap-1'>
                          <Image src={areaIcon} alt='area' />
                          <span>{features.floorArea} sqm</span>
                        </div>
                      )}
                      {features.lotSize && (
                        <div className='flex flex-col gap-1'>
                          <Image src={areaIcon} alt='lot' />
                          <span>{features.lotSize} sqm lot</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='flex justify-end mt-2 gap-4 lg:gap-0'>
                    <div className='flex flex-col lg:flex-row gap-2 lg:gap-4 w-full lg:w-auto'>
                      {property?.property?.scrapeContactInfo?.phoneNumber && (
                        <Button
                          type='button'
                          className='rounded-full py-3 lg:py-5 px-4 lg:px-8 w-full lg:w-44 bg-primary-main text-white hover:bg-primary-main border border-primary-main cursor-pointer text-sm lg:text-base'
                          onClick={() =>
                            window.open(
                              `https://wa.me/${property?.property?.scrapeContactInfo?.phoneNumber}?text=Hello, I'm interested in your property: ${property?.property?.listingTitle}`,
                              '_blank'
                            )
                          }
                        >
                          Whatsapp
                        </Button>
                      )}
                      {property?.property?.scrapeContactInfo?.email && (
                        <Button
                          type='button'
                          onClick={() =>
                            window.open(
                              `mailto:${property?.property?.scrapeContactInfo?.email}?subject=Hello, I'm interested in your property: ${property?.property?.listingTitle}`,
                              '_blank'
                            )
                          }
                          className='rounded-full py-3 lg:py-5 px-4 lg:px-8 w-full lg:w-44 bg-primary-main text-white hover:bg-primary-main border border-primary-main cursor-pointer text-sm lg:text-base'
                        >
                          Direct Message
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                {/* Heart Icon */}
                <div
                  className='absolute top-4 right-4 lg:top-6 lg:right-6 cursor-pointer'
                  onClick={() => handleHeartClick(property.property.id)}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    className='w-5 h-5 lg:w-7 lg:h-7 text-[#4B23A0]'
                  >
                    <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
                  </svg>
                </div>
              </div>
            );
          })
        )}
      </div>
      <ConfirmationDialog
        showModal={showModal}
        setShowModal={setShowModal}
        handleCancel={handleCancel}
        handleRemove={handleRemove}
      />
    </div>
  );
}
