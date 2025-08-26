import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { Container } from '@/components/ui/common/Container';
import Link from 'next/link';

export interface ValuationCardData {
  image: StaticImageData;
  title: string;
  description: string;
  button: string;
  link: string;
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
            <div className='relative w-full'>
              <Image
                src={card.image}
                alt={card.title}
                className='object-cover min-w-[181px] min-h-[156px] w-full md:h-[267px] md:w-[240px] rounded-lg'
                priority={idx === 0}
                height={156}
                width={181}
              />
            </div>
            <div className='flex flex-col justify-center w-full'>
              <h3 className='font-bold text-xl text-neutral-text mb-2'>
                {card.title}
              </h3>
              <p className=' text-sm text-neutral-mid mb-4'>
                {card.description}
              </p>
              <Link
                href={card.link}
                className='rounded-full px-6 py-2 font-semibold w-fit bg-primary-main text-white text-sm '
              >
                {card.button}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
