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
import { calculateBoundingBoxFromGeojson, Geojson } from '@/utils/mapUtils';

export default async function Page({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await searchParamsPromise;

  const session = await auth();
  let geojson = null;
  if (searchParams.city || searchParams.barangay || searchParams.province) {
    geojson = await getGeojson(
      searchParams.city,
      searchParams.barangay,
      searchParams.province
    );
  }

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

  // Check if coordinate parameters are present
  const hasCoordinates = !!(
    searchParams.minLatitude ||
    searchParams.maxLatitude ||
    searchParams.minLongitude ||
    searchParams.maxLongitude
  );

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
      geojson={geojson?.data as unknown as Geojson[]}
      hasCoordinates={hasCoordinates}
    />
  );
}
