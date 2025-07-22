// CourtListener SDK
export * from './api/client';
export * from './api/generated/endpoints';
// Re-export generated types and functions when available
// These will be generated after running `bun run generate`
export type * from './api/generated/model';

// MCP Server exports
export * from './mcp';

export default {
  name: 'CourtListener SDK',
  version: '1.0.0',
  description: 'TypeScript SDK and MCP server for the CourtListener API',
};
