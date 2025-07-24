# Postman Collection for Camera AI Retail API

This directory contains Postman collections and environments for testing the Camera AI Retail Management System API.

## Files

- `Camera-AI-Retail-API.postman_collection.json` - Main API collection
- `Production.postman_environment.json` - Production environment variables
- `Staging.postman_environment.json` - Staging environment variables
- `Local.postman_environment.json` - Local development environment variables

## Setup Instructions

### 1. Import Collection

1. Open Postman
2. Click "Import" button
3. Select `Camera-AI-Retail-API.postman_collection.json`
4. Click "Import"

### 2. Import Environment

1. Click the gear icon (⚙️) in the top right
2. Click "Import"
3. Select the appropriate environment file
4. Click "Import"

### 3. Set Environment Variables

Select your environment from the dropdown and set these variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `baseUrl` | API base URL | `https://api.camera-ai-retail.com/v1` |
| `authToken` | JWT authentication token | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `userId` | Current user ID | `user_123` |
| `storeId` | Store identifier | `store_456` |

### 4. Authentication

1. Run the "Login" request in the "Authentication" folder
2. The auth token will be automatically set in your environment
3. All subsequent requests will use this token

## Collection Structure

```
Camera AI Retail API/
├── Authentication/
│   ├── Login
│   ├── Refresh Token
│   └── Logout
├── Dashboard/
│   ├── Get Dashboard Stats
│   ├── Get Customer Flow
│   ├── Get Heatmap Data
│   └── Get Queue Status
├── Cameras/
│   ├── List Cameras
│   ├── Get Camera Details
│   ├── Create Camera
│   ├── Update Camera
│   └── Delete Camera
├── Analytics/
│   ├── Get Demographics
│   ├── Get Weekly Flow
│   └── Get Analytics Report
├── Alerts/
│   ├── List Alerts
│   ├── Get Alert Details
│   ├── Create Alert
│   ├── Update Alert Status
│   └── Bulk Update Alerts
├── Settings/
│   ├── Get Settings
│   ├── Update Settings
│   └── User Management/
│       ├── List Users
│       ├── Create User
│       ├── Update User
│       └── Delete User
└── Webhooks/
    ├── List Webhooks
    ├── Create Webhook
    ├── Update Webhook
    ├── Delete Webhook
    └── Test Webhook
```

## Pre-request Scripts

The collection includes pre-request scripts that:

- Automatically refresh expired tokens
- Set dynamic timestamps for requests
- Generate test data for POST requests
- Validate environment variables

## Test Scripts

Each request includes test scripts that:

- Validate response status codes
- Check response structure
- Verify data types
- Set environment variables from responses
- Generate test reports

### Example Test Script

```javascript
// Test for successful response
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test response structure
pm.test("Response has required fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData).to.have.property('data');
});

// Set token from login response
if (pm.response.json().data && pm.response.json().data.token) {
    pm.environment.set("authToken", pm.response.json().data.token);
}
```

## Running Collections

### Run Entire Collection

1. Click the "..." menu next to the collection name
2. Select "Run collection"
3. Choose your environment
4. Click "Run Camera AI Retail API"

### Run with Newman (CLI)

```bash
# Install Newman
npm install -g newman

# Run collection
newman run Camera-AI-Retail-API.postman_collection.json \
  -e Production.postman_environment.json \
  --reporters cli,html \
  --reporter-html-export results.html
```

### Automated Testing

```bash
# Run tests and generate report
newman run Camera-AI-Retail-API.postman_collection.json \
  -e Production.postman_environment.json \
  --reporters junit,json \
  --reporter-junit-export results.xml \
  --reporter-json-export results.json
```

## Environment Variables Reference

### Production Environment

```json
{
  "name": "Production",
  "values": [
    {
      "key": "baseUrl",
      "value": "https://api.camera-ai-retail.com/v1",
      "enabled": true
    },
    {
      "key": "authToken",
      "value": "",
      "enabled": true
    },
    {
      "key": "userId",
      "value": "",
      "enabled": true
    },
    {
      "key": "storeId",
      "value": "store_prod_001",
      "enabled": true
    }
  ]
}
```

### Staging Environment

```json
{
  "name": "Staging",
  "values": [
    {
      "key": "baseUrl",
      "value": "https://staging-api.camera-ai-retail.com/v1",
      "enabled": true
    },
    {
      "key": "authToken",
      "value": "",
      "enabled": true
    },
    {
      "key": "userId",
      "value": "",
      "enabled": true
    },
    {
      "key": "storeId",
      "value": "store_staging_001",
      "enabled": true
    }
  ]
}
```

### Local Environment

```json
{
  "name": "Local",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api/v1",
      "enabled": true
    },
    {
      "key": "authToken",
      "value": "",
      "enabled": true
    },
    {
      "key": "userId",
      "value": "user_local_123",
      "enabled": true
    },
    {
      "key": "storeId",
      "value": "store_local_001",
      "enabled": true
    }
  ]
}
```

## Common Workflows

### 1. Initial Setup Workflow

1. **Login** - Get authentication token
2. **Get Dashboard Stats** - Verify API access
3. **List Cameras** - Check system status
4. **List Alerts** - Review current alerts

### 2. Camera Management Workflow

1. **List Cameras** - View all cameras
2. **Get Camera Details** - Check specific camera
3. **Update Camera** - Modify settings
4. **Verify Update** - Get camera details again

### 3. Alert Management Workflow

1. **List Alerts** - View all alerts
2. **Filter Alerts** - Find specific alerts
3. **Update Alert Status** - Mark as viewed/resolved
4. **Verify Update** - Check alert status

### 4. Analytics Workflow

1. **Get Demographics** - Customer analysis
2. **Get Weekly Flow** - Traffic patterns
3. **Get Analytics Report** - Comprehensive data
4. **Export Data** - Download reports

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check if auth token is set
   - Verify token hasn't expired
   - Run login request again

2. **404 Not Found**
   - Verify the endpoint URL
   - Check if resource exists
   - Confirm environment variables

3. **422 Validation Error**
   - Check request body format
   - Verify required fields
   - Review API documentation

### Debug Mode

Enable debug mode in Postman:

1. Go to Settings (⚙️)
2. Turn on "SSL certificate verification"
3. Enable "Request timeout"
4. Set "Max response size"

### Console Logging

Add console logs to scripts:

```javascript
console.log("Request URL:", pm.request.url);
console.log("Response:", pm.response.json());
console.log("Environment:", pm.environment.toObject());
```

## Best Practices

1. **Use Environment Variables**
   - Never hardcode URLs or tokens
   - Use different environments for different stages

2. **Add Meaningful Tests**
   - Test response structure
   - Validate business logic
   - Check error conditions

3. **Organize Requests**
   - Group related requests in folders
   - Use descriptive names
   - Add documentation

4. **Handle Authentication**
   - Automate token refresh
   - Handle expired tokens gracefully
   - Use pre-request scripts

5. **Monitor Performance**
   - Check response times
   - Monitor success rates
   - Set up alerts for failures

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Install Newman
      run: npm install -g newman
    
    - name: Run API Tests
      run: |
        newman run postman/Camera-AI-Retail-API.postman_collection.json \
          -e postman/Staging.postman_environment.json \
          --reporters cli,junit \
          --reporter-junit-export results.xml
    
    - name: Publish Test Results
      uses: dorny/test-reporter@v1
      if: always()
      with:
        name: API Tests
        path: results.xml
        reporter: java-junit
```

## Support

For issues with the Postman collection:

1. Check the [API Documentation](../README.md)
2. Review [cURL Examples](../examples/curl-examples.md)
3. Contact API support: api-support@camera-ai-retail.com