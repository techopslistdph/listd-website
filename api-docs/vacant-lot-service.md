# Vacant Lot Service

The Vacant Lot Service manages property listings specifically for vacant lot properties in the Listd platform. It provides endpoints for creating, retrieving, updating, and deleting vacant lot listings, with support for advanced filtering, pagination, and user-specific queries. Each vacant lot record is linked to a property record, and operations are performed using transactions to ensure data consistency.

---

## Endpoints

### **GET** /v1/vacant-lot

Retrieve all vacant lot listings with support for pagination and filtering.

#### Query Parameters

| Parameter         | Type     | Description                                 | Required |
|-------------------|----------|---------------------------------------------|----------|
| page              | number   | Page number (default: 1)                    | No       |
| pageSize          | number   | Number of items per page (default: 10)      | No       |
| search            | string   | Text search across title and description    | No       |
| minLotSize        | number   | Minimum lot size (sqm)                      | No       |
| maxLotSize        | number   | Maximum lot size (sqm)                      | No       |
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
    "vacantLots": [
      {
        "id": "uuid",
        "propertyId": "uuid",
        "lotSize": 500.5,
        "createdAt": "ISO8601",
        "updatedAt": "ISO8601",
        "property": {
          "id": "uuid",
          "userId": "uuid",
          "propertyTypeId": "uuid",
          "listingTypeId": "uuid",
          "listingTitle": "string",
          "listingDescription": "string",
          "listingPrice": 10000000,
          "listingPriceFormatted": "₱10,000,000",
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

### **GET** /v1/vacant-lot/:id

Retrieve a single vacant lot listing by its ID with property details.

#### Path Parameters

| Parameter | Type   | Description       | Required |
|-----------|--------|-------------------|----------|
| id        | string | Vacant Lot ID     | Yes      |

#### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "propertyId": "uuid",
    "lotSize": 500.5,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601",
    "property": {
      "id": "uuid",
      "userId": "uuid",
      "propertyTypeId": "uuid",
      "listingTypeId": "uuid",
      "listingTitle": "string",
      "listingDescription": "string",
      "listingPrice": 10000000,
      "listingPriceFormatted": "₱10,000,000",
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

### **GET** /v1/vacant-lot/user/:userId

Retrieve all vacant lot listings for a specific user.

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
      "lotSize": 500.5,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601",
      "property": {
        "id": "uuid",
        "userId": "uuid",
        "propertyTypeId": "uuid",
        "listingTypeId": "uuid",
        "listingTitle": "string",
        "listingDescription": "string",
        "listingPrice": 10000000,
        "listingPriceFormatted": "₱10,000,000",
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

### **POST** /v1/vacant-lot

Create a new vacant lot listing.

#### Request Body

```json
{
  "propertyData": {
    "userId": "uuid",
    "propertyTypeId": "uuid",
    "listingTypeId": "uuid",
    "listingTitle": "Premium Vacant Lot in Forbes Park",
    "listingDescription": "Spacious corner lot in an exclusive neighborhood",
    "listingPrice": 50000000,
    "listingPriceFormatted": "₱50,000,000",
    "cityId": "uuid",
    "barangayId": "uuid",
    "address": "123 Forbes Park Avenue, Makati City",
    "longitude": 121.12345,
    "latitude": 14.12345
  },
  "vacantLotData": {
    "lotSize": 500.5
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
      "listingTitle": "Premium Vacant Lot in Forbes Park",
      "listingDescription": "Spacious corner lot in an exclusive neighborhood",
      "listingPrice": 50000000,
      "listingPriceFormatted": "₱50,000,000",
      "cityId": "uuid",
      "barangayId": "uuid",
      "address": "123 Forbes Park Avenue, Makati City",
      "longitude": 121.12345,
      "latitude": 14.12345,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    },
    "vacantLot": {
      "id": "uuid",
      "propertyId": "uuid",
      "lotSize": 500.5,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  }
}
```

---

### **PUT** /v1/vacant-lot/:id

Update an existing vacant lot listing.

#### Path Parameters

| Parameter | Type   | Description      | Required |
|-----------|--------|------------------|----------|
| id        | string | Vacant Lot ID    | Yes      |

#### Request Body

```json
{
  "propertyData": {
    "listingTitle": "Updated Premium Vacant Lot in Forbes Park",
    "listingPrice": 55000000,
    "listingPriceFormatted": "₱55,000,000"
  },
  "vacantLotData": {
    "lotSize": 550.5
  }
}
```

Note: All fields are optional for updates. Only include the fields you want to modify. Either `propertyData` or `vacantLotData` (or both) must be provided.

#### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "propertyId": "uuid",
    "lotSize": 550.5,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601",
    "property": {
      "id": "uuid",
      "userId": "uuid",
      "propertyTypeId": "uuid",
      "listingTypeId": "uuid",
      "listingTitle": "Updated Premium Vacant Lot in Forbes Park",
      "listingDescription": "Spacious corner lot in an exclusive neighborhood",
      "listingPrice": 55000000,
      "listingPriceFormatted": "₱55,000,000",
      "cityId": "uuid",
      "barangayId": "uuid",
      "address": "123 Forbes Park Avenue, Makati City",
      "longitude": 121.12345,
      "latitude": 14.12345,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  }
}
```

---

### **DELETE** /v1/vacant-lot/:id

Delete a vacant lot listing by its ID.

#### Path Parameters

| Parameter | Type   | Description      | Required |
|-----------|--------|------------------|----------|
| id        | string | Vacant Lot ID    | Yes      |

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
      "listingTitle": "Updated Premium Vacant Lot in Forbes Park",
      "listingDescription": "Spacious corner lot in an exclusive neighborhood",
      "listingPrice": 55000000,
      "listingPriceFormatted": "₱55,000,000",
      "cityId": "uuid",
      "barangayId": "uuid",
      "address": "123 Forbes Park Avenue, Makati City",
      "longitude": 121.12345,
      "latitude": 14.12345,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    },
    "vacantLot": {
      "id": "uuid",
      "propertyId": "uuid",
      "lotSize": 550.5,
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

- `VACANT_LOT_NOT_FOUND` (404): Requested vacant lot listing not found
- `PROPERTY_ID_MISSING` (404): Property ID not found for the vacant lot
- `PROPERTY_NOT_FOUND` (404): Property details not found
- `VALIDATION_ERROR` (400): Invalid request body or query parameters
- `CREATION_FAILED` (500): Failed to create vacant lot listing
- `RETRIEVAL_FAILED` (500): Failed to retrieve vacant lot listing(s)
- `UPDATE_FAILED` (500): Failed to update vacant lot listing
- `DELETION_FAILED` (500): Failed to delete vacant lot listing
- `PROPERTY_CREATION_FAILED` (500): Failed to create property record
- `VACANT_LOT_CREATION_FAILED` (500): Failed to create vacant lot record
- `PROPERTY_UPDATE_FAILED` (500): Failed to update property record
- `VACANT_LOT_UPDATE_FAILED` (500): Failed to update vacant lot record
- `PROPERTY_DELETION_FAILED` (500): Failed to delete property record
- `VACANT_LOT_DELETION_FAILED` (500): Failed to delete vacant lot record
- `COUNT_FAILED` (500): Failed to count vacant lot listings

---

## Service Responsibilities

The Vacant Lot Service has the following core responsibilities:

1. **CRUD Operations:**
   - Create, read, update, and delete vacant lot listings
   - Maintain relationships between vacant lot and property records
   - Handle transactions to ensure data consistency

2. **Advanced Filtering & Search:**
   - Implement text search across listing title and description
   - Support numeric filters for lot size and price
   - Enable location-based filtering by city and barangay

3. **Pagination:**
   - Implement pagination for listing results
   - Provide metadata for client-side navigation (total count, next/prev pages)

4. **Data Validation:**
   - Ensure data integrity through comprehensive schema validation
   - Enforce referential integrity between property and vacant lot records

5. **Error Handling:**
   - Provide clear, consistent error responses
   - Implement robust transaction rollbacks in case of failures
   - Log errors for monitoring and debugging

---

## Example Requests

### Create a New Vacant Lot Listing

```http
POST /v1/vacant-lot HTTP/1.1
Content-Type: application/json

{
  "propertyData": {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "propertyTypeId": "123e4567-e89b-12d3-a456-426614174001",
    "listingTypeId": "123e4567-e89b-12d3-a456-426614174002",
    "listingTitle": "Commercial Vacant Lot in BGC",
    "listingDescription": "Prime commercial lot in Bonifacio Global City, ideal for mixed-use development. Near corporate headquarters and high-end residential buildings.",
    "listingPrice": 120000000,
    "listingPriceFormatted": "₱120,000,000",
    "cityId": "123e4567-e89b-12d3-a456-426614174003",
    "barangayId": "123e4567-e89b-12d3-a456-426614174004",
    "address": "5th Avenue corner 32nd Street, Bonifacio Global City, Taguig",
    "longitude": 121.045623,
    "latitude": 14.553472
  },
  "vacantLotData": {
    "lotSize": 1200.75
  }
}
```

### Search for Vacant Lots with Filters

```http
GET /v1/vacant-lot?minLotSize=500&maxPrice=100000000&cityId=123e4567-e89b-12d3-a456-426614174003&page=1&pageSize=20 HTTP/1.1
```
