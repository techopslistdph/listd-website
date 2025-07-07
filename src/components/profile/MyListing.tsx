/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import ListingAnalyticsView from './ListingAnalyticsView';
import verified from '@/../public/images/icons/verified.png';
import areaIcon from '../../../public/images/icons/squaremeter.svg';
import bedIcon from '../../../public/images/icons/bedroom.svg';
import bathIcon from '../../../public/images/icons/bath.svg';
import { PhoneIcon } from 'lucide-react';
import UpdateStatusDialog from './UpdateStatusDialog';
import { useGetUserListings } from '@/lib/queries/hooks/use-user-profile';
import { PropertyDetail } from '@/lib/queries/server/propety/type';
import { getPropertyFeatures } from './MyFavorites';
import placeholderImg from '../../../public/images/placeholder-image.png';
import PropertySkeleton from './PropertySkeleton';
import { Button } from '../ui/button';
import ConfirmationDialog from './ConfirmationDialog';
import { useDeleteProperty } from '@/lib/queries/hooks/use-property';
import { toast } from 'sonner';

export default function MyListing() {
  const [activeTab, setActiveTab] = useState<'published' | 'draft' | 'closed'>(
    'published'
  );
  const { data: userListings, isLoading } = useGetUserListings({
    status: activeTab,
  });

  const [selectedListing, setSelectedListing] = useState<null | PropertyDetail>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<{
    id: string;
    propertyType: string;
  } | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateDialogProperty, setUpdateDialogProperty] =
    useState<PropertyDetail | null>(null);
  const { mutate: deleteProperty } = useDeleteProperty();
  if (selectedListing) {
    return (
      <div>
        <ListingAnalyticsView
          setSelectedListing={setSelectedListing}
          listing={selectedListing}
          setUpdateDialogProperty={setUpdateDialogProperty}
          setUpdateDialogOpen={setUpdateDialogOpen}
        />
        <UpdateStatusDialog
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          property={updateDialogProperty}
        />
      </div>
    );
  }

  const handleDelete = (id: string, propertyType: string) => {
    console.log(id, propertyType);
    setPropertyToDelete({ id, propertyType });
    setDeleteDialogOpen(true);
  };

  const handleCancel = () => {
    setDeleteDialogOpen(false);
    setPropertyToDelete(null);
  };

  const handleRemove = () => {
    if (propertyToDelete) {
      console.log(propertyToDelete);
      deleteProperty(
        {
          propertyId: propertyToDelete.id,
          propertyType: propertyToDelete.propertyType,
        },
        {
          onSuccess: () => {
            toast.success('Property deleted successfully');
          },
          onError: () => {
            toast.error('Failed to delete property');
          },
        }
      );
      setPropertyToDelete(null);
      setDeleteDialogOpen(false);
    }
  };
  return (
    <div className='lg:p-8'>
      {/* Title and subtitle */}
      <h1 className='text-xl lg:text-2xl font-semibold mb-1'>
        Manage your Listing
      </h1>
      <p className='text-sm lg:text-base text-gray-400 mb-6 '>
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
          onClick={() => setActiveTab('draft')}
          className={`flex-1 py-2 text-sm lg:text-base rounded-full font-medium transition cursor-pointer ${
            activeTab === 'draft' ? 'bg-[#4B23A0] text-white' : 'text-gray-500'
          }`}
        >
          Drafts
        </button>
      </div>

      {/* Property List */}
      <div className='flex flex-col gap-4 lg:gap-8'>
        {isLoading && <PropertySkeleton />}
        {userListings?.data?.length === 0 || !userListings?.data ? (
          <div className='flex flex-col items-center justify-center mt-12 lg:mt-24'>
            <Image
              src={'/images/icons/empty.svg'}
              alt='No listings'
              width={150}
              height={50}
              className='mb-4 lg:mb-8 lg:w-[204px] lg:h-[67px]'
            />
            <div className='text-xl lg:text-2xl font-bold text-primary-main mb-2 text-center'>
              {activeTab === 'published' && 'No published listings to show.'}
              {activeTab === 'draft' && 'No draft listings to show.'}
              {activeTab === 'closed' && 'No closed listings to show.'}
            </div>
            <div className='text-sm lg:text-base text-gray-400 text-center'>
              {activeTab === 'published' &&
                "You don't have any published listings yet."}
              {activeTab === 'draft' &&
                "You don't have any draft listings yet."}
              {activeTab === 'closed' &&
                "You don't have any closed listings yet."}
            </div>
          </div>
        ) : (
          userListings?.data?.map((property: PropertyDetail) => {
            const features = getPropertyFeatures(property);
            const isDraft = property.property.isDraft;
            return (
              <div
                key={property.id}
                className={`grid grid-cols-1 lg:grid-cols-4 bg-white rounded-3xl shadow-2xl shadow-[#F7EFFD] p-4 lg:p-6  transition w-full ${
                  !isDraft ? 'cursor-pointer' : ''
                }`}
                onClick={() => {
                  if (!isDraft) {
                    setSelectedListing(property);
                  }
                }}
              >
                {/* Image */}
                <div className='flex-shrink-0 flex items-center mb-4 lg:mb-0 col-span-1'>
                  <img
                    src={
                      property?.property?.images?.[0]?.imageUrl ||
                      placeholderImg.src
                    }
                    alt={property.property.listingTitle}
                    width={240}
                    height={200}
                    className='w-full lg:w-full h-72 lg:h-56 object-cover rounded-2xl mb-auto'
                  />
                </div>
                {/* Details */}
                <div className='flex flex-col justify-between lg:ml-8 flex-1 col-span-3'>
                  <div>
                    <div className='flex items-center mb-2'>
                      <span
                        className={`px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm font-medium mr-4 ${
                          property.property.listingTypeName === 'Buy'
                            ? 'bg-green-100 text-green-600'
                            : property.property.listingTypeName === 'Rent'
                              ? 'bg-primary-light text-primary-main'
                              : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {property.property.listingTypeName === 'Buy'
                          ? 'For Sale'
                          : 'For Rent'}
                      </span>
                    </div>
                    {property.property.listingPrice && (
                      <div className='text-[#4B23A0] font-bold text-xl lg:text-2xl mb-1'>
                        {property.property.listingPrice.toLocaleString(
                          'en-US',
                          {
                            style: 'currency',
                            currency: 'PHP',
                          }
                        ) || 'Price not available'}
                      </div>
                    )}

                    <div className='text-lg lg:text-xl font-semibold mb-1 break-words'>
                      {property.property.listingTitle || 'Title not available'}
                    </div>
                    <div className='flex items-center text-gray-400 text-sm lg:text-base mb-1 break-words'>
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
                      {property.property.address ||
                        `${property.property.cityName}, ${property.property.barangayName}` ||
                        'Address not available'}
                    </div>
                    {property?.property?.scrapeContactInfo?.agentName && (
                      <div className='flex items-center text-gray-400 text-sm lg:text-base mb-4'>
                        <PhoneIcon className='w-4 h-4 lg:w-5 lg:h-5 mr-1' />
                        {property?.property?.scrapeContactInfo?.agentName}
                        <Image
                          src={verified}
                          alt='verified'
                          className='w-3 lg:w-4 ml-1'
                        />
                      </div>
                    )}
                  </div>
                  <div className='flex flex-wrap gap-4 justify-between text-gray-400 text-sm lg:text-base'>
                    <div className='flex text-gray-400 text-base gap-5 m-2'>
                      {features.numberOfBedrooms && (
                        <div className='flex flex-col gap-1'>
                          <Image src={bedIcon} alt='bed' />
                          <span>{features.numberOfBedrooms} Bedroom</span>
                        </div>
                      )}
                      {features.numberOfBathrooms && (
                        <div className='flex flex-col gap-1'>
                          <Image src={bathIcon} alt='bath' />
                          <span>{features.numberOfBathrooms} Bath</span>
                        </div>
                      )}
                      {features.floorArea && (
                        <div className='flex flex-col gap-1'>
                          <Image src={areaIcon} alt='area' />
                          <span>{features.floorArea} sqm</span>
                        </div>
                      )}
                      {features.lotSize && (
                        <div className='flex flex-col gap-1'>
                          <Image src={areaIcon} alt='lot' />
                          <span>{features.lotSize} sqm lot</span>
                        </div>
                      )}
                    </div>
                    {isDraft && (
                      <div className='flex justify-end mt-2 gap-2 items-end'>
                        <Button
                          variant='outline'
                          className='rounded-full py-3 lg:py-5 px-4 lg:px-8 w-full lg:w-44 border-primary-main text-primary-main hover:bg-white cursor-pointer'
                          type='button'
                          onClick={() =>
                            handleDelete(
                              property.id,
                              property.property.propertyTypeName
                            )
                          }
                        >
                          Delete
                        </Button>
                        <Button
                          type='button'
                          onClick={e => {
                            e.stopPropagation();
                            setUpdateDialogProperty(property);
                            setUpdateDialogOpen(true);
                          }}
                          className='rounded-full py-3 lg:py-5 px-4 lg:px-8 w-full lg:w-44 bg-primary-main text-white hover:bg-primary-main border border-primary-main cursor-pointer'
                        >
                          Edit
                        </Button>
                      </div>
                    )}
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
      <ConfirmationDialog
        showModal={deleteDialogOpen}
        setShowModal={setDeleteDialogOpen}
        handleCancel={() => handleCancel()}
        handleRemove={() => handleRemove()}
        title='Delete Listing'
        description='Are you sure you want to delete this listing? This action cannot be undone.'
      />
    </div>
  );
}
