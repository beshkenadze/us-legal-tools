import * as packageJson from '../package.json';

// Export the configured API client
export * from './api/client';

// Export package version
export const VERSION = packageJson.version;
