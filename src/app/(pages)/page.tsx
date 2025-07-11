import React, { Suspense } from 'react';
import Hero from '@/components/home/Hero';
import ValuationCards from '@/components/home/ValuationCards';
import { valuationCards } from '../data';
import FeatureCards, { FeatureCardData } from '@/components/home/FeatureCards';
import { featureCards, testimonialCards } from '../data';
import PropertySlider from '@/components/home/PropertySlider';
import Testimonial from '@/components/home/Testimonial';
import DownloadSection from '@/components/home/DownloadSection';
import { getListingTypes, getPropertyTypes } from '@/lib/queries/server/home';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export const dynamic = 'force-dynamic';

export default async function page() {
  const [listingTypes, propertyTypes] = await Promise.all([
    getListingTypes(),
    getPropertyTypes(),
  ]);

  return (
    <div>
      <Suspense
        fallback={
          <div className='flex items-center justify-center'>
            <LoadingSpinner size='lg' />
          </div>
        }
      >
        <Hero listingTypes={listingTypes} propertyTypes={propertyTypes} />
        <PropertySlider />

        <ValuationCards cards={valuationCards} />
        <FeatureCards cards={featureCards as FeatureCardData[]} />
        <Testimonial testimonialCards={testimonialCards} />
        <DownloadSection />
      </Suspense>
    </div>
  );
}
