import { PropertyDetail } from '@/lib/queries/server/propety/type';
import pointInPolygon from 'point-in-polygon';
import { formatPrice } from './formatPriceUtils';

export interface LatLng {
  latitude: number;
  longitude: number;
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

export const getBoundingBox = (polygon: LatLng[]) => {
  let minLat = polygon[0].latitude;
  let maxLat = polygon[0].latitude;
  let minLng = polygon[0].longitude;
  let maxLng = polygon[0].longitude;

  polygon.forEach(coord => {
    minLat = Math.min(minLat, coord.latitude);
    maxLat = Math.max(maxLat, coord.latitude);
    minLng = Math.min(minLng, coord.longitude);
    maxLng = Math.max(maxLng, coord.longitude);
  });

  return { minLat, maxLat, minLng, maxLng };
};

export function groupPropertiesByLocation(properties: PropertyDetail[]) {
  const groups = new Map<string, PropertyDetail[]>();

  properties.forEach(property => {
    const lat = Number(property.property.latitude);
    const lng = Number(property.property.longitude);
    const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(property);
  });

  return Array.from(groups.values());
}

export function createMarkerConfig(
  property: PropertyDetail,
  groupProperties: boolean = false,
  baseLat: number,
  baseLng: number,
  selectedLocation: LatLng | null
) {
  const formatted = formatPrice(property.property.listingPrice);
  const content = '₱' + formatted;
  const baseWidth = 30;
  const charWidth = 12;
  const width = Math.max(baseWidth, content.length * charWidth);
  const height = 30;

  let offsetLat: number | null = null;
  let offsetLng: number | null = null;

  if (groupProperties) {
    const offset = 0.0025;
    // Use property ID as seed for consistent positioning
    const seed = property.id
      .toString()
      .split('')
      .reduce((a, b) => a + b.charCodeAt(0), 0);
    const randomAngle = (seed % 360) * (Math.PI / 180); // Convert to radians
    const randomDistance = ((seed % 100) / 100) * offset; // Use seed for distance too
    offsetLat = baseLat + randomDistance * Math.cos(randomAngle);
    offsetLng = baseLng + randomDistance * Math.sin(randomAngle);
  }

  const lat = Number(property.property.latitude);
  const lng = Number(property.property.longitude);

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
    lat === selectedLocation.latitude &&
    lng === selectedLocation.longitude;

  return {
    content,
    width,
    height,
    offsetLat,
    offsetLng,
    lat,
    lng,
    primaryMain,
    neutralMain,
    isSelected,
  };
}
