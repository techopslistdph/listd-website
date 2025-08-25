'use client';

import { useEffect, useRef } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { Marker } from '@react-google-maps/api';
import { PropertyDetail } from '@/lib/queries/server/propety/type';
import { formatPrice } from '@/utils/formatPriceUtils';
import { Location } from './PropertyMap';
import Image from 'next/image';
import { PropertyImages } from '../property/PropertyImages';
import pinIcon from '../../../public/images/icons/pin.svg';
import Link from 'next/link';
import PropertyDetailsDisplay from '../property/PropertyDetailsDisplay';

interface MarkerClustererProps {
  data: PropertyDetail[];
  setSelectedLocation: (location: Location | null) => void;
  selectedLocation: Location | null;
  onMarkerClick?: (lat: number, lng: number) => void;
  properties: PropertyDetail[];
  onCloseCard?: () => void;
  clickedMarkers: Set<string>;
  polygon?: google.maps.Polygon | null; // 👈 add this
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
}) => {
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // 🔹 Filter properties by polygon
  const filteredData = polygon
    ? filterPropertiesInPolygon(data, polygon)
    : data;

  useEffect(() => {
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }
  }, [data]);

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
      console.log('selectedLocation', selectedLocation);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedLocation, setSelectedLocation, onCloseCard]);
  console.log(
    'Markers:',
    data.map(p => ({
      id: p.id,
      lat: Number(p.property.latitude),
      lng: Number(p.property.longitude),
      valid:
        !isNaN(Number(p.property.latitude)) &&
        !isNaN(Number(p.property.longitude)),
    }))
  );
  return (
    <>
      {filteredData.map((property, index) => {
        const formatted = formatPrice(property.property.listingPrice);
        const content = '₱' + formatted;
        const baseWidth = 30;
        const charWidth = 12;
        const width = Math.max(baseWidth, content.length * charWidth);
        const height = 30;

        // Get colors based on selection state
        const primaryMain =
          getComputedStyle(document.documentElement)
            .getPropertyValue('--primary-main')
            .trim() || '#350f9d';
        const neutralMain =
          getComputedStyle(document.documentElement)
            .getPropertyValue('--icon-map')
            .trim() || '#6B21A8';

        const lat = Number(property.property.latitude);
        const lng = Number(property.property.longitude);
        const markerKey = `${lat},${lng}`;

        const isSelected =
          selectedLocation &&
          lat === selectedLocation.latitude &&
          lng === selectedLocation.longitude;
        const isClicked = clickedMarkers.has(markerKey);

        // Use clicked color if marker has been clicked, selected color if currently selected, default otherwise
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
            key={`marker-${index}`}
            onClick={() => {
              const lat = Number(property.property.latitude);
              const lng = Number(property.property.longitude);

              setSelectedLocation({
                latitude: lat,
                longitude: lng,
              });

              // Call zoom function if provided
              if (onMarkerClick) {
                onMarkerClick(lat, lng);
              }
            }}
            position={{
              lat: Number(property.property.latitude),
              lng: Number(property.property.longitude),
            }}
            icon={svgMarker}
          />
        );
      })}

      {/* Preview Card - Absolute positioned in upper right corner */}
      {selectedLocation && (
        <div
          className='absolute top-5 right-5 z-20 max-w-sm h-[90%]'
          ref={cardRef}
        >
          {/* Card */}
          <div
            className='bg-white shadow-lg w-64 md:w-86 md:h-full overflow-hidden overflow-y-auto border border-gray-200 relative'
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
                item =>
                  Number(item.property.latitude) ===
                    selectedLocation.latitude &&
                  Number(item.property.longitude) === selectedLocation.longitude
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
                    <p className='font-bold text-primary text-lg mt-2 '>
                      ₱{formatPrice(selectedProperty.property.listingPrice)}
                    </p>
                    <p className='text-sm text-gray-600 line-clamp-2 mb-1'>
                      {selectedProperty.property.listingTitle}
                    </p>
                    <div className='flex items-center text-gray-400 mb-2 gap-1 text-sm '>
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
