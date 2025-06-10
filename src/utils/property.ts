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
  if (hasSwimmingPool) features.push('Swimming Pool');
  if (hasGarden) features.push('Garden');
  if (hasTerrace) features.push('Terrace');
  if (hasBalcony) features.push('Balcony');
  if (hasSecurity) features.push('Security');

  // Numeric details for PropertyDescription
  const details: Record<string, string | number | boolean | undefined>[] = [];
  if (numberOfBedrooms !== null) details.push({ bedrooms: numberOfBedrooms });
  if (numberOfBathrooms !== null) details.push({ baths: numberOfBathrooms });
  if (floorArea !== null) details.push({ area: `${floorArea} sqm` });
  if (lotSize !== null) details.push({ lotSize: `${lotSize} sqm` });
  if (numberOfParkingSpaces !== null)
    details.push({ parking: numberOfParkingSpaces });
  if (numberOfFloors !== null)
    details.push({
      floors: `${numberOfFloors} Floor${numberOfFloors > 1 ? 's' : ''}`,
    });
  if (numberOfGarages !== null)
    details.push({
      garages: `${numberOfGarages} Garage${numberOfGarages > 1 ? 's' : ''}`,
    });
  if (numberOfLivingRooms !== null)
    details.push({
      livingRooms: `${numberOfLivingRooms} Living Room${numberOfLivingRooms > 1 ? 's' : ''}`,
    });
  if (numberOfDiningRooms !== null)
    details.push({
      diningRooms: `${numberOfDiningRooms} Dining Room${numberOfDiningRooms > 1 ? 's' : ''}`,
    });
  if (numberOfKitchens !== null)
    details.push({
      kitchens: `${numberOfKitchens} Kitchen${numberOfKitchens > 1 ? 's' : ''}`,
    });
  if (numberOfMaidRooms !== null)
    details.push({
      maidRooms: `${numberOfMaidRooms} Maid Room${numberOfMaidRooms > 1 ? 's' : ''}`,
    });
  if (yearBuilt !== null) details.push({ yearBuilt: yearBuilt });
  if (furnishingStatus !== null) details.push({ furnishingStatus });

  return { features, details };
}
