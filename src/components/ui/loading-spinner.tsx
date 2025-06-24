import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLogo?: boolean;
}

export function LoadingSpinner({
  className,
  size = 'md',
  showLogo = true,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const logoSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 h-[80vh]',
        className
      )}
    >
      {showLogo && (
        <div
          className={cn('font-bold text-primary-main', logoSizeClasses[size])}
        >
          Listd
        </div>
      )}
      <div className={cn('relative', sizeClasses[size])}>
        <svg
          className='animate-spin w-full h-full'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
            style={{ color: 'var(--primary-main)' }}
          />
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            style={{ color: 'var(--primary-main)' }}
          />
        </svg>
      </div>
    </div>
  );
}

export default LoadingSpinner;
