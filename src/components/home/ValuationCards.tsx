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
          <div key={idx} className='flex flex-col md:flex-row w-full gap-5'>
            <div className='relative w-full  md:w-1/2'>
              <Image
                src={card.image}
                alt={card.title}
                className='object-cover min-w-[181px] min-h-[156px] max-h-[156px] md:h-full w-full'
                priority={idx === 0}
                height={156}
                width={181}
              />
            </div>
            <div className='flex flex-col justify-center w-full'>
              <h3 className='font-bold text-xl text-[var(--neutral-text)] mb-2'>
                {card.title}
              </h3>
              <p className=' text-sm text-[var(--neutral-mid)] mb-4'>
                {card.description}
              </p>
              <Button
                variant='primary'
                className='rounded-full px-6 py-2 font-bold w-fit'
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
