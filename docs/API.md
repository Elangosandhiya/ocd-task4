# Business Directory API

A small Express and PostgreSQL API. All successful responses use `success: true`;
errors use `{ "success": false, "message": "...", "errors": [] }`.

## Setup

1. Create a PostgreSQL database and run `schema.sql`, then optionally run `seed.sql`.
2. Copy `.env.example` to `.env` and set `DATABASE_URL`, `CLIENT_ORIGIN`, and a
   random `JWT_SECRET` of at least 32 characters.
3. Generate an admin password hash with
   `node -e "require('bcryptjs').hash('your-password', 12).then(console.log)"`.
   Put the result in `ADMIN_PASSWORD_HASH` and choose `ADMIN_USERNAME`.
4. Run `npm install`, then `npm start` (or `npm run dev`).

`CLIENT_ORIGIN` can contain a comma-separated allowlist. The API listens on port
3000 unless `PORT` is set.

## Authentication

`POST /api/auth/login` is public. Use the returned token as
`Authorization: Bearer <token>` for protected routes.

Request:

```json
{ "username": "admin", "password": "your-password" }
```

Response:

```json
{
  "success": true,
  "data": { "token": "<jwt>", "token_type": "Bearer", "expires_in": "1h" }
}
```

## Businesses

### `GET /api/businesses`

Optional query parameters: `search` (case-insensitive partial name),
`category` (positive category ID), `location` (case-insensitive partial match),
`featured` (`true` or `false`), `page` (default 1), `limit` (default 10, max 50),
and `sort` (`newest` or `name`). Featured businesses are listed first; the
selected sort order is applied within that grouping.

Example: `GET /api/businesses?search=cafe&location=chennai&page=1&limit=10`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Copper Kettle Cafe",
      "description": "Neighborhood cafe serving breakfast and fresh coffee.",
      "category_id": 1,
      "category_name": "Food & Dining",
      "address": "12 Lake View Road",
      "location": "Chennai",
      "contact_number": "+91 90000 10001",
      "whatsapp_number": "+91 90000 10001",
      "website_url": "https://copperkettle.example",
      "image_url": null,
      "is_featured": true,
      "created_at": "2026-01-01T10:00:00.000Z",
      "updated_at": "2026-01-01T10:00:00.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
}
```

### `GET /api/businesses/:id`

Returns one business with `category_name`. A missing ID returns 404.

### Protected business routes

- `POST /api/businesses` creates a business and returns 201.
- `PUT /api/businesses/:id` replaces the business fields and returns 200.
- `DELETE /api/businesses/:id` deletes a business and returns 200.
- `PATCH /api/businesses/:id/featured` updates its featured flag.

Create/update request body (website and image URLs may be `null` or omitted):

```json
{
  "name": "Copper Kettle Cafe",
  "description": "Neighborhood cafe serving breakfast and fresh coffee.",
  "category_id": 1,
  "address": "12 Lake View Road",
  "location": "Chennai",
  "contact_number": "+91 90000 10001",
  "whatsapp_number": "+91 90000 10001",
  "website_url": "https://copperkettle.example",
  "image_url": null,
  "is_featured": true
}
```

Featured request body:

```json
{ "is_featured": true }
```

## Categories and locations

- `GET /api/categories` lists categories and their `business_count`.
- Protected `POST /api/categories` with `{ "name": "Retail" }` creates one.
- Protected `PUT /api/categories/:id` with `{ "name": "Shops" }` renames one.
- Protected `DELETE /api/categories/:id` deletes one. A category referenced by a
  business cannot be deleted; PostgreSQL reports the constraint error.
- `GET /api/locations` returns distinct location names for a filter dropdown.

## Errors and status codes

Validation errors return 400 with field-level details in `errors`. Invalid
credentials/tokens return 401, missing records/routes return 404, and duplicate
category names return 409. Unexpected errors return 500 without stack traces.
