'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Pencil, Search, X } from 'lucide-react';
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
  calculateDistanceStatistics,
  calculateDistances,
} from '@/utils/mapUtils';
import { useStore } from '@/models/RootStore';
import { observer } from 'mobx-react-lite';
import { PropertyDetail } from '@/lib/queries/server/propety/type';
import MarkerClustererComponent from './marker-clusterer';
import Image from 'next/image';
import { useUrlParams } from '@/hooks/useUrlParams';

interface IMapProps {
  minHeight?: string;
  properties?: PropertyDetail[];
}

type Location = {
  latitude: number;
  longitude: number;
} | null;

const PropertyMap: React.FC<IMapProps> = ({
  minHeight = '600px',
  properties = [],
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || '',
    id: 'google-map-script',
    libraries: ['places', 'drawing', 'geometry'],
  });

  const rootStore = useStore();
  const router = useRouter();
  const { updateParams, deleteParams } = useUrlParams();

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
    fillColor: 'primary-mid',
    strokeColor: 'primary-main',
    fillOpacity: 0.3,
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
    const path = polygon
      .getPath()
      .getArray()
      .map(coord => ({
        latitude: coord.lat(),
        longitude: coord.lng(),
      }));

    const boundingBox = getBoundingBox(path);
    const minLatitude = boundingBox.minLat;
    const maxLatitude = boundingBox.maxLat;
    const minLongitude = boundingBox.minLng;
    const maxLongitude = boundingBox.maxLng;

    const search_latitude = getBoundingBoxCenter(getBoundingBox(path)).latitude;
    const search_longitude = getBoundingBoxCenter(
      getBoundingBox(path)
    ).longitude;

    const polygon_center = getBoundingBoxCenter(getBoundingBox(path));

    const distancesFromPolylineToPolyCenter = calculateDistances(
      polygon_center,
      path
    );
    const distanceStatistics = calculateDistanceStatistics(
      distancesFromPolylineToPolyCenter
    );

    // Update URL params for all coordinates and radius
    const paramsString = updateParams({
      minLatitude,
      maxLatitude,
      minLongitude,
      maxLongitude,
      latitude: search_latitude,
      longitude: search_longitude,
      radius: distanceStatistics.max * 1000, // Convert km to meters for API
    });
    router.push(`/property?${paramsString}`);
  };

  const onCancelHandle = () => {
    rootStore.propertyListingQuery.resetCoordinates();
    setEnableDraw(false);
    setShowControls(false);
    setShowDrawButton(true);
    polygon?.setMap(null);

    // Remove bounding box params from URL
    const paramsString = deleteParams([
      'minLatitude',
      'maxLatitude',
      'minLongitude',
      'maxLongitude',
      'latitude',
      'longitude',
      'radius',
    ]);
    router.push(`/property?${paramsString}`);
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
            <div className='absolute shadow top-3 z-10 m-auto  right-3 bg-white text-center p-2 w-56'>
              Click on the map to define your area of interest.
            </div>
          )}
          {showDrawButton && (
            <Button
              className={cn(
                'absolute bottom-10 z-10 m-auto left-0 right-0 w-40 bg-primary-main text-white hover:bg-secondary-main cursor-pointer'
              )}
              onClick={handleDrawToSearchBtn}
            >
              <Pencil />
              Start Drawing
            </Button>
          )}
          {showControls && (
            <div className='absolute flex bottom-8 z-10 m-auto left-0 right-0 gap-2 items-center justify-center text-center p-2'>
              <Button
                onClick={onSearchHandle}
                className={cn('px-10 cursor-pointer bg-primary-main text-white hover:bg-secondary-main')}
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

          {selectedLocation && (
            <div className='absolute bottom-20 z-10 m-auto left-0 right-0 bg-white shadow rounded-lg max-h-[500px] overflow-hidden overflow-y-auto'>
              <X
                size={24}
                className='shadow cursor-pointer sticky float-end mr-2 top-2 w-8 h-8 bg-white text-primary rounded-full'
                onClick={() => setSelectedLocation(null)}
              />
              {properties
                .filter(
                  item =>
                    Number(item.property.latitude) ===
                      selectedLocation?.latitude &&
                    Number(item.property.longitude) ===
                      selectedLocation?.longitude
                )
                .map((item, index) => (
                  <div
                    key={`previewCard${index}`}
                    className='p-4 cursor-pointer mb-1'
                    onClick={() => router.push(`listings/${item.id}`)}
                  >
                    <Image
                      src={item.property.images[0].imageUrl}
                      alt={`Preview image`}
                      className='w-full h-56 object-cover rounded-lg z-10'
                      width={100}
                      height={100}
                    />
                    <p className='font-bold text-primary text-xl my-2'>
                      {item.property.listingPriceFormatted}
                    </p>
                    <p>{item.property.listingTitle}</p>
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
              data={properties}
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
