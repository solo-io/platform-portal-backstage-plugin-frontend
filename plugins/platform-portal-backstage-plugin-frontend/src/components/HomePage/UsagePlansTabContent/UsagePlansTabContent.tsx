import { InfoCard } from '@backstage/core-components';
import { ComponentAccordion } from '@backstage/plugin-home';
import { Card, CardContent, Grid } from '@material-ui/core';
import React from 'react';
import { useListApis } from '../../../Apis/hooks';
import UsagePlanCardsList from './UsagePlanCardsList';

const UsagePlansTabContent = () => {
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
