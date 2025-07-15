import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { ListingFormData } from '@/components/listing/form/Schema';
import { useListMyProperty } from '@/lib/queries/hooks/use-property';
import { CreateListingRequest } from '@/lib/queries/server/propety/type';

export const useListingSubmission = (
  data: ListingFormData,
  onNext?: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const { mutate: listMyProperty } = useListMyProperty();

  const handleSubmit = async (
    isDraft: boolean = false,
    isEditing: boolean = false,
    propertyId?: string
  ) => {
    try {
      setIsSubmitting(true);
      if (!user) {
        toast.error('Please login to create a listing');
        return;
      }
      // Create base listing data
      const baseListingData = {
        ...(data?.listingTypeId && { listingTypeId: data?.listingTypeId }),
        ...(data?.propertyTypeId && { propertyTypeId: data?.propertyTypeId }),
        ...(data?.street && { streetAddress: data?.street }),
        ...(data?.barangay && { barangayId: data?.barangay }),
        ...(data?.city && { cityId: data?.city }),
        ...(data?.street && { streetAddress: data?.street }),
        ...(data?.city &&
          data?.barangay &&
          data?.street &&
          data?.state && {
            address: `${data?.city}, ${data?.barangay}, ${data?.street}, ${data?.state}`,
          }),
        ...(data?.state && { region: data?.state }),
        ...(data?.images && { photos: data?.images }),
        ...(data?.title && { listingTitle: data?.title }),
        ...(data?.description && { listingDescription: data?.description }),
        ...(data?.grossAskingPrice && {
          listingPrice: Math.max(Number(data?.grossAskingPrice), 1),
          listingPriceFormatted: data?.grossAskingPrice,
        }),
        ...(data?.longitude && { longitude: Number(data?.longitude) }),
        ...(data?.latitude && { latitude: Number(data?.latitude) }),
        isDraft: isDraft || false,
        isPublished: isDraft ? false : true,
      };

      // Add property-specific fields based on property type
      const listingData: CreateListingRequest = {
        ...baseListingData,
        ...(data.propertyType === 'Condominium' && {
          buildingName: data?.buildingName || '',
          ...(data?.floorNo && { floorNumber: Number(data?.floorNo) }),
          ...(data?.floorArea && { floorArea: Number(data?.floorArea) }),
          ...(data?.fullyFurnished && {
            furnishingStatus: data?.fullyFurnished,
          }),
          ...(data?.bedrooms && { numberOfBedrooms: Number(data?.bedrooms) }),
          ...(data?.bathrooms && {
            numberOfBathrooms: Number(data?.bathrooms),
          }),
          ...(data?.parking && {
            numberOfParkingSpaces: Number(data?.parking),
          }),
          amenityIds: data?.amenities.map(item => item.value) || [],
          featureIds: data?.features.map(item => item.value) || [],
        }),
        ...(data?.propertyType === 'Warehouse' && {
          ...(data?.floorArea && { floorArea: Number(data?.floorArea) }),
          ...(data?.ceilingHeight && {
            ceilingHeight: Number(data?.ceilingHeight),
          }),
          ...(data?.lotSize && { lotSize: Number(data?.lotSize) }),
          ...(data?.parking && {
            numberOfParkingSpaces: Number(data?.parking),
          }),
          ...(data?.loadingDocks && {
            loadingDocks: Number(data?.loadingDocks),
          }),
          ...(data?.buildingSize && {
            buildingSize: Number(data?.buildingSize),
          }),

          ...(data?.nearbyLocations && {
            nearbyLocations: data?.nearbyLocations.map(item => item.label),
          }),
        }),
        ...(data.propertyType === 'House and lot' && {
          ...(data?.floorArea && { floorArea: Number(data?.floorArea) }),
          ...(data?.lotSize && { lotSize: Number(data?.lotSize) }),
          ...(data?.fullyFurnished && {
            furnishingStatus: data?.fullyFurnished,
          }),
          ...(data?.bedrooms && { numberOfBedrooms: Number(data?.bedrooms) }),
          ...(data?.bathrooms && {
            numberOfBathrooms: Number(data?.bathrooms),
          }),
          ...(data?.parking && {
            numberOfParkingSpaces: Number(data?.parking),
          }),
          amenityIds: data?.amenities.map(item => item.value) || [],
          featureIds: data?.features.map(item => item.value) || [],
          ...(data?.numberOfFloors && {
            numberOfFloors: Number(data?.numberOfFloors),
          }),
          ...(data?.numberOfGarages && {
            numberOfGarages: Number(data?.numberOfGarages),
          }),
          ...(data?.numberOfLivingRooms && {
            numberOfLivingRooms: Number(data?.numberOfLivingRooms),
          }),
          ...(data?.numberOfDiningRooms && {
            numberOfDiningRooms: Number(data?.numberOfDiningRooms),
          }),
          ...(data?.numberOfKitchens && {
            numberOfKitchens: Number(data?.numberOfKitchens),
          }),
          ...(data?.numberOfMaidRooms && {
            numberOfMaidRooms: Number(data?.numberOfMaidRooms),
          }),
          ...(data?.yearBuilt && { yearBuilt: Number(data?.yearBuilt) }),
        }),
        ...(data.propertyType === 'Vacant lot' && {
          ...(data?.lotSize && { lotSize: Number(data?.lotSize) }),
          ...(data?.nearbyLocations && {
            nearbyLocations: data?.nearbyLocations.map(item => item.label),
          }),
          ...(data?.parking && {
            numberOfParkingSpaces: Number(data?.parking),
          }),
        }),
        ...(data?.grossAskingPrice && {
          pricePerSqm: Math.max(
            Number(data.grossAskingPrice) /
              (data.propertyType === 'Vacant lot'
                ? Number(data.lotSize)
                : Number(data.floorArea) || 1),
            0
          ),
        }),
      };

      // Submit the listing with image upload functionality
      listMyProperty(
        {
          data: listingData,
          propertyType: data.propertyType,
          isEditing,
          propertyId,
        },
        {
          onSuccess: result => {
            if (result.success) {
              toast.success(
                isDraft
                  ? 'Listing saved as draft'
                  : isEditing
                    ? 'Listing updated successfully'
                    : 'Listing created successfully'
              );
              onNext?.(); // This will show the ResultsStep
            } else {
              toast.error(
                result.message ||
                  (isEditing
                    ? 'Failed to update listing'
                    : 'Failed to create listing')
              );
            }
            setIsSubmitting(false);
          },
          onError: error => {
            console.error('Error creating listing:', error);
            toast.error(
              isEditing
                ? 'Failed to update listing'
                : 'Failed to create listing'
            );
            setIsSubmitting(false);
          },
        }
      );
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error(
        isEditing ? 'Failed to update listing' : 'Failed to create listing'
      );
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
};
