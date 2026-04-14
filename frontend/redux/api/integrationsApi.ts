import { baseApi } from './baseApi';
import type { ApiSuccessResponse } from '@backend/types/apiSuccessResponse';

export type Integration = {
  id: string;
  name: string;
  description: string;
  status: 'disabled' | 'healthy' | 'degraded';
  config: Record<string, string> | null;
};

const integrationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getIntegrations: build.query<Integration[], void>({
      query: () => 'integrations',
      transformResponse: (
        response: ApiSuccessResponse<{ integrations: Integration[] }>,
      ) => response.data.integrations,
    }),
    sendTestEmail: build.mutation<{ message: string }, void>({
      query: () => ({
        url: 'integrations/mail/test',
        method: 'POST',
      }),
      transformResponse: (response: ApiSuccessResponse<{ message: string }>) =>
        response.data,
    }),
  }),
});

export const { useGetIntegrationsQuery, useSendTestEmailMutation } =
  integrationsApi;
