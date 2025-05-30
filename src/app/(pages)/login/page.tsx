/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import loginImage from '@/../public/images/login-image.png';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import google from '@/../public/images/icons/google.svg';
import facebook from '@/../public/images/icons/facebook.svg';
import AuthLayout from '@/components/auth/AuthLayout';
import { toast } from 'sonner';

export default function LoginPage() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        toast.success('Login successful! Redirecting...');
        window.location.href = '/'; // redirect after login
      } else {
        toast.error('Check your credentials.');
      }
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'errors' in err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorObj = (err as any).errors?.[0];
        const message = errorObj?.longMessage || 'Login failed';
        toast.error(message);
      } else {
        toast.error('Login failed');
      }
    }
  };

  const handleSocialSignIn = (provider: 'google' | 'facebook') => {
    if (!isLoaded) return;
    signIn.authenticateWithRedirect({
      strategy: `oauth_${provider}`,
      redirectUrl: '/login',
      redirectUrlComplete: '/',
    });
  };

  return (
    <AuthLayout
      title='Login'
      subtitle='Sign in to continue your property journey'
    >
      <form className='space-y-6' onSubmit={handleEmailPasswordSignIn}>
        <div>
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
        <div className='flex items-center justify-between mb-2'>
          <Link
            href='#'
            className='text-sm text-[var(--primary-main)] font-bold'
          >
            Forgot your password?
          </Link>
        </div>
        <div
          className='flex items-center my-8 gap-2 cursor-pointer'
          onClick={() => setRemember(!remember)}
        >
          <input
            type='checkbox'
            className='accent-[var(--primary-main)] cursor-pointer'
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />

          <Label htmlFor='remember' className='text-base cursor-pointer'>
            Remember your details
          </Label>
        </div>
        {error && <div className='text-red-500 text-sm mb-2'>{error}</div>}
        <button
          type='submit'
          className='w-full cursor-pointer text-sm md:text-base bg-[var(--primary-main)] text-white font-semibold py-4 rounded-full mb-2'
        >
          Login
        </button>
        <button className='w-full cursor-pointer text-sm md:text-base border-2 border-[var(--primary-main)] text-[var(--primary-main)] font-semibold py-4 rounded-full mb-2'>
          Continue as a Guest
        </button>
      </form>
      <div className='flex items-center my-8'>
        <div className='flex-1 h-px bg-[var(--neutral-mid)]' />
        <span className='mx-4 text-[var(--neutral-text)] text-base font-semibold'>
          OR
        </span>
        <div className='flex-1 h-px bg-[var(--neutral-mid)]' />
      </div>
      <div className='flex justify-center gap-8 mb-8'>
        <button
          onClick={() => handleSocialSignIn('google')}
          aria-label='Sign in with Google'
          className='cursor-pointer'
        >
          <Image src={google} alt='Google' width={40} height={40} />
        </button>
        <button
          onClick={() => handleSocialSignIn('facebook')}
          aria-label='Sign in with Facebook'
          className='cursor-pointer'
        >
          <Image src={facebook} alt='Facebook' width={40} height={40} />
        </button>
      </div>
      <p className='text-center text-sm text-gray-500'>
        Don&apos;t have an account?{' '}
        <Link href='/signup' className='text-primary font-bold underline'>
          Sign up here
        </Link>
      </p>
    </AuthLayout>
  );
}
