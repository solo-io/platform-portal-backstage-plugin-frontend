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
import { Box, Button, Grid, Tooltip } from '@material-ui/core';
import DeleteOutlined from '@material-ui/icons/DeleteOutlined';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react';
import { APIKey } from '../../../../Apis/api-types';
import { ApiKeyDetailsModal } from './ApiKeyDetailsModal';

export function ApiKeyCard({
  apiKey,
  usagePlanName,
  wasRecentlyGenerated,
  onDeleteModalOpen,
}: {
  apiKey: APIKey;
  usagePlanName: string;
  forceListRefetch: () => unknown | Promise<unknown>;
  wasRecentlyGenerated: boolean;
  onDeleteModalOpen: () => void;
}) {
  const [seeDetailsModalOpen, setSeeDetailsModalOpen] = useState(false);

  return (
    <Box sx={{ py: 1 }}>
      <Grid
        container
        justifyContent="space-between"
        className={`apiKeyCard ${
          wasRecentlyGenerated ? 'recentlyGenerated' : ''
        }`}
      >
        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
          {apiKey.name ?? (apiKey.metadata as any).name ?? ''}
        </Grid>
        <Grid item style={{ display: 'flex', gap: '10px' }}>
          <Tooltip placement="left" title="View API key details.">
            <Button
              style={{ minWidth: '40px' }}
              size="small"
              variant="text"
              color="default"
              onClick={() => setSeeDetailsModalOpen(true)}
              aria-label="See partial key details"
            >
              <InfoOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="Delete this API key.">
            <Button
              style={{ minWidth: '40px' }}
              size="small"
              variant="text"
              color="secondary"
              onClick={onDeleteModalOpen}
              aria-label="Delete key"
            >
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </Grid>
        {seeDetailsModalOpen && (
          <ApiKeyDetailsModal
            apiKey={apiKey}
            onClose={() => setSeeDetailsModalOpen(false)}
            usagePlanName={usagePlanName}
          />
        )}
      </Grid>
      {wasRecentlyGenerated && (
        <Box sx={{ mt: 1 }}>
          <Alert
            variant="standard"
            severity="success"
            style={{ padding: '.1em 1em' }}
          >
            Key Generated Successfully
          </Alert>
        </Box>
      )}
    </Box>
  );
}
