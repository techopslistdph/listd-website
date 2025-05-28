/**
 * Query Keys Factory
 * Centralized query key management for consistent caching and invalidation
 */

export const queryKeys = {
  // Example query keys - replace with your actual entities
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  
  lists: {
    all: ['lists'] as const,
    lists: () => [...queryKeys.lists.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.lists.lists(), { filters }] as const,
    details: () => [...queryKeys.lists.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.lists.details(), id] as const,
  },
  
  // Add more entities as needed
  // posts: {
  //   all: ['posts'] as const,
  //   lists: () => [...queryKeys.posts.all, 'list'] as const,
  //   list: (filters: string) => [...queryKeys.posts.lists(), { filters }] as const,
  //   details: () => [...queryKeys.posts.all, 'detail'] as const,
  //   detail: (id: string) => [...queryKeys.posts.details(), id] as const,
  // },
} as const 