import { PropertyPage } from '@/components/property/PropertyPage';
import { getListingTypes } from '@/lib/queries/server/home';
import {
  getProperties,
  PROPERTY_TYPES_MAPPING,
} from '@/lib/queries/server/propety';

export default async function Page({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{
    property: keyof typeof PROPERTY_TYPES_MAPPING;
    type: string;
    search?: string;
    maxBedrooms?: string;
    minBedrooms?: string;
    minBathrooms?: string;
    maxBathrooms?: string;
  }>;
}) {
  const searchParams = await searchParamsPromise;
  const [properties, listingTypes] = await Promise.all([
    getProperties({
      property: searchParams.property,
      type: searchParams.type,
      search: searchParams.search,
      maxBedrooms: searchParams.maxBedrooms,
      minBedrooms: searchParams.minBedrooms,
      minBathrooms: searchParams.minBathrooms,
      maxBathrooms: searchParams.maxBathrooms,
    }),
    getListingTypes(),
  ]);

  return <PropertyPage properties={properties} listingTypes={listingTypes} />;
}
