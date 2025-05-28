# Scrape Service API

The Scrape Service provides endpoints for managing scraped property data from various sources and URL tracking. It allows storing, retrieving, updating, and tracking the processing status of scraped data and URLs to be scraped.

---

## Authentication & Authorization

All endpoints require authentication via Bearer token in the Authorization header.

---

## Endpoints

### **GET** /v1/scrape

Retrieve scrape records with optional filters and pagination.

**Query Parameters:**
- `source` (string, optional) - Filter by data source
- `propertyType` (string, optional) - Filter by property type
- `listingType` (string, optional) - Filter by listing type
- `isProcessed` (string, optional) - Filter by processing status ("true" or "false")
- `page` (number, optional) - Page number (default: 1)
- `pageSize` (number, optional) - Number of records per page (default: 20, max: 100)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "data": {
        "title": "2BR Condo for Sale",
        "price": 5000000,
        "location": "Makati City"
      },
      "source": "lamudi",
      "sourceUrl": "https://www.lamudi.com.ph/listing/12345",
      "propertyType": "Condominium",
      "listingType": "For Sale",
      "isProcessed": false,
      "createdAt": "ISO8601",
      "processedAt": null
    }
  ],
  "meta": {
    "total": 250,
    "page": 1,
    "pageSize": 20,
    "totalPages": 13,
    "nextPage": 2,
    "prevPage": null
  }
}
```

---

### **GET** /v1/scrape/stats

Get statistics about scrape records.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 1000,
    "processed": 750,
    "unprocessed": 250,
    "bySource": [
      {
        "source": "lamudi",
        "count": 600
      },
      {
        "source": "property24",
        "count": 400
      }
    ],
    "byPropertyType": [
      {
        "propertyType": "Condominium",
        "count": 500
      },
      {
        "propertyType": "House and Lot",
        "count": 300
      }
    ]
  }
}
```

---

### **GET** /v1/scrape/unprocessed

Get unprocessed scrape records.

**Query Parameters:**
- `limit` (number, optional) - Number of records to return (default: 10)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "data": {},
      "source": "string",
      "sourceUrl": "string",
      "propertyType": "string",
      "listingType": "string",
      "isProcessed": false,
      "createdAt": "ISO8601",
      "processedAt": null
    }
  ]
}
```

---

### **GET** /v1/scrape/:id

Get a single scrape record by ID.

**Path Parameters:**
- `id` (string, required) - UUID of the scrape record

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "data": {},
    "source": "string",
    "sourceUrl": "string",
    "propertyType": "string",
    "listingType": "string",
    "isProcessed": false,
    "createdAt": "ISO8601",
    "processedAt": null
  }
}
```

---

### **POST** /v1/scrape

Create a new scrape record.

**Request Body:**
```json
{
  "data": {
    "title": "Property Title",
    "price": 5000000,
    "location": "City Name",
    "customField": "any value"
  },
  "source": "lamudi",
  "sourceUrl": "https://www.lamudi.com.ph/listing/12345",
  "propertyType": "Condominium",
  "listingType": "For Sale",
  "isProcessed": false
}
```

**Validation Schema:**
- `data` - Object containing scraped data (required)
- `source` - Data source identifier (required)
- `sourceUrl` - URL of the scraped page (required, must be valid URL)
- `propertyType` - Type of property (required)
- `listingType` - Type of listing (required)
- `isProcessed` - Processing status (optional, default: false)

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "data": {},
    "source": "string",
    "sourceUrl": "string",
    "propertyType": "string",
    "listingType": "string",
    "isProcessed": false,
    "createdAt": "ISO8601",
    "processedAt": null
  }
}
```

---

### **POST** /v1/scrape/batch

Create multiple scrape records at once.

**Request Body:**
```json
[
  {
    "data": {},
    "source": "lamudi",
    "sourceUrl": "https://example.com/1",
    "propertyType": "Condominium",
    "listingType": "For Sale"
  },
  {
    "data": {},
    "source": "property24",
    "sourceUrl": "https://example.com/2",
    "propertyType": "House and Lot",
    "listingType": "For Rent"
  }
]
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "data": {},
      "source": "string",
      "sourceUrl": "string",
      "propertyType": "string",
      "listingType": "string",
      "isProcessed": false,
      "createdAt": "ISO8601",
      "processedAt": null
    }
  ],
  "meta": {
    "created": 2
  }
}
```

---

### **PATCH** /v1/scrape/:id

Update a scrape record.

**Path Parameters:**
- `id` (string, required) - UUID of the scrape record

**Request Body:**
```json
{
  "data": {
    "updatedField": "new value"
  },
  "isProcessed": true
}
```

**Validation Schema:**
- All fields are optional
- When `isProcessed` is set to true, `processedAt` is automatically set

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "data": {},
    "source": "string",
    "sourceUrl": "string",
    "propertyType": "string",
    "listingType": "string",
    "isProcessed": true,
    "createdAt": "ISO8601",
    "processedAt": "ISO8601"
  }
}
```

---

### **POST** /v1/scrape/:id/process

Mark a scrape record as processed.

**Path Parameters:**
- `id` (string, required) - UUID of the scrape record

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "data": {},
    "source": "string",
    "sourceUrl": "string",
    "propertyType": "string",
    "listingType": "string",
    "isProcessed": true,
    "createdAt": "ISO8601",
    "processedAt": "ISO8601"
  }
}
```

---

### **DELETE** /v1/scrape/:id

Delete a scrape record.

**Path Parameters:**
- `id` (string, required) - UUID of the scrape record

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "data": {},
    "source": "string",
    "sourceUrl": "string",
    "propertyType": "string",
    "listingType": "string",
    "isProcessed": false,
    "createdAt": "ISO8601",
    "processedAt": null
  }
}
```

---

## URL Management Endpoints

The scrape service also includes URL management functionality for tracking URLs to be scraped.

### **GET** /v1/scrape/urls

Retrieve URL records with optional filters and pagination.

**Query Parameters:**
- `isProcessed` (string, optional) - Filter by processing status ("true" or "false")
- `page` (number, optional) - Page number (default: 1)
- `pageSize` (number, optional) - Number of records per page (default: 20, max: 100)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "url": "https://www.lamudi.com.ph/metro-manila/makati/condominiums-for-sale/",
      "propertyType": "Condominium",
      "listingType": "For Sale",
      "isProcessed": false,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
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

### **GET** /v1/scrape/urls/stats

Get statistics about URL records.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 500,
    "processed": 350,
    "unprocessed": 150
  }
}
```

---

### **GET** /v1/scrape/urls/unprocessed

Get unprocessed URL records.

**Query Parameters:**
- `limit` (number, optional) - Number of records to return (default: 10)
- `listingType` (string, optional) - Filter by listing type (e.g., "For Sale", "For Rent")
- `propertyType` (string, optional) - Filter by property type (e.g., "Condominium", "House and Lot")

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "url": "https://www.lamudi.com.ph/page-1",
      "propertyType": "Condominium",
      "listingType": "For Sale",
      "isProcessed": false,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  ]
}
```

---

### **GET** /v1/scrape/urls/:id

Get a single URL record by ID.

**Path Parameters:**
- `id` (string, required) - UUID of the URL record

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "https://www.lamudi.com.ph/listing/12345",
    "propertyType": "Condominium",
    "listingType": "For Sale",
    "isProcessed": false,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
}
```

---

### **POST** /v1/scrape/urls

Create a new URL record.

**Request Body:**
```json
{
  "url": "https://www.lamudi.com.ph/metro-manila/condominiums-for-sale/",
  "propertyType": "Condominium",
  "listingType": "For Sale",
  "isProcessed": false
}
```

**Validation Schema:**
- `url` - Valid URL (required)
- `propertyType` - Type of property (required)
- `listingType` - Type of listing (required)
- `isProcessed` - Processing status (optional, default: false)

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "https://www.lamudi.com.ph/metro-manila/condominiums-for-sale/",
    "propertyType": "Condominium",
    "listingType": "For Sale",
    "isProcessed": false,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
}
```

---

### **POST** /v1/scrape/urls/batch

Create multiple URL records at once.

**Request Body:**
```json
[
  {
    "url": "https://www.lamudi.com.ph/metro-manila/makati/condominiums-for-sale/",
    "propertyType": "Condominium",
    "listingType": "For Sale"
  },
  {
    "url": "https://www.property24.com.ph/condominiums-for-sale-in-bgc",
    "propertyType": "Condominium",
    "listingType": "For Sale"
  },
  {
    "url": "https://www.lamudi.com.ph/metro-manila/pasig/houses-for-sale/",
    "propertyType": "House and Lot",
    "listingType": "For Sale"
  }
]
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "url": "https://www.lamudi.com.ph/metro-manila/makati/condominiums-for-sale/",
      "propertyType": "Condominium",
      "listingType": "For Sale",
      "isProcessed": false,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  ],
  "meta": {
    "created": 2
  }
}
```

---

### **PATCH** /v1/scrape/urls/:id

Update a URL record.

**Path Parameters:**
- `id` (string, required) - UUID of the URL record

**Request Body:**
```json
{
  "url": "https://www.lamudi.com.ph/updated-url",
  "isProcessed": true
}
```

**Validation Schema:**
- All fields are optional
- `updatedAt` is automatically updated

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "https://www.lamudi.com.ph/updated-url",
    "propertyType": "Condominium",
    "listingType": "For Sale",
    "isProcessed": true,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
}
```

---

### **POST** /v1/scrape/urls/:id/process

Mark a URL as processed.

**Path Parameters:**
- `id` (string, required) - UUID of the URL record

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "https://www.lamudi.com.ph/listing/12345",
    "propertyType": "Condominium",
    "listingType": "For Sale",
    "isProcessed": true,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
}
```

---

### **DELETE** /v1/scrape/urls/:id

Delete a URL record.

**Path Parameters:**
- `id` (string, required) - UUID of the URL record

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "https://www.lamudi.com.ph/listing/12345",
    "propertyType": "Condominium",
    "listingType": "For Sale",
    "isProcessed": false,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
}
```

---

## Processing Summary Endpoints

### **POST** /v1/scrape/processing-summary

Create a processing summary record to track the results of a batch scraping operation.

**Request Body:**
```json
{
  "summary": {
    "total_urls": 10,
    "total_processed": 7,
    "total_failed": 3,
    "success_rate": 70.0,
    "processing_started_at": "2025-05-27T08:30:00.000Z",
    "processing_completed_at": "2025-05-27T08:44:32.464Z"
  },
  "successful_urls": [
    {
      "url_id": "09e63e57-d1d6-41f7-876a-1b512a3a48bf",
      "scrape_id": "scrape_12345",
      "property_title": "3 Storey Warehouse for Lease",
      "property_type": "warehouse",
      "price": 500000,
      "phone_extracted": true,
      "agent_name": "John Doe",
      "processed_at": "2025-05-27T08:31:15.123Z"
    },
    {
      "url_id": "7653643e-c727-42bb-aa70-3a17459bfd8a",
      "scrape_id": "scrape_12346",
      "property_title": "PEZA Warehouse Goldenmile Cavite",
      "property_type": "warehouse",
      "price": 750000,
      "phone_extracted": true,
      "agent_name": "Jane Smith",
      "processed_at": "2025-05-27T08:32:45.456Z"
    }
  ],
  "failed_urls": [
    {
      "url_id": "2aff04b0-11aa-47a8-8ff0-a8af9d5859c9",
      "error": "Timeout 30000ms exceeded while waiting for event \"load\"",
      "error_type": "TIMEOUT_ERROR",
      "processed_at": "2025-05-27T08:33:30.789Z"
    },
    {
      "url_id": "45e99338-d1d9-40fc-9ed1-5265eb52e843",
      "error": "Contact button not found/visible after 3 retries",
      "error_type": "CONTACT_EXTRACTION_ERROR",
      "processed_at": "2025-05-27T08:35:12.345Z"
    },
    {
      "url_id": "95c3a444-380c-4fb9-9f9a-a32ec0ee6973",
      "error": "dataLayer is empty or not found",
      "error_type": "DATALAYER_ERROR",
      "processed_at": "2025-05-27T08:36:45.678Z"
    }
  ]
}
```

**Validation Schema:**
- `summary` (object, required)
  - `total_urls` - Total number of URLs processed (integer, min: 0)
  - `total_processed` - Number of successfully processed URLs (integer, min: 0)
  - `total_failed` - Number of failed URLs (integer, min: 0)
  - `success_rate` - Success rate percentage (number, 0-100)
  - `processing_started_at` - ISO 8601 datetime when processing started
  - `processing_completed_at` - ISO 8601 datetime when processing completed
- `successful_urls` (array, required) - Array of successfully processed URLs
  - `url_id` - UUID of the URL record
  - `scrape_id` - ID of the created scrape record (optional)
  - `property_title` - Extracted property title (optional)
  - `property_type` - Type of property (optional)
  - `price` - Extracted price (optional)
  - `phone_extracted` - Whether phone was extracted (optional)
  - `agent_name` - Extracted agent name (optional)
  - `processed_at` - ISO 8601 datetime when URL was processed
- `failed_urls` (array, required) - Array of failed URLs
  - `url_id` - UUID of the URL record
  - `error` - Error message
  - `error_type` - Type of error (see Error Types below)
  - `processed_at` - ISO 8601 datetime when URL was processed

**Error Types:**
- `TIMEOUT_ERROR` - Page loading or element waiting exceeded timeout
- `NAVIGATION_ERROR` - Failed to navigate to the URL
- `ELEMENT_NOT_FOUND` - Required page element not found
- `CONTACT_EXTRACTION_ERROR` - Failed to extract contact information
- `DATALAYER_ERROR` - dataLayer is missing or empty
- `NETWORK_ERROR` - Network connection issues
- `API_ERROR` - API request failed
- `UNKNOWN_ERROR` - Any other unclassified error

**Success Response (201):**
```json
{
  "success": true,
  "message": "Processing summary recorded successfully",
  "data": {
    "summary_id": "uuid"
  }
}
```

---

## Error Handling

All endpoints follow the standard error response format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

Common error codes:
- `VALIDATION_ERROR` (400) - Invalid input data
- `NOT_FOUND` (404) - Scrape record not found
- `DATABASE_ERROR` (500) - Database operation failed

---

## Service Responsibilities

The Scrape Service is responsible for:

1. **Data Storage**: Storing raw scraped data from various property listing sources
2. **Processing Tracking**: Tracking which records have been processed
3. **Data Retrieval**: Providing filtered access to scraped data
4. **Statistics**: Providing insights into scraping operations
5. **Batch Operations**: Supporting bulk data insertion for efficient scraping
6. **URL Management**: Managing URLs to be scraped with processing status tracking
7. **URL Queue**: Providing unprocessed URLs for scraping operations
8. **Processing Summary**: Recording and storing summaries of batch scraping operations including success/failure metrics

---

## Example Requests

### Create a scrape record for a condominium listing

```http
POST /v1/scrape HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer your-token-here

{
  "data": {
    "title": "2BR Condo in BGC",
    "price": 8500000,
    "bedrooms": 2,
    "bathrooms": 2,
    "floorArea": 65,
    "description": "Fully furnished unit with parking"
  },
  "source": "lamudi",
  "sourceUrl": "https://www.lamudi.com.ph/bgc-condo-12345",
  "propertyType": "Condominium",
  "listingType": "For Sale"
}
```

### Get unprocessed records for processing

```http
GET /v1/scrape/unprocessed?limit=5 HTTP/1.1
Host: api.example.com
Authorization: Bearer your-token-here
```

### Mark a record as processed after importing to main database

```http
POST /v1/scrape/abc123/process HTTP/1.1
Host: api.example.com
Authorization: Bearer your-token-here
```

### Queue URLs for scraping

```http
POST /v1/scrape/urls/batch HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer your-token-here

[
  {
    "url": "https://www.lamudi.com.ph/metro-manila/makati/condominiums-for-sale/",
    "propertyType": "Condominium",
    "listingType": "For Sale"
  },
  {
    "url": "https://www.property24.com.ph/condominiums-for-sale-in-bgc",
    "propertyType": "Condominium",
    "listingType": "For Sale"
  },
  {
    "url": "https://www.lamudi.com.ph/metro-manila/pasig/houses-for-sale/",
    "propertyType": "House and Lot",
    "listingType": "For Sale"
  }
]
```

### Get next URLs to scrape

```http
GET /v1/scrape/urls/unprocessed?limit=5 HTTP/1.1
Host: api.example.com
Authorization: Bearer your-token-here
```

### Get next URLs to scrape with filters

```http
GET /v1/scrape/urls/unprocessed?limit=10&listingType=For%20Sale&propertyType=Condominium HTTP/1.1
Host: api.example.com
Authorization: Bearer your-token-here
```

### Mark URL as scraped

```http
POST /v1/scrape/urls/abc123/process HTTP/1.1
Host: api.example.com
Authorization: Bearer your-token-here
```

### Submit processing summary

```http
POST /v1/scrape/processing-summary HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer your-token-here

{
  "summary": {
    "total_urls": 10,
    "total_processed": 7,
    "total_failed": 3,
    "success_rate": 70.0,
    "processing_started_at": "2025-05-27T08:30:00.000Z",
    "processing_completed_at": "2025-05-27T08:44:32.464Z"
  },
  "successful_urls": [
    {
      "url_id": "09e63e57-d1d6-41f7-876a-1b512a3a48bf",
      "scrape_id": "scrape_12345",
      "property_title": "3 Storey Warehouse for Lease",
      "property_type": "warehouse",
      "price": 500000,
      "phone_extracted": true,
      "agent_name": "John Doe",
      "processed_at": "2025-05-27T08:31:15.123Z"
    },
    {
      "url_id": "7653643e-c727-42bb-aa70-3a17459bfd8a",
      "scrape_id": "scrape_12346",
      "property_title": "PEZA Warehouse Goldenmile Cavite",
      "property_type": "warehouse",
      "price": 750000,
      "phone_extracted": true,
      "agent_name": "Jane Smith",
      "processed_at": "2025-05-27T08:32:45.456Z"
    }
  ],
  "failed_urls": [
    {
      "url_id": "2aff04b0-11aa-47a8-8ff0-a8af9d5859c9",
      "error": "Timeout 30000ms exceeded while waiting for event \"load\"",
      "error_type": "TIMEOUT_ERROR",
      "processed_at": "2025-05-27T08:33:30.789Z"
    },
    {
      "url_id": "45e99338-d1d9-40fc-9ed1-5265eb52e843",
      "error": "Contact button not found/visible after 3 retries",
      "error_type": "CONTACT_EXTRACTION_ERROR",
      "processed_at": "2025-05-27T08:35:12.345Z"
    },
    {
      "url_id": "95c3a444-380c-4fb9-9f9a-a32ec0ee6973",
      "error": "dataLayer is empty or not found",
      "error_type": "DATALAYER_ERROR",
      "processed_at": "2025-05-27T08:36:45.678Z"
    }
  ]
}
```