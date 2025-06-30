import { Suspense } from 'react';
import PostListingForm from '@/components/listing/form/PostListingForm';
import { getListingTypes, getPropertyTypes } from '@/lib/queries/server/home';

export default async function PostListingPage() {
  const [propertyTypes, listingTypes] = await Promise.all([
    getPropertyTypes(),
    getListingTypes(),
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostListingForm
        propertyTypes={propertyTypes}
        listingTypes={listingTypes}
      />
    </Suspense>
  );
}
