'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { FaMapMarkerAlt } from 'react-icons/fa';
import Button from '../common/Button';
import Link from 'next/link';
import { useNearbyProperties } from '@/lib/queries/hooks/use-property';
import { PropertyDetails } from '@/lib/queries/server/propety/type';
import PropertySliderSkeleton from './PropertySliderSkeleton';

export interface PropertySliderCard {
  image: string;
  title: string;
  price: string;
  location: string;
}

export default function PropertySlider() {
  const [location, setLocation] = useState<{
    lat: number | null;
    lng: number | null;
  }>({ lat: null, lng: null });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setError(null);
      },
      err => {
        setError('Failed to retrieve location: ' + err.message);
        setLocation({ lat: null, lng: null });
      }
    );
  }, []);

  const { data: nearbyProperties, isPending } = useNearbyProperties(location);

  if (location === null) {
    return null;
  }

  const nearbyPropertiesData =
    nearbyProperties?.data as unknown as PropertyDetails[];
  const filteredProperties = nearbyPropertiesData?.filter(
    (property: PropertyDetails) => {
      // If property has no images, only include if it has an address
      if (property.images.length === 0) {
        return property.address != '';
      }

      // Check if ALL images have valid HTTP/HTTPS URLs
      const allImagesValid = property.images.every(image => {
        const imageUrl = image?.imageUrl;
        return (
          imageUrl &&
          (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))
        );
      });

      // Only include properties that have all valid images OR have an address
      return allImagesValid && property.address != '';
    }
  );

  return (
    <section className='container max-w-[1300px] mx-auto px-8 md:px-5 py-10 lg:py-20 '>
      <div className='flex flex-col md:flex-row gap-3 justify-between items-start md:items-center  mb-10 md:mb-4'>
        <div>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-text md:mb-2'>
            Based on your location
          </h2>
          <p className='text-lg text-gray-500'>
            Some of our picked properties near you location.
          </p>
        </div>
        <Link href='/property?property=condominium'>
          <Button variant='primary' className='font-medium py-3'>
            More Properties
          </Button>
        </Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}

      {/* Show skeleton when loading */}
      {isPending && !error && <PropertySliderSkeleton />}

      {/* Show actual content when data is loaded */}
      {!isPending && location && filteredProperties && (
        <Swiper
          spaceBetween={32}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 1.2 },
            768: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.2 },
          }}
          className='property-swiper pb-8'
        >
          {filteredProperties?.map((card: PropertyDetails, idx: number) => (
            <SwiperSlide key={idx} className='max-w-[350px] '>
              <Link
                href={`/property/${card?.id}?property=${card?.propertyTypeName.toLowerCase().replace(' ', '-')}`}
                className='bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col h-full mb-10 cursor-grab'
              >
                <div className='relative w-full min-w-[250px] min-h-[250px] md:min-w-[350px] md:min-h-[350px]'>
                  <Image
                    src={card?.images[0]?.imageUrl || ''}
                    alt={card?.listingTitle}
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='p-6 flex flex-col flex-1'>
                  <div className='text-primary-main font-extrabold text-xl md:text-2xl mb-2'>
                    {card?.listingPriceFormatted}
                  </div>
                  <div className='font-semibold text-base md:text-lg mb-1 truncate'>
                    {card?.listingTitle}
                  </div>
                  <div className='flex items-center text-gray-500 text-sm'>
                    <FaMapMarkerAlt className='mr-2 text-primary-main' />
                    {card?.address ?? card?.barangayName}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}
