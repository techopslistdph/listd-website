/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageUpload } from './ImageUpload';
import { ActionButtons } from './ActionButtons';
import { AddressFields } from './AddressFields';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import condominium from '@/../public/images/icons/condominium.svg';
import houseAndLot from '@/../public/images/icons/house-and-lot.svg';
import lot from '@/../public/images/icons/lot.svg';
import warehouse from '@/../public/images/icons/warehouse.svg';
import { PropertySpecificFields } from './PropertySpecificFields';
import { UseFormReturn } from 'react-hook-form';
import { ListingFormData } from './Schema';
import { useNearbyLocations } from '@/lib/queries/hooks/use-property';

interface PropertyDetailsStepProps {
  onChange: (field: keyof ListingFormData | string, value: unknown) => void;
  onNext: () => void;
  onBack?: () => void;
  onDraft: () => void;
  propertyTypes: Array<{
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
  form: UseFormReturn<ListingFormData>;
}

// Map property types to their icons
const propertyTypeIcons: Record<string, string> = {
  Condominium: condominium,
  'House and lot': houseAndLot,
  Land: lot,
  Warehouse: warehouse,
};

export function PropertyDetailsStep({
  onChange,
  onNext,
  onDraft,
  propertyTypes,
  form,
  features,
  amenities,
}: PropertyDetailsStepProps) {
  const propertyType = form.getValues('propertyType');
  const street = form.getValues('street') as string;
  const barangay = form.getValues('barangay') as string;
  const city = form.getValues('city') as string;
  const address = `${street}, ${barangay}, ${city}`;
  const buildingName = form.getValues('buildingName') as string;
  const query = `${buildingName} ${address}`;
  const pathname = usePathname();

  const { data: nearbyLocations } = useNearbyLocations(query);
  return (
    <div className='bg-white'>
      {/* Buy/Rent Button Group */}
      {!pathname.includes('/valuation') && (
        <>
          <div className='flex gap-2 bg-gray-100 rounded-lg p-1 mb-6'>
            <button
              className={`px-10 py-4 rounded-lg text-lg font-bold w-full cursor-pointer ${
                form.getValues('forSale')
                  ? 'bg-primary-main text-white'
                  : 'text-gray-700'
              }`}
              onClick={() => onChange('forSale', true)}
              type='button'
            >
              Buy
            </button>
            <button
              className={`px-10 py-4 rounded-lg text-lg font-bold w-full cursor-pointer ${
                !form.getValues('forSale')
                  ? 'bg-primary-main text-white'
                  : 'text-gray-700'
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
              {propertyTypes.map(type => (
                <button
                  key={type.id}
                  type='button'
                  onClick={() => {
                    onChange('propertyType', type.name);
                    onChange('propertyTypeId', type.id);
                  }}
                  className={`flex flex-col items-center justify-between border-2 rounded-2xl shadow-2xl shadow-[#F7EFFD] cursor-pointer p-6 h-40 transition-all duration-200 ${
                    form.getValues('propertyType').toLowerCase() ===
                    type.name.toLowerCase()
                      ? 'border-primary-main shadow-lg'
                      : 'border-transparent'
                  } `}
                >
                  <Image
                    src={propertyTypeIcons[type.name] || condominium}
                    alt={type.name}
                    className='h-20'
                  />
                  <span className='font-bold text-lg'>{type.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {!propertyType.includes('Condominium') && (
        <>
          <h2 className='heading-5 mb-4'>Confirm your address</h2>
          <AddressFields />
          <h2 className='heading-5 mb-6'>Details about your place</h2>
        </>
      )}
      <PropertySpecificFields
        form={form}
        onChange={onChange}
        features={features}
        amenities={amenities}
        nearbyLocations={nearbyLocations?.data?.places || []}
      />
      {!pathname.includes('/valuation') && (
        <>
          <h2 className='heading-5 mb-5'>Property Photo</h2>
          <ImageUpload
            onChange={files => onChange('images', files)}
            value={form.getValues('images')}
            error={form.formState.errors.images?.message}
          />
        </>
      )}
      <ActionButtons onDraft={onDraft} onNext={onNext} />
    </div>
  );
}
