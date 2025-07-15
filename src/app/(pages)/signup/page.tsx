/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { useSignUp, useSignIn } from '@clerk/nextjs';
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
import { Eye, EyeOff } from 'lucide-react';
import { formatPhoneNumberRaw } from '@/utils/phoneUtils';

const signUpSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    mobile: z
      .string()
      .regex(
        /^(?:\+63|0)9\d{2}[-\s]?\d{3}[-\s]?\d{4}$/,
        'Please enter a valid phone number'
      )
      .optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirm: false,
  });
  const [showVerification, setShowVerification] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
    },
  });
  const codeForm = useForm<{ code: string }>({
    defaultValues: { code: '' },
  });

  const onSubmit = async (data: SignUpFormData) => {
    if (!isLoaded || !signUp) return;
    setIsSubmitting(true);
    try {
      const result = await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: formatPhoneNumberRaw(data.mobile || ''),
      });
      if (
        result.status === 'missing_requirements' &&
        result.unverifiedFields?.includes('email_address')
      ) {
        await signUp.prepareEmailAddressVerification({
          strategy: 'email_code',
        });
        setEmailForVerification(data.email);
        toast.info('Verification code sent to your email.');
        setShowVerification(true);
        return;
      }
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        toast.success('Sign up successful! Redirecting...');
        window.location.href = '/';
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

  const onVerifyCode = async (data: { code: string }) => {
    if (!signUp) return;
    setIsSubmitting(true);
    try {
      const verificationResult = await signUp.attemptEmailAddressVerification({
        code: data.code,
      });
      if (verificationResult.status === 'complete') {
        await setActive({ session: verificationResult.createdSessionId });
        toast.success('Sign up successful! Redirecting...');
        window.location.href = '/';
      } else {
        toast.error('Invalid code or verification failed.');
      }
    } catch (err: unknown) {
      toast.error('Verification failed.');
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

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <AuthLayout
      title={showVerification ? 'Verify your email' : 'Register to get Started'}
      subtitle={
        showVerification
          ? `Enter the code sent to ${emailForVerification}`
          : 'Sign in to continue your property journey with Listd!'
      }
    >
      {showVerification ? (
        <FormProvider {...codeForm}>
          <form
            className='space-y-5'
            onSubmit={codeForm.handleSubmit(onVerifyCode)}
          >
            <FormInput
              name='code'
              label='Verification Code'
              placeholder='Enter the code from your email'
              disabled={isSubmitting}
            />
            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full cursor-pointer bg-[var(--primary-main)] text-white font-semibold py-4 text-sm md:text-base rounded-full mb-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
            >
              {isSubmitting ? 'Verifying...' : 'Verify & Complete Signup'}
            </button>
          </form>
        </FormProvider>
      ) : (
        <>
          <FormProvider {...form}>
            <form className='space-y-5' onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col md:flex-row gap-4'>
                <div className='flex-1'>
                  <FormInput
                    name='firstName'
                    label='First name'
                    placeholder='Enter your first name'
                    disabled={isSubmitting}
                  />
                </div>
                <div className='flex-1'>
                  <FormInput
                    name='lastName'
                    label='Last name'
                    placeholder='Enter your last name'
                    disabled={isSubmitting}
                  />
                </div>
              </div>
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
              <div className='relative'>
                <FormInput
                  name='password'
                  label='Password'
                  type={showPasswords.password ? 'text' : 'password'}
                  placeholder='Enter your password'
                  disabled={isSubmitting}
                />
                <button
                  type='button'
                  onClick={() => togglePasswordVisibility('password')}
                  className='absolute right-3 top-12 -translate-y-1/2 text-neutral-mid hover:text-neutral-text cursor-pointer'
                >
                  {showPasswords.password ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              <div className='relative'>
                <FormInput
                  name='confirmPassword'
                  label='Confirm your password'
                  type={showPasswords.confirm ? 'text' : 'password'}
                  placeholder='Confirm password'
                  disabled={isSubmitting}
                />
                <button
                  type='button'
                  onClick={() => togglePasswordVisibility('confirm')}
                  className='absolute right-3 top-12 -translate-y-1/2 text-neutral-mid hover:text-neutral-text cursor-pointer'
                >
                  {showPasswords.confirm ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>

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
              <Link href='/'>
                <button
                  type='button'
                  disabled={isSubmitting}
                  className='w-full cursor-pointer text-sm md:text-base border-2 border-[var(--primary-main)] text-[var(--primary-main)] font-semibold py-4 rounded-full mb-2 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Continue as a Guest
                </button>{' '}
              </Link>
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
        </>
      )}
    </AuthLayout>
  );
}
