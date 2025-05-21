import { Button } from '@/components/ui/button';

interface ResultsStepProps {
  onHome: () => void;
}

export function ResultsStep({ onHome }: ResultsStepProps) {
  return (
    <div className='flex flex-col items-center justify-center min-h-[400px]'>
      <div className='mb-8'>
        <span className='inline-block bg-purple-100 rounded-full p-6 mb-4'>
          <span className='text-5xl'>🏅</span>
        </span>
        <h2 className='text-2xl font-bold mb-2'>
          We&apos;ve posted your listing!
        </h2>
        <div className='text-gray-500 text-center max-w-md'>
          Your condominium listing has been successfully created. You can change
          some of the details anytime you need!
        </div>
      </div>
      <Button onClick={onHome} className='px-8 py-3 text-lg rounded-full'>
        Back to Home
      </Button>
    </div>
  );
}
