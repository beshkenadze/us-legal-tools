import { Hono } from 'hono';
import { apiReference } from '@scalar/hono-api-reference';

/**
 * Example of using Scalar with dynamic configuration
 * This shows how to integrate Scalar into an existing Hono app
 */

const app = new Hono();

// Example: Serve Scalar for a specific API with custom configuration
app.get('/api-docs', apiReference({
  spec: {
    url: '/openapi.json', // Your OpenAPI spec URL
  },
  theme: 'purple',
  pageTitle: 'My API Documentation',
  // Advanced configuration options
  configuration: {
    defaultHttpClient: {
      targetKey: 'node',
      clientKey: 'fetch',
    },
    authentication: {
      preferredSecurityScheme: 'bearerAuth',
    },
  },
}));

// Example: Serve the OpenAPI spec
app.get('/openapi.json', async (c) => {
  // This could be dynamically generated or loaded from a file
  const spec = {
    openapi: '3.0.0',
    info: {
      title: 'Example API',
      version: '1.0.0',
    },
    paths: {
      '/hello': {
        get: {
          summary: 'Say hello',
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  
  return c.json(spec);
});

export default app;