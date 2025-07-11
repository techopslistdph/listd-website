import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import React from 'react';

export default function GenerateButton({
  onClick,
  isLoading,
}: {
  onClick: () => void;
  isLoading: boolean;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className='bg-transparent text-primary-main hover:bg-transparent cursor-pointer shadow-none'
            onClick={onClick}
            disabled={isLoading}
          >
            <svg
              width='23'
              height='22'
              viewBox='0 0 23 22'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className={`transition-transform duration-300 ${isLoading ? 'animate-spin' : ''}`}
            >
              <path
                d='M3.90625 7.77031C5.1625 4.81719 8.09219 2.75 11.5 2.75C13.3609 2.75 15.1469 3.49063 16.4641 4.80781L18.9109 7.25H16.375C15.7516 7.25 15.25 7.75156 15.25 8.375C15.25 8.99844 15.7516 9.5 16.375 9.5H21.625C22.2484 9.5 22.75 8.99844 22.75 8.375V3.125C22.75 2.50156 22.2484 2 21.625 2C21.0016 2 20.5 2.50156 20.5 3.125V5.66094L18.0578 3.21406C16.3188 1.475 13.9609 0.5 11.5 0.5C7.15938 0.5 3.43281 3.13438 1.83437 6.88906C1.59062 7.46094 1.85781 8.12188 2.42969 8.36563C3.00156 8.60938 3.6625 8.34219 3.90625 7.77031ZM21.1562 15.1297C21.4 14.5578 21.1375 13.8969 20.5656 13.6531C19.9937 13.4094 19.3328 13.6719 19.0891 14.2438C17.8281 17.1922 14.9031 19.25 11.5 19.25C9.63906 19.25 7.85313 18.5094 6.53594 17.1922L4.08906 14.75H6.625C7.24844 14.75 7.75 14.2484 7.75 13.625C7.75 13.0016 7.24844 12.5 6.625 12.5H1.375C0.751562 12.5 0.25 13.0016 0.25 13.625V18.875C0.25 19.4984 0.751562 20 1.375 20C1.99844 20 2.5 19.4984 2.5 18.875V16.3391L4.94219 18.7812C6.68125 20.525 9.03906 21.5 11.5 21.5C15.8359 21.5 19.5531 18.875 21.1562 15.1297Z'
                fill='#8771C5'
              />
            </svg>
            {isLoading ? (
              <p className='text-primary-main'>Generating...</p>
            ) : (
              <p className='text-primary-main'>Generate</p>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className='max-w-xs p-2'>
            Make sure you&apos;ve filled in property type, address, and other
            details for better AI suggestions
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
