import { api } from '@/lib/fetch-wrapper';
import { API_ENDPOINTS } from '../api-endpoints';
import { ErrorResponse } from '../type';
import { ListingType, PropertyType } from './type';

export const getListingTypes = async (): Promise<ListingType[]> => {
  const response = await api.get<
    { success: true; data: ListingType[] } | ErrorResponse
  >(API_ENDPOINTS.listingTypes.list);
  if ('error' in response) {
    throw new Error(response.error.message);
  }
  return response.data;
};

export const getPropertyTypes = async (): Promise<PropertyType[]> => {
  const response = await api.get<
    { success: true; data: PropertyType[] } | ErrorResponse
  >(API_ENDPOINTS.propertyTypes.list);
  if ('error' in response) {
    throw new Error(response.error.message);
  }
  return response.data;
};
