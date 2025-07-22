// Federal Register SDK
export * from './api/client';

// MCP Server exports
export * from './mcp';

// Re-export generated types and functions when available
// These will be generated after running `bun run generate`
// Commented out during build, uncommented by post-generation script
// export * from './api/generated/endpoints';
// export type * from './api/generated/model';

export default {
  name: 'Federal Register SDK',
  version: '0.1.0',
  description: 'TypeScript SDK and MCP server for the Federal Register API',
};
