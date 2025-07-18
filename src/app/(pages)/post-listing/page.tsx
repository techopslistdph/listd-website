import { Suspense } from 'react';
import PostListingForm from '@/components/listing/form/PostListingForm';
import { getListingTypes, getPropertyTypes } from '@/lib/queries/server/home';
import { getAmenities, getFeatures } from '@/lib/queries/server/propety';
import { getUserListings } from '@/lib/queries/server/listing';
import LoadingSpinner from '@/components/ui/loading-spinner';

export const dynamic = 'force-dynamic';

export default async function PostListingPage() {
  const [propertyTypes, listingTypes, features, amenities, userListings] =
    await Promise.all([
      getPropertyTypes(),
      getListingTypes(),
      getFeatures(),
      getAmenities(),
      getUserListings('all'),
    ]);

  if (userListings.data?.length && userListings.data?.length >= 2) {
    return (
      <div className='flex flex-col items-center justify-center h-[50vh] md:h-[80vh]'>
        <p className='text-4xl md:text-5xl lg:text-6xl font-bold text-primary-main'>
          Listd
        </p>
        <h2 className='text-base lg:text-xl font-medium text-center my-2'>
          You have reached the maximum number of listings.
        </h2>
        <p className='text-sm md:text-base lg:text-lg font-medium text-center text-primary-main'>
          Please contact us at{' '}
          <a href='mailto:support@listd.com'>support@listd.com</a>
        </p>
      </div>
    );
  }

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
