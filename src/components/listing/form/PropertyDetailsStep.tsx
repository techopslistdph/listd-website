import { FormData } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '../../ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { AddressFields } from './AddressFields';
import { ActionButtons } from './ActionButtons';
import { ImageUpload } from './ImageUpload';
import { TagInput } from './TagInput';
import { usePathname } from 'next/navigation';

interface PropertyDetailsStepProps {
  data: FormData;
  onChange: (field: keyof FormData, value: unknown) => void;
  onNext: () => void;
  onDraft: () => void;
}

const FormField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className='space-y-4'>
    <Label>{label}</Label>
    {children}
  </div>
);

export function PropertyDetailsStep({
  data,
  onChange,
  onNext,
  onDraft,
}: PropertyDetailsStepProps) {
  const propertyType = data.propertyType.toLowerCase();
  const pathname = usePathname();

  const renderPropertySpecificFields = () => {
    switch (propertyType) {
      case 'warehouse':
        return (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
              <FormField label='Lot size'>
                <Input
                  placeholder='Enter lot size'
                  value={data.lotSize}
                  onChange={(e) => onChange('lotSize', e.target.value)}
                />
              </FormField>
              <FormField label='Floor area'>
                <Input
                  placeholder='Enter floor area'
                  value={data.floorArea}
                  onChange={(e) => onChange('floorArea', e.target.value)}
                />
              </FormField>
              <FormField label='Ceiling Height'>
                <Input
                  placeholder='Enter ceiling height'
                  value={data.ceilingHeight}
                  onChange={(e) => onChange('ceilingHeight', e.target.value)}
                />
              </FormField>
              <FormField label='Parking'>
                <Input
                  type='number'
                  placeholder='0'
                  value={data.parking}
                  onChange={(e) => onChange('parking', Number(e.target.value))}
                />
              </FormField>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <TagInput
                label='Warehouse'
                value={data.amenities}
                onChange={(value) => onChange('amenities', value)}
                placeholder='Business District, Nearby School...'
              />
              <TagInput
                label='Security'
                value={data.security}
                onChange={(value) => onChange('security', value)}
                placeholder='Smoke Alarm, Fire Extinguisher...'
              />
            </div>
          </>
        );

      case 'house and lot':
        return (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
              <FormField label='Number of floors'>
                <Input
                  placeholder='Enter floor number'
                  value={data.floorNo}
                  onChange={(e) => onChange('floorNo', e.target.value)}
                />
              </FormField>
              <FormField label='Floor area'>
                <Input
                  placeholder='Enter floor area'
                  value={data.floorArea}
                  onChange={(e) => onChange('floorArea', e.target.value)}
                />
              </FormField>
              <FormField label='Fully Furnished'>
                <Select
                  value={data.fullyFurnished ? 'yes' : 'no'}
                  onValueChange={(value) =>
                    onChange('fullyFurnished', value === 'yes')
                  }
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select furnishing' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='no'>Not Furnished</SelectItem>
                    <SelectItem value='yes'>Fully Furnished</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label='Bedrooms'>
                <Input
                  type='number'
                  placeholder='0'
                  value={data.bedrooms}
                  onChange={(e) => onChange('bedrooms', Number(e.target.value))}
                />
              </FormField>
              <FormField label='Bathrooms'>
                <Input
                  type='number'
                  placeholder='0'
                  value={data.bathrooms}
                  onChange={(e) =>
                    onChange('bathrooms', Number(e.target.value))
                  }
                />
              </FormField>
              <FormField label='Parking'>
                <Input
                  type='number'
                  placeholder='0'
                  value={data.parking}
                  onChange={(e) => onChange('parking', Number(e.target.value))}
                />
              </FormField>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <TagInput
                label='Amenities'
                value={data.amenities}
                onChange={(value) => onChange('amenities', value)}
                placeholder='Add amenity and press Enter'
              />
              <TagInput
                label='Features'
                value={data.features}
                onChange={(value) => onChange('features', value)}
                placeholder='Add feature and press Enter'
              />
            </div>
          </>
        );

      case 'land':
        return (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
              <TagInput
                label='Lot Type'
                value={data.lotType}
                onChange={(value) => onChange('lotType', value)}
                placeholder='Business District, Nearby School...'
              />
              <FormField label='Lot size'>
                <Input
                  placeholder='Enter sqm'
                  value={data.lotSize}
                  onChange={(e) => onChange('lotSize', e.target.value)}
                />
              </FormField>
              <FormField label='Parking'>
                <Input
                  type='number'
                  placeholder='0'
                  value={data.parking}
                  onChange={(e) => onChange('parking', Number(e.target.value))}
                />
              </FormField>
            </div>
          </>
        );

      default: // Condominium
        return (
          <>
            <div className='mb-6 space-y-4'>
              <FormField label='Building Name'>
                <Input
                  placeholder='Enter building name'
                  value={data.buildingName}
                  onChange={(e) => onChange('buildingName', e.target.value)}
                />
              </FormField>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
              <FormField label='Floor No.'>
                <Input
                  placeholder='Enter floor no'
                  value={data.floorNo}
                  onChange={(e) => onChange('floorNo', e.target.value)}
                />
              </FormField>
              <FormField label='Floor Area'>
                <Input
                  placeholder='Enter your sqm'
                  value={data.floorArea}
                  onChange={(e) => onChange('floorArea', e.target.value)}
                />
              </FormField>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
              <FormField label='Furnished'>
                <Select
                  value={data.fullyFurnished ? 'yes' : 'no'}
                  onValueChange={(value) =>
                    onChange('fullyFurnished', value === 'yes')
                  }
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select furnishing' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='no'>Not Furnished</SelectItem>
                    <SelectItem value='yes'>Fully Furnished</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label='Bedrooms'>
                <Input
                  type='number'
                  placeholder='0'
                  value={data.bedrooms}
                  onChange={(e) => onChange('bedrooms', Number(e.target.value))}
                />
              </FormField>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <FormField label='Bathrooms'>
                <Input
                  type='number'
                  placeholder='0'
                  value={data.bathrooms}
                  onChange={(e) =>
                    onChange('bathrooms', Number(e.target.value))
                  }
                />
              </FormField>
              <FormField label='Parking'>
                <Input
                  type='number'
                  placeholder='0'
                  value={data.parking}
                  onChange={(e) => onChange('parking', Number(e.target.value))}
                />
              </FormField>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <TagInput
                label='Amenities'
                value={data.amenities}
                onChange={(value) => onChange('amenities', value)}
                placeholder='Add amenity and press Enter'
              />
              <TagInput
                label='Features'
                value={data.features}
                onChange={(value) => onChange('features', value)}
                placeholder='Add feature and press Enter'
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className='bg-white'>
      <h2 className='heading-5 mb-4'>Confirm your address</h2>
      <AddressFields data={data} onChange={onChange} />
      <h2 className='heading-5 mb-6'>Details about your place</h2>
      {renderPropertySpecificFields()}
      {!pathname.includes('/valuation') && (
        <>
          <h2 className='heading-5 mb-5'>Property Photo</h2>
          <ImageUpload onChange={(files) => onChange('images', files)} />
        </>
      )}
      <ActionButtons onDraft={onDraft} onNext={onNext} />
    </div>
  );
}
