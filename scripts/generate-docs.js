#!/usr/bin/env node

/**
 * Documentation Generation Script
 * 
 * This script generates various documentation formats from the OpenAPI specification:
 * - HTML documentation using Redoc
 * - Postman collection for API testing
 * - Markdown documentation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  openApiFile: 'docs/api/openapi.yaml',
  outputDir: 'docs/api/generated',
  postmanCollection: 'docs/api/postman/Camera-AI-Retail-API.postman_collection.json',
  markdownOutput: 'docs/api/generated/api-reference.md'
};

// Ensure output directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
  }
}

// Generate HTML documentation using Redoc
function generateHtmlDocs() {
  console.log('📖 Generating HTML documentation...');
  
  try {
    const outputFile = path.join(config.outputDir, 'index.html');
    
    execSync(`npx redoc-cli build ${config.openApiFile} --output ${outputFile} --title "Camera AI Retail API Documentation"`, {
      stdio: 'inherit'
    });
    
    console.log(`✅ HTML documentation generated: ${outputFile}`);
  } catch (error) {
    console.error('❌ Failed to generate HTML documentation:', error.message);
    process.exit(1);
  }
}

// Generate Postman collection
function generatePostmanCollection() {
  console.log('📮 Generating Postman collection...');
  
  try {
    // Install openapi-to-postman if not available
    try {
      require('openapi-to-postman');
    } catch (e) {
      console.log('Installing openapi-to-postman...');
      execSync('npm install -g openapi-to-postman', { stdio: 'inherit' });
    }
    
    execSync(`openapi2postmanv2 -s ${config.openApiFile} -o ${config.postmanCollection} --pretty`, {
      stdio: 'inherit'
    });
    
    console.log(`✅ Postman collection generated: ${config.postmanCollection}`);
  } catch (error) {
    console.error('❌ Failed to generate Postman collection:', error.message);
    console.log('💡 You can manually convert the OpenAPI spec at: https://www.postman.com/api-platform/api-converter/');
  }
}

// Generate markdown documentation
function generateMarkdownDocs() {
  console.log('📝 Generating Markdown documentation...');
  
  try {
    // Install widdershins if not available
    try {
      require('widdershins');
    } catch (e) {
      console.log('Installing widdershins...');
      execSync('npm install -g widdershins', { stdio: 'inherit' });
    }
    
    execSync(`widdershins ${config.openApiFile} -o ${config.markdownOutput} --language_tabs 'javascript:JavaScript' 'python:Python' 'shell:cURL'`, {
      stdio: 'inherit'
    });
    
    console.log(`✅ Markdown documentation generated: ${config.markdownOutput}`);
  } catch (error) {
    console.error('❌ Failed to generate Markdown documentation:', error.message);
  }
}

// Generate environment files for Postman
function generatePostmanEnvironments() {
  console.log('🌍 Generating Postman environments...');
  
  const environments = [
    {
      name: 'Production',
      baseUrl: 'https://api.camera-ai-retail.com/v1',
      filename: 'Production.postman_environment.json'
    },
    {
      name: 'Staging',
      baseUrl: 'https://staging-api.camera-ai-retail.com/v1',
      filename: 'Staging.postman_environment.json'
    },
    {
      name: 'Local',
      baseUrl: 'http://localhost:3000/api/v1',
      filename: 'Local.postman_environment.json'
    }
  ];
  
  environments.forEach(env => {
    const environment = {
      id: `env_${env.name.toLowerCase()}_${Date.now()}`,
      name: env.name,
      values: [
        {
          key: 'baseUrl',
          value: env.baseUrl,
          enabled: true,
          type: 'default'
        },
        {
          key: 'authToken',
          value: '',
          enabled: true,
          type: 'secret'
        },
        {
          key: 'userId',
          value: '',
          enabled: true,
          type: 'default'
        },
        {
          key: 'storeId',
          value: env.name === 'Local' ? 'store_local_001' : `store_${env.name.toLowerCase()}_001`,
          enabled: true,
          type: 'default'
        }
      ],
      _postman_variable_scope: 'environment'
    };
    
    const filePath = path.join('docs/api/postman', env.filename);
    fs.writeFileSync(filePath, JSON.stringify(environment, null, 2));
    console.log(`✅ Generated environment: ${filePath}`);
  });
}

// Generate API client examples
function generateClientExamples() {
  console.log('💻 Generating client examples...');
  
  const clientsDir = path.join(config.outputDir, 'clients');
  ensureDirectoryExists(clientsDir);
  
  // JavaScript/Node.js example
  const jsExample = `
// Camera AI Retail API Client Example (JavaScript/Node.js)

class CameraAIClient {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async request(endpoint, options = {}) {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    const config = {
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error.message);
    }

    return data.data;
  }

  // Dashboard methods
  async getDashboardStats(date) {
    const params = date ? \`?date=\${date}\` : '';
    return this.request(\`/dashboard/stats\${params}\`);
  }

  async getCustomerFlow(period = 'today') {
    return this.request(\`/dashboard/customer-flow?period=\${period}\`);
  }

  // Camera methods
  async getCameras(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.request(\`/cameras?\${params}\`);
  }

  async getCamera(cameraId) {
    return this.request(\`/cameras/\${cameraId}\`);
  }

  async updateCamera(cameraId, data) {
    return this.request(\`/cameras/\${cameraId}\`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Alert methods
  async getAlerts(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.request(\`/alerts?\${params}\`);
  }

  async updateAlertStatus(alertId, status, notes) {
    return this.request(\`/alerts/\${alertId}/status\`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    });
  }
}

// Usage example
const client = new CameraAIClient('https://api.camera-ai-retail.com/v1', 'your-jwt-token');

// Get dashboard stats
client.getDashboardStats()
  .then(stats => console.log('Dashboard stats:', stats))
  .catch(error => console.error('Error:', error));

// Get online cameras
client.getCameras({ status: 'online' })
  .then(cameras => console.log('Online cameras:', cameras))
  .catch(error => console.error('Error:', error));

module.exports = CameraAIClient;
`;

  fs.writeFileSync(path.join(clientsDir, 'javascript-client.js'), jsExample);
  
  // Python example
  const pythonExample = `
# Camera AI Retail API Client Example (Python)

import requests
from typing import Dict, List, Optional
from datetime import datetime

class CameraAIClient:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })

    def _request(self, endpoint: str, method: str = 'GET', **kwargs) -> Dict:
        url = f"{self.base_url}{endpoint}"
        response = self.session.request(method, url, **kwargs)
        
        data = response.json()
        if not data.get('success', False):
            raise Exception(data.get('error', {}).get('message', 'Unknown error'))
        
        return data.get('data')

    # Dashboard methods
    def get_dashboard_stats(self, date: Optional[str] = None) -> Dict:
        params = {'date': date} if date else {}
        return self._request('/dashboard/stats', params=params)

    def get_customer_flow(self, period: str = 'today') -> List[Dict]:
        return self._request('/dashboard/customer-flow', params={'period': period})

    # Camera methods
    def get_cameras(self, **filters) -> List[Dict]:
        return self._request('/cameras', params=filters)

    def get_camera(self, camera_id: str) -> Dict:
        return self._request(f'/cameras/{camera_id}')

    def update_camera(self, camera_id: str, data: Dict) -> Dict:
        return self._request(f'/cameras/{camera_id}', method='PUT', json=data)

    # Alert methods
    def get_alerts(self, **filters) -> List[Dict]:
        return self._request('/alerts', params=filters)

    def update_alert_status(self, alert_id: str, status: str, notes: str = '') -> Dict:
        data = {'status': status, 'notes': notes}
        return self._request(f'/alerts/{alert_id}/status', method='PATCH', json=data)

# Usage example
if __name__ == '__main__':
    client = CameraAIClient('https://api.camera-ai-retail.com/v1', 'your-jwt-token')
    
    try:
        # Get dashboard stats
        stats = client.get_dashboard_stats()
        print(f"Today's visitors: {stats['todayVisitors']}")
        
        # Get online cameras
        cameras = client.get_cameras(status='online')
        print(f"Online cameras: {len(cameras)}")
        
        # Get new alerts
        alerts = client.get_alerts(status='new')
        print(f"New alerts: {len(alerts)}")
        
    except Exception as e:
        print(f"Error: {e}")
`;

  fs.writeFileSync(path.join(clientsDir, 'python-client.py'), pythonExample);
  
  console.log(`✅ Client examples generated in: ${clientsDir}`);
}

// Main execution
function main() {
  console.log('🚀 Starting documentation generation...\n');
  
  // Ensure output directories exist
  ensureDirectoryExists(config.outputDir);
  ensureDirectoryExists('docs/api/postman');
  
  try {
    generateHtmlDocs();
    generatePostmanCollection();
    generateMarkdownDocs();
    generatePostmanEnvironments();
    generateClientExamples();
    
    console.log('\n🎉 Documentation generation completed successfully!');
    console.log('\nGenerated files:');
    console.log(`📖 HTML docs: ${path.join(config.outputDir, 'index.html')}`);
    console.log(`📮 Postman collection: ${config.postmanCollection}`);
    console.log(`📝 Markdown docs: ${config.markdownOutput}`);
    console.log(`💻 Client examples: ${path.join(config.outputDir, 'clients')}`);
    
    console.log('\nNext steps:');
    console.log('1. Review generated documentation');
    console.log('2. Import Postman collection for testing');
    console.log('3. Deploy HTML docs to your documentation site');
    console.log('4. Share client examples with developers');
    
  } catch (error) {
    console.error('\n❌ Documentation generation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateHtmlDocs,
  generatePostmanCollection,
  generateMarkdownDocs,
  generatePostmanEnvironments,
  generateClientExamples
};
`;

  fs.writeFileSync(path.join(clientsDir, 'python-client.py'), pythonExample);
  
  console.log(\`✅ Client examples generated in: ${clientsDir}`);
}

// Main execution
function main() {
  console.log('🚀 Starting documentation generation...\n');
  
  // Ensure output directories exist
  ensureDirectoryExists(config.outputDir);
  ensureDirectoryExists('docs/api/postman');
  
  try {
    generateHtmlDocs();
    generatePostmanCollection();
    generateMarkdownDocs();
    generatePostmanEnvironments();
    generateClientExamples();
    
    console.log('\n🎉 Documentation generation completed successfully!');
    console.log('\nGenerated files:');
    console.log(\`📖 HTML docs: ${path.join(config.outputDir, 'index.html')}`);
    console.log(\`📮 Postman collection: ${config.postmanCollection}`);
    console.log(\`📝 Markdown docs: ${config.markdownOutput}`);
    console.log(\`💻 Client examples: ${path.join(config.outputDir, 'clients')}`);
    
    console.log('\nNext steps:');
    console.log('1. Review generated documentation');
    console.log('2. Import Postman collection for testing');
    console.log('3. Deploy HTML docs to your documentation site');
    console.log('4. Share client examples with developers');
    
  } catch (error) {
    console.error('\n❌ Documentation generation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateHtmlDocs,
  generatePostmanCollection,
  generateMarkdownDocs,
  generatePostmanEnvironments,
  generateClientExamples
};