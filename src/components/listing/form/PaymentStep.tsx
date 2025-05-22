import { FormData } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '../../ui/label';
import freelistingIcon from '@/../public/images/icons/freelisting.svg';
import packagenameIcon from '@/../public/images/icons/packagename.svg';
import Image from 'next/image';
import { ActionButtons } from './ActionButtons';

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
              ? 'border-[var(--primary-mid)]'
              : 'border-gray-200'
          }`}
          onClick={() => onChange('package', 'free')}
        >
          <Image src={freelistingIcon} alt='freelisting' />
          <div>
            <div className='font-bold text-[var(--neutral-text)]'>
              First 2 listings are{' '}
              <span className='text-[var(--primary-mid)]'>FREE!</span>
            </div>
            <div className='text-xs text-gray-500'>
              Click here to see our packages and rates
            </div>
          </div>
        </div>
        <div
          className={`border rounded-lg p-4 flex items-center gap-4 cursor-pointer ${
            data.package === 'paid'
              ? 'border-[var(--primary-mid)]'
              : 'border-gray-200'
          }`}
          onClick={() => onChange('package', 'paid')}
        >
          <Image src={packagenameIcon} alt='package name icon' />
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
          <div className='mb-6 flex flex-col gap-4'>
            {['5', '15', '45'].map((days) => (
              <div
                key={days}
                className={`border rounded-lg p-4 flex items-center shadow-md shadow-[var(--primary-mid)]/95 justify-between cursor-pointer ${
                  data.period === days
                    ? 'border-[var(--primary-mid)]'
                    : 'border-gray-200'
                }`}
                onClick={() => onChange('period', days)}
              >
                <div>
                  <div className='font-bold'>{days} Days</div>
                  <div className='text-xs text-gray-400'>Until 00/00</div>
                </div>
                <div className='flex flex-col items-end'>
                  <div>PHP</div>
                  <div className='text-xs text-gray-400'>PHP / day</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <h2 className='heading-5 mb-5'>Terms</h2>
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
        <div className='text-xs text-gray-400 mb-5 flex justify-between mt-2'>
          <span>Includes all taxes and brokers free</span>
          <span>0 per sqm</span>
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
      <ActionButtons onDraft={onDraft} onNext={onNext} />
    </div>
  );
}
