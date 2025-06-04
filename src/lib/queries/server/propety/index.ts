import { api } from '@/lib/fetch-wrapper';
import { ErrorResponse } from '../type';
import { PropertyListResponse } from './type';
import { API_ENDPOINTS } from '../api-endpoints';

const getCondominiums = async (queryParams: string) => {
  const response = await api.get<PropertyListResponse | ErrorResponse>(
    `${API_ENDPOINTS.condominium.list}?${queryParams}`
  );
  console.log({ url: `${API_ENDPOINTS.condominium.list}?${queryParams}` });
  if ('error' in response) {
    throw new Error(response.error.message);
  }
  return response;
};

const getHouseAndLots = async (queryParams: string) => {
  const response = await api.get<PropertyListResponse | ErrorResponse>(
    `${API_ENDPOINTS.houseAndLot.list}?${queryParams}`
  );
  if ('error' in response) {
    throw new Error(response.error.message);
  }
  return response;
};

const getWarehouses = async (queryParams: string) => {
  const response = await api.get<PropertyListResponse | ErrorResponse>(
    `${API_ENDPOINTS.warehouse.list}?${queryParams}`
  );
  if ('error' in response) {
    throw new Error(response.error.message);
  }
  return response;
};

const getLots = async (queryParams: string) => {
  const response = await api.get<PropertyListResponse | ErrorResponse>(
    `${API_ENDPOINTS.vacantLot.list}?${queryParams}`
  );
  if ('error' in response) {
    throw new Error(response.error.message);
  }
  return response;
};

export const PROPERTY_TYPES_MAPPING = {
  condominium: getCondominiums,
  'house-and-lot': getHouseAndLots,
  warehouse: getWarehouses,
  'vacant-lot': getLots,
};

export const getProperties = async ({
  property,
  ...rest
}: {
  property: keyof typeof PROPERTY_TYPES_MAPPING;
  type: string;
  search?: string;
  maxBedrooms?: string;
  minBedrooms?: string;
  minBathrooms?: string;
  maxBathrooms?: string;
  minPrice?: string;
  maxPrice?: string;
}) => {
  const fetchProperties = PROPERTY_TYPES_MAPPING[property];
  
  const queryParams = new URLSearchParams();
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value);
    }
  });

  const response = await fetchProperties(queryParams.toString());
  return response.data;
};
