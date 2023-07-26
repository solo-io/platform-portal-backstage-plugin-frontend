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
import React, { useEffect, useState } from 'react';
import SwaggerUIConstructor from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';
import { APISchema } from '../../../Apis/api-types';

const sanitize = (id: string) => id.replaceAll('.', '-');

export function SwaggerDisplay({
  spec,
  apiId,
}: {
  spec: APISchema | undefined;
  apiId: string;
}) {
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
      syntaxHighlight: { activate: false },
    });
  }, [sanitizedDomId, spec]);

  return (
    <div
      aria-label="Schema Display"
      className="swagger-display-container"
      id={`display-swagger-${sanitizedDomId}`}
    />
  );
}
