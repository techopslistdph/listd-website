import { PropertyDetail } from '@/lib/queries/server/propety/type';
import pointInPolygon from 'point-in-polygon';
import { formatPrice } from './formatPriceUtils';
import { SearchParams } from 'next/dist/server/request/search-params';
import { RootStoreType } from '@/models/RootStore';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const calculateBoundingBoxFromGeojson = (geojson: any) => {
  if (!geojson?.data?.[0]?.coordinates) {
    return null;
  }

  const coordinates = geojson.data?.[0]?.coordinates;

  // Handle different GeoJSON polygon structures
  let coordArray: number[][];

  // Case 1: Complex nested structure like [[Array(237)], [Array(190)], ...]
  if (Array.isArray(coordinates) && coordinates.length > 0) {
    if (
      Array.isArray(coordinates[0]) &&
      coordinates[0].length === 1 &&
      Array.isArray(coordinates[0][0])
    ) {
      // Handle [[Array(237)], [Array(190)], ...] structure
      coordArray = coordinates.flatMap(coord => coord[0]);
    } else if (
      Array.isArray(coordinates[0]) &&
      Array.isArray(coordinates[0][0])
    ) {
      // Multi-polygon or polygon with holes
      coordArray = coordinates[0];
    } else if (Array.isArray(coordinates[0])) {
      // Simple polygon
      coordArray = coordinates;
    } else {
      return null;
    }
  } else {
    return null;
  }

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  coordArray.forEach(coord => {
    if (Array.isArray(coord) && coord.length >= 2) {
      const [lng, lat] = coord;
      if (typeof lat === 'number' && typeof lng === 'number') {
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
      }
    }
  });

  // Check if we found valid coordinates
  if (
    minLat === Infinity ||
    maxLat === -Infinity ||
    minLng === Infinity ||
    maxLng === -Infinity
  ) {
    return null;
  }

  return {
    minLatitude: minLat,
    maxLatitude: maxLat,
    minLongitude: minLng,
    maxLongitude: maxLng,
  };
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
  selectedLocation: (LatLng & { id?: string }) | null
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
    const offset = 0.0009;
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

  // Fix: Check both coordinates AND property ID for grouped properties
  const isSelected =
    selectedLocation &&
    lat === selectedLocation.latitude &&
    lng === selectedLocation.longitude &&
    (selectedLocation.id ? property.id === selectedLocation.id : true);

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

export interface Geojson {
  type: string;
  coordinates: number[][];
}

// Convert GeoJSON coordinates to polygon path format
export const getGeojsonPolygonPath = (geojson: Geojson[]) => {
  if (!geojson) return null;

  const coordinates = geojson?.[0]?.coordinates;
  if (!coordinates || !Array.isArray(coordinates)) return null;

  // Handle different GeoJSON polygon structures
  let coordArray: number[][];

  // Case 1: Complex nested structure like [[Array(237)], [Array(190)], ...]
  if (
    Array.isArray(coordinates[0]) &&
    coordinates[0].length === 1 &&
    Array.isArray(coordinates[0][0])
  ) {
    // Handle [[Array(237)], [Array(190)], ...] structure
    coordArray = [];
    for (const coord of coordinates) {
      if (Array.isArray(coord) && coord.length > 0 && Array.isArray(coord[0])) {
        coordArray.push(...(coord[0] as number[][]));
      }
    }
  } else if (
    Array.isArray(coordinates[0]) &&
    Array.isArray(coordinates[0][0])
  ) {
    // Multi-polygon or polygon with holes
    coordArray = coordinates[0] as unknown as number[][];
  } else if (Array.isArray(coordinates[0])) {
    // Simple polygon
    coordArray = coordinates as unknown as number[][];
  } else {
    return null;
  }

  return coordArray.map((coord: number[]) => ({
    lat: coord[1],
    lng: coord[0],
  }));
};

export const onPolygonComplete = (
  setPoligon: (polygon: google.maps.Polygon | null) => void,
  drawnPolygon: google.maps.Polygon,
  setEnableDraw: (enable: boolean) => void,
  setShowControls: (show: boolean) => void,
  setShowInstructionNote: (show: boolean) => void,
  mapInstance: google.maps.Map,
  setShouldAutoFitProperties: (shouldAutoFit: boolean) => void,
  setShowDrawButton: (show: boolean) => void
) => {
  setPoligon(drawnPolygon);
  savePolygonToStorage(drawnPolygon); // Save to localStorage
  setShouldAutoFitProperties(false); // Disable auto-fitting when polygon is drawn

  setEnableDraw(false);
  setShowControls(true);
  setShowInstructionNote(false);
  setShowDrawButton(false);

  // Zoom to the drawn polygon with better bounds calculation
  if (mapInstance) {
    const bounds = new google.maps.LatLngBounds();
    const path = drawnPolygon.getPath();
    const points = path.getArray();

    // Extend bounds to include all polygon points
    points.forEach(point => {
      bounds.extend(point);
    });

    // Add padding around the polygon (50 pixels)
    mapInstance.fitBounds(bounds, 50);

    // Set a reasonable zoom level if the polygon is too small
    // const currentZoom = mapInstance.getZoom();
    // if (currentZoom && currentZoom > 15) {
    //   mapInstance.setZoom(11.5);
    // }
    setShouldAutoFitProperties(true);
  }
};

export const handleMarkerClick = (
  propertyId: string,
  lat: number,
  lng: number,
  mapInstance: google.maps.Map,
  setClickedMarkers: (updater: (prev: Set<string>) => Set<string>) => void
) => {
  if (mapInstance) {
    // Save current zoom level before zooming in
    const currentZoom = mapInstance.getZoom() || 8;

    // Only zoom in if we're not already at a close zoom level
    if (currentZoom < 13) {
      mapInstance.setZoom(13);
      mapInstance.panTo({ lat: lat - 0.025, lng });
    }
  }

  // Toggle marker in clicked markers set
  setClickedMarkers((prev: Set<string>) => {
    const newSet = new Set(prev);
    if (newSet.has(propertyId)) {
      newSet.delete(propertyId); // Remove if already clicked
    } else {
      newSet.add(propertyId); // Add if not clicked
    }
    return newSet;
  });
};

export const handleZoomChange = (
  mapInstance: google.maps.Map,
  setZoom: (zoom: number) => void
) => {
  if (mapInstance) {
    const newZoom = mapInstance.getZoom() || 8;
    setZoom(newZoom);
  }
};

export const triggerSearchWithCoordinates = (
  coordinates: { latitude: number; longitude: number }[],
  allParams: SearchParams
) => {
  const boundingBox = getBoundingBox(coordinates);
  const minLatitude = boundingBox.minLat;
  const maxLatitude = boundingBox.maxLat;
  const minLongitude = boundingBox.minLng;
  const maxLongitude = boundingBox.maxLng;

  // Get current parameters and remove city, barangay, province
  const currentParams = allParams;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { city, barangay, province, ...paramsWithoutLocation } = currentParams;

  // Add the new coordinates to the cleaned parameters
  const finalParams = {
    ...paramsWithoutLocation,
    minLatitude,
    maxLatitude,
    minLongitude,
    maxLongitude,
  };

  return finalParams;
};

export const handleDrawToSearchBtn = (
  setEnableDraw: (enable: boolean) => void,
  setShowInstructionNote: (show: boolean) => void,
  setShowDrawButton: (show: boolean) => void,
  setPoligon: (polygon: google.maps.Polygon | null) => void,
  setShouldAutoFitProperties: (shouldAutoFit: boolean) => void,
  setShowControls: (show: boolean) => void,
  polygon: google.maps.Polygon | null,
  clearPolygonFromStorage: () => void
) => {
  if (polygon) {
    polygon.setMap(null);
    setPoligon(null);
  }
  clearPolygonFromStorage();
  setEnableDraw(true);
  setShowInstructionNote(true);
  setShowDrawButton(false);
  setShowControls(false);
  setShouldAutoFitProperties(true);
};

export const handleCancelHandle = (
  setCancelling: (cancelling: boolean) => void,
  rootStore: RootStoreType,
  setEnableDraw: (enable: boolean) => void,
  setShowControls: (show: boolean) => void,
  setShowDrawButton: (show: boolean) => void,
  setShouldAutoFitProperties: (shouldAutoFit: boolean) => void,
  setPoligon: (polygon: google.maps.Polygon | null) => void,
  polygon: google.maps.Polygon | null
) => {
  setCancelling(true);
  rootStore.propertyListingQuery.resetCoordinates();

  setEnableDraw(false);

  setShowControls(false);
  setShowDrawButton(true);

  if (polygon) {
    polygon.setMap(null);
    setPoligon(null);
  }

  // Clear saved polygon
  clearPolygonFromStorage();

  // Re-enable auto-fitting to properties
  setShouldAutoFitProperties(true);
};

const POLYGON_STORAGE_KEY = 'listd_drawn_polygon';

export const savePolygonToStorage = (polygon: google.maps.Polygon) => {
  try {
    const path = polygon
      .getPath()
      .getArray()
      .map(coord => ({
        latitude: coord.lat(),
        longitude: coord.lng(),
      }));

    localStorage.setItem(POLYGON_STORAGE_KEY, JSON.stringify(path));
    return path;
  } catch (error) {
    console.warn('Failed to save polygon to localStorage:', error);
    return null;
  }
};

export const loadPolygonFromStorage = () => {
  try {
    const savedPolygon = localStorage.getItem(POLYGON_STORAGE_KEY);
    if (savedPolygon) {
      return JSON.parse(savedPolygon) as {
        latitude: number;
        longitude: number;
      }[];
    }
  } catch (error) {
    console.warn('Failed to load saved polygon:', error);
    clearPolygonFromStorage();
  }
  return null;
};

export const clearPolygonFromStorage = () => {
  try {
    localStorage.removeItem(POLYGON_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear polygon from localStorage:', error);
  }
};

export const restorePolygonFromStorage = (
  mapInstance: google.maps.Map | null,
  setPolygon: (polygon: google.maps.Polygon | null) => void,
  setShowControls: (show: boolean) => void,
  setShowDrawButton: (show: boolean) => void,
  geojson?: Geojson[]
) => {
  // If geojson exists, clear localStorage and don't restore
  if (geojson && geojson.length > 0) {
    clearPolygonFromStorage();
    setShowControls(false);
    setShowDrawButton(true);
    return null;
  }

  const coordinates = loadPolygonFromStorage();
  if (coordinates && mapInstance && coordinates.length > 0) {
    const polygonInstance = new google.maps.Polygon({
      paths: coordinates.map(coord => ({
        lat: coord.latitude,
        lng: coord.longitude,
      })),
      fillColor: '#6B21A8',
      strokeColor: '#6B21A8',
      fillOpacity: 0.4,
      strokeOpacity: 1,
      strokeWeight: 2,
      clickable: true,
      editable: false,
      zIndex: 1,
    });

    polygonInstance.setMap(mapInstance);
    setPolygon(polygonInstance);

    // Show controls since we have a polygon
    setShowControls(true);
    setShowDrawButton(false);

    return polygonInstance;
  }

  return null;
};

export const createGeojsonPolygon = (
  geojson: Geojson[],
  mapInstance: google.maps.Map,
  polygon: google.maps.Polygon | null,
  setPoligon: (polygon: google.maps.Polygon | null) => void,
  setShouldAutoFitProperties: (shouldAutoFit: boolean) => void
) => {
  if (!geojson || !mapInstance) return null;

  // Clear any existing polygon first
  if (polygon) {
    polygon.setMap(null);
    setPoligon(null);
  }

  const geojsonPath = getGeojsonPolygonPath(geojson);
  if (!geojsonPath) return null;

  const polygonInstance = new google.maps.Polygon({
    paths: geojsonPath,
    fillColor: '#6B21A8',
    strokeColor: '#6B21A8',
    fillOpacity: 0.4,
    strokeOpacity: 1,
    strokeWeight: 2,
    clickable: true,
    editable: false,
    zIndex: 1,
  });

  polygonInstance.setMap(mapInstance);
  setPoligon(polygonInstance);
  setShouldAutoFitProperties(false); // Disable auto-fitting when geojson is loaded

  // Zoom to fit the geojson polygon
  const bounds = new google.maps.LatLngBounds();
  geojsonPath.forEach(point => {
    bounds.extend(point);
  });

  // Add padding and fit bounds
  mapInstance.fitBounds(bounds, 50);

  // Set a reasonable zoom level if bounds are too small
  const currentZoom = mapInstance.getZoom();
  if (currentZoom && currentZoom > 15) {
    mapInstance.setZoom(11.5);
  }

  return polygonInstance;
};

export const handlePolygonRestoration = (
  isCancelling: boolean,
  geojson: Geojson[] | undefined,
  polygon: google.maps.Polygon | null,
  mapInstance: google.maps.Map | null,
  setPoligon: (polygon: google.maps.Polygon | null) => void,
  setShowControls: (show: boolean) => void,
  setShowDrawButton: (show: boolean) => void,
  setShouldAutoFitProperties: (shouldAutoFit: boolean) => void
) => {
  if (isCancelling) {
    return;
  }

  if (geojson && geojson.length > 0) {
    return;
  }

  const hasLocalStoragePolygon = localStorage.getItem('listd_drawn_polygon');
  if (hasLocalStoragePolygon) {
    restorePolygonFromStorage(
      mapInstance,
      setPoligon,
      setShowControls,
      setShowDrawButton,
      geojson
    );
    setShouldAutoFitProperties(true);
  } else {
    if (polygon) {
      polygon.setMap(null);
      setPoligon(null);
    }
    clearPolygonFromStorage();
    setShowControls(false);
    setShowDrawButton(true);
    setShouldAutoFitProperties(true);
  }
};
