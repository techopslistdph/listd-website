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
    valuation?: {
      id: string;
      salePrice: {
        estimated: number;
        range: {
          low: number;
          high: number;
        };
        confidence: 'low' | 'medium' | 'high';
        currency: string;
      };
      rentalPrice: {
        estimated: number;
        range: {
          low: number;
          high: number;
        };
        confidence: 'low' | 'medium' | 'high';
        currency: string;
        period: string;
      };
      analysis: {
        marketConditions: string;
        locationFactors: string[];
        propertyFeatures: string[];
        comparableProperties: Array<{
          type: string;
          location: string;
          price: number;
          size: number;
          source: string;
        }>;
        marketTrends: string;
      };
      disclaimer: string;
    };
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
    nearbyLocations?: [value: string, label: string][] | string[];
    amenities?: [value: string, label: string][] | string[];
    features?: [value: string, label: string][] | string[];
    security?: [value: string, label: string][] | string[];

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
