import React from 'react';
import Image from 'next/image';
// Placeholder images, replace with actual SVGs or illustrations
import formImg from '@/../public/images/icons/form.svg';
import reportImg from '@/../public/images/icons/report.svg';
import expertImg from '@/../public/images/icons/expert.svg';
import Link from 'next/link';

const steps = [
  {
    img: formImg,
    title: 'Fill out Form',
    desc: 'Provide us the complete information about your home or property for initial real estate valuation. Name your location and the important features to arrive at a right estimate.',
  },
  {
    img: reportImg,
    title: 'Get Your Report',
    desc: 'Listd report Will be sent to your email instantly. The value calculated is an estimated price of your property is based on data provided, and existing market values.',
  },
  {
    img: expertImg,
    title: 'Consult an Expert',
    desc: 'A dedicated team of Listd appraisers is always available for a quick discussion. Schedule a call today and get a more comprehensive real estate valuation report.',
  },
];

export default function HowListdValuate() {
  return (
    <section className='max-w-[1400px] mx-auto mt-16 px-2'>
      <h2 className='text-5xl font-extrabold mb-2 text-black'>
        How Listd Valuate
      </h2>
      <div className='mb-8'>
        <Link
          href='#faq'
          className='text-primary-main underline text-lg font-medium'
        >
          Questions? Read our FAQ&apos;s
        </Link>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {steps.map((step, idx) => (
          <div
            key={idx}
            className='rounded-2xl border border-neutral-mid bg-white p-8 flex flex-col shadow-sm transition hover:shadow-md  h-full'
          >
            <Image
              src={step.img}
              alt={step.title}
              width={260}
              height={200}
              className='mb-8 mx-auto h-[200px] w-[200px]'
            />

            <div className='flex-grow flex flex-col items-start '>
              <h3 className='text-2xl font-bold text-black mb-3 flex-shrink-0'>
                {step.title}
              </h3>
              <p className=' text-gray-400 leading-relaxed w-full'>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
