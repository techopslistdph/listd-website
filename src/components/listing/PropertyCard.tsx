/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import Link from 'next/link';
import pinIcon from '../../../public/images/icons/pin.svg';
import bedIcon from '../../../public/images/icons/bedroom.svg';
import bathIcon from '../../../public/images/icons/bath.svg';
import areaIcon from '../../../public/images/icons/squaremeter.svg';
import { PropertyImages } from './PropertyImages';
import { Heart, PhoneIcon } from 'lucide-react';
import verified from '../../../public/images/icons/verified.png';
import { PropertyDetail } from '@/lib/queries/server/propety/type';
import { SearchParams } from '@/lib/queries/server/propety';
import { useLikeProperty } from '@/lib/queries/hooks/use-property';
import { useState } from 'react';
import { User } from '@clerk/nextjs/server';

export default function PropertyCard({
  propertyDetail,
  view,
  propertyType,
  user,
}: {
  propertyDetail: PropertyDetail;
  view?: 'list' | 'map';
  propertyType: SearchParams['property'];
  user: User | null | undefined;
}) {
  const {
    property: {
      id: propertyId,
      images,
      listingTitle,
      listingPrice,
      address,
      scrapeContactInfo,
      listingPriceFormatted,
      propertyOwnerId,
    },
    id,
    numberOfBathrooms,
    numberOfBedrooms,
    floorArea,
    isLiked: initialIsLiked,
  } = propertyDetail;

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const { mutate: likeProperty } = useLikeProperty();

  const handleLikeProperty = () => {
    if (!user) {
      window.open('/login', '_blank');
      return;
    }
    setIsLiked(prev => !prev);
    likeProperty(propertyId, {
      onSuccess: response => {
        if (response.success && 'liked' in response) {
          setIsLiked(response.liked);
        }
      },
      onError: error => {
        console.error('Failed to like property:', error);
        setIsLiked(initialIsLiked);
      },
    });
  };

  if (view === 'map') {
    // Horizontal card for map view
    return (
      <div className='grid sm:grid-cols-3 bg-white rounded-2xl shadow-lg shadow-[#F7EFFD] transition-transform duration-300 cursor-pointer  p-3 gap-4'>
        <div className=' rounded-2xl overflow-hidden w-full sm:w-[295px] md:w-full h-[200px] sm:h-[280px]'>
          <Link href={`/property/${id}?property=${propertyType}`}>
            <img
              src={images[0]?.imageUrl}
              alt={listingTitle}
              width={195}
              height={240}
              className='object-cover w-full h-full'
            />
          </Link>
        </div>

        <div className='w-full flex flex-col sm:h-[280px] justify-around col-span-2'>
          <div className='relative'>
            <button
              onClick={() => handleLikeProperty()}
              type='button'
              className='absolute -top-2 sm:-top-5 right-4 bg-white rounded-full p-2 sm:p-3 z-20 flex items-center justify-center shadow-md hover:bg-primary-main/10 transition-colors cursor-pointer'
              aria-label='Favorite'
            >
              {isLiked ? (
                <Heart
                  className='w-5 h-5 text-primary-main'
                  strokeWidth={3}
                  fill='text-primary-main'
                />
              ) : (
                <Heart
                  className='w-5 h-5 text-primary-main'
                  strokeWidth={3}
                  fill='white'
                />
              )}
            </button>

            {/* Wrap only the title/content block in the Link */}
            <Link href={`/property/${id}?property=${propertyType}`}>
              <div className='text-xl font-extrabold text-primary-main mb-1'>
                {listingPriceFormatted}
              </div>
              <div className='text-lg font-semibold text-black mb-1 truncate'>
                {listingTitle}
              </div>
              <div className='flex items-center text-gray-400 mb-2 gap-1'>
                <Image src={pinIcon} alt='pin' />
                <span className='truncate'>{address}</span>
              </div>
              <div className='flex items-center text-gray-400  gap-2 mb-4 '>
                {scrapeContactInfo?.agentName && (
                  <div className='flex items-center gap-1'>
                    <PhoneIcon className='w-4 text-primary-main' />
                    <span className='font-medium'>
                      {scrapeContactInfo?.agentName}
                    </span>
                  </div>
                )}
                {scrapeContactInfo?.agentName && (
                  <Image src={verified} alt='verified' width={16} height={16} />
                )}
              </div>
              <div className='flex flex-wrap text-gray-400 text-base gap-3 sm:gap-5 mb-2'>
                {numberOfBedrooms !== null && numberOfBedrooms !== 0 && (
                  <div className='flex items-center gap-1'>
                    <Image src={bedIcon} alt='bed' />
                    <span>{numberOfBedrooms} Bedroom</span>
                  </div>
                )}
                {numberOfBathrooms !== null && numberOfBathrooms !== 0 && (
                  <div className='flex items-center gap-1'>
                    <Image src={bathIcon} alt='bath' />
                    <span>{numberOfBathrooms} Bath</span>
                  </div>
                )}
                {floorArea !== null && floorArea !== 0 && (
                  <div className='flex items-center gap-1'>
                    <Image src={areaIcon} alt='area' />
                    <span>{floorArea} sqm</span>
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Contact buttons OUTSIDE of <Link> */}
          <div className='flex flex-col sm:flex-row gap-3 mt-2'>
            {scrapeContactInfo?.phoneNumber && (
              <a
                href={`https://wa.me/${scrapeContactInfo?.phoneNumber}`}
                className='flex-1 py-2 rounded-full border border-primary-main text-sm text-primary-main text-center font-semibold'
                target='_blank'
                rel='noopener noreferrer'
              >
                Whatsapp
              </a>
            )}
            {propertyOwnerId && (
              <Link
                href='/message'
                className='flex-1 py-2 rounded-full bg-primary-main text-sm text-white text-center font-semibold'
              >
                Direct Message
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default (list) card
  return (
    <div className='block'>
      <div className='mx-auto rounded-2xl shadow-lg shadow-[#F7EFFD] transition-transform duration-300 cursor-pointer bg-white relative'>
        <div className='relative'>
          <PropertyImages
            images={images}
            title={listingTitle}
            cardMode
            handleLikeProperty={handleLikeProperty}
            isLiked={isLiked}
          />
        </div>
        <div className='p-4'>
          {/* Only wrap the title and property info in the Link */}
          <Link href={`/property/${id}?property=${propertyType}`}>
            <div className='flex items-center justify-between mb-1'>
              <div className='w-3/4 text-lg font-semibold text-black truncate capitalize'>
                {listingTitle}
              </div>
              {listingPrice && (
                <div className='font-extrabold text-lg text-primary-main'>
                  {listingPriceFormatted}
                </div>
              )}
            </div>
            {address && (
              <div className='flex items-center text-gray-400 mb-2 gap-3 mx-3'>
                <Image src={pinIcon} alt='pin' />
                <span className='truncate'>{address}</span>
              </div>
            )}
            {scrapeContactInfo?.agentName && (
              <div className='flex items-center text-gray-400  gap-2 mb-4 mx-3'>
                <PhoneIcon className='w-4 text-primary-main' />
                <span className='font-medium'>
                  {scrapeContactInfo?.agentName}
                </span>
                {scrapeContactInfo?.agentName && (
                  <Image src={verified} alt='verified' width={16} height={16} />
                )}
              </div>
            )}
            <div className='flex text-gray-400 text-base gap-5 mb-2'>
              {numberOfBedrooms !== null && numberOfBedrooms !== 0 && (
                <div className='flex flex-col gap-1'>
                  <Image src={bedIcon} alt='bed' />
                  <span>{numberOfBedrooms} Bedroom</span>
                </div>
              )}
              {numberOfBathrooms !== null && numberOfBathrooms !== 0 && (
                <div className='flex flex-col gap-1'>
                  <Image src={bathIcon} alt='bath' />
                  <span>{numberOfBathrooms} Bath</span>
                </div>
              )}
              {floorArea !== null && floorArea !== 0 && (
                <div className='flex flex-col gap-1'>
                  <Image src={areaIcon} alt='area' />
                  <span>{floorArea} sqm</span>
                </div>
              )}
            </div>
          </Link>

          {/* Contact buttons should be outside the Link */}
          <div className='flex gap-3 mt-3'>
            {scrapeContactInfo?.phoneNumber && (
              <a
                href={`https://wa.me/${scrapeContactInfo?.phoneNumber}`}
                className='flex-1 py-2 flex items-center justify-center text-sm rounded-full border border-primary-main text-primary-main font-semibold'
              >
                Whatsapp
              </a>
            )}
            {propertyOwnerId && (
              <Link
                href='/message'
                className='flex-1 py-2 rounded-full bg-primary-main text-sm text-white text-center font-semibold'
              >
                Direct Message
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
