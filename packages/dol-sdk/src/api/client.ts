import axios, { type AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = axios.create({
  baseURL: 'https://apiprod.dol.gov/v4',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add request interceptor to include API key if provided
AXIOS_INSTANCE.interceptors.request.use((config) => {
  const apiKey = process.env.DOL_API_KEY;
  // Only add API key for endpoints that require it (not for /datasets)
  if (apiKey && !config.url?.includes('/datasets')) {
    // Add API key as query parameter
    config.params = {
      ...config.params,
      'X-API-KEY': apiKey,
    };
  }
  return config;
});

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const promise = AXIOS_INSTANCE(config).then(({ data }) => data);
  return promise;
};

// Export a version that returns the full Axios response for testing
export const customInstanceWithResponse = <T>(config: AxiosRequestConfig) => {
  return AXIOS_INSTANCE(config);
};

export default customInstance;
