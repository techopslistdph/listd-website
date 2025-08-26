/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { View } from '@/components/property/Properties';
import { ListingType } from '@/lib/queries/server/home/type';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';

import { cn } from '@/lib/utils';
import { useUrlParams } from '@/hooks/useUrlParams';
import LocationInput from '../common/LocationInput';

interface PropertyTopBarProps {
  onViewChange: (view: View) => void;
  isSidebarOpen: boolean;
  onFilterClick: () => void;
  listingTypes: ListingType[];
  currentView: View;
}

export default function PropertyTopBar({
  onViewChange,
  onFilterClick,
  isSidebarOpen,
  listingTypes,
  currentView,
}: PropertyTopBarProps) {
  const { push } = useRouter();
  const params = useSearchParams();
  const {
    updateParams,
    getParam,
    deleteParams,
    getAllParams,
    createParamsString,
  } = useUrlParams();
  const typeId = params.get('listingTypeId');
  const searchQuery = getParam('search');
  const cityQuery = getParam('city');
  const barangayQuery = getParam('barangay');
  const provinceQuery = getParam('province');

  const activeListingType = listingTypes?.find(type => type.id === typeId);
  const [search, setSearch] = useState<string>(searchQuery || '');
  const [location, setLocation] = useState<{
    city: string;
    barangay: string;
    province: string;
  } | null>(null);

  // Initialize location from URL params
  useEffect(() => {
    if (cityQuery || barangayQuery || provinceQuery) {
      setLocation({
        city: cityQuery || '',
        barangay: barangayQuery || '',
        province: provinceQuery || '',
      });
    }
  }, [cityQuery, barangayQuery, provinceQuery]);

  // Create initial location value string for display
  const getInitialLocationValue = () => {
    if (cityQuery || barangayQuery || provinceQuery) {
      const parts = [];
      if (barangayQuery) parts.push(barangayQuery.replace('-', ' '));
      if (cityQuery) parts.push(cityQuery.replace('-', ' '));
      if (provinceQuery) parts.push(provinceQuery.replace('-', ' '));
      return parts.join(', ');
    }
    return '';
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    // Clear location when user starts typing in search
    if (location) {
      setLocation(null);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (search.trim()) {
        const currentParams = getAllParams();
        const { city, barangay, province, ...paramsWithoutLocation } =
          currentParams;

        // Property search - add search term to params and remove location params
        const finalParams = {
          ...paramsWithoutLocation,
          search: search.trim(),
        };

        push(`/property?${createParamsString(finalParams)}`);
      }
    }
  };

  const handleLocationSelect = (
    selectedLocation: {
      city: string;
      barangay: string;
      province: string;
    } | null
  ) => {
    setLocation(selectedLocation);
    // Clear search when location is selected
    setSearch('');

    if (selectedLocation) {
      // Location search - add location params and remove search term
      const currentParams = getAllParams();
      const { search, ...paramsWithoutLocation } = currentParams;

      const finalParams = {
        ...paramsWithoutLocation,
        city: selectedLocation.city,
        barangay: selectedLocation.barangay,
        province: selectedLocation.province,
      };

      push(`/property?${createParamsString(finalParams)}`);
    } else {
      const paramsString = deleteParams(['city', 'barangay', 'province']);
      push(`/property?${paramsString}`);
    }
  };

  const handleViewChange = (newView: View) => {
    onViewChange(newView);
  };

  const handleBuyOrRentChange = (listingTypeId: ListingType['id']) => {
    const paramsString = updateParams({
      listingTypeId: listingTypeId,
      page: 1, // Always reset page to 1 on listing type change
    });
    push(`/property?${paramsString}`);
  };

  return (
    <div className='flex flex-col md:flex-row flex-wrap md:flex-nowrap items-center gap-4 sm:gap-6 w-full text-base relative'>
      {/* Filter Button (visible on all screens) */}

      {/* View Toggle */}
      <div className='flex items-center bg-neutral-light rounded-2xl p-1 gap-1 w-full md:w-auto justify-center h-10 sm:h-12'>
        {/* Filter Button for Mobile */}
        <button
          className={cn(
            'h-full px-4 py-3 sm:px-6 sm:py-4 rounded-xl transition-all cursor-pointer flex-1 lg:flex-none flex items-center justify-center',
            isSidebarOpen ? 'bg-primary-main' : 'bg-transparent'
          )}
          onClick={onFilterClick}
        >
          {/* List View SVG */}
          <svg
            width='16'
            height='19'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g clipPath='url(#clip0_5875_11125)'>
              <path
                d='M0.5 21.9375C0.5 22.6389 1.06426 23.2031 1.76562 23.2031H4.91387C5.45176 24.917 7.04961 26.1562 8.9375 26.1562C10.8254 26.1562 12.4232 24.917 12.9611 23.2031H26.2344C26.9357 23.2031 27.5 22.6389 27.5 21.9375C27.5 21.2361 26.9357 20.6719 26.2344 20.6719H12.9611C12.4232 18.958 10.8254 17.7188 8.9375 17.7188C7.04961 17.7188 5.45176 18.958 4.91387 20.6719H1.76562C1.06426 20.6719 0.5 21.2361 0.5 21.9375ZM7.25 21.9375C7.25 21.4899 7.42779 21.0607 7.74426 20.7443C8.06073 20.4278 8.48995 20.25 8.9375 20.25C9.38505 20.25 9.81427 20.4278 10.1307 20.7443C10.4472 21.0607 10.625 21.4899 10.625 21.9375C10.625 22.3851 10.4472 22.8143 10.1307 23.1307C9.81427 23.4472 9.38505 23.625 8.9375 23.625C8.48995 23.625 8.06073 23.4472 7.74426 23.1307C7.42779 22.8143 7.25 22.3851 7.25 21.9375ZM17.375 13.5C17.375 13.0524 17.5528 12.6232 17.8693 12.3068C18.1857 11.9903 18.6149 11.8125 19.0625 11.8125C19.5101 11.8125 19.9393 11.9903 20.2557 12.3068C20.5722 12.6232 20.75 13.0524 20.75 13.5C20.75 13.9476 20.5722 14.3768 20.2557 14.6932C19.9393 15.0097 19.5101 15.1875 19.0625 15.1875C18.6149 15.1875 18.1857 15.0097 17.8693 14.6932C17.5528 14.3768 17.375 13.9476 17.375 13.5ZM19.0625 9.28125C17.1746 9.28125 15.5768 10.5205 15.0389 12.2344H1.76562C1.06426 12.2344 0.5 12.7986 0.5 13.5C0.5 14.2014 1.06426 14.7656 1.76562 14.7656H15.0389C15.5768 16.4795 17.1746 17.7188 19.0625 17.7188C20.9504 17.7188 22.5482 16.4795 23.0861 14.7656H26.2344C26.9357 14.7656 27.5 14.2014 27.5 13.5C27.5 12.7986 26.9357 12.2344 26.2344 12.2344H23.0861C22.5482 10.5205 20.9504 9.28125 19.0625 9.28125ZM10.625 6.75C10.1774 6.75 9.74823 6.57221 9.43176 6.25574C9.11529 5.93928 8.9375 5.51005 8.9375 5.0625C8.9375 4.61495 9.11529 4.18572 9.43176 3.86926C9.74823 3.55279 10.1774 3.375 10.625 3.375C11.0726 3.375 11.5018 3.55279 11.8182 3.86926C12.1347 4.18572 12.3125 4.61495 12.3125 5.0625C12.3125 5.51005 12.1347 5.93928 11.8182 6.25574C11.5018 6.57221 11.0726 6.75 10.625 6.75ZM14.6486 3.79688C14.1107 2.08301 12.5129 0.84375 10.625 0.84375C8.73711 0.84375 7.13926 2.08301 6.60137 3.79688H1.76562C1.06426 3.79688 0.5 4.36113 0.5 5.0625C0.5 5.76387 1.06426 6.32812 1.76562 6.32812H6.60137C7.13926 8.04199 8.73711 9.28125 10.625 9.28125C12.5129 9.28125 14.1107 8.04199 14.6486 6.32812H26.2344C26.9357 6.32812 27.5 5.76387 27.5 5.0625C27.5 4.36113 26.9357 3.79688 26.2344 3.79688H14.6486Z'
                fill={isSidebarOpen ? 'white' : 'black'}
              />
            </g>
            <defs>
              <clipPath id='clip0_5875_11125'>
                <rect
                  width='27'
                  height='27'
                  fill='white'
                  transform='translate(0.5)'
                />
              </clipPath>
            </defs>
          </svg>
        </button>
        <button
          className={cn(
            'h-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all cursor-pointer flex-1 lg:flex-none flex items-center justify-center',
            currentView === 'list' ? 'bg-primary-main' : 'bg-transparent'
          )}
          onClick={() => handleViewChange('list')}
        >
          {/* List View SVG */}
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M3 6.75C3.59674 6.75 4.16903 6.51295 4.59099 6.09099C5.01295 5.66903 5.25 5.09674 5.25 4.5C5.25 3.90326 5.01295 3.33097 4.59099 2.90901C4.16903 2.48705 3.59674 2.25 3 2.25C2.40326 2.25 1.83097 2.48705 1.40901 2.90901C0.987053 3.33097 0.75 3.90326 0.75 4.5C0.75 5.09674 0.987053 5.66903 1.40901 6.09099C1.83097 6.51295 2.40326 6.75 3 6.75ZM9 3C8.17031 3 7.5 3.67031 7.5 4.5C7.5 5.32969 8.17031 6 9 6H22.5C23.3297 6 24 5.32969 24 4.5C24 3.67031 23.3297 3 22.5 3H9ZM9 10.5C8.17031 10.5 7.5 11.1703 7.5 12C7.5 12.8297 8.17031 13.5 9 13.5H22.5C23.3297 13.5 24 12.8297 24 12C24 11.1703 23.3297 10.5 22.5 10.5H9ZM9 18C8.17031 18 7.5 18.6703 7.5 19.5C7.5 20.3297 8.17031 21 9 21H22.5C23.3297 21 24 20.3297 24 19.5C24 18.6703 23.3297 18 22.5 18H9ZM3 21.75C3.59674 21.75 4.16903 21.5129 4.59099 21.091C5.01295 20.669 5.25 20.0967 5.25 19.5C5.25 18.9033 5.01295 18.331 4.59099 17.909C4.16903 17.4871 3.59674 17.25 3 17.25C2.40326 17.25 1.83097 17.4871 1.40901 17.909C0.987053 18.331 0.75 18.9033 0.75 19.5C0.75 20.0967 0.987053 20.669 1.40901 21.091C1.83097 21.5129 2.40326 21.75 3 21.75ZM5.25 12C5.25 11.7045 5.1918 11.4119 5.07873 11.139C4.96566 10.866 4.79992 10.6179 4.59099 10.409C4.38206 10.2001 4.13402 10.0343 3.86104 9.92127C3.58806 9.8082 3.29547 9.75 3 9.75C2.70453 9.75 2.41194 9.8082 2.13896 9.92127C1.86598 10.0343 1.61794 10.2001 1.40901 10.409C1.20008 10.6179 1.03434 10.866 0.921271 11.139C0.808198 11.4119 0.75 11.7045 0.75 12C0.75 12.2955 0.808198 12.5881 0.921271 12.861C1.03434 13.134 1.20008 13.3821 1.40901 13.591C1.61794 13.7999 1.86598 13.9657 2.13896 14.0787C2.41194 14.1918 2.70453 14.25 3 14.25C3.29547 14.25 3.58806 14.1918 3.86104 14.0787C4.13402 13.9657 4.38206 13.7999 4.59099 13.591C4.79992 13.3821 4.96566 13.134 5.07873 12.861C5.1918 12.5881 5.25 12.2955 5.25 12Z'
              fill={currentView === 'list' ? 'white' : 'black'}
            />
          </svg>
        </button>
        <button
          className={cn(
            'h-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all cursor-pointer flex-1 lg:flex-none flex items-center justify-center',
            currentView === 'map' ? 'bg-primary-main' : 'bg-transparent'
          )}
          onClick={() => {
            handleViewChange('map');
            onFilterClick();
          }}
        >
          {/* Map View SVG */}
          <svg
            width='20'
            height='20'
            viewBox='0 0 27 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M26.5125 1.69688C26.8172 1.90782 27 2.2547 27 2.62501V18.375C27 18.8438 26.7094 19.2609 26.2734 19.425L18.3984 22.425C18.1547 22.5188 17.8875 22.5234 17.6437 22.4391L9.02344 19.5703L1.52344 22.4297C1.17656 22.5609 0.7875 22.5141 0.482813 22.3031C0.178125 22.0922 0 21.7453 0 21.375V5.62501C0 5.15626 0.285938 4.73907 0.726562 4.57501L8.60156 1.57501C8.84531 1.48126 9.1125 1.47657 9.35625 1.56095L17.9766 4.4297L25.4766 1.57032C25.8234 1.43907 26.2125 1.48595 26.5172 1.69688H26.5125ZM2.25 6.39845V19.7391L7.875 17.5969V4.25626L2.25 6.39845ZM16.875 19.8141V6.43595L10.125 4.18595V17.5641L16.875 19.8141ZM19.125 19.7438L24.75 17.6016V4.26095L19.125 6.39845V19.7391V19.7438Z'
              fill={currentView === 'map' ? 'white' : 'black'}
            />
          </svg>
        </button>
      </div>

      {/* Search Bar */}
      <div className='h-10 gap-1 sm:h-12 md:flex-1 flex items-center min-w-0 bg-neutral-light rounded-2xl px-4 sm:px-6 py-3 text-xl w-full md:w-auto lg:flex-1'>
        {/* Unified Search Input */}
        <LocationInput
          setLocation={handleLocationSelect}
          placeholder='Search properties or locations...'
          onPropertySearch={handleSearchKeyDown}
          searchValue={search}
          onSearchChange={handleSearchChange}
          initialLocationValue={getInitialLocationValue()}
        />

        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={2}
          stroke='currentColor'
          className='w-5 h-5 text-black'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z'
          />
        </svg>
      </div>

      {/* Buy/Rent Toggle */}
      <div className='flex items-center bg-neutral-light rounded-2xl p-1 gap-1 w-full md:w-auto justify-center h-10 sm:h-12'>
        {listingTypes?.map(option => {
          const isActive = activeListingType?.name === option.name;
          return (
            <button
              key={option.id}
              className={cn(
                'h-full px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all cursor-pointer flex-1 lg:flex-none flex items-center justify-center',
                isActive
                  ? 'bg-primary-main text-white'
                  : 'bg-transparent text-black'
              )}
              onClick={() => handleBuyOrRentChange(option.id)}
            >
              {option.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
