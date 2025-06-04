// src/components/AuthLayout.tsx
import Image from 'next/image';
import loginImage from '@/../public/images/login-image.png';
import Link from 'next/link';

export default function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className='min-h-screen grid grid-cols-1 md:grid-cols-2'>
      <div className='flex flex-col justify-center w-full max-w-xl mx-auto px-8 py-12 bg-white'>
        <Link href={'/'}>
          <p className='text-2xl font-semibold text-[var(--primary-main)] ursor-pointer'>
            Listd
          </p>
        </Link>
        <Link
          href='/'
          className='text-sm text-primary font-bold mt-5 mb-5 flex cursor-pointer items-center gap-2'
        >
          <span className='text-lg'>&larr;</span> Back to website
        </Link>
        <h1 className='heading-2 mb-2'>{title}</h1>
        <p className='text-gray-400 mb-5 text-sm'>{subtitle}</p>
        {children}
      </div>
      <div className='hidden md:block flex-1 relative'>
        <Image
          src={loginImage}
          alt='Login visual'
          fill
          className='object-cover'
          priority
        />
      </div>
    </div>
  );
}
