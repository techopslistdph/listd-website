import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';
import Image from 'next/image';
import uploadIcon from '@/../public/images/icons/upload.svg';

interface ImageUploadModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ImageUploadModal({
  open,
  setOpen,
}: ImageUploadModalProps) {
  const [url, setUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='min-w-2xl w-full rounded-2xl p-8'>
        <DialogTitle className='text-xl font-bold '>
          Add Preview Images!
        </DialogTitle>
        {/* Drag & Drop or Choose file */}
        <div className='lex flex-col items-center justify-center py-5'>
          <input
            type='file'
            multiple
            className='hidden'
            ref={fileInputRef}
            id='modal-image-upload'
            onChange={() => {}}
          />
          <label
            htmlFor='modal-image-upload'
            className='cursor-pointer flex flex-col items-center w-full text-center'
          >
            <Image src={uploadIcon} alt='Upload' className='w-10 h-10 mb-2' />
            <span className='text-lg font-medium text-black mb-1'>
              Drag & Drop or{' '}
              <span className='text-primary-main underline'>Choose file</span>{' '}
              to upload
            </span>
            <span className='text-sm text-gray-400 mt-1'>
              fig, zip, pdf, png, jpeg
            </span>
          </label>
        </div>
        <div className='flex items-center'>
          <div className='flex-grow border-t border-gray-200'></div>
          <span className='mx-4 text-gray-400 font-bold'>OR</span>
          <div className='flex-grow border-t border-gray-200'></div>
        </div>
        {/* Import from URL */}
        <div className='mb-2'>
          <div className='font-bold mb-2'>Import from URL</div>
          <div className='flex gap-2 items-center'>
            <Input
              placeholder='Add file URL'
              value={url}
              onChange={e => setUrl(e.target.value)}
              className='flex-1 rounded-full py-6 text-base bg-neutral-light border-0'
            />
            <button className='font-bold text-primary-main ml-2 cursor-pointer'>
              Upload
            </button>
          </div>
        </div>
        <div className='flex justify-center gap-4'>
          <DialogClose asChild>
            <button
              className='rounded-full cursor-pointer text-sm py-3 px-8 w-44 border-2 border-primary-main text-primary-main font-bold bg-white hover:bg-gray-100'
              type='button'
            >
              Cancel
            </button>
          </DialogClose>
          <DialogClose asChild>
            <button
              className='rounded-full cursor-pointer py-3 text-sm px-8 w-44 bg-primary-main text-white font-bold hover:bg-primary-main'
              type='button'
            >
              Import
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
