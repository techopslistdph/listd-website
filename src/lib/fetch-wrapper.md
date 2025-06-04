# Fetch Wrapper

A comprehensive fetch wrapper that provides consistent error handling, TypeScript support, and convenient methods for all HTTP operations.

## Features

- ✅ **TypeScript Support**: Full type safety with generics
- ✅ **Error Handling**: Custom `ApiError` class with status codes
- ✅ **Timeout Support**: Configurable request timeouts
- ✅ **Auth Token Management**: Built-in token handling
- ✅ **Multiple Content Types**: JSON, FormData, and text support
- ✅ **Abort Controller**: Request cancellation support
- ✅ **Base URL**: Configurable base URL for all requests

## Basic Usage

### Import the API

```ts
import { api } from '@/lib/fetch-wrapper';
// or from queries
import { api } from '@/lib/queries';
```

### GET Requests

```ts
// Simple GET
const users = await api.get<User[]>('/api/users');

// GET with custom headers
const user = await api.get<User>('/api/users/123', {
  headers: { 'Custom-Header': 'value' },
});

// GET with timeout
const data = await api.get<Data>('/api/data', {
  timeout: 5000, // 5 seconds
});
```

### POST Requests

```ts
// POST with JSON body
const newUser = await api.post<User>('/api/users', {
  name: 'John Doe',
  email: 'john@example.com',
});

// POST with FormData
const formData = new FormData();
formData.append('file', file);
const result = await api.post<UploadResult>('/api/upload', formData);
```

### PUT/PATCH Requests

```ts
// PUT request
const updatedUser = await api.put<User>('/api/users/123', {
  name: 'Jane Doe',
});

// PATCH request
const partialUpdate = await api.patch<User>('/api/users/123', {
  email: 'newemail@example.com',
});
```

### DELETE Requests

```ts
// DELETE request
await api.delete('/api/users/123');

// DELETE with response data
const result = await api.delete<DeleteResult>('/api/users/123');
```

## Authentication

### Set Auth Token

```ts
// Set bearer token for all requests
api.setAuthToken('your-jwt-token');

// Now all requests will include: Authorization: Bearer your-jwt-token
const protectedData = await api.get<ProtectedData>('/api/protected');
```

### Remove Auth Token

```ts
api.removeAuthToken();
```

## Error Handling

The fetch wrapper throws `ApiError` instances with detailed information:

```ts
import { ApiError } from '@/lib/fetch-wrapper';

try {
  const data = await api.get<Data>('/api/data');
} catch (error) {
  if (error instanceof ApiError) {
    console.log('Status:', error.status); // HTTP status code
    console.log('Message:', error.message); // Error message
    console.log('Status Text:', error.statusText); // HTTP status text
    console.log('Data:', error.data); // Response data (if any)

    // Handle specific errors
    if (error.status === 401) {
      // Redirect to login
    } else if (error.status === 404) {
      // Show not found message
    }
  }
}
```

## Advanced Usage

### Custom Configuration

```ts
import { FetchWrapper } from '@/lib/fetch-wrapper';

// Create custom instance with base URL
const apiV2 = new FetchWrapper('https://api.example.com/v2');

// Set default timeout
const fastApi = new FetchWrapper('', 3000); // 3 second timeout
```

### Request Cancellation

```ts
const controller = new AbortController();

// Cancel request after 5 seconds
setTimeout(() => controller.abort(), 5000);

try {
  const data = await api.get<Data>('/api/slow-endpoint', {
    signal: controller.signal,
  });
} catch (error) {
  if (error instanceof ApiError && error.status === 408) {
    console.log('Request was cancelled or timed out');
  }
}
```

### Custom Headers

```ts
// Per-request headers
const data = await api.post<Result>('/api/data', body, {
  headers: {
    'Content-Type': 'application/xml',
    'X-Custom-Header': 'value',
  },
});

// Set default headers for all requests
import { fetchWrapper } from '@/lib/fetch-wrapper';

fetchWrapper.setDefaultHeaders({
  'X-API-Version': '2.0',
  'X-Client': 'web-app',
});
```

## Integration with React Query

The fetch wrapper works seamlessly with React Query:

```ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/queries';

function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.get<User[]>('/api/users'),
  });
}

function useCreateUser() {
  return useMutation({
    mutationFn: (userData: CreateUserData) =>
      api.post<User>('/api/users', userData),
  });
}
```

## Error Status Codes

The wrapper handles various error scenarios:

- **408**: Request timeout
- **4xx**: Client errors (no retry)
- **5xx**: Server errors (will retry up to 3 times via React Query)
- **0**: Network errors (no internet, CORS, etc.)

## Best Practices

1. **Always use TypeScript generics** for type safety:

   ```ts
   const users = await api.get<User[]>('/api/users'); // ✅
   const users = await api.get('/api/users'); // ❌
   ```

2. **Handle errors appropriately**:

   ```ts
   try {
     const data = await api.get<Data>('/api/data');
   } catch (error) {
     if (error instanceof ApiError) {
       // Handle API errors
     } else {
       // Handle unexpected errors
     }
   }
   ```

3. **Use auth token management**:

   ```ts
   // Set token once, use everywhere
   api.setAuthToken(token);
   ```

4. **Leverage request cancellation** for better UX:

   ```ts
   useEffect(() => {
     const controller = new AbortController();

     api.get('/api/data', { signal: controller.signal });

     return () => controller.abort();
   }, []);
   ```
