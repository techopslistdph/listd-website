import { Suspense } from 'react';
import PostListingForm from '@/components/listing/form/PostListingForm';
import { getListingTypes, getPropertyTypes } from '@/lib/queries/server/home';
import { getAmenities, getFeatures } from '@/lib/queries/server/propety';

export default async function PostListingPage() {
  const [propertyTypes, listingTypes, features, amenities] = await Promise.all([
    getPropertyTypes(),
    getListingTypes(),
    getFeatures(),
    getAmenities(),
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostListingForm
        features={features?.data?.uniqueFeatures || []}
        propertyTypes={propertyTypes}
        listingTypes={listingTypes}
        amenities={amenities?.data?.uniqueAmenities || []}
      />
    </Suspense>
  );
}
