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
export const doAccessTokenRequest = async (
  formData: Record<string, string>,
  grantType: 'refresh_token' | 'authorization_code',
  tokenEndpoint: string,
  clientId: string,
) => {
  //
  // Build the request payload for a new oauth access token.
  //
  formData.grant_type = grantType;
  formData.client_id = clientId;
  if (grantType === 'refresh_token' && !formData.refresh_token) {
    return undefined;
  }
  //
  // Encode the form request payload.
  //
  const payloadItems: string[] = [];
  for (const property in formData) {
    if (!formData.hasOwnProperty(property)) continue;
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(formData[property]);
    payloadItems.push(`${encodedKey}=${encodedValue}`);
  }
  //
  // Make the request
  //
  const rawRes = await fetch(tokenEndpoint, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    method: 'POST',
    body: payloadItems.join('&'),
  });
  let resJSON: any;
  try {
    resJSON = await rawRes.json();
  } catch {
    throw new Error('Error parsing oauth response.');
  }
  if (!!resJSON.error_description) {
    throw new Error(resJSON.error_description);
  }
  if (!!resJSON.error) {
    throw new Error(resJSON.error);
  }
  //
  // Check for the access token in the response.
  //
  if (!resJSON.access_token) {
    throw new Error(
      "No 'access_token' property was found in the oauth response body.",
    );
  }
  return resJSON;
};
