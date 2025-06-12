'use client';

import { useEffect, useRef } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { Marker } from '@react-google-maps/api';
import { PropertyDetail } from '@/lib/queries/server/propety/type';

interface MarkerClustererProps {
  data: PropertyDetail[];
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
            lat: Number(property.property.latitude),
            lng: Number(property.property.longitude),
          }}
          onClick={() => {
            setSelectedLocation({
              latitude: Number(property.property.latitude),
              longitude: Number(property.property.longitude),
            });
          }}
        />
      ))}
    </div>
  );
};

export default MarkerClustererComponent;
