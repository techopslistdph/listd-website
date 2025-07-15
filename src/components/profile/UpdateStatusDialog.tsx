import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { PropertyDetail } from '@/lib/queries/server/propety/type';
import { PropertySpecificFields } from '../listing/form/PropertySpecificFields';
import { FormProvider, useForm } from 'react-hook-form';
import { ListingFormData, listingFormSchema } from '../listing/form/Schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { FeatureAndAmenity } from './my-listing';
import { TitleDescriptionStep } from '../listing/form/TitleDescriptionStep';
import { PaymentStep } from '../listing/form/PaymentStep';
import { ImageUpload } from '../listing/form/ImageUpload';
import { transformPropertyData } from '@/lib/utils/transformPropertyData';
import { useListingSubmission } from '@/hooks/useListingSubmission';

interface UpdateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: PropertyDetail | null;
  isValuation?: boolean;
  features: FeatureAndAmenity;
  amenities: FeatureAndAmenity;
}

const UpdateStatusDialog: React.FC<UpdateStatusDialogProps> = ({
  open,
  onOpenChange,
  property,
  isValuation = false,
  features,
  amenities,
}) => {
  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {} as ListingFormData,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  React.useEffect(() => {
    if (property) {
      const transformedData = transformPropertyData(property);
      form.reset(transformedData);
    }
  }, [property, form]);

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

  const handleNext = () => {
    onOpenChange(false);
  };

  const { handleSubmit, isSubmitting } = useListingSubmission(
    form.getValues(),
    handleNext
  );

  if (!property) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-[90vw] lg:min-w-5xl w-full p-4 lg:p-8 overflow-y-auto max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle className='text-lg lg:text-xl border-b border-neutral-mid/40 pb-4'>
            {isValuation
              ? 'Update Valuation Details'
              : property.property?.listingTitle || 'Update Property Details'}
          </DialogTitle>
        </DialogHeader>
        <div>
          <FormProvider {...form}>
            <div className='flex flex-col gap-4'>
              <PropertySpecificFields
                form={form}
                onChange={handleChange}
                features={features}
                amenities={amenities}
                nearbyLocations={[]}
              />
              <>
                <h2 className='heading-5 mb-5'>Property Photo</h2>
                <ImageUpload
                  onChange={files => handleChange('images', files)}
                  value={form.getValues('images')}
                  error={form.formState.errors.images?.message}
                />
              </>
              <TitleDescriptionStep
                form={form}
                onChange={handleChange}
                onNext={() => {}}
                onDraft={() => {}}
                isSubmitting={false}
                isEditing={true}
              />
              <PaymentStep
                form={form}
                onChange={handleChange}
                onNext={() => {}}
                onDraft={() => {}}
                isSubmitting={false}
                onBack={() => {}}
                handleSubmit={() => {}}
                isEditing={true}
              />
            </div>
          </FormProvider>
        </div>

        <div className='flex flex-col lg:flex-row justify-end gap-2 lg:gap-4 mt-6 lg:mt-8'>
          <Button
            variant='outline'
            className='rounded-full py-3 lg:py-5 px-4 lg:px-8 w-full lg:w-44 border-primary-main text-primary-main hover:bg-white cursor-pointer text-sm lg:text-base'
            type='button'
            onClick={() => onOpenChange(false)}
          >
            Discard
          </Button>
          <Button
            type='button'
            className='rounded-full py-3 lg:py-5 px-4 lg:px-8 w-full lg:w-44 bg-primary-main text-white hover:bg-primary-main border border-primary-main cursor-pointer text-sm lg:text-base'
            onClick={() => handleSubmit(false, true, property.id)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusDialog;
