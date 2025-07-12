import { api } from "@/lib/fetch-wrapper";
import { useQuery } from "@tanstack/react-query";

interface AmenitiesAndFeaturesListResponse {
    data: {
      data: {
          id: string;
          name: string;
          description: string;
          createdAt: string;
          updatedAt: string;
          forScrape: boolean;
      }[]
    }
  }


export const useAmenitiesAndFeatures = () => {
  return useQuery({
    queryKey: ['amenities-and-features'],
    queryFn: () => getAmenitiesAndFeaturesList(),
  });
};

async function getAmenitiesAndFeaturesList() {
  const [amenities, features] = await Promise.all([getAmenitiesList(), getFeaturesList()]);
  return [amenities, features];
}


function getAmenitiesList() {
  return api.get<AmenitiesAndFeaturesListResponse>('api/amenities');
}


function getFeaturesList() {
  return api.get<AmenitiesAndFeaturesListResponse>('api/features');
}