import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { Container } from '../common/Container';
import Icon from '../../../public/images/listing-icon.png';

export interface FeatureCardData {
  image: StaticImageData;
  icon: string;
  title: string;
  description: string;
  align: 'left' | 'right';
}

export default function FeatureCards({ cards }: { cards: FeatureCardData[] }) {
  return (
    <Container>
      <div className='w-full flex flex-col gap-10 md:gap-44 py-8 md:py-12'>
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`flex flex-col md:flex-row items-center gap-6 md:gap-10 ${
              card.align === 'left' ? 'md:flex-row-reverse' : ''
            }`}
          >
            <div className='relative w-full md:w-2/4 h-64 md:h-80 rounded-2xl overflow-hidden'>
              <Image
                src={card.image}
                alt={card.title}
                fill
                className='object-cover'
                priority={idx === 0}
              />
            </div>
            <div className='bg-white border-[#E0E0E0] border rounded-2xl p-4 md:p-6 w-full md:w-1/2 relative z-10 -mt-32 md:-mt-56 md:-ml-32 md:-mr-32'>
              <div className='flex flex-col mb-3 md:mb-4'>
                <span className='w-10 md:w-12'>
                  <Image src={Icon} alt='' />
                </span>
                <h3 className='font-bold text-lg md:text-2xl text-neutral-text mt-2'>
                  {card.title}
                </h3>
              </div>
              <p className='text-body text-neutral-mid'>{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
