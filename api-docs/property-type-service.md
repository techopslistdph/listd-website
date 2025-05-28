# Property Type Service

The Property Type Service manages the types of properties (e.g., "Condominium", "House and Lot", "Warehouse", "Vacant Lot") available in the system. It provides endpoints for creating, updating, enabling/disabling, deleting, and retrieving property types. This service ensures type safety, validation, and robust error handling for all operations.

---

## Endpoints

### **GET** /v1/property-types

Retrieve all enabled property types.

---

### **GET** /v1/property-types/:id

Retrieve a single property type by its ID.

---

### **POST** /v1/property-types

Create a new property type.

#### Request Body

```json
{
  "name": "string"
}
```

---

### **PUT** /v1/property-types/:id

Update an existing property type.

#### Request Body

```json
{
  "name": "string"
}
```

---

### **DELETE** /v1/property-types/:id

Delete a property type by its ID.

---

### **PATCH** /v1/property-types/:id/disable

Disable a property type (soft delete).

---

### **PATCH** /v1/property-types/:id/enable

Enable a previously disabled property type.

---

## Request & Response Schemas

### PropertyType Object

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
- For list endpoints, `data` is an array of PropertyType objects.
- For single-resource endpoints, `data` is a PropertyType object or a primitive (e.g., ID).

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

- `DUPLICATE_RECORD` (409): Attempted to create a property type with a name that already exists.
- `NOT_FOUND` (404): Property type not found.
- `VALIDATION_ERROR` (400): Invalid request body.

---

## Service Responsibilities

- Validate all input using Zod schemas.
- Only allow unique names for property types.
- Support enabling/disabling property types (soft delete).
- Throw `ApiError` for all errors, including DB and validation errors.
- Never perform business logic in the route layer; all logic is in the service.

---

## Example Requests

### Create Property Type

```http
POST /v1/property-types
Content-Type: application/json

{
  "name": "Condominium"
}
```

---

### Get All Property Types

```http
GET /v1/property-types
```

---

### Disable Property Type

```http
PATCH /v1/property-types/uuid/disable
```

---

**This documentation complies with the API Markdown Documentation Rule.**
