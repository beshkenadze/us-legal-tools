// Re-export the generated API client and types

// Export custom client instance
export { customInstance, default as ecfrClient } from './api/client';
export * from './api/generated/endpoints';
export * from './api/generated/models';

// Export version
export const VERSION = '0.1.0';
