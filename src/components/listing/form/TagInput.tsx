import { Search } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface TagInputProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
}

export function TagInput({
  label,
  value,
  onChange,
  placeholder,
}: TagInputProps) {
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault();
      const newValue = e.currentTarget.value;
      if (!value.includes(newValue)) {
        onChange([...value, newValue]);
      }
      e.currentTarget.value = '';
    }
  };

  return (
    <div className='space-y-4'>
      <Label>{label}</Label>
      <div className='flex items-center bg-gray-50 rounded-full px-4 py-2 w-full'>
        <div className='flex flex-wrap gap-2'>
          {value.map((item, i) => (
            <span
              key={i}
              className='bg-[var(--primary-light)] text-[var(--primary-mid)] px-4 py-2 rounded-xl text-base flex items-center font-normal'
            >
              {item}
              <button
                className='ml-2 text-[var(--primary-mid)] hover:text-[var(--primary-main)] focus:outline-none'
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <input
          className='flex-1 bg-transparent placeholder:text-sm outline-none border-none px-2 text-base'
          placeholder={placeholder}
          onKeyDown={handleTagInput}
          style={{ minWidth: 0 }}
        />
        <Search className='ml-4 w-6 h-6 text-black' />
      </div>
    </div>
  );
}
