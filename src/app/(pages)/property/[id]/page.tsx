import { notFound } from 'next/navigation';
import { properties } from '@/app/data';
import pinIcon from '../../../../../public/images/icons/pin.svg';
import { PropertyHeader } from '@/components/listing/PropertyHeader';
import PropertyFeatures from '@/components/listing/PropertyFeatures';
import PropertyDescription from '@/components/listing/PropertyDescription';
import { AgentCard } from '@/components/listing/AgentCard';
// import { PropertyImages } from '@/components/listing/PropertyImages';
import PropertyLocation from '@/components/listing/PropertyLocation';
import { getPropertyById, SearchParams } from '@/lib/queries/server/propety';
import { PropertyImages } from '@/components/listing/PropertyImages';

export default async function PropertyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ property: SearchParams['property'] }>;
}) {
  const resolvedParams = await params;
  const {property: propertyType} = await searchParams;
  console.log({resolvedParams, propertyType});

  const propertyDetail = await getPropertyById({ property: propertyType, id: resolvedParams.id });
  console.log({propertyDetail});
  if (!propertyDetail) return notFound();

  const {
    property: {
      images,
      listingDescription,
      listingDescriptionMarkdown,
      listingTitle,
      listingPrice,
      address,
      scrapeContactInfo,
    },
    id,
    numberOfBathrooms,
    numberOfBedrooms,
    floorArea,
  } = propertyDetail;

  return (
    <div className='flex flex-col min-h-screen bg-white text-black my-10'>
      <div className='container mx-auto px-5 lg:px-0 max-w-[1300px]'>
        <div>
          <PropertyImages images={images} title={listingTitle} />
          <div className='grid grid-cols-1 lg:grid-cols-3 md:gap-6 mt-10'>
            <div className='col-span-2'>
              {/* Property Header */}
              <PropertyHeader
                price={listingPrice}
                title={listingTitle}
                isVerified={!!scrapeContactInfo.agentName}
                location={address}
                pinIcon={pinIcon}
              />
              {/* Features */}
              {/* <PropertyFeatures features={features} /> */}
              {/* Description */}
              <PropertyDescription
                description={listingDescription}
                details={listingDescriptionMarkdown}
              />
              {/* <PropertyLocation googleMap={googleMap} /> */}
            </div>
            {/* Right Column - Agent Card */}
            <div className='lg:col-span-1'>
              {/* <AgentCard agent={agent} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
