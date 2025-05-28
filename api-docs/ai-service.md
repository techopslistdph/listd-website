# Listd AI Property Valuation Service API

## Overview

The Listd AI Valuation Service provides automated, AI-powered property valuation reports for Philippine real estate. It leverages advanced models and web search to generate detailed, compliant, and data-driven valuation outputs for various property types (e.g., Condominium, House and Lot, Warehouse, Vacant Lot).

This service is ideal for users who want a quick, data-backed estimate of property value, including market trends, comparable analysis, and key metrics.

---

## Endpoint

**POST** `/api/v1/phil-valuate-ai`

### Request Body

- `query`: **(object, required)**
  - `propertyType`: (string, required) — e.g., "Condominium", "House and Lot", etc.
  - `propertySize`: (number, required) — Size of the property (sqm).
  - `buildingName`: (string, optional) — Name of the building or development.
  - `propertyAddress`: (string, required) — Full address of the property.
  - `propertyFeatures`: (array of strings, optional) — List of property features (e.g., "Fully Furnished").
  - `propertyAmenities`: (array of strings, optional) — List of amenities (e.g., "Swimming pool").
  - `extraMetadata`: (object, optional) — **Recommended.** Additional metadata for more accurate valuation (e.g., number of bedrooms, bathrooms, parking, etc.).
- `searchContextSize`: (string, required) — "low", "medium", or "high". Controls the depth of web search context.
- `userLocation`: (object, required)
  - `city`: (string, required)
  - `region`: (string, required)

### Example Payload

```json
{
  "query": {
    "propertyType": "Condominium",
    "propertySize": 131,
    "buildingName": "McKinley Park Residences",
    "propertyAddress": "31st Street, Taguig, Metro Manila",
    "propertyFeatures": ["Fully Furnished"],
    "propertyAmenities": ["Swiming pool", "Gym access", "Near uptown mall"],
    "extraMetadata": {
      "noOfBedrooms": 3,
      "noOfBathrooms": 3
    }
  },
  "searchContextSize": "high",
  "userLocation": {
    "city": "Taguig",
    "region": "Metro Manila"
  }
}
```

---

## Best Practices

- **Provide as much detail as possible.**
  - The more metadata you provide (e.g., number of bedrooms, bathrooms, parking, floor, view, etc.), the more accurate and tailored the valuation will be.
  - Use the `extraMetadata` field for any additional property details not covered by the main fields.
- **Choose an appropriate `searchContextSize`.**
  - "high" will use more web data and context for the valuation, which is recommended for unique or high-value properties.
- **Ensure the address is as complete as possible.**

---

## Response

The response will include a detailed, markdown-formatted valuation report and a structured data table with all key metrics, trends, and comparables. The output is suitable for both human review and programmatic parsing.

---

## Notes

- This service is for informational and preliminary guidance only. It is not a substitute for a formal appraisal by a licensed professional.
- Always review the disclaimers and limitations in the report output.
