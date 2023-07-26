import { Box, Button, Grid, Input, Modal, Typography } from '@material-ui/core';
import CheckCircleOutlineOutlined from '@material-ui/icons/CheckCircleOutlineOutlined';
import FileCopyOutlined from '@material-ui/icons/FileCopyOutlined';
import { Alert } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { APIKey } from '../../../../Apis/api-types';
import { useCreateKeyMutation } from '../../../../Apis/hooks';
import { modalStyle } from '../../../../styles/styleObjects';
import { copyToClipboard } from '../../../../utility/utility';

function CreateKeyActions({
  apiKeyName,
  usagePlanName,
  // customMetadata,
  // onClose,
  onSuccess,
  hasCopiedKey,
  onCopiedKey,
}: {
  apiKeyName: string;
  usagePlanName: string;
  // customMetadata: KeyValuePair[];
  onSuccess: (apiKey: APIKey | undefined) => void;
  onClose: () => any;
  hasCopiedKey: boolean;
  onCopiedKey: () => void;
}) {
  const [attemptingCreate, setAttemptingCreate] = useState(false);
  const [keyValue, setKeyValue] = useState<string | undefined>();
  const { trigger: createKey, isMutating } = useCreateKeyMutation();

  const attemptToCreate = async () => {
    if (!apiKeyName || !!attemptingCreate) return;
    setAttemptingCreate(true);
    const response = await toast.promise(
      createKey({ usagePlanName, apiKeyName }),
      {
        loading: 'Creating the API key...',
        success: 'API key created!',
        error: 'There was an error creating the API key.',
      },
    );
    setKeyValue(response?.apiKey);
    onSuccess(response);
  };

  // Set attempting to create = false when finished creating the key.
  useEffect(() => {
    if (!attemptingCreate || !!isMutating) return;
    setAttemptingCreate(false);
  }, [attemptingCreate, isMutating]);

  return (
    <div>
      {!!keyValue ? (
        <>
          <Alert
            severity="warning"
            variant="outlined"
            // title="Warning!"
            // color="orange"
          >
            This key value will not be available later. Please copy and secure
            this value now.
          </Alert>
          <Box sx={{ mt: 3 }}>
            <Button
              style={{ width: '100%', textAlign: 'center' }}
              variant="outlined"
              aria-label="Copy this API key"
              onClick={() => {
                copyToClipboard(keyValue)
                  .then(() => toast.success('Copied API key to clipboard'))
                  .finally(onCopiedKey);
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '.5em',
                }}
              >
                {keyValue}
                {hasCopiedKey ? (
                  <CheckCircleOutlineOutlined />
                ) : (
                  <FileCopyOutlined />
                )}
              </div>
            </Button>
          </Box>
        </>
      ) : (
        <Grid container justifyContent="flex-end">
          <Button
            color="primary"
            variant="contained"
            onClick={attemptToCreate}
            disabled={!apiKeyName || attemptingCreate}
            title={!apiKeyName ? 'An API Key Name must be provided' : ''}
          >
            GENERATE KEY
          </Button>
        </Grid>
      )}
    </div>
  );
}

export function GenerateApiKeyModal({
  usagePlanName,
  onClose,
  onKeyGenerated,
}: {
  usagePlanName: string;
  onClose: () => any;
  onKeyGenerated: (apiKey: APIKey | undefined) => void;
}) {
  const [apiKeyName, setApiKeyName] = useState('');
  const [generated, setGenerated] = useState(false);

  const [hasCopiedKey, setHasCopiedKey] = useState(false);

  return (
    <Modal
      open
      onClose={() => {
        // If we have generated and not copied the API key,
        // prevent the user from closing the modal.
        if (generated && !hasCopiedKey) {
          toast('Click the API key to copy it before closing the modal.');
          return;
        }
        onClose();
      }}
      title={generated ? 'Key Generated Successfully!' : 'Generate a New Key'}
    >
      <Box sx={modalStyle}>
        <Box sx={{ pb: 3 }}>
          <Typography variant="h5">
            {generated ? 'Key Generated Successfully!' : 'Generate a New Key'}
          </Typography>
        </Box>
        {!generated && (
          <Box sx={{ mb: 3 }}>
            <Input
              fullWidth
              placeholder="API Key Name"
              onChange={e => setApiKeyName(e.target.value)}
              value={apiKeyName}
              disabled={generated}
            />

            <Box sx={{ mt: 2 }}>
              <Alert severity="info" variant="outlined">
                This API key will be for the <b>{usagePlanName}</b> usage plan.
              </Alert>
            </Box>
          </Box>
        )}

        <CreateKeyActions
          usagePlanName={usagePlanName}
          apiKeyName={apiKeyName}
          // customMetadata={metadataPairs}
          onSuccess={key => {
            setGenerated(true);
            onKeyGenerated(key);
          }}
          hasCopiedKey={hasCopiedKey}
          onCopiedKey={() => setHasCopiedKey(true)}
          onClose={onClose}
        />
      </Box>
    </Modal>
  );
}
