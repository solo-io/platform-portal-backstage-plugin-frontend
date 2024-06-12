import { useContext } from 'react';
import useSWR from 'swr';
import { useGetPortalServerUrl } from '../configHooks';
import { PortalAppContext } from '../context/PortalAppContext';
import { PortalAuthContext } from '../context/PortalAuthContext';
import { customLog } from '../utility/utility';
import {
  API,
  APIProduct,
  ApiProductSummary,
  ApiVersion,
  ApiVersionExtended,
} from './api-types';
import { fetchJSON } from './helpers';

type ApisEndpointResponseType =
  | API[]
  | APIProduct[]
  | ApiProductSummary[]
  | null;

/**
 * Returns `useSwr` with `fetchJson`, but adds the auth tokens
 * from the `PortalAuthContext` in the headers.
 */
export const useSwrWithAuthListApis = () => {
  const serverUrl = useGetPortalServerUrl();
  const { latestAccessToken } = useContext(PortalAuthContext);
  const { updatePortalServerType, portalServerType } =
    useContext(PortalAppContext);

  const fetchInit = {} as RequestInit;
  if (!!latestAccessToken) {
    fetchInit.headers = {
      Authorization: `Bearer ${latestAccessToken}`,
    };
  }

  return useSWR<(API | ApiVersionExtended)[]>('list-apis', async () => {
    const gg_apisEndpoint = serverUrl + '/api-products';
    const gmg_apisEndpoint = serverUrl + '/apis';

    // For portalServerType:
    // - "unknown, and "gloo-mesh-gateway": use GMG endpoint
    // - "gloo-gateway": use GG endpoint
    let apisEndpoint =
      portalServerType === 'gloo-gateway' ? gg_apisEndpoint : gmg_apisEndpoint;

    customLog(
      `Fetching APIs from ${apisEndpoint} (identified as ${portalServerType}).`,
    );
    let res: ApisEndpointResponseType = await fetchJSON(
      apisEndpoint,
      fetchInit,
    );
    if (
      // If the GG+GMG endpoints aren't the same, and
      gg_apisEndpoint !== gmg_apisEndpoint &&
      // the GMG request failed, or
      (!res ||
        // the GMG request didn't fail, it returned data, but
        (!!res.length &&
          // it didn't return either GG or GMG data,
          !('id' in res[0]) &&
          !('apiVersions' in res[0])))
    ) {
      // try with the GG endpoint.
      apisEndpoint = gg_apisEndpoint;
      res = await fetchJSON(apisEndpoint, fetchInit);
    }

    let processedAPIs: (API | ApiVersionExtended)[] = [];
    if (!!res?.length) {
      //
      // Check the portal server API type
      //
      var identifiedPortalServerType: typeof portalServerType = 'unknown';
      if ('id' in res[0]) {
        identifiedPortalServerType = 'gloo-gateway';
      } else {
        identifiedPortalServerType = 'gloo-mesh-gateway';
      }
      //
      // Transform the data
      //
      // For "gloo-mesh-gateway"
      if (identifiedPortalServerType === 'gloo-mesh-gateway') {
        if ('apiVersions' in res[0]) {
          // Newer versions return the data grouped by APIProduct,
          // so we convert it back to a list here.
          const apiProducts = res as APIProduct[];
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
        } else {
          processedAPIs = res as API[];
        }
      }
      // For "gloo-gateway"
      if (identifiedPortalServerType === 'gloo-gateway') {
        // Fetch the information for each product.
        const summaries = res as ApiProductSummary[];
        // We have to do a separate request for each ApiProduct in order to get their versions.
        for (let i = 0; i < summaries.length; i++) {
          const apiProductSummary = summaries[i];
          const getVersionsUrl = `${apisEndpoint}/${apiProductSummary.id}/versions`;
          customLog(
            `Fetching API versions from ${getVersionsUrl} (identified as ${identifiedPortalServerType}).`,
          );
          const versionsRes = await fetch(getVersionsUrl, fetchInit);
          const resText = await versionsRes.text();
          customLog(
            `Fetched ${getVersionsUrl} (identified as ${identifiedPortalServerType}) and recieved the response text: ${resText}`,
          );
          const versions = JSON.parse(resText) as ApiVersion[];
          customLog('Parsed the ApiVersion text into JSON.');
          if (!!versions?.length) {
            // Add each API product's version to the processedAPIs.
            processedAPIs.push(
              ...versions.map(v => {
                const apiVersionExtended: ApiVersionExtended = {
                  ...v,
                  apiProductDescription: apiProductSummary.description,
                  apiProductName: apiProductSummary.name,
                };
                return apiVersionExtended;
              }),
            );
          }
        }
      }
      updatePortalServerType(identifiedPortalServerType);
    }
    return processedAPIs;
  });
};
