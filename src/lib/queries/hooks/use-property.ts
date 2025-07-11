import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, ApiError, queryClient } from '@/lib/queries';
import {
  BarangayCityResponse,
  CreateListingRequest,
  LocationCoordinatesResponse,
  NearbyLocationsResponse,
  NearbyPropertiesResponse,
  PropertyLikeResponse,
  PropertyListResponse,
} from '../server/propety/type';

const property = {
  getNearbyProperties: async (location: {
    lat: number | null;
    lng: number | null;
  }) => {
    const { lat, lng } = location;
    try {
      const response = await api.get<NearbyPropertiesResponse>(
        `/api/nearby-properties?latitude=${lat}&longitude=${lng}&pageSize=15`
      );

      if ('error' in response) {
        return {
          success: false,
          data: null,
          message: response?.error?.message || 'An unexpected error occurred',
        };
      }
      return {
        success: true,
        ...response.data,
        message: 'Nearby Properties fetched successfully',
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          data: null,
          message: error.message,
        };
      }
      return {
        success: false,
        data: null,
        message: 'An unexpected error occurred',
      };
    }
  },

  likeProperty: async (propertyId: string) => {
    try {
      const response = await api.post<PropertyLikeResponse>(
        `/api/property-likes/${propertyId}/toggle`
      );

      return {
        success: true,
        ...response.data,
        message: 'Property liked successfully',
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          data: null,
          message: error.message,
        };
      }
      return {
        success: false,
        data: null,
        message: 'An unexpected error occurred',
      };
    }
  },

  getCityAndBarangay: async (cityName: string, barangayName: string) => {
    try {
      const cityResponse = await api.get<BarangayCityResponse>(
        `/api/cities?search=${cityName}`
      );
      if ('error' in cityResponse) {
        return {
          success: false,
          data: null,
          message:
            cityResponse?.error?.message || 'An unexpected error occurred',
        };
      }
      const city = cityResponse.data.data.find(
        (city: { id: string; name: string; psgcCode: string }) =>
          city.name.toLowerCase().includes(cityName.toLowerCase())
      );
      if (!city) {
        return {
          success: false,
          data: null,
          message: `City ${cityName} not found`,
        };
      }
      const barangayResponse = await api.get<BarangayCityResponse>(
        `/api/barangays?search=${barangayName}&psgcCode=${city.psgcCode}`
      );
      if ('error' in barangayResponse) {
        return {
          success: false,
          data: null,
          message:
            barangayResponse?.error?.message || 'An unexpected error occurred',
        };
      }
      const barangay = barangayResponse.data.data.find(
        (barangay: { id: string; name: string; psgcCode: string }) =>
          barangay.name.toLowerCase().includes(barangayName.toLowerCase())
      );
      if (!barangay) {
        return {
          success: false,
          data: null,
          message: `Barangay ${barangayName} not found in ${city.name}`,
        };
      }
      return {
        success: true,
        city: city,
        barangay: barangay,
        message: 'City and barangay fetched successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      };
    }
  },

  uploadImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<{ success: boolean; url: string }>(
        '/api/uploads/single',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return {
        success: true,
        data: response.url,
        message: 'Image uploaded successfully',
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          data: null,
          message: error.message,
        };
      }
      return {
        success: false,
        data: null,
        message: 'An unexpected error occurred',
      };
    }
  },

  getNearbyLocations: async (query: string) => {
    try {
      const response = await api.post<NearbyLocationsResponse>(
        '/api/google-maps/nearby-properties',
        {
          query,
        }
      );
      if ('error' in response) {
        return {
          success: false,
          data: null,
          message: response?.error?.message || 'An unexpected error occurred',
        };
      }
      return {
        success: true,
        data: response.data,
        message: 'Nearby locations fetched successfully',
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          data: null,
          message: error.message,
        };
      }
      return {
        success: false,
        data: null,
        message: 'An unexpected error occurred',
      };
    }
  },

  getLocationCoordinates: async (address: string) => {
    try {
      const response = await api.post<LocationCoordinatesResponse>(
        `/api/google-maps/address-autocomplete`,
        {
          query: address,
        }
      );
      if ('error' in response) {
        return {
          success: false,
          data: null,
          message: response?.error?.message || 'An unexpected error occurred',
        };
      }
      return {
        success: true,
        data: response.data,
        message: 'Location coordinates fetched successfully',
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          data: null,
          message: error.message,
        };
      }
      return {
        success: false,
        data: null,
        message: 'An unexpected error occurred',
      };
    }
  },
};

export const useNearbyProperties = (location: {
  lat: number | null;
  lng: number | null;
}) => {
  return useQuery({
    queryKey: ['nearby-properties', location.lat, location.lng],
    queryFn: () => property.getNearbyProperties(location),
    enabled: location.lat !== null && location.lng !== null,
  });
};

export const useNearbyLocations = (query: string) => {
  return useQuery({
    queryKey: ['nearby-locations', query],
    queryFn: () => property.getNearbyLocations(query),
    enabled: !!query,
  });
};

export const useLikeProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (propertyId: string) => {
      return property.likeProperty(propertyId);
    },
    onSuccess: () => {
      // Invalidate user liked properties
      queryClient.invalidateQueries({
        queryKey: ['userLikedProperties'],
      });

      // Invalidate general properties queries
      queryClient.invalidateQueries({
        queryKey: ['properties'],
      });
    },
  });
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      return property.uploadImage(file);
    },
  });
};

export const useListMyProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      propertyType,
    }: {
      data: CreateListingRequest;
      propertyType: string;
    }) => {
      try {
        const isDraft = data.isDraft;

        const endpointMap = {
          condominium: isDraft
            ? '/api/condominiums/draft'
            : '/api/condominiums/complete',
          'house and lot': isDraft
            ? '/api/house-and-lots/draft'
            : '/api/house-and-lots/complete',
          warehouse: isDraft
            ? '/api/warehouses/draft'
            : '/api/warehouses/complete',
          'vacant lot': isDraft
            ? '/api/vacant-lots/draft'
            : '/api/vacant-lots/complete',
        };

        const endpoint =
          endpointMap[propertyType.toLowerCase() as keyof typeof endpointMap];
        if (!endpoint) {
          return {
            success: false,
            data: null,
            message: `Invalid property type: ${propertyType}`,
          };
        }

        let cityAndBarangay;
        if (data.cityId && data.barangayId) {
          // get city and baranggay id
          cityAndBarangay = await property.getCityAndBarangay(
            data.cityId || '',
            data.barangayId || ''
          );
        }

        if (!cityAndBarangay?.success) {
          return {
            success: false,
            data: null,
            message: cityAndBarangay?.message || 'An unexpected error occurred',
          };
        }

        if (!data.latitude && !data.longitude) {
          const query = `${cityAndBarangay?.city?.name}, ${cityAndBarangay?.barangay?.name}, ${data.streetAddress}, `;
          const locationCoordinates =
            await property.getLocationCoordinates(query);
          if (!locationCoordinates.success) {
            return {
              success: false,
              data: null,
              message:
                locationCoordinates.message || 'An unexpected error occurred',
            };
          }
          data.latitude =
            locationCoordinates.data?.predictions[0]?.coordinates.latitude;
          data.longitude =
            locationCoordinates.data?.predictions[0]?.coordinates.longitude;
        }

        // Upload images first
        const imageUploadPromises = data?.photos?.map(
          async (file: File, index: number) => {
            const uploadResult = await property.uploadImage(file);
            if (!uploadResult.success) {
              throw new Error(
                `Failed to upload image: ${uploadResult.message}`
              );
            }
            return {
              url: uploadResult.data,
              caption: file?.name,
              order: index + 1,
            };
          }
        );

        const uploadedImages = await Promise.all(imageUploadPromises);

        // Create listing data with uploaded image URLs
        const listingDataWithUrls = {
          ...data,
          ...(cityAndBarangay?.city?.id && {
            cityId: cityAndBarangay?.city?.id,
          }),
          ...(cityAndBarangay?.barangay?.id && {
            barangayId: cityAndBarangay?.barangay?.id,
          }),
          photos: uploadedImages,
        };
        const response = await api.post<PropertyListResponse>(
          `${endpoint}`,
          listingDataWithUrls
        );
        if ('error' in response) {
          return {
            success: false,
            data: null,
            message: response?.error?.message || 'An unexpected error occurred',
          };
        }
        return {
          success: true,
          ...response.data,
          message: 'Listing created successfully',
        };
      } catch (error) {
        return {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['properties'],
      });
    },
  });
};

export const useDeleteProperty = () => {
  return useMutation({
    mutationFn: async ({
      propertyId,
      propertyType,
    }: {
      propertyId: string;
      propertyType: string;
    }) => {
      try {
        const endpointMap = {
          condominium: '/api/condominiums',
          'house and lot': '/api/house-and-lots',
          warehouse: '/api/warehouses',
          'vacant lot': '/api/vacant-lots',
        };

        const endpoint =
          endpointMap[propertyType.toLowerCase() as keyof typeof endpointMap];
        if (!endpoint) {
          return {
            success: false,
            data: null,
            message: `Invalid property type: ${propertyType}`,
          };
        }
        const response = await api.delete<PropertyListResponse>(
          `${endpoint}/${propertyId}`
        );
        if ('error' in response) {
          return {
            success: false,
            data: null,
            message: response?.error?.message || 'An unexpected error occurred',
          };
        }
        return {
          success: true,
          data: response.data,
          message: 'Property deleted successfully',
        };
      } catch (error) {
        return {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        };
      }
    },
    onSuccess: () => {
      // Invalidate user liked properties
      queryClient.invalidateQueries({
        queryKey: ['userListings'],
      });
    },
  });
};
