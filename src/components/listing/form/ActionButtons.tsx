import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onDraft: () => void;
  onNext: () => void;
  onBack?: () => void;
}

export function ActionButtons({ onDraft, onNext, onBack }: ActionButtonsProps) {
  return (
    <div className='flex flex-col md:flex-row items-center justify-end gap-4 mt-8'>
      {onBack && (
        <Button
          variant='outline'
          className='rounded-full py-5 px-8 w-44 border-primary-main text-primary-main hover:bg-white cursor-pointer'
          type='button'
          onClick={onBack}
        >
          Back
        </Button>
      )}
      <Button
        variant='outline'
        className='rounded-full py-5 px-8 w-44 border-primary-main text-primary-main hover:bg-white cursor-pointer'
        type='button'
        onClick={onDraft}
      >
        Save as draft
      </Button>
      <Button
        type='button'
        className='rounded-full py-5 px-8 w-44 bg-primary-main text-white hover:bg-primary-main border border-primary-main cursor-pointer'
        onClick={onNext}
      >
        Continue
      </Button>
    </div>
  );
}
