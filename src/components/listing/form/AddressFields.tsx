import { FormData } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddressFieldsProps {
  data: FormData;
  onChange: (field: keyof FormData, value: unknown) => void;
}

export function AddressFields({ data, onChange }: AddressFieldsProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
      <div className='space-y-4'>
        <Label>State/Region</Label>
        <Input
          placeholder='Enter your region'
          value={data.state}
          onChange={e => onChange('state', e.target.value)}
        />
      </div>
      <div className='space-y-4'>
        <Label>City</Label>
        <Input
          placeholder='Enter your city'
          value={data.city}
          onChange={e => onChange('city', e.target.value)}
        />
      </div>
      <div className='space-y-4'>
        <Label>Barangay</Label>
        <Input
          placeholder='Enter your barangay'
          value={data.barangay}
          onChange={e => onChange('barangay', e.target.value)}
        />
      </div>
      <div className='space-y-4'>
        <Label>Street Address</Label>
        <Input
          placeholder='Enter your street address'
          value={data.street}
          onChange={e => onChange('street', e.target.value)}
        />
      </div>
      <div className='space-y-4'>
        <Label>ZIP Code</Label>
        <Input
          placeholder='ZIP Code'
          value={data.zipCode}
          onChange={e => onChange('zipCode', e.target.value)}
        />
      </div>
    </div>
  );
}
