import { Button } from '@/components/ui/button';
import successListing from '@/../public/images/icons/success-listing.svg';
import Image from 'next/image';
import { PropertyType } from '../types';
interface ResultsStepProps {
  onHome: () => void;
  propertyType: PropertyType;
}

export function ResultsStep({ onHome, propertyType }: ResultsStepProps) {
  return (
    <div className='flex flex-col items-center justify-center min-h-[400px]'>
      <div className='mb-5'>
        <Image src={successListing} alt='success listing' className='mx-auto' />
        <h2 className='heading-5 mb-2 text-center my-5'>
          We&apos;ve posted your listing!
        </h2>
        <div className='text-[var(--neutral-mid)] body-sm text-center max-w-md'>
          Your {propertyType} listing has been successfully created. You can
          change some of the details anytime you need!
        </div>
      </div>
      <Button
        onClick={onHome}
        className='px-8 py-6 w-56 hover:bg-[var(--primary-main)] rounded-full bg-[var(--primary-main)] cursor-pointer text-white'
      >
        Back to Home
      </Button>
    </div>
  );
}
