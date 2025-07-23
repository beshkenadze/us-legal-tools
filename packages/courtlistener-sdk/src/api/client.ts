import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

const BASE_URL = 'https://www.courtlistener.com/api/rest/v4';

// Get the API token from environment variable
const API_TOKEN = process.env.COURTLISTENER_API_TOKEN;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'CourtListener SDK',
    ...(API_TOKEN && { Authorization: `Token ${API_TOKEN}` }),
  },
});

// Add request interceptor for authentication
axiosInstance.interceptors.request.use((config) => {
  // Allow runtime token override
  const token = config.headers?.Authorization || API_TOKEN;
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

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
