import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import pinIcon from '../../../public/images/icons/pin.svg';
import bedIcon from '../../../public/images/icons/bedroom.svg';
import bathIcon from '../../../public/images/icons/bath.svg';
import areaIcon from '../../../public/images/icons/squaremeter.svg';

interface Agent {
  name: string;
  image: StaticImageData;
  whatsapp: string;
  email: string;
  isVerified: boolean;
  position: string;
}

interface PropertyCardProps {
  images: StaticImageData[];
  price: string;
  title: string;
  location: string;
  tag: string;
  description: { [key: string]: string | number | boolean | undefined }[];
  isVerified: boolean;
  features: string[];
  googleMap: string;
  agent: Agent;
  slug: string;
  view?: 'list' | 'map';
}

export default function PropertyCard({
  images,
  price,
  title,
  location,
  description,
  slug,
  view = 'list',
}: PropertyCardProps) {
  // Extract bedrooms, baths, area, and other info from description
  const bedrooms = description.find((d) => d.bedrooms !== undefined)?.bedrooms;
  const baths = description.find((d) => d.baths !== undefined)?.baths;
  const area = description.find((d) => d.area !== undefined)?.area;

  if (view === 'map') {
    // Horizontal card for map view
    return (
      <Link href={`/property/${slug}`} className='block'>
        <div className='flex bg-white rounded-2xl shadow-lg shadow-[#F7EFFD] transition-transform duration-300 cursor-pointer max-w-full min-h-[140px] p-3 gap-4 items-center'>
          <div className='flex-shrink-0 rounded-2xl overflow-hidden w-[195px] h-[195px]'>
            <Image
              src={images[0]}
              alt={title}
              width={195}
              height={240}
              className='object-cover w-full h-full'
            />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='text-xl font-extrabold text-[var(--primary-main)] mb-1'>
              {price}
            </div>
            <div className='text-lg font-semibold text-black mb-1 truncate'>
              {title}
            </div>
            <div className='flex items-center text-gray-400 mb-4 gap-1'>
              <Image src={pinIcon} alt='pin' />
              <span className='truncate'>{location}</span>
            </div>
            <div className='flex text-gray-400 text-base gap-5'>
              {bedrooms !== undefined && (
                <div className='flex flex-col gap-1'>
                  <Image src={bedIcon} alt='bed' />
                  <span>{bedrooms} Bedroom</span>
                </div>
              )}
              {baths !== undefined && (
                <div className='flex flex-col gap-1'>
                  <Image src={bathIcon} alt='bath' />
                  <span>{baths} Bath</span>
                </div>
              )}
              {area !== undefined && (
                <div className='flex flex-col  gap-1'>
                  <Image src={areaIcon} alt='area' />
                  <span>{area}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default (list) card
  return (
    <Link href={`/property/${slug}`} className='block'>
      <div className='max-w-[320px] mx-auto rounded-2xl shadow-lg shadow-[#F7EFFD] transition-transform duration-300  cursor-pointer'>
        <div className='overflow-hidden rounded-3xl'>
          <Image
            src={images[0]}
            alt={title}
            width={400}
            height={350}
            className='object-cover w-full min-h-[350px]'
          />
        </div>
        <div className='p-4'>
          <div className='text-2xl font-extrabold text-[var(--primary-main)] mb-1 '>
            {price}
          </div>
          <div className='text-xl font-semibold text-black mb-1 truncate'>
            {title}
          </div>
          <div className='flex items-center text-gray-400 mb-5 gap-1'>
            <Image src={pinIcon} alt='pin' />
            <span className='truncate'>{location}</span>
          </div>
          <div className='flex text-gray-400 text-lg gap-5'>
            {bedrooms !== undefined && (
              <div className='flex flex-col'>
                <Image src={bedIcon} alt='bed' />
                <span>{bedrooms} Bedroom</span>
              </div>
            )}
            {baths !== undefined && (
              <div className='flex flex-col'>
                <Image src={bathIcon} alt='bath' />
                <span>{baths} Bath</span>
              </div>
            )}
            {area !== undefined && (
              <div className='flex flex-col'>
                <Image src={areaIcon} alt='area' />
                <span>{area}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
