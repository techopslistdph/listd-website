import successListing from '@/../public/images/icons/success-listing.svg';
import Image from 'next/image';
import { PropertyType } from '../types';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import downloadIcon from '@/../public/images/icons/download.svg';
import { useState } from 'react';
import ImageUploadModal from './ImageUploadModal';
import WaitAlertModal from './WaitAlertModal';
import { AiValuation } from '@/lib/queries/hooks/types/ai-generate';
import { generateValuationPDF } from '@/lib/utils/generateValuationPDF';
import { toast } from 'sonner';

interface ResultsStepProps {
  onHome: () => void;
  propertyType: PropertyType;
  valuationResult?: AiValuation;
}

export function ResultsStep({
  onHome,
  propertyType,
  valuationResult,
}: ResultsStepProps) {
  const pathname = usePathname();
  const [showWaitModal, setShowWaitModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const router = useRouter();
  const handleDownloadPDF = async () => {
    if (!valuationResult) {
      toast.error('No valuation data available');
      return;
    }

    try {
      setIsGeneratingPDF(true);
      try {
        await generateValuationPDF({
          valuation: valuationResult,
          propertyType: propertyType,
        });
        toast.success('PDF report opened for printing');
      } catch (pdfError) {
        console.warn(
          'PDF generation failed, falling back to HTML download:',
          pdfError
        );

        toast.success('HTML report downloaded successfully');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

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
              {Number(valuationResult?.aiResult?.estimated).toLocaleString(
                'en-US',
                {
                  style: 'currency',
                  currency: 'PHP',
                }
              )}
            </div>
          </div>
          <div className='mb-6 shadow-sm rounded-lg p-4'>
            <div className='text-sm text-muted-foreground mb-1'>Country</div>
            <div className='text-lg '>Philippines</div>
          </div>
          <div className='mb-6 shadow-sm rounded-lg p-4'>
            <div className='text-sm text-muted-foreground mb-1'>Address</div>
            <div className='text-lg '>
              {valuationResult?.inputPayload?.location}
            </div>
          </div>
          <div className='mb-6 shadow-sm rounded-lg p-4'>
            <div className='text-sm text-muted-foreground mb-1'>Property</div>
            <div className='text-lg  capitalize'>
              {valuationResult?.inputPayload?.propertyType?.replaceAll(
                '-',
                ' '
              )}
            </div>
          </div>
          <div className='flex flex-col md:flex-row justify-end items-center gap-5 mt-10'>
            <div
              className={`flex cursor-pointer items-center gap-2 ${isGeneratingPDF ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={!isGeneratingPDF ? handleDownloadPDF : undefined}
            >
              <Image src={downloadIcon} alt='download' />
              <span className='text-primary-mid'>
                {isGeneratingPDF ? 'Generating Report...' : 'Download Report'}
              </span>
            </div>
            <Button
              className='rounded-full py-5 px-8 w-44 border border-primary-main bg-white text-primary-main hover:bg-white cursor-pointer'
              onClick={() => router.push('/profile')}
            >
              View My Valuation
            </Button>
          </div>
        </div>
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
