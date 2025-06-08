import React, { Suspense } from 'react';
import Hero from '@/components/home/Hero';
import ValuationCards from '@/components/home/ValuationCards';
import { propertySliderCards, valuationCards } from '../data';
import FeatureCards, { FeatureCardData } from '@/components/home/FeatureCards';
import { featureCards, testimonialCards } from '../data';
import PropertySlider, {
  PropertySliderCard,
} from '@/components/home/PropertySlider';
import Testimonial from '@/components/home/Testimonial';
import DownloadSection from '@/components/home/DownloadSection';
import { getListingTypes, getPropertyTypes } from '@/lib/queries/server/home';

export default async function page() {
  const [listingTypes, propertyTypes] = await Promise.all([
    getListingTypes(),
    getPropertyTypes(),
  ]);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Hero listingTypes={listingTypes} propertyTypes={propertyTypes} />
        <PropertySlider
          propertySliderCards={
            propertySliderCards as unknown as PropertySliderCard[]
          }
        />
        <ValuationCards cards={valuationCards} />
        <FeatureCards cards={featureCards as FeatureCardData[]} />
        <Testimonial testimonialCards={testimonialCards} />
        <DownloadSection />
      </Suspense>
    </div>
  );
}
