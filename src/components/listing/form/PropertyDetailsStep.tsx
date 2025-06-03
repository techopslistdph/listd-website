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
import condominium from '@/../public/images/icons/condominium.svg';
import houseAndLot from '@/../public/images/icons/house-and-lot.svg';
import lot from '@/../public/images/icons/lot.svg';
import warehouse from '@/../public/images/icons/warehouse.svg';
import Image from 'next/image';

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
  const pathname = usePathname(); // No longer needed for propertyType

  // Property type options
  const propertyTypes = [
    { label: 'Condominium', value: 'Condominium', img: condominium },
    {
      label: 'House & Lot',
      value: 'House and Lot',
      img: houseAndLot,
    },
    { label: 'Lot', value: 'Land', img: lot },
    { label: 'Warehouse', value: 'Warehouse', img: warehouse },
  ];

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
            <h2 className='heading-5 mb-4'>
              Confirm and complete your Property Address
            </h2>
            <div className='grid grid-cols-1 gap-4 mb-6'>
              {/* Building Name full width */}
              <FormField label='Building Name'>
                <Input
                  placeholder='Enter building name'
                  value={data.buildingName}
                  onChange={(e) => onChange('buildingName', e.target.value)}
                />
              </FormField>
              {/* Street Address / Barangay */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField label='Street Address'>
                  <Input
                    placeholder='Enter your street address'
                    value={data.street}
                    onChange={(e) => onChange('street', e.target.value)}
                  />
                </FormField>
                <FormField label='Barangay'>
                  <Input
                    placeholder='Enter your barangay'
                    value={data.barangay}
                    onChange={(e) => onChange('barangay', e.target.value)}
                  />
                </FormField>
              </div>
              {/* City / Region */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField label='City'>
                  <Input
                    placeholder='Enter your city'
                    value={data.city}
                    onChange={(e) => onChange('city', e.target.value)}
                  />
                </FormField>
                <FormField label='Region'>
                  <Input
                    placeholder='Enter your region'
                    value={data.state}
                    onChange={(e) => onChange('state', e.target.value)}
                  />
                </FormField>
              </div>
            </div>
            <h2 className='heading-5 mb-6'>Details about your place</h2>
            <div className='grid grid-cols-1 gap-4 mb-6'>
              {/* Floor no. / Floor area */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField label='Floor no.'>
                  <Input
                    placeholder='Enter floor no'
                    value={data.floorNo}
                    onChange={(e) => onChange('floorNo', e.target.value)}
                  />
                </FormField>
                <FormField label='Floor area'>
                  <Input
                    placeholder='Enter your sqm'
                    value={data.floorArea}
                    onChange={(e) => onChange('floorArea', e.target.value)}
                  />
                </FormField>
              </div>
              {/* Furnished / Bedrooms */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                    onChange={(e) =>
                      onChange('bedrooms', Number(e.target.value))
                    }
                  />
                </FormField>
              </div>
              {/* Bathrooms / Parking */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                    onChange={(e) =>
                      onChange('parking', Number(e.target.value))
                    }
                  />
                </FormField>
              </div>
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
      {/* Buy/Rent Button Group */}
      {!pathname.includes('/valuation') && (
        <>
          <div className='flex gap-2 bg-gray-100 rounded-lg p-1 mb-6'>
            <button
              className={`px-10 py-4 rounded-lg text-lg font-bold w-full cursor-pointer ${
                data.forSale ? 'bg-primary-main text-white' : 'text-gray-700'
              }`}
              onClick={() => onChange('forSale', true)}
              type='button'
            >
              Buy
            </button>
            <button
              className={`px-10 py-4 rounded-lg text-lg font-bold w-full cursor-pointer ${
                !data.forSale ? 'bg-primary-main text-white' : 'text-gray-700'
              }`}
              onClick={() => onChange('forSale', false)}
              type='button'
            >
              Rent
            </button>
          </div>
          {/* Property Type Selection UI */}
          <div className='mb-8'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
              {propertyTypes.map((type) => (
                <button
                  key={type.value}
                  type='button'
                  onClick={() => onChange('propertyType', type.value)}
                  className={`flex flex-col items-center justify-between border-2 rounded-2xl shadow-2xl shadow-[#F7EFFD] cursor-pointer p-6 h-40 transition-all duration-200 ${
                    data.propertyType.toLowerCase() === type.value.toLowerCase()
                      ? 'border-primary-main shadow-lg'
                      : 'border-transparent'
                  } `}
                >
                  <Image src={type.img} alt={type.label} className='h-20 ' />
                  <span className='font-bold text-lg'>{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {!propertyType.includes('condominium') && (
        <>
          <h2 className='heading-5 mb-4'>Confirm your address</h2>
          <AddressFields data={data} onChange={onChange} />
          <h2 className='heading-5 mb-6'>Details about your place</h2>
        </>
      )}
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
