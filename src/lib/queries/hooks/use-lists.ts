import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../query-keys'
import { api } from '../../fetch-wrapper'

interface List {
  id: string
  title: string
  description?: string
  createdAt: string
  updatedAt: string
}

interface CreateListData {
  title: string
  description?: string
}

interface UpdateListData {
  id: string
  title?: string
  description?: string
}

// API functions using the fetch wrapper
const listApi = {
  getLists: async (): Promise<List[]> => {
    return api.get<List[]>('/api/lists')
  },

  getList: async (id: string): Promise<List> => {
    return api.get<List>(`/api/lists/${id}`)
  },

  createList: async (data: CreateListData): Promise<List> => {
    return api.post<List>('/api/lists', data)
  },

  updateList: async (data: UpdateListData): Promise<List> => {
    const { id, ...updateData } = data
    return api.put<List>(`/api/lists/${id}`, updateData)
  },

  deleteList: async (id: string): Promise<void> => {
    return api.delete<void>(`/api/lists/${id}`)
  },
}

// Query Hooks
export function useLists() {
  return useQuery({
    queryKey: queryKeys.lists.all,
    queryFn: listApi.getLists,
  })
}

export function useList(id: string) {
  return useQuery({
    queryKey: queryKeys.lists.detail(id),
    queryFn: () => listApi.getList(id),
    enabled: !!id,
  })
}

// Mutation Hooks
export function useCreateList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: listApi.createList,
    onSuccess: () => {
      // Invalidate and refetch lists
      queryClient.invalidateQueries({ queryKey: queryKeys.lists.all })
    },
  })
}

export function useUpdateList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: listApi.updateList,
    onSuccess: (data) => {
      // Update the specific list in cache
      queryClient.setQueryData(queryKeys.lists.detail(data.id), data)
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.lists.all })
    },
  })
}

export function useDeleteList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: listApi.deleteList,
    onSuccess: (_, deletedId) => {
      // Remove the specific list from cache
      queryClient.removeQueries({ queryKey: queryKeys.lists.detail(deletedId) })
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.lists.all })
    },
  })
} 