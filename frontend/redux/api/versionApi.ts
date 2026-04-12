import { baseApi } from '@frontend/redux/api/baseApi';

import type { ApiSuccessResponse } from '@backend/types/apiSuccessResponse';

type VersionData = { version: string; environment: string };

const versionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getVersion: build.query<VersionData, void>({
      query: () => 'version',
      transformResponse: (res: ApiSuccessResponse<VersionData>) => res.data,
    }),
  }),
});

export const { useGetVersionQuery } = versionApi;
