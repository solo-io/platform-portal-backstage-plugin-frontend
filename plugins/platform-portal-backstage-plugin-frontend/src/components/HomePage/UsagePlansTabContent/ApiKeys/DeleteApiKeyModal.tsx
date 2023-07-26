import { Box, Button, Grid, Modal, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDeleteKeyMutation } from '../../../../Apis/hooks';
import { modalStyle } from '../../../../styles/styleObjects';

function DeleteKeyActions({
  apiKeyId,
  usagePlanName,
  onSuccess,
  onClose,
}: {
  apiKeyId: string;
  usagePlanName: string;
  onSuccess: () => void;
  onClose: () => any;
}) {
  const [attemptingDelete, setAttemptingDelete] = useState(false);
  const { trigger: deleteKey, isMutating } = useDeleteKeyMutation();

  const attemptToDelete = async () => {
    if (!apiKeyId || !!attemptingDelete) return;
    setAttemptingDelete(true);
    await toast.promise(deleteKey({ apiKeyId, usagePlanName }), {
      loading: 'Deleting the API key...',
      success: 'API key deleted!',
      error: 'There was an error deleting the API key.',
    });
    onSuccess();
  };

  // Set attempting to delete = false when finished creating the key.
  useEffect(() => {
    if (!attemptingDelete || !!isMutating) return;
    setAttemptingDelete(false);
  }, [attemptingDelete, isMutating]);

  return (
    <>
      <Grid item>
        <Button
          color="default"
          variant="outlined"
          disabled={attemptingDelete}
          onClick={onClose}
          title="Back out of this window without deleting"
        >
          CANCEL
        </Button>
      </Grid>
      <Grid item>
        <Button
          color="secondary"
          variant="contained"
          disabled={attemptingDelete}
          onClick={attemptToDelete}
          title="Confirm deleting this key"
        >
          DELETE
        </Button>
      </Grid>
    </>
  );
}

export function DeleteApiKeyModal({
  apiKeyName,
  apiKeyId,
  usagePlanName,
  onClose,
}: {
  apiKeyName: string;
  apiKeyId: string;
  usagePlanName: string;
  onClose: () => any;
}) {
  const [deleted, setDeleted] = useState(false);

  return (
    <Modal
      open
      onClose={onClose}
      // title={
      //   // <>{deleted ? <Icon.SuccessCheckmark /> : <Icon.WarningExclamation />}</>
      //   deleted ? 'success-icon' : 'warning-icon'
      // }
    >
      <Box sx={modalStyle}>
        <Box sx={{ pb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Delete API Key
          </Typography>
        </Box>

        {!deleted && (
          <Box sx={{ pt: 1, pb: 3 }}>
            <Typography variant="body1">
              API Key: <b>{apiKeyName}</b>
            </Typography>
          </Box>
        )}

        {deleted ? (
          <Alert severity="success" variant="filled">
            Key Deleted Successfully!
          </Alert>
        ) : (
          <Alert severity="warning" color="error">
            Are you sure you want to delete this API Key?
          </Alert>
        )}

        <Box sx={{ mt: 3 }}>
          <Grid
            container
            direction="row"
            style={{ gap: '5px' }}
            justifyContent="flex-end"
          >
            {!deleted ? (
              <DeleteKeyActions
                apiKeyId={apiKeyId}
                usagePlanName={usagePlanName}
                onSuccess={() => setDeleted(true)}
                onClose={onClose}
              />
            ) : (
              <Button
                color="default"
                variant="outlined"
                onClick={onClose}
                title="Close this modal"
              >
                CLOSE
              </Button>
            )}
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
}
