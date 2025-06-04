import PropertyCard from '@/components/listing/PropertyCard';
import PropertySidebar from '@/components/listing/PropertySidebar';
import PropertyTopBar from '@/components/listing/PropertyTopBar';
import { usePropertyFilter } from '@/hooks/usePropertyFilter';
import { useState, useMemo, Suspense } from 'react';
import PropertyMap from '@/components/map/PropertyMap';
import { useSearchParams } from 'next/navigation';
import { properties } from '@/app/data';

function PropertyPageContent() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<'list' | 'map'>('list');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get initial property type from URL
  const initialPropertyType = useMemo(() => {
    const property = searchParams.get('property');
    return property ? [property] : [];
  }, [searchParams]);

  // Filter properties based on URL parameters
  const filteredInitialProperties = useMemo(() => {
    let filtered = [...properties];
    const property = searchParams.get('property');

    // Filter by property type
    if (property) {
      filtered = filtered.filter(
        (p) => p.tag.toLowerCase() === property.toLowerCase()
      );
    }

    return filtered;
  }, [searchParams]);

  const { filteredProperties, handleFilterChange } = usePropertyFilter(
    filteredInitialProperties
  );

  return (
    <div className='min-h-screen container xl:max-w-[1300px] mx-auto flex flex-col gap-5 lg:flex-row pb-10 px-5 sm:px-0 py-5 sm:pt-5'>
      <div className='block sm:hidden'>
        <PropertyTopBar
          onViewChange={setView}
          isSidebarOpen={sidebarOpen}
          onFilterClick={() => setSidebarOpen((v) => !v)}
        />
      </div>
      {sidebarOpen && (
        <PropertySidebar
          onFilterChange={handleFilterChange}
          initialPropertyType={initialPropertyType}
        />
      )}
      {/* Main Content */}
      <main className='flex-1'>
        <div className='hidden sm:block mb-5'>
          <PropertyTopBar
            isSidebarOpen={sidebarOpen}
            onFilterClick={() => setSidebarOpen((v) => !v)}
            onViewChange={setView}
          />
        </div>
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

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PropertyPageContent />
    </Suspense>
  );
}
