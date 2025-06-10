import { notFound } from 'next/navigation';
import pinIcon from '../../../../../public/images/icons/pin.svg';
import { PropertyHeader } from '@/components/listing/PropertyHeader';
import PropertyFeatures from '@/components/listing/PropertyFeatures';
import PropertyDescription from '@/components/listing/PropertyDescription';
import { getPropertyById, SearchParams } from '@/lib/queries/server/propety';
import { PropertyImages } from '@/components/listing/PropertyImages';
import { processPropertyDetails } from '@/utils/property';
import { AgentCard } from '@/components/listing/AgentCard';
import { PropertyMap } from '@/components/listing/PropertyMap';

export default async function PropertyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ property: SearchParams['property'] }>;
}) {
  const resolvedParams = await params;
  const { property: propertyType } = await searchParams;

  const propertyDetail = await getPropertyById({
    property: propertyType,
    id: resolvedParams.id,
  });
  if (!propertyDetail) return notFound();

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
    },
  } = propertyDetail;

  const { features, details } = processPropertyDetails(propertyDetail);

  const agent = {
    name: scrapeContactInfo?.agentName,
    whatsapp: scrapeContactInfo?.phoneNumber?.replace(/\D/g, ''),
    email: scrapeContactInfo?.email,
    isVerified: true,
    position: scrapeContactInfo?.agencyName || 'Real Estate Agent',
  };

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
              {features.length > 0 && <PropertyFeatures features={features} />}
              {/* Description */}
              <PropertyDescription
                description={listingDescription}
                details={details}
              />
              {/* Map */}
              {latitude && longitude && (
                <PropertyMap
                  latitude={latitude}
                  longitude={longitude}
                  title={listingTitle}
                />
              )}
            </div>
            {/* Right Column - Agent Card */}
            <div className='lg:col-span-1'>
              <AgentCard agent={agent} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
