'use client';

import { useEffect, useRef, useMemo } from 'react';
import { Marker } from '@react-google-maps/api';
import { PropertyDetail } from '@/lib/queries/server/propety/type';
import { formatPrice } from '@/utils/formatPriceUtils';
import { Location } from './PropertyMap';
import Image from 'next/image';
import pinIcon from '@/../public/images/icons/pin.svg';
import Link from 'next/link';
import PropertyDetailsDisplay from '../PropertyDetailsDisplay';
import {
  createMarkerConfig,
  groupPropertiesByLocation,
} from '@/utils/mapUtils';
import { PropertyImages } from '../PropertyImages';

interface MarkerClustererProps {
  data: PropertyDetail[];
  setSelectedLocation: (location: (Location & { id: string }) | null) => void;
  selectedLocation: (Location & { id: string }) | null;
  onMarkerClick?: (propertyId: string, lat: number, lng: number) => void; // Updated signature
  properties: PropertyDetail[];
  onCloseCard?: () => void;
  clickedMarkers: Set<string>;
  polygon?: google.maps.Polygon | null;
  enableDraw?: boolean; // Add this prop
  hasDrawnPolygon?: boolean; // Add this prop
  isLoading?: boolean; // Keep only this loading state
}

function filterPropertiesInPolygon(
  properties: PropertyDetail[],
  polygon: google.maps.Polygon
) {
  return properties.filter(property => {
    if (!property.property.latitude || !property.property.longitude)
      return false;
    const point = new google.maps.LatLng(
      Number(property.property.latitude),
      Number(property.property.longitude)
    );
    return google.maps.geometry.poly.containsLocation(point, polygon);
  });
}

const MarkerClustererComponent: React.FC<MarkerClustererProps> = ({
  data,
  setSelectedLocation,
  selectedLocation,
  onMarkerClick,
  properties,
  onCloseCard,
  clickedMarkers,
  polygon,
  enableDraw = false, // Add this prop with default value
  hasDrawnPolygon = false, // Add this prop with default value
  isLoading = false, // Keep only this loading state
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // 🔹 Filter properties by polygon
  const filteredData = polygon
    ? filterPropertiesInPolygon(data, polygon)
    : data;

  // Group properties by location and add offsets
  const groupedProperties = useMemo(() => {
    return groupPropertiesByLocation(filteredData);
  }, [filteredData]);

  // Handle click outside to close card
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setSelectedLocation(null);
        if (onCloseCard) {
          onCloseCard();
        }
      }
    };

    if (selectedLocation) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedLocation, setSelectedLocation, onCloseCard]);

  // Don't render markers if drawing is enabled, polygon is drawn but not searched, or loading
  if (enableDraw || hasDrawnPolygon || isLoading) {
    return null;
  }

  return (
    <>
      {groupedProperties.map(propertyGroup => {
        const baseProperty = propertyGroup[0];
        const baseLat = Number(baseProperty.property.latitude);
        const baseLng = Number(baseProperty.property.longitude);

        // If only one property at this location, render normally
        if (propertyGroup.length === 1) {
          const property = baseProperty;
          const {
            content,
            width,
            height,
            primaryMain,
            neutralMain,
            isSelected,
          } = createMarkerConfig(
            property,
            true,
            baseLat,
            baseLng,
            selectedLocation
          );
          const markerKey = `${property.id}`;

          const isClicked = clickedMarkers.has(markerKey);

          const fillColor = isSelected
            ? neutralMain
            : isClicked
              ? neutralMain
              : primaryMain;
          const encodedColor = `%23${fillColor.replace('#', '')}`;

          const svgMarker = {
            url: `data:image/svg+xml;utf-8,
              <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
                <rect x="0" y="0" width="${width}" height="${height}" rx="10" fill="${encodedColor}"/>
                <text x="${width / 2}" y="${height / 2 + 6}" font-size="14" text-anchor="middle" fill="white" font-family="Arial" font-weight="bold">${content}</text>
              </svg>`,
            scaledSize: new window.google.maps.Size(width, height),
          };

          return (
            <Marker
              key={`marker-${property.id}`}
              onClick={() => {
                const lat = Number(property.property.latitude);
                const lng = Number(property.property.longitude);

                setSelectedLocation({
                  latitude: lat,
                  longitude: lng,
                  id: property.id,
                });

                if (onMarkerClick) {
                  onMarkerClick(property.id, lat, lng); // Pass property ID first
                }
              }}
              position={{
                lat: Number(property.property.latitude),
                lng: Number(property.property.longitude),
              }}
              icon={svgMarker}
            />
          );
        }

        // If multiple properties at the same location, create offset markers
        return propertyGroup.map((property, index) => {
          const {
            content,
            width,
            height,
            offsetLat,
            offsetLng,
            primaryMain,
            neutralMain,
            isSelected,
          } = createMarkerConfig(
            property,
            true,
            baseLat,
            baseLng,
            selectedLocation
          );
          const markerKey = `${property.id}`;

          const isClicked = clickedMarkers.has(markerKey);

          const fillColor = isSelected
            ? neutralMain
            : isClicked
              ? neutralMain
              : primaryMain;
          const encodedColor = `%23${fillColor.replace('#', '')}`;

          const svgMarker = {
            url: `data:image/svg+xml;utf-8,
              <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
                <rect x="0" y="0" width="${width}" height="${height}" rx="10" fill="${encodedColor}"/>
                <text x="${width / 2}" y="${height / 2 + 6}" font-size="14" text-anchor="middle" fill="white" font-family="Arial" font-weight="bold">${content}</text>
              </svg>`,
            scaledSize: new window.google.maps.Size(width, height),
          };

          return (
            <Marker
              key={`marker-${property.id}-${index}`}
              onClick={() => {
                const lat = Number(property.property.latitude);
                const lng = Number(property.property.longitude);

                setSelectedLocation({
                  latitude: lat,
                  longitude: lng,
                  id: property.id,
                });

                if (onMarkerClick) {
                  onMarkerClick(property.id, lat, lng); // Pass property ID first
                }
              }}
              position={{
                lat: Number(offsetLat),
                lng: Number(offsetLng),
              }}
              icon={svgMarker}
            />
          );
        });
      })}

      {/* Preview Card - Absolute positioned in upper right corner */}
      {selectedLocation && (
        <div
          className='absolute top-5 right-5 z-20 max-w-sm h-[70%]'
          ref={cardRef}
        >
          {/* Card */}
          <div
            className='bg-white shadow-lg w-64 md:w-86 md:h-auto overflow-hidden overflow-y-auto border border-gray-200 relative'
            onWheel={e => {
              e.stopPropagation();
            }}
            onTouchMove={e => {
              e.stopPropagation();
            }}
          >
            {/* Property content */}
            {(() => {
              const selectedProperty = properties.find(
                item => item.id === selectedLocation.id
              );

              if (!selectedProperty) return null;

              return (
                <div className='p-4 cursor-pointer hover:bg-gray-50'>
                  <PropertyImages
                    images={selectedProperty.property.images}
                    title={selectedProperty.property.listingTitle}
                    mapMode={true}
                  />

                  <Link
                    href={`/property/${selectedProperty.id}?property=${selectedProperty.property.propertyTypeName.toLowerCase()}`}
                  >
                    <p className='font-bold text-primary text-lg mt-3 mb-1'>
                      ₱{formatPrice(selectedProperty.property.listingPrice)}
                    </p>
                    <p className='text-sm text-gray-600 line-clamp-2 mb-1'>
                      {selectedProperty.property.listingTitle}
                    </p>
                    <div className='flex items-center text-gray-400 mb-5 gap-1 text-sm '>
                      <Image src={pinIcon} alt='pin' />
                      <span className='truncate'>
                        {selectedProperty.property.address
                          ? `${selectedProperty.property.address}`
                          : `${selectedProperty.property.barangayName}, ${selectedProperty.property.cityName}`}
                      </span>
                    </div>
                    <PropertyDetailsDisplay
                      propertyDetail={selectedProperty}
                      className='hidden grid-cols-2 lg:grid-cols-3 gap-2 md:grid'
                    />
                  </Link>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
};

export default MarkerClustererComponent;
