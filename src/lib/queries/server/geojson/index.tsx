import { api } from '@/lib/fetch-wrapper';
import { API_ENDPOINTS } from '../api-endpoints';

export interface GeojsonResponse {
  success: boolean;
  data: {
    data: GeojsonData;
  };
  message: string;
}

export interface GeojsonData {
  type: string;
  features: {
    type: string;
    id: string;
    properties: {
      name: string;
      admin_level: number;
      border_type: string;
      boundary: string;
      type: string;
      alt_name: string;
      is_in: string;
      wikidata: string;
      wikipedia: string;
      iso3166_2: string;
      iso3166_3: string;
    };
    geometry: {
      type: string;
      coordinates: number[];
    };
  }[];
}

export const getGeojson = async (
  city?: string,
  barangay?: string,
  province?: string,
  region?: string
) => {
  try {
    const queryParams = {
      ...(city && { city }),
      ...(barangay && { barangay }),
      ...(province && { province }),
      ...(region && { region }),
    };

    const response = await api.get<GeojsonResponse>(
      `${API_ENDPOINTS.geojson.search}?${new URLSearchParams(queryParams).toString()}`
    );
    if ('error' in response) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch geojson',
      };
    }
    return {
      data: response.data.data,
      success: true,
      message: 'Geojson fetched successfully',
    };
  } catch (error) {
    console.error('Error fetching geojson:', error);
    return {
      success: false,
      data: null,
      message: 'Failed to fetch geojson',
    };
  }
};
