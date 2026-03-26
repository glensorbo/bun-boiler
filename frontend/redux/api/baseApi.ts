import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { ApiErrorResponse } from '@backend/types/apiErrorResponse';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

const rawBaseQuery = fetchBaseQuery({ baseUrl: '/api' });

/**
 * Wraps fetchBaseQuery and narrows the error type to ApiErrorResponse.
 * All endpoints built on this base query will have fully typed errors.
 */
const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  ApiErrorResponse
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const fetchError = result.error as FetchBaseQueryError;
    return { error: fetchError.data as ApiErrorResponse };
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: () => ({}),
});
