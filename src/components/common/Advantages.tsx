import React from 'react';

import advantage1 from '@/../public/images/advantage1.svg';
import advantage2 from '@/../public/images/advantage2.svg';
import advantage3 from '@/../public/images/advantage3.svg';
import advantage4 from '@/../public/images/advantage4.svg';
import Image from 'next/image';

const advantages = [
  {
    icon: <Image src={advantage1} alt='Advantage 1' width={40} height={40} />,
    text: 'Free valuation of estimated sale and rental price of your property, with maximum and minimum values.',
  },
  {
    icon: <Image src={advantage2} alt='Advantage 2' width={40} height={40} />,
    text: 'Analysis of the evolution of the market price, so that you are always informed about how much your property could be worth.',
  },
  {
    icon: <Image src={advantage3} alt='Advantage 3' width={40} height={40} />,
    text: 'We compare similar properties in the area to adjust the online valuation simulation.',
  },
  {
    icon: <Image src={advantage4} alt='Advantage 4' width={40} height={40} />,
    text: 'Banks and public entities also use our technology to make their estimates and valuation.',
  },
];

export default function Advantages() {
  return (
    <section className='max-w-[1300px] mx-auto mt-12'>
      <h2 className='heading-5 mb-5'>
        What are the advantages of our online valuation simulation?
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8'>
        {advantages.map((adv, idx) => (
          <div
            key={idx}
            className='flex flex-col md:flex-row items-center md:items-start gap-4 rounded-2xl border border-[var(--neutral-mid)] bg-white p-8 shadow-none transition hover:shadow-md'
          >
            <div className='flex-shrink-0'>{adv.icon}</div>
            <div className='text-[var(--neutral-mid)]'>{adv.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
