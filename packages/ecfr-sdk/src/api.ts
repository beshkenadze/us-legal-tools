import INSTANCE from './api/client';
import { getEcfrsdk } from './api/generated/endpoints';
import type { AxiosRequestConfig } from 'axios';

// Create API client that returns full Axios responses for consistency with tests
export const createApiClient = (config?: AxiosRequestConfig) => {
  // Update the base configuration if provided
  if (config?.baseURL) {
    INSTANCE.defaults.baseURL = config.baseURL;
  }
  
  // Get the generated API functions
  const generatedAPI = getEcfrsdk();
  
  return {
    getApiVersionerV1TitlesJson: () => {
      return INSTANCE({
        url: '/api/versioner/v1/titles.json',
        method: 'GET',
      });
    },
    
    getApiSearchV1Results: (params?: Parameters<typeof generatedAPI.getApiSearchV1Results>[0]) => {
      return INSTANCE({
        url: '/api/search/v1/results',
        method: 'GET',
        params,
      });
    },
  };
};

// Also export the generated API functions for direct data access
export * from './api/generated/endpoints';