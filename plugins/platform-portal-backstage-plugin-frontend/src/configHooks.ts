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
