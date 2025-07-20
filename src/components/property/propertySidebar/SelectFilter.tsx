import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select';

interface SelectFilterProps {
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
  options: MultiSelectOption[];
  isLoading: boolean;
  placeholder: string;
}

export const SelectFilter = ({
  selectedFeatures,
  onFeaturesChange,
  options,
  isLoading,
  placeholder,
}: SelectFilterProps) => {
  if (isLoading) {
    return (
      <div>
        <div className='font-bold text-xl mb-3'>{placeholder}</div>
        <div className='rounded-full bg-neutral-light px-4 py-6 animate-pulse'>
          <div className='h-4 bg-gray-300 rounded w-32'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      <div className='font-bold text-lg'>{placeholder}</div>
      <MultiSelect
        options={options}
        selected={selectedFeatures}
        onSelectedChange={onFeaturesChange}
        placeholder={placeholder}
        maxDisplay={3}
      />
    </div>
  );
};
