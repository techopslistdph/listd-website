/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Stepper } from '@/components/listing/form/Stepper';
import { PropertyDetailsStep } from '@/components/listing/form/PropertyDetailsStep';
import { TitleDescriptionStep } from '@/components/listing/form/TitleDescriptionStep';
import { PaymentStep } from '@/components/listing/form/PaymentStep';
import { ResultsStep } from '@/components/listing/form/ResultsStep';
import {
  Step,
  initialFormData,
  PropertyType,
} from '@/components/listing/types';
import Image from 'next/image';
import { backgroundImage } from '@/lib/getBackgroundImage';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { listingFormSchema, ListingFormData } from './Schema';
import { usePathname, useRouter } from 'next/navigation';
import { getFieldsToValidate } from './validation';
import { useListingSubmission } from '@/hooks/useListingSubmission';
import { toast } from 'sonner';
import {
  buildPropertyPrompt,
  validateRequiredFields,
} from '@/utils/propertyPrompBuilder';
import { useAiValuate } from '@/lib/queries/hooks/use-ai-generate';
import { AiValuation } from '@/lib/queries/hooks/types/ai-generate';
import { useUser } from '@clerk/nextjs';

interface PostListingFormProps {
  propertyTypes: Array<{
    id: string;
    name: string;
    disabled: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  listingTypes: Array<{
    id: string;
    name: string;
    disabled: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  features: Array<{
    id: string;
    name: string;
  }>;
  amenities: Array<{
    id: string;
    name: string;
  }>;
}

export default function PostListingForm({
  propertyTypes,
  listingTypes,
  features,
  amenities,
}: PostListingFormProps) {
  const { user } = useUser();
  const [step, setStep] = useState<Step>(0);
  const router = useRouter();
  const pathname = usePathname();
  const isValuation = pathname.includes('valuation');
  const [valuationResponse, setValuationResponse] = useState<AiValuation>();

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      ...initialFormData,
      propertyType: propertyTypes[0].name,
      propertyTypeId: propertyTypes[0].id,
      listingTypeId: listingTypes[0].id,
      listingType: listingTypes[0].name,
      features: [],
      amenities: [],
      nearbyLocations: [],
      security: [],
    } as ListingFormData,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const handleNext = async () => {
    const propertyType = form.getValues('propertyType');
    const fieldsToValidate = getFieldsToValidate(
      step,
      propertyType,
      isValuation
    );
    const isValid = await form.trigger(fieldsToValidate as any);

    if (!isValid) {
      console.log('Form Errors:', form.formState.errors);
    } else {
      const nextStep = step < 3 ? ((step + 1) as Step) : step;
      setStep(nextStep);
    }
  };
  const { handleSubmit, isSubmitting } = useListingSubmission(
    form.getValues(),
    handleNext
  );

  const handleBack = () => {
    if (step === 0) {
      router.back();
    } else {
      setStep(s => (s > 0 ? ((s - 1) as Step) : s));
    }
  };

  const handleDraft = () => {
    handleSubmit(true);
    toast.success('Listing saved as draft');
    setTimeout(() => {
      form.reset();
      router.push('/');
    }, 1000);
  };

  const handleHome = () => {
    router.push('/');
  };

  const handleChange = (field: string, value: unknown) => {
    if (
      typeof value === 'string' ||
      typeof value === 'boolean' ||
      Array.isArray(value)
    ) {
      form.setValue(field as keyof ListingFormData, value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };
  const { mutate: valuate, isPending } = useAiValuate();

  const generateAiContent = () => {
    const formData = form.getValues();

    const validation = validateRequiredFields(formData);
    if (!validation.isValid) {
      return toast.error(validation.message);
    }

    const prompt = buildPropertyPrompt(formData, 'valuation_generation');

    valuate(
      { prompt, userId: user?.id || '' },
      {
        onSuccess: data => {
          if (data.success) {
            if (data.data) {
              setValuationResponse(data.data as unknown as AiValuation);
              setStep((step + 1) as Step);
            }
          } else {
            toast.error(data.message || 'Failed to generate title');
          }
        },
        onError: error => {
          toast.error(
            error.message || 'Failed to generate content. Please try again.'
          );
        },
      }
    );
  };

  return (
    <FormProvider {...form}>
      <div className='container mx-auto relative mb-10 px-5 lg:px-0 max-w-[1300px]'>
        <Image
          src={backgroundImage(form.watch('propertyType'))}
          alt='Background'
          width={1300}
          height={700}
          className='w-full h-[700px] rounded-3xl object-cover z-10'
        />
        <div className='max-w-[1000px] shadow-lg rounded-3xl border mx-auto p-5 lg:p-10 -mt-96 bg-white relative z-20'>
          <Stepper
            form={form}
            step={step}
            onBack={handleBack}
            onChange={handleChange}
            listingTypes={listingTypes}
          />
          {step === 0 && (
            <PropertyDetailsStep
              listingTypes={listingTypes}
              form={form}
              onChange={handleChange}
              onNext={isValuation ? generateAiContent : handleNext}
              propertyTypes={propertyTypes}
              onDraft={handleDraft}
              features={features}
              amenities={amenities}
              isLoading={isValuation ? isPending : false}
            />
          )}
          {step === 1 && !isValuation && (
            <TitleDescriptionStep
              form={form}
              onChange={handleChange}
              onNext={handleNext}
              onDraft={handleDraft}
              isSubmitting={isSubmitting}
            />
          )}
          {step === 2 && !isValuation && (
            <PaymentStep
              form={form}
              onChange={handleChange}
              onNext={handleNext}
              onBack={handleBack}
              onDraft={handleDraft}
              handleSubmit={() => handleSubmit(false)}
              isSubmitting={isSubmitting}
            />
          )}
          {(isValuation ? step === 1 : step === 3) && (
            <ResultsStep
              onHome={handleHome}
              valuationResult={valuationResponse}
              userId={user?.id || ''}
              propertyType={form.getValues('propertyType') as PropertyType}
            />
          )}
        </div>
      </div>
    </FormProvider>
  );
}
