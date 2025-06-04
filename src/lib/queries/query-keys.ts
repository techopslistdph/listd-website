/**
 * Query Keys Factory
 * Centralized query key management for consistent caching and invalidation
 */

export const queryKeys = {
  users: {

  },
  
  listingTypes: {
    all: ['listingTypes'] as const,
    listingTypes: () => [...queryKeys.listingTypes.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.listingTypes.listingTypes(), { filters }] as const,
    details: () => [...queryKeys.listingTypes.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.listingTypes.details(), id] as const,
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