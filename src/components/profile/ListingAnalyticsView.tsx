import React from 'react';
import { Eye, Search, Heart, MessageCircle, Download } from 'lucide-react';
import { Listing } from '@/app/data';
import Image, { StaticImageData } from 'next/image';
import areaIcon from '../../../public/images/icons/squaremeter.svg';
import bedIcon from '../../../public/images/icons/bedroom.svg';
import bathIcon from '../../../public/images/icons/bath.svg';
import fullyFurnishedIcon from '../../../public/images/icons/fully-furnished.svg';
import parkingIcon from '../../../public/images/icons/car.svg';
import facingWestIcon from '../../../public/images/icons/facing-west.svg';
import ListingDetailsView from './ListingDetailsView';

interface ListingAnalyticsViewProps {
  listing: Listing;
  setUpdateDialogProperty: (listing: Listing) => void;
  setUpdateDialogOpen: (open: boolean) => void;
}

const analytics = [
  {
    icon: <Eye className='text-green-400 w-6 h-6' />,
    color: 'bg-[var(--success-light)]',
    label: 'Views',
    value: 125,
  },
  {
    icon: <Search className='text-purple-400 w-6 h-6' />,
    color: 'bg-[var(--secondary-light)]',
    label: 'Clicks',
    value: 125,
  },
  {
    icon: <Heart className='text-red-400 w-6 h-6' />,
    color: 'bg-[var(--error-light)]',
    label: 'Saves',
    value: 125,
  },
  {
    icon: <MessageCircle className='text-purple-400 w-6 h-6' />,
    color: 'bg-[var(--primary-light)]',
    label: 'Inquiries',
    value: 125,
  },
];

const iconMap: Record<string, StaticImageData> = {
  area: areaIcon,
  bedrooms: bedIcon,
  baths: bathIcon,
  parking: parkingIcon,
  'facing west': facingWestIcon,
  'fully furnished': fullyFurnishedIcon,
  // Add more mappings as needed
};

function getIconForKey(key: string): StaticImageData | undefined {
  return iconMap[key];
}

export default function ListingAnalyticsView({
  listing,
  setUpdateDialogProperty,
  setUpdateDialogOpen,
}: ListingAnalyticsViewProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  if (showDetails) {
    return (
      <ListingDetailsView
        listing={listing}
        setUpdateDialogProperty={setUpdateDialogProperty}
        setUpdateDialogOpen={setUpdateDialogOpen}
      />
    );
  }

  return (
    <div className='p-8'>
      {/* Back Button */}

      {/* Title & Address */}
      <div className='mb-2 text-xl font-bold'>{listing.title}</div>
      <div className='text-gray-400 mb-2'>{listing.location}</div>
      <div className='text-2xl font-bold mb-4'>{listing.price}</div>
      <hr className='mb-6' />

      {/* Property Details */}
      <div className='flex justify-between text-center my-8'>
        {listing.description.map((item, idx) => {
          const key = Object.keys(item)[0];
          const value = item[key];
          if (value === undefined || value === false) return null;
          const icon = getIconForKey(key);
          const isBoolean = typeof value === 'boolean';
          return (
            <div
              key={idx}
              className='flex flex-col items-center justify-center gap-1 text-[var(--neutral-mid)] text-sm'
            >
              {icon && <Image src={icon} alt={key} width={20} height={20} />}
              {isBoolean ? (
                key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
              ) : (
                <>
                  {String(value)}{' '}
                  {key === 'parking'
                    ? 'Parking'
                    : key === 'baths'
                    ? 'Bath'
                    : key === 'bedrooms'
                    ? 'Bedroom'
                    : key === 'area'
                    ? ''
                    : ''}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Listing Analytics */}
      <div className='mb-8'>
        <div className='flex justify-between items-center mb-4'>
          <div>
            <div className='font-bold text-lg'>Listing Analytics</div>
            <div className='text-gray-400 text-sm'>
              Track how your listing is performing
            </div>
          </div>
          <button className='flex items-center text-[var(--primary-mid)] font-bold cursor-pointer'>
            <Download className='w-5 h-5 mr-2' /> Export report
          </button>
        </div>
        <div className='space-y-4'>
          {analytics.map((item) => (
            <div
              key={item.label}
              className='flex items-center bg-[#FAF8FF] rounded-2xl p-4 justify-between'
            >
              <div className='flex items-center gap-4'>
                <span
                  className={`rounded-full p-2 ${item.color} text-[var(--primary-main)]`}
                >
                  {item.icon}
                </span>
                <div className='flex flex-col'>
                  <span className='text-2xl font-bold text-[var(--primary-mid)]'>
                    {item.value}
                  </span>
                  <span className='text-[var(--primary-mid)] text-xs'>
                    {item.label}
                  </span>
                </div>
              </div>
              <span className='text-[var(--primary-mid)] flex items-center gap-1 text-sm'></span>
            </div>
          ))}
        </div>
      </div>

      {/* Listing Actions */}
      <div>
        <div className='font-bold text-lg mb-1'>Listing Actions</div>
        <div className='text-gray-400 text-sm mb-4'>
          Manage your property listing settings
        </div>
        <button
          className='flex items-center bg-white border border-gray-200 cursor-pointer rounded-xl p-4 w-full'
          onClick={() => setShowDetails(true)}
        >
          <Eye className='text-[#7B6CD9] w-5 h-5 mr-3' />
          <span className='font-semibold'>View Listing Details</span>
        </button>
      </div>
    </div>
  );
}
