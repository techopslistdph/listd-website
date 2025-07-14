/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormData } from '../types';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TagInput } from './TagInput';
import { FormInput } from '@/components/ui/form-input';
import { UseFormReturn } from 'react-hook-form';
import { ListingFormData } from './Schema';
import { BuildingAutocomplete } from '@/components/ui/building-autocomplete';

interface PropertySpecificFieldsProps {
  onChange: (field: keyof FormData | string, value: unknown) => void;
  form: UseFormReturn<ListingFormData>;
  features: Array<{
    id: string;
    name: string;
  }>;
  amenities: Array<{
    id: string;
    name: string;
  }>;
  nearbyLocations: Array<{
    placeId: string;
    name: string;
    address: string;
  }>;
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

export function PropertySpecificFields({
  onChange,
  form,
  features,
  amenities,
  nearbyLocations,
}: PropertySpecificFieldsProps) {
  const propertyType = form.getValues('propertyType');

  switch (propertyType) {
    case 'Condominium':
      return (
        <>
          <h2 className='heading-5 mb-4'>
            Confirm and complete your Property Address
          </h2>
          <div className='grid grid-cols-1 gap-4 mb-6'>
            {/* Building Name full width */}
            <BuildingAutocomplete
              name='buildingName'
              label='Building Name'
              placeholder='Enter building name'
            />
            {/* Street Address / Barangay */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormInput
                name='street'
                label='Street Address'
                placeholder='Enter your street address'
              />
              <FormInput
                name='barangay'
                label='Barangay'
                placeholder='Enter your barangay'
              />
            </div>
            {/* City / Region */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormInput
                name='city'
                label='City'
                placeholder='Enter your city'
              />
              <FormInput
                name='state'
                label='Region'
                placeholder='Enter your region'
              />
            </div>
          </div>
          <h2 className='heading-5 mb-6'>Details about your place</h2>
          <div className='grid grid-cols-1 gap-4 mb-6'>
            {/* Floor no. / Floor area */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormInput
                name='floorNo'
                label='Floor no.'
                placeholder='Enter floor no'
              />
              <FormInput
                name='floorArea'
                label='Floor area'
                placeholder='Enter your sqm'
              />
            </div>
            {/* Furnished / Bedrooms */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField label='Furnishing Status'>
                <Select
                  value={
                    (form.getValues('propertyType') as string) ===
                      'Condominium' ||
                    (form.getValues('propertyType') as string) ===
                      'House and Lot'
                      ? (form.getValues('fullyFurnished') as string)
                      : 'unfurnished'
                  }
                  onValueChange={value => onChange('fullyFurnished', value)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select furnishing status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='unfurnished'>Unfurnished</SelectItem>
                    <SelectItem value='semi_furnished'>
                      Semi Furnished
                    </SelectItem>
                    <SelectItem value='fully_furnished'>
                      Fully Furnished
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormInput
                name='bedrooms'
                label='Bedrooms'
                type='number'
                placeholder='0'
              />
            </div>
            {/* Bathrooms / Parking */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormInput
                name='bathrooms'
                label='Bathrooms'
                type='number'
                placeholder='0'
              />
              <FormInput
                name='parking'
                label='Parking'
                type='number'
                placeholder='0'
              />
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <TagInput
              label='Amenities'
              value={
                (form.getValues('propertyType') as string) === 'Condominium' ||
                (form.getValues('propertyType') as string) === 'House and Lot'
                  ? (form.getValues('amenities') as Array<{
                      value: string;
                      label: string;
                    }>) || []
                  : (form.getValues('propertyType') as string) === 'Warehouse'
                    ? (form.getValues('amenities') as Array<{
                        value: string;
                        label: string;
                      }>) || []
                    : []
              }
              onChange={value => onChange('amenities', value)}
              defaultOptions={
                amenities?.map(amenity => ({
                  value: amenity.id,
                  label: amenity.name,
                })) || []
              }
              placeholder='Add amenity and press Enter'
              error={
                (propertyType as string) !== 'Vacant lot'
                  ? (form.formState.errors as any).amenities?.message || ''
                  : ''
              }
            />
            <TagInput
              label='Features'
              value={
                (form.getValues('propertyType') as string) === 'Condominium' ||
                (form.getValues('propertyType') as string) === 'House and Lot'
                  ? (form.getValues('features') as Array<{
                      value: string;
                      label: string;
                    }>) || []
                  : []
              }
              onChange={value => onChange('features', value)}
              placeholder='Add feature and press Enter'
              defaultOptions={
                features?.map(feature => ({
                  value: feature.id,
                  label: feature.name,
                })) || []
              }
              error={
                (propertyType as string) !== 'Vacant lot' &&
                (propertyType as string) !== 'Warehouse'
                  ? (form.formState.errors as any).features?.message || ''
                  : ''
              }
            />
          </div>
        </>
      );

    case 'Warehouse':
      return (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <FormInput
              name='lotSize'
              label='Lot Size (sqm)'
              placeholder='Enter lot size'
            />
            <FormInput
              name='floorArea'
              label='Floor Area (sqm)'
              placeholder='Enter floor area'
            />
            <FormInput
              name='ceilingHeight'
              label='Ceiling Height (m)'
              placeholder='Enter ceiling height'
            />
            <FormInput
              name='parking'
              label='Number of Parking Spaces'
              type='number'
              placeholder='Enter number of parking spaces'
            />
            <FormInput
              name='loadingDocks'
              label='Number of Loading Docks'
              type='number'
              placeholder='Enter number of loading docks'
            />
            <FormInput
              name='buildingSize'
              label='Building Size (sqm)'
              type='number'
              placeholder='Enter building size'
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <TagInput
              label='Nearby Locations'
              value={(
                (form.getValues('nearbyLocations') as Array<{
                  value: string;
                  label: string;
                }>) || []
              ).map(id => ({
                value: id.value,
                label: id.label,
              }))}
              onChange={value =>
                onChange(
                  'nearbyLocations',
                  value.map(item => ({
                    value: item.value,
                    label: item.label,
                  }))
                )
              }
              placeholder='Add amenities'
              error={form.formState.errors.amenities?.message || ''}
              defaultOptions={
                nearbyLocations?.map(location => ({
                  value: location.placeId,
                  label: location.name,
                })) || []
              }
            />
          </div>
        </>
      );

    case 'House and lot':
      return (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <FormInput
              name='numberOfFloors'
              label='Number of Floors'
              type='number'
              placeholder='Enter number of floors'
            />
            <FormInput
              name='floorArea'
              label='Floor Area (sqm)'
              placeholder='Enter floor area'
            />
            <FormInput
              name='lotSize'
              label='Lot Size (sqm)'
              placeholder='Enter lot size'
            />
            <FormInput
              name='bedrooms'
              label='Number of Bedrooms'
              type='number'
              placeholder='Enter number of bedrooms'
            />
            <FormInput
              name='bathrooms'
              label='Number of Bathrooms'
              type='number'
              placeholder='Enter number of bathrooms'
            />
            <FormInput
              name='parking'
              label='Number of Parking Spaces'
              type='number'
              placeholder='Enter number of parking spaces'
            />
            <FormInput
              name='numberOfGarages'
              label='Number of Garages'
              type='number'
              placeholder='Enter number of garages'
            />
            <FormInput
              name='numberOfLivingRooms'
              label='Number of Living Rooms'
              type='number'
              placeholder='Enter number of living rooms'
            />
            <FormInput
              name='numberOfDiningRooms'
              label='Number of Dining Rooms'
              type='number'
              placeholder='Enter number of dining rooms'
            />
            <FormInput
              name='numberOfKitchens'
              label='Number of Kitchens'
              type='number'
              placeholder='Enter number of kitchens'
            />
            <FormInput
              name='numberOfMaidRooms'
              label='Number of Maid Rooms'
              type='number'
              placeholder='Enter number of maid rooms'
            />
            <FormInput
              name='yearBuilt'
              label='Year Built'
              type='number'
              placeholder='Enter year built'
            />
          </div>
          <div className='mb-6'>
            <FormField label='Furnishing Status'>
              <Select
                value={form.getValues('fullyFurnished')}
                onValueChange={value => onChange('fullyFurnished', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select furnishing status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='fully_furnished'>
                    Fully Furnished
                  </SelectItem>
                  <SelectItem value='semi_furnished'>Semi Furnished</SelectItem>
                  <SelectItem value='unfurnished'>Unfurnished</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <TagInput
              label='Amenities'
              value={(
                (form.getValues('amenities') as Array<{
                  value: string;
                  label: string;
                }>) || []
              ).map(id => ({
                value: id.value,
                label: id.label,
              }))}
              onChange={value => onChange('amenities', value)}
              defaultOptions={
                amenities?.map(amenity => ({
                  value: amenity.id,
                  label: amenity.name,
                })) || []
              }
              placeholder='Add amenities'
              error={form.formState.errors.amenities?.message || ''}
            />
            <TagInput
              label='Features'
              value={(
                (form.getValues('features') as Array<{
                  value: string;
                  label: string;
                }>) || []
              ).map(id => ({
                value: id.value,
                label: id.label,
              }))}
              onChange={value => onChange('features', value)}
              defaultOptions={
                features?.map(feature => ({
                  value: feature.id,
                  label: feature.name,
                })) || []
              }
              placeholder='Add features'
              error={form.formState.errors.features?.message || ''}
            />
          </div>
        </>
      );

    case 'Vacant lot':
      return (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <FormInput
              name='lotSize'
              label='Lot Size (sqm)'
              type='number'
              placeholder='Enter lot size'
            />
            <TagInput
              label='Nearby Locations'
              value={(
                (form.getValues('nearbyLocations') as Array<{
                  value: string;
                  label: string;
                }>) || []
              ).map(id => ({
                value: id.value,
                label: id.label,
              }))}
              onChange={value =>
                onChange(
                  'nearbyLocations',
                  value.map(item => ({
                    value: item.value,
                    label: item.label,
                  }))
                )
              }
              placeholder='Add nearby locations'
              defaultOptions={
                nearbyLocations?.map(location => ({
                  value: location.placeId,
                  label: location.name,
                })) || []
              }
              error={form.formState.errors.nearbyLocations?.message || ''}
            />
          </div>
        </>
      );

    default:
      return null;
  }
}
