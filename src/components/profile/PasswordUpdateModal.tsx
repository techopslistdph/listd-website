'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { FormInput } from '../ui/form-input';
import Button from '@/components/ui/common/Button';
import { useUpdatePassword } from '@/lib/queries/hooks/use-account';
import { Eye, EyeOff } from 'lucide-react';
import { FormProvider } from 'react-hook-form';
import { toast } from 'sonner';

const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordUpdateFormData = z.infer<typeof passwordUpdateSchema>;

interface PasswordUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PasswordUpdateModal({
  open,
  onOpenChange,
}: PasswordUpdateModalProps) {
  const [showPasswords, setShowPasswords] = React.useState({
    current: false,
    new: false,
    confirm: false,
  });

  const form = useForm<PasswordUpdateFormData>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const updatePasswordMutation = useUpdatePassword();

  const onSubmit = async (data: PasswordUpdateFormData) => {
    updatePasswordMutation.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: result => {
          if (result.success) {
            onOpenChange(false);
            form.reset();
          } else {
            // If the error is about current password, set it on the currentPassword field
            if (result.message?.toLowerCase().includes('current password')) {
              form.setError('currentPassword', {
                type: 'manual',
                message: result.message,
              });
            } else {
              // For other errors, show as toast
              toast.error(result.message);
            }
          }
        },
        onError: error => {
          // Handle API errors
          if (error?.message?.toLowerCase().includes('current password')) {
            form.setError('currentPassword', {
              type: 'manual',
              message: error.message,
            });
          } else {
            toast.error(error.message || 'Failed to update password');
          }
        },
      }
    );
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            Update Password
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <div className='relative'>
                <FormInput
                  name='currentPassword'
                  label='Current Password'
                  type={showPasswords.current ? 'text' : 'password'}
                  placeholder='Enter your current password'
                />
                <button
                  type='button'
                  onClick={() => togglePasswordVisibility('current')}
                  className='absolute right-3 top-12 -translate-y-1/2 text-neutral-mid hover:text-neutral-text cursor-pointer'
                >
                  {showPasswords.current ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
            </div>

            <div className='space-y-2'>
              <div className='relative'>
                <FormInput
                  name='newPassword'
                  label='New Password'
                  type={showPasswords.new ? 'text' : 'password'}
                  placeholder='Enter your new password'
                />
                <button
                  type='button'
                  onClick={() => togglePasswordVisibility('new')}
                  className='absolute right-3 top-12  -translate-y-1/2 text-neutral-mid hover:text-neutral-text cursor-pointer'
                >
                  {showPasswords.new ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
            </div>

            <div className='space-y-2'>
              <div className='relative'>
                <FormInput
                  name='confirmPassword'
                  label='Confirm New Password'
                  type={showPasswords.confirm ? 'text' : 'password'}
                  placeholder='Confirm your new password'
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
            </div>

            <div className='flex gap-3 pt-4'>
              <Button
                type='button'
                variant='outlined'
                onClick={() => onOpenChange(false)}
                className='flex-1 justify-center'
                disabled={updatePasswordMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                variant='primary'
                className='flex-1 justify-center'
                disabled={updatePasswordMutation.isPending}
              >
                {updatePasswordMutation.isPending
                  ? 'Updating...'
                  : 'Update Password'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
