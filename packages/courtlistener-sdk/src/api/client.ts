import axios, { type AxiosRequestConfig } from 'axios';

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  // Get auth token if available
  const authToken = process.env.COURTLISTENER_API_TOKEN;
  
  const source = axios.CancelToken.source();
  const promise = axios({
    baseURL: 'https://www.courtlistener.com',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Token ${authToken}` }),
    },
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled by React Query');
  };

  return promise;
};

export default customInstance;