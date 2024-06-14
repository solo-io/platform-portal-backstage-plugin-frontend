import React, { useEffect, useState } from 'react';
import SwaggerUIConstructor from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';
import { APISchema } from '../../../Apis/api-types';
import { useGetSwaggerConfigUrl } from '../../../configHooks';

const sanitize = (id: string) => id.replaceAll('.', '-');

export function SwaggerDisplay({
  spec,
  apiId,
}: {
  spec: APISchema | undefined;
  apiId: string;
}) {
  const swaggerConfigUrl = useGetSwaggerConfigUrl();

  // The sanitized dom_id, where all periods are replaced with dashes. This fixes issues where Swagger tries
  // doing a `querySelector` which fails, due to it treating the period as a class selector, and not part of the ID itself.
  const [sanitizedDomId, setSanitizedDomId] = useState<string>(sanitize(apiId));
  useEffect(() => {
    const newSanitizedId = sanitize(apiId);
    if (sanitizedDomId !== newSanitizedId) {
      setSanitizedDomId(newSanitizedId);
    }
  }, [apiId, sanitizedDomId]);

  useEffect(() => {
    // console.log(spec);
    // eslint-disable-next-line new-cap
    SwaggerUIConstructor({
      spec,
      // spec: {
      //   ...(spec ?? {}),
      //   servers: [{ url: 'http://api.example.com:31080' }],
      // },
      dom_id: `#display-swagger-${sanitizedDomId}`,
      withCredentials: true,
      deepLinking: true,
      configUrl: swaggerConfigUrl !== '' ? swaggerConfigUrl : undefined,
    });
  }, [sanitizedDomId, spec, swaggerConfigUrl]);

  return (
    <div
      aria-label="Schema Display"
      className="swagger-display-container"
      id={`display-swagger-${sanitizedDomId}`}
    />
  );
}
