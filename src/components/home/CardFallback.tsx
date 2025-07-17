import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

type CardsFallbackProps = {
  src: string;
  alt: string;
} & Omit<ImageProps, 'src' | 'alt'>;

export default function CardsFallback({
  src,
  alt,

  ...props
}: CardsFallbackProps) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return (
      <div className='min-h-[250px] w-full h-full md:min-h-[350px] min-w-[200px] bg-neutral-light flex items-center justify-center'>
        <p className='text-neutral-mid text-sm'>No images</p>
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      fill
      className='object-cover'
      onError={() => setImgError(true)}
    />
  );
}
