import React, { createContext, useState } from 'react';

if (!window.isSecureContext) {
  // eslint-disable-next-line no-console
  console.error(
    'This page is not being delivered in a secure context (see https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts), ' +
      'so login will not work.',
  );
}

//
// Types
//
// Initial state: PortalServerType='unknown'
type PortalServerType = 'gloo-gateway' | 'gloo-mesh-gateway' | 'unknown';
interface PortalAppProviderProps {
  children?: any;
}
interface IPortalAppContext extends PortalAppProviderProps {
  portalServerType: PortalServerType;
  updatePortalServerType(newType: PortalServerType): void;
}

export const PortalAppContext = createContext({} as IPortalAppContext);

export const PortalAppContextProvider = (props: PortalAppProviderProps) => {
  const [portalServerType, setPortalServerType] =
    useState<PortalServerType>('unknown');

  return (
    <PortalAppContext.Provider
      value={{
        portalServerType,
        updatePortalServerType: t => {
          console.log('Updating portal server type: ', t);
          setPortalServerType(t);
        },
      }}
    >
      {props.children}
    </PortalAppContext.Provider>
  );
};
