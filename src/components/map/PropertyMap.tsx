'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import {
  GoogleMap,
  useJsApiLoader,
  DrawingManager,
  Polygon,
} from '@react-google-maps/api';
import { useRouter } from 'nextjs-toploader/app';
import {
  getBoundingBox,
  getBoundingBoxCenter,
  convertBoundingBoxToString,
  calculateDistanceStatistics,
  calculateDistances,
} from '@/utils/mapUtils';
import { useStore } from '@/models/RootStore';
import { observer } from 'mobx-react-lite';
import DrawOnMapIcon from '../../../public/images/icons/draw-on-map-icon';
import { Listing } from '@/app/data';
import MarkerClustererComponent from './marker-clusterer';
import Image from 'next/image';

interface IMapProps {
  minHeight?: string;
  data?: Listing[];
}

type Location = {
  latitude: number;
  longitude: number;
} | null;

const PropertyMap: React.FC<IMapProps> = ({
  minHeight = '600px',
  data = [],
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || '',
    id: 'google-map-script',
    libraries: ['places', 'drawing'],
  });

  const rootStore = useStore();
  const router = useRouter();

  const [enableDraw, setEnableDraw] = useState<boolean>(false);
  const [showDrawButton, setShowDrawButton] = useState<boolean>(true);
  const [showInstructionNote, setShowInstructionNote] =
    useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [polygon, setPoligon] = useState<google.maps.Polygon | null>(null);
  const [center] = useState<google.maps.LatLng | google.maps.LatLngLiteral>({
    lat: rootStore.propertyListingQuery.search_latitude || 14.5,
    lng: rootStore.propertyListingQuery.search_longitude || 120.9,
  });
  const [zoom, setZoom] = useState<number>(
    rootStore.propertyListingQuery.zoom || 6
  );
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location>(null);

  const containerStyle = {
    width: '100%',
    height: 'auto',
    minHeight: minHeight,
    borderRadius: '5px',
  };

  const polygonOptions = {
    fillColor: '#6B21A8',
    strokeColor: '#6B21A8',
    fillOpacity: 0.4,
    strokeOpacity: 1,
    strokeWeight: 2,
    clickable: true,
    draggable: false,
    editable: false,
  };

  const handleDrawToSearchBtn = () => {
    onCancelHandle();
    setEnableDraw(true);
    setShowInstructionNote(true);
    setShowDrawButton(false);
  };

  const onPolygonComplete = () => {
    setEnableDraw(false);
    setShowControls(true);
    setShowInstructionNote(false);
  };

  const onSearchHandle = () => {
    if (!polygon) return;
    console.log(polygon);
    const path = polygon
      .getPath()
      .getArray()
      .map(coord => ({
        latitude: coord.lat(),
        longitude: coord.lng(),
      }));

    const search_latitude = getBoundingBoxCenter(getBoundingBox(path)).latitude;
    const search_longitude = getBoundingBoxCenter(
      getBoundingBox(path)
    ).longitude;
    const bounding_box = convertBoundingBoxToString(getBoundingBox(path));

    rootStore.propertyListingQuery.updatePropertyListingQuery(
      'search_latitude',
      search_latitude
    );
    rootStore.propertyListingQuery.updatePropertyListingQuery(
      'search_longitude',
      search_longitude
    );
    rootStore.propertyListingQuery.updatePropertyListingQuery(
      'bounding_box',
      bounding_box
    );

    const polygon_center = getBoundingBoxCenter(getBoundingBox(path));
    rootStore.propertyListingQuery.updatePropertyListingQuery(
      'polygon_path',
      path as { latitude: number; longitude: number }[]
    );
    rootStore.propertyListingQuery.updatePropertyListingQuery(
      'polygon_center',
      polygon_center
    );
    rootStore.propertyListingQuery.updatePropertyListingQuery('zoom', zoom - 1);

    const distancesFromPolylineToPolyCenter = calculateDistances(
      polygon_center,
      path
    );
    const distanceStatistics = calculateDistanceStatistics(
      distancesFromPolylineToPolyCenter
    );

    rootStore.propertyListingQuery.updatePropertyListingQuery(
      'max_distance_km',
      distanceStatistics.max
    );
  };

  const onCancelHandle = () => {
    rootStore.propertyListingQuery.resetCoordinates();
    setEnableDraw(true);
    setShowControls(false);
    setShowDrawButton(true);
    polygon?.setMap(null);
  };

  const onMapLoad = (map: google.maps.Map) => {
    setMapInstance(map);
  };

  const handleZoomChange = () => {
    if (mapInstance) {
      const newZoom = mapInstance.getZoom() || 6;
      setZoom(newZoom);
    }
  };

  let polygon_path: { lat: number; lng: number }[];

  if (rootStore.propertyListingQuery.polygon_path) {
    polygon_path = rootStore.propertyListingQuery.polygon_path.map(coord => ({
      lat: coord.latitude,
      lng: coord.longitude,
    }));
  } else {
    polygon_path = [];
  }

  return (
    <div className='h-92'>
      {isLoaded ? (
        <div className='relative'>
          {showInstructionNote && (
            <div className='absolute shadow top-14 z-10 m-auto left-0 right-0 bg-baseWhite text-center p-2 w-56'>
              Click on the map to define your area of interest.
            </div>
          )}
          {showDrawButton && (
            <Button
              className={cn(
                'absolute bottom-10 z-10 m-auto left-0 right-0 w-40'
              )}
              onClick={handleDrawToSearchBtn}
            >
              Draw to search
              <DrawOnMapIcon className='h-5 w-5 ml-2' />
            </Button>
          )}
          {showControls && (
            <div className='absolute flex bottom-8 z-10 m-auto left-0 right-0 gap-2 items-center justify-center text-center p-2'>
              <Button
                onClick={onSearchHandle}
                className={cn('px-10 cursor-pointer')}
              >
                Search
                <Search size={20} className='ml-2' />
              </Button>
              <Button
                onClick={onCancelHandle}
                className={cn(
                  'border-primary text-primary px-10 cursor-pointer'
                )}
                variant={'outline'}
              >
                Cancel
                <X size={20} className='ml-2' />
              </Button>
            </div>
          )}

          {selectedLocation && (
            <div className='absolute bottom-20 z-10 m-auto left-0 right-0 max-w-lg bg-white shadow rounded-lg max-h-[500px] overflow-hidden overflow-y-auto'>
              <X
                size={24}
                className='shadow cursor-pointer sticky float-end mr-2 top-2 w-8 h-8 bg-white text-primary rounded-full'
                onClick={() => setSelectedLocation(null)}
              />
              {data
                .filter(
                  item =>
                    Number(item.latitude) === selectedLocation?.latitude &&
                    Number(item.longitude) === selectedLocation?.longitude
                )
                .map((item, index) => (
                  <div
                    key={`previewCard${index}`}
                    className='p-4 cursor-pointer mb-1'
                    onClick={() => router.push(`listings/${item.id}`)}
                  >
                    <Image
                      src={item.images[0].src}
                      alt={`Preview image`}
                      className='w-full h-56 object-cover rounded-lg z-10'
                      width={100}
                      height={100}
                    />
                    <p className='font-bold text-primary text-xl my-2'>
                      {item.price}
                    </p>
                    <p>{item.title}</p>
                  </div>
                ))}
            </div>
          )}

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            onZoomChanged={handleZoomChange}
            onLoad={onMapLoad}
            options={{
              fullscreenControl: false,
              streetViewControl: false,
              zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER,
              },
            }}
          >
            <DrawingManager
              drawingMode={
                enableDraw ? google.maps.drawing.OverlayType.POLYGON : null
              }
              options={{
                drawingControl: false,
                polygonOptions: {
                  fillColor: '#6B21A8',
                  strokeColor: '#6B21A8',
                  fillOpacity: 0.4,
                  strokeOpacity: 1,
                  strokeWeight: 2,
                  clickable: true,
                  editable: false,
                  zIndex: 1,
                },
              }}
              onPolygonComplete={polygon => {
                setPoligon(polygon);
                onPolygonComplete();
              }}
            />
            <MarkerClustererComponent
              setSelectedLocation={setSelectedLocation}
              data={data}
            />
            <Polygon path={polygon_path} options={polygonOptions} />
          </GoogleMap>
        </div>
      ) : (
        <p className='text-neutral-800'>Loading...</p>
      )}
    </div>
  );
};

export default observer(PropertyMap);
