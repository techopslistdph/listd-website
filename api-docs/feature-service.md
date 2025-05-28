# Listd Feature Service & API Documentation

This document describes the API endpoints and service logic for the `feature` resource in the Listd backend. It follows the project conventions for route/service separation, validation, and error handling.

---

## Endpoints

### 1. List Features (Paginated, Searchable)
- **GET** `/v1/features`
- **Query Parameters:**
  - `page` (integer, default: 1): Page number (min 1)
  - `pageSize` (integer, default: 20, max: 100): Results per page
  - `search` (string, optional): Full-text search on feature name
- **Validation:**
  - Uses Zod schema: `featureSearchParamSchema`
- **Response:**
  ```json
  {
    "success": true,
    "features": [
      {
        "id": "uuid",
        "name": "string",
        "description": "string or null",
        "createdAt": "ISO8601",
        "updatedAt": "ISO8601"
      }
    ],
    "totalCount": 42,
    "totalPages": 3,
    "currentPage": 1,
    "nextPage": 2
  }
  ```

### 2. Get Feature by ID
- **GET** `/v1/features/:id`
- **Path Parameter:**
  - `id` (uuid, required)
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "name": "string",
      "description": "string or null",
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  }
  ```

### 3. Create Feature
- **POST** `/v1/features`
- **Body:**
  - `name` (string, required)
  - `description` (string, optional)
- **Validation:**
  - Uses Zod schema: `createFeatureSchema`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "name": "string",
      "description": "string or null",
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  }
  ```

### 4. Update Feature
- **PUT** `/v1/features/:id`
- **Path Parameter:**
  - `id` (uuid, required)
- **Body:**
  - Any subset of fields from `createFeatureSchema` (all optional)
- **Validation:**
  - Uses Zod schema: `createFeatureSchema.partial()`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "name": "string",
      "description": "string or null",
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  }
  ```

### 5. Delete Feature
- **DELETE** `/v1/features/:id`
- **Path Parameter:**
  - `id` (uuid, required)
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "name": "string",
      "description": "string or null",
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  }
  ```

---

## Request & Response Schemas

### Feature Object
- `id`: string (uuid)
- `name`: string
- `description`: string | null
- `createdAt`: string (ISO8601 date)
- `updatedAt`: string (ISO8601 date)

### Create Feature Input
- `name`: string (required)
- `description`: string (optional)

### Pagination
- `page`: integer (default 1)
- `pageSize`: integer (default 20, max 100)
- `search`: string (optional)

---

## Error Handling
- All errors are thrown as `ApiError` in the service layer.
- Errors propagate to the global error handler (not handled in the route file).
- Example error response:
  ```json
  {
    "success": false,
    "error": "Feature not found",
    "code": "FEATURE_NOT_FOUND"
  }
  ```
- Common error codes:
  - `FEATURE_NOT_FOUND`: Feature with given ID does not exist
  - `CREATE_FEATURE_ERROR`, `UPDATE_FEATURE_ERROR`, `DELETE_FEATURE_ERROR`, `GET_FEATURE_BY_ID_ERROR`: Internal errors

---

## Service Responsibilities
- All business logic and DB access are in `src/services/listd-feature/`.
- All Zod validation schemas are in `src/services/listd-feature/schema.ts`.
- The service expects already-validated data.
- Uses `tryCatch` utility for DB operations and throws `ApiError` for all errors.

---

## Example Requests

### Create Feature
```http
POST /v1/features
Content-Type: application/json

{
  "name": "Swimming Pool",
  "description": "A large outdoor pool."
}
```

### Paginated List
```http
GET /v1/features?page=1&pageSize=10&search=pool
```

### Update Feature
```http
PUT /v1/features/uuid-1234
Content-Type: application/json

{
  "description": "Updated description."
}
```

---

For further details, see the source code in `src/routes/v1/listd-feature.ts` and `src/services/listd-feature/`.
