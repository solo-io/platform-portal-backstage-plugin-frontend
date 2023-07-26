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
import { Box, Card, CardContent, Grid, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import React, { useState } from 'react';
import { APIKey, UsagePlan } from '../../../Apis/api-types';
import { ApiKeyCardsList } from './ApiKeys/ApiKeyCardsList';
import { GenerateApiKeyModal } from './ApiKeys/GenerateApiKeyModal';

const UsagePlanCard = ({ usagePlan }: { usagePlan: UsagePlan }) => {
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);

  const openCreateKeyModal = () => {
    setCreateModalIsOpen(true);
  };
  const closeCreateKeyModal = () => {
    setCreateModalIsOpen(false);
  };

  const [lastKeyGenerated, setLastKeyGenerated] = useState<APIKey>();

  return (
    <Card variant="outlined" style={{ marginTop: '.5em' }}>
      <CardContent
        style={{ padding: '.75em 1.5em 0 1.5em', backgroundColor: '#4e4e4e' }}
      >
        <Box sx={{ mt: 2, mb: 1.5, ml: 1 }}>
          <Grid container direction="column" style={{ width: 'auto' }}>
            <Typography variant="body1">
              <b>{usagePlan.name}</b>
            </Typography>
            <Typography variant="caption">
              ( {usagePlan.rateLimitPolicy.requestsPerUnit} Request
              {(usagePlan.rateLimitPolicy.requestsPerUnit as number) > 1
                ? 's'
                : ''}{' '}
              per {usagePlan.rateLimitPolicy.unit.toLocaleLowerCase('en-US')})
            </Typography>
          </Grid>
        </Box>

        <Box sx={{ mb: 2, ml: 1 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Typography variant="h6">API Keys</Typography>
            <Grid item>
              <Button
                color="primary"
                onClick={openCreateKeyModal}
                variant="contained"
                size="small"
              >
                <Box
                  sx={{ display: 'flex', gridGap: '5px', alignItems: 'center' }}
                >
                  <Add />
                  <>ADD KEY</>
                </Box>
              </Button>
            </Grid>
          </Grid>
        </Box>

        <ApiKeyCardsList
          usagePlan={usagePlan}
          lastKeyGenerated={lastKeyGenerated}
        />

        {createModalIsOpen && (
          <GenerateApiKeyModal
            usagePlanName={usagePlan.name}
            onClose={closeCreateKeyModal}
            onKeyGenerated={setLastKeyGenerated}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default UsagePlanCard;
