import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/queries';
import {
  BarangayCityResponse,
  CreateListingRequest,
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
      console.log('cityResponse', cityResponse.data);
      const city = cityResponse.data.data.find(
        (city: { id: string; name: string; psgcCode: string }) =>
          city.name.toLowerCase().includes(cityName.toLowerCase())
      );
      console.log('city', city);
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
        console.log('listingDataWithUrls', listingDataWithUrls);
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
