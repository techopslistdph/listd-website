'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Button from '../common/Button';
import { Label } from '../ui/label';
import { useRouter } from 'nextjs-toploader/app';

const steps = [
  {
    label: '01',
    text: 'Locate the property in order to start the online valuation.',
  },
  {
    label: '01',
    text: 'Describe your property to adjust the valuation.',
  },
  {
    label: '01',
    text: 'Get your valuation online or personalize it with a professional.',
  },
];

const propertyTypes = ['condominium', 'house and lot', 'lot', 'warehouse'];

export default function ValuationHero() {
  const [selectedType, setSelectedType] = useState('warehouse');
  const router = useRouter();

  const handleValueClick = () => {
    router.push(`/valuation/details?type=${encodeURIComponent(selectedType)}`);
  };

  return (
    <section className='max-w-[1000px] rounded-3xl border mx-auto p-5 lg:p-10 -mt-96 bg-white  relative z-20'>
      <h1 className='heading-3 text-primary mb-2'>Property valuation</h1>
      <h2 className='body-large font-bold text-neutral-mid mb-8'>
        With the free online valuation of your property, you can find out the
        selling price and the rental price in just 3 steps
      </h2>
      <div className='flex flex-col gap-2 mb-10'>
        {steps.map((step, idx) => (
          <div
            key={idx}
            className='flex flex-col md:flex-row items-center gap-2'
          >
            <div className='flex items-center justify-center w-8 text-xs h-8 rounded-full border-2 border-neutral-mid text-primary font-bold bg-white'>
              {step.label}
            </div>
            <div className=' font-medium text-neutral-main'>{step.text}</div>
          </div>
        ))}
      </div>
      <form className=' flex flex-col'>
        <div className='border-b-2 border-neutral-main pb-2 mb-5'>
          <label className='block font-bold text-lg'>Full address</label>
        </div>
        <div className='flex flex-col md:flex-row items-center md:items-end gap-4 mb-2'>
          <div className='flex-1 w-full md:w-auto'>
            <Label className='block font-medium mb-2'>
              Municipality <span className='text-error-man'>*</span>
            </Label>
            <Input placeholder='Type municipality here' />
          </div>
          <div className='flex-1 w-full md:w-auto'>
            <Label className='block font-medium mb-2'>
              Property <span className='text-error-main'>*</span>
            </Label>
            <Select
              value={selectedType}
              onValueChange={setSelectedType}
              required
            >
              <SelectTrigger className=' w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button
              type='button'
              variant='primary'
              className='py-3 px-12'
              onClick={handleValueClick}
            >
              Value for free
            </Button>
          </div>
        </div>
        <div className='text-neutral-mid text-sm mt-2'>
          The free online valuation is not and does not replace a professional
          appraisal.
        </div>
      </form>
    </section>
  );
}
