'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import Button from '../common/Button';
import { useDeactivateAccount } from '@/lib/queries/hooks/use-account';
import { AlertTriangle } from 'lucide-react';

interface DeactivateAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeactivateAccountDialog({
  open,
  onOpenChange,
}: DeactivateAccountDialogProps) {
  const deactivateAccountMutation = useDeactivateAccount();

  const handleDeactivate = () => {
    deactivateAccountMutation.mutate(undefined, {
      onSuccess: data => {
        if (data.success) {
          onOpenChange(false);
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <div className='flex items-center gap-2'>
            <AlertTriangle className='h-5 w-5 text-red-500' />
            <DialogTitle className='md:text-2xl font-semibold text-red-600'>
              Deactivate Account
            </DialogTitle>
          </div>
          <DialogDescription className='text-sm text-neutral-main'>
            Are you sure you want to deactivate your account? This action will:
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-3'>
          <ul className='text-sm text-neutral-main space-y-1'>
            <li>• Disable your account immediately</li>
            <li>• Prevent you from signing in</li>
            <li>• Hide your profile from other users</li>
            <li>• This action cannot be undone</li>
          </ul>

          <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
            <p className='text-sm text-red-700 font-medium'>
              ⚠️ Warning: Once your account is deactivated, you will lose access
              to all your data and settings.
            </p>
          </div>
        </div>

        <DialogFooter className='flex gap-3'>
          <Button
            type='button'
            variant='outlined'
            onClick={() => onOpenChange(false)}
            className='flex-1 justify-center'
            disabled={deactivateAccountMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleDeactivate}
            className='flex-1 justify-center'
            disabled={deactivateAccountMutation.isPending}
          >
            {deactivateAccountMutation.isPending
              ? 'Deactivating...'
              : 'Deactivate Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
