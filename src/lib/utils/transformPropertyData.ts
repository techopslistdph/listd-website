import { PropertyDetail } from '../queries/server/propety/type';

export const transformPropertyData = (property: PropertyDetail | null) => {
  if (!property) return {};

  const propertyType = property.property?.propertyTypeName;

  // Base transformation for common fields
  const baseData = {
    // From the nested property object
    title: property.property?.listingTitle,
    description: property.property?.listingDescription,
    grossAskingPrice: property.property?.listingPriceFormatted,
    propertyType: property.property?.propertyTypeName,
    propertyTypeId: property.property?.propertyTypeId,
    listingType: property.property?.listingTypeName,
    listingTypeId: property.property?.listingTypeId,
    city: property.property?.cityName,
    barangay: property.property?.barangayName,
    street: property.property?.streetAddress,
    longitude: property.property?.longitude,
    latitude: property.property?.latitude,

    // Transform arrays to match schema format
    amenities:
      property?.property?.amenities?.map(amenity => ({
        value: amenity.id,
        label: amenity.name,
      })) || [],
    features:
      property?.property?.features?.map(feature => ({
        value: feature.id,
        label: feature.name,
      })) || [],

    // Default values for required fields
    state: property.property?.region,
    forSale: property.property?.listingTypeName === 'Buy',
    package: 'free' as const,
    period: '30',

    // Handle images - pass the image objects directly
    images: property.property?.images || [],
  };

  // Property type specific transformations
  switch (propertyType) {
    case 'Condominium':
      return {
        ...baseData,
        buildingName: property.buildingName,
        floorNo: property.floorNumber?.toString(),
        floorArea: property.floorArea?.toString(),
        bedrooms: property.numberOfBedrooms,
        bathrooms: property.numberOfBathrooms,
        parking: property.numberOfParkingSpaces,
        fullyFurnished: property.furnishingStatus,
        facingWest: property.facingWest,
      };

    case 'Warehouse':
      return {
        ...baseData,
        lotSize: property.lotSize?.toString(),
        floorArea: property.floorArea?.toString(),
        ceilingHeight: property.ceilingHeight?.toString(),
        parking: property.numberOfParkingSpaces,
        loadingDocks: property.loadingDocks,
        buildingSize: property.buildingSize,
      };

    case 'House and lot':
      return {
        ...baseData,
        numberOfFloors: property.numberOfFloors,
        floorArea: property.floorArea?.toString(),
        lotSize: property.lotSize?.toString(),
        bedrooms: property.numberOfBedrooms,
        bathrooms: property.numberOfBathrooms,
        parking: property.numberOfParkingSpaces,
        fullyFurnished: property.furnishingStatus,
        numberOfGarages: property.numberOfGarages,
        numberOfLivingRooms: property.numberOfLivingRooms,
        numberOfDiningRooms: property.numberOfDiningRooms,
        numberOfKitchens: property.numberOfKitchens,
        numberOfMaidRooms: property.numberOfMaidRooms,
        yearBuilt: property.yearBuilt,
        facingWest: property.facingWest,
      };

    case 'Vacant lot':
      return {
        ...baseData,
        lotSize: property.lotSize,
        parking: property.numberOfParkingSpaces,
      };

    default:
      return baseData;
  }
};
