'use client';

import { useState, useEffect } from 'react';
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
import condominium from '@/../public/images/condominium-bg.png';
import warehouse from '@/../public/images/warehouse-bg.png';
import houseAndLot from '@/../public/images/house-and-lot-bg.png';
import land from '@/../public/images/land-bg.png';

import Image from 'next/image';

export default function PostListingMultiStep() {
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

  const backgroundImage = () => {
    if (formData.propertyType.toLowerCase() === 'condominium') {
      return condominium;
    }
    if (formData.propertyType.toLowerCase() === 'warehouse') {
      return warehouse;
    }
    if (formData.propertyType.toLowerCase() === 'house and lot') {
      return houseAndLot;
    }
    if (formData.propertyType.toLowerCase() === 'land') {
      return land;
    }

    return condominium; // fallback
  };

  return (
    <div className='container mx-auto relative mb-10'>
      <Image
        src={backgroundImage()}
        alt='Background'
        width={1300}
        height={700}
        className='w-full h-[700px] rounded-3xl object-cover z-10'
      />
      <div className='max-w-[1000px] rounded-3xl border mx-auto p-10 -mt-96 bg-white  relative z-20'>
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
