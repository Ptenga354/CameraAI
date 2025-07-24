# Camera AI Retail Management System - API Documentation

## Overview

The Camera AI Retail Management System API provides endpoints for managing retail store surveillance, analytics, and AI-powered insights. This RESTful API enables real-time monitoring, customer analytics, alert management, and system configuration.

**Base URL:** `https://api.camera-ai-retail.com/v1`

**API Version:** v1.0.0

**Last Updated:** 2025-01-27

## Table of Contents

1. [Authentication](#authentication)
2. [Error Handling](#error-handling)
3. [Rate Limiting](#rate-limiting)
4. [Endpoints](#endpoints)
   - [Dashboard](#dashboard-endpoints)
   - [Cameras](#camera-endpoints)
   - [Analytics](#analytics-endpoints)
   - [Alerts](#alert-endpoints)
   - [Settings](#settings-endpoints)
5. [Webhooks](#webhooks)
6. [SDKs and Tools](#sdks-and-tools)

## Authentication

The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header for all requests.

### Authentication Flow

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "role": "manager",
      "permissions": ["read:cameras", "write:alerts"]
    }
  }
}
```

### Using the Token

Include the JWT token in all API requests:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Error Handling

The API uses conventional HTTP response codes and returns detailed error information in JSON format.

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "camera_id",
        "message": "Camera ID is required"
      }
    ],
    "timestamp": "2025-01-27T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Service temporarily unavailable |

### Common Error Codes

| Error Code | Description |
|------------|-------------|
| `AUTHENTICATION_REQUIRED` | Valid authentication token required |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `VALIDATION_ERROR` | Request validation failed |
| `RESOURCE_NOT_FOUND` | Requested resource does not exist |
| `RATE_LIMIT_EXCEEDED` | API rate limit exceeded |
| `CAMERA_OFFLINE` | Camera is not available |
| `INVALID_TIME_RANGE` | Invalid date/time range specified |

## Rate Limiting

API requests are rate limited to ensure fair usage and system stability.

**Limits:**
- 1000 requests per hour per API key
- 100 requests per minute per IP address
- 10 concurrent connections per API key

**Headers:**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1643723400
```

## Endpoints

### Dashboard Endpoints

#### Get Dashboard Statistics

Retrieve real-time dashboard statistics including visitor counts, conversion rates, and system status.

```http
GET /dashboard/stats
```

**Parameters:**
- `date` (optional): Date for statistics (YYYY-MM-DD format, defaults to today)
- `store_id` (optional): Specific store ID (defaults to all stores)

**Response:**
```json
{
  "success": true,
  "data": {
    "todayVisitors": 847,
    "currentVisitors": 23,
    "averageStayTime": 18.5,
    "conversionRate": 12.8,
    "peakHour": "14:00",
    "busyZones": ["fashion", "electronics"],
    "systemStatus": {
      "camerasOnline": 5,
      "camerasTotal": 6,
      "alertsUnresolved": 3
    }
  },
  "meta": {
    "lastUpdated": "2025-01-27T10:30:00Z",
    "dataSource": "real-time"
  }
}
```

#### Get Customer Flow Data

Retrieve customer flow data for charts and analytics.

```http
GET /dashboard/customer-flow
```

**Parameters:**
- `period` (optional): Time period (`today`, `yesterday`, `week`, `month`)
- `interval` (optional): Data interval (`hour`, `day`)
- `start_date` (optional): Start date (ISO 8601 format)
- `end_date` (optional): End date (ISO 8601 format)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2025-01-27T08:00:00Z",
      "count": 12,
      "hour": 8
    },
    {
      "timestamp": "2025-01-27T09:00:00Z",
      "count": 25,
      "hour": 9
    }
  ],
  "meta": {
    "total": 24,
    "period": "today",
    "interval": "hour"
  }
}
```

#### Get Heatmap Data

Retrieve heatmap data for store activity visualization.

```http
GET /dashboard/heatmap
```

**Parameters:**
- `date` (optional): Date for heatmap data
- `zone` (optional): Specific zone filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "x": 10,
      "y": 90,
      "intensity": 0.9,
      "zone": "entrance"
    },
    {
      "x": 30,
      "y": 70,
      "intensity": 0.6,
      "zone": "fashion"
    }
  ],
  "meta": {
    "maxIntensity": 1.0,
    "dataPoints": 15,
    "lastUpdated": "2025-01-27T10:25:00Z"
  }
}
```

### Camera Endpoints

#### List All Cameras

Retrieve a list of all cameras in the system.

```http
GET /cameras
```

**Parameters:**
- `status` (optional): Filter by status (`online`, `offline`, `maintenance`)
- `zone` (optional): Filter by zone
- `limit` (optional): Number of results (default: 50, max: 100)
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cam-001",
      "name": "Camera Lối vào chính",
      "location": "Entrance",
      "status": "online",
      "streamUrl": "rtmp://stream.example.com/cam-001",
      "zone": "entrance",
      "resolution": "1920x1080",
      "fps": 30,
      "lastSeen": "2025-01-27T10:30:00Z",
      "capabilities": ["motion_detection", "face_recognition", "object_tracking"]
    }
  ],
  "meta": {
    "total": 6,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

#### Get Camera Details

Retrieve detailed information about a specific camera.

```http
GET /cameras/{camera_id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cam-001",
    "name": "Camera Lối vào chính",
    "location": "Entrance",
    "status": "online",
    "streamUrl": "rtmp://stream.example.com/cam-001",
    "zone": "entrance",
    "resolution": "1920x1080",
    "fps": 30,
    "lastSeen": "2025-01-27T10:30:00Z",
    "capabilities": ["motion_detection", "face_recognition", "object_tracking"],
    "settings": {
      "motionSensitivity": 0.7,
      "recordingEnabled": true,
      "alertsEnabled": true
    },
    "stats": {
      "uptime": 99.8,
      "avgBandwidth": "2.5 Mbps",
      "storageUsed": "45.2 GB"
    }
  }
}
```

#### Update Camera Settings

Update camera configuration and settings.

```http
PUT /cameras/{camera_id}
```

**Request Body:**
```json
{
  "name": "Updated Camera Name",
  "location": "New Location",
  "zone": "electronics",
  "settings": {
    "motionSensitivity": 0.8,
    "recordingEnabled": true,
    "alertsEnabled": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cam-001",
    "name": "Updated Camera Name",
    "location": "New Location",
    "zone": "electronics",
    "status": "online",
    "updatedAt": "2025-01-27T10:35:00Z"
  }
}
```

### Analytics Endpoints

#### Get Demographics Data

Retrieve customer demographics analytics.

```http
GET /analytics/demographics
```

**Parameters:**
- `start_date` (optional): Start date for analysis
- `end_date` (optional): End date for analysis
- `zone` (optional): Filter by specific zone

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "age_group": "18-25",
      "gender": "female",
      "count": 52,
      "percentage": 29.0
    },
    {
      "age_group": "26-35",
      "gender": "male",
      "count": 38,
      "percentage": 21.0
    }
  ],
  "meta": {
    "totalSamples": 180,
    "confidenceLevel": 0.85,
    "period": "last_7_days"
  }
}
```

#### Get Weekly Flow Analytics

Retrieve weekly customer flow analytics.

```http
GET /analytics/weekly-flow
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "day": "monday",
      "dayName": "Thứ 2",
      "visitors": 245,
      "avgStayTime": 16.5,
      "peakHour": "15:00"
    },
    {
      "day": "tuesday",
      "dayName": "Thứ 3", 
      "visitors": 278,
      "avgStayTime": 18.2,
      "peakHour": "14:00"
    }
  ],
  "meta": {
    "weekStart": "2025-01-20",
    "weekEnd": "2025-01-26",
    "totalVisitors": 2301
  }
}
```

### Alert Endpoints

#### List Alerts

Retrieve a list of alerts with filtering options.

```http
GET /alerts
```

**Parameters:**
- `status` (optional): Filter by status (`new`, `viewed`, `resolved`)
- `type` (optional): Filter by alert type
- `severity` (optional): Filter by severity (`low`, `medium`, `high`)
- `start_date` (optional): Start date filter
- `end_date` (optional): End date filter
- `camera_id` (optional): Filter by camera
- `zone` (optional): Filter by zone
- `limit` (optional): Number of results (default: 20, max: 100)
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "alert-001",
      "type": "suspicious_behavior",
      "message": "Phát hiện hành vi đáng ngờ tại khu thời trang",
      "timestamp": "2025-01-27T10:25:00Z",
      "camera": "cam-002",
      "zone": "fashion",
      "status": "new",
      "severity": "high",
      "confidence": 0.92,
      "metadata": {
        "detectionType": "loitering",
        "duration": 180,
        "boundingBox": {
          "x": 100,
          "y": 150,
          "width": 80,
          "height": 120
        }
      }
    }
  ],
  "meta": {
    "total": 45,
    "unresolved": 8,
    "limit": 20,
    "offset": 0
  }
}
```

#### Update Alert Status

Update the status of a specific alert.

```http
PATCH /alerts/{alert_id}/status
```

**Request Body:**
```json
{
  "status": "resolved",
  "notes": "Issue investigated and resolved",
  "resolvedBy": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "alert-001",
    "status": "resolved",
    "resolvedAt": "2025-01-27T10:40:00Z",
    "resolvedBy": "user_123",
    "notes": "Issue investigated and resolved"
  }
}
```

#### Create Manual Alert

Create a manual alert entry.

```http
POST /alerts
```

**Request Body:**
```json
{
  "type": "maintenance_required",
  "message": "Camera requires cleaning",
  "camera": "cam-003",
  "zone": "checkout",
  "severity": "low",
  "metadata": {
    "reportedBy": "staff_456",
    "maintenanceType": "cleaning"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "alert-123",
    "type": "maintenance_required",
    "message": "Camera requires cleaning",
    "timestamp": "2025-01-27T10:45:00Z",
    "camera": "cam-003",
    "zone": "checkout",
    "status": "new",
    "severity": "low"
  }
}
```

### Settings Endpoints

#### Get System Settings

Retrieve current system configuration.

```http
GET /settings
```

**Response:**
```json
{
  "success": true,
  "data": {
    "alertThresholds": {
      "queueLength": 5,
      "crowdDensity": 3,
      "abandonedItemTime": 10
    },
    "notifications": {
      "emailEnabled": true,
      "smsEnabled": false,
      "webhookEnabled": true,
      "soundAlerts": true
    },
    "recording": {
      "enabled": true,
      "retention": 30,
      "quality": "high"
    },
    "analytics": {
      "demographicsEnabled": true,
      "heatmapEnabled": true,
      "flowAnalysisEnabled": true
    }
  }
}
```

#### Update System Settings

Update system configuration.

```http
PUT /settings
```

**Request Body:**
```json
{
  "alertThresholds": {
    "queueLength": 8,
    "crowdDensity": 4,
    "abandonedItemTime": 15
  },
  "notifications": {
    "emailEnabled": true,
    "smsEnabled": true,
    "soundAlerts": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "updated": true,
    "timestamp": "2025-01-27T10:50:00Z",
    "updatedBy": "user_123"
  }
}
```

## Webhooks

The API supports webhooks for real-time notifications of important events.

### Webhook Events

| Event | Description |
|-------|-------------|
| `alert.created` | New alert generated |
| `alert.updated` | Alert status changed |
| `camera.offline` | Camera went offline |
| `camera.online` | Camera came online |
| `threshold.exceeded` | Alert threshold exceeded |

### Webhook Payload Example

```json
{
  "event": "alert.created",
  "timestamp": "2025-01-27T10:55:00Z",
  "data": {
    "id": "alert-456",
    "type": "suspicious_behavior",
    "severity": "high",
    "camera": "cam-002",
    "zone": "fashion"
  },
  "signature": "sha256=abc123..."
}
```

### Webhook Configuration

```http
POST /webhooks
```

**Request Body:**
```json
{
  "url": "https://your-app.com/webhooks/camera-ai",
  "events": ["alert.created", "camera.offline"],
  "secret": "your_webhook_secret"
}
```

## SDKs and Tools

### Recommended Tools for API Documentation

1. **OpenAPI/Swagger**
   - Generate interactive documentation
   - Auto-generate client SDKs
   - API testing interface

2. **Postman**
   - API testing and documentation
   - Team collaboration
   - Automated testing

3. **Insomnia**
   - REST client and documentation
   - GraphQL support
   - Environment management

4. **Redoc**
   - Beautiful API documentation
   - Three-panel design
   - Responsive layout

### Auto-Documentation Setup

See [Auto-Documentation Guide](./auto-documentation.md) for detailed setup instructions.

## Support

For API support and questions:
- Email: api-support@camera-ai-retail.com
- Documentation: https://docs.camera-ai-retail.com
- Status Page: https://status.camera-ai-retail.com

---

**API Version:** v1.0.0  
**Last Updated:** 2025-01-27  
**Next Review:** 2025-02-27