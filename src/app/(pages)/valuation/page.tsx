'use client';
import { testimonialCards } from '@/app/data';
import Testimonial from '@/components/home/Testimonial';
import React, { useEffect, useState, Suspense } from 'react';
import FAQ from '@/components/common/FAQ';
import Image from 'next/image';
import { PropertyType } from '@/components/listing/types';
import { useSearchParams } from 'next/navigation';
import { backgroundImage } from '@/lib/getBackgroundImage';
import Advantages from '@/components/common/Advantages';
import ValuationHero from '@/components/valuation/ValuationHero';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ValuationContent />
    </Suspense>
  );
}

function ValuationContent() {
  const [propertyType, setPropertyType] = useState<PropertyType>('condominium');
  const searchParams = useSearchParams();

  // Update form data when URL parameter changes
  useEffect(() => {
    const type = searchParams.get('type') as PropertyType;
    if (
      type &&
      ['condominium', 'warehouse', 'house and lot', 'land'].includes(
        type.toLowerCase()
      )
    ) {
      setPropertyType(type);
    }
  }, [searchParams]);

  return (
    <div className='container mx-auto px-5 lg:px-0'>
      <Image
        src={backgroundImage(propertyType)}
        alt='Background'
        width={1300}
        height={700}
        className='w-full h-[700px] rounded-3xl object-cover z-10'
      />
      <ValuationHero />
      <Advantages />
      <FAQ />
      <Testimonial testimonialCards={testimonialCards} />
    </div>
  );
}
