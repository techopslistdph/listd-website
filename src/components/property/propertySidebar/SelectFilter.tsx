import { useAmeneties } from '@/lib/queries/hooks/use-ameneties'
import { useMemo } from 'react'
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select'

interface SelectFilterProps {
  selectedFeatures: string[]
  onFeaturesChange: (features: string[]) => void
}

export const SelectFilter = ({ selectedFeatures, onFeaturesChange }: SelectFilterProps) => {
  const { data: amenities, isLoading } = useAmeneties()

  const amenitiesOptions: MultiSelectOption[] = useMemo(() => {
    if (!amenities?.data?.data.length) return []
    return amenities.data.data.map(amenity => ({
      label: amenity.name,
      value: amenity.name,
    }))
  }, [amenities])

  if (isLoading) {
    return (
      <div>
        <div className='font-bold text-xl mb-3'>Features & Amenities</div>
        <div className='rounded-full bg-neutral-light px-4 py-6 animate-pulse'>
          <div className='h-4 bg-gray-300 rounded w-32'></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className='font-bold text-xl mb-3'>Features & Amenities</div>
      <MultiSelect
        options={amenitiesOptions}
        selected={selectedFeatures}
        onSelectedChange={onFeaturesChange}
        placeholder='Feature & Anemeties'
        maxDisplay={3}
      />
    </div>
  )
}
