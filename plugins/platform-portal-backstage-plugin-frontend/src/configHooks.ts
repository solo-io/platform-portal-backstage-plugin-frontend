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
import { configApiRef, useApi } from '@backstage/core-plugin-api';

export const useGetPortalServerUrl = () => {
  const config = useApi(configApiRef);
  let value = config.getOptionalString('glooPlatformPortal.portalServerUrl');
  // Remove trailing slash if supplied.
  if (!!value && value.at(-1) === '/')
    value = value.substring(0, value.length - 1);
  return value ?? 'http://localhost:31080/v1';
};

export const useGetClientId = () => {
  const config = useApi(configApiRef);
  const value = config.getOptionalString('glooPlatformPortal.clientId');
  if (!value) {
    // eslint-disable-next-line no-console
    console.warn(
      'No glooPlatformPortal.clientId found in app-config.local.yaml',
    );
  }
  return value ?? '';
};

export const useGetTokenEndpoint = () => {
  const config = useApi(configApiRef);
  const value = config.getOptionalString('glooPlatformPortal.tokenEndpoint');
  if (!value) {
    // eslint-disable-next-line no-console
    console.warn(
      'No glooPlatformPortal.tokenEndpoint found in app-config.local.yaml',
    );
  }
  return value ?? '';
};

export const useGetAuthEndpoint = () => {
  const config = useApi(configApiRef);
  let value = config.getOptionalString('glooPlatformPortal.authEndpoint');
  // Remove trailing slash if supplied.
  if (!!value && value.at(-1) === '/')
    value = value.substring(0, value.length - 1);
  if (!value) {
    // eslint-disable-next-line no-console
    console.warn(
      'No glooPlatformPortal.authEndpoint found in app-config.local.yaml',
    );
  }
  return value ?? '';
};

export const useGetLogoutEndpoint = () => {
  const config = useApi(configApiRef);
  let value = config.getOptionalString('glooPlatformPortal.logoutEndpoint');
  // Remove trailing slash if supplied.
  if (!!value && value.at(-1) === '/')
    value = value.substring(0, value.length - 1);
  if (!value) {
    // eslint-disable-next-line no-console
    console.warn(
      'No glooPlatformPortal.logoutEndpoint found in app-config.local.yaml',
    );
  }
  return value ?? '';
};
