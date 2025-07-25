import type { AxiosRequestConfig } from 'axios';
import { axiosInstance } from './api/client';

// Create API client for consistency with tests
export const createApiClient = (config?: AxiosRequestConfig) => {
  // Update the base configuration if provided
  if (config?.baseURL) {
    axiosInstance.defaults.baseURL = config.baseURL;
  }

  return {
    // Map the test expectations to the actual endpoints
    getApiV1Documents: (params?: Record<string, unknown>) => {
      return axiosInstance({
        url: '/api/v1/documents.json',
        method: 'GET',
        params,
      });
    },

    getApiV1Agencies: () => {
      return axiosInstance({
        url: '/api/v1/agencies.json',
        method: 'GET',
      });
    },
  };
};

// Also export the generated API functions
export * from './api/generated/endpoints';
