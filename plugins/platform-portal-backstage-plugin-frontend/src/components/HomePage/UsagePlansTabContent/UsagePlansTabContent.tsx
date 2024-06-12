import { InfoCard } from '@backstage/core-components';
import { ComponentAccordion } from '@backstage/plugin-home';
import { Card, CardContent, Grid } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { API } from '../../../Apis/api-types';
import { useListApis } from '../../../Apis/hooks';
import { PortalAppContext } from '../../../context/PortalAppContext';
import { PortalAuthContext } from '../../../context/PortalAuthContext';
import UsagePlanCardsList from './UsagePlanCardsList';

const UsagePlansTabContent = () => {
  //
  // Redirect if not logged in
  //
  const { isLoggedIn } = useContext(PortalAuthContext);
  const { portalServerType } = useContext(PortalAppContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn || portalServerType !== 'gloo-mesh-gateway') {
      navigate('/gloo-platform-portal');
    }
  }, [isLoggedIn, portalServerType]);

  //
  // Get the APIs
  //
  const { isLoading, data: apisList } = useListApis();
  // Keep the ordering consistent.
  // We can say this is an API[] since we don't render
  // if the portalServerType !== 'gloo-mesh-gateway'.
  const displayedApisList = apisList
    ? (apisList.sort((apiA, apiB) =>
        (apiA.title ?? '')
          .toLocaleLowerCase()
          .localeCompare((apiB.title ?? '').toLocaleLowerCase()),
      ) as API[])
    : [];

  //
  // Render
  //
  if (isLoading || !isLoggedIn || portalServerType !== 'gloo-mesh-gateway') {
    return <>Loading...</>;
  }
  return (
    <InfoCard title="Usage Plans & API Keys" noPadding>
      <Grid item>
        {displayedApisList.length === 0 ? (
          <Card>
            <CardContent>No APIs were found.</CardContent>
          </Card>
        ) : (
          displayedApisList.map(api => (
            <ComponentAccordion
              key={api.apiId}
              title={`${api.title}`}
              Content={() => <UsagePlanCardsList api={api} />}
            />
          ))
        )}
      </Grid>
    </InfoCard>
  );
};

export default UsagePlansTabContent;
