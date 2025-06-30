import { Label } from '@/components/ui/label';
import Image from 'next/image';
import uploadIcon from '@/../public/images/icons/upload.svg';
import { useState } from 'react';
import { X } from 'lucide-react';

interface ImageUploadProps {
  onChange: (files: File[]) => void;
  value?: File[];
  error?: string;
}

export function ImageUpload({ onChange, value = [], error }: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newFiles = [...value, ...files];
      onChange(newFiles);

      // Create preview URLs for the uploaded files
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className='space-y-4'>
      <Label>Images (Minimum 3 required)</Label>
      <div className='border-2 border-dashed border-primary-main rounded-xl p-10 flex flex-col items-center justify-center mb-6 bg-white'>
        <input
          type='file'
          multiple
          className='hidden'
          id='image-upload'
          onChange={handleFileChange}
          accept='image/*'
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

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {previews.map((preview, index) => (
            <div key={index} className='relative group'>
              <div className='aspect-square relative rounded-lg overflow-hidden'>
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className='object-cover'
                />
              </div>
              <button
                onClick={() => removeImage(index)}
                className='absolute top-2 right-2 bg-white/80 hover:bg-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
              >
                <X className='w-4 h-4 text-gray-600' />
              </button>
            </div>
          ))}
        </div>
      )}
      {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
      {previews.length > 0 && (
        <p className='text-sm text-gray-500'>
          {previews.length} image(s) uploaded.{' '}
          {Math.max(0, 3 - previews.length)} more required.
        </p>
      )}
    </div>
  );
}
