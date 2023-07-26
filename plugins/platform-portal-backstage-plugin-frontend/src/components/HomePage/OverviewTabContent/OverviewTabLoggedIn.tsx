import { Button, Grid, Typography } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetCurrentUser } from '../../../Apis/hooks';
import { useGetLogoutEndpoint } from '../../../configHooks';
import { PortalAuthContext } from '../../../context/PortalAuthContext';

const OverviewTabLoggedIn = () => {
  const logoutEndpoint = useGetLogoutEndpoint();
  const { idToken } = useContext(PortalAuthContext);
  const { data: userInfo } = useGetCurrentUser();

  // Clean up the URL after we have used the returned
  // urlSearchParams to log in.
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('state');
    newSearchParams.delete('session_state');
    newSearchParams.delete('code');
    setSearchParams(newSearchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSearchParams]);

  const fullLogoutUrl = `${logoutEndpoint}?id_token_hint=${idToken}&post_logout_redirect_uri=${window.location.origin}/gloo-platform-portal/logout`;
  return (
    <Grid container direction="row" alignItems="center">
      <Grid item>
        <Typography variant="body1">
          Logged in{' '}
          {!!userInfo && (
            <>
              as:{' '}
              <b>{userInfo?.username ?? userInfo?.email ?? userInfo?.name}</b>
            </>
          )}
        </Typography>
      </Grid>

      <Grid item>
        <a href={fullLogoutUrl}>
          <Button tabIndex={-1} color="primary" variant="outlined" size="small">
            LOGOUT
          </Button>
        </a>
      </Grid>
    </Grid>
  );
};

export default OverviewTabLoggedIn;
