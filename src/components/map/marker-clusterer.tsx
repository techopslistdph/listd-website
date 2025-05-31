'use client';

import { useEffect, useRef } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { Marker } from '@react-google-maps/api';
import { Listing } from '@/app/data';

interface MarkerClustererProps {
  data: Listing[];
  setSelectedLocation: (
    location: { latitude: number; longitude: number } | null
  ) => void;
}

const MarkerClustererComponent: React.FC<MarkerClustererProps> = ({
  data,
  setSelectedLocation,
}) => {
  const clustererRef = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }
  }, [data]);

  return (
    <div>
      {data.map((property, index) => (
        <Marker
          key={`marker-${index}`}
          position={{
            lat: Number(property.latitude),
            lng: Number(property.longitude),
          }}
          onClick={() => {
            setSelectedLocation({
              latitude: Number(property.latitude),
              longitude: Number(property.longitude),
            });
          }}
        />
      ))}
    </div>
  );
};

export default MarkerClustererComponent;
