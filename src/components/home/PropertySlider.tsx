'use client';
import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { FaMapMarkerAlt } from 'react-icons/fa';
import Button from '../common/Button';

export interface PropertySliderCard {
  image: string;
  title: string;
  price: string;
  location: string;
}

export default function PropertySlider({
  propertySliderCards,
}: {
  propertySliderCards: PropertySliderCard[];
}) {
  return (
    <section className='container max-w-[1300px] mx-auto px-8 md:px-5 py-10 lg:py-20 '>
      <div className='flex flex-col md:flex-row gap-3 justify-between items-start md:items-center  mb-10 md:mb-4'>
        <div>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--neutral-text)] md:mb-2'>
            Based on your location
          </h2>
          <p className='text-lg text-gray-500'>
            Some of our picked properties near you location.
          </p>
        </div>
        <Button variant='primary' className='font-medium py-3'>
          More Properties
        </Button>
      </div>
      <Swiper
        spaceBetween={32}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 1.2 },
          768: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
        }}
        // pagination={{ clickable: true }}
        modules={[Pagination]}
        className='property-swiper pb-8'
      >
        {propertySliderCards.map((card, idx) => (
          <SwiperSlide key={idx} className='max-w-[350px] '>
            <div className='bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col h-full mb-10 cursor-grab'>
              <div className='relative w-full min-w-[250px] min-h-[250px] md:min-w-[350px] md:min-h-[350px]'>
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className='object-cover'
                />
              </div>
              <div className='p-6 flex flex-col flex-1'>
                <div className='text-[var(--primary-main)] font-extrabold text-xl md:text-2xl mb-2'>
                  {card.price}
                </div>
                <div className='font-semibold text-base md:text-lg mb-1'>
                  {card.title}
                </div>
                <div className='flex items-center text-gray-500 text-sm'>
                  <FaMapMarkerAlt className='mr-2 text-[var(--primary-main)]' />
                  {card.location}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
