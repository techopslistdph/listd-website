'use client'
import PropertyCard from '@/components/listing/PropertyCard';
import PropertySidebar from '@/components/listing/PropertySidebar';
import PropertyTopBar from '@/components/listing/PropertyTopBar';
import { usePropertyFilter } from '@/hooks/usePropertyFilter';
import { useState } from 'react';
import PropertyMap from '@/components/map/PropertyMap';

export default function PropertyPage() {
  const { filteredProperties, handleFilterChange } = usePropertyFilter();
  const [view, setView] = useState<'list' | 'map'>('list');

  return (
    <div className='min-h-screen container xl:max-w-[1350px] mx-auto flex pb-10 lg:px-5'>
      <PropertySidebar onFilterChange={handleFilterChange} />
      {/* Main Content */}
      <main className='flex-1 p-6'>
        <PropertyTopBar onViewChange={setView} />
        {/* Property Cards Grid */}
        {filteredProperties.length === 0 ? (
          <div className='text-center text-gray-500 py-20 text-lg'>
            No properties found matching your filters.
          </div>
        ) : view === 'list' ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
            {filteredProperties.map((property, idx) => (
              <PropertyCard key={idx} {...property} view='list' />
            ))}
          </div>
        ) : (
          <div className='flex flex-col gap-6'>
            {/* Property Cards Column */}
            <div className='rounded-xl w-full h-[480px] overflow-hidden'>
              <PropertyMap data={filteredProperties} minHeight='480px' />
            </div>
            <div className='space-y-6'>
              {filteredProperties.map((property, idx) => (
                <PropertyCard key={idx} {...property} view='map' />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
