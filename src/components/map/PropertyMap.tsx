'use client';

import { useState, useEffect } from 'react';
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
import { useUrlParams } from '@/hooks/useUrlParams';

interface IMapProps {
  minHeight?: string;
  properties?: PropertyDetail[];
}

export type Location = {
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
    rootStore.propertyListingQuery.zoom || 8
  );
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location>(null);
  const [originalZoom, setOriginalZoom] = useState<number>(
    rootStore.propertyListingQuery.zoom || 8
  );
  // Track clicked markers - store as string keys for easy comparison
  const [clickedMarkers, setClickedMarkers] = useState<Set<string>>(new Set());

  // Auto-fit map to show all properties when they change
  useEffect(() => {
    // Only auto-fit if not currently drawing and we have properties
    if (mapInstance && properties.length > 0 && !enableDraw) {
      const validProperties = properties.filter(
        property => property.property?.latitude && property.property?.longitude
      );

      if (validProperties.length === 0) return;

      // Always center on the first property
      const firstProperty = validProperties[0];
      mapInstance.setCenter({
        lat: firstProperty.property!.latitude,
        lng: firstProperty.property!.longitude,
      });
      mapInstance.setZoom(11.5);
    }
  }, [mapInstance, properties, enableDraw]);

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

  const onPolygonComplete = (drawnPolygon: google.maps.Polygon) => {
    setEnableDraw(false);
    setShowControls(true);
    setShowInstructionNote(false);

    // Zoom to the drawn polygon
    if (mapInstance) {
      const bounds = new google.maps.LatLngBounds();
      const path = drawnPolygon.getPath();
      const points = path.getArray();

      // Extend bounds to include all polygon points
      points.forEach(point => {
        bounds.extend(point);
      });

      // Add some padding around the polygon
      mapInstance.fitBounds(bounds, 50);

      // Limit the zoom level if it's too high
      const currentZoom = mapInstance.getZoom();
      if (currentZoom && currentZoom > 9) {
        mapInstance.setZoom(11.5);
      }
    }
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
      const newZoom = mapInstance.getZoom() || 8;
      setZoom(newZoom);
    }
  };

  const handleMarkerClick = (lat: number, lng: number) => {
    if (mapInstance) {
      // Save current zoom level before zooming in
      setOriginalZoom(mapInstance.getZoom() || 8);
      // Zoom to level 13 (close-up view) and center on the marker
      if (originalZoom < 13) {
        mapInstance.setZoom(13);
        mapInstance.panTo({ lat: lat - 0.025, lng });
      }
    }

    // Add marker to clicked markers set
    const markerKey = `${lat},${lng}`;
    setClickedMarkers(prev => new Set(prev).add(markerKey));
  };

  // const handleCloseCard = () => {
  //   if (mapInstance) {
  //     // Restore original zoom level
  //     mapInstance.setZoom(originalZoom);
  //   }
  //   // Don't clear selectedLocation here to maintain clicked state
  // };

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
                onPolygonComplete(polygon);
              }}
            />
            <MarkerClustererComponent
              data={properties}
              setSelectedLocation={setSelectedLocation}
              selectedLocation={selectedLocation}
              onMarkerClick={handleMarkerClick}
              properties={properties}
              // onCloseCard={handleCloseCard}
              clickedMarkers={clickedMarkers}
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
