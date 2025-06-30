import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/queries';
import {
  BarangayCityResponse,
  NearbyPropertiesResponse,
  PropertyLikeResponse,
  PropertyListResponse,
} from '../server/propety/type';
import { CreateListingRequest } from '../server/listing';

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
          message: 'City not found',
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
        const endpointMap = {
          condominium: '/api/condominiums/complete',
          'house-and-lot': '/api/house-and-lots/complete',
          warehouse: '/api/warehouses/complete',
          'vacant-lot': '/api/vacant-lots/complete',
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

        // Upload images first
        const imageUploadPromises = data.photos.map(async (file: File) => {
          const uploadResult = await property.uploadImage(file);
          if (!uploadResult.success) {
            throw new Error(`Failed to upload image: ${uploadResult.message}`);
          }
          return {
            url: uploadResult.data,
            caption: '',
            order: 0,
          };
        });

        const uploadedImages = await Promise.all(imageUploadPromises);

        // get city and baranggay id
        const cityAndBarangay = await property.getCityAndBarangay(
          data.cityId,
          data.barangayId
        );

        // Create listing data with uploaded image URLs
        const listingDataWithUrls = {
          ...data,
          cityId: cityAndBarangay.city?.id,
          barangayId: cityAndBarangay.barangay?.id,
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
