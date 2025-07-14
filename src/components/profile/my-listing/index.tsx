'use client';
import React, { useEffect, useState } from 'react';
import ListingAnalyticsView from './ListingAnalyticsView';
import TabNavigation from './TabNavigation';
import ListingEmptyState from './ListingEmptyState';
import PropertyListingCard from './PropertyListingCard';
import { useGetUserListings } from '@/lib/queries/hooks/use-user-profile';
import { PropertyDetail } from '@/lib/queries/server/propety/type';
import { getPropertyFeatures } from '../MyFavorites';
import PropertySkeleton from '../PropertySkeleton';
import ConfirmationDialog from '../ConfirmationDialog';
import { useDeleteProperty } from '@/lib/queries/hooks/use-property';
import { toast } from 'sonner';
import UpdateStatusDialog from '../UpdateStatusDialog';

export type FeatureAndAmenity = Array<{
  id: string;
  name: string;
}>;

export default function MyListing({
  features,
  amenities,
}: {
  features: FeatureAndAmenity;
  amenities: FeatureAndAmenity;
}) {
  const [activeTab, setActiveTab] = useState<'published' | 'draft' | 'closed'>(
    'published'
  );
  const {
    data: userListings,
    isLoading,
    refetch,
  } = useGetUserListings({
    status: activeTab,
  });

  const [selectedListing, setSelectedListing] = useState<null | PropertyDetail>(
    null
  );
  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (userListings && selectedListing) {
      const listing = userListings.data?.find(
        (listing: PropertyDetail) => listing.id === selectedListing.id
      ) as unknown as PropertyDetail;
      setSelectedListing(listing);
    }
  }, [userListings, selectedListing]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<{
    id: string;
    propertyType: string;
  } | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const { mutate: deleteProperty } = useDeleteProperty();

  // Show analytics view when a listing is selected
  if (selectedListing) {
    return (
      <div>
        <ListingAnalyticsView
          setSelectedListing={setSelectedListing}
          listing={selectedListing}
          setUpdateDialogProperty={setSelectedListing}
          setUpdateDialogOpen={setUpdateDialogOpen}
        />
        <UpdateStatusDialog
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          property={selectedListing}
          features={features}
          amenities={amenities}
        />
      </div>
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

  const handleEdit = (property: PropertyDetail) => {
    setSelectedListing(property);
    setUpdateDialogOpen(true);
  };

  const isEmptyState = userListings?.data?.length === 0 || !userListings?.data;

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
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Property List */}
      <div className='flex flex-col gap-4 lg:gap-8'>
        {isLoading && <PropertySkeleton />}
        {!isLoading && isEmptyState ? (
          <ListingEmptyState activeTab={activeTab} />
        ) : (
          userListings?.data?.map((property: PropertyDetail) => {
            const features = getPropertyFeatures(property);
            return (
              <PropertyListingCard
                key={property.id}
                property={property}
                features={features}
                onCardClick={() => setSelectedListing(property)}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            );
          })
        )}
      </div>

      <ConfirmationDialog
        showModal={deleteDialogOpen}
        setShowModal={setDeleteDialogOpen}
        handleCancel={handleCancel}
        handleRemove={handleRemove}
        title='Delete Listing'
        description='Are you sure you want to delete this listing? This action cannot be undone.'
      />
    </div>
  );
}
