import axios, { type AxiosRequestConfig } from 'axios';
import { appConfig } from '~/shared/config';

export const httpClient = axios.create();

export const apiRequest = <T>(options: AxiosRequestConfig): Promise<T> =>
    httpClient({ baseURL: appConfig.apiBase, ...options }).then(({ data }) => data);
