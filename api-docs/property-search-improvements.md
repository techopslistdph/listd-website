# Property Search Improvements

This document describes the improvements made to the search functionality for all property-related API endpoints.

---

## Overview

The search functionality has been enhanced across all property listing services to support partial matching, making property searches more flexible and user-friendly. Previously, searches required exact matches, but now users can search with partial terms across multiple fields.

---

## Affected Services

The following property listing services have been updated:
- **Warehouse** (`/api/v1/property-listings/warehouse`)
- **House and Lot** (`/api/v1/property-listings/house-and-lot`)
- **Vacant Lot** (`/api/v1/property-listings/vacant-lot`)
- **Condominium** (`/api/v1/property-listings/condominium`)

---

## Changes Made

### 1. Search Algorithm

All property services now use a hybrid search approach combining:
- **ILIKE pattern matching**: For partial string matches (case-insensitive)
- **Full-text search**: For complete word matches with better ranking

### 2. Searchable Fields

Each service searches across multiple fields:
- **All services**: `listingTitle`, `listingDescription`, `address`
- **Condominium**: Additionally searches `buildingName`

### 3. Database Indexes

Added trigram indexes to support efficient ILIKE queries:
- `property_listing_title_trgm_idx`: GIN index on property listing titles
- `property_address_trgm_idx`: GIN index on property addresses
- `condominium_building_name_trgm_idx`: GIN index on condominium building names

### 4. Required PostgreSQL Extension

The `pg_trgm` extension must be enabled (same as PSGC search):
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

---

## Example Searches

### Warehouse Search

**Endpoint**: `GET /api/v1/property-listings/warehouse`

**Example**:
```http
GET /api/v1/property-listings/warehouse?search=Laguna
```

This will match warehouses with:
- Listing titles containing "Laguna"
- Descriptions mentioning "Laguna"
- Addresses in Laguna area

### House and Lot Search

**Endpoint**: `GET /api/v1/property-listings/house-and-lot`

**Example**:
```http
GET /api/v1/property-listings/house-and-lot?search=Ayala&minBedrooms=3
```

This will match properties with:
- "Ayala" in the title, description, or address
- At least 3 bedrooms

### Condominium Search

**Endpoint**: `GET /api/v1/property-listings/condominium`

**Example**:
```http
GET /api/v1/property-listings/condominium?search=Greenbelt
```

This will match condominiums with:
- "Greenbelt" in the listing title
- "Greenbelt" in the description
- "Greenbelt" in the address
- "Greenbelt" in the building name

---

## Search Query Structure

All property services use the same search pattern:

```sql
(
  listing_title ILIKE '%search_term%'
  OR listing_description ILIKE '%search_term%'
  OR address ILIKE '%search_term%'
  OR to_tsvector('english', listing_title) @@ to_tsquery('english', 'formatted_search_term')
  OR to_tsvector('english', listing_description) @@ to_tsquery('english', 'formatted_search_term')
  OR to_tsvector('english', address) @@ to_tsquery('english', 'formatted_search_term')
)
```

---

## Migration Steps

1. Enable the pg_trgm extension (if not already enabled):
   ```bash
   bun drizzle-kit push
   ```

2. The trigram indexes will be created automatically with the migrations.

---

## Performance Considerations

- Trigram indexes significantly improve ILIKE query performance
- The combined approach ensures both partial and full-word matches are found
- Index size is approximately 2-3x the size of the indexed columns
- Initial index creation may take time for large datasets

---

## Backward Compatibility

The changes are fully backward compatible:
- Exact searches still work as before
- API interfaces remain unchanged
- All existing query parameters continue to work

---

## Benefits

1. **Better User Experience**: Users can find properties with partial search terms
2. **Typo Tolerance**: Minor spelling mistakes won't prevent finding results
3. **Flexible Searching**: Search across multiple fields simultaneously
4. **Performance**: Trigram indexes ensure fast searches even with partial matching

---

## Changelog

- **2024-01-XX**: Implemented hybrid search for all property listing services
- **2024-01-XX**: Added trigram indexes for property and condominium tables 