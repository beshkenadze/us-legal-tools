import { defineConfig } from 'orval';

export default defineConfig({
  // SDK configuration
  ecfr: {
    input: {
      target: './docs/v1-openapi3.json',
    },
    output: {
      mode: 'split',
      target: './src/api/generated/endpoints.ts',
      schemas: './src/api/generated/models',
      client: 'axios',
      prettier: false,
      override: {
        mutator: {
          path: './src/api/client.ts',
          name: 'customInstance',
        },
      },
    },
  },
  // MCP server configuration
  'ecfr-mcp': {
    input: {
      target: './docs/v1-openapi3.json',
    },
    output: {
      mode: 'single',
      client: 'mcp',
      baseUrl: 'https://www.ecfr.gov',
      target: './src/mcp/handlers.ts',
      schemas: './src/mcp/http-schemas',
    },
  },
});
