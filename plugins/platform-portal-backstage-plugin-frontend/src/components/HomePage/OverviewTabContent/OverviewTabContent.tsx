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
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@material-ui/core';
import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PortalAuthContext } from '../../../context/PortalAuthContext';
import OverviewTabDoLogout from './OverviewTabDoLogout';
import OverviewTabLoggedIn from './OverviewTabLoggedIn';
import OverviewTabLoggedOut from './OverviewTabLoggedOut';

const OverviewTabContent = () => {
  const { isLoggedIn } = useContext(PortalAuthContext);

  return (
    <Grid container direction="column">
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Welcome to Gloo Platform Portal for Backstage.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Your APIs and usage plans can be viewed here using the tabs above.
          </Typography>
          <Box sx={{ py: 2 }}>
            <Divider />
          </Box>

          {!!isLoggedIn ? <OverviewTabLoggedIn /> : <OverviewTabLoggedOut />}

          <Routes>
            <Route path="/logout" element={<OverviewTabDoLogout />} />
          </Routes>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default OverviewTabContent;
