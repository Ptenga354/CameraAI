# cURL Examples

This document provides practical cURL examples for all API endpoints in the Camera AI Retail Management System.

## Authentication

### Login and Get Token

```bash
curl -X POST https://api.camera-ai-retail.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@store.com",
    "password": "your_password"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### Using the Token

Export the token for easier use in subsequent requests:

```bash
export API_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
export API_BASE="https://api.camera-ai-retail.com/v1"
```

## Dashboard Endpoints

### Get Dashboard Statistics

```bash
curl -X GET "$API_BASE/dashboard/stats" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Get Dashboard Statistics for Specific Date

```bash
curl -X GET "$API_BASE/dashboard/stats?date=2025-01-27" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Get Customer Flow Data

```bash
curl -X GET "$API_BASE/dashboard/customer-flow" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Get Customer Flow for Last Week

```bash
curl -X GET "$API_BASE/dashboard/customer-flow?period=week&interval=day" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Get Heatmap Data

```bash
curl -X GET "$API_BASE/dashboard/heatmap" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Get Queue Status

```bash
curl -X GET "$API_BASE/dashboard/queue-status" \
  -H "Authorization: Bearer $API_TOKEN"
```

## Camera Endpoints

### List All Cameras

```bash
curl -X GET "$API_BASE/cameras" \
  -H "Authorization: Bearer $API_TOKEN"
```

### List Online Cameras Only

```bash
curl -X GET "$API_BASE/cameras?status=online" \
  -H "Authorization: Bearer $API_TOKEN"
```

### List Cameras in Specific Zone

```bash
curl -X GET "$API_BASE/cameras?zone=entrance" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Get Camera Details

```bash
curl -X GET "$API_BASE/cameras/cam-001" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Update Camera Settings

```bash
curl -X PUT "$API_BASE/cameras/cam-001" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Camera Name",
    "location": "New Location",
    "zone": "electronics",
    "settings": {
      "motionSensitivity": 0.8,
      "recordingEnabled": true,
      "alertsEnabled": false
    }
  }'
```

### Create New Camera

```bash
curl -X POST "$API_BASE/cameras" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Camera",
    "location": "Storage Room",
    "zone": "storage",
    "streamUrl": "rtmp://stream.example.com/new-cam",
    "settings": {
      "motionSensitivity": 0.7,
      "recordingEnabled": true,
      "alertsEnabled": true
    }
  }'
```

### Delete Camera

```bash
curl -X DELETE "$API_BASE/cameras/cam-001" \
  -H "Authorization: Bearer $API_TOKEN"
```

## Analytics Endpoints

### Get Demographics Data

```bash
curl -X GET "$API_BASE/analytics/demographics" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Get Demographics for Date Range

```bash
curl -X GET "$API_BASE/analytics/demographics?start_date=2025-01-20&end_date=2025-01-27" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Get Demographics for Specific Zone

```bash
curl -X GET "$API_BASE/analytics/demographics?zone=fashion" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Get Weekly Flow Analytics

```bash
curl -X GET "$API_BASE/analytics/weekly-flow" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Get Comprehensive Analytics Report

```bash
curl -X GET "$API_BASE/analytics/report?start_date=2025-01-01&end_date=2025-01-27" \
  -H "Authorization: Bearer $API_TOKEN"
```

## Alert Endpoints

### List All Alerts

```bash
curl -X GET "$API_BASE/alerts" \
  -H "Authorization: Bearer $API_TOKEN"
```

### List New Alerts Only

```bash
curl -X GET "$API_BASE/alerts?status=new" \
  -H "Authorization: Bearer $API_TOKEN"
```

### List High Severity Alerts

```bash
curl -X GET "$API_BASE/alerts?severity=high" \
  -H "Authorization: Bearer $API_TOKEN"
```

### List Alerts by Type

```bash
curl -X GET "$API_BASE/alerts?type=suspicious_behavior" \
  -H "Authorization: Bearer $API_TOKEN"
```

### List Alerts with Multiple Filters

```bash
curl -X GET "$API_BASE/alerts?status=new&severity=high&zone=entrance&limit=10" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Get Alert Details

```bash
curl -X GET "$API_BASE/alerts/alert-001" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Update Alert Status to Viewed

```bash
curl -X PATCH "$API_BASE/alerts/alert-001/status" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "viewed",
    "notes": "Alert reviewed by security team"
  }'
```

### Resolve Alert

```bash
curl -X PATCH "$API_BASE/alerts/alert-001/status" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "resolved",
    "notes": "Issue investigated and resolved",
    "resolvedBy": "security_manager_123"
  }'
```

### Create Manual Alert

```bash
curl -X POST "$API_BASE/alerts" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "maintenance_required",
    "message": "Camera lens needs cleaning",
    "camera": "cam-003",
    "zone": "checkout",
    "severity": "low",
    "metadata": {
      "reportedBy": "staff_456",
      "maintenanceType": "cleaning"
    }
  }'
```

### Bulk Update Alert Status

```bash
curl -X PATCH "$API_BASE/alerts/bulk-update" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "alertIds": ["alert-001", "alert-002", "alert-003"],
    "status": "viewed",
    "notes": "Bulk reviewed by security team"
  }'
```

## Settings Endpoints

### Get System Settings

```bash
curl -X GET "$API_BASE/settings" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Update Alert Thresholds

```bash
curl -X PUT "$API_BASE/settings" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "alertThresholds": {
      "queueLength": 8,
      "crowdDensity": 4,
      "abandonedItemTime": 15
    }
  }'
```

### Update Notification Settings

```bash
curl -X PUT "$API_BASE/settings" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notifications": {
      "emailEnabled": true,
      "smsEnabled": true,
      "webhookEnabled": true,
      "soundAlerts": false
    }
  }'
```

### Get User Management Settings

```bash
curl -X GET "$API_BASE/settings/users" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Create New User

```bash
curl -X POST "$API_BASE/settings/users" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@store.com",
    "name": "New User",
    "role": "operator",
    "permissions": ["read:cameras", "read:alerts"]
  }'
```

## Webhook Endpoints

### List Webhooks

```bash
curl -X GET "$API_BASE/webhooks" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Create Webhook

```bash
curl -X POST "$API_BASE/webhooks" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.com/webhooks/camera-ai",
    "events": ["alert.created", "camera.offline"],
    "secret": "your_webhook_secret_key"
  }'
```

### Update Webhook

```bash
curl -X PUT "$API_BASE/webhooks/webhook-123" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.com/webhooks/camera-ai-updated",
    "events": ["alert.created", "alert.updated", "camera.offline"],
    "active": true
  }'
```

### Delete Webhook

```bash
curl -X DELETE "$API_BASE/webhooks/webhook-123" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Test Webhook

```bash
curl -X POST "$API_BASE/webhooks/webhook-123/test" \
  -H "Authorization: Bearer $API_TOKEN"
```

## Advanced Examples

### Pagination

```bash
# Get alerts with pagination
curl -X GET "$API_BASE/alerts?limit=20&offset=40" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Sorting

```bash
# Get alerts sorted by timestamp (newest first)
curl -X GET "$API_BASE/alerts?sort=-timestamp" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Complex Filtering

```bash
# Get analytics data with multiple filters
curl -X GET "$API_BASE/analytics/demographics?start_date=2025-01-01&end_date=2025-01-27&zone=fashion&age_group=18-25" \
  -H "Authorization: Bearer $API_TOKEN"
```

### File Upload (Camera Configuration)

```bash
# Upload camera configuration file
curl -X POST "$API_BASE/cameras/cam-001/config" \
  -H "Authorization: Bearer $API_TOKEN" \
  -F "config=@camera-config.json"
```

### Export Data

```bash
# Export alerts as CSV
curl -X GET "$API_BASE/alerts/export?format=csv&start_date=2025-01-01&end_date=2025-01-27" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Accept: text/csv" \
  -o alerts-export.csv
```

### Health Check

```bash
# Check API health
curl -X GET "$API_BASE/health" \
  -H "Authorization: Bearer $API_TOKEN"
```

## Error Handling Examples

### Handle 401 Unauthorized

```bash
# This will return 401 if token is invalid
curl -X GET "$API_BASE/cameras" \
  -H "Authorization: Bearer invalid_token" \
  -w "HTTP Status: %{http_code}\n"
```

### Handle 404 Not Found

```bash
# This will return 404 if camera doesn't exist
curl -X GET "$API_BASE/cameras/non-existent-camera" \
  -H "Authorization: Bearer $API_TOKEN" \
  -w "HTTP Status: %{http_code}\n"
```

### Handle 422 Validation Error

```bash
# This will return 422 due to invalid data
curl -X POST "$API_BASE/cameras" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "invalid_field": "value"
  }' \
  -w "HTTP Status: %{http_code}\n"
```

## Batch Operations

### Batch Create Alerts

```bash
curl -X POST "$API_BASE/alerts/batch" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "alerts": [
      {
        "type": "maintenance_required",
        "message": "Camera 1 needs cleaning",
        "camera": "cam-001",
        "severity": "low"
      },
      {
        "type": "maintenance_required", 
        "message": "Camera 2 needs cleaning",
        "camera": "cam-002",
        "severity": "low"
      }
    ]
  }'
```

### Batch Update Camera Settings

```bash
curl -X PATCH "$API_BASE/cameras/batch" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cameras": ["cam-001", "cam-002", "cam-003"],
    "settings": {
      "recordingEnabled": true,
      "motionSensitivity": 0.8
    }
  }'
```

## Tips for Using cURL

### Save Common Headers

Create a file with common headers:

```bash
# headers.txt
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

Use with `-H @headers.txt`:

```bash
curl -X GET "$API_BASE/cameras" -H @headers.txt
```

### Use Configuration File

Create a `.curlrc` file:

```
# .curlrc
header = "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
header = "Content-Type: application/json"
```

### Pretty Print JSON Response

```bash
curl -X GET "$API_BASE/cameras" \
  -H "Authorization: Bearer $API_TOKEN" | jq '.'
```

### Save Response to File

```bash
curl -X GET "$API_BASE/analytics/report" \
  -H "Authorization: Bearer $API_TOKEN" \
  -o analytics-report.json
```

### Include Response Headers

```bash
curl -X GET "$API_BASE/cameras" \
  -H "Authorization: Bearer $API_TOKEN" \
  -i
```

### Verbose Output for Debugging

```bash
curl -X GET "$API_BASE/cameras" \
  -H "Authorization: Bearer $API_TOKEN" \
  -v
```