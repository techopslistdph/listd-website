import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is an online valuation simulation?',
    answer:
      'An online valuation simulation is a digital tool that estimates the value of your property based on the information you provide. It uses algorithms and market data to give you a quick and convenient estimate.',
  },
  {
    question:
      'How do we value properties? What do we take into account when performing the online valuation simulation?',
    answer:
      'We consider various factors such as location, property size, condition, recent sales in the area, and current market trends to provide an accurate online valuation simulation.',
  },
  {
    question: 'What is the benefit of simulating the valuation of home online?',
    answer:
      'Simulating your home valuation online is fast, convenient, and gives you an initial estimate without the need for an in-person visit. It helps you make informed decisions quickly.',
  },
  {
    question: 'What is the real value of a property?',
    answer:
      'The real value of a property is determined by a professional appraisal, which takes into account a thorough inspection and analysis of the property and market conditions.',
  },
  {
    question: 'When do i need the valuation of a property?',
    answer:
      'You may need a property valuation when selling, buying, refinancing, or for legal and tax purposes.',
  },
  {
    question:
      'How long will it take to get the valuation? How will i receive it?',
    answer:
      'Online valuation simulations are typically delivered instantly or within a few minutes via email or on the website. Detailed professional valuations may take longer and are usually sent by email or post.',
  },
];

export default function FAQ() {
  return (
    <section className='mt-12 max-w-[1300px] mx-auto'>
      <h2 className='heading-5 '>Frequently asked questions (FAQs)</h2>
      <Accordion type='multiple' className='w-full mt-5'>
        {faqs.map((faq, idx) => (
          <AccordionItem key={idx} value={faq.question}>
            <AccordionTrigger className='text-base lg:text-lg lg:font-semibold text-[#100A55] py-3 lg:py-4'>
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className='text-sm lg:text-base text-muted-foreground'>
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
