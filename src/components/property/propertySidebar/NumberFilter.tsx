export const NumberFilter = ({
  options,
  activeValue,
  onChange,
  label,
}: {
  options: { label: string; value: string }[];
  activeValue: string;
  onChange: (value: string) => void;
  label: string;
}) => {
  return (
    <div>
      <div className='font-bold text-lg mb-3'>{label}</div>
      <div className='flex gap-2 flex-wrap'>
        {options.map(option => (
          <button
            key={option.value}
            className={`border border-primary-main cursor-pointer text-primary-main rounded-full px-3 py-1 text-sm font-medium ${
              activeValue === option.value ? 'bg-primary-main text-white' : ''
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
