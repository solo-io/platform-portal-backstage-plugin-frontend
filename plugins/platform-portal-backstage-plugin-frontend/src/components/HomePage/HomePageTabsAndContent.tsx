import { Content, HeaderTabs } from '@backstage/core-components';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PortalAppContext } from '../../context/PortalAppContext';
import { PortalAuthContext } from '../../context/PortalAuthContext';
import ApisTabContent from './ApisTabContent/ApisTabContent';
import OverviewTabContent from './OverviewTabContent/OverviewTabContent';
import UsagePlansTabContent from './UsagePlansTabContent/UsagePlansTabContent';

export const HomePageTabsAndContent = () => {
  const { isLoggedIn } = useContext(PortalAuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { portalServerType } = useContext(PortalAppContext);

  //
  // Tabs
  //
  const tabs = useMemo(() => {
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
    ];
    if (isLoggedIn && portalServerType === 'gloo-mesh-gateway') {
      tabs.push({
        label: 'Usage Plans',
        pathname: '/gloo-platform-portal/usage-plans',
        component: <UsagePlansTabContent />,
      });
    }
    return tabs;
  }, [isLoggedIn, portalServerType]);

  const getTabIndexFromPathname = (pathname: string) => {
    const idx = tabs.findIndex(t => pathname === t.pathname);
    return idx === -1 ? 0 : idx;
  };

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
    <>
      <HeaderTabs
        selectedIndex={selectedTabIdx}
        onChange={idx => navigate(tabs[idx].pathname)}
        tabs={tabs.map(({ label }, index) => ({
          id: index.toString(),
          label,
        }))}
      />
      <Content>{tabs[selectedTabIdx].component}</Content>
    </>
  );
};
