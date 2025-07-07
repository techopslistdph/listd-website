export interface AiGenerateResponse {
  success: boolean;
  data: {
    content: string;
    title?: string;
    metadata?: {
      requestType: string;
      propertyType: string;
      location: string;
    };
    needsMoreInfo?: boolean;
  };
  message?: string;
  error?: {
    message: string;
  };
}

export interface AiGeneratePrompt {
  request: string;
  propertyType: string;
  location?: string;
  context?: {
    // Common fields
    floorArea?: number;
    lotSize?: number;
    transactionType?: string;
    bedrooms?: number;
    bathrooms?: number;
    parking?: number;
    buildingName?: string;
    floorNo?: string;
    grossAskingPrice?: string;
    downPaymentPercent?: string;
    downPaymentPHP?: string;
    commissionPercent?: string;
    commissionPHP?: string;
    nearbyLocations?: string[];
    amenities?: string[];
    features?: string[];
    security?: string[];

    // Property type specific fields
    // Condominium
    fullyFurnished?: string;
    facingWest?: boolean;

    // Warehouse
    ceilingHeight?: string;
    loadingDocks?: number;
    buildingSize?: number;

    // House and Lot
    numberOfFloors?: number;
    numberOfGarages?: number;
    numberOfLivingRooms?: number;
    numberOfDiningRooms?: number;
    numberOfKitchens?: number;
    numberOfMaidRooms?: number;
    yearBuilt?: number;
  };
}
