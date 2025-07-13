import Image from 'next/image'

interface ListingEmptyStateProps {
  activeTab: 'published' | 'draft' | 'closed'
}

export default function ListingEmptyState({ activeTab }: ListingEmptyStateProps) {
  const getEmptyStateContent = () => {
    switch (activeTab) {
      case 'published':
        return {
          title: 'No published listings to show.',
          description: "You don't have any published listings yet."
        }
      case 'draft':
        return {
          title: 'No draft listings to show.',
          description: "You don't have any draft listings yet."
        }
      case 'closed':
        return {
          title: 'No closed listings to show.',
          description: "You don't have any closed listings yet."
        }
    }
  }

  const content = getEmptyStateContent()

  return (
    <div className='flex flex-col items-center justify-center mt-12 lg:mt-24'>
      <Image
        src='/images/icons/empty.svg'
        alt='No listings'
        width={150}
        height={50}
        className='mb-4 lg:mb-8 lg:w-[204px] lg:h-[67px]'
      />
      <div className='text-xl lg:text-2xl font-bold text-primary-main mb-2 text-center'>
        {content.title}
      </div>
      <div className='text-sm lg:text-base text-gray-400 text-center'>
        {content.description}
      </div>
    </div>
  )
} 