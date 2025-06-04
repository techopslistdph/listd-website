import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/query-keys';
import { api } from '@/lib/queries';

interface List {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateListingTypeData {
  name: string;
}

interface UpdateListingTypeData {
  id: string;
  name?: string;
}

interface DeleteListingTypeData {
  id: string;
}

interface ErrorResponse {
  success: false;
  error: {
    code:
      | 'VALIDATION_ERROR'
      | 'UNAUTHORIZED'
      | 'FORBIDDEN'
      | 'NOT_FOUND'
      | 'DUPLICATE_RECORD'
      | 'INTERNAL_ERROR';
    message: string;
    details?: Record<string, unknown>;
  };
}

const ListingTypeApi = {
  getLists: async (): Promise<List[]> => {
    try {
      const response = await api.get<
        { success: true; data: List[] } | ErrorResponse
      >('/api/listing-types');
      if ('error' in response) {
        throw new Error(response.error.message);
      }
      return response.data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch lists');
    }
  },

  getList: async (id: string): Promise<List> => {
    try {
      const response = await api.get<
        { success: true; data: List } | ErrorResponse
      >(`/api/listing-types/${id}`);
      if ('error' in response) {
        throw new Error(response.error.message);
      }
      return response.data;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error(`Failed to fetch list ${id}`);
    }
  },

  createList: async (data: CreateListingTypeData): Promise<List> => {
    try {
      const response = await api.post<
        { success: true; data: List } | ErrorResponse
      >('/api/listing-types', data);
      if ('error' in response) {
        throw new Error(response.error.message);
      }
      return response.data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to create list');
    }
  },

  updateList: async (data: UpdateListingTypeData): Promise<List> => {
    try {
      const { id, ...updateData } = data;
      const response = await api.put<
        { success: true; data: List } | ErrorResponse
      >(`/api/listing-types/${id}`, updateData);
      if ('error' in response) {
        throw new Error(response.error.message);
      }
      return response.data;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error(`Failed to update list ${data.id}`);
    }
  },

  deleteList: async (id: DeleteListingTypeData): Promise<void> => {
    try {
      const response = await api.delete<{ success: true } | ErrorResponse>(
        `/api/listing-types/${id}`
      );
      if ('error' in response) {
        throw new Error(response.error.message);
      }
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error(`Failed to delete list ${id}`);
    }
  },
};

export function useListingTypes() {
  return useQuery({
    queryKey: queryKeys.listingTypes.all,
    queryFn: ListingTypeApi.getLists,
  });
}

export function useListingType(id: string) {
  return useQuery({
    queryKey: queryKeys.listingTypes.detail(id),
    queryFn: () => ListingTypeApi.getList(id),
    enabled: !!id,
  });
}

// Mutation Hooks
export function useCreateListingType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ListingTypeApi.createList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listingTypes.all });
    },
  });
}

export function useUpdateListingType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ListingTypeApi.updateList,
    onSuccess: data => {
      queryClient.setQueryData(queryKeys.listingTypes.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.listingTypes.all });
    },
  });
}

export function useDeleteListingType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ListingTypeApi.deleteList,
    onSuccess: (_, deletedId: DeleteListingTypeData) => {
      queryClient.removeQueries({
        queryKey: queryKeys.listingTypes.detail(deletedId.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.listingTypes.all });
    },
  });
}
