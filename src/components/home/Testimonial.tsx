'use client';
import React, { useRef } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Image, { StaticImageData } from 'next/image';
import icon from '../../../public/images/testimonial-icon.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Swiper as SwiperType } from 'swiper';

interface TestimonialCard {
  avatar: StaticImageData;
  name: string;
  rating: number;
  testimonial: string;
}

export default function Testimonial({
  testimonialCards,
}: {
  testimonialCards: TestimonialCard[];
}) {
  const swiperRef = useRef<SwiperType | null>(null);

  const handlePrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };
  const handleNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
  };

  return (
    <section className='container mx-auto px-8 md:px-5 py-10 lg:py-20 '>
      <div className='container mx-auto px-4 md:px-5'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center'>
          {/* Left Side: Heading, Subheading, Buttons */}
          <div className='flex-1 flex flex-col items-center md:items-start text-center md:text-left md:mb-0'>
            <h2 className='text-[16px] md:text-[18px] font-medium tracking-widest text-[#3B23DD] mb-3 md:mb-4'>
              TESTIMONIALS
            </h2>
            <h3 className='text-2xl md:text-4xl font-bold text-neutral-text mb-3 md:mb-4 leading-tight'>
              Look What Our Customers
              <br className='hidden md:block' />
              Say!
            </h3>
            <p className='text-base md:text-lg text-neutral-mid max-w-xs md:max-w-xl '>
              Fusce venenatis tellus a felis scelerisque, non pulvinar est
              pellentesque.
            </p>
            <div className='flex gap-4  mt-2 md:mt-4 justify-center md:justify-start'>
              <button
                aria-label='Previous testimonial'
                onClick={handlePrev}
                className='w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full border-2 border-[var(--primary-main)] text-[var(--primary-main)] text-2xl md:text-3xl transition hover:bg-[var(--primary-main)] hover:text-white focus:outline-none'
              >
                <ArrowLeft />
              </button>
              <button
                aria-label='Next testimonial'
                onClick={handleNext}
                className='w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full border-2 border-[var(--primary-main)] text-[var(--primary-main)] text-2xl md:text-3xl transition hover:bg-[var(--primary-main)] hover:text-white focus:outline-none'
              >
                <ArrowRight />
              </button>
            </div>
          </div>
          {/* Right Side: Swiper Carousel */}
          <div className='md:col-span-2 w-full'>
            <Swiper
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2.2 },
                1024: { slidesPerView: 2.2 },
              }}
              modules={[Navigation]}
              onSwiper={(swiper: SwiperType) => (swiperRef.current = swiper)}
              className='testimonial-swiper pb-8'
            >
              {testimonialCards.map((card, idx) => (
                <SwiperSlide key={idx}>
                  <Card className='bg-white shadow-xl rounded-3xl p-6 md:p-10 min-h-[320px] h-[320px] flex flex-col justify-between mb-7 w-full max-w-full'>
                    <CardContent className='px-0'>
                      <div>
                        <Image
                          src={icon}
                          alt={card.name}
                          className='w-10 h-10 mx-auto md:mx-0'
                        />
                      </div>
                      <div className='font-medium text-neutral-text mt-1'>
                        {card.testimonial}
                      </div>
                    </CardContent>
                    <CardFooter className='flex items-center justify-between px-0 border-t mt-4'>
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage src={card.avatar.src} alt={card.name} />
                        </Avatar>
                        <span className='font-semibold text-base md:text-lg'>
                          {card.name}
                        </span>
                      </div>
                      <div className='flex items-center gap-1'>
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            width='20'
                            height='20'
                            fill={i < card.rating ? '#FACC15' : '#E5E7EB'}
                            viewBox='0 0 20 20'
                          >
                            <polygon points='10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36' />
                          </svg>
                        ))}
                      </div>
                    </CardFooter>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
