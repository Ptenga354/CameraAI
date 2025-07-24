# API Changelog

All notable changes to the Camera AI Retail Management API will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Webhook support for real-time notifications
- Batch operations for alerts and cameras
- Export functionality for analytics data
- Advanced filtering options for all endpoints

### Changed
- Improved error response format with more detailed information
- Enhanced pagination with cursor-based navigation option

### Security
- Added rate limiting per API key
- Implemented request signing for webhooks

## [1.0.0] - 2025-01-27

### Added
- Initial API release
- JWT-based authentication system
- Dashboard endpoints for real-time statistics
- Camera management and monitoring
- AI-powered alert system
- Customer analytics and demographics
- Store heatmap functionality
- System settings and configuration
- Comprehensive error handling
- OpenAPI 3.0 specification
- Rate limiting (1000 requests/hour per API key)

### Endpoints Added
- `POST /auth/login` - User authentication
- `GET /dashboard/stats` - Dashboard statistics
- `GET /dashboard/customer-flow` - Customer flow data
- `GET /dashboard/heatmap` - Store heatmap data
- `GET /cameras` - List cameras
- `GET /cameras/{id}` - Get camera details
- `PUT /cameras/{id}` - Update camera
- `POST /cameras` - Create camera
- `DELETE /cameras/{id}` - Delete camera
- `GET /alerts` - List alerts
- `POST /alerts` - Create alert
- `PATCH /alerts/{id}/status` - Update alert status
- `GET /analytics/demographics` - Customer demographics
- `GET /analytics/weekly-flow` - Weekly flow analytics
- `GET /settings` - Get system settings
- `PUT /settings` - Update system settings

### Security
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- HTTPS enforcement
- CORS configuration

## [0.9.0] - 2025-01-20 (Beta)

### Added
- Beta release for testing
- Core camera management functionality
- Basic alert system
- Simple analytics endpoints
- Authentication framework

### Known Issues
- Limited error handling
- No rate limiting
- Basic pagination only

## [0.8.0] - 2025-01-15 (Alpha)

### Added
- Alpha release for internal testing
- Basic CRUD operations for cameras
- Simple authentication
- Minimal error responses

### Limitations
- No analytics functionality
- Limited alert types
- Basic authentication only

---

## Migration Guides

### Migrating from v0.9.x to v1.0.0

#### Breaking Changes

1. **Error Response Format**
   ```diff
   // Old format (v0.9.x)
   {
     "error": "Invalid camera ID"
   }
   
   // New format (v1.0.0)
   {
     "success": false,
     "error": {
       "code": "RESOURCE_NOT_FOUND",
       "message": "Camera not found",
       "timestamp": "2025-01-27T10:30:00Z",
       "requestId": "req_abc123"
     }
   }
   ```

2. **Authentication Header**
   ```diff
   // Old format (v0.9.x)
   - Authorization: Token abc123
   
   // New format (v1.0.0)
   + Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Pagination Response**
   ```diff
   // Old format (v0.9.x)
   {
     "data": [...],
     "page": 1,
     "total": 100
   }
   
   // New format (v1.0.0)
   {
     "success": true,
     "data": [...],
     "meta": {
       "total": 100,
       "limit": 20,
       "offset": 0,
       "hasMore": true
     }
   }
   ```

#### Required Actions

1. **Update Authentication**
   - Replace API tokens with JWT tokens
   - Update login flow to use `/auth/login` endpoint
   - Handle token refresh logic

2. **Update Error Handling**
   - Parse new error response format
   - Handle error codes instead of messages
   - Use `requestId` for support requests

3. **Update Pagination**
   - Use `limit` and `offset` instead of `page`
   - Check `hasMore` for pagination logic
   - Update UI pagination components

#### New Features Available

1. **Enhanced Analytics**
   - Demographics data with age and gender breakdown
   - Weekly flow patterns
   - Heatmap visualization data

2. **Advanced Alerts**
   - Multiple alert types and severities
   - Status management (new, viewed, resolved)
   - Confidence scores for AI detections

3. **System Settings**
   - Configurable alert thresholds
   - Notification preferences
   - Recording settings

### Code Examples

#### Authentication Migration

```javascript
// Old way (v0.9.x)
const response = await fetch('/api/cameras', {
  headers: {
    'Authorization': 'Token abc123'
  }
});

// New way (v1.0.0)
const loginResponse = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { data: { token } } = await loginResponse.json();

const response = await fetch('/api/v1/cameras', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

#### Error Handling Migration

```javascript
// Old way (v0.9.x)
try {
  const response = await fetch('/api/cameras');
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
} catch (error) {
  console.error('Error:', error.message);
}

// New way (v1.0.0)
try {
  const response = await fetch('/api/v1/cameras');
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error.message);
  }
} catch (error) {
  console.error('Error:', error.message);
  // Use result.error.requestId for support
}
```

#### Pagination Migration

```javascript
// Old way (v0.9.x)
const response = await fetch('/api/alerts?page=2');
const { data, page, total } = await response.json();

// New way (v1.0.0)
const response = await fetch('/api/v1/alerts?limit=20&offset=20');
const { success, data, meta } = await response.json();
const { total, hasMore } = meta;
```

## Deprecation Notices

### v1.0.0
- No deprecations in initial release

### Future Deprecations (Planned)
- `GET /cameras` without pagination will be deprecated in v1.1.0
- Legacy alert types will be deprecated in v1.2.0

## Support

For migration assistance:
- Email: api-support@camera-ai-retail.com
- Documentation: https://docs.camera-ai-retail.com/migration
- Community: https://community.camera-ai-retail.com

## Version Support Policy

- **Current Version (v1.x)**: Full support with new features and bug fixes
- **Previous Major Version (v0.x)**: Security updates only for 6 months
- **End of Life**: Announced 3 months in advance

## API Versioning Strategy

- **Major Version**: Breaking changes, new major features
- **Minor Version**: New features, backward compatible
- **Patch Version**: Bug fixes, security updates

Version format: `MAJOR.MINOR.PATCH` (following Semantic Versioning)