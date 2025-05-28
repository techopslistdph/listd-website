# PSgc Service API Documentation

## Overview
The PSgc service provides CRUD operations for Philippine Standard Geographic Code (PSGC) entities: **City** and **Barangay**. It exposes RESTful endpoints for managing these entities, including creation, retrieval, updating, and deletion.

Base path: `/api/v1/listd-psgc`

---

## City Endpoints

### List Cities
- **GET** `/api/v1/listd-psgc/city`
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "psgcCode": "string",
      "correspondenceCode": "string | null",
      "incomeClassification": "string | null",
      "population": 12345,
      "censusYear": 2020,
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ],
  "totalCount": 100,
  "totalPages": 10,
  "currentPage": 1,
  "nextPage": 2
}
```
- **Pagination Fields:**
  - `totalCount`: Total number of cities matching the search criteria.
  - `totalPages`: Total number of pages available.
  - `currentPage`: The current page number.
  - `nextPage`: The next page number, or `null` if on the last page.

### Get City by ID
- **GET** `/api/v1/listd-psgc/city/:id`

### Create City
- **POST** `/api/v1/listd-psgc/city`
- **Body:**
```json
{
  "name": "string",
  "psgcCode": "string",
  "correspondenceCode": "string (optional)",
  "incomeClassification": "string (optional)",
  "population": 12345,
  "censusYear": 2020
}
```

### Update City
- **PUT** `/api/v1/listd-psgc/city/:id`
- **Body:** (same as Create)

### Delete City
- **DELETE** `/api/v1/listd-psgc/city/:id`

---

## Barangay Endpoints

### List Barangays
- **GET** `/api/v1/listd-psgc/barangay`
- **Query Parameters:**
  - `search` (string, optional): Search term for barangay name (full-text search).
  - `cityPsgcCode` (string, optional): Filter barangays by their city PSGC code.
  - `page` (number, optional): Page number for pagination (default: 1).
  - `pageSize` (number, optional): Number of results per page (default: 20).
- **Example Request:**
```
GET /api/v1/listd-psgc/barangay?cityPsgcCode=048101000&page=1&pageSize=10
```
- **Response:**
```json
{
  "success": true,
  "data": {
    "barangays": [
      {
        "id": "uuid",
        "name": "string",
        "psgcCode": "string",
        "cityPsgcCode": "string",
        "correspondenceCode": "string | null",
        "urbanRural": "string | null",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    ],
    "totalCount": 100,
    "totalPages": 10,
    "currentPage": 1,
    "nextPage": 2
  }
}
```
- **Pagination Fields:**
  - `totalCount`: Total number of barangays matching the search criteria.
  - `totalPages`: Total number of pages available.
  - `currentPage`: The current page number.
  - `nextPage`: The next page number, or `null` if on the last page.

### Get Barangay by ID
- **GET** `/api/v1/listd-psgc/barangay/:id`

### Create Barangay
- **POST** `/api/v1/listd-psgc/barangay`
- **Body:**
```json
{
  "name": "string",
  "psgcCode": "string",
  "cityPsgcCode": "string",
  "correspondenceCode": "string (optional)",
  "urbanRural": "string (optional)"
}
```

### Update Barangay
- **PUT** `/api/v1/listd-psgc/barangay/:id`
- **Body:** (same as Create)

### Delete Barangay
- **DELETE** `/api/v1/listd-psgc/barangay/:id`

---

## Common Response Format
All endpoints return:
```json
{
  "success": true,
  "data": ...
}
```

## Notes
- All POST/PUT requests require JSON bodies matching the schemas above.
- All endpoints return 404 if the resource is not found.
- Validation errors return 400 with details.

---

For more details, see the service implementation in `src/services/listd-psgc/` and the route definitions in `src/routes/v1/listd-psgc.ts`.
