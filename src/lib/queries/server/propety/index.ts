import { api } from '@/lib/fetch-wrapper';
import { ErrorResponse } from '../type';
import { PropertyDetailResponse, PropertyListResponse } from './type';
import { API_ENDPOINTS } from '../api-endpoints';

const getCondominiums = async (queryParams: string) => {
  const response = await api.get<PropertyListResponse | ErrorResponse>(
    `${API_ENDPOINTS.condominium.list}?${queryParams}`
  );
  console.log({ url: `${API_ENDPOINTS.condominium.list}?${queryParams}` });
  if ('error' in response) {
    throw new Error(response.error.message);
  }
  return response.data;
};

const getHouseAndLots = async (queryParams: string) => {
  const response = await api.get<PropertyListResponse | ErrorResponse>(
    `${API_ENDPOINTS.houseAndLot.list}?${queryParams}`
  );
  if ('error' in response) {
    throw new Error(response.error.message);
  }
  return response.data;
};

const getWarehouses = async (queryParams: string) => {
  const response = await api.get<PropertyListResponse | ErrorResponse>(
    `${API_ENDPOINTS.warehouse.list}?${queryParams}`
  );
  if ('error' in response) {
    throw new Error(response.error.message);
  }
  return response.data;
};

const getLots = async (queryParams: string) => {
  const response = await api.get<PropertyListResponse | ErrorResponse>(
    `${API_ENDPOINTS.vacantLot.list}?${queryParams}`
  );
  if ('error' in response) {
    throw new Error(response.error.message);
  }
  return response.data;
};

const condominiumById = async (id: string) => {
  const response = await api.get<PropertyDetailResponse | ErrorResponse>(
    `${API_ENDPOINTS.condominium.byId(id)}`
  );
  if ('error' in response) {
    throw new Error(response.error.message);
  }
  return response;
};

const houseAndLotById = async (id: string) => {
  const response = await api.get<PropertyDetailResponse | ErrorResponse>(
    `${API_ENDPOINTS.houseAndLot.byId(id)}`
  );
  if ('error' in response) {
    throw new Error(response.error.message);
  }
  return response;
};

const warehouseById = async (id: string) => {
  const response = await api.get<PropertyDetailResponse | ErrorResponse>(
    `${API_ENDPOINTS.warehouse.byId(id)}`
  );
  if ('error' in response) {
    throw new Error(response.error.message);
  }
  return response;
};

const vacantLotById = async (id: string) => {
  const response = await api.get<PropertyDetailResponse | ErrorResponse>(
    `${API_ENDPOINTS.vacantLot.byId(id)}`
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

export const PROPERTY_TYPES_BY_ID_MAPPING = {
  condominium: condominiumById,
  'house-and-lot': houseAndLotById,
  warehouse: warehouseById,
  'vacant-lot': vacantLotById,
};

export type SearchParams = {
  property: keyof typeof PROPERTY_TYPES_MAPPING;
  type: string;
  search?: string;
  maxBedrooms?: string;
  minBedrooms?: string;
  minBathrooms?: string;
  maxBathrooms?: string;
  minPrice?: string;
  maxPrice?: string;
  minFloorArea?: string;
  maxFloorArea?: string;
};

export const getProperties = async ({ property, ...rest }: SearchParams) => {
  const fetchProperties = PROPERTY_TYPES_MAPPING[property];

  const queryParams = new URLSearchParams();
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value);
    }
  });

  const response = (await fetchProperties(
    queryParams.toString()
  )) as unknown as PropertyListResponse;
  return response.data;
};

export const getPropertyById = async ({
  property,
  id,
}: {
  property: SearchParams['property'];
  id: string;
}) => {
  const fetchProperty = PROPERTY_TYPES_BY_ID_MAPPING[property];
  const response = await fetchProperty(id);
  return response.data;
};
