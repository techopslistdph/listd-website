export interface BuildingPrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  types: string[];
}

export interface BuildingDetails {
  placeId: string;
  name: string;
  formattedAddress: string;
  addressComponents: {
    streetName: string;
    barangay: string;
    city: string;
    region: string;
    country: string;
  };
  location: {
    lat: number;
    lng: number;
  };
}
