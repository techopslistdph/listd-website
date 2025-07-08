import Link from 'next/link';

const steps = [
  {
    label: '01',
    text: 'Locate the property in order to start the online valuation.',
  },
  {
    label: '02',
    text: 'Describe your property to adjust the valuation.',
  },
  {
    label: '03',
    text: 'Get your valuation online or personalize it with a professional.',
  },
];

export default function ValuationHero() {
  return (
    <section className='max-w-[1000px] rounded-3xl border mx-auto p-5 lg:p-10 -mt-96 bg-white  relative z-20'>
      <h1 className='heading-3 text-primary mb-2'>Property valuation</h1>
      <h2 className='body-large font-bold text-neutral-mid mb-8'>
        With the free online valuation of your property, you can find out the
        selling price and the rental price in just 3 steps
      </h2>
      <div className='flex flex-col gap-2 mb-5'>
        {steps.map((step, idx) => (
          <div
            key={idx}
            className='flex flex-col md:flex-row items-center gap-2'
          >
            <div className='flex items-center justify-center w-8 text-xs h-8 rounded-full border-2 border-neutral-mid text-primary font-bold bg-white'>
              {step.label}
            </div>
            <div className=' font-medium text-neutral-main'>{step.text}</div>
          </div>
        ))}
      </div>

      <div className='text-neutral-mid text-sm mt-2'>
        The free online valuation is not and does not replace a professional
        appraisal.
      </div>
      <div className='mt-5 flex justify-end'>
        <Link
          type='button'
          className='py-3 px-12 ml-auto rounded-full bg-primary-main text-white'
          href={'/valuation/property'}
        >
          Value for free
        </Link>
      </div>
    </section>
  );
}
