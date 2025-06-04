import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

interface WaitAlertModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onUploadNow: () => void;
}

export default function WaitAlertModal({
  open,
  setOpen,
  onUploadNow,
}: WaitAlertModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='max-w-lg w-full rounded-2xl p-8'>
        <DialogTitle className='text-2xl font-bold '>Wait!</DialogTitle>
        <DialogDescription asChild>
          <p className=' text-lg text-black'>
            Before you post it, make sure to upload a photo. Do you want to
            upload one now?
          </p>
        </DialogDescription>
        <div className='flex justify-center gap-6'>
          <DialogClose asChild>
            <button
              className='rounded-full py-3 px-8 w-44 cursor-pointer border-2 border-primary-main text-primary-main font-bold bg-white hover:bg-gray-100'
              type='button'
            >
              Cancel
            </button>
          </DialogClose>
          <button
            className='rounded-full py-3 px-8 w-44 cursor-pointer bg-primary-main text-white font-bold hover:bg-primary-main'
            type='button'
            onClick={() => {
              setOpen(false);
              onUploadNow();
            }}
          >
            Upload Now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
