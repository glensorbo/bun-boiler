import { baseApi } from '@frontend/redux/api/baseApi';
import type { ApiSuccessResponse } from '@backend/types/apiSuccessResponse';
import type { User } from '@backend/types/user';

const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<User[], void>({
      query: () => 'user',
      transformResponse: (response: ApiSuccessResponse<User[]>) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    inviteUser: build.mutation<
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
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    deleteUser: build.mutation<null, string>({
      query: (id) => ({
        url: `user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    updateUserRole: build.mutation<
      User,
      { id: string; role: 'admin' | 'user' }
    >({
      query: ({ id, role }) => ({
        url: `user/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      transformResponse: (response: ApiSuccessResponse<User>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }],
    }),

    resetUserPassword: build.mutation<{ signupLink: string }, string>({
      query: (id) => ({
        url: `user/${id}/reset-password`,
        method: 'POST',
      }),
      transformResponse: (
        response: ApiSuccessResponse<{ signupLink: string }>,
      ) => response.data,
    }),
  }),
});

export const {
  useGetUsersQuery,
  useInviteUserMutation,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useResetUserPasswordMutation,
} = usersApi;
