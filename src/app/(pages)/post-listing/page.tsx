'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Stepper } from '@/components/listing/form/Stepper';
import { PropertyDetailsStep } from '@/components/listing/form/PropertyDetailsStep';
import { TitleDescriptionStep } from '@/components/listing/form/TitleDescriptionStep';
import { PaymentStep } from '@/components/listing/form/PaymentStep';
import { ResultsStep } from '@/components/listing/form/ResultsStep';
import {
  Step,
  FormData,
  initialFormData,
  PropertyType,
} from '@/components/listing/types';

import Image from 'next/image';
import { backgroundImage } from '@/lib/getBackgroundImage';

export default function PostListingMultiStep() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostListingContent />
    </Suspense>
  );
}

function PostListingContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>(0);
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    propertyType: (searchParams.get('type') as PropertyType) || 'Condominium',
  });

  const handleChange = (field: keyof FormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep((s) => (s < 3 ? ((s + 1) as Step) : s));
  const handleBack = () => setStep((s) => (s > 0 ? ((s - 1) as Step) : s));
  const handleDraft = () => {
    // TODO: Save as draft logic
    alert('Draft saved!');
  };
  const handleHome = () => {
    // TODO: Redirect to home
    setStep(0);
  };

  // Update form data when URL parameter changes
  useEffect(() => {
    const type = searchParams.get('type') as PropertyType;
    if (
      type &&
      ['condominium', 'warehouse', 'house and lot', 'land'].includes(
        type.toLowerCase()
      )
    ) {
      setFormData((prev) => ({ ...prev, propertyType: type }));
    }
  }, [searchParams]);

  return (
    <div className='container mx-auto relative mb-10 px-5 lg:px-0'>
      <Image
        src={backgroundImage(formData.propertyType)}
        alt='Background'
        width={1300}
        height={700}
        className='w-full h-[700px] rounded-3xl object-cover z-10'
      />
      <div className='max-w-[1000px] shadow-lg rounded-3xl border mx-auto p-5 lg:p-10 -mt-96 bg-white  relative z-20'>
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
          <TitleDescriptionStep
            data={formData}
            onChange={handleChange}
            onNext={handleNext}
            onDraft={handleDraft}
          />
        )}
        {step === 2 && (
          <PaymentStep
            data={formData}
            onChange={handleChange}
            onNext={handleNext}
            onBack={handleBack}
            onDraft={handleDraft}
          />
        )}
        {step === 3 && (
          <ResultsStep
            onHome={handleHome}
            propertyType={formData.propertyType}
          />
        )}
      </div>
    </div>
  );
}
