'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ListingAnalyticsView from './ListingAnalyticsView';
import { properties } from '@/app/data';
import verified from '@/../public/images/icons/verified.png';
import areaIcon from '../../../public/images/icons/squaremeter.svg';
import bedIcon from '../../../public/images/icons/bedroom.svg';
import bathIcon from '../../../public/images/icons/bath.svg';
import { PhoneIcon } from 'lucide-react';
import UpdateStatusDialog from './UpdateStatusDialog';
import type { Listing } from '@/app/data';
import { Button } from '../ui/button';

export default function MyListing() {
  const [selectedListing, setSelectedListing] = useState<
    null | (typeof properties)[0]
  >(null);
  const [activeTab, setActiveTab] = useState<'published' | 'closed' | 'drafts'>(
    'published'
  );
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateDialogProperty, setUpdateDialogProperty] =
    useState<Listing | null>(null);

  const filteredProperties = properties.filter((property) => {
    switch (activeTab) {
      case 'published':
        return property.status === 'For Lease';
      case 'closed':
        return property.status === 'Sold';
      case 'drafts':
        return property.status === 'Draft';
      default:
        return true;
    }
  });

  useEffect(() => {
    console.log(updateDialogOpen);
  }, [updateDialogOpen]);

  if (selectedListing) {
    return (
      <>
        <ListingAnalyticsView
          listing={selectedListing}
          setUpdateDialogProperty={setUpdateDialogProperty}
          setUpdateDialogOpen={setUpdateDialogOpen}
        />
        <UpdateStatusDialog
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          property={updateDialogProperty}
        />
      </>
    );
  }

  return (
    <div className='lg:p-8'>
      {/* Title and subtitle */}
      <h1 className='text-xl lg:text-2xl font-semibold mb-1'>
        Manage your Listing
      </h1>
      <p className='text-sm lg:text-base text-gray-400 mb-6'>
        Organize and update your property listings
      </p>

      {/* Tabs */}
      <div className='flex bg-gray-100 rounded-full mb-6 w-full'>
        <button
          onClick={() => setActiveTab('published')}
          className={`flex-1 py-2 text-sm lg:text-base rounded-full font-medium transition cursor-pointer ${
            activeTab === 'published'
              ? 'bg-[#4B23A0] text-white'
              : 'text-gray-500'
          }`}
        >
          Published
        </button>
        <button
          onClick={() => setActiveTab('closed')}
          className={`flex-1 py-2 text-sm lg:text-base rounded-full font-medium transition cursor-pointer ${
            activeTab === 'closed' ? 'bg-[#4B23A0] text-white' : 'text-gray-500'
          }`}
        >
          Closed
        </button>
        <button
          onClick={() => setActiveTab('drafts')}
          className={`flex-1 py-2 text-sm lg:text-base rounded-full font-medium transition cursor-pointer ${
            activeTab === 'drafts' ? 'bg-[#4B23A0] text-white' : 'text-gray-500'
          }`}
        >
          Drafts
        </button>
      </div>

      {/* Property List */}
      <div className='flex flex-col gap-4 lg:gap-8'>
        {filteredProperties.length === 0 ? (
          <div className='flex flex-col items-center justify-center mt-12 lg:mt-24'>
            <Image
              src={'/images/icons/empty.svg'}
              alt='No listings'
              width={150}
              height={50}
              className='mb-4 lg:mb-8 lg:w-[204px] lg:h-[67px]'
            />
            <div className='text-xl lg:text-2xl font-bold text-[#2D0C7E] mb-2 text-center'>
              {activeTab === 'published' && 'No published listings to show.'}
              {activeTab === 'closed' && 'No closed listings to show.'}
              {activeTab === 'drafts' && 'No draft listings to show.'}
            </div>
            <div className='text-sm lg:text-base text-gray-400 text-center'>
              {activeTab === 'published' &&
                "You don't have any published listings yet."}
              {activeTab === 'closed' &&
                "You don't have any closed listings yet."}
              {activeTab === 'drafts' &&
                "You don't have any draft listings yet."}
            </div>
          </div>
        ) : (
          filteredProperties.map((property) => {
            const isSold = property.status === 'Sold';
            const isDraft = property.status === 'Draft';
            const isForLease = property.status === 'For Lease';
            // Placeholder image for drafts
            const placeholderImg = '/images/placeholder-image.svg';
            return (
              <div
                key={property.id}
                className='flex flex-col lg:flex-row bg-white rounded-3xl shadow-2xl shadow-[#F7EFFD] p-4 lg:p-6 cursor-pointer transition w-full'
                onClick={() => setSelectedListing(property)}
              >
                {/* Image */}
                <div className='flex-shrink-0 flex items-center mb-4 lg:mb-0'>
                  <Image
                    src={isDraft ? placeholderImg : property.thumbnail}
                    alt={property.title}
                    width={240}
                    height={200}
                    className='w-full lg:w-60 h-48 lg:h-56 object-cover rounded-2xl'
                  />
                </div>
                {/* Details */}
                <div className='flex flex-col justify-between lg:ml-8 flex-1'>
                  <div>
                    <div className='flex items-center mb-2'>
                      <span
                        className={`px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm font-medium mr-4 ${
                          isSold
                            ? 'bg-green-100 text-green-600'
                            : isForLease
                            ? 'bg-primary-light text-primary-main'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {property.status}
                      </span>
                    </div>
                    <div className='text-[#4B23A0] font-bold text-xl lg:text-2xl mb-1'>
                      {property.price}
                    </div>
                    <div className='text-lg lg:text-xl font-semibold mb-1'>
                      {property.title}
                    </div>
                    <div className='flex items-center text-gray-400 text-sm lg:text-base mb-1'>
                      <svg
                        className='w-4 h-4 lg:w-5 lg:h-5 mr-1'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                      </svg>
                      {property.location}
                    </div>
                    <div className='flex items-center text-gray-400 text-sm lg:text-base mb-4'>
                      <PhoneIcon className='w-4 h-4 lg:w-5 lg:h-5 mr-1' />
                      {property.agent.name}
                      {property.isVerified && (
                        <Image
                          src={verified}
                          alt='verified'
                          className='w-3 lg:w-4 ml-1'
                        />
                      )}
                    </div>
                  </div>
                  <div className='flex flex-col lg:flex-row lg:items-center justify-between mt-2 gap-4 lg:gap-0'>
                    <div className='flex flex-wrap gap-4 lg:gap-8 text-gray-400 text-sm lg:text-base'>
                      <div className='flex items-center'>
                        <Image
                          src={bedIcon}
                          alt='bedroom'
                          width={16}
                          height={16}
                          className='mr-1 lg:w-5 lg:h-5'
                        />
                        {
                          property.description.find(
                            (detail) => 'bedrooms' in detail
                          )?.bedrooms
                        }{' '}
                        Bedroom
                      </div>
                      <div className='flex items-center'>
                        <Image
                          src={bathIcon}
                          alt='bath'
                          width={16}
                          height={16}
                          className='mr-1 lg:w-5 lg:h-5'
                        />
                        {
                          property.description.find(
                            (detail) => 'baths' in detail
                          )?.baths
                        }{' '}
                        Bath
                      </div>
                      <div className='flex items-center'>
                        <Image
                          src={areaIcon}
                          alt='area'
                          width={16}
                          height={16}
                          className='mr-1 lg:w-5 lg:h-5'
                        />
                        {
                          property.description.find(
                            (detail) => 'area' in detail
                          )?.area
                        }
                      </div>
                    </div>
                    <div className='flex flex-col lg:flex-row gap-2 lg:gap-4 w-full lg:w-auto lg:min-w-[320px] justify-end'>
                      {isSold ? (
                        <>
                          <Button
                            variant='outline'
                            className='rounded-full py-3 lg:py-5 px-4 lg:px-8 w-full lg:w-44 border-primary-main text-primary-main hover:bg-white cursor-pointer'
                            type='button'
                            onClick={(e) => {
                              e.stopPropagation();
                              setUpdateDialogProperty(property);
                              setUpdateDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            type='button'
                            className='rounded-full py-3 lg:py-5 px-4 lg:px-8 w-full lg:w-44 bg-primary-main text-white hover:bg-primary-main border border-primary-main cursor-pointer'
                          >
                            Delete{' '}
                          </Button>
                        </>
                      ) : isDraft ? (
                        <>
                          <Button
                            variant='outline'
                            className='rounded-full py-3 lg:py-5 px-4 lg:px-8 w-full lg:w-44 border-primary-main text-primary-main hover:bg-white cursor-pointer'
                            type='button'
                          >
                            Delete{' '}
                          </Button>
                          <Button
                            type='button'
                            onClick={(e) => {
                              e.stopPropagation();
                              setUpdateDialogProperty(property);
                              setUpdateDialogOpen(true);
                            }}
                            className='rounded-full py-3 lg:py-5 px-4 lg:px-8 w-full lg:w-44 bg-primary-main text-white hover:bg-primary-main border border-primary-main cursor-pointer'
                          >
                            Update Status
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <UpdateStatusDialog
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        property={updateDialogProperty}
      />
    </div>
  );
}
