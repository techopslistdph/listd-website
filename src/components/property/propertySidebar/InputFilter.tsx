import { useEffect, useState } from 'react';
interface InputFilterProps {
  minFloorArea: string;
  maxFloorArea: string;
  onFloorAreaChange: (min: string, max: string) => void;
}

export const InputFilter = ({
  minFloorArea,
  maxFloorArea,
  onFloorAreaChange,
}: InputFilterProps) => {
  const [floorAreaMin, setFloorAreaMin] = useState(minFloorArea);
  const [floorAreaMax, setFloorAreaMax] = useState(maxFloorArea);

  useEffect(() => {
    setFloorAreaMin(minFloorArea);
    setFloorAreaMax(maxFloorArea);
  }, [minFloorArea, maxFloorArea]);

  const handleSquareFeetChange = (type: 'min' | 'max', value: string) => {
    if (type === 'min') {
      setFloorAreaMin(value);
      onFloorAreaChange(value, floorAreaMax);
    } else {
      setFloorAreaMax(value);
      onFloorAreaChange(floorAreaMin, value);
    }
  };

  return (
    <div>
      <div className='font-bold text-lg mb-3'>Square Meter</div>
      <div className='flex flex-col gap-2'>
        <input
          type='text'
          placeholder='Minimum'
          className='rounded-full focus:outline-none px-4 py-3 bg-neutral-light text-sm'
          value={floorAreaMin}
          onChange={e => handleSquareFeetChange('min', e.target.value)}
        />
        <input
          type='text'
          placeholder='Maximum'
          className='rounded-full focus:outline-none px-4 py-3 bg-neutral-light text-sm'
          value={floorAreaMax}
          onChange={e => handleSquareFeetChange('max', e.target.value)}
        />
      </div>
    </div>
  );
};
