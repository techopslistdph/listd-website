'use client';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyTopBar from '@/components/property/PropertyTopBar';
import { useState } from 'react';
import Image from 'next/image';

import {
  PriceRangeResponse,
  PropertyListResponse,
} from '@/lib/queries/server/propety/type';
import { ListingType } from '@/lib/queries/server/home/type';
import PropertySidebar from './propertySidebar';
import { SearchParams } from '@/lib/queries/server/propety';
import PropertyMap from '../map/PropertyMap';
import { useUser } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/server';
import { filterProperties } from '@/lib/utils/filterProperty';
import { PropertyPagination } from './PropertyPagination';
import { useRouter } from 'next/navigation';
import { useUrlParams } from '@/hooks/useUrlParams';

export type View = 'list' | 'map';

export function Properties({
  properties,
  listingTypes,
  propertyType,
  priceRanges,
}: {
  properties: PropertyListResponse;
  listingTypes: ListingType[];
  propertyType: SearchParams['property'];
  priceRanges: PriceRangeResponse;
}) {
  const [view, setView] = useState<View>('list');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useUser();
  const router = useRouter();
  const { updateParams } = useUrlParams();

  const filteredProperties = filterProperties(properties?.data?.data || []);

  const currentPage = properties?.data?.meta?.page || 1;
  const totalPages = properties?.data?.meta?.totalPages || 1;

  const handlePageChange = (page: number) => {
    const params = updateParams({ page: page });
    router.push(`/property?${params}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='min-h-screen xl:max-w-[1300px] mx-auto flex flex-col gap-5 lg:flex-row pb-10 px-5 py-5 sm:pt-5'>
      <div className='sm:block lg:hidden'>
        <PropertyTopBar
          listingTypes={listingTypes}
          onViewChange={setView}
          isSidebarOpen={sidebarOpen}
          onFilterClick={() => setSidebarOpen(v => !v)}
          currentView={view}
        />
      </div>
      {sidebarOpen && <PropertySidebar priceRanges={priceRanges} />}
      {/* Main Content */}
      <main className='flex-1 lg:min-w-140'>
        <div className='hidden sm:hidden lg:block mb-5'>
          <PropertyTopBar
            listingTypes={listingTypes}
            isSidebarOpen={sidebarOpen}
            onFilterClick={() => setSidebarOpen(v => !v)}
            onViewChange={setView}
            currentView={view}
          />
        </div>
        {!properties.success && (
          <div className='flex flex-col items-center justify-center mt-12 lg:mt-24'>
            <Image
              src={'/images/icons/empty.svg'}
              alt='Error loading properties'
              width={150}
              height={50}
              className='mb-4 lg:mb-8 lg:w-[204px] lg:h-[67px]'
            />
            <div className='text-xl lg:text-2xl font-bold text-primary-main mb-2 text-center'>
              {properties?.message || 'Unable to load properties.'}
            </div>
            <div className='text-sm lg:text-base text-gray-400 text-center'>
              {
                'There was a problem fetching properties. Please try again later or contact support if the issue persists.'
              }
            </div>
          </div>
        )}
        {/* Property Cards Grid */}
        {filteredProperties?.length === 0 && properties.success && (
          <>
            <div className='flex flex-col items-center justify-center mt-12 lg:mt-42 pb-10'>
              <Image
                src={'/images/icons/empty.svg'}
                alt='Error loading properties'
                width={150}
                height={50}
                className='mb-4 lg:mb-8 lg:w-[204px] lg:h-[67px]'
              />
              <div className='text-xl lg:text-2xl font-bold text-primary-main mb-2 text-center'>
                {`Oops! We couldn\'t find any ${propertyType} matching your search.`}
              </div>
              <div className='text-sm lg:text-base text-gray-400 text-center'>
                {
                  'Please check your spelling or adjust your filters and try again.'
                }
              </div>
            </div>
          </>
        )}
        {view === 'list' ? (
          <div className='flex flex-col gap-8'>
            <div className='grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-3 gap-6'>
              {filteredProperties?.map((property, idx) => (
                <PropertyCard
                  user={user as unknown as User}
                  key={idx}
                  propertyDetail={property}
                  view='list'
                  propertyType={propertyType}
                />
              ))}
            </div>
            {/* Pagination */}
            <PropertyPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className='mt-8'
            />
          </div>
        ) : (
          <div className='flex flex-col gap-6'>
            {/* Property Cards Column */}
            <div className='rounded-xl w-full\ h-[480px] overflow-hidden'>
              <PropertyMap properties={filteredProperties} minHeight='480px' />
            </div>
            <div className='space-y-6'>
              {filteredProperties?.map((property, idx) => (
                <PropertyCard
                  user={user as unknown as User}
                  key={idx}
                  propertyDetail={property}
                  view='map'
                  propertyType={propertyType}
                />
              ))}
            </div>
            {/* Pagination for map view */}
            <PropertyPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className='mt-8'
            />
          </div>
        )}
      </main>
    </div>
  );
}
