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
