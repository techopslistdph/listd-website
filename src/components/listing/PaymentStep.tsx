import { FormData } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';

interface PaymentStepProps {
  data: FormData;
  onChange: (field: keyof FormData, value: unknown) => void;
  onNext: () => void;
  onBack: () => void;
  onDraft: () => void;
}

export function PaymentStep({
  data,
  onChange,
  onNext,
  onDraft,
}: PaymentStepProps) {
  return (
    <div>
      <h2 className='heading-5 mb-4'>Payment Packages</h2>
      <div className='mb-6'>
        <div
          className={`border rounded-lg p-4 mb-2 flex items-center gap-4 cursor-pointer ${
            data.package === 'free'
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200'
          }`}
          onClick={() => onChange('package', 'free')}
        >
          <span className='text-2xl'>🏷️</span>
          <div>
            <div className='font-bold text-purple-700'>
              First 2 listings are <span className='text-blue-600'>FREE!</span>
            </div>
            <div className='text-xs text-gray-500'>
              Click here to see our packages and rates
            </div>
          </div>
        </div>
        <div
          className={`border rounded-lg p-4 flex items-center gap-4 cursor-pointer ${
            data.package === 'paid'
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200'
          }`}
          onClick={() => onChange('package', 'paid')}
        >
          <span className='text-2xl'>🏷️</span>
          <div>
            <div className='font-bold'>Package name</div>
            <div className='text-xs text-gray-500'>$20.00/month</div>
          </div>
        </div>
      </div>
      {/* Only show period selection if package is not free */}
      {data.package !== 'free' && (
        <>
          <h3 className='font-bold mb-2'>Choose a period for your property</h3>
          <div className='mb-6 grid grid-cols-3 gap-4'>
            {['5', '15', '45'].map((days) => (
              <div
                key={days}
                className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer ${
                  data.period === days
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200'
                }`}
                onClick={() => onChange('period', days)}
              >
                <div className='font-bold text-lg'>{days} Days</div>
                <div className='text-xs text-gray-400'>Until 00/00</div>
                <div className='font-bold mt-2'>PHP</div>
                <div className='text-xs text-gray-400'>PHP / day</div>
              </div>
            ))}
          </div>
        </>
      )}
      <h2 className='heading-5 mb-2'>Terms</h2>
      <div className='mb-4'>
        <div className='space-y-4'>
          <Label>Gross Asking Price</Label>
          <Input
            placeholder='PHP'
            value={data.grossAskingPrice}
            onChange={(e) => onChange('grossAskingPrice', e.target.value)}
            className='mb-1'
          />
        </div>
        <div className='text-xs text-gray-400 mb-4'>
          Includes all taxes and brokers free
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-4'>
            <Label>Downpayment</Label>
            <div className='grid grid-cols-2 gap-4'>
              <Input
                placeholder='0%'
                value={data.downPaymentPercent}
                onChange={(e) => onChange('downPaymentPercent', e.target.value)}
              />
              <Input
                placeholder='PHP'
                value={data.downPaymentPHP}
                onChange={(e) => onChange('downPaymentPHP', e.target.value)}
              />
            </div>
          </div>

          <div className='space-y-4'>
            <Label>Commission</Label>
            <div className='grid grid-cols-2 gap-4'>
              <Input
                placeholder='0%'
                value={data.commissionPercent}
                onChange={(e) => onChange('commissionPercent', e.target.value)}
              />
              <Input
                placeholder='PHP'
                value={data.commissionPHP}
                onChange={(e) => onChange('commissionPHP', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-end gap-4 mt-8'>
        <Button variant='outline' type='button' onClick={onDraft}>
          Save as draft
        </Button>
        <Button type='button' onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}
