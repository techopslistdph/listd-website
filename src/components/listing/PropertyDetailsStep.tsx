import { FormData } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface PropertyDetailsStepProps {
  data: FormData;
  onChange: (field: keyof FormData, value: unknown) => void;
  onNext: () => void;
  onDraft: () => void;
}

export function PropertyDetailsStep({
  data,
  onChange,
  onNext,
  onDraft,
}: PropertyDetailsStepProps) {
  return (
    <div className='bg-white'>
      <h2 className='heading-5 mb-4'>
        Confirm and complete your Property Address
      </h2>
      <div className='mb-6 space-y-4'>
        <Label>Building Name</Label>
        <Input
          placeholder='Enter building name'
          value={data.buildingName}
          onChange={(e) => onChange('buildingName', e.target.value)}
        />
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-4'>
            <Label>Region</Label>
            <Input
              placeholder='Enter your region'
              value={data.state}
              onChange={(e) => onChange('state', e.target.value)}
            />
          </div>
          <div className='space-y-4'>
            <Label>City</Label>
            <Input
              placeholder='Enter your city'
              value={data.city}
              onChange={(e) => onChange('city', e.target.value)}
            />
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-4'>
            <Label>Barangay</Label>
            <Input
              placeholder='Enter your barangay'
              value={data.barangay}
              onChange={(e) => onChange('barangay', e.target.value)}
            />
          </div>
          <div className='space-y-4'>
            <Label>Street Address</Label>
            <Input
              placeholder='Enter your street address'
              value={data.street}
              onChange={(e) => onChange('street', e.target.value)}
            />
          </div>
        </div>
      </div>
      <h2 className='heading-5 mb-6'>Details about your place</h2>{' '}
      <div className='grid grid-cols-2 gap-4 mb-6'>
        <div className='space-y-4'>
          <Label>Floor No.</Label>
          <Input
            placeholder='Enter floor no'
            value={data.floorNo}
            onChange={(e) => onChange('floorNo', e.target.value)}
          />
        </div>
        <div className='space-y-4'>
          <Label>Floor Area</Label>
          <Input
            placeholder='Enter your sqm'
            value={data.floorArea}
            onChange={(e) => onChange('floorArea', e.target.value)}
          />
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4 mb-6'>
        <div className='space-y-4'>
          <Label>Furnished</Label>
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
        </div>
        <div className='space-y-4'>
          <Label>Bedrooms</Label>
          <Input
            type='number'
            placeholder='0'
            value={data.bedrooms}
            onChange={(e) => onChange('bedrooms', Number(e.target.value))}
          />
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4 mb-4'>
        <div className='space-y-4'>
          <Label>Bathrooms</Label>
          <Input
            type='number'
            placeholder='0'
            value={data.bathrooms}
            onChange={(e) => onChange('bathrooms', Number(e.target.value))}
          />
        </div>
        <div className='space-y-4'>
          <Label>Parking</Label>
          <Input
            type='number'
            placeholder='0'
            value={data.parking}
            onChange={(e) => onChange('parking', Number(e.target.value))}
          />
        </div>
      </div>
      <h3 className='font-bold mb-2'>Features & Amenities</h3>
      <div className='grid grid-cols-2 gap-4 mb-4'>
        <div>
          <div className='flex flex-wrap gap-2 mb-2'>
            {data.amenities.map((a, i) => (
              <span
                key={i}
                className='bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs flex items-center'
              >
                {a}{' '}
                <button
                  className='ml-1'
                  onClick={() =>
                    onChange(
                      'amenities',
                      data.amenities.filter((_, idx) => idx !== i)
                    )
                  }
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <Input
            placeholder='Add amenity and press Enter'
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value) {
                e.preventDefault();
                onChange('amenities', [
                  ...data.amenities,
                  e.currentTarget.value,
                ]);
                e.currentTarget.value = '';
              }
            }}
          />
        </div>
        <div>
          <div className='flex flex-wrap gap-2 mb-2'>
            {data.features.map((f, i) => (
              <span
                key={i}
                className='bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs flex items-center'
              >
                {f}{' '}
                <button
                  className='ml-1'
                  onClick={() =>
                    onChange(
                      'features',
                      data.features.filter((_, idx) => idx !== i)
                    )
                  }
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <Input
            placeholder='Add feature and press Enter'
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value) {
                e.preventDefault();
                onChange('features', [...data.features, e.currentTarget.value]);
                e.currentTarget.value = '';
              }
            }}
          />
        </div>
      </div>
      <h3 className='font-bold mb-2'>Property Photo</h3>
      <div className='border-2 border-dashed border-purple-300 rounded-lg p-6 flex flex-col items-center mb-6'>
        <input
          type='file'
          multiple
          className='hidden'
          id='image-upload'
          onChange={(e) => {
            if (e.target.files) {
              onChange('images', Array.from(e.target.files));
            }
          }}
        />
        <label
          htmlFor='image-upload'
          className='cursor-pointer flex flex-col items-center'
        >
          <span className='text-3xl mb-2'>&#8682;</span>
          <span className='text-gray-500'>
            Drag your file(s) or{' '}
            <span className='text-blue-600 underline'>browse</span>
          </span>
          <span className='text-xs text-gray-400 mt-1'>
            Max 10 MB files are allowed
          </span>
        </label>
        <div className='flex flex-wrap gap-2 mt-2'>
          {data.images.map((file, i) => (
            <span key={i} className='text-xs bg-gray-100 px-2 py-1 rounded'>
              {file.name}
            </span>
          ))}
        </div>
      </div>
      <div className='flex justify-end gap-4 mt-8'>
        <Button variant='outline' type='button' onClick={onDraft}>
          Save as draft
        </Button>
        <Button type='button' onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}
