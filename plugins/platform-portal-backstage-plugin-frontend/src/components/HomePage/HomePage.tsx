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
import {
  Content,
  Header,
  HeaderLabel,
  HeaderTabs,
  Page,
} from '@backstage/core-components';
import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { PortalAuthContextProvider } from '../../context/PortalAuthContext';
import ApisTabContent from './ApisTabContent/ApisTabContent';
import OverviewTabContent from './OverviewTabContent/OverviewTabContent';
import UsagePlansTabContent from './UsagePlansTabContent/UsagePlansTabContent';

//
// Tabs
//
const tabs = [
  {
    label: 'Overview',
    pathname: '/gloo-platform-portal',
    component: <OverviewTabContent />,
  },
  {
    label: 'APIs',
    pathname: '/gloo-platform-portal/apis',
    component: <ApisTabContent />,
  },
  {
    label: 'Usage Plans',
    pathname: '/gloo-platform-portal/usage-plans',
    component: <UsagePlansTabContent />,
  },
];
const getTabIndexFromPathname = (pathname: string) => {
  const idx = tabs.findIndex(t => pathname === t.pathname);
  return idx === -1 ? 0 : idx;
};

export const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Updates tab index based on URL path.
  const [selectedTabIdx, setSelectedTabIdx] = useState(
    getTabIndexFromPathname(location.pathname),
  );
  useEffect(() => {
    // const newTabIdx = getTabIndexFromPathname(location.pathname);
    // console.log(newTabIdx, selectedTabIdx, location.pathname);
    setSelectedTabIdx(getTabIndexFromPathname(location.pathname));
  }, [location]);

  //
  // Render Login
  //
  return (
    <PortalAuthContextProvider>
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

        <HeaderTabs
          selectedIndex={selectedTabIdx}
          onChange={idx => navigate(tabs[idx].pathname)}
          tabs={tabs.map(({ label }, index) => ({
            id: index.toString(),
            label,
          }))}
        />
        <Content>{tabs[selectedTabIdx].component}</Content>
      </Page>
    </PortalAuthContextProvider>
  );
};
