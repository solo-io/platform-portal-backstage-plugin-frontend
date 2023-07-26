import { Box, Chip, Modal, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { APIKey } from '../../../../Apis/api-types';
import { modalStyle } from '../../../../styles/styleObjects';

export function ApiKeyDetailsModal({
  apiKey,
  usagePlanName,
  onClose,
}: {
  apiKey: APIKey;
  usagePlanName: string;
  onClose: () => any;
}) {
  return (
    <Modal
      open
      className="keyDetailsModalRoot"
      onClose={onClose}
      title="Key Details"
    >
      <Box sx={modalStyle}>
        <Typography variant="h5">{apiKey.name}</Typography>

        <Box sx={{ mt: 2 }}>
          <Alert severity="info" variant="outlined">
            This API key is for the <b>{usagePlanName}</b> usage plan.
          </Alert>
        </Box>
        {!!apiKey.metadata && Object.keys(apiKey.metadata).length > 0 && (
          <Box sx={{ mt: 3 }}>
            <b>Meta Data</b>
            <Box sx={{ mt: 2 }}>
              {Object.entries(apiKey.metadata).map(([pairKey, pairValue]) => (
                <Chip
                  key={`${pairKey}: ${pairValue}`}
                  label={`${pairKey}: ${pairValue}`}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
}
