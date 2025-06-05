import { useDebounce } from '@/hooks/useDebounce';
import { useUrlParams } from '@/hooks/useUrlParams';
import { useRouter } from 'nextjs-toploader/app';
import { useEffect, useState } from 'react';

export const InputFilter = () => {
  const {push} = useRouter();
  const { getParam, updateParams } = useUrlParams();

  const minFloorArea = getParam('minFloorArea');
  const maxFloorArea = getParam('maxFloorArea');

  const [floorAreaMin, setFloorAreaMin] = useState(minFloorArea || '');
  const [floorAreaMax, setFloorAreaMax] = useState(maxFloorArea || '');

  const debouncedFloorAreaMin = useDebounce(floorAreaMin, 300);
  const debouncedFloorAreaMax = useDebounce(floorAreaMax, 300);

  useEffect(() => {
    setFloorAreaMin(minFloorArea || '');
    setFloorAreaMax(maxFloorArea || '');
  }, [minFloorArea, maxFloorArea]);

  useEffect(() => {
    if (
      debouncedFloorAreaMin !== minFloorArea ||
      debouncedFloorAreaMax !== maxFloorArea
    ) {
      const params = updateParams({
        minFloorArea: debouncedFloorAreaMin || null,
        maxFloorArea: debouncedFloorAreaMax || null,
      });
      push(`/property?${params}`);
    }
  }, [
    debouncedFloorAreaMin,
    debouncedFloorAreaMax,
    minFloorArea,
    maxFloorArea,
    updateParams,
    push,
  ]);

  const handleSquareFeetChange = (type: 'min' | 'max', value: string) => {
    if (type === 'min') {
      setFloorAreaMin(value);
    } else {
      setFloorAreaMax(value);
    }
  };

  return (
    <div>
      <div className='font-bold text-xl mb-3'>Square Meter</div>
      <div className='flex flex-col gap-2'>
        <input
          type='text'
          placeholder='Minimum'
          className='rounded-full focus:outline-none px-4 py-3 bg-neutral-light'
          value={floorAreaMin}
          onChange={e => handleSquareFeetChange('min', e.target.value)}
        />
        <input
          type='text'
          placeholder='Maximum'
          className='rounded-full focus:outline-none px-4 py-3 bg-neutral-light'
          value={floorAreaMax}
          onChange={e => handleSquareFeetChange('max', e.target.value)}
        />
      </div>
    </div>
  );
};
