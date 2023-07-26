import { useContext } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { useGetPortalServerUrl } from '../configHooks';
import { PortalAuthContext } from '../context/PortalAuthContext';
import {
  API,
  APIKey,
  APIProduct,
  APISchema,
  UsagePlan,
  User,
} from './api-types';

//
// Rename RESTPOINT to change the base API URL.
//

async function fetchJSON(...args: Parameters<typeof fetch>) {
  if (typeof args[0] !== 'string') return undefined;
  const url = args[0];
  const newArgs: typeof args = [
    url,
    {
      ...args[1],
      headers: {
        'Content-Type': 'application/json',
        ...args[1]?.headers,
      },
    },
  ];
  const res = await fetch(...newArgs);
  const json = await res.json();
  // If this is a 4xx response, throw an error.
  if (Math.floor(res.status / 100) === 4) {
    if (!!json.message) {
      throw new Error(`Error code: ${res.status}. ${json.message}`);
    } else {
      throw new Error(
        `A ${res.status} error occurred while fetching the data.`,
      );
    }
  }
  // Else just return the data.
  return json;
}

/**
 * Returns `useSwr` with `fetchJson`, but adds the auth tokens
 * from the `PortalAuthContext` in the headers.
 */
const useSwrWithAuth = <T>(
  path: string,
  config?: Parameters<typeof useSWR<T>>[2],
) => {
  const serverUrl = useGetPortalServerUrl();
  const { latestAccessToken } = useContext(PortalAuthContext);

  const authHeaders = {} as any;
  if (!!latestAccessToken) {
    authHeaders.Authorization = `Bearer ${latestAccessToken}`;
  }
  return useSWR<T>(
    serverUrl + path,
    (...args) => {
      return fetchJSON(args[0], {
        ...(args.length > 1 && !!args[1] ? args[1] : {}),
        headers: {
          ...(args.length > 1 && args[1].headers ? args[1].headers : {}),
          ...authHeaders,
        },
      });
    },
    {
      ...(config ?? {}),
    },
  );
};

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
  const res = useSwrWithAuth<API[] | APIProduct[]>('/apis');
  //
  // The server returns the APIs grouped by APIProduct,
  // so we can convert it back to a list here.
  //
  let processedAPIs = res.data as API[];
  if (!!res.data?.length && 'apiVersions' in res.data[0]) {
    const apiProducts = res.data as APIProduct[];
    processedAPIs = apiProducts.reduce((accum, curProd) => {
      accum.push(
        ...curProd.apiVersions.reduce((accumVer, api) => {
          accumVer.push({
            apiId: api.apiId,
            apiProductDisplayName: curProd.apiProductDisplayName,
            apiProductId: curProd.apiProductId,
            apiVersion: api.apiVersion,
            contact: api.contact,
            customMetadata: api.customMetadata,
            description: api.description,
            license: api.license,
            termsOfService: api.termsOfService,
            title: api.title,
            usagePlans: api.usagePlans,
          });
          return accumVer;
        }, [] as API[]),
      );
      return accum;
    }, [] as API[]);
  }
  return { ...res, data: processedAPIs };
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
