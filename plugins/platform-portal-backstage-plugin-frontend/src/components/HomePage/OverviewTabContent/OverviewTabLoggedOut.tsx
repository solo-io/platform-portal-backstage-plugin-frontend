import { Box, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useGetAuthEndpoint,
  useGetClientId,
  useGetTokenEndpoint,
} from '../../../configHooks';
import {
  LOCAL_STORAGE_AUTH_STATE,
  LOCAL_STORAGE_AUTH_VERIFIER,
  PortalAuthContext,
} from '../../../context/PortalAuthContext';
import { doAccessTokenRequest } from '../../../utility/accessTokenRequest';

//
// From https://stackoverflow.com/a/63336562
//
// GENERATING CODE VERIFIER
function dec2hex(dec: number) {
  return `0${dec.toString(16)}`.substr(-2);
}

function generateCodeVerifier() {
  const array = new Uint32Array(56 / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join('');
}

function sha256(plain: string) {
  // returns promise ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

function base64urlencode(a: ArrayBuffer) {
  let str = '';
  const bytes = new Uint8Array(a);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return window
    .btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// GENERATING CODE CHALLENGE
async function generateCodeChallengeFromVerifier(v: string) {
  const hashed = await sha256(v);
  const base64encoded = base64urlencode(hashed);
  return base64encoded;
}

const AuthFlowStarter = () => {
  const authEndpoint = useGetAuthEndpoint();
  const clientId = useGetClientId();
  //
  // The page that handles the response from the authorization server
  // will need to read this value and compare it to the original one
  // that was sent with an initial request. The two values must match.
  //
  const stateValue = useMemo(() => {
    const newStateValue = window.crypto.randomUUID();
    localStorage.setItem(LOCAL_STORAGE_AUTH_STATE, newStateValue);
    return newStateValue;
  }, []);

  const verifier = useMemo(() => {
    const newVerifier = generateCodeVerifier();
    localStorage.setItem(LOCAL_STORAGE_AUTH_VERIFIER, newVerifier);
    return newVerifier;
  }, []);
  const [codeChallenge, setCodeChallenge] = useState<string>();
  useEffect(() => {
    (async () => {
      const newCodeChallenge = await generateCodeChallengeFromVerifier(
        verifier,
      );
      setCodeChallenge(newCodeChallenge);
    })();
  }, [setCodeChallenge, verifier]);

  //
  // Navigate when this is opened.
  //
  useEffect(() => {
    if (!stateValue || !codeChallenge) {
      return;
    }

    const url = `${authEndpoint}?client_id=${clientId}&scope=openid&response_type=code&state=${stateValue}&code_challenge=${codeChallenge}&code_challenge_method=S256&redirect_uri=${
      window.location.origin + window.location.pathname
    }`;

    window.location.href = url;
  }, [stateValue, codeChallenge, authEndpoint, clientId]);

  return null;
};

const OverviewTabLoggedOut = () => {
  const { onLogin, isLoggedIn } = useContext(PortalAuthContext);
  const [searchParams] = useSearchParams();
  const tokenEndpoint = useGetTokenEndpoint();
  const clientId = useGetClientId();

  useEffect(() => {
    (async () => {
      if (isLoggedIn) {
        return;
      }
      //
      // Get search params.
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      //
      // Stop here if the code isn't in the URL.
      if (!code) {
        return;
      }
      const previousState = localStorage.getItem(LOCAL_STORAGE_AUTH_STATE);
      if (!!state && state !== previousState) {
        // eslint-disable-next-line no-console
        console.warn(
          "The 'state' returned from the login flow does not match the previously generated 'state' value.",
        );
        return;
      }
      const previousVerifier = localStorage.getItem(
        LOCAL_STORAGE_AUTH_VERIFIER,
      );
      if (!previousVerifier) {
        // eslint-disable-next-line no-console
        console.warn("The previous code 'verifier' was not found.");
        return;
      }
      //
      // Make the request for the codes.
      const res = await doAccessTokenRequest(
        {
          code,
          code_verifier: previousVerifier,
          redirect_uri: window.location.origin + window.location.pathname,
        },
        'authorization_code',
        tokenEndpoint,
        clientId,
      );
      onLogin(res);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showAuthFlowStarter, setShowAuthFlowStarter] = useState(false);

  //
  // Render
  //
  return (
    <>
      <Box sx={{ mt: 2, mb: 4 }}>
        <Alert severity="info" variant="outlined">
          Log in to view APIs and usage plans that require authentication.
        </Alert>
      </Box>
      <Box sx={{ my: 2, mx: 1 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowAuthFlowStarter(true)}
        >
          LOGIN
        </Button>
        {showAuthFlowStarter && <AuthFlowStarter />}
      </Box>
    </>
  );
};

export default OverviewTabLoggedOut;
