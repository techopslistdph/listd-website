# Property Listings Standard Response Format

This document describes the standardized response format implemented across all property listing services.

---

## Overview

All property listing services now follow the same standardized response format as defined in the `PaginatedResponse<T>` type. This ensures consistency across all API endpoints and makes it easier for frontend developers to work with the API.

---

## Response Format

### Standard Paginated Response

All `getAll` methods in property listing services return the following structure:

```typescript
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}
```

### Example Response

```json
{
  "data": [
    {
      "id": "uuid",
      "buildingName": "Greenbelt Residences",
      "floorArea": 65.5,
      "numberOfBedrooms": 2,
      "numberOfBathrooms": 2,
      "numberOfParkingSpaces": 1,
      "propertyId": "uuid",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "property": {
        "id": "uuid",
        "userId": "uuid",
        "propertyTypeId": "uuid",
        "listingTypeId": "uuid",
        "listingTitle": "2BR Condo in Greenbelt",
        "listingDescription": "Modern 2-bedroom condominium...",
        "listingPrice": 5000000,
        "listingPriceFormatted": "₱5,000,000",
        "cityId": "uuid",
        "barangayId": "uuid",
        "address": "Greenbelt, Makati City",
        "longitude": 121.0244,
        "latitude": 14.5547,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "pageSize": 20,
    "totalPages": 8,
    "nextPage": 2,
    "prevPage": null
  }
}
```

---

## Affected Services

The following services have been updated to use the standard response format:

1. **Warehouse Service** (`getAllWarehouses`)
   - Returns: `PaginatedResponse<WarehouseWithProperty>`

2. **House and Lot Service** (`getAllHouseAndLots`)
   - Returns: `PaginatedResponse<HouseAndLotWithProperty>`

3. **Vacant Lot Service** (`getVacantLots`)
   - Returns: `PaginatedResponse<VacantLotWithProperty>`

4. **Condominium Service** (`getAllCondominiums`)
   - Returns: `PaginatedResponse<CondominiumWithProperty>`

---

## Type Definitions

Each service defines a type alias for better readability:

```typescript
// Warehouse
type WarehouseWithProperty = typeof warehouse.$inferSelect & {
  property: typeof property.$inferSelect | null;
};

// House and Lot
type HouseAndLotWithProperty = typeof houseAndLot.$inferSelect & {
  property: typeof property.$inferSelect | null;
};

// Vacant Lot
type VacantLotWithProperty = typeof vacantLot.$inferSelect & {
  property: typeof property.$inferSelect | null;
};

// Condominium
type CondominiumWithProperty = typeof condominium.$inferSelect & {
  property: typeof property.$inferSelect | null;
};
```

---

## Migration from Old Format

### Previous Response Formats

Each service previously had its own response format:

```typescript
// Old House and Lot format
{
  houseAndLots: Array,
  totalCount: number,
  totalPages: number,
  currentPage: number,
  nextPage: number | null,
  prevPage: number | null,
  pageSize: number
}

// Old Vacant Lot format
{
  vacantLots: Array,
  totalCount: number,
  totalPages: number,
  currentPage: number,
  nextPage: number | null,
  prevPage: number | null,
  pageSize: number
}

// Old Condominium format
{
  condominiums: Array,
  totalCount: number,
  totalPages: number,
  currentPage: number,
  nextPage: number | null,
  prevPage: number | null,
  pageSize: number
}
```

### New Standardized Format

All services now return:
```typescript
{
  data: Array,        // Contains the property listings
  meta: {
    total: number,    // Total count of records
    page: number,     // Current page number
    pageSize: number, // Number of items per page
    totalPages: number,
    nextPage: number | null,
    prevPage: number | null
  }
}
```

---

## Benefits

1. **Consistency**: All property listing endpoints return the same response structure
2. **Type Safety**: Strong TypeScript types ensure compile-time safety
3. **Frontend Simplicity**: Frontend developers can use the same parsing logic for all endpoints
4. **Future Proof**: Easy to extend the meta object with additional pagination info if needed

---

## Implementation Notes

- The `PaginatedResponse<T>` type is defined in `src/types/pagination.ts`
- Each service imports and uses this type for their paginated endpoints
- The response format matches the pattern already established in other services (e.g., PSGC service)

---

## Changelog

- **2024-01-XX**: Standardized all property listing services to use `PaginatedResponse<T>` format
- **2024-01-XX**: Added type aliases for better code readability 