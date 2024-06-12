import { useContext } from 'react';
import useSWR from 'swr';
import { useGetPortalServerUrl } from '../configHooks';
import { PortalAuthContext } from '../context/PortalAuthContext';

export async function fetchJSON(...args: Parameters<typeof fetch>) {
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
export const useSwrWithAuth = <T>(
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
