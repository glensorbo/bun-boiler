import { baseApi } from './baseApi';

import type { ApiSuccessResponse } from '@backend/types/apiSuccessResponse';
import type { User } from '@backend/types/user';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<User[], void>({
      query: () => 'user',
      transformResponse: (response: ApiSuccessResponse<User[]>) =>
        response.data,
    }),

    getUserById: build.query<User, string>({
      query: (id) => `user/${id}`,
      transformResponse: (response: ApiSuccessResponse<User>) => response.data,
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery } = usersApi;
