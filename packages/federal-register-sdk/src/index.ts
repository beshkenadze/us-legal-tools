// Federal Register SDK
export * from './api/client';
export * from './api/generated/endpoints';
// Re-export generated types and functions when available
// These will be generated after running `bun run generate`
export type * from './api/generated/model';

// MCP Server exports
export * from './mcp';

export default {
  name: 'Federal Register SDK',
  version: '0.1.0',
  description: 'TypeScript SDK and MCP server for the Federal Register API',
};
