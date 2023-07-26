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
