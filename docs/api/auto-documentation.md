# Auto-Documentation Setup Guide

This guide explains how to set up automatic API documentation generation for the Camera AI Retail Management System.

## OpenAPI/Swagger Setup

### 1. Install Dependencies

```bash
npm install swagger-jsdoc swagger-ui-express
npm install --save-dev @types/swagger-jsdoc @types/swagger-ui-express
```

### 2. Create OpenAPI Configuration

```javascript
// swagger.config.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Camera AI Retail Management API',
      version: '1.0.0',
      description: 'API for managing retail store surveillance and analytics',
      contact: {
        name: 'API Support',
        email: 'api-support@camera-ai-retail.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://api.camera-ai-retail.com/v1',
        description: 'Production server'
      },
      {
        url: 'https://staging-api.camera-ai-retail.com/v1',
        description: 'Staging server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './models/*.js'], // Path to API files
};

const specs = swaggerJSDoc(options);
module.exports = specs;
```

### 3. Add Swagger Annotations

```javascript
/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Retrieve real-time dashboard statistics including visitor counts and system status
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for statistics (YYYY-MM-DD format)
 *       - in: query
 *         name: store_id
 *         schema:
 *           type: string
 *         description: Specific store ID
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DashboardStats'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
```

### 4. Define Schemas

```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardStats:
 *       type: object
 *       properties:
 *         todayVisitors:
 *           type: integer
 *           description: Total visitors today
 *           example: 847
 *         currentVisitors:
 *           type: integer
 *           description: Current visitors in store
 *           example: 23
 *         averageStayTime:
 *           type: number
 *           format: float
 *           description: Average stay time in minutes
 *           example: 18.5
 *         conversionRate:
 *           type: number
 *           format: float
 *           description: Conversion rate percentage
 *           example: 12.8
 *     
 *     Camera:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - location
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: Unique camera identifier
 *           example: cam-001
 *         name:
 *           type: string
 *           description: Camera display name
 *           example: Camera Lối vào chính
 *         location:
 *           type: string
 *           description: Physical location
 *           example: Entrance
 *         status:
 *           type: string
 *           enum: [online, offline, maintenance]
 *           description: Camera operational status
 *           example: online
 *         zone:
 *           type: string
 *           description: Zone identifier
 *           example: entrance
 *     
 *     Alert:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: alert-001
 *         type:
 *           type: string
 *           enum: [suspicious_behavior, crowding, queue_length, abandoned_item, unauthorized_area]
 *           example: suspicious_behavior
 *         message:
 *           type: string
 *           example: Phát hiện hành vi đáng ngờ tại khu thời trang
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: 2025-01-27T10:25:00Z
 *         severity:
 *           type: string
 *           enum: [low, medium, high]
 *           example: high
 *         status:
 *           type: string
 *           enum: [new, viewed, resolved]
 *           example: new
 *     
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: VALIDATION_ERROR
 *             message:
 *               type: string
 *               example: Invalid request parameters
 *             details:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   field:
 *                     type: string
 *                   message:
 *                     type: string
 *   
 *   responses:
 *     UnauthorizedError:
 *       description: Authentication required
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     
 *     NotFoundError:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     
 *     ValidationError:
 *       description: Validation failed
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     
 *     InternalServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 */
```

### 5. Setup Express Route

```javascript
// app.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger.config');

const app = express();

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Camera AI Retail API Documentation'
}));

// JSON endpoint for OpenAPI spec
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecs);
});
```

## Postman Collection Generation

### 1. Install Postman CLI

```bash
npm install -g newman
```

### 2. Create Collection Script

```javascript
// scripts/generate-postman-collection.js
const fs = require('fs');
const swaggerSpecs = require('../swagger.config');

function generatePostmanCollection(openApiSpec) {
  const collection = {
    info: {
      name: openApiSpec.info.title,
      description: openApiSpec.info.description,
      version: openApiSpec.info.version,
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    auth: {
      type: 'bearer',
      bearer: [
        {
          key: 'token',
          value: '{{authToken}}',
          type: 'string'
        }
      ]
    },
    variable: [
      {
        key: 'baseUrl',
        value: openApiSpec.servers[0].url,
        type: 'string'
      },
      {
        key: 'authToken',
        value: '',
        type: 'string'
      }
    ],
    item: []
  };

  // Generate requests from OpenAPI paths
  Object.keys(openApiSpec.paths).forEach(path => {
    Object.keys(openApiSpec.paths[path]).forEach(method => {
      const operation = openApiSpec.paths[path][method];
      
      const request = {
        name: operation.summary || `${method.toUpperCase()} ${path}`,
        request: {
          method: method.toUpperCase(),
          header: [
            {
              key: 'Content-Type',
              value: 'application/json'
            }
          ],
          url: {
            raw: '{{baseUrl}}' + path,
            host: ['{{baseUrl}}'],
            path: path.split('/').filter(p => p)
          }
        }
      };

      // Add query parameters
      if (operation.parameters) {
        request.request.url.query = operation.parameters
          .filter(p => p.in === 'query')
          .map(p => ({
            key: p.name,
            value: p.example || '',
            description: p.description
          }));
      }

      // Add request body for POST/PUT requests
      if (['post', 'put', 'patch'].includes(method) && operation.requestBody) {
        request.request.body = {
          mode: 'raw',
          raw: JSON.stringify(getExampleFromSchema(operation.requestBody.content['application/json'].schema), null, 2)
        };
      }

      collection.item.push(request);
    });
  });

  return collection;
}

function getExampleFromSchema(schema) {
  // Simple example generation from schema
  if (schema.example) return schema.example;
  if (schema.properties) {
    const example = {};
    Object.keys(schema.properties).forEach(key => {
      const prop = schema.properties[key];
      if (prop.example !== undefined) {
        example[key] = prop.example;
      } else if (prop.type === 'string') {
        example[key] = prop.enum ? prop.enum[0] : 'string';
      } else if (prop.type === 'number') {
        example[key] = 0;
      } else if (prop.type === 'boolean') {
        example[key] = false;
      }
    });
    return example;
  }
  return {};
}

// Generate and save collection
const collection = generatePostmanCollection(swaggerSpecs);
fs.writeFileSync('./postman-collection.json', JSON.stringify(collection, null, 2));
console.log('Postman collection generated successfully!');
```

### 3. Add NPM Script

```json
{
  "scripts": {
    "generate:postman": "node scripts/generate-postman-collection.js",
    "test:api": "newman run postman-collection.json -e postman-environment.json"
  }
}
```

## Redoc Setup

### 1. Install Redoc CLI

```bash
npm install -g redoc-cli
```

### 2. Generate Static Documentation

```bash
# Generate from OpenAPI spec
redoc-cli build api-docs.json --output docs/api/index.html

# With custom options
redoc-cli build api-docs.json \
  --output docs/api/index.html \
  --title "Camera AI Retail API" \
  --theme.colors.primary.main="#3B82F6"
```

### 3. Serve Documentation

```bash
# Serve locally
redoc-cli serve api-docs.json --port 8080

# Watch for changes
redoc-cli serve api-docs.json --watch
```

## GitHub Actions for Auto-Documentation

### 1. Create Workflow File

```yaml
# .github/workflows/api-docs.yml
name: Generate API Documentation

on:
  push:
    branches: [main, develop]
    paths: ['routes/**', 'models/**', 'swagger.config.js']
  pull_request:
    branches: [main]

jobs:
  generate-docs:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Generate OpenAPI spec
      run: npm run generate:openapi
    
    - name: Generate Postman collection
      run: npm run generate:postman
    
    - name: Generate Redoc documentation
      run: |
        npm install -g redoc-cli
        redoc-cli build api-docs.json --output docs/api/index.html
    
    - name: Deploy to GitHub Pages
      if: github.ref == 'refs/heads/main'
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./docs
    
    - name: Upload artifacts
      uses: actions/upload-artifact@v3
      with:
        name: api-documentation
        path: |
          docs/
          postman-collection.json
          api-docs.json
```

## Documentation Best Practices

### 1. Keep Documentation in Sync

- Use code annotations for automatic generation
- Set up CI/CD to regenerate docs on code changes
- Version your API documentation alongside your code

### 2. Provide Comprehensive Examples

- Include request/response examples for all endpoints
- Show different scenarios (success, error cases)
- Use realistic data in examples

### 3. Document Error Handling

- List all possible error codes
- Explain what each error means
- Provide troubleshooting guidance

### 4. Include Authentication Details

- Explain how to obtain tokens
- Show how to include authentication in requests
- Document permission requirements

### 5. Maintain Changelog

- Document API changes between versions
- Highlight breaking changes
- Provide migration guides

## Tools Comparison

| Tool | Pros | Cons | Best For |
|------|------|------|----------|
| **Swagger/OpenAPI** | Industry standard, interactive, auto-generation | Learning curve, verbose annotations | Complete API documentation |
| **Postman** | Great for testing, team collaboration | Not ideal for public docs | Internal team documentation |
| **Redoc** | Beautiful output, responsive | Static only, no testing | Public-facing documentation |
| **GitBook** | Rich content, collaborative | Manual maintenance | Comprehensive guides |
| **Notion** | Easy to use, collaborative | Not API-specific | Quick documentation |

## Recommended Workflow

1. **Development**: Use Swagger annotations in code
2. **Testing**: Generate Postman collections for API testing
3. **Documentation**: Use Redoc for beautiful public documentation
4. **Automation**: Set up GitHub Actions for automatic generation
5. **Hosting**: Deploy to GitHub Pages or dedicated documentation site

This setup ensures your API documentation stays current, comprehensive, and accessible to all stakeholders.