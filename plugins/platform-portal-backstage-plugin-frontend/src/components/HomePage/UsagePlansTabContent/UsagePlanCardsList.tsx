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
import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { API, UsagePlan } from '../../../Apis/api-types';
import { useListUsagePlans } from '../../../Apis/hooks';
import UsagePlanCard from './UsagePlanCard';

const UsagePlanCardsList = ({ api }: { api: API }) => {
  const { isLoading, data: usagePlans } = useListUsagePlans();

  // When we have the plans, let's pull the ones we need and sort for consistency.
  const relevantUsagePlans = !!usagePlans
    ? (
        api.usagePlans
          .map(apiPlanName =>
            usagePlans.find(usagePlan => usagePlan.name === apiPlanName),
          )
          .filter(plan => plan !== undefined) as UsagePlan[]
      ).sort((planA, planB) =>
        planA.name
          .toLocaleLowerCase()
          .localeCompare(planB.name.toLocaleLowerCase()),
      )
    : [];

  return (
    <div>
      <Box sx={{ mt: -1, pb: 1 }}>
        <Typography variant="h6" gutterBottom>
          Description
        </Typography>
        <Typography variant="body2">{api.description}</Typography>
      </Box>

      <Typography variant="h6">Usage Plans</Typography>
      <div>
        {isLoading ? (
          <>Getting information on usage plans for ${api.title}...</>
        ) : (
          relevantUsagePlans.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gridGap: '1em',
              }}
            >
              {relevantUsagePlans.map(plan => (
                <UsagePlanCard
                  key={`${api.apiId}:${plan.name}`}
                  usagePlan={plan}
                />
              ))}
            </Box>
          )
        )}
      </div>
    </div>
  );
};

export default UsagePlanCardsList;
