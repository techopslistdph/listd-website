/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { useSignUp } from '@clerk/nextjs';
import Link from 'next/link';
import google from '@/../public/images/icons/google.svg';
import facebook from '@/../public/images/icons/facebook.svg';
import Image from 'next/image';
import AuthLayout from '@/components/auth/AuthLayout';
import { toast } from 'sonner';
import { FormInput } from '@/components/ui/form-input';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';

const signUpSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    mobile: z
      .string()
      .regex(/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number')
      .optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    try {
      const result = await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.fullName,
        phoneNumber: data.mobile,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        toast.success('Sign up successful! Redirecting...');
        window.location.href = '/';
      } else if (result.status === 'missing_requirements') {
        if (result.unverifiedFields?.includes('email_address')) {
          toast.info('Please verify your email address.');
        }
        if (result.unverifiedFields?.includes('phone_number')) {
          toast.info('Please verify your phone number.');
        }
      } else {
        toast.error('Please check your details and try again.');
      }
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'errors' in err) {
        const errorObj = (err as { errors?: Array<{ longMessage?: string }> })
          .errors?.[0];
        const message = errorObj?.longMessage || 'Sign up failed';
        toast.error(message);
      } else {
        toast.error('Sign up failed');
      }
    } finally {
      setIsSubmitting(false);
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
      <FormProvider {...form}>
        <form className='space-y-5' onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput
            name='fullName'
            label='Full name'
            placeholder='Enter your full name'
            disabled={isSubmitting}
          />
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1'>
              <FormInput
                name='email'
                label='Email Address'
                type='email'
                placeholder='Enter your email'
                disabled={isSubmitting}
              />
            </div>
            <div className='flex-1'>
              <FormInput
                name='mobile'
                label='Mobile number'
                type='tel'
                placeholder='Enter mobile number'
                disabled={isSubmitting}
              />
            </div>
          </div>
          <FormInput
            name='password'
            label='Password'
            type='password'
            placeholder='Enter your password'
            disabled={isSubmitting}
          />
          <FormInput
            name='confirmPassword'
            label='Confirm your password'
            type='password'
            placeholder='Confirm password'
            disabled={isSubmitting}
          />
          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full cursor-pointer bg-[var(--primary-main)] text-white font-semibold py-4 text-sm md:text-base rounded-full mb-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
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
                Signing up...
              </>
            ) : (
              'Sign up'
            )}
          </button>
          <button
            type='button'
            disabled={isSubmitting}
            className='w-full cursor-pointer border-2 border-[var(--primary-main)] text-[var(--primary-main)] text-sm md:text-base font-semibold py-4 rounded-full mb-2 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Continue as a Guest
          </button>
        </form>
      </FormProvider>
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
          disabled={isSubmitting}
          aria-label='Sign up with Google'
          className='cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <Image src={google} alt='Google' width={40} height={40} />
        </button>
        <button
          onClick={() => handleSocialSignUp('facebook')}
          disabled={isSubmitting}
          aria-label='Sign up with Facebook'
          className='cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
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
