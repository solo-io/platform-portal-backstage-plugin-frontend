import { useContext } from 'react';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { useGetPortalServerUrl } from '../configHooks';
import { PortalAuthContext } from '../context/PortalAuthContext';
import { APIKey, APISchema, UsagePlan, User } from './api-types';
import { fetchJSON, useSwrWithAuth } from './helpers';
import { useSwrWithAuthListApis } from './list-apis-helpers';

//
// Queries
//
export function useGetCurrentUser() {
  return useSwrWithAuth<User>('/me', {
    // Don't retry errors. We refetch this on-focus.
    onErrorRetry: () => {},
  });
}

export function useListApis() {
  // Listing API's is more complicated since we support GMG and GG Portal Server APIs.
  // This uses a custom SWR fetcher function which may do several fetch calls.
  return useSwrWithAuthListApis();
}
export function useGetApiDetails(id?: string) {
  return useSwrWithAuth<APISchema>(`/apis/${id}/schema`);
}

export function useListUsagePlans() {
  return useSwrWithAuth<UsagePlan[]>(`/usage-plans`);
}

export function useListApiKeys(usagePlan: string) {
  // const optionsString = !!usagePlans?.length
  //   ? `?usagePlans=${usagePlans.join(",")}`
  //   : "";

  // TODO: Add support for getting keys for multiple usage plans.
  // TODO: While also having the cache invalidation work (see useAddKeyMutation).
  return useSwrWithAuth<{ usagePlan: string; apiKeys: APIKey[] }[]>(
    `/api-keys?usagePlans=${usagePlan}`,
  );
}

//
// Mutations
//
export function useCreateKeyMutation() {
  const { latestAccessToken } = useContext(PortalAuthContext);
  const { mutate } = useSWRConfig();
  const serverUrl = useGetPortalServerUrl();

  const createKey = async (
    path: string,
    {
      arg: { usagePlanName, apiKeyName },
    }: { arg: { usagePlanName: string; apiKeyName: string } },
  ) => {
    const authHeaders = {} as any;
    if (!!latestAccessToken) {
      authHeaders.Authorization = `Bearer ${latestAccessToken}`;
    }
    try {
      const res = await fetchJSON(serverUrl + path, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          usagePlan: usagePlanName,
          apiKeyName,
          // customMetadata, // Coming soon
        }),
      });
      // TODO: Mutation should invalidate all usage plans that this api key is in.
      mutate(`${serverUrl}/api-keys?usagePlans=${usagePlanName}`);
      return res as APIKey;
    } catch (e: any) {
      // eslint-disable-next-line no-console
      if (!!e?.message) console.error(e.message);
      return undefined;
    }
  };

  return useSWRMutation(`/api-keys`, createKey);
}

export function useDeleteKeyMutation() {
  const { latestAccessToken } = useContext(PortalAuthContext);
  const { mutate } = useSWRConfig();
  const serverUrl = useGetPortalServerUrl();

  const deleteKey = async (
    path: string,
    {
      arg: { apiKeyId, usagePlanName },
    }: { arg: { apiKeyId: string; usagePlanName: string } },
  ) => {
    const authHeaders = {} as any;
    if (!!latestAccessToken) {
      authHeaders.Authorization = `Bearer ${latestAccessToken}`;
    }
    try {
      await fetch(`${serverUrl}${path}/${apiKeyId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      // TODO: Mutation should invalidate all usage plans that this api key is in.
      mutate(`${serverUrl}/api-keys?usagePlans=${usagePlanName}`);
    } catch (e: any) {
      // eslint-disable-next-line no-console
      if (!!e?.message) console.error(e.message);
    }
  };

  return useSWRMutation(`/api-keys`, deleteKey);
}
