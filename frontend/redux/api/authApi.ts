import { baseApi } from './baseApi';

import type { ApiSuccessResponse } from '@backend/types/apiSuccessResponse';

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<
      { token: string },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<{ token: string }>) =>
        response.data,
    }),

    createUser: build.mutation<
      { signupLink: string },
      { email: string; name: string }
    >({
      query: (body) => ({
        url: 'auth/create-user',
        method: 'POST',
        body,
      }),
      transformResponse: (
        response: ApiSuccessResponse<{ signupLink: string }>,
      ) => response.data,
    }),

    setPassword: build.mutation<
      { token: string },
      { password: string; confirmPassword: string }
    >({
      query: (body) => ({
        url: 'auth/set-password',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<{ token: string }>) =>
        response.data,
    }),
  }),
});

export const { useLoginMutation } = authApi;
