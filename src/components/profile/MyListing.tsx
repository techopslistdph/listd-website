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
    <div className='p-8'>
      {/* Title and subtitle */}
      <h1 className='text-2xl font-semibold mb-1'>Manage your Listing</h1>
      <p className='text-gray-400 mb-6'>
        Organize and update your property listings
      </p>

      {/* Tabs */}
      <div className='flex bg-gray-100 rounded-full mb-6 w-full'>
        <button
          onClick={() => setActiveTab('published')}
          className={`flex-1 py-2 rounded-full font-medium transition cursor-pointer ${
            activeTab === 'published'
              ? 'bg-[#4B23A0] text-white'
              : 'text-gray-500'
          }`}
        >
          Published
        </button>
        <button
          onClick={() => setActiveTab('closed')}
          className={`flex-1 py-2 rounded-full font-medium transition cursor-pointer ${
            activeTab === 'closed' ? 'bg-[#4B23A0] text-white' : 'text-gray-500'
          }`}
        >
          Closed
        </button>
        <button
          onClick={() => setActiveTab('drafts')}
          className={`flex-1 py-2 rounded-full font-medium transition cursor-pointer ${
            activeTab === 'drafts' ? 'bg-[#4B23A0] text-white' : 'text-gray-500'
          }`}
        >
          Drafts
        </button>
      </div>

      {/* Property List */}
      <div className='flex flex-col gap-6'>
        {filteredProperties.map((property) => {
          const isSold = property.status === 'Sold';
          const isDraft = property.status === 'Draft';
          const isForLease = property.status === 'For Lease';
          // Placeholder image for drafts
          const placeholderImg = '/images/placeholder-image.svg';
          return (
            <div
              key={property.id}
              className='flex bg-white rounded-3xl shadow-md p-6 cursor-pointer hover:shadow-lg transition w-full items-stretch'
              onClick={() => setSelectedListing(property)}
            >
              {/* Image */}
              <div className='flex-shrink-0 flex items-center'>
                <Image
                  src={isDraft ? placeholderImg : property.thumbnail}
                  alt={property.title}
                  width={240}
                  height={200}
                  className='w-60 h-56 object-cover rounded-2xl'
                />
              </div>
              {/* Details */}
              <div className='flex flex-col justify-between ml-8 flex-1'>
                <div>
                  <div className='flex items-center mb-2'>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-medium mr-4 ${
                        isSold
                          ? 'bg-green-100 text-green-600'
                          : isForLease
                          ? 'bg-[var(--primary-light)] text-[var(--primary-main)]'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>
                  <div className='text-[#4B23A0] font-bold text-2xl mb-1'>
                    {property.price}
                  </div>
                  <div className='text-xl font-semibold mb-1'>
                    {property.title}
                  </div>
                  <div className='flex items-center text-gray-400 text-base mb-1'>
                    <svg
                      className='w-5 h-5 mr-1'
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
                  <div className='flex items-center text-gray-400 text-base mb-4'>
                    <PhoneIcon className='w-5 h-5 mr-1' />
                    {property.agent.name}
                    {property.isVerified && (
                      <Image
                        src={verified}
                        alt='verified'
                        className='w-4 ml-1'
                      />
                    )}
                  </div>
                </div>
                <div className='flex items-center justify-between mt-2'>
                  <div className='flex space-x-8 text-gray-400 text-base'>
                    <div className='flex items-center'>
                      <Image
                        src={bedIcon}
                        alt='bedroom'
                        width={20}
                        height={20}
                        className='mr-1'
                      />
                      {
                        property.description.find((detail) => detail.bedrooms)
                          ?.bedrooms
                      }{' '}
                      Bedroom
                    </div>
                    <div className='flex items-center'>
                      <Image
                        src={bathIcon}
                        alt='bath'
                        width={20}
                        height={20}
                        className='mr-1'
                      />
                      {
                        property.description.find((detail) => detail.baths)
                          ?.baths
                      }{' '}
                      Bath
                    </div>
                    <div className='flex items-center'>
                      <Image
                        src={areaIcon}
                        alt='area'
                        width={20}
                        height={20}
                        className='mr-1'
                      />
                      {property.description.find((detail) => detail.area)?.area}
                    </div>
                  </div>
                  <div className='flex gap-4 min-w-[320px] justify-end'>
                    {isSold ? (
                      <>
                        <Button
                          variant='outline'
                          className='rounded-full py-5 px-8 w-44 border-[var(--primary-main)] text-[var(--primary-main)] hover:bg-white cursor-pointer'
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
                          className='rounded-full py-5 px-8 w-44 bg-[var(--primary-main)] text-white hover:bg-[var(--primary-main)] border border-[var(--primary-main)] cursor-pointer'
                        >
                          Delete{' '}
                        </Button>
                      </>
                    ) : isDraft ? (
                      <>
                        <Button
                          variant='outline'
                          className='rounded-full py-5 px-8 w-44 border-[var(--primary-main)] text-[var(--primary-main)] hover:bg-white cursor-pointer'
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
                          className='rounded-full py-5 px-8 w-44 bg-[var(--primary-main)] text-white hover:bg-[var(--primary-main)] border border-[var(--primary-main)] cursor-pointer'
                        >
                          Update Status
                        </Button>
                        {/* <button
                          className='bg-[#2D0C7E] text-white font-semibold rounded-full px-10 py-2 transition hover:bg-[#4B23A0] cursor-pointer'
                          onClick={(e) => {
                            e.stopPropagation();
                            setUpdateDialogProperty(property);
                            setUpdateDialogOpen(true);
                          }}
                        >
                          Update Status
                        </button> */}
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <UpdateStatusDialog
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        property={updateDialogProperty}
      />
    </div>
  );
}
