import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function LoginSecurity() {
  return (
    <div className='w-full'>
      {/* Password Section */}
      <div className='mb-6 lg:mb-8'>
        <h2 className='font-bold text-base lg:text-lg mb-2'>Password</h2>
        <div className='rounded-lg p-4 lg:p-5 shadow-lg shadow-[#F7EFFD] flex items-center justify-between cursor-pointer transition'>
          <div>
            <p className='font-semibold text-sm lg:text-base mb-1'>Password</p>
            <p className='text-xs lg:text-sm text-neutral-mid'>
              Last updated 11 minutes ago
            </p>
          </div>
          <ChevronRight className='h-5 w-5 lg:h-6 lg:w-6 text-neutral-mid' />
        </div>
      </div>

      {/* Account Section */}
      <div className='mb-4'>
        <h2 className='font-bold text-base lg:text-lg mb-2'>Account</h2>
        <div className='space-y-3 lg:space-y-4'>
          <div className='rounded-lg p-4 lg:p-5 shadow-lg shadow-[#F7EFFD] flex items-center justify-between cursor-pointer transition'>
            <div>
              <p className='font-semibold text-sm lg:text-base mb-1'>
                Deactivate your account
              </p>
              <p className='text-xs lg:text-sm text-neutral-mid'>
                This action cannot be undone
              </p>
            </div>
            <ChevronRight className='h-5 w-5 lg:h-6 lg:w-6 text-neutral-mid' />
          </div>
          <div className='rounded-lg p-4 lg:p-5 shadow-lg shadow-[#F7EFFD] flex items-center justify-between cursor-pointer transition'>
            <div>
              <p className='font-semibold text-sm lg:text-base mb-1'>
                Delete your account
              </p>
              <p className='text-xs lg:text-sm text-neutral-mid'>
                This action cannot be undone
              </p>
            </div>
            <ChevronRight className='h-5 w-5 lg:h-6 lg:w-6 text-neutral-mid' />
          </div>
        </div>
      </div>
    </div>
  );
}
