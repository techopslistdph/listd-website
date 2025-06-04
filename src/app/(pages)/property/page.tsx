import { PropertyPage } from '@/components/property/PropertyPage';
import { getListingTypes } from '@/lib/queries/server/home';
import { getProperties, SearchParams } from '@/lib/queries/server/propety';

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
