# Listd Amenity Service & API Documentation

This document describes the API endpoints and service logic for the `amenity` resource in the Listd backend. It follows the project conventions for route/service separation, validation, and error handling.

---

## Endpoints

### 1. List Amenities (Paginated, Searchable)
- **GET** `/v1/amenities`
- **Query Parameters:**
  - `page` (integer, default: 1): Page number (min 1)
  - `pageSize` (integer, default: 20, max: 100): Results per page
  - `search` (string, optional): Full-text search on amenity name
- **Validation:**
  - Uses Zod schema: `amenitySearchParamSchema`
- **Response:**
  ```json
  {
    "success": true,
    "amenities": [
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

### 2. Get Amenity by ID
- **GET** `/v1/amenities/:id`
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

### 3. Create Amenity
- **POST** `/v1/amenities`
- **Body:**
  - `name` (string, required)
  - `description` (string, optional)
- **Validation:**
  - Uses Zod schema: `createAmenitySchema`
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

### 4. Update Amenity
- **PUT** `/v1/amenities/:id`
- **Path Parameter:**
  - `id` (uuid, required)
- **Body:**
  - Any subset of fields from `createAmenitySchema` (all optional)
- **Validation:**
  - Uses Zod schema: `createAmenitySchema.partial()`
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

### 5. Delete Amenity
- **DELETE** `/v1/amenities/:id`
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

### Amenity Object
- `id`: string (uuid)
- `name`: string
- `description`: string | null
- `createdAt`: string (ISO8601 date)
- `updatedAt`: string (ISO8601 date)

### Create Amenity Input
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
    "error": "Amenity not found",
    "code": "AMENITY_NOT_FOUND"
  }
  ```
- Common error codes:
  - `AMENITY_NOT_FOUND`: Amenity with given ID does not exist
  - `CREATE_AMENITY_ERROR`, `UPDATE_AMENITY_ERROR`, `DELETE_AMENITY_ERROR`, `GET_AMENITY_BY_ID_ERROR`: Internal errors

---

## Service Responsibilities
- All business logic and DB access are in `src/services/listd-amenity/`.
- All Zod validation schemas are in `src/services/listd-amenity/schema.ts`.
- The service expects already-validated data.
- Uses `tryCatch` utility for DB operations and throws `ApiError` for all errors.

---

## Example Requests

### Create Amenity
```http
POST /v1/amenities
Content-Type: application/json

{
  "name": "Gym",
  "description": "A fully equipped fitness center."
}
```

### Paginated List
```http
GET /v1/amenities?page=1&pageSize=10&search=gym
```

### Update Amenity
```http
PUT /v1/amenities/uuid-1234
Content-Type: application/json

{
  "description": "Updated description."
}
```

---

For further details, see the source code in `src/routes/v1/listd-amenity.ts` and `src/services/listd-amenity/`.
