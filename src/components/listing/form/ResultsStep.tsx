import successListing from '@/../public/images/icons/success-listing.svg';
import Image from 'next/image';
import { PropertyType } from '../types';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import downloadIcon from '@/../public/images/icons/download.svg';
import { useState } from 'react';
import ImageUploadModal from './ImageUploadModal';
import WaitAlertModal from './WaitAlertModal';

interface ResultsStepProps {
  onHome: () => void;
  propertyType: PropertyType;
  valuationResult?: [estimate: string, location: string, propertyType: string];
}

export function ResultsStep({
  onHome,
  propertyType,
  valuationResult,
}: ResultsStepProps) {
  const pathname = usePathname();
  const [showWaitModal, setShowWaitModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // const handlePost = () => {
  //   setShowWaitModal(true);
  // };

  if (pathname.includes('/valuation')) {
    return (
      <>
        <div>
          <h2 className='text-2xl font-bold mb-6'>Property Results</h2>
          <div className='mb-6 shadow-sm rounded-lg p-4'>
            <div className='text-sm text-neutral-mid mb-1'>
              Estimated Property Value
            </div>
            <div className='heading-4 text-primary-main'>
              {Number(valuationResult?.[0]).toLocaleString('en-US', {
                style: 'currency',
                currency: 'PHP',
              })}
            </div>
          </div>
          <div className='mb-6 shadow-sm rounded-lg p-4'>
            <div className='text-sm text-muted-foreground mb-1'>Country</div>
            <div className='text-lg '>Philippines</div>
          </div>
          <div className='mb-6 shadow-sm rounded-lg p-4'>
            <div className='text-sm text-muted-foreground mb-1'>Address</div>
            <div className='text-lg '>{valuationResult?.[1]}</div>
          </div>
          <div className='mb-6 shadow-sm rounded-lg p-4'>
            <div className='text-sm text-muted-foreground mb-1'>Property</div>
            <div className='text-lg  capitalize'>
              {valuationResult?.[2].replaceAll('-', ' ')}
            </div>
          </div>
          <div className='flex flex-col md:flex-row justify-end items-center gap-5 mt-10'>
            <div className='flex cursor-pointer items-center gap-2'>
              <Image src={downloadIcon} alt='download' />
              <span className='text-primary-mid'>Download file</span>
            </div>
            <Button
              className='rounded-full py-5 px-8 w-44 border border-primary-main bg-white text-primary-main hover:bg-white cursor-pointer'
              onClick={onHome}
            >
              Back to Home
            </Button>
            {/* <Button
              className='rounded-full py-5 px-8 w-44 bg-primary-main text-white hover:bg-primary-main border border-primary-main cursor-pointer'
              onClick={handlePost}
            >
              Post
            </Button> */}
          </div>
        </div>
        {/* <WaitAlertModal
          open={showWaitModal}
          setOpen={setShowWaitModal}
          onUploadNow={() => setShowPhotoModal(true)}
        /> */}
        {/* <ImageUploadModal open={showPhotoModal} setOpen={setShowPhotoModal} /> */}
      </>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-[400px]'>
      <div className='mb-5'>
        <Image src={successListing} alt='success listing' className='mx-auto' />
        <h2 className='heading-5 mb-2 text-center my-5'>
          We&apos;ve posted your listing!
        </h2>
        <div className='text-neutral-mid body-sm text-center max-w-md'>
          Your {propertyType} listing has been successfully created. You can
          change some of the details anytime you need!
        </div>
      </div>
      <Button
        onClick={onHome}
        className='px-8 py-6 w-56 hover:bg-primary-main rounded-full bg-primary-main cursor-pointer text-white'
      >
        Back to Home
      </Button>
      <WaitAlertModal
        open={showWaitModal}
        setOpen={setShowWaitModal}
        onUploadNow={() => setShowPhotoModal(true)}
      />
      <ImageUploadModal open={showPhotoModal} setOpen={setShowPhotoModal} />
    </div>
  );
}
