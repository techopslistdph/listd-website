import React from 'react';
import Image from 'next/image';
import qrCode from '../../../public/images/sample-qr.png';
import phone from '../../../public/images/phone-mockup.png';

export default function DownloadSection() {
  return (
    <section className='bg-[#f3f7fc] flex justify-center items-center relative overflow-hidden  md:pt-12 min-h-[45vh] md:min-h-auto'>
      <div className='flex flex-col md:flex-row justify-center max-w-5xl w-full px-4 relative z-10'>
        {/* Left: Text and QR */}
        <div
          className='md:w-1/3 flex flex-col items-start md:items-start mb-8 md:mb-0 
          text-left md:text-left
          px-2 md:px-0
        '
        >
          <h2 className='text-2xl md:text-2xl font-bold mb-2'>Download now!</h2>
          <p className='text-black mb-6 text-left md:text-left text-lg md:text-base'>
            Experience seamless access on your
            <br className='hidden md:block' />
            mobile and tablet devices.
          </p>
          <div className='bg-white p-2 md:p-3  shadow-md w-fit mb-2 md:mb-0'>
            <Image
              src={qrCode}
              alt='QR Code'
              width={296}
              height={296}
              className='w-32 md:w-64 h-32 md:h-64 object-contain'
              priority
            />
          </div>
        </div>
        {/* Right: Phone Image */}
        <div className='md:w-1/2 flex justify-center items-center mt-14'>
          <div className='hidden md:block relative w-[550px] h-96 mx-auto'>
            <Image
              src={phone}
              alt='Phone'
              fill
              className='object-contain drop-shadow-2xl'
              priority
            />
          </div>
        </div>
      </div>
      {/* Mobile phone image overlay */}
      <div className='block md:hidden absolute -bottom-16 w-[350px] h-[350px] z-0 pointer-events-none'>
        <Image
          src={phone}
          alt='Phone'
          fill
          className='object-contain'
          priority
        />
      </div>
    </section>
  );
}
