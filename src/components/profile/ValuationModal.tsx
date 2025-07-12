/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useValuationPDF } from '@/hooks/useValuationPDF';
import { formatCurrency } from '@/lib/utils/generateValuationPDF';
import {
  formatPropertyType,
  formatTransactionType,
  mapImage,
} from '@/lib/utils/Valuation';
import { ClockIcon } from 'lucide-react';
import Image from 'next/image';

export default function ValuationModal({ valuation }: any) {
  const { inputPayload, aiResult, manualValuationResult } = valuation;
  const { isGeneratingPDF, handleDownloadPDF } = useValuationPDF({
    valuationResult: valuation,
    propertyType: inputPayload?.propertyType,
  });
  const DynamicInfoSection = ({
    title,
    data,
  }: {
    title: string;
    data: Record<string, any>;
  }) => {
    if (!data || typeof data !== 'object') return null;

    const renderValue = (value: any, key: string): React.ReactNode => {
      if (value === null || value === undefined) {
        return <span className='text-gray-400'>-</span>;
      }

      if (Array.isArray(value)) {
        return (
          <span>
            {value.map((item, index) =>
              typeof item === 'object' && item !== null ? (
                <pre
                  key={index}
                  className='bg-gray-100 rounded p-2 text-xs overflow-x-auto mb-1'
                >
                  {JSON.stringify(item, null, 2)}
                </pre>
              ) : (
                <span key={index}>
                  {item?.toString().replace(/[_-]/g, ' ')}
                  {index < value.length - 1 ? ', ' : ''}
                </span>
              )
            )}
          </span>
        );
      }

      if (typeof value === 'object') {
        // Special handling for low/high objects
        if (value.low !== undefined && value.high !== undefined) {
          return (
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-2'>
                <span className='font-medium text-gray-600'>Low:</span>
                <span className='capitalize'>{formatCurrency(value.low)}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='font-medium text-gray-600'>High:</span>
                <span className='capitalize'>{formatCurrency(value.high)}</span>
              </div>
            </div>
          );
        }

        return (
          <div className='ml-4'>
            <pre className='bg-gray-100 rounded p-2 text-xs overflow-x-auto'>
              {JSON.stringify(value, null, 2)}
            </pre>
          </div>
        );
      }

      // Format as currency if key includes "estimate"
      if (key.toLowerCase().includes('estimate') && typeof value === 'number') {
        return <span className='capitalize'>{formatCurrency(value)}</span>;
      }

      // Format as date if key includes "date"
      if (key.toLowerCase().includes('date') && typeof value === 'string') {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return (
            <span className='capitalize'>
              {date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          );
        }
      }

      return (
        <span className='capitalize'>
          {value?.toString().replace(/[_-]/g, ' ')}
        </span>
      );
    };

    return (
      <section className='bg-gray-50 rounded-lg p-4 mb-2'>
        <h3 className='font-semibold mb-3 text-primary-main text-lg'>
          {title}
        </h3>
        <div className='grid grid-cols-1 gap-2.5'>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className='flex items-start gap-5 py-1'>
              <span className='font-medium min-w-[120px] text-gray-600 capitalize'>
                {key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/[_-]/g, ' ')
                  .trim()}
                :
              </span>
              <div className='flex-1'>{renderValue(value, key)}</div>
            </div>
          ))}
        </div>
      </section>
    );
  };
  return (
    <Dialog>
      <DialogTrigger>
        <div
          key={valuation?.id}
          className='cursor-pointer flex flex-col lg:flex-row bg-white rounded-2xl lg:rounded-3xl shadow-2xl shadow-[#F7EFFD] p-4 lg:p-6 w-full lg:items-stretch mb-2 transition'
        >
          {/* Image */}
          <div className='flex-shrink-0 flex items-center mb-4 lg:mb-0'>
            <Image
              src={mapImage(
                valuation?.inputPayload?.propertyType || 'condominium'
              )}
              alt='static image'
              width={240}
              height={200}
              className='w-full lg:w-60 h-48 lg:h-56 object-cover rounded-xl lg:rounded-2xl'
            />
          </div>
          {/* Details */}
          <div className='flex flex-col justify-between text-left lg:ml-8 flex-1'>
            <div>
              <span className='px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm font-medium bg-primary-light text-primary-main mb-2 inline-block'>
                {valuation?.inputPayload?.transactionType
                  ?.replace('-', ' ')
                  .replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </span>
              <div className='text-lg lg:text-xl font-bold mb-1'>
                {valuation?.inputPayload.buildingName ||
                  `${valuation.inputPayload.propertyType
                    .replace('-', ' ')
                    .replace(/\b\w/g, (l: string) =>
                      l.toUpperCase()
                    )} ${valuation.inputPayload.transactionType.replace(
                    '-',
                    ' '
                  )} in ${valuation?.inputPayload?.location}` ||
                  'Untitled Valuation'}
              </div>
              {valuation?.inputPayload?.location && (
                <div className='flex items-center text-gray-400 text-sm lg:text-base mb-1'>
                  <svg
                    className='w-4 h-4 lg:w-5 lg:h-5 mr-1'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                  {valuation.inputPayload.location || 'Location Not Available'}
                </div>
              )}

              <div className='flex flex-col justify-between items-start gap-2 lg:gap-0 mt-5'>
                <div className='flex flex-col text-gray-400 text-sm lg:text-base mb-1'>
                  <span className='font-medium text-black mr-2'>
                    Price value
                  </span>
                  <span className='flex items-center gap-1'>
                    <ClockIcon className='w-3 h-3 lg:w-4 lg:h-4 mr-1' />
                    as of{' '}
                    {new Date(
                      valuation?.aiResult?.valuationDate
                    ).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className='flex items-end justify-end h-full'>
                  <div className='text-lg lg:text-xl font-bold text-primary-main'>
                    {formatCurrency(valuation?.aiResult?.estimated) ||
                      'Price not available'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className='max-w-5xl min-w-5xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            Valuation:{' '}
            {inputPayload?.buildingName ||
              `${formatPropertyType(inputPayload?.propertyType)} ${formatTransactionType(inputPayload?.transactionType)} in ${inputPayload?.location}` ||
              'Valuation Details'}
          </DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-6'>
          {/* Image */}
          <Image
            src={mapImage(
              valuation?.inputPayload?.propertyType || 'condominium'
            )}
            alt='static image'
            width={320}
            height={220}
            className='w-full h-54 object-cover rounded-xl'
          />

          {/* Property Details */}
          <DynamicInfoSection title='Property Details' data={inputPayload} />

          {/* AI Valuation Result */}
          <DynamicInfoSection title='AI Valuation Result' data={aiResult} />
          <DynamicInfoSection
            title='Manual Valuation Result'
            data={manualValuationResult}
          />
        </div>
        <div
          className={`flex cursor-pointer items-center ml-auto py-4  px-7 rounded-full bg-primary-main gap-2 ${isGeneratingPDF ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={!isGeneratingPDF ? handleDownloadPDF : undefined}
        >
          <span className='text-white text-sm font-medium'>
            {isGeneratingPDF ? 'Generating Report...' : 'Download Report'}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
