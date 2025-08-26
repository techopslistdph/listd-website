/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import verified from '@/../public/images/icons/verified.png';
import areaIcon from '../../../public/images/icons/squaremeter.svg';
import bedIcon from '../../../public/images/icons/bedroom.svg';
import bathIcon from '../../../public/images/icons/bath.svg';
import { Heart, MapPin, PhoneIcon } from 'lucide-react';
import { Button } from '../ui/button';

import { useGetUserLikedProperties } from '@/lib/queries/hooks/use-user-profile';
import { filterProperties } from '@/utils/filterProperty';
import { PropertyDetail } from '@/lib/queries/server/propety/type';
import { useLikeProperty } from '@/lib/queries/hooks/use-property';
import PropertySkeleton from './PropertySkeleton';
import ConfirmationDialog from './ConfirmationDialog';
import Link from 'next/link';

// Helper function to extract property features from the backend response
export const getPropertyFeatures = (property: PropertyDetail) => {
  return {
    numberOfBedrooms: property.numberOfBedrooms,
    numberOfBathrooms: property.numberOfBathrooms,
    floorArea: property.floorArea,
    lotSize: property.lotSize,
  };
};

export default function MyFavorites() {
  const {
    data: userLikedProperties,
    isLoading,
    refetch,
  } = useGetUserLikedProperties();
  React.useEffect(() => {
    refetch();
  }, [refetch]);

  const [showModal, setShowModal] = useState(false);
  const [propertyToRemove, setPropertyToRemove] = useState<string | null>(null);
  const { mutate: likeProperty } = useLikeProperty();

  const handleHeartClick = (
    event: React.MouseEvent<HTMLDivElement>,
    propertyId: string
  ) => {
    event.preventDefault();
    event.stopPropagation();
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

  const filteredProperties = filterProperties(userLikedProperties?.data);
  return (
    <div className='lg:p-8'>
      {/* Title and subtitle */}
      <h1 className='text-xl lg:text-2xl font-semibold mb-1'>
        Manage your Favories
      </h1>
      <p className='text-sm lg:text-base text-gray-400 mb-6'>
        Organize and update your property favorites
      </p>
      {/* Property List */}
      <div className='flex flex-col gap-4 lg:gap-8'>
        {isLoading && <PropertySkeleton />}
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
          filteredProperties?.map((property: PropertyDetail) => {
            const features = getPropertyFeatures(property);
            return (
              <Link
                href={`/property/${property.id}?property=${property?.property?.propertyTypeName?.replaceAll(' ', '-').toLowerCase()}`}
                key={property.id}
                className='grid grid-cols-1 lg:grid-cols-4 bg-white rounded-3xl shadow-2xl shadow-[#F7EFFD] p-4 lg:p-6 cursor-pointer transition w-full relative'
              >
                {/* Image */}
                <div className='flex-shrink-0 flex items-center mb-4 lg:mb-0 col-span-1'>
                  <img
                    src={property?.property?.images[0]?.imageUrl}
                    alt={property?.property?.listingTitle}
                    width={240}
                    height={200}
                    className='w-full lg:w-full h-72 lg:h-56 object-cover mb-auto rounded-2xl'
                  />
                </div>
                {/* Details */}
                <div className='flex flex-col justify-between lg:ml-8 flex-1 col-span-3'>
                  <div>
                    <div className='text-[#4B23A0] font-bold text-xl lg:text-2xl mb-1'>
                      {property?.property?.listingPrice.toLocaleString(
                        'en-US',
                        {
                          style: 'currency',
                          currency: 'PHP',
                        }
                      ) || 'Price not available'}
                    </div>
                    <div className='text-lg lg:text-xl font-semibold mb-1 break-words'>
                      {property.property.listingTitle.length > 70
                        ? property.property.listingTitle.slice(0, 70) + '...'
                        : property.property.listingTitle ||
                          'Title not available'}
                    </div>
                    {property?.property?.address && (
                      <div className='flex items-center text-gray-400 text-sm lg:text-base mb-1'>
                        <MapPin className='w-4 h-4 lg:w-5 lg:h-5 mr-1' />
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
                <div
                  className='absolute sm:top-10 sm:right-10 lg:top-6 lg:right-6 cursor-pointer bg-white p-3 rounded-full shadow-xl'
                  onClick={e => handleHeartClick(e, property.property.id)}
                >
                  <Heart className='w-5 h-5 lg:w-7 lg:h-7 text-[#4B23A0] fill-current rounded-full p-1' />
                </div>
              </Link>
            );
          })
        )}
      </div>
      <ConfirmationDialog
        showModal={showModal}
        setShowModal={setShowModal}
        handleCancel={handleCancel}
        handleRemove={handleRemove}
        title='Remove from favorites'
        description='Are you sure you want to remove this from your favorite list?'
      />
    </div>
  );
}
