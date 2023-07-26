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
