/**
 * Global type declarations for orval MCP client
 * This file makes the original schema types available for function signatures
 */

// Import types for global declaration
import type { AlertCreate } from './http-schemas/alertCreate';
import type { RECAPFetchRequest } from './http-schemas/rECAPFetchRequest';
import type { DocketAlertCreate } from './http-schemas/docketAlertCreate';

// Make types available globally for generated handlers
declare global {
  type AlertCreate = import('./http-schemas/alertCreate').AlertCreate;
  type RECAPFetchRequest = import('./http-schemas/rECAPFetchRequest').RECAPFetchRequest;
  type DocketAlertCreate = import('./http-schemas/docketAlertCreate').DocketAlertCreate;
}

export {};
