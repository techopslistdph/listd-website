import { PropertyDetail } from '@/lib/queries/server/propety/type';

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

interface ParsedDescriptionSection {
  title?: string;
  content: string[];
  type: 'keyValue' | 'bulletList' | 'paragraph' | 'source';
}

export function parsePropertyDescription(
  description: string
): ParsedDescriptionSection[] {
  if (!description) return [];

  const lines = description
    .split('\n')
    .map(line => line.trim())
    .filter(line => line);
  const sections: ParsedDescriptionSection[] = [];
  let currentSection: ParsedDescriptionSection | null = null;

  for (const line of lines) {
    // Check for source section - stop parsing here and exclude it
    if (line.toLowerCase().includes('--- listing source ---')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      // Don't create a source section, just break out of the loop
      break;
    }

    // Check for section headers (ends with colon)
    if (
      line.endsWith(':') &&
      !line.includes(' : ') &&
      !line.includes(': ') &&
      !line.includes(' :') &&
      !line.includes(' : ')
    ) {
      if (currentSection) {
        sections.push(currentSection);
      }
      const title = line.slice(0, -1).trim();
      currentSection = { title, type: 'bulletList', content: [] };
      continue;
    }

    // Check for key-value pairs (contains ' : ')
    if (line.includes(' : ')) {
      if (!currentSection || currentSection.type !== 'keyValue') {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = { type: 'keyValue', content: [] };
      }
      currentSection.content.push(line);
      continue;
    }

    // Check for bullet points
    if (line.startsWith('•') || line.startsWith('-')) {
      if (!currentSection || currentSection.type !== 'bulletList') {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = { type: 'bulletList', content: [] };
      }
      currentSection.content.push(line);
      continue;
    }

    // Check for amenities section
    if (
      line.toLowerCase().includes('amenities:') ||
      line.toLowerCase().includes('village amenities:')
    ) {
      if (currentSection) {
        sections.push(currentSection);
      }
      const title = line.trim();
      currentSection = { title, type: 'bulletList', content: [] };
      continue;
    }

    // Regular paragraph content
    if (!currentSection || currentSection.type !== 'paragraph') {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = { type: 'paragraph', content: [] };
    }
    currentSection.content.push(line);
  }

  // Add the last section (but not if it's a source section)
  if (currentSection && currentSection.type !== 'source') {
    sections.push(currentSection);
  }

  return sections;
}
