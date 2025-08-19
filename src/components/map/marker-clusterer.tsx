'use client';

import { useEffect, useRef } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { Marker, OverlayView } from '@react-google-maps/api';
import { PropertyDetail } from '@/lib/queries/server/propety/type';
import { formatPrice } from '@/utils/formatPriceUtils';
import { Location } from './PropertyMap';
import Image from 'next/image';
import { X } from 'lucide-react';
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
}

const MarkerClustererComponent: React.FC<MarkerClustererProps> = ({
  data,
  setSelectedLocation,
  selectedLocation,
  onMarkerClick,
  properties,
  onCloseCard,
}) => {
  const clustererRef = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }
  }, [data]);

  return (
    <div>
      {data.map((property, index) => {
        const formatted = formatPrice(property.property.listingPrice);
        const content = '₱' + formatted;
        const baseWidth = 40;
        const charWidth = 14;
        const width = Math.max(baseWidth, content.length * charWidth);
        const height = 40;

        // Get colors based on selection state
        const primaryMain =
          getComputedStyle(document.documentElement)
            .getPropertyValue('--primary-main')
            .trim() || '#350f9d';
        const neutralMain =
          getComputedStyle(document.documentElement)
            .getPropertyValue('--icon-map')
            .trim() || '#6B21A8';
        const isSelected =
          selectedLocation &&
          Number(property.property.latitude) === selectedLocation.latitude &&
          Number(property.property.longitude) === selectedLocation.longitude;
        const fillColor = isSelected ? neutralMain : primaryMain; // Orange when selected, primary color when not
        const encodedColor = `%23${fillColor.replace('#', '')}`;

        const svgMarker = {
          url: `data:image/svg+xml;utf-8,
            <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
              <rect x="0" y="0" width="${width}" height="${height}" rx="10" fill="${encodedColor}"/>
              <text x="${width / 2}" y="${height / 2 + 6}" font-size="16" text-anchor="middle" fill="white" font-family="Arial" font-weight="bold">${content}</text>
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

      {/* Preview Card Overlay */}
      {selectedLocation && (
        <OverlayView
          position={{
            lat: selectedLocation.latitude - 0.0015,
            lng: selectedLocation.longitude - 0.0285,
          }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div className='relative'>
            {/* Card */}
            <div
              className='bg-white shadow-lg rounded-xl w-86 max-h-[300px] overflow-hidden overflow-y-auto border border-gray-200 relative'
              onWheel={e => {
                e.stopPropagation();
              }}
              onTouchMove={e => {
                e.stopPropagation();
              }}
            >
              {/* Close button */}
              <div className='absolute top-2 right-2 z-10'>
                <button
                  onClick={() => {
                    setSelectedLocation(null);
                    if (onCloseCard) {
                      onCloseCard();
                    }
                  }}
                  className='w-7 h-7 bg-icon-map text-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100'
                >
                  <X size={15} />
                </button>
              </div>

              {/* Property content */}
              {(() => {
                const selectedProperty = properties.find(
                  item =>
                    Number(item.property.latitude) ===
                      selectedLocation.latitude &&
                    Number(item.property.longitude) ===
                      selectedLocation.longitude
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
                      <div className='flex items-center text-gray-400 mb-2 gap-1 text-sm mb-6'>
                        <Image src={pinIcon} alt='pin' />
                        <span className='truncate'>
                          {selectedProperty.property.address
                            ? `${selectedProperty.property.address}`
                            : `${selectedProperty.property.barangayName}, ${selectedProperty.property.cityName}`}
                        </span>
                      </div>
                      <PropertyDetailsDisplay
                        propertyDetail={selectedProperty}
                        className='grid-cols-3 gap-2 grid'
                      />
                    </Link>
                  </div>
                );
              })()}
            </div>
          </div>
        </OverlayView>
      )}
    </div>
  );
};

export default MarkerClustererComponent;
