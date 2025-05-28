# Condominium Service

The Condominium Service manages property listings specifically for condominium properties in the Listd platform. It provides endpoints for creating, retrieving, updating, and deleting condominium listings, with support for advanced filtering, pagination, and user-specific queries. Each condominium record is linked to a property record, and operations are performed using transactions to ensure data consistency.

---

## Endpoints

### **GET** /v1/condominium

Retrieve all condominium listings with support for pagination and filtering.

#### Query Parameters

| Parameter     | Type     | Description                                 | Required |
|---------------|----------|---------------------------------------------|----------|
| page          | number   | Page number (default: 1)                    | No       |
| pageSize      | number   | Number of items per page (default: 10)      | No       |
| search        | string   | Text search across title, description, name | No       |
| minBedrooms   | number   | Minimum number of bedrooms                  | No       |
| maxBedrooms   | number   | Maximum number of bedrooms                  | No       |
| minBathrooms  | number   | Minimum number of bathrooms                 | No       |
| maxBathrooms  | number   | Maximum number of bathrooms                 | No       |
| minFloorArea  | number   | Minimum floor area (sqm)                    | No       |
| maxFloorArea  | number   | Maximum floor area (sqm)                    | No       |
| minPrice      | number   | Minimum price                               | No       |
| maxPrice      | number   | Maximum price                               | No       |
| userId        | string   | Filter by owner user ID                     | No       |
| propertyTypeId| string   | Filter by property type ID                  | No       |
| listingTypeId | string   | Filter by listing type ID (rent/buy)        | No       |
| cityId        | string   | Filter by city ID                           | No       |
| barangayId    | string   | Filter by barangay ID                       | No       |

#### Response

```json
{
  "success": true,
  "data": {
    "condominiums": [
      {
        "id": "uuid",
        "propertyId": "uuid",
        "name": "string",
        "numberOfBedrooms": 2,
        "numberOfBathrooms": 2,
        "floorArea": 75.5,
        "floorLevel": 10,
        "parkingSlots": 1,
        "createdAt": "ISO8601",
        "updatedAt": "ISO8601",
        "property": {
          "id": "uuid",
          "userId": "uuid",
          "propertyTypeId": "uuid",
          "listingTypeId": "uuid",
          "listingTitle": "string",
          "listingDescription": "string",
          "listingPrice": 5000000,
          "listingPriceFormatted": "₱5,000,000",
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

### **GET** /v1/condominium/:id

Retrieve a single condominium listing by its ID with property details.

#### Path Parameters

| Parameter | Type   | Description       | Required |
|-----------|--------|-------------------|----------|
| id        | string | Condominium ID    | Yes      |

#### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "propertyId": "uuid",
    "name": "string",
    "numberOfBedrooms": 2,
    "numberOfBathrooms": 2,
    "floorArea": 75.5,
    "floorLevel": 10,
    "parkingSlots": 1,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601",
    "property": {
      "id": "uuid",
      "userId": "uuid",
      "propertyTypeId": "uuid",
      "listingTypeId": "uuid",
      "listingTitle": "string",
      "listingDescription": "string",
      "listingPrice": 5000000,
      "listingPriceFormatted": "₱5,000,000",
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

### **GET** /v1/condominium/user/:userId

Retrieve all condominium listings for a specific user.

#### Path Parameters

| Parameter | Type   | Description       | Required |
|-----------|--------|-------------------|----------|
| userId    | string | User ID           | Yes      |

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "propertyId": "uuid",
      "name": "string",
      "numberOfBedrooms": 2,
      "numberOfBathrooms": 2,
      "floorArea": 75.5,
      "floorLevel": 10,
      "parkingSlots": 1,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601",
      "property": {
        "id": "uuid",
        "userId": "uuid",
        "propertyTypeId": "uuid",
        "listingTypeId": "uuid",
        "listingTitle": "string",
        "listingDescription": "string",
        "listingPrice": 5000000,
        "listingPriceFormatted": "₱5,000,000",
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

### **POST** /v1/condominium

Create a new condominium listing.

#### Request Body

```json
{
  "propertyData": {
    "userId": "uuid",
    "propertyTypeId": "uuid",
    "listingTypeId": "uuid",
    "listingTitle": "Luxury Condo in BGC",
    "listingDescription": "Beautiful condo with amazing city views",
    "listingPrice": 5000000,
    "listingPriceFormatted": "₱5,000,000",
    "cityId": "uuid",
    "barangayId": "uuid",
    "address": "123 Main Street, BGC, Taguig",
    "longitude": 121.12345,
    "latitude": 14.12345
  },
  "condominiumData": {
    "name": "Park Central Towers",
    "numberOfBedrooms": 2,
    "numberOfBathrooms": 2,
    "floorArea": 75.5,
    "floorLevel": 10,
    "parkingSlots": 1
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
      "listingTitle": "Luxury Condo in BGC",
      "listingDescription": "Beautiful condo with amazing city views",
      "listingPrice": 5000000,
      "listingPriceFormatted": "₱5,000,000",
      "cityId": "uuid",
      "barangayId": "uuid",
      "address": "123 Main Street, BGC, Taguig",
      "longitude": 121.12345,
      "latitude": 14.12345,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    },
    "condominium": {
      "id": "uuid",
      "propertyId": "uuid",
      "name": "Park Central Towers",
      "numberOfBedrooms": 2,
      "numberOfBathrooms": 2,
      "floorArea": 75.5,
      "floorLevel": 10,
      "parkingSlots": 1,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  }
}
```

---

### **PUT** /v1/condominium/:id

Update an existing condominium listing.

#### Path Parameters

| Parameter | Type   | Description       | Required |
|-----------|--------|-------------------|----------|
| id        | string | Condominium ID    | Yes      |

#### Request Body

```json
{
  "propertyData": {
    "listingTitle": "Updated Luxury Condo in BGC",
    "listingPrice": 5500000,
    "listingPriceFormatted": "₱5,500,000"
  },
  "condominiumData": {
    "numberOfBedrooms": 3,
    "parkingSlots": 2
  }
}
```

Note: All fields are optional for updates. Only include the fields you want to modify.

#### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "propertyId": "uuid",
    "name": "Park Central Towers",
    "numberOfBedrooms": 3,
    "numberOfBathrooms": 2,
    "floorArea": 75.5,
    "floorLevel": 10,
    "parkingSlots": 2,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601",
    "property": {
      "id": "uuid",
      "userId": "uuid",
      "propertyTypeId": "uuid",
      "listingTypeId": "uuid",
      "listingTitle": "Updated Luxury Condo in BGC",
      "listingDescription": "Beautiful condo with amazing city views",
      "listingPrice": 5500000,
      "listingPriceFormatted": "₱5,500,000",
      "cityId": "uuid",
      "barangayId": "uuid",
      "address": "123 Main Street, BGC, Taguig",
      "longitude": 121.12345,
      "latitude": 14.12345,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  }
}
```

---

### **DELETE** /v1/condominium/:id

Delete a condominium listing by its ID.

#### Path Parameters

| Parameter | Type   | Description       | Required |
|-----------|--------|-------------------|----------|
| id        | string | Condominium ID    | Yes      |

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
      "listingTitle": "Luxury Condo in BGC",
      "listingDescription": "Beautiful condo with amazing city views",
      "listingPrice": 5500000,
      "listingPriceFormatted": "₱5,500,000",
      "cityId": "uuid",
      "barangayId": "uuid",
      "address": "123 Main Street, BGC, Taguig",
      "longitude": 121.12345,
      "latitude": 14.12345,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    },
    "condominium": {
      "id": "uuid",
      "propertyId": "uuid",
      "name": "Park Central Towers",
      "numberOfBedrooms": 3,
      "numberOfBathrooms": 2,
      "floorArea": 75.5,
      "floorLevel": 10,
      "parkingSlots": 2,
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

- `CONDOMINIUM_NOT_FOUND` (404): Requested condominium listing not found
- `PROPERTY_ID_MISSING` (404): Property ID not found for the condominium
- `PROPERTY_NOT_FOUND` (404): Property details not found
- `VALIDATION_ERROR` (400): Invalid request body or query parameters
- `CREATION_FAILED` (500): Failed to create condominium listing
- `RETRIEVAL_FAILED` (500): Failed to retrieve condominium listing(s)
- `UPDATE_FAILED` (500): Failed to update condominium listing
- `DELETION_FAILED` (500): Failed to delete condominium listing
- `PROPERTY_CREATION_FAILED` (500): Failed to create property record
- `CONDOMINIUM_CREATION_FAILED` (500): Failed to create condominium record
- `PROPERTY_UPDATE_FAILED` (500): Failed to update property record
- `CONDOMINIUM_UPDATE_FAILED` (500): Failed to update condominium record
- `PROPERTY_DELETION_FAILED` (500): Failed to delete property record
- `CONDOMINIUM_DELETION_FAILED` (500): Failed to delete condominium record

---

## Service Responsibilities

The Condominium Service has the following core responsibilities:

1. **CRUD Operations:**
   - Create, read, update, and delete condominium listings
   - Maintain relationships between condominium and property records
   - Handle transactions to ensure data consistency

2. **Advanced Filtering & Search:**
   - Implement text search across listing title, description, and condominium name
   - Support numeric filters for bedrooms, bathrooms, floor area, and price
   - Enable location-based filtering by city and barangay

3. **Pagination:**
   - Implement cursor-based pagination for listing results
   - Provide metadata for client-side navigation (total count, next/prev pages)

4. **Data Validation:**
   - Ensure data integrity through comprehensive schema validation
   - Enforce referential integrity between property and condominium records

5. **Error Handling:**
   - Provide clear, consistent error responses
   - Implement robust transaction rollbacks in case of failures
   - Log errors for monitoring and debugging

---

## Example Requests

### Create a New Condominium Listing

```http
POST /v1/condominium HTTP/1.1
Content-Type: application/json

{
  "propertyData": {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "propertyTypeId": "123e4567-e89b-12d3-a456-426614174001",
    "listingTypeId": "123e4567-e89b-12d3-a456-426614174002",
    "listingTitle": "Modern 2BR Condo with Parking in BGC",
    "listingDescription": "Fully-furnished unit with amazing views of the city skyline",
    "listingPrice": 8500000,
    "listingPriceFormatted": "₱8,500,000",
    "cityId": "123e4567-e89b-12d3-a456-426614174003",
    "barangayId": "123e4567-e89b-12d3-a456-426614174004",
    "address": "One Serendra, BGC, Taguig",
    "longitude": 121.046912,
    "latitude": 14.553256
  },
  "condominiumData": {
    "name": "One Serendra",
    "numberOfBedrooms": 2,
    "numberOfBathrooms": 2,
    "floorArea": 87.5,
    "floorLevel": 15,
    "parkingSlots": 1
  }
}
```

### Search for Condominiums with Filters

```http
GET /v1/condominium?minBedrooms=2&maxPrice=10000000&cityId=123e4567-e89b-12d3-a456-426614174003&page=1&pageSize=20 HTTP/1.1
```
