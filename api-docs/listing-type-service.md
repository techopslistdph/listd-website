# Listing Type Service

The Listing Type Service manages the types of property listings (e.g., "Rent", "Buy") available in the system. It provides endpoints for creating, updating, enabling/disabling, deleting, and retrieving listing types. This service ensures type safety, validation, and robust error handling for all operations.

---

## Endpoints

### **GET** /v1/listing-types

Retrieve all enabled listing types.

---

### **GET** /v1/listing-types/:id

Retrieve a single listing type by its ID.

---

### **POST** /v1/listing-types

Create a new listing type.

#### Request Body

```json
{
  "name": "string"
}
```

---

### **PUT** /v1/listing-types/:id

Update an existing listing type.

#### Request Body

```json
{
  "name": "string"
}
```

---

### **DELETE** /v1/listing-types/:id

Delete a listing type by its ID.

---

### **PATCH** /v1/listing-types/:id/disable

Disable a listing type (soft delete).

---

### **PATCH** /v1/listing-types/:id/enable

Enable a previously disabled listing type.

---

## Request & Response Schemas

### ListingType Object

```json
{
  "id": "uuid",
  "name": "string",
  "disabled": false,
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Standard Success Response

```json
{
  "success": true,
  "data": {}
}
```
- For list endpoints, `data` is an array of ListingType objects.
- For single-resource endpoints, `data` is a ListingType object or a primitive (e.g., ID).

---

## Error Handling

All errors are returned in a consistent structure. Common error codes include validation errors, not found, and duplicate record.

### Error Response Example

```json
{
  "success": false,
  "error": {
    "message": "Duplicate record.",
    "code": "DUPLICATE_RECORD"
  }
}
```

#### Common Error Codes

- `DUPLICATE_RECORD` (409): Attempted to create a listing type with a name that already exists.
- `NOT_FOUND` (404): Listing type not found.
- `VALIDATION_ERROR` (400): Invalid request body.

---

## Service Responsibilities

- Validate all input using Zod schemas.
- Only allow unique names for listing types.
- Support enabling/disabling listing types (soft delete).
- Throw `ApiError` for all errors, including DB and validation errors.
- Never perform business logic in the route layer; all logic is in the service.

---

## Example Requests

### Create Listing Type

```http
POST /v1/listing-types
Content-Type: application/json

{
  "name": "Rent"
}
```

---

### Get All Listing Types

```http
GET /v1/listing-types
```

---

### Disable Listing Type

```http
PATCH /v1/listing-types/uuid/disable
```

---

**This documentation complies with the API Markdown Documentation Rule.**
