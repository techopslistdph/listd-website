# House and Lot Service

The House and Lot Service manages property listings specifically for residential house and lot properties in the Listd platform. It provides endpoints for creating, retrieving, updating, and deleting house and lot listings, with support for advanced filtering, pagination, and user-specific queries. Each house and lot record is linked to a property record, and operations are performed using transactions to ensure data consistency.

---

## Endpoints

### **GET** /v1/house-and-lot

Retrieve all house and lot listings with support for pagination and filtering.

#### Query Parameters

| Parameter         | Type     | Description                                 | Required |
|-------------------|----------|---------------------------------------------|----------|
| page              | number   | Page number (default: 1)                    | No       |
| pageSize          | number   | Number of items per page (default: 10)      | No       |
| search            | string   | Text search across title, description, name | No       |
| minLotSize        | number   | Minimum lot size (sqm)                      | No       |
| maxLotSize        | number   | Maximum lot size (sqm)                      | No       |
| minFloorArea      | number   | Minimum floor area (sqm)                    | No       |
| maxFloorArea      | number   | Maximum floor area (sqm)                    | No       |
| minBedrooms       | number   | Minimum number of bedrooms                  | No       |
| maxBedrooms       | number   | Maximum number of bedrooms                  | No       |
| minBathrooms      | number   | Minimum number of bathrooms                 | No       |
| maxBathrooms      | number   | Maximum number of bathrooms                 | No       |
| minFloors         | number   | Minimum number of floors                    | No       |
| maxFloors         | number   | Maximum number of floors                    | No       |
| hasSwimmingPool   | string   | "true" or "false"                           | No       |
| hasGarden         | string   | "true" or "false"                           | No       |
| hasTerrace        | string   | "true" or "false"                           | No       |
| hasBalcony        | string   | "true" or "false"                           | No       |
| hasSecurity       | string   | "true" or "false"                           | No       |
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
    "houseAndLots": [
      {
        "id": "uuid",
        "propertyId": "uuid",
        "name": "string",
        "lotSize": 300.5,
        "floorArea": 150.75,
        "numberOfBedrooms": 4,
        "numberOfBathrooms": 3,
        "numberOfFloors": 2,
        "numberOfGarages": 1,
        "numberOfLivingRooms": 1,
        "numberOfDiningRooms": 1,
        "numberOfKitchens": 1,
        "numberOfMaidRooms": 1,
        "yearBuilt": 2020,
        "hasSwimmingPool": true,
        "hasGarden": true,
        "hasTerrace": true,
        "hasBalcony": false,
        "hasSecurity": true,
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

### **GET** /v1/house-and-lot/:id

Retrieve a single house and lot listing by its ID with property details.

#### Path Parameters

| Parameter | Type   | Description       | Required |
|-----------|--------|-------------------|----------|
| id        | string | House and Lot ID  | Yes      |

#### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "propertyId": "uuid",
    "name": "string",
    "lotSize": 300.5,
    "floorArea": 150.75,
    "numberOfBedrooms": 4,
    "numberOfBathrooms": 3,
    "numberOfFloors": 2,
    "numberOfGarages": 1,
    "numberOfLivingRooms": 1,
    "numberOfDiningRooms": 1,
    "numberOfKitchens": 1,
    "numberOfMaidRooms": 1,
    "yearBuilt": 2020,
    "hasSwimmingPool": true,
    "hasGarden": true,
    "hasTerrace": true,
    "hasBalcony": false,
    "hasSecurity": true,
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

### **GET** /v1/house-and-lot/user/:userId

Retrieve all house and lot listings for a specific user.

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
      "lotSize": 300.5,
      "floorArea": 150.75,
      "numberOfBedrooms": 4,
      "numberOfBathrooms": 3,
      "numberOfFloors": 2,
      "numberOfGarages": 1,
      "numberOfLivingRooms": 1,
      "numberOfDiningRooms": 1,
      "numberOfKitchens": 1,
      "numberOfMaidRooms": 1,
      "yearBuilt": 2020,
      "hasSwimmingPool": true,
      "hasGarden": true,
      "hasTerrace": true,
      "hasBalcony": false,
      "hasSecurity": true,
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

### **POST** /v1/house-and-lot

Create a new house and lot listing.

#### Request Body

```json
{
  "propertyData": {
    "userId": "uuid",
    "propertyTypeId": "uuid",
    "listingTypeId": "uuid",
    "listingTitle": "Luxury Family Home in Alabang",
    "listingDescription": "Spacious family home with garden and swimming pool",
    "listingPrice": 15000000,
    "listingPriceFormatted": "₱15,000,000",
    "cityId": "uuid",
    "barangayId": "uuid",
    "address": "123 Acacia Avenue, Alabang, Muntinlupa",
    "longitude": 121.12345,
    "latitude": 14.12345
  },
  "houseAndLotData": {
    "name": "Acacia Residences",
    "lotSize": 300.5,
    "floorArea": 150.75,
    "numberOfBedrooms": 4,
    "numberOfBathrooms": 3,
    "numberOfFloors": 2,
    "numberOfGarages": 1,
    "numberOfLivingRooms": 1,
    "numberOfDiningRooms": 1,
    "numberOfKitchens": 1,
    "numberOfMaidRooms": 1,
    "yearBuilt": 2020,
    "hasSwimmingPool": true,
    "hasGarden": true,
    "hasTerrace": true,
    "hasBalcony": false,
    "hasSecurity": true
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
      "listingTitle": "Luxury Family Home in Alabang",
      "listingDescription": "Spacious family home with garden and swimming pool",
      "listingPrice": 15000000,
      "listingPriceFormatted": "₱15,000,000",
      "cityId": "uuid",
      "barangayId": "uuid",
      "address": "123 Acacia Avenue, Alabang, Muntinlupa",
      "longitude": 121.12345,
      "latitude": 14.12345,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    },
    "houseAndLot": {
      "id": "uuid",
      "propertyId": "uuid",
      "name": "Acacia Residences",
      "lotSize": 300.5,
      "floorArea": 150.75,
      "numberOfBedrooms": 4,
      "numberOfBathrooms": 3,
      "numberOfFloors": 2,
      "numberOfGarages": 1,
      "numberOfLivingRooms": 1,
      "numberOfDiningRooms": 1,
      "numberOfKitchens": 1,
      "numberOfMaidRooms": 1,
      "yearBuilt": 2020,
      "hasSwimmingPool": true,
      "hasGarden": true,
      "hasTerrace": true,
      "hasBalcony": false,
      "hasSecurity": true,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  }
}
```

---

### **PUT** /v1/house-and-lot/:id

Update an existing house and lot listing.

#### Path Parameters

| Parameter | Type   | Description      | Required |
|-----------|--------|------------------|----------|
| id        | string | House and Lot ID | Yes      |

#### Request Body

```json
{
  "propertyData": {
    "listingTitle": "Updated Luxury Family Home in Alabang",
    "listingPrice": 16500000,
    "listingPriceFormatted": "₱16,500,000"
  },
  "houseAndLotData": {
    "numberOfBedrooms": 5,
    "hasSwimmingPool": false
  }
}
```

Note: All fields are optional for updates. Only include the fields you want to modify. Either `propertyData` or `houseAndLotData` (or both) must be provided.

#### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "propertyId": "uuid",
    "name": "Acacia Residences",
    "lotSize": 300.5,
    "floorArea": 150.75,
    "numberOfBedrooms": 5,
    "numberOfBathrooms": 3,
    "numberOfFloors": 2,
    "numberOfGarages": 1,
    "numberOfLivingRooms": 1,
    "numberOfDiningRooms": 1,
    "numberOfKitchens": 1,
    "numberOfMaidRooms": 1,
    "yearBuilt": 2020,
    "hasSwimmingPool": false,
    "hasGarden": true,
    "hasTerrace": true,
    "hasBalcony": false,
    "hasSecurity": true,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601",
    "property": {
      "id": "uuid",
      "userId": "uuid",
      "propertyTypeId": "uuid",
      "listingTypeId": "uuid",
      "listingTitle": "Updated Luxury Family Home in Alabang",
      "listingDescription": "Spacious family home with garden and swimming pool",
      "listingPrice": 16500000,
      "listingPriceFormatted": "₱16,500,000",
      "cityId": "uuid",
      "barangayId": "uuid",
      "address": "123 Acacia Avenue, Alabang, Muntinlupa",
      "longitude": 121.12345,
      "latitude": 14.12345,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  }
}
```

---

### **DELETE** /v1/house-and-lot/:id

Delete a house and lot listing by its ID.

#### Path Parameters

| Parameter | Type   | Description      | Required |
|-----------|--------|------------------|----------|
| id        | string | House and Lot ID | Yes      |

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
      "listingTitle": "Updated Luxury Family Home in Alabang",
      "listingDescription": "Spacious family home with garden and swimming pool",
      "listingPrice": 16500000,
      "listingPriceFormatted": "₱16,500,000",
      "cityId": "uuid",
      "barangayId": "uuid",
      "address": "123 Acacia Avenue, Alabang, Muntinlupa",
      "longitude": 121.12345,
      "latitude": 14.12345,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    },
    "houseAndLot": {
      "id": "uuid",
      "propertyId": "uuid",
      "name": "Acacia Residences",
      "lotSize": 300.5,
      "floorArea": 150.75,
      "numberOfBedrooms": 5,
      "numberOfBathrooms": 3,
      "numberOfFloors": 2,
      "numberOfGarages": 1,
      "numberOfLivingRooms": 1,
      "numberOfDiningRooms": 1,
      "numberOfKitchens": 1,
      "numberOfMaidRooms": 1,
      "yearBuilt": 2020,
      "hasSwimmingPool": false,
      "hasGarden": true,
      "hasTerrace": true,
      "hasBalcony": false,
      "hasSecurity": true,
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

- `HOUSE_AND_LOT_NOT_FOUND` (404): Requested house and lot listing not found
- `PROPERTY_ID_MISSING` (404): Property ID not found for the house and lot
- `PROPERTY_NOT_FOUND` (404): Property details not found
- `VALIDATION_ERROR` (400): Invalid request body or query parameters
- `CREATION_FAILED` (500): Failed to create house and lot listing
- `RETRIEVAL_FAILED` (500): Failed to retrieve house and lot listing(s)
- `UPDATE_FAILED` (500): Failed to update house and lot listing
- `DELETION_FAILED` (500): Failed to delete house and lot listing
- `PROPERTY_CREATION_FAILED` (500): Failed to create property record
- `HOUSE_AND_LOT_CREATION_FAILED` (500): Failed to create house and lot record
- `PROPERTY_UPDATE_FAILED` (500): Failed to update property record
- `HOUSE_AND_LOT_UPDATE_FAILED` (500): Failed to update house and lot record
- `PROPERTY_DELETION_FAILED` (500): Failed to delete property record
- `HOUSE_AND_LOT_DELETION_FAILED` (500): Failed to delete house and lot record

---

## Service Responsibilities

The House and Lot Service has the following core responsibilities:

1. **CRUD Operations:**
   - Create, read, update, and delete house and lot listings
   - Maintain relationships between house and lot and property records
   - Handle transactions to ensure data consistency

2. **Advanced Filtering & Search:**
   - Implement text search across listing title, description, and house and lot name
   - Support numeric filters for lot size, floor area, bedrooms, bathrooms, floors, and price
   - Support boolean filters for features (swimming pool, garden, terrace, etc.)
   - Enable location-based filtering by city and barangay

3. **Pagination:**
   - Implement pagination for listing results
   - Provide metadata for client-side navigation (total count, next/prev pages)

4. **Data Validation:**
   - Ensure data integrity through comprehensive schema validation
   - Enforce referential integrity between property and house and lot records

5. **Error Handling:**
   - Provide clear, consistent error responses
   - Implement robust transaction rollbacks in case of failures
   - Log errors for monitoring and debugging

---

## Example Requests

### Create a New House and Lot Listing

```http
POST /v1/house-and-lot HTTP/1.1
Content-Type: application/json

{
  "propertyData": {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "propertyTypeId": "123e4567-e89b-12d3-a456-426614174001",
    "listingTypeId": "123e4567-e89b-12d3-a456-426614174002",
    "listingTitle": "Modern Family Home in Alabang Hills",
    "listingDescription": "Luxurious 4-bedroom house with swimming pool, garden, and smart home features. Located in an exclusive subdivision with 24/7 security.",
    "listingPrice": 25000000,
    "listingPriceFormatted": "₱25,000,000",
    "cityId": "123e4567-e89b-12d3-a456-426614174003",
    "barangayId": "123e4567-e89b-12d3-a456-426614174004",
    "address": "25 San Lorenzo Drive, Alabang Hills Village, Muntinlupa",
    "longitude": 121.046912,
    "latitude": 14.553256
  },
  "houseAndLotData": {
    "name": "Alabang Hills Modern Residence",
    "lotSize": 450.75,
    "floorArea": 320.50,
    "numberOfBedrooms": 4,
    "numberOfBathrooms": 4,
    "numberOfFloors": 2,
    "numberOfGarages": 2,
    "numberOfLivingRooms": 2,
    "numberOfDiningRooms": 1,
    "numberOfKitchens": 1,
    "numberOfMaidRooms": 1,
    "yearBuilt": 2022,
    "hasSwimmingPool": true,
    "hasGarden": true,
    "hasTerrace": true,
    "hasBalcony": true,
    "hasSecurity": true
  }
}
```

### Search for House and Lots with Filters

```http
GET /v1/house-and-lot?minBedrooms=3&minLotSize=300&hasSwimmingPool=true&cityId=123e4567-e89b-12d3-a456-426614174003&page=1&pageSize=20 HTTP/1.1
```
