import freelistingIcon from '@/../public/images/icons/freelisting.svg';
import packagenameIcon from '@/../public/images/icons/packagename.svg';
import Image from 'next/image';
import { ActionButtons } from './ActionButtons';

import { UseFormReturn } from 'react-hook-form';
import { ListingFormData } from './Schema';
import { FormInput } from '@/components/ui/form-input';

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
  onChange: (field: keyof ListingFormData, value: unknown) => void;
  onDraft: () => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  form: UseFormReturn<ListingFormData>;
  isEditing?: boolean;
}

export function PaymentStep({
  onBack,
  onChange,
  form,
  handleSubmit,
  onDraft,
  isSubmitting,
  isEditing = false,
}: PaymentStepProps) {
  return (
    <div className='bg-white'>
      <h2 className='heading-5 mb-4'>Payment Packages</h2>
      <div className='mb-6'>
        <div
          className={`border rounded-lg p-4 mb-2 flex items-center gap-4 cursor-pointer ${
            form.getValues('package') === 'free'
              ? 'border-primary-mid'
              : 'border-gray-200'
          }`}
          onClick={() => {
            onChange('package', 'free');
          }}
        >
          <Image src={freelistingIcon} alt='freelisting' />
          <div>
            <div className='font-bold text-neutral-text'>
              First 2 listings are{' '}
              <span className='text-primary-mid'>FREE!</span>
            </div>
            <div className='text-xs text-gray-500'>
              Click here to see our packages and rates
            </div>
          </div>
        </div>

        {/* disable this because there's no payment integration yet */}
        <div
          className={`border rounded-lg p-4 flex items-center gap-4 cursor-not-allowed ${
            form.getValues('package') === 'paid'
              ? 'border-primary-mid'
              : 'border-gray-200'
          }`}
          // onClick={() => {
          //   onChange('package', 'paid');
          // }}
        >
          <Image src={packagenameIcon} alt='package name icon' />
          <div>
            <div className='font-bold'>Package name</div>
            <div className='text-xs text-gray-500'>$20.00/month</div>
          </div>
        </div>
      </div>
      {/* Only show period selection if package is not free */}
      {form.getValues('package') !== 'free' && (
        <>
          <h3 className='font-bold mb-2'>Choose a period for your property</h3>
          <div className='mb-6 flex flex-col gap-4'>
            {['5', '15', '45'].map(days => (
              <div
                key={days}
                className={`border rounded-lg p-4 flex items-center shadow-lg shadow-primary-main/10 justify-between cursor-pointer ${
                  form.getValues('period') === days
                    ? 'border-primary-mid'
                    : 'border-transparent'
                }`}
                onClick={() => onChange('period', days)}
              >
                <div>
                  <div className='font-bold'>{days} Days</div>
                  <div className='text-xs text-neutral-mid'>Until 00/00</div>
                </div>
                <div className='flex flex-col items-end'>
                  <div>PHP</div>
                  <div className='text-xs text-neutral-mid'>PHP / day</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <h2 className='heading-5 mb-5'>Terms</h2>
      <div className='mb-4'>
        <div className='space-y-4'>
          <FormInput
            name='grossAskingPrice'
            label='Gross Asking Price'
            placeholder='PHP'
          />
        </div>
      </div>
      {!isEditing && (
        <ActionButtons
          onDraft={onDraft}
          onNext={handleSubmit}
          onBack={onBack}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}
