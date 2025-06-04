'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/common/Container';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import background from '@/../public/images/hero-background.png';
import Button from '@/components/common/Button';
import { useUrlParams } from '@/hooks/useUrlParams';
import { useListingTypes } from '@/lib/queries/hooks/use-listing-type';

const LISTING_TYPES = ['Buy', 'Rent', 'Sell', 'Valuation'];
const PROPERTY_OPTIONS = ['Condominium', 'House and lot', 'Land'];

export default function Hero() {
  const router = useRouter();
  const { createParamsString } = useUrlParams();
  const { data: listingTypes, isLoading } = useListingTypes();
  const [propertyAction, setPropertyAction] = useState(LISTING_TYPES[0]);
  const [property, setProperty] = useState(PROPERTY_OPTIONS[0]);
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const paramsString = createParamsString({
      location: location.trim(),
      property,
      type: propertyAction,
    });

    const url = paramsString ? `/property?${paramsString}` : '/property';
    router.push(url);
  };



  return (
    <Container
      className='flex justify-center items-center min-h-[750px] max-h-[715px]'
      backgroundImage={background.src}
    >
      <div className='bg-white rounded-3xl shadow-lg w-full max-w-[1300px] p-8 md:p-12 flex flex-col gap-8'>
        <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-6'>
          <div>
            <h1 className='font-bold heading-2 md:heading-1 text-neutral-text mb-2'>
              Buy, rent, sell your property easily
            </h1>
            <p className='text-body text-neutral-mid'>
              A great platform to buy, sell, or even rent your properties
              without any commissions.
            </p>
          </div>
          <div className='flex gap-10 justify-center md:justify-start'>
            <div className='text-center'>
              <div className='font-bold text-3xl text-primary-main'>50k+</div>
              <div className='text-body text-neutral-mid'>Renters</div>
            </div>
            <div className='text-center'>
              <div className='font-bold text-3xl text-primary-main'>10k+</div>
              <div className='text-body text-neutral-mid'>Properties</div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className='flex justify-center md:hidden'>
          <Select value={propertyAction} onValueChange={setPropertyAction}>
            <SelectTrigger className='w-full rounded-full text-base bg-[var(--neutral-light)] px-6 py-6 text-left text-body text-[var(--neutral-text)] flex items-center justify-between border-0 shadow-none'>
              <SelectValue placeholder='Buy' />
            </SelectTrigger>
            <SelectContent className='rounded-2xl shadow-lg'>
              {LISTING_TYPES.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className='text-body py-3 text-neutral-text text-vase'
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='hidden md:flex gap-8 border-b border-[var(--neutral-light)] mb-4 '>
          {LISTING_TYPES.map((tab) => (
            <button
              key={tab}
              className={`pb-2 cursor-pointer ${
                propertyAction === tab
                  ? 'border-b-2 border-primary-main text-primary-main'
                  : 'text-neutral-text border-b-2 border-transparent'
              }`}
              onClick={() => setPropertyAction(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Form */}
        <form
          className='flex flex-col gap-3 md:flex-row md:gap-4 md:items-end'
          onSubmit={handleSubmit}
        >
          <div className='flex-1 w-full'>
            <label className='block font-medium mb-1'>Location</label>
            <div className='relative'>
              <Input
                type='text'
                placeholder='Search for Location'
                className='w-full rounded-full bg-neutral-light px-6 py-6 pr-12 text-body placeholder:text-black  text-neutral-text outline-none border-0 shadow-none'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <span className='absolute right-4 top-1/2 -translate-y-1/2 text-primary-main'>
                {/* Search Icon */}
                <svg
                  width='24'
                  height='24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <circle cx='11' cy='11' r='8' />
                  <line x1='21' y1='21' x2='16.65' y2='16.65' />
                </svg>
              </span>
            </div>
          </div>
          <div className='flex-1 w-full'>
            <label className='block font-medium mb-1'>Property</label>
            <Select value={property} onValueChange={setProperty}>
              <SelectTrigger className='w-full rounded-full text-base bg-neutral-light px-6 py-6 text-left text-body text-neutral-text flex items-center justify-between border-0 shadow-none'>
                <SelectValue placeholder='Select property' />
              </SelectTrigger>
              <SelectContent className='rounded-2xl shadow-lg'>
                {PROPERTY_OPTIONS.map((option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className='text-body text-base py-3 text-neutral-text'
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant='primary'
            className='rounded-full px-8 py-3 font-medium w-full md:w-auto mt-2 md:mt-0'
            type='submit'
          >
            Browse Properties
          </Button>
        </form>
      </div>
    </Container>
  );
}
