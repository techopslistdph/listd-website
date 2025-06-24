import { PropertyPage } from '@/components/property/PropertyPage';
import { getListingTypes } from '@/lib/queries/server/home';
import { getProperties, SearchParams } from '@/lib/queries/server/propety';
import { PropertyDetail } from '@/lib/queries/server/propety/type';

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

  return (
    <PropertyPage
      properties={properties as unknown as PropertyDetail[]}
      listingTypes={listingTypes}
      propertyType={searchParams.property}
    />
  );
}
