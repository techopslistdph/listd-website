import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { ListingFormData } from '@/components/listing/form/Schema';
import { CreateListingRequest } from '@/lib/queries/server/listing/index';
import { useListMyProperty } from '@/lib/queries/hooks/use-property';

export const useListingSubmission = (
  data: ListingFormData,
  onNext: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const { mutate: listMyProperty } = useListMyProperty();

  const handleSubmit = async (isDraft: boolean = false) => {
    try {
      setIsSubmitting(true);
      if (!user) {
        toast.error('Please login to create a listing');
        return;
      }

      // Create base listing data
      const baseListingData = {
        listingTypeId: data.listingTypeId,
        propertyTypeId: data.propertyTypeId,
        streetAddress: data.street,
        barangayId: data.barangay,
        cityId: data.city,
        region: data.state,
        photos: data.images,
        listingTitle: data.title,
        listingDescription: data.description,
        listingPrice: Math.max(parseInt(data.grossAskingPrice) || 0, 1),
        listingPriceFormatted: data.grossAskingPrice,
        longitude: Number(data.longitude) || 0,
        latitude: Number(data.latitude) || 0,
        isDraft: isDraft || false,
      };

      // Add property-specific fields based on property type
      const listingData: CreateListingRequest = {
        ...baseListingData,
        ...(data.propertyType === 'Condominium' && {
          buildingName: data.buildingName || '',
          floorNumber: parseInt(data.floorNo || '0') || 0,
          floorArea: parseInt(data.floorArea || '0') || 0,
          furnishingStatus: data.fullyFurnished || 'unfurnished',
          numberOfBedrooms: Number(data.bedrooms) || 0,
          numberOfBathrooms: Number(data.bathrooms) || 0,
          numberOfParkingSpaces: Number(data.parking) || 0,
          amenityIds: data.amenities || [],
          featureIds: data.features || [],
        }),
        ...(data.propertyType === 'Warehouse' && {
          buildingName: data.buildingName || '',
          floorArea: parseInt(data.floorArea || '0') || 0,
          ceilingHeight: parseInt(data.ceilingHeight || '0') || 0,
          numberOfParkingSpaces: Number(data.parking) || 0,
          amenityIds: data.amenities || [],
          loadingDocks: Number(data.loadingDocks) || 0,
          buildingSize: Number(data.buildingSize) || 0,
          securityFeatures: data.security || [],
        }),
        ...(data.propertyType === 'House and lot' && {
          floorArea: parseInt(data.floorArea || '0') || 0,
          lotSize: Number(data.lotSize) || 0,
          furnishingStatus: data.fullyFurnished || 'unfurnished',
          numberOfBedrooms: Number(data.bedrooms) || 0,
          numberOfBathrooms: Number(data.bathrooms) || 0,
          numberOfParkingSpaces: Number(data.parking) || 0,
          amenityIds: data.amenities || [],
          featureIds: data.features || [],
          numberOfFloors: Number(data.numberOfFloors) || 1,
          numberOfGarages: Number(data.numberOfGarages) || 0,
          numberOfLivingRooms: Number(data.numberOfLivingRooms) || 0,
          numberOfDiningRooms: Number(data.numberOfDiningRooms) || 0,
          numberOfKitchens: Number(data.numberOfKitchens) || 0,
          numberOfMaidRooms: Number(data.numberOfMaidRooms) || 0,
          yearBuilt: Number(data.yearBuilt) || 0,
        }),
        ...(data.propertyType === 'Vacant lot' && {
          lotSize: Number(data.lotSize) || 0,
          nearbyLocations: data.nearbyLocations || [],
        }),
        pricePerSqm: Math.max(
          parseInt(data.grossAskingPrice) /
            (data.propertyType === 'Vacant lot'
              ? Number(data.lotSize || '1')
              : parseInt(data.floorArea || '1') || 1),
          0
        ),
      };

      // Submit the listing with image upload functionality
      listMyProperty(
        {
          data: listingData,
          propertyType: data.propertyType,
        },
        {
          onSuccess: result => {
            if (result.success) {
              toast.success('Listing created successfully');
              onNext(); // This will show the ResultsStep
            } else {
              toast.error(result.message || 'Failed to create listing');
            }
            setIsSubmitting(false);
          },
          onError: error => {
            console.error('Error creating listing:', error);
            toast.error('Failed to create listing');
            setIsSubmitting(false);
          },
        }
      );
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing');
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
};
