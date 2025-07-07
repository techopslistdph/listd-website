'use client';
import React, { useRef } from 'react';
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
    <section className='container max-w-[1300px] mx-auto px-8 md:px-5 py-10 lg:py-20 '>
      <div className=' px-4 md:px-5'>
        <div className='flex flex-col lg:flex-row items-center gap-8 lg:gap-0 overflow-hidden'>
          {/* Left Side: Heading, Subheading, Buttons */}
          <div className='flex-1 flex flex-col items-center md:items-start text-center md:text-left md:mb-0 w-full lg:min-w-[400px] lg:max-w-[530px]'>
            <h2 className='text-[16px] md:text-[18px] font-medium tracking-widest text-[#3B23DD] mb-3 md:mb-4'>
              TESTIMONIALS
            </h2>
            <h3 className='text-2xl md:text-4xl font-bold text-neutral-text mb-3 md:mb-4 leading-tight'>
              Look What Our Customers <br className='hidden md:block' />
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
                className='w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full border-2 border-primary-main text-primary-main text-2xl md:text-3xl transition hover:bg-primary-main hover:text-white focus:outline-none cursor-pointer'
              >
                <ArrowLeft />
              </button>
              <button
                aria-label='Next testimonial'
                onClick={handleNext}
                className='w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full border-2 border-primary-main text-primary-main text-2xl md:text-3xl transition hover:bg-primary-main hover:text-white focus:outline-none cursor-pointer'
              >
                <ArrowRight />
              </button>
            </div>
          </div>
          {/* Right Side: Swiper Carousel */}
          <div className='w-full lg:min-w-[500px]'>
            <Swiper
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 2 },
                1280: { slidesPerView: 2.2 },
              }}
              modules={[Navigation]}
              loop
              onSwiper={(swiper: SwiperType) => (swiperRef.current = swiper)}
              className='testimonial-swiper pb-8  '
            >
              {testimonialCards.map((card, idx) => (
                <SwiperSlide key={idx} className='pl-1 cursor-grab'>
                  <div className='bg-white shadow-md rounded-3xl p-6 md:p-10 md:min-h-[370px] md:h-[370px] flex flex-col  mb-7 w-full '>
                    <div className='px-0 max-h-[200px] min-h-[200px]'>
                      <div>
                        <Image
                          src={icon}
                          alt={card.name}
                          className='w-10 h-10 mx-auto md:mx-0'
                        />
                      </div>
                      <div className='font-medium text-neutral-main mt-1 line-clamp-[6] overflow-hidden'>
                        {card.testimonial}
                      </div>
                    </div>
                    <div className='flex items-center justify-between px-0 border-t pt-7 mt-4'>
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage src={card.avatar.src} alt={card.name} />
                        </Avatar>
                        <div className='flex flex-col lg:flex-row gap-2'>
                          <span className='font-semibold '>{card.name}</span>

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
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
