import { Properties } from '@/components/property/Properties';
import { getListingTypes } from '@/lib/queries/server/home';
import { getPriceRanges, getProperties, SearchParams } from '@/lib/queries/server/propety';
import { PropertyListResponse } from '@/lib/queries/server/propety/type';
import { auth } from '@clerk/nextjs/server';

export default async function Page({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await searchParamsPromise;

  const session = await auth();
  const [properties, listingTypes, priceRanges] = await Promise.all([
    getProperties(searchParams, session?.sessionId),
    getListingTypes(),
    getPriceRanges(searchParams.propertyTypeId || '', searchParams.listingTypeId || '')
  ]);


  return (
    <Properties
      properties={properties as unknown as PropertyListResponse}
      listingTypes={listingTypes}
      propertyType={searchParams.property}  
      priceRanges={priceRanges}
    />
  );
}
