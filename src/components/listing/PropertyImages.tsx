/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState, useCallback } from 'react';
import Image, { StaticImageData } from 'next/image';
import { ChevronLeft, ChevronRight, Grid2X2, ArrowLeft } from 'lucide-react';
// import { Button } from '@/components/ui/button'; // Uncomment if you have a Button component
import { cn } from '@/lib/utils';
import gridIcon from '@/../public/images/photos.svg';

interface PropertyImagesProps {
  images: StaticImageData[];
  title: string;
}

export function PropertyImages({ images, title }: PropertyImagesProps) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const mainImage = images[0];
  const gridImages = images.slice(1, 5);
  const remainingCount = images.length - 5;

  const handlePrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  }, [images.length, isTransitioning]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setTimeout(() => setIsTransitioning(false), 300);
  }, [images.length, isTransitioning]);

  const openGallery = useCallback((index = 0) => {
    setCurrentIndex(index);
    setShowAllPhotos(true);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setShowAllPhotos(false);
    },
    [handleNext, handlePrevious]
  );

  if (showAllPhotos) {
    return (
      <div
        className='fixed inset-0 bg-black z-50 overflow-hidden'
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Gallery Header */}
        <div className='absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent z-10'>
          <button
            className='rounded-none text-white hover:bg-white/20 flex items-center cursor-pointer gap-2 px-2 py-1'
            onClick={() => setShowAllPhotos(false)}
          >
            <ArrowLeft className='h-5 w-5 text-neutral-50' />
            <span className='text-sm font-medium text-neutral-50 px-2 py-1 rounded-none'>
              Back to listing
            </span>
          </button>
          <div className='flex items-center gap-3'>
            <span className='text-white text-sm'>
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        </div>
        {/* Gallery Content */}
        <div className='h-full flex items-center justify-center'>
          <div className='relative w-full h-full flex justify-center items-center'>
            {/* Image Carousel */}
            <div className='w-full h-full max-w-7xl max-h-[80vh] relative'>
              {images.map((image, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'absolute inset-0 transition-opacity duration-300 ease-in-out',
                    idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  )}
                >
                  <div className='relative h-full w-full'>
                    <Image
                      src={image}
                      alt={title}
                      fill
                      className='object-contain'
                      sizes='100vw'
                      priority={idx === currentIndex}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Thumbnails on larger screens */}
            <div className='hidden lg:flex absolute bottom-6 left-1/2 transform -translate-x-1/2 gap-2 z-20'>
              {images.slice(0, Math.min(9, images.length)).map((image, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    'w-16 h-12 relative border cursor-pointer transition-all',
                    currentIndex === idx
                      ? 'border-primary scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  )}
                >
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className='object-cover'
                    sizes='64px'
                  />
                </div>
              ))}
              {images.length > 9 && (
                <div className='flex items-center justify-center w-16 h-12 bg-primary text-white text-xs'>
                  +{images.length - 9} more
                </div>
              )}
            </div>
          </div>

          {/* Left/Right Navigation Buttons */}
          <button
            className='absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-12 z-20 flex items-center justify-center'
            onClick={handlePrevious}
            disabled={isTransitioning}
          >
            <ChevronLeft className='h-6 w-6' />
          </button>
          <button
            className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-12 z-20 flex items-center justify-center'
            onClick={handleNext}
            disabled={isTransitioning}
          >
            <ChevronRight className='h-6 w-6' />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='relative container mx-auto'>
      {/* Image Grid with Hover Effects */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-5 aspect-[16/9] md:aspect-[2/1]'>
        {/* Main Large Image */}
        <div
          className='relative col-span-2 row-span-2 cursor-pointer overflow-hidden group rounded-tl-3xl rounded-bl-3xl'
          onClick={() => openGallery(0)}
        >
          <Image
            src={mainImage}
            alt={title}
            fill
            className='object-cover transition duration-300 group-hover:scale-105'
            sizes='(max-width: 768px) 100vw, 50vw'
            priority
          />
          <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300'></div>
        </div>

        {/* Grid of Smaller Images */}
        {gridImages.map((image, index) => (
          <div
            key={index}
            className={cn(
              'relative hidden md:block cursor-pointer overflow-hidden group',
              index === 1 && 'rounded-tr-3xl',
              index === gridImages.length - 1 && 'rounded-br-3xl'
            )}
            onClick={() => openGallery(index + 1)}
          >
            <Image
              src={image}
              alt={title}
              fill
              className={cn(
                'object-cover transition duration-300 group-hover:scale-105'
              )}
              sizes='25vw'
            />
            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300'></div>
          </div>
        ))}

        {/* Show All Photos Button with improved styling */}
        <button
          className='absolute bottom-4 right-4 flex items-center gap-2 bg-[var(--secondary-main)] cursor-pointer font-semibold text-white px-4 py-2 text-sm rounded-full'
          onClick={() => openGallery(0)}
        >
          <Image src={gridIcon} alt='grid' width={20} height={20} />
          See all photos
        </button>
      </div>

      {/* Mobile Navigation with improved styling */}
      <div className='md:hidden absolute bottom-4 left-4 right-4 flex justify-between'>
        <button
          className='rounded-none bg-secondary text-secondary-foreground shadow-md p-2'
          onClick={handlePrevious}
        >
          <ChevronLeft className='h-5 w-5' />
        </button>
        <button
          className='rounded-none bg-secondary text-secondary-foreground shadow-md p-2'
          onClick={handleNext}
        >
          <ChevronRight className='h-5 w-5' />
        </button>
      </div>
    </div>
  );
}
