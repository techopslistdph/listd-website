'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import Button from '../common/Button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useDeleteAccount } from '@/lib/queries/hooks/use-account';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const [confirmationText, setConfirmationText] = useState('');
  const deleteAccountMutation = useDeleteAccount();

  const handleDelete = () => {
    deleteAccountMutation.mutate();
  };

  const isDeleteEnabled = confirmationText === 'DELETE MY ACCOUNT';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader className='text-center'>
          <div className='flex items-center justify-center gap-2 mb-2'>
            <Trash2 className='h-6 w-6 text-red-500' />
            <DialogTitle className='text-2xl font-bold text-red-600'>
              Delete Account
            </DialogTitle>
          </div>
          <DialogDescription className='text-base text-neutral-mid'>
            This action is permanent and cannot be undone
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Warning Section */}
          <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
            <div className='flex items-start gap-3'>
              <AlertTriangle className='h-5 w-5 text-red-500 mt-0.5 flex-shrink-0' />
              <div>
                <h3 className='font-semibold text-red-700 mb-2'>
                  ⚠️ Permanent Account Deletion
                </h3>
                <p className='text-sm text-red-600'>
                  Once you delete your account, all your data will be
                  permanently removed and cannot be recovered.
                </p>
              </div>
            </div>
          </div>

          {/* What will be deleted */}
          <div className='space-y-3'>
            <h3 className='font-semibold text-gray-900'>
              What will be deleted:
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <div className='w-2 h-2 bg-red-400 rounded-full'></div>
                Your account and profile
              </div>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <div className='w-2 h-2 bg-red-400 rounded-full'></div>
                All property listings
              </div>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <div className='w-2 h-2 bg-red-400 rounded-full'></div>
                Saved favorites
              </div>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <div className='w-2 h-2 bg-red-400 rounded-full'></div>
                Account settings
              </div>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <div className='w-2 h-2 bg-red-400 rounded-full'></div>
                Message history
              </div>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <div className='w-2 h-2 bg-red-400 rounded-full'></div>
                All associated data
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className='space-y-3'>
            <Label
              htmlFor='confirmation'
              className='text-sm font-semibold text-gray-900'
            >
              Type &quot;DELETE MY ACCOUNT&quot; to confirm
            </Label>
            <Input
              id='confirmation'
              type='text'
              value={confirmationText}
              onChange={e => setConfirmationText(e.target.value)}
              placeholder='DELETE MY ACCOUNT'
              className={`h-12 text-center font-medium ${
                confirmationText && !isDeleteEnabled
                  ? 'border-red-300 focus:border-red-500 bg-red-50'
                  : isDeleteEnabled
                    ? 'border-green-300 focus:border-green-500 bg-green-50'
                    : 'border-gray-300 focus:border-gray-500'
              }`}
            />
            {confirmationText && !isDeleteEnabled && (
              <p className='text-sm text-red-500 text-center'>
                Please type exactly &quot;DELETE MY ACCOUNT&quot; to enable
                deletion
              </p>
            )}
            {isDeleteEnabled && (
              <p className='text-sm text-green-600 font-medium text-center'>
                ✓ Confirmation text matches - Delete button is now enabled
              </p>
            )}
          </div>
        </div>

        <DialogFooter className='flex gap-3 pt-6'>
          <Button
            type='button'
            variant='outlined'
            onClick={() => {
              onOpenChange(false);
              setConfirmationText('');
            }}
            className='flex-1 justify-center h-12'
            disabled={deleteAccountMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleDelete}
            className='flex-1 justify-center h-12'
            disabled={!isDeleteEnabled || deleteAccountMutation.isPending}
          >
            {deleteAccountMutation.isPending ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
