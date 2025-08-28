import { Button } from '@/components/ui/button';
import { useUrlParams } from '@/hooks/useUrlParams';
import { cn } from '@/lib/utils';
import { RootStoreType } from '@/models/RootStore';
import {
  clearPolygonFromStorage,
  Geojson,
  handleCancelHandle,
  handleDrawToSearchBtn,
  triggerSearchWithCoordinates,
} from '@/utils/mapUtils';
import { Pencil, Search, X } from 'lucide-react';
import { SearchParams } from 'next/dist/server/request/search-params';
import { useRouter } from 'nextjs-toploader/app';
import React from 'react';

export default function Controls({
  showDrawButton,
  setEnableDraw,
  setShowInstructionNote,
  setShowDrawButton,
  setPoligon,
  setShouldAutoFitProperties,
  setShowControls,
  polygon,
  geojson,
  showControls,
  setIsLoading,
  rootStore,
  setHasDrawnPolygon,
  setIsCancelling,
}: {
  showDrawButton: boolean;
  setEnableDraw: (enable: boolean) => void;
  setShowInstructionNote: (show: boolean) => void;
  setShowDrawButton: (show: boolean) => void;
  setPoligon: (polygon: google.maps.Polygon | null) => void;
  setShouldAutoFitProperties: (shouldAutoFit: boolean) => void;
  setShowControls: (show: boolean) => void;
  polygon: google.maps.Polygon | null;
  geojson: Geojson[];
  showControls: boolean;
  setIsLoading: (loading: boolean) => void;
  setIsCancelling: (cancelling: boolean) => void;
  rootStore: RootStoreType;
  setHasDrawnPolygon: (hasDrawn: boolean) => void;
}) {
  const { deleteParams, getAllParams, createParamsString } = useUrlParams();
  const router = useRouter();

  const onSearchHandle = () => {
    if (!polygon) return;
    const path = polygon
      .getPath()
      .getArray()
      .map(coord => ({
        latitude: coord.lat(),
        longitude: coord.lng(),
      }));
    const allParams = getAllParams();

    const finalParams = triggerSearchWithCoordinates(
      path,
      allParams as SearchParams
    );
    const paramsString = createParamsString(finalParams);

    // Reset the hasDrawnPolygon state when search is clicked
    setHasDrawnPolygon(false);

    // Set loading to true before navigation
    setIsLoading(true);
    router.push(`/property?${paramsString}`);
  };

  // Update the onCancelHandle function
  const onCancelHandle = () => {
    handleCancelHandle(
      setIsCancelling,
      rootStore,
      setEnableDraw,
      setShowControls,
      setShowDrawButton,
      setShouldAutoFitProperties,
      setPoligon,
      polygon
    );

    setHasDrawnPolygon(false);
    setIsLoading(true);

    const paramsString = deleteParams([
      'minLatitude',
      'maxLatitude',
      'minLongitude',
      'maxLongitude',
      'region',
      'province',
      'city',
      'barangay',
    ]);
    router.push(`/property?${paramsString}`);
  };

  return (
    <>
      {showDrawButton && (
        <Button
          className={cn(
            'absolute bottom-10 z-10 m-auto left-0 right-0 w-40 bg-primary-main text-white hover:bg-secondary-main cursor-pointer'
          )}
          onClick={() =>
            handleDrawToSearchBtn(
              setEnableDraw,
              setShowInstructionNote,
              setShowDrawButton,
              setPoligon,
              setShouldAutoFitProperties,
              setShowControls,
              polygon,
              clearPolygonFromStorage
            )
          }
        >
          <Pencil />
          {geojson ? 'Draw New Area' : 'Start Drawing'}
        </Button>
      )}
      {showControls && (
        <div className='absolute flex bottom-8 z-10 m-auto left-0 right-0 gap-2 items-center justify-center text-center p-2'>
          <Button
            onClick={onSearchHandle}
            className={cn(
              'px-10 cursor-pointer bg-primary-main text-white hover:bg-secondary-main'
            )}
          >
            Search
            <Search size={20} className='ml-2' />
          </Button>
          <Button
            onClick={onCancelHandle}
            className={cn(
              'border-primary-main text-primary-main px-10 cursor-pointer'
            )}
            variant={'outline'}
          >
            Cancel
            <X size={20} className='ml-2' />
          </Button>
        </div>
      )}
    </>
  );
}
