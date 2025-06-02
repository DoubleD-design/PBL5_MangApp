# Admin Dashboard Statistics API

This document describes the API endpoints available for the admin dashboard statistics functionality.

## Overview

The statistics API provides data for the admin dashboard, including:

- Dashboard summary (VIP users, page views, revenue)
- Revenue charts (monthly revenue and subscriptions)
- Top manga content by views

## Authentication

All endpoints require admin authentication. Include the JWT token in the Authorization header.

## Endpoints

### Dashboard Summary

Returns a summary of key metrics for the admin dashboard.

```
GET /api/admin/statistics/dashboard
```

**Response:**

```json
{
  "vipUserCount": 120,
  "todayPageViews": 5432,
  "totalRevenue": 15000.5
}
```

### Revenue Chart

Returns monthly revenue data and new VIP subscription counts.

```
GET /api/admin/statistics/revenue
```

**Query Parameters:**

- `startDate` (optional): Start date in ISO format (YYYY-MM-DD)
- `endDate` (optional): End date in ISO format (YYYY-MM-DD)

If dates are not provided, defaults to the current year.

**Response:**

```json
{
  "labels": ["Jan 2023", "Feb 2023", "Mar 2023", ...],
  "revenueData": [1200.50, 1350.75, 1500.25, ...],
  "subscriptionData": [25, 30, 35, ...]
}
```

### Top Manga

Returns the most viewed manga content.

```
GET /api/admin/statistics/top-manga
```

**Query Parameters:**

- `startDate` (optional): Start date in ISO format (YYYY-MM-DD)
- `endDate` (optional): End date in ISO format (YYYY-MM-DD)
- `limit` (optional): Maximum number of results to return (default: 5)

If dates are not provided, returns all-time statistics.

**Response:**

```json
{
  "items": [
    {
      "mangaId": 1,
      "title": "One Piece",
      "coverImage": "https://example.com/covers/one-piece.jpg",
      "viewCount": 10500
    },
    {
      "mangaId": 2,
      "title": "Naruto",
      "coverImage": "https://example.com/covers/naruto.jpg",
      "viewCount": 9800
    },
    ...
  ]
}
```

## Error Handling

All endpoints return standard HTTP status codes:

- 200: Success
- 400: Bad request (invalid parameters)
- 401: Unauthorized (missing or invalid token)
- 403: Forbidden (not an admin user)
- 500: Server error

## Implementation Notes

- The API uses optimized queries to minimize database load
- Date filtering is applied at the database level for efficiency
- Revenue calculations include only completed payments
- View counts are based on reading history entries
