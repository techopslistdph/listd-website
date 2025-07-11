import { FormInput } from '@/components/ui/form-input';

export function AddressFields() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
      <FormInput
        name='state'
        label='State/Region'
        placeholder='Enter your region'
      />
      <FormInput name='city' label='City' placeholder='Enter your city' />
      <FormInput
        name='barangay'
        label='Barangay'
        placeholder='Enter your barangay'
      />
      <FormInput
        name='street'
        label='Street Address'
        placeholder='Enter your street address'
      />
    </div>
  );
}
