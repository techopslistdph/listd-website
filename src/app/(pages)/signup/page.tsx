/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import google from '@/../public/images/icons/google.svg';
import facebook from '@/../public/images/icons/facebook.svg';
import Image from 'next/image';
import AuthLayout from '@/components/auth/AuthLayout';
import { toast } from 'sonner';

export default function SignUpPage() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName: fullName,
        phoneNumber: mobile,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        toast.success('Sign up successful! Redirecting...');
        window.location.href = '/';
      } else if (result.status === 'missing_requirements') {
        // Handle verification requirements
        if (result.unverifiedFields?.includes('email_address')) {
          toast.info('Please verify your email address.');
          // You might want to show a verification UI here
        }
        if (result.unverifiedFields?.includes('phone_number')) {
          toast.info('Please verify your phone number.');
          // You might want to show a verification UI here
        }
      } else {
        toast.error('Please check your details and try again.');
      }
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'errors' in err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorObj = (err as any).errors?.[0];
        const message = errorObj?.longMessage || 'Sign up failed';
        toast.error(message);
      } else {
        toast.error('Sign up failed');
      }
    }
  };

  const handleSocialSignUp = (provider: 'google' | 'facebook') => {
    if (!isLoaded) return;
    signUp.authenticateWithRedirect({
      strategy: `oauth_${provider}`,
      redirectUrl: '/signup',
      redirectUrlComplete: '/',
    });
  };

  return (
    <AuthLayout
      title='Register to get Started'
      subtitle='Sign in to continue your property journey with Listd!'
    >
      <form className='space-y-5' onSubmit={handleSignUp}>
        <div>
          <Label className='mb-2'>
            Full name <span className='text-red-500'>*</span>
          </Label>
          <Input
            type='text'
            className='mb-2 px-6 py-5'
            placeholder='Enter your full name'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1'>
            <Label className='mb-2'>
              Email Address <span className='text-red-500'>*</span>
            </Label>
            <Input
              type='email'
              className='mb-2 px-6 py-5'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='flex-1'>
            <Label className='mb-2'>
              Mobile number <span className='text-red-500'>*</span>
            </Label>
            <Input
              type='tel'
              className='mb-2 px-6 py-5'
              placeholder='Enter mobile number'
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              // required
            />
          </div>
        </div>
        <div>
          <Label className='mb-2'>
            Password <span className='text-red-500'>*</span>
          </Label>
          <Input
            type='password'
            className='mb-2 px-6 py-5'
            placeholder='Enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Label className='mb-2'>
            Confirm your password <span className='text-red-500'>*</span>
          </Label>
          <Input
            type='password'
            className='mb-2  px-6 py-5'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className='text-red-500 text-sm mb-2'>{error}</div>}
        <button
          type='submit'
          className='w-full cursor-pointer bg-[var(--primary-main)] text-white font-semibold py-4 text-sm md:text-base rounded-full mb-2'
        >
          Sign up
        </button>
        <button
          type='button'
          className='w-full cursor-pointer border-2 border-[var(--primary-main)] text-[var(--primary-main)] text-sm md:text-base font-semibold py-4 rounded-full mb-2'
        >
          Continue as a Guest
        </button>
      </form>
      <div className='flex items-center my-5'>
        <div className='flex-1 h-px bg-[var(--neutral-mid)]' />
        <span className='mx-4 text-[var(--neutral-text)] text-base font-semibold'>
          OR
        </span>
        <div className='flex-1 h-px bg-[var(--neutral-mid)]' />
      </div>
      <div className='flex justify-center gap-8 mb-5'>
        <button
          onClick={() => handleSocialSignUp('google')}
          aria-label='Sign up with Google'
          className='cursor-pointer'
        >
          <Image src={google} alt='Google' width={40} height={40} />
        </button>
        <button
          onClick={() => handleSocialSignUp('facebook')}
          aria-label='Sign up with Facebook'
          className='cursor-pointer'
        >
          <Image src={facebook} alt='Facebook' width={40} height={40} />
        </button>
      </div>
      <p className='text-center text-sm text-gray-500'>
        Have an account already?{' '}
        <Link href='/login' className='text-primary font-bold underline'>
          Sign in here
        </Link>
      </p>
    </AuthLayout>
  );
}
