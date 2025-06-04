import { PropertyPage } from '@/components/property/PropertyPage';
import { getListingTypes } from '@/lib/queries/server/home';
import {
  getProperties,
  PROPERTY_TYPES_MAPPING,
} from '@/lib/queries/server/propety';

type SearchParams = {
  property: keyof typeof PROPERTY_TYPES_MAPPING;
  type: string;
  search?: string;
  maxBedrooms?: string;
  minBedrooms?: string;
  minBathrooms?: string;
  maxBathrooms?: string; 
  minPrice?: string;
  maxPrice?: string;
}

export default async function Page({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await searchParamsPromise;
  const [properties, listingTypes] = await Promise.all([
    getProperties(searchParams),
    getListingTypes(),
  ]);

  return <PropertyPage properties={properties} listingTypes={listingTypes} />;
}
