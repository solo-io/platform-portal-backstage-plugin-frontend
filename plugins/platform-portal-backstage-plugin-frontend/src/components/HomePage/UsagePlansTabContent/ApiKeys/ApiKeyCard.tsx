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
