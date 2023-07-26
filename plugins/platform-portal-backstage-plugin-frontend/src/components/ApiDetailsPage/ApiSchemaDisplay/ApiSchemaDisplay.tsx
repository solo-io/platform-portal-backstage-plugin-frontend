/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetApiDetails } from '../../../Apis/hooks';
import { RedocDisplay } from './RedocDisplay';
import { SwaggerDisplay } from './SwaggerDisplay';

/**
 * MAIN COMPONENT
 **/
export function ApiSchemaDisplay({ showSwagger }: { showSwagger: boolean }) {
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
