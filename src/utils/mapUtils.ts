interface Coordinate {
  latitude: number;
  longitude: number;
}

interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

export const getBoundingBox = (coordinates: Coordinate[]): BoundingBox => {
  const latitudes = coordinates.map((coord) => coord.latitude);
  const longitudes = coordinates.map((coord) => coord.longitude);

  return {
    north: Math.max(...latitudes),
    south: Math.min(...latitudes),
    east: Math.max(...longitudes),
    west: Math.min(...longitudes),
  };
};

export const getBoundingBoxCenter = (boundingBox: BoundingBox): Coordinate => {
  return {
    latitude: (boundingBox.north + boundingBox.south) / 2,
    longitude: (boundingBox.east + boundingBox.west) / 2,
  };
};

export const convertBoundingBoxToString = (
  boundingBox: BoundingBox
): string => {
  return `${boundingBox.north},${boundingBox.south},${boundingBox.east},${boundingBox.west}`;
};

export const calculateDistances = (
  center: Coordinate,
  coordinates: Coordinate[]
): number[] => {
  return coordinates.map((coord) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(coord.latitude - center.latitude);
    const dLon = toRad(coord.longitude - center.longitude);
    const lat1 = toRad(center.latitude);
    const lat2 = toRad(coord.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  });
};

export const calculateDistanceStatistics = (distances: number[]) => {
  return {
    min: Math.min(...distances),
    max: Math.max(...distances),
    avg: distances.reduce((a, b) => a + b, 0) / distances.length,
  };
};

const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};
