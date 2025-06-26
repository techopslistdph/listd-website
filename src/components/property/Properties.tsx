'use client';
import PropertyCard from '@/components/listing/PropertyCard';
// import PropertySidebar from '@/components/listing/PropertySidebar';
import PropertyTopBar from '@/components/property/PropertyTopBar';
import { useState } from 'react';
// import PropertyMap from '@/components/map/PropertyMap';

import {
  PropertyDetail,
  PropertyListResponse,
} from '@/lib/queries/server/propety/type';
import { ListingType } from '@/lib/queries/server/home/type';
import PropertySidebar from './propertySidebar';
import { SearchParams } from '@/lib/queries/server/propety';
import PropertyMap from '../map/PropertyMap';
import { useUser } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/server';

export type View = 'list' | 'map';

export function Properties({
  properties,
  listingTypes,
  propertyType,
}: {
  properties: PropertyListResponse;
  listingTypes: ListingType[];
  propertyType: SearchParams['property'];
}) {
  const [view, setView] = useState<View>('list');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useUser();

  // filter properties that have images and has valid image url
  const filterProperties = properties.data.filter(
    (property: PropertyDetail) => {
      // Check if property has images
      if (property.property.images.length === 0) {
        return false;
      }

      // Check if ALL images have valid HTTP/HTTPS URLs
      const allImagesValid = property.property.images.every(image => {
        const imageUrl = image?.imageUrl;
        return (
          imageUrl &&
          (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))
        );
      });

      return allImagesValid;
    }
  );

  return (
    <div className='min-h-screen xl:max-w-[1300px] mx-auto flex flex-col gap-5 lg:flex-row pb-10 px-5 py-5 sm:pt-5'>
      <div className='sm:block lg:hidden'>
        <PropertyTopBar
          listingTypes={listingTypes}
          onViewChange={setView}
          isSidebarOpen={sidebarOpen}
          onFilterClick={() => setSidebarOpen(v => !v)}
        />
      </div>
      {sidebarOpen && <PropertySidebar />}
      {/* Main Content */}
      <main className='flex-1 lg:min-w-140'>
        <div className='hidden sm:hidden lg:block mb-5'>
          <PropertyTopBar
            listingTypes={listingTypes}
            isSidebarOpen={sidebarOpen}
            onFilterClick={() => setSidebarOpen(v => !v)}
            onViewChange={setView}
          />
        </div>
        {!properties.success && (
          <div className='flex justify-center items-center py-10 text-error-main'>
            <p className='text-lg'>Error: {properties?.message}</p>
          </div>
        )}
        {/* Property Cards Grid */}
        {filterProperties?.length === 0 ? (
          <>
            <div className='rounded-xl w-full\ h-[480px] overflow-hidden'>
              <PropertyMap properties={filterProperties} minHeight='480px' />
            </div>
            <div className='text-center text-gray-500 py-20 text-lg'>
              No properties found matching your filters.
            </div>
          </>
        ) : view === 'list' ? (
          <div className='grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-3 gap-6'>
            {filterProperties?.map((property, idx) => (
              <PropertyCard
                user={user as unknown as User}
                key={idx}
                propertyDetail={property}
                view='list'
                propertyType={propertyType}
              />
            ))}
          </div>
        ) : (
          <div className='flex flex-col gap-6'>
            {/* Property Cards Column */}
            <div className='rounded-xl w-full\ h-[480px] overflow-hidden'>
              <PropertyMap properties={filterProperties} minHeight='480px' />
            </div>
            <div className='space-y-6'>
              {filterProperties?.map((property, idx) => (
                <PropertyCard
                  user={user as unknown as User}
                  key={idx}
                  propertyDetail={property}
                  view='map'
                  propertyType={propertyType}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
