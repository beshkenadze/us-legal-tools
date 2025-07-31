// Export all generated types and endpoints
export * from "./api/generated/endpoints";
export * from "./api/generated/endpoints.schemas";

// Export the API client
export { default as apiClient } from "./api/client";

// Package metadata
export const version = "0.1.0";
export const packageName = "@us-legal-tools/dol-sdk";
