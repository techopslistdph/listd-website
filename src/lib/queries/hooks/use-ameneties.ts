import { api } from "@/lib/fetch-wrapper";
import { useQuery } from "@tanstack/react-query";

interface AmenetiesListResponse {
    data: {
      data: {
          id: string;
          name: string;
          description: string;
          createdAt: string;
          updatedAt: string;
          forScraping: boolean;
      }[]
    }
  }

export const useAmeneties = () => {
  return useQuery({
    queryKey: ['ameneties'],
    queryFn: () => getAmenetiesList(),
  });
};


function getAmenetiesList() {
  return api.get<AmenetiesListResponse>('/api/amenities');
}
