import { ArrowLeft } from 'lucide-react';
import { Check } from 'lucide-react';
import { Step, FormData } from '../types';

const steps = [
  'Property Details',
  'Title and Description',
  'Payment',
  'Results',
];

interface StepperProps {
  step: Step;
  onBack: () => void;
  data: FormData;
  onChange: (field: keyof FormData, value: unknown) => void;
}

export function Stepper({ step, onBack, data, onChange }: StepperProps) {
  return (
    <div>
      <div className='flex justify-between items-center'>
        <div
          className='flex items-center gap-2 mb-5 cursor-pointer'
          onClick={onBack}
        >
          <ArrowLeft
            className='w-5 h-5 text-[var(--primary-main)]'
            strokeWidth={3}
          />
          <span className='font-semibold text-lg text-[var(--primary-main)]'>
            Back
          </span>
        </div>
        {step === 1 && (
          <div className='flex gap-2 bg-gray-100 rounded-lg p-1 mb-5'>
            <button
              className={`px-4 py-1 rounded-lg text-sm font-semibold ${
                data.forSale
                  ? 'bg-[var(--primary-main)] text-white'
                  : 'text-gray-700'
              }`}
              onClick={() => onChange('forSale', true)}
              type='button'
            >
              For sale
            </button>
            <button
              className={`px-4 py-1 rounded-lg text-sm font-semibold ${
                !data.forSale
                  ? 'bg-[var(--primary-main)] text-white'
                  : 'text-gray-700'
              }`}
              onClick={() => onChange('forSale', false)}
              type='button'
            >
              For rent
            </button>
          </div>
        )}
      </div>
      <div className='relative flex items-center justify-between mb-8 w-full '>
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
              className={`w-5 h-5 flex items-center justify-center mb-2
              ${
                idx === step
                  ? 'border-4 border-[var(--primary-main)] bg-white text-[var(--primary-main)]'
                  : idx < step
                  ? 'bg-[var(--primary-main)] border-4 border-[var(--primary-main)] text-white'
                  : 'bg-[var(--primary-light)] border-4 border-gray-200 text-gray-200 opacity-60'
              }
              rounded-full transition-colors duration-200`}
            >
              {idx < step && (
                <Check className='w-3 h-3 text-white' strokeWidth={3} />
              )}
            </div>
            <span
              className={`text-base font-medium mt-1
              ${idx === step ? 'text-[var(--primary-main)]' : 'text-gray-400'}`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
