'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Stepper } from '@/components/listing/form/Stepper';
import { PropertyDetailsStep } from '@/components/listing/form/PropertyDetailsStep';
import {
  FormData,
  initialFormData,
  PropertyType,
  Step,
} from '@/components/listing/types';
import Image from 'next/image';
import { backgroundImage } from '@/lib/getBackgroundImage';
import { ResultsStep } from '@/components/listing/form/ResultsStep';
import HowListdValuate from '@/components/common/HowListdValuate';
import { ListingFormData } from '@/components/listing/form/Schema';

export default function ValuationDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ValuationDetailsContent />
    </Suspense>
  );
}

function ValuationDetailsContent() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<ListingFormData>({
    ...initialFormData,
    propertyType: (searchParams.get('type') as PropertyType) || 'Condominium',
  });
  const [step, setStep] = useState<Step>(0);

  useEffect(() => {
    const type = searchParams.get('type') as PropertyType;
    if (
      type &&
      ['condominium', 'warehouse', 'house and lot', 'land'].includes(
        type.toLowerCase()
      )
    ) {
      setFormData(prev => ({ ...prev, propertyType: type }));
    }
  }, [searchParams]);

  const handleChange = (field: keyof ListingFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Only one step for now
  const handleNext = () => setStep(s => (s < 3 ? ((s + 1) as Step) : s));
  const handleBack = () => setStep(s => (s > 0 ? ((s - 1) as Step) : s));
  const handleDraft = () => {
    // TODO: Save as draft logic
    alert('Draft saved!');
  };
  const handleHome = () => {
    // TODO: Redirect to home
    setStep(0);
  };

  return (
    <div className='container mx-auto relative mb-10 px-5 lg:px-0'>
      <Image
        src={backgroundImage(formData.propertyType)}
        alt='Background'
        width={1300}
        height={700}
        className='w-full h-[700px] rounded-3xl object-cover z-10'
      />
      <div className='max-w-[1000px] rounded-3xl shadow-lg border mx-auto p-5 lg:p-10 -mt-96 bg-white  relative z-20'>
        <Stepper
          step={step}
          onBack={handleBack}
          data={formData}
          onChange={handleChange}
        />
        {step === 0 && (
          <PropertyDetailsStep
            data={formData}
            onChange={handleChange}
            onNext={handleNext}
            onDraft={handleDraft}
          />
        )}
        {step === 1 && (
          <ResultsStep
            onHome={handleHome}
            propertyType={formData.propertyType}
          />
        )}
      </div>
      <HowListdValuate />
    </div>
  );
}
