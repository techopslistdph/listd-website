/* eslint-disable @typescript-eslint/no-explicit-any */
import { Properties } from '@/components/property/Properties';
import { getGeojson } from '@/lib/queries/server/geojson';
import { getListingTypes } from '@/lib/queries/server/home';
import {
  getPriceRanges,
  getProperties,
  SearchParams,
} from '@/lib/queries/server/propety';
import { PropertyListResponse } from '@/lib/queries/server/propety/type';
import { auth } from '@clerk/nextjs/server';

// Utility function to calculate bounding box from GeoJSON coordinates
const calculateBoundingBoxFromGeojson = (geojson: any) => {
  if (!geojson?.data?.[0]?.coordinates) {
    return null;
  }

  const coordinates = geojson.data?.[0]?.coordinates;

  // Handle different GeoJSON polygon structures
  let coordArray: number[][];
  if (Array.isArray(coordinates[0]) && Array.isArray(coordinates[0][0])) {
    // Multi-polygon or polygon with holes
    coordArray = coordinates[0];
  } else if (Array.isArray(coordinates[0])) {
    // Simple polygon
    coordArray = coordinates;
  } else {
    return null;
  }

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  coordArray.forEach(coord => {
    const [lng, lat] = coord;
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  });

  // set url params

  return {
    minLatitude: minLat,
    maxLatitude: maxLat,
    minLongitude: minLng,
    maxLongitude: maxLng,
  };
};

export default async function Page({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await searchParamsPromise;

  const session = await auth();

  // Get GeoJSON first
  const geojson = await getGeojson(
    searchParams.city,
    searchParams.barangay,
    searchParams.province
  );

  // Calculate bounding box from GeoJSON if available
  const boundingBox = calculateBoundingBoxFromGeojson(geojson);

  // Merge search params with bounding box coordinates if available
  const enhancedSearchParams = {
    ...searchParams,
    ...(boundingBox && {
      minLatitude: boundingBox.minLatitude.toString(),
      maxLatitude: boundingBox.maxLatitude.toString(),
      minLongitude: boundingBox.minLongitude.toString(),
      maxLongitude: boundingBox.maxLongitude.toString(),
    }),
  };

  console.log('enhancedSearchParams', enhancedSearchParams);
  const [properties, listingTypes, priceRanges] = await Promise.all([
    getProperties(enhancedSearchParams, session?.sessionId),
    getListingTypes(),
    getPriceRanges(
      searchParams.propertyTypeId || '',
      searchParams.listingTypeId || '',
      searchParams.search || ''
    ),
  ]);

  return (
    <Properties
      properties={properties as unknown as PropertyListResponse}
      listingTypes={listingTypes}
      propertyType={searchParams.property}
      priceRanges={priceRanges}
      geojson={geojson.data || null}
    />
  );
}
