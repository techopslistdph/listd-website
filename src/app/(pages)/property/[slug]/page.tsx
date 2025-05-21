import { notFound } from 'next/navigation';
import { properties } from '@/app/data';
import pinIcon from '../../../../../public/images/icons/pin.svg';
import { PropertyHeader } from '@/components/listing/PropertyHeader';
import PropertyFeatures from '@/components/listing/PropertyFeatures';
import PropertyDescription from '@/components/listing/PropertyDescription';
import { AgentCard } from '@/components/listing/AgentCard';
import { PropertyImages } from '@/components/listing/PropertyImages';
import PropertyLocation from '@/components/listing/PropertyLocation';

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  const property = properties.find((p) => p.slug === resolvedParams.slug!);
  if (!property) return notFound();

  const {
    images,
    price,
    title,
    isVerified,
    location,
    features,
    description,
    descriptionText,
    agent,
    googleMap,
  } = property;

  return (
    <div className='flex flex-col min-h-screen bg-white text-black my-10'>
      <div className='container mx-auto px-5 lg:px-0 max-w-[1300px]'>
        <div>
          <PropertyImages images={images} title={title} />
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10'>
            <div className='col-span-2'>
              {/* Property Header */}
              <PropertyHeader
                price={price}
                title={title}
                isVerified={isVerified}
                location={location}
                pinIcon={pinIcon}
              />
              {/* Features */}
              <PropertyFeatures features={features} />
              {/* Description */}
              <PropertyDescription
                description={descriptionText}
                details={description}
              />
              <PropertyLocation googleMap={googleMap} />
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
