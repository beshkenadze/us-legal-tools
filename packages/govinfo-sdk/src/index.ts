import * as packageJson from '../package.json';

// Export the configured API client
export * from './api/client';

// Export all generated API functions
export * from './api/generated/endpoints';

// Export package version
export const VERSION = packageJson.version;