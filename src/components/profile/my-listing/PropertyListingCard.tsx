/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import { PhoneIcon } from 'lucide-react'
import { PropertyDetail } from '@/lib/queries/server/propety/type'
import { Button } from '../../ui/button'
import PropertyFeatures from './PropertyFeatures'
import verified from '@/../public/images/icons/verified.png'
import placeholderImg from '../../../../public/images/placeholder-image.png'

interface PropertyListingCardProps {
  property: PropertyDetail
  features: {
    numberOfBedrooms?: number | null
    numberOfBathrooms?: number | null
    floorArea?: number | null
    lotSize?: number | null
  }
  onCardClick: () => void
  onDelete: (id: string, propertyType: string) => void
  onEdit: (property: PropertyDetail) => void
}

export default function PropertyListingCard({
  property,
  features,
  onCardClick,
  onDelete,
  onEdit
}: PropertyListingCardProps) {
  const isDraft = property.property.isDraft
  const listingType = property.property.listingTypeName

  const getListingTypeStyle = () => {
    switch (listingType) {
      case 'Buy':
        return 'bg-green-100 text-green-600'
      case 'Rent':
        return 'bg-primary-light text-primary-main'
      default:
        return 'bg-gray-200 text-gray-500'
    }
  }

  const getListingTypeLabel = () => {
    return listingType === 'Buy' ? 'For Sale' : 'For Rent'
  }

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-4 bg-white rounded-3xl shadow-2xl shadow-[#F7EFFD] p-4 lg:p-6 transition w-full ${
        !isDraft ? 'cursor-pointer' : ''
      }`}
      onClick={!isDraft ? onCardClick : undefined}
    >
      {/* Property Image */}
      <div className='flex-shrink-0 flex items-center mb-4 lg:mb-0 col-span-1'>
        <img
          src={property?.property?.images?.[0]?.imageUrl || placeholderImg.src}
          alt={property.property.listingTitle}
          width={240}
          height={200}
          className='w-full lg:w-full h-72 lg:h-56 object-cover rounded-2xl mb-auto'
        />
      </div>

      {/* Property Details */}
      <div className='flex flex-col justify-between lg:ml-8 flex-1 col-span-3'>
        <div>
          {/* Listing Type Badge */}
          <div className='flex items-center mb-2'>
            <span
              className={`px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm font-medium mr-4 ${getListingTypeStyle()}`}
            >
              {getListingTypeLabel()}
            </span>
          </div>

          {/* Price */}
          {property.property.listingPrice && (
            <div className='text-[#4B23A0] font-bold text-xl lg:text-2xl mb-1'>
              {property.property.listingPrice.toLocaleString('en-US', {
                style: 'currency',
                currency: 'PHP'
              }) || 'Price not available'}
            </div>
          )}

          {/* Title */}
          <div className='text-lg lg:text-xl font-semibold mb-1 break-words'>
            {property.property.listingTitle || 'Title not available'}
          </div>

          {/* Address */}
          <div className='flex items-center text-gray-400 text-sm lg:text-base mb-1 break-words'>
            <svg
              className='w-4 h-4 lg:w-5 lg:h-5 mr-1'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
            {property.property.address ||
              `${property.property.cityName}, ${property.property.barangayName}` ||
              'Address not available'}
          </div>

          {/* Agent Info */}
          {property?.property?.scrapeContactInfo?.agentName && (
            <div className='flex items-center text-gray-400 text-sm lg:text-base mb-4'>
              <PhoneIcon className='w-4 h-4 lg:w-5 lg:h-5 mr-1' />
              {property?.property?.scrapeContactInfo?.agentName}
              <Image
                src={verified}
                alt='verified'
                className='w-3 lg:w-4 ml-1'
              />
            </div>
          )}
        </div>

        {/* Features and Actions */}
        <div className='flex flex-wrap gap-4 justify-between text-gray-400 text-sm lg:text-base'>
          <PropertyFeatures features={features} />
          
          {/* Draft Actions */}
          {isDraft && (
            <div className='flex justify-end mt-2 gap-2 items-end'>
              <Button
                variant='outline'
                className='rounded-full py-3 lg:py-5 px-4 lg:px-8 w-full lg:w-44 border-primary-main text-primary-main hover:bg-white cursor-pointer'
                type='button'
                onClick={() =>
                  onDelete(property.id, property.property.propertyTypeName)
                }
              >
                Delete
              </Button>
              <Button
                type='button'
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  onEdit(property)
                }}
                className='rounded-full py-3 lg:py-5 px-4 lg:px-8 w-full lg:w-44 bg-primary-main text-white hover:bg-primary-main border border-primary-main cursor-pointer'
              >
                Edit
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 