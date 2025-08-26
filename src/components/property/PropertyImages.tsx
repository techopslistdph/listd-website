/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState, useCallback, useRef } from 'react';
import Image, { StaticImageData } from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  ArrowLeft,
  Heart,
  ArrowRight,
} from 'lucide-react';
// import { Button } from '@/components/ui/button'; // Uncomment if you have a Button component
import { cn } from '@/lib/utils';
import gridIcon from '@/../public/images/photos.svg';
import { PropertyImage } from '@/lib/queries/server/propety/type';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface PropertyImagesProps {
  isLiked?: boolean;
  handleLikeProperty?: () => void;
  images: PropertyImage[];
  title: string;
  cardMode?: boolean;
  mapMode?: boolean;
}

export function PropertyImages({
  images,
  title,
  cardMode = false,
  isLiked = false,
  handleLikeProperty = () => {},
  mapMode = false,
}: PropertyImagesProps) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  const mainImage = images[0];
  const gridImages = images.slice(1, 5);

  const handlePrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  }, [images.length, isTransitioning]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
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

  if (cardMode) {
    return (
      <div className='relative w-full h-[350px] rounded-2xl overflow-hidden'>
        {images.length > 1 ? (
          <img
            src={images[currentIndex]?.imageUrl}
            alt={title}
            className='object-cover w-full h-full'
            sizes='100vw'
          />
        ) : (
          <div className='w-full h-full bg-neutral-light flex items-center justify-center'>
            <p className='text-neutral-mid text-sm'>No images</p>
          </div>
        )}
        {/* Heart Button */}
        <button
          onClick={handleLikeProperty}
          type='button'
          className='absolute top-4 right-4 bg-white rounded-full p-2 sm:p-3 z-20 flex items-center justify-center shadow-md hover:bg-primary-main transition-colors cursor-pointer'
          aria-label='Favorite'
        >
          {isLiked ? (
            <Heart
              className='w-5 h-5 text-primary-main'
              strokeWidth={3}
              fill='text-primary-main'
            />
          ) : (
            <Heart
              className='w-5 h-5 text-primary-main'
              strokeWidth={3}
              fill='white'
            />
          )}
        </button>
        {/* Left Arrow */}
        {images.length > 1 && (
          <div>
            <button
              className='absolute left-0 top-1/2 -translate-y-1/2 bg-transparent  text-primary-main rounded-full p-2 z-10 cursor-pointer'
              onClick={handlePrevious}
              aria-label='Previous image'
            >
              <ChevronLeft className='w-8 h-10 text-white' />
            </button>
            <button
              className='absolute right-0 top-1/2 -translate-y-1/2 bg-transparent text-primary-main rounded-full p-2 z-10 cursor-pointer'
              onClick={handleNext}
              aria-label='Next image'
            >
              <ChevronRight className='w-8 h-10 text-white' />
            </button>
          </div>
        )}

        {/* Image count */}
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-transparent border-2 border-white rounded-[10px] px-4 py-1.5 text-sm font-bold text-white flex items-center justify-center'>
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    );
  }

  if (mapMode) {
    return (
      <div className='relative w-full h-[250px] overflow-hidden'>
        {images.length > 1 ? (
          <img
            src={images[currentIndex]?.imageUrl}
            alt={title}
            className='object-cover w-full h-full'
            sizes='100vw'
          />
        ) : (
          <div className='w-full h-full bg-neutral-light flex items-center justify-center'>
            <p className='text-neutral-mid text-sm'>No images</p>
          </div>
        )}

        {/* Left Arrow */}
        {images.length > 1 && (
          <div>
            <button
              className='absolute left-0 top-1/2 -translate-y-1/2 bg-transparent  text-primary-main rounded-full p-2 z-10 cursor-pointer'
              onClick={handlePrevious}
              aria-label='Previous image'
            >
              <ChevronLeft className='w-8 h-10 text-white' />
            </button>
            <button
              className='absolute right-0 top-1/2 -translate-y-1/2 bg-transparent text-primary-main rounded-full p-2 z-10 cursor-pointer'
              onClick={handleNext}
              aria-label='Next image'
            >
              <ChevronRight className='w-8 h-10 text-white' />
            </button>
          </div>
        )}

        {/* Image count */}
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-transparent border-2 border-white rounded-[10px] px-4 py-1.5 text-sm font-bold text-white flex items-center justify-center'>
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    );
  }

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
                    <img
                      src={image.imageUrl}
                      alt={title}
                      className='object-contain h-full w-full'
                      sizes='100vw'
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
                  <img
                    src={image.imageUrl}
                    alt={title}
                    className='object-cover h-full w-full'
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

  const handleSliderPrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };
  const handleSliderNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
  };
  return (
    <div className='relative container mx-auto max-w-[1300px]'>
      {/* Mobile Swiper */}
      <div className='md:hidden relative'>
        <Swiper
          onSwiper={(swiper: SwiperType) => (swiperRef.current = swiper)}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          loop={images.length > 1}
          className='relative aspect-[4/3] rounded-3xl overflow-hidden'
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className='relative w-full h-full cursor-pointer'>
                <img
                  src={image.imageUrl}
                  alt={title}
                  className='object-cover w-full h-full'
                  sizes='100vw'
                />
                <div className='absolute inset-0 bg-black/0 hover:bg-black/20 transition duration-300'></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex w-full justify-between items-center gap-2 z-50 px-4'>
          <button
            aria-label='Previous testimonial'
            onClick={handleSliderPrev}
            className='w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full text-primary-main text-2xl md:text-3xl transition hover:bg-primary-main hover:text-white focus:outline-none cursor-pointer bg-white'
          >
            <ArrowLeft />
          </button>
          <button
            aria-label='Next testimonial'
            onClick={handleSliderNext}
            className='w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full text-primary-main text-2xl md:text-3xl transition  hover:bg-primary-main hover:text-white cursor-pointer bg-white'
          >
            <ArrowRight />
          </button>
        </div>
      </div>

      {/* Desktop Grid Layout */}
      <div className='hidden md:grid grid-cols-4 gap-5 aspect-[2/1]'>
        {/* Main Large Image */}
        <div
          className='relative col-span-2 row-span-2 cursor-pointer overflow-hidden group rounded-tl-3xl rounded-bl-3xl'
          onClick={() => openGallery(0)}
        >
          <img
            src={mainImage?.imageUrl}
            alt={title}
            className='object-cover transition duration-300 group-hover:scale-105 h-full w-full'
            sizes='50vw'
          />
          <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300'></div>
        </div>

        {/* Grid of Smaller Images */}
        {gridImages.map((image, index) => (
          <div
            key={index}
            className={cn(
              'relative cursor-pointer overflow-hidden group',
              index === 1 && 'rounded-tr-3xl',
              index === gridImages.length - 1 && 'rounded-br-3xl'
            )}
            onClick={() => openGallery(index + 1)}
          >
            <img
              src={image.imageUrl}
              alt={title}
              className={cn(
                'object-cover transition duration-300 group-hover:scale-105 h-full w-full aspect-square'
              )}
              sizes='25vw'
            />
            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300'></div>
          </div>
        ))}

        {/* Show All Photos Button for Desktop */}
        <button
          className='absolute bottom-4 right-4 flex items-center gap-2 bg-secondary-main cursor-pointer font-semibold text-white px-4 py-2 text-sm rounded-full'
          onClick={() => openGallery(0)}
        >
          <Image src={gridIcon} alt='grid' width={20} height={20} />
          See all photos
        </button>
      </div>
    </div>
  );
}
