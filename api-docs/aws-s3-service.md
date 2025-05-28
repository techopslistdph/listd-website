# AWS S3 Upload Service

This service handles file uploads to AWS S3 or DigitalOcean Spaces and returns public URLs to the uploaded files.

---

## Endpoints

### **POST** /v1/aws-s3

Uploads a file to S3/DigitalOcean Spaces and returns a public URL.

#### Request

- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: File to upload (required)

#### Response

- **Success (200)**:
  ```json
  {
    "success": true,
    "url": "string"
  }
  ```

#### Error Response

- **400 Bad Request**:
  ```json
  {
    "success": false,
    "error": {
      "message": "Missing or invalid file field",
      "code": "INVALID_FILE",
      "status": 400
    }
  }
  ```

- **500 Internal Server Error**:
  ```json
  {
    "success": false,
    "error": {
      "message": "Failed to upload file to S3",
      "code": "UPLOAD_FAILED",
      "status": 500
    }
  }
  ```

---

## Route Implementation

The route implementation in `src/routes/v1/aws-s3.ts`:

```typescript
import { Hono } from "hono";
import { uploadToS3 } from "../../services/aws-sdk";
import { ApiError } from "../../utils/api-error";

const router = new Hono();

router.post("/", async (c) => {
	const formData = await c.req.formData();
	const file = formData.get("file");

	if (!file || typeof file !== "object" || !("arrayBuffer" in file)) {
		throw new ApiError("Missing or invalid file field", 400, "INVALID_FILE");
	}

	const buffer = Buffer.from(await file.arrayBuffer());
	const key = file.name;
	const contentType = file.type || "application/octet-stream";

	const url = await uploadToS3({ key, body: buffer, contentType });

	return c.json({ success: true, url });
});

export default router;
```

### Route Details

1. **Form Data Handling**:
   - Extracts the file from the multipart form data
   - Validates that a valid file is present

2. **File Processing**:
   - Converts the file to a Buffer using its arrayBuffer
   - Uses the filename as the S3 key
   - Determines the content type (defaults to "application/octet-stream")

3. **Error Handling**:
   - Throws `ApiError` with appropriate status code and error code for invalid files

---

## Service Responsibilities

The AWS S3 service handles:

1. File uploads to AWS S3 or DigitalOcean Spaces
2. Image optimization (converting JPG, JPEG, and PNG to WebP format)
3. Organizing files into directories based on content type:
   - Images: `images/`
   - Other files: `assets/`
4. Setting appropriate ACL permissions (`public-read`)
5. Constructing and returning CDN URLs for uploaded files

---

## Example Requests

### Upload an Image

```http
POST /v1/aws-s3 HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="example.jpg"
Content-Type: image/jpeg

(binary file data)
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

#### Response

```json
{
  "success": true,
  "url": "https://cdn.example.com/listd/images/example.webp"
}
```

### Upload a Document

```http
POST /v1/aws-s3 HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="document.pdf"
Content-Type: application/pdf

(binary file data)
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

#### Response

```json
{
  "success": true,
  "url": "https://cdn.example.com/listd/assets/document.pdf"
}
```

---

## Implementation Details

### Image Optimization

- JPG, JPEG, and PNG files are automatically converted to WebP format
- WebP quality is set to 80% (balancing quality and file size)
- File extension is updated accordingly (e.g., `.jpg` → `.webp`)
- WebP files and other image formats are preserved as-is

### Storage Organization

- Images are stored in the `images/` prefix
- Non-image files are stored in the `assets/` prefix
- All files are publicly accessible via CDN

### Error Handling

The service uses the project's standard error handling with `ApiError` and `tryCatch` utilities.
