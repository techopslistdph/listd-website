import pointInPolygon from 'point-in-polygon';

export interface LatLng {
  latitude: number;
  longitude: number;
}

interface BoundingBox {
  centerX: number;
  centerY: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export const euclideanDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

export const calculateDistanceStatistics = (
  coordinates: number[]
): { total: number; average: number; max: number; midpoint: number } => {
  if (coordinates.length === 0) {
    return { total: 0, average: 0, max: 0, midpoint: 0 };
  }

  const total = coordinates.reduce((sum, distance) => sum + distance, 0);
  const average = total / coordinates.length;
  const max = Math.max(...coordinates);
  const midpoint = (average + max) / 2;

  const roundToTwoDecimals = (num: number) => Math.round(num * 100) / 100;

  return {
    total: roundToTwoDecimals(total),
    average: roundToTwoDecimals(average),
    max: roundToTwoDecimals(max),
    midpoint: roundToTwoDecimals(midpoint),
  };
};

export const calculateDistances = (
  center: LatLng,
  coordinates: LatLng[],
  adjustmentMeters = 100 // Default adjustment in meters
): number[] => {
  const adjustmentKilometers = adjustmentMeters / 1000; // Convert meters to kilometers
  const polylineCoords = coordinates.map(coord => [
    coord.longitude,
    coord.latitude,
  ]);

  return coordinates
    .filter(point =>
      pointInPolygon([point.longitude, point.latitude], polylineCoords)
    ) // Filter points inside the polyline
    .map(point => {
      const distance = haversineDistance(center, point);
      return distance - adjustmentKilometers;
    });
};

export const haversineDistance = (point1: LatLng, point2: LatLng): number => {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLng = toRadians(point2.longitude - point1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) *
      Math.cos(toRadians(point2.latitude)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

export const generatePointsInsidePolygon = (polygon: LatLng[]): LatLng[] => {
  const bounds = getBoundingBox(polygon);
  const points: LatLng[] = [];
  const stepSize = 0.01; // Adjust based on required precision
  const polygonCoords = polygon.map(coord => [coord.longitude, coord.latitude]);
  for (let lat = bounds.minLat; lat <= bounds.maxLat; lat += stepSize) {
    for (let lng = bounds.minLng; lng <= bounds.maxLng; lng += stepSize) {
      if (pointInPolygon([lng, lat], polygonCoords)) {
        points.push({ latitude: lat, longitude: lng });
      }
    }
  }
  return points;
};

export const getBoundingBox = (polygon: LatLng[]) => {
  let minLat = polygon[0].latitude;
  let maxLat = polygon[0].latitude;
  let minLng = polygon[0].longitude;
  let maxLng = polygon[0].longitude;
  polygon.forEach(coord => {
    if (coord.latitude < minLat) minLat = coord.latitude;
    if (coord.latitude > maxLat) maxLat = coord.latitude;
    if (coord.longitude < minLng) minLng = coord.longitude;
    if (coord.longitude > maxLng) maxLng = coord.longitude;
  });
  return { minLat, maxLat, minLng, maxLng };
};

export const getBoundingBoxCenter = (bounds: {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}): LatLng => {
  const centerLat = (bounds.minLat + bounds.maxLat) / 2;
  const centerLng = (bounds.minLng + bounds.maxLng) / 2;
  return { latitude: centerLat, longitude: centerLng };
};

export const getPolylineCenter = (polyline: LatLng[]): LatLng => {
  const totalPoints = polyline.length;
  const sumLat = polyline.reduce((sum, point) => sum + point.latitude, 0);
  const sumLng = polyline.reduce((sum, point) => sum + point.longitude, 0);
  return {
    latitude: sumLat / totalPoints,
    longitude: sumLng / totalPoints,
  };
};

export const calculateAverageBoundingBoxRadius = (
  boundingBox: BoundingBox
): number => {
  const { centerX, centerY, minX, minY, maxX, maxY } = boundingBox;

  // Conversion factor from degrees to kilometers
  const degreesToKilometers = 111.32;

  // Calculate the distances from the center point to each corner of the bounding box in degrees
  const distance1 = Math.sqrt((centerX - minX) ** 2 + (centerY - minY) ** 2);
  const distance2 = Math.sqrt((centerX - maxX) ** 2 + (centerY - minY) ** 2);
  const distance3 = Math.sqrt((centerX - minX) ** 2 + (centerY - maxY) ** 2);
  const distance4 = Math.sqrt((centerX - maxX) ** 2 + (centerY - maxY) ** 2);

  // Convert distances to kilometers
  const distance1Kilometers = distance1 * degreesToKilometers;
  const distance2Kilometers = distance2 * degreesToKilometers;
  const distance3Kilometers = distance3 * degreesToKilometers;
  const distance4Kilometers = distance4 * degreesToKilometers;

  // Calculate the average distance in kilometers
  const averageDistance =
    (distance1Kilometers +
      distance2Kilometers +
      distance3Kilometers +
      distance4Kilometers) /
    4;

  // Return the average distance rounded to two decimal points
  return Number.parseFloat(averageDistance.toFixed(2));
};

export const convertBoundingBoxToString = (
  boundingBox: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  } | null
): string => {
  if (!boundingBox) return '';
  const { minLat, maxLat, minLng, maxLng } = boundingBox;
  return `${minLat}::${maxLat}::${minLng}::${maxLng}`;
};
