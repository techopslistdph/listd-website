import React from 'react';
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
export default function page() {
  return (
    <div>
      <Hero />
      <ValuationCards cards={valuationCards} />
      <FeatureCards cards={featureCards as FeatureCardData[]} />
      <PropertySlider
        propertySliderCards={
          propertySliderCards as unknown as PropertySliderCard[]
        }
      />

      <Testimonial testimonialCards={testimonialCards} />
      <DownloadSection />
    </div>
  );
}
