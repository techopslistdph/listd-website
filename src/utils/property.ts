import { PropertyDetail } from '../lib/queries/server/propety/type';

interface ProcessedPropertyDetails {
  features: string[];
  details: Record<string, string | number | boolean | undefined>[];
}

export function processPropertyDetails(
  propertyDetail: PropertyDetail
): ProcessedPropertyDetails {
  const {
    hasSwimmingPool,
    hasGarden,
    hasTerrace,
    hasBalcony,
    hasSecurity,
    numberOfBedrooms,
    numberOfBathrooms,
    floorArea,
    lotSize,
    numberOfParkingSpaces,
    numberOfFloors,
    numberOfGarages,
    numberOfLivingRooms,
    numberOfDiningRooms,
    numberOfKitchens,
    numberOfMaidRooms,
    yearBuilt,
    furnishingStatus,
  } = propertyDetail;

  // Boolean features for PropertyFeatures
  const features: string[] = [];
  if (hasSwimmingPool !== null && hasSwimmingPool)
    features.push('Swimming Pool');
  if (hasGarden !== null && hasGarden) features.push('Garden');
  if (hasTerrace !== null && hasTerrace) features.push('Terrace');
  if (hasBalcony !== null && hasBalcony) features.push('Balcony');
  if (hasSecurity) features.push('Security');

  // Numeric details for PropertyDescription
  const details: Record<string, string | number | boolean | undefined>[] = [];
  if (numberOfBedrooms !== null && numberOfBedrooms)
    details.push({ bedrooms: numberOfBedrooms });
  if (numberOfBathrooms !== null && numberOfBathrooms)
    details.push({ baths: numberOfBathrooms });
  if (floorArea !== null && floorArea)
    details.push({ area: `${floorArea} sqm` });
  if (lotSize !== null && lotSize) details.push({ lotSize: `${lotSize} sqm` });
  if (numberOfParkingSpaces !== null && numberOfParkingSpaces)
    details.push({ parking: numberOfParkingSpaces });
  if (numberOfFloors !== null && numberOfFloors)
    details.push({
      floors: `${numberOfFloors} Floor${numberOfFloors > 1 ? 's' : ''}`,
    });
  if (numberOfGarages !== null && numberOfGarages)
    details.push({
      garages: `${numberOfGarages} Garage${numberOfGarages > 1 ? 's' : ''}`,
    });
  if (numberOfLivingRooms !== null && numberOfLivingRooms)
    details.push({
      livingRooms: `${numberOfLivingRooms} Living Room${numberOfLivingRooms > 1 ? 's' : ''}`,
    });
  if (numberOfDiningRooms !== null && numberOfDiningRooms)
    details.push({
      diningRooms: `${numberOfDiningRooms} Dining Room${numberOfDiningRooms > 1 ? 's' : ''}`,
    });
  if (numberOfKitchens !== null && numberOfKitchens)
    details.push({
      kitchens: `${numberOfKitchens} Kitchen${numberOfKitchens > 1 ? 's' : ''}`,
    });
  if (numberOfMaidRooms !== null && numberOfMaidRooms)
    details.push({
      maidRooms: `${numberOfMaidRooms} Maid Room${numberOfMaidRooms > 1 ? 's' : ''}`,
    });
  if (yearBuilt !== null) details.push({ yearBuilt: yearBuilt });
  if (furnishingStatus !== null) details.push({ furnishingStatus });

  return { features, details };
}
