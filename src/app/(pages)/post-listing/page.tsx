'use client';

import { useState } from 'react';
import { Stepper } from '@/components/listing/Stepper';
import { PropertyDetailsStep } from '@/components/listing/PropertyDetailsStep';
import { TitleDescriptionStep } from '@/components/listing/TitleDescriptionStep';
import { PaymentStep } from '@/components/listing/PaymentStep';
import { ResultsStep } from '@/components/listing/ResultsStep';
import { Step, FormData, initialFormData } from '@/components/listing/types';
import backgroundImage from '@/../public/sample-background.png';
import Image from 'next/image';
export default function PostListingMultiStep() {
  const [step, setStep] = useState<Step>(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);

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
    alert('Back to Home');
  };

  return (
    <div className='container mx-auto relative mb-10'>
      <Image
        src={backgroundImage}
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
        {step === 3 && <ResultsStep onHome={handleHome} />}
      </div>
    </div>
  );
}
