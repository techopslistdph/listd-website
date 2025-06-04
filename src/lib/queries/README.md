# React Query Setup

This directory contains the React Query (TanStack Query) setup and query hooks for the application.

## Structure

```
queries/
├── index.ts              # Main exports
├── query-client.ts       # Query client configuration
├── query-provider.tsx    # Provider component
├── query-keys.ts         # Centralized query keys
├── hooks/
│   └── use-lists.ts      # Example query hooks
└── README.md            # This file
```

## Setup

### 1. Wrap your app with QueryProvider

Add the `QueryProvider` to your app layout or root component:

```tsx
import { QueryProvider } from '@/lib/queries';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
```

### 2. Using Query Hooks

Import and use the query hooks in your components:

```tsx
import { useLists, useCreateList } from '@/lib/queries';

function ListsPage() {
  const { data: lists, isLoading, error } = useLists();
  const createListMutation = useCreateList();

  const handleCreateList = async (title: string) => {
    try {
      await createListMutation.mutateAsync({ title });
      // List will be automatically refetched due to cache invalidation
    } catch (error) {
      console.error('Failed to create list:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{lists?.map(list => <div key={list.id}>{list.title}</div>)}</div>;
}
```

## Creating New Query Hooks

### 1. Add Query Keys

First, add your entity to `query-keys.ts`:

```ts
export const queryKeys = {
  // ... existing keys
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters: string) =>
      [...queryKeys.posts.lists(), { filters }] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
  },
};
```

### 2. Create Hook File

Create a new file in `hooks/` directory (e.g., `use-posts.ts`):

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';

// Define your types
interface Post {
  id: string;
  title: string;
  content: string;
}

// Define API functions
const api = {
  getPosts: async (): Promise<Post[]> => {
    const response = await fetch('/api/posts');
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  },
  // ... other API functions
};

// Export hooks
export function usePosts() {
  return useQuery({
    queryKey: queryKeys.posts.all,
    queryFn: api.getPosts,
  });
}
```

### 3. Export from Index

Add your new hooks to `index.ts`:

```ts
export * from './hooks/use-posts';
```

## Best Practices

1. **Use Query Keys Factory**: Always use the centralized query keys from `query-keys.ts`
2. **Handle Loading States**: Always handle `isLoading`, `error`, and `data` states
3. **Optimistic Updates**: Use optimistic updates for better UX when appropriate
4. **Cache Invalidation**: Properly invalidate related queries after mutations
5. **Error Handling**: Implement proper error handling in your components
6. **TypeScript**: Always type your data interfaces and API responses

## Configuration

The query client is configured with:

- 5-minute stale time
- 10-minute garbage collection time
- Smart retry logic (no retry on 4xx errors)
- Disabled refetch on window focus

You can modify these settings in `query-client.ts`.

## Development Tools

React Query DevTools are automatically included in development mode. You can toggle them using the floating button in the bottom-left corner of your app.
