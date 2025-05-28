# Listd Valuation Worker: Schema Reuse for BullMQ Jobs

## Overview

To ensure type safety and validation consistency, the Listd Valuation Worker reuses the Zod schema defined for AI valuation input (`webResearchAiSchema` in `src/services/listd-ai/schema.ts`) as the payload schema for BullMQ jobs. This approach guarantees that all job payloads are validated against a single source of truth.

---

## BullMQ API Endpoints

The following endpoints are defined in `src/routes/v1/bullmq.ts` for interacting with the valuation worker queue:

### 1. Enqueue a Job

**Endpoint:** `POST /v1/bullmq/enqueue-job`

**Purpose:**
- Enqueue a new valuation job into the BullMQ queue.
- Validates the request body using the Zod schema (`valuationJobSchema`).

**Request Body:**
- Must include the `type` field set to "valuation"
- Must match the structure defined by `webResearchAiSchema` for the payload details (see [Schema Reuse](#ai-service)).

**Example Request:**
```json
{
  "type": "valuation",
  "query": {
    "propertyType": "Condominium",
    "propertySize": 60,
    "buildingName": "The Albany Luxury Residences",
    "propertyAddress": "McKinley West Park, Chateau Rd, Taguig, Metro Manila",
    "propertyFeatures": ["Fully Furnished", "Balcony"],
    "propertyAmenities": ["Swiming pool", "Gym access"],
    "extraMetadata": {
      "noOfBedrooms": 1,
      "noOfBathrooms": 1,
      "parkingSpace": 1
    }
  },
  "userLocation": {
    "city": "Taguig",
    "region": "Metro Manila"
  }
}
```

**Success Response:**
```json
{
  "success": true,
  "jobId": "64"
}
```

**Error Response:**
- Returns a JSON error with `success: false` and an error message/code if validation or job creation fails.

---

### 2. Get Job Status and Result

**Endpoint:** `GET /v1/bullmq/job-status/:id`

**Purpose:**
- Retrieve the status and result (or error) of a previously enqueued job.
- Handles robust parsing of error reasons, including double-encoded JSON.

**Path Parameter:**
- `id` — The BullMQ job ID returned by the enqueue endpoint.

**Success Response (Completed Job):**
```json
{
  "success": true,
  "data": {
    "id": "64",
    "name": "valuation",
    "state": "completed",
    "result": {
      "valuation": {
        "automatedValuationSummary": "The Albany Luxury Residences in McKinley West, Taguig, is estimated to have a sale value range of PHP 14,000,000 to PHP 16,000,000, with a medium confidence score. The estimated rental value ranges from PHP 80,000 to PHP 90,000 per month, also with a medium confidence score.",
        "executiveSummary": "The Albany Luxury Residences is valued between PHP 14,000,000 and PHP 16,000,000, reflecting its premium status in a high-demand market. The estimated rental value ranges from PHP 80,000 to PHP 90,000 per month, indicating strong rental potential.",
        "keyFindings": "- The property is located in a sought-after area with premium amenities and features.\n- Comparable sales indicate a robust market demand for similar condominiums, supporting the valuation ranges.",
        "valuationRangeSales": {
          "low": 14000000,
          "likely": 15000000,
          "high": 16000000,
          "formattedLow": "₱14,000,000",
          "formattedLikely": "₱15,000,000",
          "formattedHigh": "₱16,000,000",
          "confidenceScoreInPercent": 60,
          "confidenceScoreLabel": "medium"
        },
        "valuationRangeRentals": {
          "low": 80000,
          "likely": 85000,
          "high": 90000,
          "formattedLow": "₱80,000",
          "formattedLikely": "₱85,000",
          "formattedHigh": "₱90,000",
          "confidenceScoreInPercent": 60,
          "confidenceScoreLabel": "medium"
        },
        "salesTrendChartData": {
          "labels": [
            "Q1 2024",
            "Q2 2024",
            "Q3 2024",
            "Q4 2024"
          ],
          "datasets": [
            {
              "label": "Avg. Price per Sqm (PHP)",
              "data": [
                230000,
                235000,
                240000,
                245000
              ]
            }
          ]
        },
        "rentalTrendChartData": {
          "labels": [
            "Q1 2024",
            "Q2 2024",
            "Q3 2024",
            "Q4 2024"
          ],
          "datasets": [
            {
              "label": "Avg. Rent per Sqm (PHP/Month)",
              "data": [
                1200,
                1220,
                1240,
                1260
              ]
            }
          ]
        },
        "compMapData": [
          {
            "title": "The Albany Luxury Residences",
            "type": "Subject",
            "address": "The Albany Luxury Residences, McKinley West Park, Chateau Road, Taguig, Metro Manila",
            "size": 60,
            "price": 15000000,
            "formattedPrice": "₱15,000,000"
          }
        ],
        "compComparisonChartData": {
          "labels": [
            "Subject Property",
            "Comparable 1",
            "Comparable 2",
            "Comparable 3"
          ],
          "datasets": [
            {
              "label": "Price/Sqm (PHP)",
              "data": [
                233333,
                292682,
                358678,
                229474
              ]
            }
          ]
        },
        "keyMetrics": {
          "grossYieldPct": 6.75,
          "netYieldPct": 5.5,
          "capRatePct": 5.25,
          "birZonalValue": 200000,
          "lguAssessedValue": null
        },
        "salesCompSummaryTableData": [
          {
            "size": 123,
            "address": "The Albany, 2BR Unit",
            "price": 36000000,
            "pricePerSqm": 292682,
            "formattedPrice": "₱36,000,000",
            "formattedPricePerSqm": "₱292,682",
            "date": "2024-09-09",
            "distanceKm": 0.1
          },
          {
            "size": 121,
            "address": "The Albany, 2BR Unit",
            "price": 43400000,
            "pricePerSqm": 358678,
            "formattedPrice": "₱43,400,000",
            "formattedPricePerSqm": "₱358,678",
            "date": "2024-11-15",
            "distanceKm": 0.1
          },
          {
            "size": 47.5,
            "address": "The Albany, 2BR Unit",
            "price": 10900000,
            "pricePerSqm": 229474,
            "formattedPrice": "₱10,900,000",
            "formattedPricePerSqm": "₱229,474",
            "date": "2024-08-31",
            "distanceKm": 0.1
          }
        ],
        "rentalCompSummaryTableData": [
          {
            "size": 62,
            "address": "West Gallery Place, 1BR Unit",
            "rent": 100000,
            "rentPerSqm": 1613,
            "formattedRent": "₱100,000",
            "formattedRentPerSqm": "₱1,613",
            "date": "2024-08-31",
            "distanceKm": 1.5
          },
          {
            "size": 76,
            "address": "St. Moritz Private Estates, 2BR Unit",
            "rent": 110000,
            "rentPerSqm": 1447,
            "formattedRent": "₱110,000",
            "formattedRentPerSqm": "₱1,447",
            "date": "2024-08-31",
            "distanceKm": 0.5
          }
        ]
      }
    },
    "failedReason": null,
    "attemptsMade": 1,
    "processedOn": 1746394708093,
    "finishedOn": 1746394742518,
    "durationSeconds": 34
  }
}
```

**Note:** The valuation result is nested inside a `valuation` object within the `result` field.

**Failure Response (Failed Job):**
```json
{
  "success": false,
  "data": {
    "id": "12345",
    "name": "valuation",
    "state": "failed",
    "result": null,
    "failedReason": [
      {
        "code": "invalid_type",
        "expected": "object",
        "received": "undefined",
        "path": ["query"],
        "message": "Required"
      }
    ],
    "attemptsMade": 1,
    "processedOn": 1746371427992,
    "finishedOn": 1746371430997
  }
}
```

**Error Handling:**
- If the job is not found, returns a 404 error with a descriptive message.
- If the job failed, the `failedReason` is parsed and returned as an object or array if possible (handles double-encoded JSON strings).
- For all other states (waiting, active, etc.), `success` is `false` and `result` is `null`.

---

## Sample Job Creation Payload

```json
{
  "type": "valuation",
  "query": {
    "propertyType": "Condominium",
    "propertySize": 60,
    "buildingName": "The Albany Luxury Residences",
    "propertyAddress": "McKinley West Park, Chateau Rd, Taguig, Metro Manila",
    "propertyFeatures": ["Fully Furnished", "Balcony"],
    "propertyAmenities": ["Swiming pool", "Gym access"],
    "extraMetadata": {
      "noOfBedrooms": 1,
      "noOfBathrooms": 1,
      "parkingSpace": 1
    }
  },
  "userLocation": {
    "city": "Taguig",
    "region": "Metro Manila"
  }
}
```

---

## How to Reuse the Zod Schema for BullMQ Jobs

### 1. Import the AI Input Schema

In your BullMQ schema file (`src/services/bullmq/schema.ts`), import the Zod schema from the AI service:

```ts
import { webResearchAiSchema } from "../listd-ai/schema";
```

### 2. Use the Imported Schema as the Payload

Update your BullMQ job schema to use the imported schema for its `payload`:

```ts
export const valuationJobSchema = z.object({
  type: z.literal("valuation"),
  payload: webResearchAiSchema, // Use the imported schema here
});
```

### 3. Type Inference

You can now infer types for your job data:

```ts
export type ValuationJobData = z.infer<typeof valuationJobSchema>;
export type ListdJobData = z.infer<typeof listdJobSchema>;
```

---

## Example: Full BullMQ Schema File

```ts
import { z } from "zod";
import { webResearchAiSchema } from "../listd-ai/schema";

export const valuationJobSchema = z.object({
  type: z.literal("valuation"),
  payload: webResearchAiSchema,
});

export const listdJobSchema = z.discriminatedUnion("type", [
  valuationJobSchema,
  // Add more job schemas here
]);

export type ValuationJobData = z.infer<typeof valuationJobSchema>;
export type ListdJobData = z.infer<typeof listdJobSchema>;
```

---

## Benefits

- **Single Source of Truth:** Only define your payload schema once, reducing duplication and risk of inconsistency.
- **Type Safety:** All job creation, validation, and processing are type-safe and consistent across the codebase.
- **Validation:** Zod automatically validates the payload structure for every job.

---

## References
- [`src/services/listd-ai/schema.ts`](../../src/services/listd-ai/schema.ts)
- [`src/services/bullmq/schema.ts`](../../src/services/bullmq/schema.ts)
- [`src/routes/v1/bullmq.ts`](../../src/routes/v1/bullmq.ts)
