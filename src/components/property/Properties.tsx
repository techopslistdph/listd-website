'use client';
import PropertyCard from '@/components/listing/PropertyCard';
import PropertyTopBar from '@/components/property/PropertyTopBar';
import { useState, useMemo } from 'react';
import Image from 'next/image';

import { PropertyListResponse } from '@/lib/queries/server/propety/type';
import { ListingType } from '@/lib/queries/server/home/type';
import PropertySidebar from './propertySidebar';
import { SearchParams } from '@/lib/queries/server/propety';
import PropertyMap from '../map/PropertyMap';
import { useUser } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/server';
import { filterProperties } from '@/lib/utils/filterProperty';
import { PropertyPagination } from './PropertyPagination';

export type View = 'list' | 'map';

const PROPERTIES_PER_PAGE = 12;

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
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useUser();


  const filteredProperties = filterProperties(properties?.data?.data || []);

  const { paginatedProperties, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * PROPERTIES_PER_PAGE;
    const endIndex = startIndex + PROPERTIES_PER_PAGE;
    const paginatedData = filteredProperties?.slice(startIndex, endIndex);
    const totalPagesCount = Math.ceil(filteredProperties?.length / PROPERTIES_PER_PAGE);

    return {
      paginatedProperties: paginatedData,
      totalPages: totalPagesCount
    };
  }, [filteredProperties, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
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
      {sidebarOpen && <PropertySidebar />}
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
        {filteredProperties?.length === 0 && (
          <>
          <div className='flex flex-col items-center justify-center mt-12 lg:mt-42'>
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
              {paginatedProperties?.map((property, idx) => (
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
              <PropertyMap properties={paginatedProperties} minHeight='480px' />
            </div>
            <div className='space-y-6'>
              {paginatedProperties?.map((property, idx) => (
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
