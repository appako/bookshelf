import axios, { type AxiosRequestConfig } from 'axios';
import { appConfig } from '~/shared/config';

export const httpClient = axios.create();

/** orval mutator: every generated API function goes through here. */
export const apiRequest = <T>(options: AxiosRequestConfig): Promise<T> =>
    httpClient({ baseURL: appConfig.apiBase, ...options }).then(({ data }) => data);
