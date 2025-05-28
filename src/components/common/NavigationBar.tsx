import Link from 'next/link';
import React from 'react';
import { Button } from './Button';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '../ui/sheet';
import {
  SignInButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';
import UserProfileCard from './UserProfileCard';

export default function NavigationBar({
  navigtionItems,
}: {
  navigtionItems: { label: string; href: string }[];
}) {
  return (
    <div className='flex justify-between items-center p-4 md:p-8 container mx-auto'>
      <div className='flex items-center gap-4'>
        <Sheet>
          <SheetTrigger asChild>
            <button className='md:hidden p-2 flex flex-col gap-1 cursor-pointer'>
              <div className='w-3 h-0.5 bg-black rounded-full'></div>
              <div className='w-4 h-0.5 bg-black rounded-full'></div>
              <div className='w-5 h-0.5 bg-black rounded-full'></div>
            </button>
          </SheetTrigger>
          <SheetContent side='left' className='p-0'>
            <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
            <nav className='flex flex-col gap-8 p-6'>
              <Link href={'/'}>
              <p className='text-3xl font-bold text-[var(--primary-main)]'>
                Listdw
              </p></Link>

              {navigtionItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className=' font-medium text-neutral-text'
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
       <Link href={'/'}> <p className='text-2xl font-bold text-[var(--primary-main)]'>Listd</p></Link>
        <div className='hidden md:flex items-center gap-10 ml-8'>
          {navigtionItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className='text-neutral-text font-medium'
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Clerk Authentication */}
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton>
            <Button variant='primary' className='px-6 py-2 text-base font-normal'>
              Login
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserProfileCard />
        </SignedIn>
      </div>
    </div>
  );
}
