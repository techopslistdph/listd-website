/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { useSignIn, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import google from '@/../public/images/icons/google.svg';
import facebook from '@/../public/images/icons/facebook.svg';
import AuthLayout from '@/components/auth/AuthLayout';
import { toast } from 'sonner';
import { FormInput } from '@/components/ui/form-input';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Eye, EyeIcon, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  remember: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const { signIn, isLoaded, setActive } = useSignIn();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        toast.success('Login successful! Redirecting...');
        window.location.href = '/'; // redirect after login
      } else {
        toast.error('Check your credentials.');
      }
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'errors' in err) {
        const errorObj = (err as { errors?: Array<{ longMessage?: string }> })
          .errors?.[0];
        const message = errorObj?.longMessage || 'Login failed';
        toast.error(message);
      } else {
        toast.error('Login failed');
      }
    } finally {
      setIsSubmitting(false);
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
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <AuthLayout
      title='Login'
      subtitle='Sign in to continue your property journey'
    >
      <FormProvider {...form}>
        <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput
            name='email'
            label='Email Address'
            type='email'
            placeholder='Enter your email'
            disabled={isSubmitting}
          />
          <div className='relative'>
            <FormInput
              name='password'
              label='Password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter your password'
              disabled={isSubmitting}
            />
            <button
              type='button'
              onClick={() => togglePasswordVisibility()}
              className='absolute right-3 top-12 -translate-y-1/2 text-neutral-mid hover:text-neutral-text cursor-pointer'
            >
              {showPassword ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </button>
          </div>
          <div className='flex items-center justify-between mb-2'>
            <Link
              href='/forgot-password'
              className='text-sm text-[var(--primary-main)] font-bold'
            >
              Forgot your password?
            </Link>
          </div>
          <div className='flex items-center my-8 gap-2 cursor-pointer'>
            <input
              type='checkbox'
              className='accent-[var(--primary-main)] cursor-pointer'
              {...form.register('remember')}
              disabled={isSubmitting}
            />
            <Label htmlFor='remember' className='text-base cursor-pointer'>
              Remember your details
            </Label>
          </div>
          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full cursor-pointer text-sm md:text-base bg-[var(--primary-main)] text-white font-semibold py-4 rounded-full mb-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
          >
            {isSubmitting ? (
              <>
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
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
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
          <button
            onClick={() => {
              router.push('/');
            }}
            type='button'
            disabled={isSubmitting}
            className='w-full cursor-pointer text-sm md:text-base border-2 border-[var(--primary-main)] text-[var(--primary-main)] font-semibold py-4 rounded-full mb-2 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Continue as a Guest
          </button>
        </form>
      </FormProvider>
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
          disabled={isSubmitting}
          aria-label='Sign in with Google'
          className='cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <Image src={google} alt='Google' width={40} height={40} />
        </button>
        <button
          onClick={() => handleSocialSignIn('facebook')}
          disabled={isSubmitting}
          aria-label='Sign in with Facebook'
          className='cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
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
