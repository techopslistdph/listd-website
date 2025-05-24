'use client';
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../ui/select';
import { CheckIcon } from 'lucide-react';
import upload from '@/../public/images/icons/upload.svg';
import Image from 'next/image';
import sampleQr from '@/../public/images/sample-qr.png';

export default function EditProfile() {
  const [showGovIdFields, setShowGovIdFields] = useState(false);
  const [govIdType, setGovIdType] = useState('Passport');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  return (
    <div>
      <div className='grid md:grid-cols-2 gap-10'>
        <div className='space-y-4'>
          <Label>First Name</Label>
          <Input defaultValue='John' />
        </div>
        <div className='space-y-4'>
          <Label>Last Name</Label>
          <Input defaultValue='Doe' />
        </div>
        <div className='space-y-4'>
          <Label>Phone Number</Label>
          <Input defaultValue='Not Provided' />
        </div>
        <div className='space-y-4'>
          <Label>Email Address</Label>
          <Input defaultValue='john.doe@example.com' />
        </div>
        <div className='space-y-4'>
          <Label>Company Name</Label>
          <Input defaultValue='Not Provided' />
        </div>
        <div className='space-y-4'>
          <Label>Government ID (Optional)</Label>
          <div className='flex items-center gap-5'>
            <span className='body-sm text-[var(--neutral-mid)]'>
              passport.png
            </span>
            <Button
              className='bg-[var(--neutral-light)] text-[var(--primary-main)] hover:bg-[var(--neutral-light)] cursor-pointer'
              onClick={() => setShowGovIdFields(true)}
            >
              Replace
            </Button>
          </div>
        </div>
      </div>
      <div>
        {showGovIdFields && (
          <div className='mt-6'>
            <Label className='font-semibold text-lg mb-2 block'>
              Select Your Government ID Type
            </Label>
            <Select value={govIdType} onValueChange={setGovIdType}>
              <SelectTrigger className='w-full mb-4'>
                <SelectValue placeholder='Select Government ID Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Passport'>Passport</SelectItem>
                <SelectItem value='Driver License'>Driver License</SelectItem>
                <SelectItem value='National ID'>National ID</SelectItem>
                {/* Add more options as needed */}
              </SelectContent>
            </Select>
            <div className='text-[var(--neutral-mid)] mb-4 caption'>
              To verify your identity, please upload a clear photo of your
              government ID. Ensure that:
              <ul className='list-none mt-2 space-y-1 text-[var(--neutral-text)] caption'>
                <li className='flex gap-1 items-center'>
                  <CheckIcon className='w-4' /> The passport is valid and not
                  expired.
                </li>
                <li className='flex gap-1 items-center'>
                  <CheckIcon className='w-4' /> All details are visible and easy
                  to read.
                </li>
                <li className='flex gap-1 items-center'>
                  <CheckIcon className='w-4' /> The complete government ID page
                  is visible.
                </li>
              </ul>
            </div>
            <div className=' flex flex-col md:flex-row gap-8 items-start'>
              <div className='flex-1 mt-5 '>
                {imagePreview ? (
                  <div className='flex flex-col md:flex-row gap-10'>
                    <div className='flex flex-col items-center'>
                      <Label className='mb-2 block'>Uploaded Photo</Label>

                      <Image
                        src={imagePreview}
                        width={40}
                        height={40}
                        alt='Uploaded ID'
                        className='w-full h-40 object-cover rounded-lg border mb-2'
                      />
                      <div className='flex items-center gap-2'>
                        <span className='flex items-center gap-1 text-[var(--neutral-mid)]'>
                          <Image
                            src='/file-icon.png'
                            alt='file'
                            className='w-5 h-5'
                            width={30}
                            height={30}
                          />
                          {uploadedFile?.name || 'passport.png'}
                        </span>
                        <Button
                          size='sm'
                          className='bg-[var(--neutral-light)] text-[var(--primary-main)] hover:bg-[var(--neutral-light)] px-3 py-1 rounded-md cursor-pointer'
                          onClick={() => {
                            setUploadedFile(null);
                            setImagePreview(null);
                          }}
                        >
                          Replace
                        </Button>
                      </div>
                    </div>
                    <div className='flex-[2] w-full'>
                      <div className='grid md:grid-cols-2 gap-6'>
                        <div>
                          <Label>Full Name</Label>
                          <Input
                            defaultValue='Dela Cruz, Maria, Santos'
                            readOnly
                            className='bg-[var(--neutral-light)] rounded-full'
                          />
                        </div>
                        <div>
                          <Label>Passport Number</Label>
                          <Input
                            defaultValue='P0000000A'
                            readOnly
                            className='bg-[var(--neutral-light)] rounded-full'
                          />
                        </div>
                        <div>
                          <Label>Nationality</Label>
                          <Input
                            defaultValue='Filipino'
                            readOnly
                            className='bg-[var(--neutral-light)] rounded-full'
                          />
                        </div>
                        <div>
                          <Label>Date of Birth</Label>
                          <Input
                            defaultValue='16 March 1980'
                            readOnly
                            className='bg-[var(--neutral-light)] rounded-full'
                          />
                        </div>
                        <div>
                          <Label>Gender / Sex</Label>
                          <Input
                            defaultValue='Female'
                            readOnly
                            className='bg-[var(--neutral-light)] rounded-full'
                          />
                        </div>
                        <div>
                          <Label>
                            Place of Birth (if available on passport)
                          </Label>
                          <Input
                            defaultValue='Manila'
                            readOnly
                            className='bg-[var(--neutral-light)] rounded-full'
                          />
                        </div>
                        <div>
                          <Label>Date of Issue (optional, if available)</Label>
                          <Input
                            defaultValue='27 June 2016'
                            readOnly
                            className='bg-[var(--neutral-light)] rounded-full'
                          />
                        </div>
                        <div>
                          <Label>Date of Expiry</Label>
                          <Input
                            defaultValue='26 June 2025'
                            readOnly
                            className='bg-[var(--neutral-light)] rounded-full'
                          />
                        </div>
                        <div className='md:col-span-2'>
                          <Label>Country of Issue / Issuing Authority</Label>
                          <Input
                            defaultValue='DFA Manila'
                            readOnly
                            className='bg-[var(--neutral-light)] rounded-full'
                          />
                        </div>
                      </div>
                      <div className='mt-6 flex items-center gap-2'>
                        <input
                          type='checkbox'
                          id='gov-id-confirm'
                          className='accent-[var(--primary-main)]'
                        />
                        <label
                          htmlFor='gov-id-confirm'
                          className='text-[var(--neutral-mid)] text-sm'
                        >
                          I confirm that the information I have provided is true
                          and correct.
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='border-2 border-dashed border-[var(--primary-main)] rounded-lg flex flex-col justify-center items-center p-8 min-h-[180px]'>
                      <input
                        type='file'
                        accept='image/*'
                        id='gov-id-upload'
                        className='hidden'
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadedFile(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                      <label
                        htmlFor='gov-id-upload'
                        className='flex flex-col items-center cursor-pointer'
                      >
                        <Image src={upload} alt='upload' />
                        <span className='font-medium mt-2'>
                          Drag your file(s) or{' '}
                          <span className='text-[var(--primary-main)] underline'>
                            browse
                          </span>
                        </span>
                        <span className='text-xs text-[var(--neutral-mid)] mt-1'>
                          Max 10 MB files are allowed
                        </span>
                      </label>
                    </div>
                    <div className='border-2 border-dashed border-[var(--primary-main)] rounded-lg flex flex-col justify-center items-center p-8 min-h-[180px]'>
                      <div className='mb-2'>
                        {/* Replace with your QR code component or image */}
                        <Image
                          src={sampleQr}
                          alt='QR Code'
                          className='mx-auto'
                          width={120}
                          height={120}
                        />
                      </div>
                      <span className='text-[var(--neutral-mid)] text-sm'>
                        Scan to upload Government ID via phone
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className='mt-10 flex flex-col md:flex-row gap-4 justify-end'>
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
  );
}
