import Property from '@/components/property/Property';
import { getPropertyById, SearchParams } from '@/lib/queries/server/propety';
import { auth } from '@clerk/nextjs/server';

import Link from 'next/link';

export default async function PropertyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ property: SearchParams['property'] }>;
}) {
  const resolvedParams = await params;
  const { property: propertyType } = await searchParams;
  const { userId, sessionId } = await auth();

  const propertyDetail = await getPropertyById({
    property: propertyType,
    id: resolvedParams.id,
    sessionId: sessionId || null,
  });
  if (!propertyDetail.success || !propertyDetail.data)
    return (
      <div className='flex flex-col items-center justify-center h-[80vh]'>
        <h1 className='text-4xl font-bold text-primary-main capitalize mb-2'>
          {propertyType} not found
        </h1>
        <p className=' text-neutral text-lg'>
          The property you are looking for does not exist.
        </p>
        <Link
          href='/'
          className=' bg-primary-main rounded-xl py-4 px-8 text-white mt-5 hover:bg-secondary-main transition-all duration-300'
        >
          Go back to home
        </Link>
      </div>
    );

  const {
    property: {
      images,
      listingDescription,
      listingTitle,
      listingPrice,
      address,
      scrapeContactInfo,
      latitude,
      longitude,
      id: propertyId,
      cityName,
      barangayName,
      propertyOwner,
    },
    isLiked: initialIsLiked,
  } = propertyDetail.data;
  const agent = {
    name: scrapeContactInfo?.agentName,
    whatsapp: scrapeContactInfo?.phoneNumber?.replace(/\D/g, '') || '',
    email: scrapeContactInfo?.email || '',
    isVerified: true,
    position: scrapeContactInfo?.agencyName || 'Real Estate Agent',
  };

  return (
    <div className='flex flex-col min-h-screen bg-white text-black my-10'>
      <Property
        propertyId={propertyId}
        userId={userId || ''}
        agent={agent}
        listingPrice={listingPrice}
        listingDescription={listingDescription}
        isPropertyLiked={initialIsLiked}
        listingTitle={listingTitle}
        address={address ? address : `${cityName}, ${barangayName}`}
        latitude={latitude}
        longitude={longitude}
        images={images}
        propertyDetail={propertyDetail.data}
        propertyOwnerId={propertyOwner?.id}
      />
    </div>
  );
}
