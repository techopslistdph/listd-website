import { Suspense } from 'react';
import { getListingTypes, getPropertyTypes } from '@/lib/queries/server/home';
import { getAmenities, getFeatures } from '@/lib/queries/server/propety';
import PostListingForm from '@/components/listing/form/PostListingForm';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default async function ValuationDetailsPage() {
  const [propertyTypes, listingTypes, features, amenities] = await Promise.all([
    getPropertyTypes(),
    getListingTypes(),
    getFeatures(),
    getAmenities(),
  ]);
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PostListingForm
        features={features?.data?.uniqueFeatures || []}
        propertyTypes={propertyTypes}
        listingTypes={listingTypes}
        amenities={amenities?.data?.uniqueAmenities || []}
      />
    </Suspense>
  );
}
