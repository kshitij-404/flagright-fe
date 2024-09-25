import { Fetcher } from 'swr';
import { apiFetcher } from '@/utils/axios';

export const swrFetcher: Fetcher<any, any> = async ([url, type, ...rest]: [
  string,
  'get' | 'post' | 'put' | 'delete',
  any[]?,
]) => {
  return await apiFetcher[type](url, ...rest);
};
