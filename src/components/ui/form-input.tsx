import { FieldValues, Path, useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: string;
  description?: string;
  disabled?: boolean;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
}

export const FormInput = <T extends FieldValues>({
  name,
  label,
  type = 'text',
  description,
  disabled = false,
  placeholder,
  readonly = false,
  required = true,
}: FormInputProps<T>) => {
  const form = useFormContext<T>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-col w-full'>
          <FormLabel className='text-xs sm:text-sm'>
            {label}
            {required && <span className='text-red-500'>*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              className='mb-2 px-6 py-5'
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              readOnly={readonly}
            />
          </FormControl>
          <FormMessage />
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
};
