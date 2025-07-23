import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

// Load environment variables (Bun automatically loads .env files)
// For Node.js compatibility, we check if dotenv exists
try {
  if (typeof Bun === 'undefined' && require.resolve('dotenv')) {
    require('dotenv').config();
  }
} catch (_e) {
  // dotenv not available, continue without it
}

const BASE_URL = 'https://api.govinfo.gov';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'GovInfo SDK',
  },
});

// Add API key from environment variable
const apiKey = process.env.GOV_INFO_API_KEY || process.env.GOVINFO_API_KEY;

// Request interceptor to add API key as query parameter
axiosInstance.interceptors.request.use(
  (config) => {
    // Add API key as query parameter
    if (apiKey) {
      config.params = {
        ...config.params,
        api_key: apiKey,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Custom instance for Orval
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  const source = axios.CancelToken.source();
  const promise = axiosInstance({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};
