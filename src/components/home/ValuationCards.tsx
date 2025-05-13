import React from 'react';
import Image, { StaticImageData } from 'next/image';
import Button from '../common/Button';
import { Container } from '../common/Container';

export interface ValuationCardData {
  image: StaticImageData;
  title: string;
  description: string;
  button: string;
}

export default function ValuationCards({
  cards,
}: {
  cards: ValuationCardData[];
}) {
  return (
    <Container className='bg-[#f5f8fd]'>
      <div className='flex flex-col md:flex-row gap-10 w-full justify-center'>
        {cards.map((card, idx) => (
          <div key={idx} className='grid grid-cols-1 xl:grid-cols-2 w-full'>
            <div className='relative w-full h-48 md:h-auto '>
              <Image
                src={card.image}
                alt={card.title}
                fill
                className='object-cover'
                priority={idx === 0}
              />
            </div>
            <div className='flex flex-col justify-center p-6 w-full'>
              <h3 className='font-bold text-xl md:text-2xl text-neutral-text mb-2'>
                {card.title}
              </h3>
              <p className='text-body text-neutral-mid mb-6'>
                {card.description}
              </p>
              <Button
                variant='primary'
                className='rounded-full px-8 py-3 font-bold w-fit'
              >
                {card.button}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
