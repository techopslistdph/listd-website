/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import Link from 'next/link';
import pinIcon from '../../../public/images/icons/pin.svg';

import { PropertyImages } from '../property/PropertyImages';
import { Heart, PhoneIcon } from 'lucide-react';
import verified from '../../../public/images/icons/verified.png';
import { PropertyDetail } from '@/lib/queries/server/propety/type';
import { SearchParams } from '@/lib/queries/server/propety';
import { useLikeProperty } from '@/lib/queries/hooks/use-property';
import { useState } from 'react';
import { User } from '@clerk/nextjs/server';
import { draftConversation } from '@/lib/utils/draftConversation';
import { Button } from '../ui/button';
import { useGetProfile } from '@/lib/queries/hooks/use-user-profile';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import { getPropertyDetailsForType } from '@/lib/utils/propertyDetailsWithIcons';
import { formatPrice } from './propertySidebar/RangeSlider';

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
      cityName,
      barangayName,
      scrapeContactInfo,
      propertyOwner,
    },
    id,
    isLiked: initialIsLiked,
  } = propertyDetail;

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const { mutate: likeProperty } = useLikeProperty();
  const { data: currentUser } = useGetProfile();
  const router = useRouter();

  // Get property details based on property type (max 3)
  const propertyDetails = getPropertyDetailsForType(
    propertyDetail,
    propertyType
  );

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

  const renderPropertyDetails = () => (
    <div className='flex flex-wrap text-gray-400 text-base gap-3 sm:gap-5 mb-2 min-h-[24px] mx-3'>
      {propertyDetails.length > 0 ? (
        propertyDetails.map(detail => (
          <TooltipProvider key={detail.key}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='flex items-center gap-1 cursor-help'>
                  <Image src={detail.icon} alt={detail.label.toLowerCase()} />
                  <div>
                    <span>{detail.value}</span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{detail.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))
      ) : (
        // Placeholder to maintain consistent height when no details
        <div className='flex items-center gap-1 opacity-0'>
          <div className='w-4 h-4' />
          <span>No details</span>
        </div>
      )}
    </div>
  );

  if (view === 'map') {
    // Horizontal card for map view
    return (
      <div className='relative flex flex-col sm:grid sm:grid-cols-3 bg-white rounded-2xl shadow-lg shadow-[#F7EFFD] transition-transform duration-300 cursor-pointer p-3 gap-4 min-h-[280px]'>
        <div className='rounded-2xl overflow-hidden w-full sm:w-[295px] md:w-full h-[200px] sm:h-[280px]'>
          <Link
            href={`/property/${id}?property=${propertyType}`}
            className='w-full h-full'
          >
            <img
              src={images[0]?.imageUrl}
              alt={listingTitle}
              width={195}
              height={240}
              className='object-cover w-full h-full'
            />
          </Link>
        </div>

        <div className='w-full flex flex-col sm:h-[270px] justify-around col-span-2'>
          <div className='relative flex-1 flex flex-col'>
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

            <Link
              href={`/property/${id}?property=${propertyType}`}
              className='flex-1 flex flex-col'
            >
              {listingPrice && (
                <div className='text-xl font-extrabold text-primary-main mb-1'>
                  ₱{formatPrice(listingPrice)}
                </div>
              )}
              {listingTitle && (
                <div className='text-lg font-semibold text-black mb-2'>
                  <p className='break-words'>{listingTitle}</p>
                </div>
              )}
              <div className='flex items-center text-gray-400 mb-2 gap-1'>
                <Image src={pinIcon} alt='pin' />
                <span className='truncate'>
                  {address ? `${address}` : `${barangayName}, ${cityName}`}
                </span>
              </div>

              <div className='flex items-center text-gray-400 gap-2 mb-4 '>
                <PhoneIcon className='w-4 text-primary-main h-4' />
                <span className='font-medium line-clamp-1'>
                  {scrapeContactInfo?.agentName}
                </span>
                {scrapeContactInfo?.agentName && (
                  <Image
                    src={verified}
                    alt='verified'
                    width={16}
                    height={16}
                    className='h-4 w-4'
                  />
                )}
              </div>

              {renderPropertyDetails()}
            </Link>
          </div>

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
            {currentUser &&
              propertyOwner?.id &&
              currentUser?.data?.id !== propertyOwner?.id && (
                <button
                  className='flex-1 py-2 rounded-full bg-primary-main text-sm text-white text-center font-semibold cursor-pointer'
                  onClick={() => {
                    if (!propertyOwner?.id) {
                      console.error('Property Owner ID not available');
                      return;
                    }

                    if (!propertyDetail.property?.id) {
                      console.error('Property ID not available');
                      return;
                    }

                    draftConversation(
                      propertyDetail.property.propertyOwner,
                      propertyDetail
                    );
                  }}
                >
                  <Link
                    href='/message'
                    className='flex-1 py-2 rounded-full bg-primary-main text-sm text-white text-center font-semibold'
                  >
                    Direct Message
                  </Link>
                </button>
              )}
          </div>
        </div>
      </div>
    );
  }

  // Default (list) card
  return (
    <div className='block'>
      <div className='mx-auto rounded-2xl shadow-lg shadow-[#F7EFFD] transition-transform duration-300 cursor-pointer bg-white relative h-full flex flex-col'>
        <div className='relative'>
          <PropertyImages
            images={images}
            title={listingTitle}
            cardMode
            handleLikeProperty={handleLikeProperty}
            isLiked={isLiked}
          />
        </div>
        <div className='p-4 flex-1 flex flex-col'>
          <Link
            href={`/property/${id}?property=${propertyType}`}
            className='flex-1 flex flex-col'
          >
            <div className='flex items-center justify-between mb-1'>
              <div className='w-3/4 text-lg font-semibold text-black truncate capitalize'>
                {listingTitle}
              </div>
              {listingPrice && (
                <div className='font-extrabold text-lg text-primary-main'>
                  ₱{formatPrice(listingPrice)}
                </div>
              )}
            </div>
            {(address || barangayName || cityName) && (
              <div className='flex items-center text-gray-400 mb-2 gap-3 mx-3'>
                <Image src={pinIcon} alt='pin' />
                <span className='truncate'>
                  {address
                    ? `${address}`
                    : `${barangayName ? `${barangayName}, ` : ''}${cityName}`}
                </span>
              </div>
            )}
            {scrapeContactInfo?.agentName && (
              <div className='flex items-center text-gray-400 gap-2 mb-4 mx-3'>
                <PhoneIcon className='w-4 text-primary-main h-4 min-w-4' />
                <span className='font-medium line-clamp-1'>
                  {scrapeContactInfo?.agentName}
                </span>
                {scrapeContactInfo?.agentName && (
                  <Image
                    src={verified}
                    alt='verified'
                    width={16}
                    height={16}
                    className='h-4 w-4'
                  />
                )}
              </div>
            )}

            {renderPropertyDetails()}
          </Link>

          <div className='flex gap-3 mt-3'>
            {scrapeContactInfo?.phoneNumber && (
              <a
                href={`https://wa.me/${scrapeContactInfo?.phoneNumber}`}
                className='flex-1 py-2 flex items-center justify-center text-sm rounded-full border border-primary-main text-primary-main font-semibold'
              >
                Whatsapp
              </a>
            )}
            {currentUser &&
              propertyOwner?.id &&
              currentUser?.data?.id !== propertyOwner?.id && (
                <>
                  <Button
                    className='bg-primary-main flex-1 text-white rounded-full hover:bg-primary-main cursor-pointer'
                    onClick={() => {
                      if (!propertyOwner?.id) {
                        console.error('Property Owner ID not available');
                        return;
                      }

                      if (!propertyDetail.property?.id) {
                        console.error('Property ID not available');
                        return;
                      }

                      draftConversation(
                        propertyDetail.property.propertyOwner,
                        propertyDetail
                      );
                      router.push('/message');
                    }}
                  >
                    Direct Message
                  </Button>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
