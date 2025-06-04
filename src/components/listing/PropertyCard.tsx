import Image from 'next/image';
import Link from 'next/link';
import pinIcon from '../../../public/images/icons/pin.svg';
import bedIcon from '../../../public/images/icons/bedroom.svg';
import bathIcon from '../../../public/images/icons/bath.svg';
import areaIcon from '../../../public/images/icons/squaremeter.svg';
import { PropertyImages } from './PropertyImages';
import { Heart, PhoneIcon } from 'lucide-react';
import verified from '../../../public/images/icons/verified.png';
import { PropertyDetail } from '@/lib/queries/server/propety/type';

export default function PropertyCard({
  propertyDetail,
  view,
}: {
  propertyDetail: PropertyDetail;
  view?: 'list' | 'map';
}) {
  const {
    property: {
      images,
      listingTitle,
      listingPrice,
      address,
      scrapeContactInfo,
    },
    id,
    numberOfBathrooms,
    numberOfBedrooms,
    floorArea,
  } = propertyDetail;

  if (view === 'map') {
    // Horizontal card for map view
    return (
      // <Link href={`/property/${slug}`} className='block'>
      //   <div className='flex flex-col sm:flex-row bg-white rounded-2xl shadow-lg shadow-[#F7EFFD] transition-transform duration-300 cursor-pointer max-w-full p-3 gap-4'>
      //     <div className='flex-shrink-0 rounded-2xl overflow-hidden w-full sm:w-[295px] h-[200px] sm:h-[280px]'>
      //       <Image
      //         src={images[0]}
      //         alt={title}
      //         width={195}
      //         height={240}
      //         className='object-cover w-full h-full'
      //       />
      //     </div>
      //     <div className='flex-1 min-w-0 flex flex-col sm:h-[280px] justify-around'>
      //       <div className='relative'>
      //         <button
      //           type='button'
      //           className='absolute -top-2 sm:-top-5 right-4 bg-white rounded-full p-2 sm:p-3 z-20 flex items-center justify-center shadow-md hover:bg-primary-main/10 transition-colors'
      //           aria-label='Favorite'
      //         >
      //           <Heart
      //             className='w-5 h-5 text-primary-main'
      //             strokeWidth={3}
      //             fill='white'
      //           />
      //         </button>
      //         <div className='text-xl font-extrabold text-primary-main mb-1'>
      //           {price}
      //         </div>
      //         <div className='text-lg font-semibold text-black mb-1 truncate'>
      //           {title}
      //         </div>
      //         <div className='flex items-center text-gray-400 mb-2 gap-1'>
      //           <Image src={pinIcon} alt='pin' />
      //           <span className='truncate'>{location}</span>
      //         </div>
      //         <div className='flex items-center text-gray-400  gap-2 mb-4 '>
      //           <PhoneIcon className='w-4 text-primary-main' />
      //           <span className='font-medium'>{agent.name}</span>
      //           {agent.isVerified && (
      //             <Image src={verified} alt='verified' width={16} height={16} />
      //           )}
      //         </div>
      //         <div className='flex flex-wrap text-gray-400 text-base gap-3 sm:gap-5 mb-2'>
      //           {bedrooms !== undefined && (
      //             <div className='flex items-center gap-1'>
      //               <Image src={bedIcon} alt='bed' />
      //               <span>{bedrooms} Bedroom</span>
      //             </div>
      //           )}
      //           {baths !== undefined && (
      //             <div className='flex items-center gap-1'>
      //               <Image src={bathIcon} alt='bath' />
      //               <span>{baths} Bath</span>
      //             </div>
      //           )}
      //           {area !== undefined && (
      //             <div className='flex items-center gap-1'>
      //               <Image src={areaIcon} alt='area' />
      //               <span>{area} sqm</span>
      //             </div>
      //           )}
      //         </div>
      //       </div>
      //       <div className='flex flex-col sm:flex-row gap-3 mt-2'>
      //         <a
      //           href={`https://wa.me/${agent.whatsapp}`}
      //           className='flex-1 py-2 rounded-full border border-primary-main text-sm text-primary-main text-center font-semibold'
      //           target='_blank'
      //           rel='noopener noreferrer'
      //         >
      //           Whatsapp
      //         </a>
      //         <a
      //           href={`mailto:${agent.email}`}
      //           className='flex-1 py-2 rounded-full bg-primary-main text-sm text-white text-center font-semibold'
      //         >
      //           Direct Message
      //         </a>
      //       </div>
      //     </div>
      //   </div>
      // </Link>
      <div className='flex flex-col sm:flex-row bg-white rounded-2xl shadow-lg shadow-[#F7EFFD] transition-transform duration-300 cursor-pointer max-w-full p-3 gap-4'>
        <div className='flex-shrink-0 rounded-2xl overflow-hidden w-full sm:w-[295px] h-[200px] sm:h-[280px]'>
          <Link href={`/property/${id}`}>
            <Image
              src={images[0].imageUrl}
              alt={listingTitle}
              width={195}
              height={240}
              className='object-cover w-full h-full'
            />
          </Link>
        </div>

        <div className='flex-1 min-w-0 flex flex-col sm:h-[280px] justify-around'>
          <div className='relative'>
            <button
              type='button'
              className='absolute -top-2 sm:-top-5 right-4 bg-white rounded-full p-2 sm:p-3 z-20 flex items-center justify-center shadow-md hover:bg-primary-main/10 transition-colors'
              aria-label='Favorite'
            >
              <Heart
                className='w-5 h-5 text-primary-main'
                strokeWidth={3}
                fill='white'
              />
            </button>

            {/* Wrap only the title/content block in the Link */}
            <Link href={`/property/${id}`}>
              <div className='text-xl font-extrabold text-primary-main mb-1'>
                {listingPrice}
              </div>
              <div className='text-lg font-semibold text-black mb-1 truncate'>
                {listingTitle}
              </div>
              <div className='flex items-center text-gray-400 mb-2 gap-1'>
                <Image src={pinIcon} alt='pin' />
                <span className='truncate'>{address}</span>
              </div>
              <div className='flex items-center text-gray-400  gap-2 mb-4 '>
                <PhoneIcon className='w-4 text-primary-main' />
                <span className='font-medium'>
                  {scrapeContactInfo.agentName}
                </span>
                {scrapeContactInfo.agentName && (
                  <Image src={verified} alt='verified' width={16} height={16} />
                )}
              </div>
              <div className='flex flex-wrap text-gray-400 text-base gap-3 sm:gap-5 mb-2'>
                {numberOfBedrooms !== null && (
                  <div className='flex items-center gap-1'>
                    <Image src={bedIcon} alt='bed' />
                    <span>{numberOfBedrooms} Bedroom</span>
                  </div>
                )}
                {numberOfBathrooms !== null && (
                  <div className='flex items-center gap-1'>
                    <Image src={bathIcon} alt='bath' />
                    <span>{numberOfBathrooms} Bath</span>
                  </div>
                )}
                {floorArea !== null && (
                  <div className='flex items-center gap-1'>
                    <Image src={areaIcon} alt='area' />
                    <span>{floorArea} sqm</span>
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Contact buttons OUTSIDE of <Link> */}
          <div className='flex flex-col sm:flex-row gap-3 mt-2'>
            {scrapeContactInfo.phoneNumber && (
              <a
                href={`https://wa.me/${scrapeContactInfo.phoneNumber}`}
                className='flex-1 py-2 rounded-full border border-primary-main text-sm text-primary-main text-center font-semibold'
                target='_blank'
                rel='noopener noreferrer'
              >
                Whatsapp
              </a>
            )}
            {scrapeContactInfo.email && (
              <a
                href={`mailto:${scrapeContactInfo.email}`}
                className='flex-1 py-2 rounded-full bg-primary-main text-sm text-white text-center font-semibold'
              >
                Direct Message
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default (list) card
  return (
    // <div className='block'>
    //   <div className=' mx-auto rounded-2xl shadow-lg shadow-[#F7EFFD] transition-transform duration-300 cursor-pointer bg-white relative'>
    //     <div className='relative'>
    //       <PropertyImages images={images} title={title} cardMode />
    //     </div>
    //     <div className='p-4'>
    //       <Link href={`/property/${slug}`} className=''>
    //         <div className='flex items-center justify-between mb-1'>
    //           <div className='w-3/4 text-lg font-semibold text-black truncate'>
    //             {title}
    //           </div>
    //           <div className='font-extrabold text-lg text-primary-main'>
    //             {price}
    //           </div>
    //         </div>
    //         <div className='flex items-center text-gray-400 mb-2 gap-3 mx-3'>
    //           <Image src={pinIcon} alt='pin' />
    //           <span className='truncate'>{location}</span>
    //         </div>
    //         <div className='flex items-center text-gray-400  gap-2 mb-4 mx-3'>
    //           <PhoneIcon className='w-4 text-primary-main' />
    //           <span className='font-medium'>{agent.name}</span>
    //           {agent.isVerified && (
    //             <Image src={verified} alt='verified' width={16} height={16} />
    //           )}
    //         </div>
    //         <div className='flex text-gray-400 text-base gap-5 mb-2'>
    //           {bedrooms !== undefined && (
    //             <div className='flex flex-col gap-1'>
    //               <Image src={bedIcon} alt='bed' />
    //               <span>{bedrooms} Bedroom</span>
    //             </div>
    //           )}
    //           {baths !== undefined && (
    //             <div className='flex flex-col gap-1'>
    //               <Image src={bathIcon} alt='bath' />
    //               <span>{baths} Bath</span>
    //             </div>
    //           )}
    //           {area !== undefined && (
    //             <div className='flex flex-col gap-1'>
    //               <Image src={areaIcon} alt='area' />
    //               <span>{area} sqm</span>
    //             </div>
    //           )}
    //         </div>
    //         <div className='flex gap-3'>
    //           <a
    //             href={`https://wa.me/${agent.whatsapp}`}
    //             className='flex-1 py-2 flex items-center justify-center text-sm rounded-full border border-primary-main text-primary-main text-center font-semibold'
    //             target='_blank'
    //             rel='noopener noreferrer'
    //           >
    //             Whatsapp
    //           </a>
    //           <a
    //             href={`mailto:${agent.email}`}
    //             className='flex-1 flex items-center justify-center rounded-full bg-primary-main text-white text-center text-sm font-semibold'
    //           >
    //             Direct Message
    //           </a>
    //         </div>
    //       </Link>
    //     </div>
    //   </div>
    // </div>
    <div className='block'>
      <div className='mx-auto rounded-2xl shadow-lg shadow-[#F7EFFD] transition-transform duration-300 cursor-pointer bg-white relative'>
        <div className='relative'>
          <PropertyImages images={images} title={listingTitle} cardMode />
        </div>
        <div className='p-4'>
          {/* Only wrap the title and property info in the Link */}
          <Link href={`/property/${id}`}>
            <div className='flex items-center justify-between mb-1'>
              <div className='w-3/4 text-lg font-semibold text-black truncate'>
                {listingTitle}
              </div>
              <div className='font-extrabold text-lg text-primary-main'>
                {listingPrice}
              </div>
            </div>
            <div className='flex items-center text-gray-400 mb-2 gap-3 mx-3'>
              <Image src={pinIcon} alt='pin' />
              <span className='truncate'>{address}</span>
            </div>
            <div className='flex items-center text-gray-400  gap-2 mb-4 mx-3'>
              <PhoneIcon className='w-4 text-primary-main' />
              <span className='font-medium'>{scrapeContactInfo.agentName}</span>
              {scrapeContactInfo.agentName && (
                <Image src={verified} alt='verified' width={16} height={16} />
              )}
            </div>
            <div className='flex text-gray-400 text-base gap-5 mb-2'>
              {numberOfBedrooms !== null && (
                <div className='flex flex-col gap-1'>
                  <Image src={bedIcon} alt='bed' />
                  <span>{numberOfBedrooms} Bedroom</span>
                </div>
              )}
              {numberOfBathrooms !== null && (
                <div className='flex flex-col gap-1'>
                  <Image src={bathIcon} alt='bath' />
                  <span>{numberOfBathrooms} Bath</span>
                </div>
              )}
              {floorArea !== null && (
                <div className='flex flex-col gap-1'>
                  <Image src={areaIcon} alt='area' />
                  <span>{floorArea} sqm</span>
                </div>
              )}
            </div>
          </Link>

          {/* Contact buttons should be outside the Link */}
          <div className='flex gap-3 mt-3'>
            {scrapeContactInfo.phoneNumber && (
              <a
                href={`https://wa.me/${scrapeContactInfo.phoneNumber}`}
                className='flex-1 py-2 flex items-center justify-center text-sm rounded-full border border-primary-main text-primary-main font-semibold'
              >
                Whatsapp
              </a>
            )}
            {scrapeContactInfo.email && (
              <a
                href={`mailto:${scrapeContactInfo.email}`}
                className='flex-1 flex items-center justify-center rounded-full bg-primary-main text-white text-sm font-semibold'
              >
                Direct Message
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
