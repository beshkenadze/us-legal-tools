import { AXIOS_INSTANCE } from './api/client';
import { getDepartmentOfLaborDOLOpenDataAPI as getGeneratedAPI } from './api/generated/endpoints';
import type { AxiosRequestConfig } from 'axios';

// Create a version that returns full Axios responses for consistency with tests
export const createApiClient = (config?: AxiosRequestConfig) => {
  // Update the base configuration if provided
  if (config?.baseURL) {
    AXIOS_INSTANCE.defaults.baseURL = config.baseURL;
  }
  
  // Get the generated API functions
  const generatedAPI = getGeneratedAPI();
  
  // Wrap each function to return the full Axios response
  return {
    getDatasets: (params?: Parameters<typeof generatedAPI.getDatasets>[0]) => {
      return AXIOS_INSTANCE({
        url: '/datasets',
        method: 'GET',
        params,
      });
    },
    
    getAgencyEndpointDataJson: (
      agency: string,
      endpoint: string,
      params?: Parameters<typeof generatedAPI.getAgencyEndpointDataJson>[2]
    ) => {
      return AXIOS_INSTANCE({
        url: `/get/${agency}/${endpoint}/json`,
        method: 'GET',
        params,
      });
    },
    
    getAgencyEndpointDataXml: (
      agency: string,
      endpoint: string,
      params?: Parameters<typeof generatedAPI.getAgencyEndpointDataXml>[2]
    ) => {
      return AXIOS_INSTANCE({
        url: `/get/${agency}/${endpoint}/xml`,
        method: 'GET',
        params,
      });
    },
    
    getAgencyEndpointDataCsv: (
      agency: string,
      endpoint: string,
      params?: Parameters<typeof generatedAPI.getAgencyEndpointDataCsv>[2]
    ) => {
      return AXIOS_INSTANCE({
        url: `/get/${agency}/${endpoint}/csv`,
        method: 'GET',
        params,
      });
    },
    
    getAgencyEndpointMetadataJson: (
      agency: string,
      endpoint: string
    ) => {
      return AXIOS_INSTANCE({
        url: `/get/${agency}/${endpoint}/json/metadata`,
        method: 'GET',
      });
    },
    
    getAgencyEndpointMetadataCsv: (
      agency: string,
      endpoint: string
    ) => {
      return AXIOS_INSTANCE({
        url: `/get/${agency}/${endpoint}/csv/metadata`,
        method: 'GET',
      });
    },
  };
};

// Also export the original API for direct data access
export { getDepartmentOfLaborDOLOpenDataAPI } from './api/generated/endpoints';