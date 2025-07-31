// GovInfo SDK
import * as packageJson from '../package.json';

// Export the configured API client
export * from './api/client';

// Export package version
export const VERSION = packageJson.version;

// Users can import generated types and functions directly:
// import { search } from '@us-legal-tools/govinfo-sdk/api/generated/endpoints';
// import type { SearchBody } from '@us-legal-tools/govinfo-sdk/api/generated/model';
