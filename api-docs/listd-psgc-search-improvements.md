# PSGC Search Improvements

This document describes the improvements made to the search functionality for the Philippine Standard Geographic Code (PSGC) API endpoints.

---

## Overview

The search functionality has been enhanced to support partial matching, making it more user-friendly and flexible. Previously, searches required exact word matches, but now users can search with partial terms.

---

## Changes Made

### 1. Search Algorithm

The search now uses a hybrid approach combining:
- **ILIKE pattern matching**: For partial string matches (case-insensitive)
- **Full-text search**: For complete word matches with better ranking

### 2. Database Indexes

Added trigram indexes to support efficient ILIKE queries:
- `city_name_trgm_idx`: GIN index on city names using trigram operations
- `barangay_name_trgm_idx`: GIN index on barangay names using trigram operations

### 3. Required PostgreSQL Extension

The `pg_trgm` extension must be enabled in PostgreSQL:
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

---

## Example Searches

### City Search

**Endpoint**: `GET /api/v1/listd-psgc/city`

**Before** (would not work):
```http
GET /api/v1/listd-psgc/city?search=Parañ
```

**After** (now works):
```http
GET /api/v1/listd-psgc/city?search=Parañ
```

This will now match cities like:
- Parañaque
- Las Piñas (if searching for "Piñ")
- Any city containing the search term

### Barangay Search

**Endpoint**: `GET /api/v1/listd-psgc/barangay`

**Example**:
```http
GET /api/v1/listd-psgc/barangay?search=San&cityPsgcCode=137404000
```

This will match barangays like:
- San Antonio
- San Isidro
- Santa Cruz (contains "San")

---

## Migration Steps

1. Run the migration to enable pg_trgm extension:
   ```bash
   bun drizzle-kit push
   ```

2. The trigram indexes will be created automatically with the migration.

---

## Performance Considerations

- The trigram indexes significantly improve ILIKE query performance
- Initial index creation may take time for large datasets
- Index size is approximately 2-3x the size of the indexed column

---

## Backward Compatibility

The changes are fully backward compatible:
- Exact searches still work as before
- Full-text search capabilities are preserved
- API interface remains unchanged

---

## Technical Details

### Search Query Structure

```sql
(
  name ILIKE '%search_term%'
  OR to_tsvector('english', name) @@ to_tsquery('english', 'formatted_search_term')
)
```

This ensures that:
1. Partial matches are found via ILIKE
2. Complete word matches are found via full-text search
3. Results include both partial and complete matches

---

## Changelog

- **2024-01-XX**: Initial implementation of hybrid search with ILIKE and full-text search
- **2024-01-XX**: Added trigram indexes for performance optimization 