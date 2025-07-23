import { Hono } from 'hono';
import { apiReference } from '@scalar/hono-api-reference';
import { apiConfigs } from './api-configs';
import { loadLocalSpec, getContentType, validateSpec } from './utils/spec-loader';
import { errorPage } from './components/error-page';

const app = new Hono();

// Home page with links to all API docs
app.get('/', (c) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>US Legal Tools - API Documentation</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          background: #f5f5f5;
        }
        h1 {
          color: #333;
          margin-bottom: 2rem;
        }
        .api-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .api-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .api-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .api-card h2 {
          margin-top: 0;
          color: #2563eb;
        }
        .api-card p {
          color: #666;
          line-height: 1.5;
        }
        .api-link {
          display: inline-block;
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #2563eb;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          transition: background 0.2s;
        }
        .api-link:hover {
          background: #1d4ed8;
        }
      </style>
    </head>
    <body>
      <h1>US Legal Tools - API Documentation</h1>
      <p>Interactive API documentation powered by Scalar</p>
      
      <div class="api-grid">
        ${apiConfigs.map(api => `
          <div class="api-card">
            <h2>${api.name}</h2>
            <p>${api.description || 'API documentation'}</p>
            <a href="${api.path}" class="api-link">View Documentation →</a>
          </div>
        `).join('')}
      </div>
    </body>
    </html>
  `;
  
  return c.html(html);
});

// Create routes for each API documentation
for (const config of apiConfigs) {
  app.get(
    config.path,
    apiReference({
      spec: config.specUrl || {
        url: config.specPath ? `/specs${config.path}` : undefined,
      },
      theme: config.theme || 'purple',
      pageTitle: `${config.name} - API Reference`,
    })
  );
  
  // Serve local spec files
  if (config.specPath) {
    app.get(`/specs${config.path}`, async (c) => {
      const content = await loadLocalSpec(config.specPath!);
      
      if (!content) {
        return c.html(errorPage(
          'Specification Not Found',
          `Unable to load the OpenAPI specification for ${config.name}. Please check that the file exists.`
        ), 404);
      }
      
      const contentType = getContentType(config.specPath!);
      const isValid = await validateSpec(content, contentType);
      
      if (!isValid) {
        return c.html(errorPage(
          'Invalid Specification',
          `The OpenAPI specification for ${config.name} appears to be invalid. Please check the file format.`
        ), 500);
      }
      
      return c.text(content, 200, {
        'Content-Type': contentType,
      });
    });
  }
}

// Health check endpoint
app.get('/health', (c) => c.json({ status: 'ok' }));

const port = process.env.PORT || 3000;

console.log(`🚀 Scalar UI server starting on port ${port}`);
console.log(`📚 Available API docs:`);
apiConfigs.forEach(api => {
  console.log(`   - ${api.name}: http://localhost:${port}${api.path}`);
});

Bun.serve({
  port,
  fetch: app.fetch,
});