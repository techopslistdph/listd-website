import Image from 'next/image'
import areaIcon from '../../../../public/images/icons/squaremeter.svg'
import bedIcon from '../../../../public/images/icons/bedroom.svg'
import bathIcon from '../../../../public/images/icons/bath.svg'

interface PropertyFeaturesProps {
  features: {
    numberOfBedrooms?: number | null
    numberOfBathrooms?: number | null
    floorArea?: number | null
    lotSize?: number | null
  }
}

export default function PropertyFeatures({ features }: PropertyFeaturesProps) {
  const featureItems = [
    {
      value: features.numberOfBedrooms,
      label: 'Bedroom',
      icon: bedIcon,
      alt: 'bed'
    },
    {
      value: features.numberOfBathrooms,
      label: 'Bath',
      icon: bathIcon,
      alt: 'bath'
    },
    {
      value: features.floorArea,
      label: 'sqm',
      icon: areaIcon,
      alt: 'area'
    },
    {
      value: features.lotSize,
      label: 'sqm lot',
      icon: areaIcon,
      alt: 'lot'
    }
  ]

  return (
    <div className='flex text-gray-400 text-base gap-5 m-2'>
      {featureItems.map((item, index) => 
        item.value ? (
          <div key={index} className='flex flex-col gap-1'>
            <Image src={item.icon} alt={item.alt} />
            <span>{item.value} {item.label}</span>
          </div>
        ) : null
      )}
    </div>
  )
} 