import { Label } from '@/components/ui/label';
import Image from 'next/image';
import uploadIcon from '@/../public/images/icons/upload.svg';

interface ImageUploadProps {
  onChange: (files: File[]) => void;
}

export function ImageUpload({ onChange }: ImageUploadProps) {
  return (
    <div className='space-y-4'>
      <Label>Image</Label>
      <div className='border-2 border-dashed border-primary-main rounded-xl p-10 flex flex-col items-center justify-center mb-6 bg-white'>
        <input
          type='file'
          multiple
          className='hidden'
          id='image-upload'
          onChange={(e) => {
            if (e.target.files) {
              onChange(Array.from(e.target.files));
            }
          }}
        />
        <label
          htmlFor='image-upload'
          className='cursor-pointer flex flex-col items-center w-full text-center'
        >
          <Image src={uploadIcon} alt='Upload' className='w-10 h-10' />
          <span className='text-base font-medium text-black mb-1'>
            Drag your file(s) or{' '}
            <span className='text-blue-600 underline'>browse</span>
          </span>
          <span className='text-sm text-gray-400 mt-1'>
            Max 10 MB files are allowed
          </span>
        </label>
      </div>
    </div>
  );
}
