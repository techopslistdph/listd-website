import { ActionButtons } from './ActionButtons';
import { UseFormReturn } from 'react-hook-form';
import { FormInput } from '@/components/ui/form-input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SparkleIcon } from 'lucide-react';
import { ListingFormData } from './Schema';

interface TitleDescriptionStepProps {
  onChange: (field: keyof ListingFormData, value: unknown) => void;
  onNext: () => void;
  onDraft: () => void;
  form: UseFormReturn<ListingFormData>;
  isSubmitting: boolean;
}

export function TitleDescriptionStep({
  onNext,
  onDraft,
  form,
  isSubmitting,
}: TitleDescriptionStepProps) {
  return (
    <div className='bg-white'>
      <h2 className='heading-5 mb-6'>Title and Description</h2>
      <div className='space-y-6'>
        <FormInput name='title' label='Title' placeholder='Enter your title' />
        <div className='space-y-4'>
          <Label>Description</Label>
          <Textarea
            placeholder='Tell us what makes your place special!'
            {...form.register('description')}
            className='min-h-[200px]'
          />
          <div className='text-neutral-mid flex gap-1 items-center'>
            <SparkleIcon className='w-5 h-5' />
            <p>Type a description to see AI suggestions</p>
          </div>
        </div>
      </div>
      <ActionButtons
        onDraft={onDraft}
        onNext={onNext}
        isLoading={isSubmitting}
      />
    </div>
  );
}
