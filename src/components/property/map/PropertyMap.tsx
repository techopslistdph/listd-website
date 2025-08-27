/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Geojson,
  getGeojsonPolygonPath,
  handleMarkerClick,
  onPolygonComplete,
  handleZoomChange,
  triggerSearchWithCoordinates,
  handleDrawToSearchBtn,
  handleCancelHandle,
  savePolygonToStorage,
  clearPolygonFromStorage,
  restorePolygonFromStorage,
} from '@/utils/mapUtils';
import { useStore } from '@/models/RootStore';
import { observer } from 'mobx-react-lite';
import { PropertyDetail } from '@/lib/queries/server/propety/type';
import MarkerClustererComponent from './marker-clusterer';
import { useUrlParams } from '@/hooks/useUrlParams';
import { SearchParams } from 'next/dist/server/request/search-params';

interface IMapProps {
  minHeight?: string;
  properties?: PropertyDetail[];
  geojson?: Geojson[];
}

export type Location = {
  latitude: number;
  longitude: number;
} | null;

// Static libraries array to prevent unnecessary reloads
const GOOGLE_MAPS_LIBRARIES: ('places' | 'drawing' | 'geometry')[] = [
  'places',
  'drawing',
  'geometry',
];

const PropertyMap: React.FC<IMapProps> = ({
  minHeight = '600px',
  properties = [],
  geojson,
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || '',
    id: 'google-map-script',
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const rootStore = useStore();
  const router = useRouter();
  const { deleteParams, getAllParams, createParamsString } = useUrlParams();

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
  const [selectedLocation, setSelectedLocation] = useState<
    (Location & { id: string }) | null
  >(null);
  const [originalZoom, setOriginalZoom] = useState<number>(
    rootStore.propertyListingQuery.zoom || 8
  );
  // Track clicked markers - store as string keys for easy comparison
  const [clickedMarkers, setClickedMarkers] = useState<Set<string>>(new Set());
  // Track if we should auto-fit to properties
  const [shouldAutoFitProperties, setShouldAutoFitProperties] =
    useState<boolean>(true);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  const triggerSearch = (path: { latitude: number; longitude: number }[]) => {
    const allParams = getAllParams();

    const finalParams = triggerSearchWithCoordinates(
      path,
      allParams as SearchParams
    );
    const paramsString = createParamsString(finalParams);
    router.push(`/property?${paramsString}`);
  };

  // Auto-fit to properties only when no polygon is active and we have properties
  useEffect(() => {
    if (
      mapInstance &&
      properties.length > 0 &&
      shouldAutoFitProperties &&
      !polygon &&
      !geojson
    ) {
      const validProperties = properties.filter(
        property => property.property?.latitude && property.property?.longitude
      );

      if (validProperties.length === 0) return;

      // Create bounds to fit all properties
      const bounds = new google.maps.LatLngBounds();
      validProperties.forEach(property => {
        bounds.extend({
          lat: property.property!.latitude,
          lng: property.property!.longitude,
        });
      });

      // Fit bounds with padding
      mapInstance.fitBounds(bounds, 50);

      // Set a reasonable zoom level if bounds are too small
      const currentZoom = mapInstance.getZoom();
      if (currentZoom && currentZoom > 15) {
        mapInstance.setZoom(11.5);
      }
    }
  }, [mapInstance, properties, shouldAutoFitProperties, polygon, geojson]);

  // Load saved polygon on component mount (only if no geojson and there are coordinate search parameters)
  useEffect(() => {
    // Don't restore polygon if we're in the middle of cancelling
    if (isCancelling) {
      return;
    }

    // If geojson exists, clear any existing polygon and local storage
    if (geojson && geojson.length > 0) {
      // Clear any existing polygon from the map
      if (polygon) {
        polygon.setMap(null);
        setPoligon(null);
      }
      // Clear local storage
      clearPolygonFromStorage();
      // Reset UI state
      setShowControls(false);
      setShowDrawButton(true);
      setShouldAutoFitProperties(false);
      return;
    }

    // Check if there are coordinate-based search parameters that indicate a drawn area search
    const allParams = getAllParams();
    const hasCoordinateSearch =
      (allParams.minLatitude && allParams.minLatitude !== '') ||
      (allParams.maxLatitude && allParams.maxLatitude !== '') ||
      (allParams.minLongitude && allParams.minLongitude !== '') ||
      (allParams.maxLongitude && allParams.maxLongitude !== '') ||
      (allParams.latitude && allParams.latitude !== '') ||
      (allParams.longitude && allParams.longitude !== '') ||
      (allParams.radius && allParams.radius !== '');

    console.log(
      'hasCoordinateSearch',
      hasCoordinateSearch,
      'allParams',
      allParams
    );

    // Only restore from localStorage if there's a coordinate-based search
    if (hasCoordinateSearch) {
      console.log('Restoring polygon from localStorage');
      restorePolygonFromStorage(
        mapInstance,
        setPoligon,
        setShowControls,
        setShowDrawButton,
        geojson
      );
    } else {
      console.log('no coordinate search');
      // If no coordinate search, clear any existing polygon and localStorage
      if (polygon) {
        polygon.setMap(null);
        setPoligon(null);
      }
      clearPolygonFromStorage();
      setShowControls(false);
      setShowDrawButton(true);
      setShouldAutoFitProperties(true);
    }
  }, [mapInstance, geojson, getAllParams, isCancelling]); // Add isCancelling to dependencies

  // Function to handle polygon completion with storage
  const handlePolygonComplete = (polygon: google.maps.Polygon) => {
    setPoligon(polygon);
    savePolygonToStorage(polygon); // Save to localStorage
    setShouldAutoFitProperties(false); // Disable auto-fitting when polygon is drawn

    onPolygonComplete(
      polygon,
      setEnableDraw,
      setShowControls,
      setShowInstructionNote,
      mapInstance as google.maps.Map,
      setShouldAutoFitProperties
    );

    // Ensure draw button is hidden when polygon is completed
    setShowDrawButton(false);
  };

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

  const onSearchHandle = () => {
    if (!polygon) return;
    const path = polygon
      .getPath()
      .getArray()
      .map(coord => ({
        latitude: coord.lat(),
        longitude: coord.lng(),
      }));

    triggerSearch(path);
  };

  // Update the onCancelHandle function
  const onCancelHandle = () => {
    setIsCancelling(true);

    // First handle the cancel operation (this clears localStorage and polygon)
    handleCancelHandle(
      rootStore,
      setEnableDraw,
      setShowControls,
      setShowDrawButton,
      setShouldAutoFitProperties,
      clearPolygonFromStorage,
      setPoligon,
      polygon,
      mapInstance,
      properties
    );

    // Then remove bounding box params from URL
    const paramsString = deleteParams([
      'minLatitude',
      'maxLatitude',
      'minLongitude',
      'maxLongitude',
    ]);
    router.push(`/property?${paramsString}`);

    // Reset the cancelling flag after a short delay
    setTimeout(() => {
      setIsCancelling(false);
    }, 100);
  };

  const onMapLoad = (map: google.maps.Map) => {
    setMapInstance(map);
  };

  // Determine polygon path to display
  let polygon_path: { lat: number; lng: number }[] = [];

  if (
    rootStore.propertyListingQuery.polygon_path &&
    rootStore.propertyListingQuery.polygon_path.length > 0
  ) {
    // Use stored polygon path (from drawing or GeoJSON)
    polygon_path = rootStore.propertyListingQuery.polygon_path.map(coord => ({
      lat: coord.latitude,
      lng: coord.longitude,
    }));
  }

  // When geojson changes, create the polygon once and zoom to fit
  useEffect(() => {
    if (!geojson || !mapInstance) return;

    // Clear any existing polygon first
    if (polygon) {
      polygon.setMap(null);
      setPoligon(null);
    }

    const geojsonPath = getGeojsonPolygonPath(geojson);
    if (!geojsonPath) return;

    const polygonInstance = new google.maps.Polygon({
      paths: geojsonPath,
      fillColor: '#6B21A8',
      strokeColor: '#6B21A8',
      fillOpacity: 0.4,
      strokeOpacity: 1,
      strokeWeight: 2,
      clickable: true,
      editable: false,
      zIndex: 1,
    });

    polygonInstance.setMap(mapInstance);
    setPoligon(polygonInstance);
    setShouldAutoFitProperties(false); // Disable auto-fitting when geojson is loaded

    // Zoom to fit the geojson polygon
    const bounds = new google.maps.LatLngBounds();
    geojsonPath.forEach(point => {
      bounds.extend(point);
    });

    // Add padding and fit bounds
    mapInstance.fitBounds(bounds, 50);

    // Set a reasonable zoom level if bounds are too small
    const currentZoom = mapInstance.getZoom();
    if (currentZoom && currentZoom > 15) {
      mapInstance.setZoom(11.5);
    }

    // cleanup old polygon if geojson changes
    return () => {
      polygonInstance.setMap(null);
    };
  }, [geojson, mapInstance]); // Remove polygon from dependencies

  return (
    <div className='h-92'>
      {isLoaded ? (
        <div className='relative'>
          {showInstructionNote && (
            <div className='absolute shadow top-3 z-10 m-auto  right-3 bg-white text-center p-2 w-56'>
              Click on the map to define your area of interest.
            </div>
          )}

          {/* No properties message */}
          {properties.length === 0 && (
            <div className='absolute top-5 left-5 right-5 transform   z-10 bg-white rounded-lg shadow-lg p-6 text-center max-w-sm'>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                No Properties Found
              </h3>
              <p className='text-gray-600 text-sm'>
                Oops! We couldn&apos;t find any properties matching your search
                in this area.
              </p>
              <p className='text-gray-500 text-xs mt-2'>
                Try adjusting your search criteria or drawing a larger area.
              </p>
            </div>
          )}

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

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            onZoomChanged={() =>
              handleZoomChange(mapInstance as google.maps.Map, setZoom)
            }
            onLoad={onMapLoad}
            options={{
              mapTypeControl: false,
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
              onPolygonComplete={handlePolygonComplete} // Use the new handler
            />
            <MarkerClustererComponent
              data={properties}
              setSelectedLocation={setSelectedLocation}
              selectedLocation={selectedLocation}
              onMarkerClick={(lat: number, lng: number) =>
                handleMarkerClick(
                  lat,
                  lng,
                  mapInstance as google.maps.Map,
                  setOriginalZoom,
                  setClickedMarkers
                )
              }
              properties={properties}
              clickedMarkers={clickedMarkers}
              polygon={polygon}
            />
            {polygon_path.length > 0 && (
              <Polygon path={polygon_path} options={polygonOptions} />
            )}
          </GoogleMap>
        </div>
      ) : (
        <p className='text-neutral-800'>Loading...</p>
      )}
    </div>
  );
};

export default observer(PropertyMap);
