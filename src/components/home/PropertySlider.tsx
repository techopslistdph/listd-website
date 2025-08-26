'use client';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { FaMapMarkerAlt } from 'react-icons/fa';
import Button from '@/components/ui/common/Button';
import Link from 'next/link';
import { useNearbyProperties } from '@/lib/queries/hooks/use-property';
import { PropertyDetails } from '@/lib/queries/server/propety/type';
import PropertySliderSkeleton from './PropertySliderSkeleton';
import PropertySliderFallback from './PropertySliderFallback';
import CardsFallback from './CardFallback';
import { formatPrice } from '@/utils/formatPriceUtils';

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
  const [permission, setPermission] = useState<
    'granted' | 'denied' | 'prompt' | 'unknown'
  >('unknown');
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);

  const requestLocation = () => {
    setError(null);
    setHasRequestedPermission(true);

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
        setPermission('granted');
      },
      err => {
        // Check for specific permission denial
        if (err.code === 1) {
          // Check if this is a temporary denial (dismissed prompt) or permanent denial
          if (hasRequestedPermission && !navigator.permissions) {
            // For browsers without Permissions API, assume it's a dismissed prompt
            setPermission('prompt');
            setError(
              'Location access needed. Please allow location permissions to see nearby properties.'
            );
          } else {
            // Check if it's actually permanently denied
            navigator.permissions
              ?.query({ name: 'geolocation' })
              .then(result => {
                if (result.state === 'denied') {
                  setPermission('denied');
                  setError(
                    'Location access denied. Please enable location permissions to see nearby properties.'
                  );
                } else {
                  // It's a dismissed prompt, not permanently denied
                  setPermission('prompt');
                  setError(
                    'Location access needed. Please allow location permissions to see nearby properties.'
                  );
                }
              })
              .catch(() => {
                // Fallback: assume it's a dismissed prompt
                setPermission('prompt');
                setError(
                  'Location access needed. Please allow location permissions to see nearby properties.'
                );
              });
          }
        } else if (err.code === 2) {
          setPermission('prompt');
          setError('Unable to determine your location. Please try again.');
        } else if (err.code === 3) {
          setPermission('prompt');
          setError('Location request timed out. Please try again.');
        } else {
          setPermission('prompt');
          setError('Failed to retrieve location: ' + err.message);
        }
        setLocation({ lat: null, lng: null });
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  };

  const handleRequestLocation = () => {
    requestLocation();
  };

  useEffect(() => {
    // Check if we already have permission status
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'granted') {
          setPermission('granted');
          requestLocation();
        } else if (result.state === 'denied') {
          setPermission('denied');
        } else {
          setPermission('prompt');
          requestLocation();
        }
      });
    } else {
      // Fallback for browsers that don't support permissions API
      requestLocation();
    }
  }, []);

  const { data: nearbyProperties, isPending } = useNearbyProperties(location);

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
    <section className='containe max-w-[1300px] mx-auto px-8 md:px-5 py-10 lg:py-20 '>
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

      {!location.lat && !location.lng && (
        <PropertySliderFallback
          permission={permission}
          error={error}
          onRequestLocation={handleRequestLocation}
        />
      )}

      {/* Show skeleton when loading */}
      {isPending && location.lat && location.lng && <PropertySliderSkeleton />}

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
                className='bg-white rounded-t-3xl rounded-b-2xl shadow-[0_4px_28px_#F7EFFD] overflow-hidden flex flex-col h-full mb-10 cursor-grab'
              >
                <div className='relative w-full min-w-[250px] min-h-[250px] md:min-w-[350px] md:min-h-[350px]'>
                  <CardsFallback
                    src={card?.images[0]?.imageUrl || '/images/icons/empty.svg'}
                    alt={card?.listingTitle}
                  />
                </div>
                <div className='p-6 flex flex-col flex-1'>
                  <div className='text-primary-main font-bold text-xl md:text-2xl mb-2 leading-[32px] md:pb-[12px]'>
                    ₱{formatPrice(card?.listingPrice)}
                  </div>
                  <div className='font-medium text-base truncate leading-[24px]'>
                    {card?.listingTitle}
                  </div>
                  <div className='flex items-center text-gray-500 text-base leading-[24px] pt-[4px]'>
                    <FaMapMarkerAlt className='mr-[4px] text-icon-map' />
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
