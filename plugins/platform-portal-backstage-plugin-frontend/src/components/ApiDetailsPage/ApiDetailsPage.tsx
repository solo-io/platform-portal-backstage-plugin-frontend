import { Content, Header, Page } from '@backstage/core-components';
import { useRouteRefParams } from '@backstage/core-plugin-api';
import { Box, Button, Card, CardContent, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { PortalAuthContextProvider } from '../../context/PortalAuthContext';
import { apiDetailsRouteRef } from '../../routes';
import '../../styles/main.css';
import { ApiSchemaDisplay } from './ApiSchemaDisplay/ApiSchemaDisplay';

export const ApiDetailsPage = () => {
  const { apiId } = useRouteRefParams(apiDetailsRouteRef);

  const [showingSwaggerView, setShowingSwaggerView] = useState(false);

  return (
    <PortalAuthContextProvider>
      <Page themeId="tool">
        <Header
          title={apiId}
          type="Gloo Platform Portal APIs"
          typeLink="/gloo-platform-portal/apis"
        />

        <Content>
          <Box sx={{ mb: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="body1" paragraph>
                  Browse the OpenAPI schema for: <b>{apiId}</b> using either the
                  Swagger or Redoc schema viewer.
                </Typography>
                {showingSwaggerView ? (
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={() => setShowingSwaggerView(false)}
                  >
                    Redoc View
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={() => setShowingSwaggerView(true)}
                  >
                    Swagger View
                  </Button>
                )}
              </CardContent>
            </Card>
          </Box>

          <ApiSchemaDisplay showSwagger={showingSwaggerView} />
        </Content>
      </Page>
    </PortalAuthContextProvider>
  );
};
