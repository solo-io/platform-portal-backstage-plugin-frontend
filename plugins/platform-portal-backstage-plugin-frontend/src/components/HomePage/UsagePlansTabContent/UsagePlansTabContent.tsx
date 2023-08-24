import { InfoCard } from '@backstage/core-components';
import { ComponentAccordion } from '@backstage/plugin-home';
import { Card, CardContent, Grid } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useListApis } from '../../../Apis/hooks';
import { PortalAuthContext } from '../../../context/PortalAuthContext';
import UsagePlanCardsList from './UsagePlanCardsList';

const UsagePlansTabContent = () => {
  //
  // Redirect if not logged in
  //
  const { isLoggedIn } = useContext(PortalAuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/gloo-platform-portal');
    }
  }, [isLoggedIn]);

  //
  // Get the APIs
  //
  const { isLoading, data: apisList } = useListApis();
  // Keep the ordering consistent.
  const displayedApisList = apisList
    ? apisList.sort((apiA, apiB) =>
        apiA.title
          .toLocaleLowerCase()
          .localeCompare(apiB.title.toLocaleLowerCase()),
      )
    : [];

  //
  // Render
  //
  if (isLoading) {
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
