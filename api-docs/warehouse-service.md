# Warehouse Service

The Warehouse Service manages property listings specifically for warehouse properties in the Listd platform. It provides endpoints for creating, retrieving, updating, and deleting warehouse listings, with support for advanced filtering, pagination, and user-specific queries. Each warehouse record is linked to a property record, and operations are performed using transactions to ensure data consistency.

---

## Endpoints

### **GET** /v1/warehouse

Retrieve all warehouse listings with support for pagination and filtering.

#### Query Parameters

| Parameter         | Type     | Description                                 | Required |
|-------------------|----------|---------------------------------------------|----------|
| page              | number   | Page number (default: 1)                    | No       |
| pageSize          | number   | Number of items per page (default: 10)      | No       |
| search            | string   | Text search across title, description, name | No       |
| minBuildingSize   | number   | Minimum building size (sqm)                 | No       |
| maxBuildingSize   | number   | Maximum building size (sqm)                 | No       |
| minLandSize       | number   | Minimum land size (sqm)                     | No       |
| maxLandSize       | number   | Maximum land size (sqm)                     | No       |
| minOffices        | number   | Minimum number of offices                   | No       |
| maxOffices        | number   | Maximum number of offices                   | No       |
| minBathrooms      | number   | Minimum number of bathrooms                 | No       |
| maxBathrooms      | number   | Maximum number of bathrooms                 | No       |
| minCeilingHeight  | number   | Minimum ceiling height (m)                  | No       |
| maxCeilingHeight  | number   | Maximum ceiling height (m)                  | No       |
| minLoadingDocks   | number   | Minimum number of loading docks             | No       |
| maxLoadingDocks   | number   | Maximum number of loading docks             | No       |
| hasLoadingBay     | string   | "true" or "false"                           | No       |
| hasRollingDoor    | string   | "true" or "false"                           | No       |
| hasParkingArea    | string   | "true" or "false"                           | No       |
| hasFireSprinklers | string   | "true" or "false"                           | No       |
| hasSecuritySystem | string   | "true" or "false"                           | No       |
| minPrice          | number   | Minimum price                               | No       |
| maxPrice          | number   | Maximum price                               | No       |
| userId            | string   | Filter by owner user ID                     | No       |
| propertyTypeId    | string   | Filter by property type ID                  | No       |
| listingTypeId     | string   | Filter by listing type ID (rent/buy)        | No       |
| cityId            | string   | Filter by city ID                           | No       |
| barangayId        | string   | Filter by barangay ID                       | No       |

#### Response

```json
{
  "success": true,
  "data": {
    "warehouses": [
      {
        "id": "uuid",
        "propertyId": "uuid",
        "name": "string",
        "buildingSize": 1000,
        "landSize": 2500,
        "numberOfOffices": 3,
        "numberOfBathrooms": 2,
        "ceilingHeight": 6.5,
        "loadingDocks": 2,
        "yearBuilt": 2015,
        "hasLoadingBay": true,
        "hasRollingDoor": true,
        "hasParkingArea": true,
        "hasFireSprinklers": true,
        "hasSecuritySystem": true,
        "createdAt": "ISO8601",
        "updatedAt": "ISO8601",
        "property": {
          "id": "uuid",
          "userId": "uuid",
          "propertyTypeId": "uuid",
          "listingTypeId": "uuid",
          "listingTitle": "string",
          "listingDescription": "string",
          "listingPrice": 15000000,
          "listingPriceFormatted": "₱15,000,000",
          "cityId": "uuid",
          "barangayId": "uuid",
          "address": "string",
          "longitude": 121.12345,
          "latitude": 14.12345,
          "createdAt": "ISO8601",
          "updatedAt": "ISO8601"
        }
      }
    ],
    "totalCount": 42,
    "totalPages": 5,
    "currentPage": 1,
    "nextPage": 2,
    "prevPage": null,
    "pageSize": 10
  }
}
```

---

### **GET** /v1/warehouse/:id

Retrieve a single warehouse listing by its ID with property details.

#### Path Parameters

| Parameter | Type   | Description     | Required |
|-----------|--------|-----------------|----------|
| id        | string | Warehouse ID    | Yes      |

#### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "propertyId": "uuid",
    "name": "string",
    "buildingSize": 1000,
    "landSize": 2500,
    "numberOfOffices": 3,
    "numberOfBathrooms": 2,
    "ceilingHeight": 6.5,
    "loadingDocks": 2,
    "yearBuilt": 2015,
    "hasLoadingBay": true,
    "hasRollingDoor": true,
    "hasParkingArea": true,
    "hasFireSprinklers": true,
    "hasSecuritySystem": true,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601",
    "property": {
      "id": "uuid",
      "userId": "uuid",
      "propertyTypeId": "uuid",
      "listingTypeId": "uuid",
      "listingTitle": "string",
      "listingDescription": "string",
      "listingPrice": 15000000,
      "listingPriceFormatted": "₱15,000,000",
      "cityId": "uuid",
      "barangayId": "uuid",
      "address": "string",
      "longitude": 121.12345,
      "latitude": 14.12345,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  }
}
```

---

### **GET** /v1/warehouse/user/:userId

Retrieve all warehouse listings for a specific user.

#### Path Parameters

| Parameter | Type   | Description | Required |
|-----------|--------|-------------|----------|
| userId    | string | User ID     | Yes      |

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "propertyId": "uuid",
      "name": "string",
      "buildingSize": 1000,
      "landSize": 2500,
      "numberOfOffices": 3,
      "numberOfBathrooms": 2,
      "ceilingHeight": 6.5,
      "loadingDocks": 2,
      "yearBuilt": 2015,
      "hasLoadingBay": true,
      "hasRollingDoor": true,
      "hasParkingArea": true,
      "hasFireSprinklers": true,
      "hasSecuritySystem": true,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601",
      "property": {
        "id": "uuid",
        "userId": "uuid",
        "propertyTypeId": "uuid",
        "listingTypeId": "uuid",
        "listingTitle": "string",
        "listingDescription": "string",
        "listingPrice": 15000000,
        "listingPriceFormatted": "₱15,000,000",
        "cityId": "uuid",
        "barangayId": "uuid",
        "address": "string",
        "longitude": 121.12345,
        "latitude": 14.12345,
        "createdAt": "ISO8601",
        "updatedAt": "ISO8601"
      }
    }
  ]
}
```

---

### **POST** /v1/warehouse

Create a new warehouse listing.

#### Request Body

```json
{
  "propertyData": {
    "userId": "uuid",
    "propertyTypeId": "uuid",
    "listingTypeId": "uuid",
    "listingTitle": "Industrial Warehouse with Office Space",
    "listingDescription": "Modern warehouse facility with loading bays and office space",
    "listingPrice": 15000000,
    "listingPriceFormatted": "₱15,000,000",
    "cityId": "uuid",
    "barangayId": "uuid",
    "address": "123 Industrial Avenue, Cavite",
    "longitude": 121.12345,
    "latitude": 14.12345
  },
  "warehouseData": {
    "name": "Premium Industrial Facility",
    "buildingSize": 1000,
    "landSize": 2500,
    "numberOfOffices": 3,
    "numberOfBathrooms": 2,
    "ceilingHeight": 6.5,
    "loadingDocks": 2,
    "yearBuilt": 2015,
    "hasLoadingBay": true,
    "hasRollingDoor": true,
    "hasParkingArea": true,
    "hasFireSprinklers": true,
    "hasSecuritySystem": true
  }
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "property": {
      "id": "uuid",
      "userId": "uuid",
      "propertyTypeId": "uuid",
      "listingTypeId": "uuid",
      "listingTitle": "Industrial Warehouse with Office Space",
      "listingDescription": "Modern warehouse facility with loading bays and office space",
      "listingPrice": 15000000,
      "listingPriceFormatted": "₱15,000,000",
      "cityId": "uuid",
      "barangayId": "uuid",
      "address": "123 Industrial Avenue, Cavite",
      "longitude": 121.12345,
      "latitude": 14.12345,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    },
    "warehouse": {
      "id": "uuid",
      "propertyId": "uuid",
      "name": "Premium Industrial Facility",
      "buildingSize": 1000,
      "landSize": 2500,
      "numberOfOffices": 3,
      "numberOfBathrooms": 2,
      "ceilingHeight": 6.5,
      "loadingDocks": 2,
      "yearBuilt": 2015,
      "hasLoadingBay": true,
      "hasRollingDoor": true,
      "hasParkingArea": true,
      "hasFireSprinklers": true,
      "hasSecuritySystem": true,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  }
}
```

---

### **PUT** /v1/warehouse/:id

Update an existing warehouse listing.

#### Path Parameters

| Parameter | Type   | Description    | Required |
|-----------|--------|----------------|----------|
| id        | string | Warehouse ID   | Yes      |

#### Request Body

```json
{
  "propertyData": {
    "listingTitle": "Updated Industrial Warehouse with Office Space",
    "listingPrice": 16500000,
    "listingPriceFormatted": "₱16,500,000"
  },
  "warehouseData": {
    "ceilingHeight": 7.0,
    "loadingDocks": 3,
    "hasSecuritySystem": true
  }
}
```

Note: All fields are optional for updates. Only include the fields you want to modify. Either `propertyData` or `warehouseData` (or both) must be provided.

#### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "propertyId": "uuid",
    "name": "Premium Industrial Facility",
    "buildingSize": 1000,
    "landSize": 2500,
    "numberOfOffices": 3,
    "numberOfBathrooms": 2,
    "ceilingHeight": 7.0,
    "loadingDocks": 3,
    "yearBuilt": 2015,
    "hasLoadingBay": true,
    "hasRollingDoor": true,
    "hasParkingArea": true,
    "hasFireSprinklers": true,
    "hasSecuritySystem": true,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601",
    "property": {
      "id": "uuid",
      "userId": "uuid",
      "propertyTypeId": "uuid",
      "listingTypeId": "uuid",
      "listingTitle": "Updated Industrial Warehouse with Office Space",
      "listingDescription": "Modern warehouse facility with loading bays and office space",
      "listingPrice": 16500000,
      "listingPriceFormatted": "₱16,500,000",
      "cityId": "uuid",
      "barangayId": "uuid",
      "address": "123 Industrial Avenue, Cavite",
      "longitude": 121.12345,
      "latitude": 14.12345,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  }
}
```

---

### **DELETE** /v1/warehouse/:id

Delete a warehouse listing by its ID.

#### Path Parameters

| Parameter | Type   | Description    | Required |
|-----------|--------|----------------|----------|
| id        | string | Warehouse ID   | Yes      |

#### Response

```json
{
  "success": true,
  "data": {
    "property": {
      "id": "uuid",
      "userId": "uuid",
      "propertyTypeId": "uuid",
      "listingTypeId": "uuid",
      "listingTitle": "Updated Industrial Warehouse with Office Space",
      "listingDescription": "Modern warehouse facility with loading bays and office space",
      "listingPrice": 16500000,
      "listingPriceFormatted": "₱16,500,000",
      "cityId": "uuid",
      "barangayId": "uuid",
      "address": "123 Industrial Avenue, Cavite",
      "longitude": 121.12345,
      "latitude": 14.12345,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    },
    "warehouse": {
      "id": "uuid",
      "propertyId": "uuid",
      "name": "Premium Industrial Facility",
      "buildingSize": 1000,
      "landSize": 2500,
      "numberOfOffices": 3,
      "numberOfBathrooms": 2,
      "ceilingHeight": 7.0,
      "loadingDocks": 3,
      "yearBuilt": 2015,
      "hasLoadingBay": true,
      "hasRollingDoor": true,
      "hasParkingArea": true,
      "hasFireSprinklers": true,
      "hasSecuritySystem": true,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  }
}
```

---

## Error Handling

All errors are returned in a consistent structure:

```json
{
  "success": false,
  "error": "Error message",
  "meta": {
    "code": "ERROR_CODE"
  }
}
```

### Common Error Codes

- `WAREHOUSE_NOT_FOUND` (404): Requested warehouse listing not found
- `PROPERTY_ID_MISSING` (404): Property ID not found for the warehouse
- `PROPERTY_NOT_FOUND` (404): Property details not found
- `VALIDATION_ERROR` (400): Invalid request body or query parameters
- `CREATION_FAILED` (500): Failed to create warehouse listing
- `RETRIEVAL_FAILED` (500): Failed to retrieve warehouse listing(s)
- `UPDATE_FAILED` (500): Failed to update warehouse listing
- `DELETION_FAILED` (500): Failed to delete warehouse listing
- `PROPERTY_CREATION_FAILED` (500): Failed to create property record
- `WAREHOUSE_CREATION_FAILED` (500): Failed to create warehouse record
- `PROPERTY_UPDATE_FAILED` (500): Failed to update property record
- `WAREHOUSE_UPDATE_FAILED` (500): Failed to update warehouse record
- `PROPERTY_DELETION_FAILED` (500): Failed to delete property record
- `WAREHOUSE_DELETION_FAILED` (500): Failed to delete warehouse record

---

## Service Responsibilities

The Warehouse Service has the following core responsibilities:

1. **CRUD Operations:**
   - Create, read, update, and delete warehouse listings
   - Maintain relationships between warehouse and property records
   - Handle transactions to ensure data consistency

2. **Advanced Filtering & Search:**
   - Implement text search across listing title, description, and warehouse name
   - Support numeric filters for building size, land size, and price
   - Support boolean filters for features (loading bay, rolling door, etc.)
   - Enable location-based filtering by city and barangay

3. **Pagination:**
   - Implement pagination for listing results
   - Provide metadata for client-side navigation (total count, next/prev pages)

4. **Data Validation:**
   - Ensure data integrity through comprehensive schema validation
   - Enforce referential integrity between property and warehouse records

5. **Error Handling:**
   - Provide clear, consistent error responses
   - Implement robust transaction rollbacks in case of failures
   - Log errors for monitoring and debugging

---

## Example Requests

### Create a New Warehouse Listing

```http
POST /v1/warehouse HTTP/1.1
Content-Type: application/json

{
  "propertyData": {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "propertyTypeId": "123e4567-e89b-12d3-a456-426614174001",
    "listingTypeId": "123e4567-e89b-12d3-a456-426614174002",
    "listingTitle": "Industrial Warehouse with Offices in Laguna",
    "listingDescription": "Modern warehouse with high ceilings, loading bays, and 3 office spaces. Perfect for logistics and distribution businesses.",
    "listingPrice": 18500000,
    "listingPriceFormatted": "₱18,500,000",
    "cityId": "123e4567-e89b-12d3-a456-426614174003",
    "barangayId": "123e4567-e89b-12d3-a456-426614174004",
    "address": "Laguna Technopark, Biñan, Laguna",
    "longitude": 121.046912,
    "latitude": 14.553256
  },
  "warehouseData": {
    "name": "Laguna Technopark Warehouse",
    "buildingSize": 1500,
    "landSize": 3200,
    "numberOfOffices": 3,
    "numberOfBathrooms": 4,
    "ceilingHeight": 8.5,
    "loadingDocks": 4,
    "yearBuilt": 2018,
    "hasLoadingBay": true,
    "hasRollingDoor": true,
    "hasParkingArea": true,
    "hasFireSprinklers": true,
    "hasSecuritySystem": true
  }
}
```

### Search for Warehouses with Filters

```http
GET /v1/warehouse?minBuildingSize=1000&hasLoadingBay=true&cityId=123e4567-e89b-12d3-a456-426614174003&page=1&pageSize=20 HTTP/1.1
```
