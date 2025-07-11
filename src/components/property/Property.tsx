'use client';

import React, { useState } from 'react';
import { PropertyImages } from '../listing/PropertyImages';
import { PropertyHeader } from '../listing/PropertyHeader';
import { PropertyMap } from '../listing/PropertyMap';
import { AgentCard } from '../listing/AgentCard';
import {
  PropertyDetail,
  PropertyImage,
} from '@/lib/queries/server/propety/type';
import PropertyDescription from '../listing/PropertyDescription';
import PropertyFeatures from '../listing/PropertyFeatures';
import { useLikeProperty } from '@/lib/queries/hooks/use-property';

export default function Property({
  agent,
  listingDescription,
  listingPrice,
  listingTitle,
  address,
  latitude,
  longitude,
  images,
  isPropertyLiked,
  propertyId,
  userId,
  propertyDetail,
  propertyOwnerId,
}: {
  isPropertyLiked: boolean;
  propertyId: string;
  listingPrice: number;
  listingTitle: string;
  address: string;
  latitude: number;
  longitude: number;
  images: PropertyImage[];
  agent: {
    name: string;
    whatsapp: string;
    email: string;
    isVerified: boolean;
    position: string;
  };
  listingDescription: string;
  userId: string;
  propertyDetail: PropertyDetail;
  propertyOwnerId: string;
}) {
  const [isLiked, setIsLiked] = useState(isPropertyLiked);
  const { mutate: likeProperty } = useLikeProperty();
  const handleLikeProperty = () => {
    if (!userId) {
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
        setIsLiked(isPropertyLiked);
      },
    });
  };
  return (
    <div className='container mx-auto px-5 xl:px-0 max-w-[1300px]'>
      <div>
        <PropertyImages images={images} title={listingTitle} />
        <div className='grid grid-cols-1 lg:grid-cols-3 md:gap-6 mt-10'>
          <div className={`${agent?.name ? 'col-span-2' : 'col-span-3'}`}>
            {/* Property Header */}
            <PropertyHeader
              isLiked={isLiked}
              handleLikeProperty={handleLikeProperty}
              listingPrice={listingPrice}
              title={listingTitle}
              isVerified={!!agent?.name}
              location={address}
            />
            {/* Features */}
            {propertyDetail.property.features &&
              propertyDetail.property.features.length > 0 && (
                <PropertyFeatures
                  features={propertyDetail.property.features}
                  amenities={propertyDetail.property.amenities}
                />
              )}
            {/* Description */}
            {listingDescription && propertyDetail && (
              <PropertyDescription
                description={listingDescription}
                propertyDetail={propertyDetail}
              />
            )}
            {/* Map */}
            {latitude !== 0 && longitude !== 0 && (
              <PropertyMap
                latitude={latitude}
                longitude={longitude}
                title={listingTitle}
              />
            )}
          </div>
          {/* Right Column - Agent Card */}
          {agent?.name && (
            <div className='lg:col-span-1'>
              <AgentCard agent={agent} propertyOwnerId={propertyOwnerId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
