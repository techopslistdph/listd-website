'use client';
import PropertyCard from '@/components/listing/PropertyCard';
// import PropertySidebar from '@/components/listing/PropertySidebar';
import PropertyTopBar from '@/components/listing/PropertyTopBar';
import { useState } from 'react';
// import PropertyMap from '@/components/map/PropertyMap';

import { PropertyDetail } from '@/lib/queries/server/propety/type';
import { ListingType } from '@/lib/queries/server/home/type';
import PropertySidebar from '../listing/propertySidebar';

export type View = 'list' | 'map';

export function PropertyPage({
  properties,
  listingTypes,
}: {
  properties: PropertyDetail[];
  listingTypes: ListingType[];
}) {
  const [view, setView] = useState<View>('list');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className='min-h-screen container xl:max-w-[1300px] mx-auto flex flex-col gap-5 lg:flex-row pb-10 px-5 sm:px-0 py-5 sm:pt-5'>
      <div className='block sm:hidden'>
        <PropertyTopBar
          listingTypes={listingTypes}
          onViewChange={setView}
          isSidebarOpen={sidebarOpen}
          onFilterClick={() => setSidebarOpen(v => !v)}
        />
      </div>
      {sidebarOpen && <PropertySidebar />}
      {/* Main Content */}
      <main className='flex-1'>
        <div className='hidden sm:block mb-5'>
          <PropertyTopBar
            listingTypes={listingTypes}
            isSidebarOpen={sidebarOpen}
            onFilterClick={() => setSidebarOpen(v => !v)}
            onViewChange={setView}
          />
        </div>
        {/* Property Cards Grid */}
        {properties.length === 0 ? (
          <div className='text-center text-gray-500 py-20 text-lg'>
            No properties found matching your filters.
          </div>
        ) : view === 'list' ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
            {properties.map((property, idx) => (
              <PropertyCard key={idx} propertyDetail={property} view='list' />
            ))}
          </div>
        ) : (
          <div className='flex flex-col gap-6'>
            {/* Property Cards Column */}
            <div className='rounded-xl w-full h-[480px] overflow-hidden'>
              {/* <PropertyMap properties={properties} minHeight='480px' /> */}
            </div>
            <div className='space-y-6'>
              {properties.map((property, idx) => (
                <PropertyCard key={idx} propertyDetail={property} view='map' />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
