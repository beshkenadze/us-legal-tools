import Axios, { type AxiosRequestConfig } from 'axios';

const INSTANCE = Axios.create({
  baseURL: 'https://www.ecfr.gov',
  headers: {
    'User-Agent': 'ecfr-sdk/0.1.0',
    Accept: 'application/json',
  },
});

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = INSTANCE({
    ...config,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error adding cancel method to promise
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export default INSTANCE;
