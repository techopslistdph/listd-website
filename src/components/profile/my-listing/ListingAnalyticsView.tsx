import React, { useState } from 'react';
import { Eye, ArrowLeft } from 'lucide-react';
import { PropertyDetail } from '@/lib/queries/server/propety/type';
import { Button } from '@/components/ui/button';
import { useDeleteProperty } from '@/lib/queries/hooks/use-property';
import { toast } from 'sonner';
import ListingDetailsView from './ListingDetailsView';
import ConfirmationDialog from '../ConfirmationDialog';
import PropertyDetailsDisplay from '@/components/property/PropertyDetailsDisplay';

interface ListingAnalyticsViewProps {
  listing: PropertyDetail;
  setUpdateDialogProperty: (listing: PropertyDetail) => void;
  setUpdateDialogOpen: (open: boolean) => void;
  setSelectedListing: (listing: PropertyDetail | null) => void;
}

// const analytics = [
//   {
//     icon: <Eye className='text-green-400 w-6 h-6' />,
//     color: 'bg-success-light',
//     label: 'Views',
//     value: 125,
//   },
//   {
//     icon: <Search className='text-purple-400 w-6 h-6' />,
//     color: 'bg-secondary-light',
//     label: 'Clicks',
//     value: 125,
//   },
//   {
//     icon: <Heart className='text-red-400 w-6 h-6' />,
//     color: 'bg-error-light',
//     label: 'Saves',
//     value: 125,
//   },
//   {
//     icon: <MessageCircle className='text-purple-400 w-6 h-6' />,
//     color: 'bg-primary-light',
//     label: 'Inquiries',
//     value: 125,
//   },
// ];

export default function ListingAnalyticsView({
  listing,
  setUpdateDialogProperty,
  setUpdateDialogOpen,
  setSelectedListing,
}: ListingAnalyticsViewProps) {
  const [showDetails, setShowDetails] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<{
    id: string;
    propertyType: string;
  } | null>(null);
  const { mutate: deleteProperty, isPending } = useDeleteProperty();
  if (showDetails) {
    return (
      <ListingDetailsView
        listing={listing}
        setShowDetails={setShowDetails}
        setUpdateDialogProperty={setUpdateDialogProperty}
        setUpdateDialogOpen={setUpdateDialogOpen}
      />
    );
  }

  const handleDelete = (id: string, propertyType: string) => {
    setPropertyToDelete({ id, propertyType });
    setDeleteDialogOpen(true);
  };

  const handleCancel = () => {
    setDeleteDialogOpen(false);
    setPropertyToDelete(null);
  };

  const handleRemove = () => {
    if (propertyToDelete) {
      deleteProperty(
        {
          propertyId: propertyToDelete.id,
          propertyType: propertyToDelete.propertyType,
        },
        {
          onSuccess: () => {
            toast.success('Property deleted successfully');
            setSelectedListing(null);
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
    <div className='p-4 lg:p-8'>
      {/* back button */}
      <button
        className='flex items-center gap-2 text-primary-mid font-bold cursor-pointer text-sm lg:text-base mb-5'
        onClick={() => setSelectedListing(null)}
      >
        <ArrowLeft className='w-4 h-4 lg:w-5 lg:h-5' />
        Back
      </button>
      {/* Title & Address */}
      <div className='mb-2 text-lg lg:text-2xl font-bold break-words'>
        {listing.property.listingTitle}
      </div>
      {listing.property.address ||
        (listing.property.barangayName && (
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
            <p>
              {listing.property.address ||
                `${listing.property.cityName}, ${listing.property.barangayName}` ||
                'Address not available'}
            </p>
          </div>
        ))}

      {listing.property.listingPrice && (
        <div className='text-xl lg:text-2xl font-bold mb-4'>
          {listing.property.listingPrice.toLocaleString('en-US', {
            style: 'currency',
            currency: 'PHP',
          })}
        </div>
      )}
      <hr className='mb-4 lg:mb-6' />

      {/* Property Details */}
      <div className='flex flex-wrap justify-between text-center gap-4 lg:gap-0 my-4 lg:my-8'>
        <PropertyDetailsDisplay
          propertyDetail={listing}
          className='grid grid-cols-2 lg:grid-cols-5 gap-4  w-full'
          itemClassName='flex flex-col items-center justify-center gap-1 text-neutral-mid text-xs lg:text-sm w-1/3 lg:w-auto'
        />
      </div>

      {/* Listing Analytics */}
      {/* <div className='mb-6 lg:mb-8'>
        <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4'>
          <div className='mb-4 lg:mb-0'>
            <div className='font-bold text-base lg:text-lg'>
              Listing Analytics
            </div>
            <div className='text-gray-400 text-xs lg:text-sm'>
              Track how your listing is performing
            </div>
          </div>
          <button className='flex items-center text-primary-mid font-bold cursor-pointer text-sm lg:text-base'>
            <Download className='w-4 h-4 lg:w-5 lg:h-5 mr-2' /> Export report
          </button>
        </div>
        <div className='space-y-3 lg:space-y-4'>
          {analytics.map(item => (
            <div
              key={item.label}
              className='flex items-center bg-primary-light rounded-xl lg:rounded-2xl p-3 lg:p-4 justify-between'
            >
              <div className='flex items-center gap-3 lg:gap-4'>
                <span
                  className={`rounded-full p-1.5 lg:p-2 ${item.color} text-primary-main`}
                >
                  {React.cloneElement(item.icon, {
                    className: 'w-4 h-4 lg:w-6 lg:h-6',
                  })}
                </span>
                <div className='flex flex-col'>
                  <span className='text-xl lg:text-2xl font-bold text-primary-mid'>
                    {item.value}
                  </span>
                  <span className='text-primary-mid text-xs'>{item.label}</span>
                </div>
              </div>
              <span className='text-primary-mid flex items-center gap-1 text-xs lg:text-sm'></span>
            </div>
          ))}
        </div>
      </div> */}

      {/* Listing Actions */}
      <div>
        <div className='font-bold text-base lg:text-lg mb-1'>
          Listing Actions
        </div>
        <div className='text-gray-400 text-xs lg:text-sm mb-3 lg:mb-4'>
          Manage your property listing settings
        </div>
        <div className='flex flex-col gap-5'>
          <button
            className='flex items-center bg-white border border-gray-200 cursor-pointer rounded-lg lg:rounded-xl p-3 lg:p-4 w-full'
            onClick={() => setShowDetails(true)}
          >
            <Eye className='text-[#7B6CD9] w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3' />
            <span className='font-semibold text-sm lg:text-base'>
              View Listing Details
            </span>
          </button>
          <Button
            variant='default'
            className='ml-auto rounded-full py-3 lg:py-5 px-4 lg:px-8 w-full lg:w-44 bg-primary-main text-white hover:bg-primary-main border border-primary-main cursor-pointer text-sm lg:text-base'
            type='button'
            onClick={e => {
              e.stopPropagation();
              handleDelete(listing.id, listing.property.propertyTypeName);
            }}
          >
            {isPending ? 'Deleting...' : 'Delete Listing'}
          </Button>
        </div>
      </div>
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
