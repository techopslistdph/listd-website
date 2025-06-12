'use client';
import AuthLayout from '@/components/auth/AuthLayout';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormInput } from '@/components/ui/form-input';
import Link from 'next/link';
import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { toast } from 'sonner';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordPage() {
  const { signIn, isLoaded } = useSignIn();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const emailForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });
  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { code: '', password: '' },
  });

  const onSubmitEmail = async (data: ForgotPasswordFormData) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: data.email,
      });
      setSubmittedEmail(data.email);
      setShowReset(true);
      toast.success('If this email exists, a reset code will be sent.');
    } catch (err: unknown) {
      let message = 'Failed to send reset email.';
      if (typeof err === 'object' && err && 'errors' in err) {
        const errorObj = (err as { errors?: Array<{ longMessage?: string }> })
          .errors?.[0];
        message = errorObj?.longMessage || message;
      }
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitReset = async (data: ResetPasswordFormData) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    try {
      await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: data.code,
        password: data.password,
      });
      toast.success('Password reset successful! You can now sign in.');
      window.location.href = '/login';
    } catch (err: unknown) {
      let message = 'Failed to reset password.';
      if (typeof err === 'object' && err && 'errors' in err) {
        const errorObj = (err as { errors?: Array<{ longMessage?: string }> })
          .errors?.[0];
        message = errorObj?.longMessage || message;
      }
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title={showReset ? 'Check Your Email' : 'Reset Password'}
      subtitle={
        showReset
          ? "We've sent a verification code to your email. Enter it below along with your new password."
          : 'Enter your email to reset your password.'
      }
    >
      {showReset ? (
        <FormProvider {...resetForm}>
          <form
            className='space-y-6'
            onSubmit={resetForm.handleSubmit(onSubmitReset)}
          >
            <div className='flex flex-col w-full'>
              <label className='font-semibold text-xs sm:text-sm mb-1'>
                Email Address <span className='text-red-500'>*</span>
              </label>
              <input
                type='email'
                value={submittedEmail}
                readOnly
                disabled
                className='mb-2 px-6 py-5 bg-neutral-light rounded-full text-xs sm:text-sm disabled:opacity-50'
              />
            </div>
            <FormInput
              name='code'
              label='Verification Code'
              placeholder='Enter code'
              disabled={isSubmitting}
            />
            <FormInput
              name='password'
              label='New Password'
              type='password'
              placeholder='New password'
              disabled={isSubmitting}
            />
            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full cursor-pointer text-sm md:text-base bg-[var(--primary-main)] text-white font-semibold py-4 rounded-full mb-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </FormProvider>
      ) : (
        <FormProvider {...emailForm}>
          <form
            className='space-y-6'
            onSubmit={emailForm.handleSubmit(onSubmitEmail)}
          >
            <FormInput
              name='email'
              label='Email Address'
              type='email'
              placeholder='Enter your email'
              disabled={isSubmitting}
            />
            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full cursor-pointer text-sm md:text-base bg-[var(--primary-main)] text-white font-semibold py-4 rounded-full mb-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
            >
              {isSubmitting ? 'Sending...' : 'Reset Password'}
            </button>
          </form>
        </FormProvider>
      )}
      <p className='text-center text-sm text-gray-500 mt-4'>
        Remember your password?{' '}
        <Link href='/login' className='text-primary font-bold underline'>
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
