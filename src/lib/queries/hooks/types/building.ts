export interface BuildingSuggestion {
  placeId: string;
  address: string;
  formattedAddress: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  addressComponents: {
    country: string;
    province: string;
    region: string;
    city: string;
    barangay: string;
    route: string;
    postalCode: string;
  };
  buildingName: string;
  types: string[];
}

export interface BuildingSuggestionsResponse {
  success: boolean;
  data: {
    predictions: BuildingSuggestion[];
  } | null;
  message?: string;
  error?: {
    message: string;
  };
}
