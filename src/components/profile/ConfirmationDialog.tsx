import React from 'react';
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { DialogContent } from '../ui/dialog';

export default function ConfirmationDialog({
  showModal,
  setShowModal,
  handleCancel,
  handleRemove,
  title,
  description,
}: {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  handleCancel: () => void;
  handleRemove: () => void;
  title: string;
  description: string;
}) {
  return (
    <>
      {/* Modal Dialog */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className='rounded-3xl p-8 w-full min-w-xl mx-auto flex flex-col items-center'>
          <DialogHeader className='w-full text-left'>
            <DialogTitle className='text-xl font-bold'>{title}</DialogTitle>
          </DialogHeader>
          <p className=' w-full text-left'>{description}</p>
          <DialogFooter className='flex gap-4 w-full justify-end mt-3'>
            <button
              className='rounded-full border-2 cursor-pointer border-primary-main text-sm text-primary-main w-48 font-bold py-2 px-8  hover:bg-white focus:outline-none'
              onClick={handleCancel}
              type='button'
            >
              Cancel
            </button>
            <button
              className='rounded-full cursor-pointer border-2 border-transparent bg-primary-main text-white font-bold py-2 px-8 text-sm w-48 hover:bg-primary-main focus:outline-none'
              onClick={handleRemove}
              type='button'
            >
              Remove from list
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
