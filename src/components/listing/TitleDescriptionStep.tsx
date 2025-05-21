import { FormData } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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
      <Input
        placeholder='Enter your title'
        value={data.title}
        onChange={(e) => onChange('title', e.target.value)}
        className='mb-4'
      />
      <Textarea
        placeholder='Tell us what makes your place special!'
        value={data.description}
        onChange={(e) => onChange('description', e.target.value)}
        className='mb-8 min-h-[200px]'
      />
      <div className='flex justify-end gap-4'>
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
