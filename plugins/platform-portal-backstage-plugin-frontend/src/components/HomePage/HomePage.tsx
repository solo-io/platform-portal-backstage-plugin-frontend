import { Header, HeaderLabel, Page } from '@backstage/core-components';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { PortalAppContextProvider } from '../../context/PortalAppContext';
import { PortalAuthContextProvider } from '../../context/PortalAuthContext';
import PortalServerTypeChecker from '../../utility/PortalServerTypeChecker';
import { HomePageTabsAndContent } from './HomePageTabsAndContent';

export const HomePage = () => {
  //
  // Render Login
  //
  return (
    <PortalAuthContextProvider>
      <PortalAppContextProvider>
        <Page themeId="tool">
          <Toaster
            toastOptions={{
              duration: 3000,
              position: 'bottom-right',
              style: { zIndex: 99999999 },
            }}
          />
          <Header title="Gloo Platform Portal">
            <HeaderLabel label="Owner" value="solo.io" />
          </Header>

          <PortalServerTypeChecker />
          <HomePageTabsAndContent />
        </Page>
      </PortalAppContextProvider>
    </PortalAuthContextProvider>
  );
};
