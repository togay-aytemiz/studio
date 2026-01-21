# Virtual Try-On API Documentation

**Version:** 1.0.0  
**Base URL:** `https://tryon-api-production-657d.up.railway.app`  
**Swagger UI:** `https://tryon-api-production-657d.up.railway.app/documentation`  
*(Alternate for Dev: `http://localhost:8080`)*

## Authentication

All API requests must include the `x-api-key` header.

| Header | Type | Description |
| :--- | :--- | :--- |
| `x-api-key` | `string` | Your unique secret API key. |

---

## Netlify Proxy Configuration

When using Netlify Functions as a proxy:

- `TRYON_API_KEY` (required): the API key used in the `x-api-key` header.
- `TRYON_API_BASE_URL` (optional): defaults to the production base URL if not set.
  - Production: `https://tryon-api-production-657d.up.railway.app`
  - Local: `http://localhost:8080`

---

## Workflow Logic (Frontend Guide)

Since image generation takes time (10-20 seconds), this API uses an asynchronous polling method:

1. Request: You send the images via `POST /api/v1/try-on`.
2. Ack: API validates inputs and immediately returns a `jobId`.
3. Wait: Your frontend should show a "Generating..." spinner.
4. Poll: Every 3-5 seconds, call `GET /api/v1/try-on/status/:jobId`.
5. Result:
   - If `status` is `processing` -> wait and ask again.
   - If `status` is `completed` -> show the image from `result.resultUrl`.
   - If `status` is `failed` -> check the `error` message.

---

## Handling Sensitive Content (Safety)

The AI checks both inputs and outputs for NSF (Not Safe For Work) content. If detected, the job will fail.

Frontend logic:
You should check if the error message contains "Content Blocked".

Possible blocking reasons (strings to watch for):
The `error` field will contain one or more of these categories:
- `HARM_CATEGORY_SEXUALLY_EXPLICIT`
- `HARM_CATEGORY_HATE_SPEECH`
- `HARM_CATEGORY_HARASSMENT`
- `HARM_CATEGORY_DANGEROUS_CONTENT`

Example safety error:
```json
{
  "jobId": "...",
  "status": "failed",
  "error": "Content Blocked: The AI identified the input or generated image as unsafe (Reason: HARM_CATEGORY_SEXUALLY_EXPLICIT: MEDIUM)."
}
```

Suggested UI action: "The image could not be processed due to safety guidelines. Please upload a different photo."

---

## Endpoints

### 1. Submit Virtual Try-On Job

Initiates an asynchronous Try-On process.

**Endpoint:** `POST /api/v1/try-on`  
**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `garment` | `File` | **Yes*** | The clothing image file (JPG, PNG, WEBP). |
| `garment_url` | `String` | **Yes*** | Alternative to `garment`. URL of the clothing image. |
| `body` | `File` | **Yes** | The person's full body photo. |
| `face` | `File` | No | Optional close-up face photo for better detail. |

*Note: You must provide either `garment` (file) or `garment_url` (string).*
*Implementation note: The current try-on web demo sends `garment` as a file only; `garment_url` is not supported yet.*

Success response (202 Accepted):
```json
{
  "jobId": "bdf74edd-6c44-4da7-8a89-ac7d6611f2ca",
  "status": "queued",
  "message": "Job submitted successfully."
}
```

Error response (400 Bad Request):
```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "error": "Bad Request",
  "message": "body/garment_url must be string"
}
```

---

### 2. Check Job Status

Poll this endpoint to retrieve the result.

**Endpoint:** `GET /api/v1/try-on/status/:jobId`

| Param | Type | Description |
| :--- | :--- | :--- |
| `jobId` | `string` | The ID returned from the Submit endpoint. |

Response (processing):
```json
{
  "jobId": "bdf74edd-6c44-4da7-8a89-ac7d6611f2ca",
  "status": "processing",
  "progress": 0
}
```

Response (completed):
```json
{
  "jobId": "bdf74edd-6c44-4da7-8a89-ac7d6611f2ca",
  "status": "completed",
  "result": {
    "resultKey": "results/dd07fc4e....jpg",
    "resultUrl": "https://pub-<ID>.r2.dev/results/dd07fc4e....jpg"
  }
}
```

Response (failed):
```json
{
  "jobId": "...",
  "status": "failed",
  "error": "The specified key does not exist."
}
```

---

## Error Codes

The API uses standard HTTP status codes and custom application codes.

| Status | Code | Meaning |
| :--- | :--- | :--- |
| `400` | `VALIDATION_ERROR` | Invalid input format or missing fields. |
| `401` | `AUTHENTICATION_ERROR` | Missing or invalid API key. |
| `404` | `NOT_FOUND` | Job ID not found or resource missing. |
| `429` | `RATE_LIMIT` | Too many requests. Retry later. |
| `500` | `INTERNAL_ERROR` | Unexpected server error. |
| `502` | `EXTERNAL_SERVICE_ERROR` | Gemini AI or storage provider failed. |
