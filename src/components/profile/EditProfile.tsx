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
      <div className='grid md:grid-cols-2 gap-4 lg:gap-10'>
        <div className='space-y-2 lg:space-y-4'>
          <Label className='text-sm lg:text-base'>First Name</Label>
          <Input defaultValue='John' className='text-sm lg:text-base' />
        </div>
        <div className='space-y-2 lg:space-y-4'>
          <Label className='text-sm lg:text-base'>Last Name</Label>
          <Input defaultValue='Doe' className='text-sm lg:text-base' />
        </div>
        <div className='space-y-2 lg:space-y-4'>
          <Label className='text-sm lg:text-base'>Phone Number</Label>
          <Input defaultValue='Not Provided' className='text-sm lg:text-base' />
        </div>
        <div className='space-y-2 lg:space-y-4'>
          <Label className='text-sm lg:text-base'>Email Address</Label>
          <Input
            defaultValue='john.doe@example.com'
            className='text-sm lg:text-base'
          />
        </div>
        <div className='space-y-2 lg:space-y-4'>
          <Label className='text-sm lg:text-base'>Company Name</Label>
          <Input defaultValue='Not Provided' className='text-sm lg:text-base' />
        </div>
        <div className='space-y-2 lg:space-y-4'>
          <Label className='text-sm lg:text-base'>
            Government ID (Optional)
          </Label>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 lg:gap-5'>
            <span className='text-xs lg:text-sm text-neutral-mid'>
              passport.png
            </span>
            <Button
              className='bg-neutral-light text-primary-main hover:bg-neutral-light cursor-pointer text-sm lg:text-base'
              onClick={() => setShowGovIdFields(true)}
            >
              Replace
            </Button>
          </div>
        </div>
      </div>
      <div>
        {showGovIdFields && (
          <div className='mt-4 lg:mt-6'>
            <Label className='font-semibold text-base lg:text-lg mb-2 block'>
              Select Your Government ID Type
            </Label>
            <Select value={govIdType} onValueChange={setGovIdType}>
              <SelectTrigger className='w-full mb-3 lg:mb-4 text-sm lg:text-base'>
                <SelectValue placeholder='Select Government ID Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Passport'>Passport</SelectItem>
                <SelectItem value='Driver License'>Driver License</SelectItem>
                <SelectItem value='National ID'>National ID</SelectItem>
              </SelectContent>
            </Select>
            <div className='text-neutral-mid mb-3 lg:mb-4 text-xs lg:text-sm'>
              To verify your identity, please upload a clear photo of your
              government ID. Ensure that:
              <ul className='list-none mt-2 space-y-1 text-neutral-text text-xs lg:text-sm'>
                <li className='flex gap-1 items-center'>
                  <CheckIcon className='w-3 lg:w-4' /> The passport is valid and
                  not expired.
                </li>
                <li className='flex gap-1 items-center'>
                  <CheckIcon className='w-3 lg:w-4' /> All details are visible
                  and easy to read.
                </li>
                <li className='flex gap-1 items-center'>
                  <CheckIcon className='w-3 lg:w-4' /> The complete government
                  ID page is visible.
                </li>
              </ul>
            </div>
            <div className='flex flex-col md:flex-row gap-4 lg:gap-8 items-start'>
              <div className='flex-1 mt-3 lg:mt-5'>
                {imagePreview ? (
                  <div className='flex flex-col md:flex-row gap-6 lg:gap-10'>
                    <div className='flex flex-col items-center'>
                      <Label className='mb-2 block text-sm lg:text-base'>
                        Uploaded Photo
                      </Label>
                      <Image
                        src={imagePreview}
                        width={40}
                        height={40}
                        alt='Uploaded ID'
                        className='w-full h-32 lg:h-40 object-cover rounded-lg border mb-2'
                      />
                      <div className='flex items-center gap-2'>
                        <span className='flex items-center gap-1 text-neutral-mid text-xs lg:text-sm'>
                          <Image
                            src='/file-icon.png'
                            alt='file'
                            className='w-4 h-4 lg:w-5 lg:h-5'
                            width={30}
                            height={30}
                          />
                          {uploadedFile?.name || 'passport.png'}
                        </span>
                        <Button
                          size='sm'
                          className='bg-neutral-light text-primary-main hover:bg-neutral-light px-2 lg:px-3 py-1 rounded-md cursor-pointer text-xs lg:text-sm'
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
                      <div className='grid md:grid-cols-2 gap-3 lg:gap-6'>
                        <div>
                          <Label className='text-sm lg:text-base'>
                            Full Name
                          </Label>
                          <Input
                            defaultValue='Dela Cruz, Maria, Santos'
                            readOnly
                            className='bg-neutral-light rounded-full text-sm lg:text-base'
                          />
                        </div>
                        <div>
                          <Label className='text-sm lg:text-base'>
                            Passport Number
                          </Label>
                          <Input
                            defaultValue='P0000000A'
                            readOnly
                            className='bg-neutral-light rounded-full text-sm lg:text-base'
                          />
                        </div>
                        <div>
                          <Label className='text-sm lg:text-base'>
                            Nationality
                          </Label>
                          <Input
                            defaultValue='Filipino'
                            readOnly
                            className='bg-neutral-light rounded-full text-sm lg:text-base'
                          />
                        </div>
                        <div>
                          <Label className='text-sm lg:text-base'>
                            Date of Birth
                          </Label>
                          <Input
                            defaultValue='16 March 1980'
                            readOnly
                            className='bg-neutral-light rounded-full text-sm lg:text-base'
                          />
                        </div>
                        <div>
                          <Label className='text-sm lg:text-base'>
                            Gender / Sex
                          </Label>
                          <Input
                            defaultValue='Female'
                            readOnly
                            className='bg-neutral-light rounded-full text-sm lg:text-base'
                          />
                        </div>
                        <div>
                          <Label className='text-sm lg:text-base'>
                            Place of Birth (if available on passport)
                          </Label>
                          <Input
                            defaultValue='Manila'
                            readOnly
                            className='bg-neutral-light rounded-full text-sm lg:text-base'
                          />
                        </div>
                        <div>
                          <Label className='text-sm lg:text-base'>
                            Date of Issue (optional, if available)
                          </Label>
                          <Input
                            defaultValue='27 June 2016'
                            readOnly
                            className='bg-neutral-light rounded-full text-sm lg:text-base'
                          />
                        </div>
                        <div>
                          <Label className='text-sm lg:text-base'>
                            Date of Expiry
                          </Label>
                          <Input
                            defaultValue='26 June 2025'
                            readOnly
                            className='bg-neutral-light rounded-full text-sm lg:text-base'
                          />
                        </div>
                        <div className='md:col-span-2'>
                          <Label className='text-sm lg:text-base'>
                            Country of Issue / Issuing Authority
                          </Label>
                          <Input
                            defaultValue='DFA Manila'
                            readOnly
                            className='bg-neutral-light rounded-full text-sm lg:text-base'
                          />
                        </div>
                      </div>
                      <div className='mt-4 lg:mt-6 flex items-center gap-2'>
                        <input
                          type='checkbox'
                          id='gov-id-confirm'
                          className='accent-primary-main w-4 h-4 lg:w-5 lg:h-5'
                        />
                        <label
                          htmlFor='gov-id-confirm'
                          className='text-neutral-mid text-xs lg:text-sm'
                        >
                          I confirm that the information I have provided is true
                          and correct.
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4'>
                    <div className='border-2 border-dashed border-primary-main rounded-lg flex flex-col justify-center items-center p-4 lg:p-8 min-h-[150px] lg:min-h-[180px]'>
                      <input
                        type='file'
                        accept='image/*'
                        id='gov-id-upload'
                        className='hidden'
                        onChange={e => {
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
                        <Image
                          src={upload}
                          alt='upload'
                          className='w-8 h-8 lg:w-auto lg:h-auto'
                        />
                        <span className='font-medium mt-2 text-sm lg:text-base'>
                          Drag your file(s) or{' '}
                          <span className='text-primary-main underline'>
                            browse
                          </span>
                        </span>
                        <span className='text-xs text-neutral-mid mt-1'>
                          Max 10 MB files are allowed
                        </span>
                      </label>
                    </div>
                    <div className='border-2 border-dashed border-primary-main rounded-lg flex flex-col justify-center items-center p-4 lg:p-8 min-h-[150px] lg:min-h-[180px]'>
                      <div className='mb-2'>
                        <Image
                          src={sampleQr}
                          alt='QR Code'
                          className='mx-auto w-24 h-24 lg:w-[120px] lg:h-[120px]'
                          width={120}
                          height={120}
                        />
                      </div>
                      <span className='text-neutral-mid text-xs lg:text-sm text-center'>
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
      <div className='mt-6 lg:mt-10 flex flex-col sm:flex-row gap-3 lg:gap-4 justify-end'>
        <Button
          variant='outline'
          className='rounded-full py-3 lg:py-5 px-4 lg:px-8 w-full sm:w-44 border-primary-main text-primary-main hover:bg-white cursor-pointer text-sm lg:text-base'
          type='button'
        >
          Discard
        </Button>
        <Button
          type='button'
          className='rounded-full py-3 lg:py-5 px-4 lg:px-8 w-full sm:w-44 bg-primary-main text-white hover:bg-primary-main border border-primary-main cursor-pointer text-sm lg:text-base'
        >
          Save
        </Button>
      </div>
    </div>
  );
}
