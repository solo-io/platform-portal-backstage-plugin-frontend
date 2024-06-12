import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetApiDetails } from '../../../Apis/hooks';
import { RedocDisplay } from './RedocDisplay';
import { SwaggerDisplay } from './SwaggerDisplay';

/**
 * For "gloo-mesh-gateway", we need a separate API call to get the schema.
 **/
export function GMG_ApiSchemaDisplay({
  showSwagger,
}: {
  showSwagger: boolean;
}) {
  const { apiId } = useParams();
  const {
    isLoading: isLoadingApiSchema,
    data: apiSchema,
    error: apiSchemaError,
  } = useGetApiDetails(apiId);

  if (isLoadingApiSchema) {
    return <>Retrieving schema for ${apiId}...`</>;
  }
  if (!!apiSchemaError) {
    return (
      <>
        {apiSchemaError.message ??
          'There was an error fetching this API schema.'}
      </>
    );
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
