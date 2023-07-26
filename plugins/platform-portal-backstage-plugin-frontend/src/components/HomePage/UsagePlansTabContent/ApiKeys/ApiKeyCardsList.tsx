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
import { Box } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import React, { useState } from 'react';
import { APIKey, UsagePlan } from '../../../../Apis/api-types';
import { useListApiKeys } from '../../../../Apis/hooks';
import { ApiKeyCard } from './ApiKeyCard';
import { DeleteApiKeyModal } from './DeleteApiKeyModal';

export function ApiKeyCardsList({
  usagePlan,
  lastKeyGenerated,
}: {
  usagePlan: UsagePlan;
  lastKeyGenerated: APIKey | undefined;
}) {
  const {
    isLoading,
    data: plansKeysList,
    mutate: refetchPlanKeysList,
  } = useListApiKeys(usagePlan.name);
  const [deletingApiKeyInfo, setDeletingApiKeyInfo] = useState<{
    apiKey: APIKey;
    usagePlanName: string;
  }>();

  if (isLoading) {
    return <>Getting list of api keys...</>;
  }

  // This should only ever be the plan we provided, but this is safer and should
  //   only be doing a find across n=1 || n=0.
  const planKeys = plansKeysList?.find(
    planKey => planKey.usagePlan === usagePlan.name,
  );
  // Next we're keeping the order of the key display consistent.
  const displayedApiKeys = !!planKeys?.apiKeys
    ? planKeys.apiKeys.sort((apiKeyA, apiKeyB) =>
        apiKeyA.id
          .toLocaleLowerCase()
          .localeCompare(apiKeyB.id.toLocaleLowerCase()),
      )
    : [];

  return (
    <Box sx={{ mt: 1 }}>
      {!!displayedApiKeys.length ? (
        displayedApiKeys.map(apiKey => (
          <Box key={apiKey.id} sx={{ borderTop: '1px solid grey' }}>
            <ApiKeyCard
              apiKey={apiKey}
              usagePlanName={usagePlan.name}
              forceListRefetch={refetchPlanKeysList}
              wasRecentlyGenerated={apiKey.id === lastKeyGenerated?.id}
              onDeleteModalOpen={() =>
                setDeletingApiKeyInfo({
                  apiKey: apiKey,
                  usagePlanName: usagePlan.name,
                })
              }
              // const closeDeleteModal = () => {
              //   setDeleteModalOpen(false);
              //   forceListRefetch();
              // };
            />
          </Box>
        ))
      ) : (
        <Box sx={{ mb: 2 }}>
          <Alert severity="info" variant="outlined">
            <AlertTitle>No API keys found</AlertTitle>
            Add a new key to access this API Product using this usage plan.
          </Alert>
        </Box>
      )}
      {!!deletingApiKeyInfo && (
        <DeleteApiKeyModal
          apiKeyName={deletingApiKeyInfo.apiKey.name}
          apiKeyId={deletingApiKeyInfo.apiKey.id}
          usagePlanName={deletingApiKeyInfo.usagePlanName}
          onClose={() => setDeletingApiKeyInfo(undefined)}
        />
      )}
    </Box>
  );
}
