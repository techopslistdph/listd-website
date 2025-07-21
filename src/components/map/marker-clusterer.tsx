'use client';

import { useEffect, useRef } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { Marker } from '@react-google-maps/api';
import { PropertyDetail } from '@/lib/queries/server/propety/type';
import { formatPrice } from '../property/propertySidebar/RangeSlider';

interface MarkerClustererProps {
  data: PropertyDetail[];
}

const MarkerClustererComponent: React.FC<MarkerClustererProps> = ({
  data,
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
        const lastChar = formatted.slice(-1); // Gets the last character
        const content = '₱' + formatted.split('.')[0] + lastChar;
        const baseWidth = 40;
        const charWidth = 14;
        const width = Math.max(baseWidth, content.length * charWidth);
        const height = 40;
        const primaryMain =
          getComputedStyle(document.documentElement)
            .getPropertyValue('--primary-main')
            .trim() || '#350f9d';
        const encodedColor = `%23${primaryMain.replace('#', '')}`;

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
            position={{
              lat: Number(property.property.latitude),
              lng: Number(property.property.longitude),
            }}
            icon={svgMarker}
          />
        );
      })}
    </div>
  );
};

export default MarkerClustererComponent;
