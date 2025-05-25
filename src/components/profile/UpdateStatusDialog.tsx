import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Listing } from '@/app/data';
import uploadIcon from '@/../public/images/icons/upload.svg';
import Image from 'next/image';
import { TagInput } from '../listing/form/TagInput';
import { Button } from '../ui/button';

interface UpdateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Listing | null;
}

const UpdateStatusDialog: React.FC<UpdateStatusDialogProps> = ({
  open,
  onOpenChange,
  property,
}) => {
  const [formData, setFormData] = useState({
    buildingName: property?.title || '',
    streetAddress: 'Manila',
    barangay: 'Manila',
    city: 'Manila',
    state: 'Manila',
    floorNo: '2',
    floorArea: '60',
    furnishing: 'Fully Furnished',
    bedrooms: '2',
    bathrooms: '2',
    parking: '1',
    amenities: ['Lounge', 'Spa Room'],
    features: ['Lounge', 'Spa Room'],
  });

  const [unlistReason, setUnlistReason] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!property) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-3xl w-full p-8 overflow-y-auto max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle>Confirm and complete your Property Address</DialogTitle>
        </DialogHeader>
        <div className='mb-4'>
          <label className='block font-medium mb-1'>Building Name</label>
          <input
            type='text'
            name='buildingName'
            className='w-full bg-gray-100 rounded-xl px-4 py-3 mb-2 outline-none'
            value={formData.buildingName}
            onChange={handleInputChange}
          />
        </div>
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <div>
            <label className='block font-medium mb-1'>Street Address</label>
            <input
              type='text'
              name='streetAddress'
              className='w-full bg-gray-100 rounded-xl px-4 py-3 outline-none'
              value={formData.streetAddress}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className='block font-medium mb-1'>Barangay</label>
            <input
              type='text'
              name='barangay'
              className='w-full bg-gray-100 rounded-xl px-4 py-3 outline-none'
              value={formData.barangay}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className='block font-medium mb-1'>City</label>
            <input
              type='text'
              name='city'
              className='w-full bg-gray-100 rounded-xl px-4 py-3 outline-none'
              value={formData.city}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className='block font-medium mb-1'>State/Region</label>
            <input
              type='text'
              name='state'
              className='w-full bg-gray-100 rounded-xl px-4 py-3 outline-none'
              value={formData.state}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <h3 className='font-semibold mb-2'>Details about your place</h3>
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <div>
            <label className='block font-medium mb-1'>Floor no.</label>
            <input
              type='text'
              name='floorNo'
              className='w-full bg-gray-100 rounded-xl px-4 py-3 outline-none'
              value={formData.floorNo}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className='block font-medium mb-1'>Floor area</label>
            <input
              type='text'
              name='floorArea'
              className='w-full bg-gray-100 rounded-xl px-4 py-3 outline-none'
              value={formData.floorArea}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className='block font-medium mb-1'>Furnishing</label>
            <select
              name='furnishing'
              className='w-full bg-gray-100 rounded-xl px-4 py-3 outline-none'
              value={formData.furnishing}
              onChange={handleInputChange}
            >
              <option>Fully Furnished</option>
              <option>Semi-Furnished</option>
              <option>Unfurnished</option>
            </select>
          </div>
          <div>
            <label className='block font-medium mb-1'>Bedrooms</label>
            <input
              type='text'
              name='bedrooms'
              className='w-full bg-gray-100 rounded-xl px-4 py-3 outline-none'
              value={formData.bedrooms}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className='block font-medium mb-1'>Bathrooms</label>
            <input
              type='text'
              name='bathrooms'
              className='w-full bg-gray-100 rounded-xl px-4 py-3 outline-none'
              value={formData.bathrooms}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className='block font-medium mb-1'>Parking</label>
            <input
              type='text'
              name='parking'
              className='w-full bg-gray-100 rounded-xl px-4 py-3 outline-none'
              value={formData.parking}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <h3 className='font-semibold mb-2'>Features & Amenities</h3>
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <div>
            <TagInput
              label='Amenities'
              value={formData.amenities}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, amenities: value }))
              }
              placeholder='Type and press Enter'
            />
          </div>
          <div>
            <TagInput
              label='Features'
              value={formData.features}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, features: value }))
              }
              placeholder='Type and press Enter'
            />
          </div>
        </div>
        <h3 className='font-semibold mb-2'>Property Photo</h3>
        <div className='mb-6'>
          <label className='block font-medium mb-1'>Image</label>
          <div className='border-2 border-dashed border-[var(--primary-main)] rounded-xl p-8 flex flex-col items-center justify-center bg-[#fafaff]'>
            <Image src={uploadIcon} alt='upload Icon' className='mb-2' />
            <span className='text-gray-500'>
              Drag your file(s) or{' '}
              <span className='text-[var(--primary-main)] cursor-pointer'>
                browse
              </span>
            </span>
            <span className='text-gray-400 text-sm mt-1'>
              Max 10 MB files are allowed
            </span>
          </div>
        </div>

        {/* Unlist Property Section */}
        <div className=''>
          <div className='mb-2'>
            <h3 className='font-semibold mb-2'>Unlist Property</h3>
            <div className='text-gray-400 text-base font-normal mt-1'>
              Manage your property listing settings
            </div>
          </div>
          <div className='mb-4 mt-6'>
            <label className='block font-medium mb-2'>
              Reason for unlisting
            </label>
            <div className='space-y-4'>
              {[
                'Property Sold',
                'Property Rented',
                'No Interest',
                'Property under Remodeling',
                'Other Reason',
              ].map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center border rounded-xl px-6 py-5 cursor-pointer transition ${
                    unlistReason === reason
                      ? 'border-[var(--primary-main)]'
                      : 'border-gray-300'
                  }`}
                >
                  <input
                    type='radio'
                    className='form-radio w-6 h-6 mr-4 accent-[var(--primary-main)]'
                    checked={unlistReason === reason}
                    onChange={() => setUnlistReason(reason)}
                  />
                  <span className='text-sm'>{reason}</span>
                </label>
              ))}
            </div>
          </div>
          <div className='flex justify-end gap-4 mt-8'>
            <Button
              variant='outline'
              className='rounded-full py-5 px-8 w-44 border-[var(--primary-main)] text-[var(--primary-main)] hover:bg-white cursor-pointer'
              type='button'
            >
              Discard
            </Button>
            <Button
              type='button'
              className='rounded-full py-5 px-8 w-44 bg-[var(--primary-main)] text-white hover:bg-[var(--primary-main)] border border-[var(--primary-main)] cursor-pointer'
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusDialog;
