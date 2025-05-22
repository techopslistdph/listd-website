import successListing from '@/../public/images/icons/success-listing.svg';
import Image from 'next/image';
import { PropertyType } from '../types';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import downloadIcon from '@/../public/images/icons/download.svg';
interface ResultsStepProps {
  onHome: () => void;
  propertyType: PropertyType;
}

export function ResultsStep({ onHome, propertyType }: ResultsStepProps) {
  const pathname = usePathname();

  if (pathname.includes('/valuation')) {
    return (
      <div>
        <h2 className='text-2xl font-bold mb-6'>Property Results</h2>
        <div className='mb-6 shadow-sm rounded-lg p-4'>
          <div className='text-sm text-[var(--neutral-mid)] mb-1'>
            Estimated Property Value
          </div>
          <div className='heading-4 text-[var(--primary-main)]'>
            ₱2,622,715.20
          </div>
        </div>
        <div className='mb-6 shadow-sm rounded-lg p-4'>
          <div className='text-sm text-muted-foreground mb-1'>Country</div>
          <div className='text-lg font-semibold'>Philippines</div>
        </div>
        <div className='mb-6 shadow-sm rounded-lg p-4'>
          <div className='text-sm text-muted-foreground mb-1'>Address</div>
          <div className='text-lg font-semibold'>
            1234 Elm street, Springfield, USA
          </div>
        </div>
        <div className='mb-6 shadow-sm rounded-lg p-4'>
          <div className='text-sm text-muted-foreground mb-1'>Property</div>
          <div className='text-lg font-semibold capitalize'>{propertyType}</div>
        </div>
        <div className='flex flex-col md:flex-row justify-end items-center gap-5 mt-10'>
          <div className='flex cursor-pointer items-center gap-2'>
            <Image src={downloadIcon} alt='download' />
            <span className='text-[var(--primary-mid)]'>Download file</span>
          </div>
          <Button
            className='rounded-full py-5 px-8 w-44 border border-[var(--primary-main)] bg-white text-[var(--primary-main)] hover:bg-white cursor-pointer'
            onClick={onHome}
          >
            Back to Home
          </Button>
          <Button className='rounded-full py-5 px-8 w-44 bg-[var(--primary-main)] text-white hover:bg-[var(--primary-main)] border border-[var(--primary-main)] cursor-pointer'>
            Post
          </Button>
        </div>
      </div>
    );
  }

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
