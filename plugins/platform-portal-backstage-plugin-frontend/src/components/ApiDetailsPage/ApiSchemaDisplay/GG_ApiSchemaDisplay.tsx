import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { APISchema, ApiVersionExtended } from '../../../Apis/api-types';
import { useListApis } from '../../../Apis/hooks';
import { RedocDisplay } from './RedocDisplay';
import { SwaggerDisplay } from './SwaggerDisplay';

/**
 * For "gloo-gateway", we already should have fetched the schema in the useListApis() call.
 **/
export function GG_ApiSchemaDisplay({ showSwagger }: { showSwagger: boolean }) {
  const { apiId } = useParams();
  const { data: apis } = useListApis();

  const selectedApi = useMemo<ApiVersionExtended | undefined>(
    () =>
      apis?.find(a => 'id' in a && a.id === apiId) as
        | ApiVersionExtended
        | undefined,
    [apis],
  );

  const apiSchema = useMemo<APISchema | undefined>(() => {
    if (!selectedApi?.apiSpec) {
      return undefined;
    }
    if (typeof selectedApi.apiSpec === 'string') {
      return JSON.parse(selectedApi.apiSpec);
    }
    return selectedApi.apiSpec;
  }, [selectedApi]);

  if (!selectedApi) {
    return <>Unable to load API schema for {apiId}.</>;
  }
  return (
    <main className="page-container-wrapper">
      {!showSwagger ? (
        //
        // Redoc - Default
        //
        <RedocDisplay spec={apiSchema} />
      ) : (
        //
        // Swagger - Alternative
        //
        <SwaggerDisplay
          spec={apiSchema}
          apiId={apiId ?? 'Unsupported schema display'}
        />
      )}
    </main>
  );
}
