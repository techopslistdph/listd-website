import { FormData } from '../types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '../../ui/label';
import { ActionButtons } from './ActionButtons';
import { SparkleIcon } from 'lucide-react';

interface TitleDescriptionStepProps {
  data: FormData;
  onChange: (field: keyof FormData, value: unknown) => void;
  onNext: () => void;
  onDraft: () => void;
}

export function TitleDescriptionStep({
  data,
  onChange,
  onNext,
  onDraft,
}: TitleDescriptionStepProps) {
  return (
    <div>
      <h2 className='text-lg font-bold mb-4'>Title and Description</h2>
      <div className='mb-4 space-y-4'>
        <Label>Title</Label>
        <Input
          placeholder='Enter your title'
          value={data.title}
          onChange={(e) => onChange('title', e.target.value)}
          className='mb-4'
        />
      </div>
      <div className='mb-4 space-y-4'>
        <Label>Description</Label>
        <Textarea
          placeholder='Tell us what makes your place special!'
          value={data.description}
          onChange={(e) => onChange('description', e.target.value)}
          className=' min-h-[200px]'
        />
        <div className='mb-8 text-neutral-mid flex gap-1 items-center'>
          <SparkleIcon className='w-5 h-5' />
          <p>Type a description to see AI suggestions</p>
        </div>
      </div>

      <ActionButtons onDraft={onDraft} onNext={onNext} />
    </div>
  );
}
