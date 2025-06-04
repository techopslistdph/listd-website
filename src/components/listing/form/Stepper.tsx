import { ArrowLeft } from 'lucide-react';
import { Check } from 'lucide-react';
import { Step, FormData } from '../types';
import { usePathname } from 'next/navigation';

const defaultSteps = [
  'Property Details',
  'Title and Description',
  'Payment',
  'Results',
];

const valuationSteps = ['Property Details', 'Result'];

interface StepperProps {
  step: Step;
  onBack: () => void;
  data: FormData;
  onChange: (field: keyof FormData, value: unknown) => void;
}

export function Stepper({ step, onBack, data, onChange }: StepperProps) {
  const pathname = usePathname();
  const steps = pathname.includes('/valuation') ? valuationSteps : defaultSteps;

  return (
    <div>
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0'>
        <div
          className='flex items-center gap-2 mb-2 sm:mb-5 cursor-pointer'
          onClick={onBack}
        >
          <ArrowLeft
            className='w-4 h-4 sm:w-5 sm:h-5 text-primary-main'
            strokeWidth={3}
          />
          <span className='font-semibold text-base sm:text-lg text-primary-main'>
            Back
          </span>
        </div>
        {steps.length === 4 && step === 1 && (
          <div className='flex gap-2 bg-gray-100 rounded-lg p-1 mb-2 sm:mb-5'>
            <button
              className={`px-3 sm:px-4 py-1 rounded-lg text-xs sm:text-sm font-semibold ${
                data.forSale ? 'bg-primary-main text-white' : 'text-gray-700'
              }`}
              onClick={() => onChange('forSale', true)}
              type='button'
            >
              For sale
            </button>
            <button
              className={`px-3 sm:px-4 py-1 rounded-lg text-xs sm:text-sm font-semibold ${
                !data.forSale ? 'bg-primary-main text-white' : 'text-gray-700'
              }`}
              onClick={() => onChange('forSale', false)}
              type='button'
            >
              For rent
            </button>
          </div>
        )}
      </div>
      <div className='relative flex items-center justify-between mb-6 sm:mb-8 w-full'>
        {/* Horizontal line */}
        <div
          className='absolute top-3 left-0 right-0 h-1 bg-gray-100 z-0'
          style={{ transform: 'translateY(-50%)' }}
        />
        {steps.map((label, idx) => (
          <div
            key={label}
            className='relative z-10 flex-1 flex flex-col items-center'
          >
            <div
              className={`w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center mb-1 sm:mb-2
              ${
                idx === step
                  ? 'border-4 border-primary-main bg-white text-primary-main'
                  : idx < step
                    ? 'bg-primary-main border-4 border-primary-main text-white'
                    : 'bg-primary-light border-4 border-gray-200 text-gray-200 opacity-60'
              }
              rounded-full transition-colors duration-200`}
            >
              {idx < step && (
                <Check
                  className='w-2 h-2 sm:w-3 sm:h-3 text-white'
                  strokeWidth={3}
                />
              )}
            </div>
            <span
              className={`text-[10px] xs:text-xs sm:text-sm lg:text-base font-medium mt-1 text-center
              ${idx === step ? 'text-primary-main' : 'text-gray-400'}`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
