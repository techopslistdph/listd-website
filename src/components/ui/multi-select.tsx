import * as React from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'

export interface MultiSelectOption {
  label: string
  value: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onSelectedChange: (selected: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  maxDisplay?: number
}

export function MultiSelect({
  options,
  selected,
  onSelectedChange,
  placeholder = 'Select options...',
  className,
  disabled = false,
  maxDisplay = 3,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value]
    onSelectedChange(newSelected)
  }

  const handleRemove = (value: string) => {
    onSelectedChange(selected.filter(item => item !== value))
  }

  const selectedOptions = options.filter(option => selected.includes(option.value))

  const displayText = React.useMemo(() => {
    if (selected.length === 0) return placeholder
    if (selected.length === 1) return selectedOptions[0]?.label
    return `${selected.length} selected`
  }, [selected, selectedOptions, placeholder])

  return (
    <div className={cn('w-full', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between rounded-full bg-neutral-light px-4 py-6 text-base hover:bg-neutral-light focus:outline-none'
            disabled={disabled}
          >
            <span className='truncate text-xs text-gray-500'>{displayText}</span>
            <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0' align='start'>
          <div className='max-h-60 overflow-auto'>
            {options.map(option => (
              <div
                key={option.value}
                className='flex items-center space-x-2 p-2 hover:bg-accent cursor-pointer'
                onClick={() => handleSelect(option.value)}
              >
                <Checkbox
                  checked={selected.includes(option.value)}
                  onChange={() => handleSelect(option.value)}
                />
                <span className='flex-1 text-sm'>{option.label}</span>
                {selected.includes(option.value) && (
                  <Check className='h-4 w-4 text-primary' />
                )}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className='mt-2 flex flex-wrap gap-1'>
          {selectedOptions.slice(0, maxDisplay).map(option => (
            <Badge
              key={option.value}
              variant='secondary'
              className='inline-flex items-center gap-1 px-2 py-1 bg-primary-light text-primary-dark text-xs rounded-full'
            >
              {option.label}
              <button
                onClick={() => handleRemove(option.value)}
                className='hover:bg-primary-main hover:text-white rounded-full w-4 h-4 flex items-center justify-center ml-1'
                type='button'
              >
                <X className='h-3 w-3' />
              </button>
            </Badge>
          ))}
          {selected.length > maxDisplay && (
            <Badge
              variant='secondary'
              className='bg-primary-light text-primary-dark text-xs rounded-full'
            >
              +{selected.length - maxDisplay} more
            </Badge>
          )}
        </div>
      )}
    </div>
  )
} 