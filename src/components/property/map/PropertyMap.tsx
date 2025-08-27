/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  DrawingManager,
} from '@react-google-maps/api';
import {
  Geojson,
  handleMarkerClick,
  onPolygonComplete,
  handleZoomChange,
  handlePolygonRestoration,
  createGeojsonPolygon,
} from '@/utils/mapUtils';
import { useStore } from '@/models/RootStore';
import { observer } from 'mobx-react-lite';
import { PropertyDetail } from '@/lib/queries/server/propety/type';
import MarkerClustererComponent from './marker-clusterer';

import LoadingSpinner from '@/components/ui/loading-spinner';
import Controls from './Controls';
import EmptyMessage from './EmptyMessage';

interface IMapProps {
  properties?: PropertyDetail[];
  geojson?: Geojson[];
}

export type Location = {
  latitude: number;
  longitude: number;
} | null;

const GOOGLE_MAPS_LIBRARIES: ('places' | 'drawing' | 'geometry')[] = [
  'places',
  'drawing',
  'geometry',
];

const PropertyMap: React.FC<IMapProps> = ({ properties = [], geojson }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || '',
    id: 'google-map-script',
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const rootStore = useStore();
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

  const [clickedMarkers, setClickedMarkers] = useState<Set<string>>(new Set());
  const [shouldAutoFitProperties, setShouldAutoFitProperties] =
    useState<boolean>(true);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (properties.length > 0 || geojson) {
      setIsLoading(false);
    }
  }, [properties, geojson]);

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
    handlePolygonRestoration(
      isCancelling,
      geojson,
      polygon,
      mapInstance,
      setPoligon,
      setShowControls,
      setShowDrawButton,
      setShouldAutoFitProperties
    );
  }, [mapInstance]); // Add polygon to dependencies

  const handlePolygonComplete = (polygon: google.maps.Polygon) => {
    onPolygonComplete(
      setPoligon,
      polygon,
      setEnableDraw,
      setShowControls,
      setShowInstructionNote,
      mapInstance as google.maps.Map,
      setShouldAutoFitProperties,
      setShowDrawButton
    );
  };

  const containerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '90vh',
    borderRadius: '30px',
  };

  const onMapLoad = (map: google.maps.Map) => {
    if (isCancelling) {
      return;
    }
    setMapInstance(map);
  };

  // When geojson changes, create the polygon once and zoom to fit
  useEffect(() => {
    // Only create geojson polygon if there's no user-drawn polygon
    if (!polygon || polygon.getMap() === null) {
      const polygonInstance = createGeojsonPolygon(
        geojson || [],
        mapInstance as google.maps.Map,
        polygon,
        setPoligon,
        setShouldAutoFitProperties
      );

      return () => {
        if (polygonInstance) {
          polygonInstance.setMap(null);
        }
      };
    }
  }, [geojson, mapInstance]); // Remove polygon from dependencies to prevent conflicts

  return (
    <div>
      {isLoaded ? (
        <div className='relative'>
          {/* Show loading overlay when isLoading is true */}
          {isLoading && (
            <div className='absolute inset-0 bg-white/65 z-50 flex items-center justify-center'>
              <div className='flex flex-col items-center gap-2'>
                <LoadingSpinner size='lg' />
              </div>
            </div>
          )}

          {showInstructionNote && (
            <div className='absolute shadow top-3 z-10 m-auto  right-3 bg-white text-center p-2 w-56'>
              Click on the map to define your area of interest.
            </div>
          )}

          {properties.length === 0 && <EmptyMessage />}

          <Controls
            showDrawButton={showDrawButton}
            setEnableDraw={setEnableDraw}
            setShowInstructionNote={setShowInstructionNote}
            setShowDrawButton={setShowDrawButton}
            setPoligon={setPoligon}
            setShouldAutoFitProperties={setShouldAutoFitProperties}
            setShowControls={setShowControls}
            polygon={polygon}
            geojson={geojson || []}
            showControls={showControls}
            setIsLoading={setIsLoading}
            setIsCancelling={setIsCancelling}
            rootStore={rootStore}
          />

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
              onPolygonComplete={handlePolygonComplete}
            />
            <MarkerClustererComponent
              data={properties}
              setSelectedLocation={setSelectedLocation}
              selectedLocation={selectedLocation}
              onMarkerClick={(propertyId: string, lat: number, lng: number) =>
                handleMarkerClick(
                  propertyId,
                  lat,
                  lng,
                  mapInstance as google.maps.Map,
                  setClickedMarkers
                )
              }
              properties={properties}
              clickedMarkers={clickedMarkers}
              polygon={polygon}
            />
          </GoogleMap>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default observer(PropertyMap);
