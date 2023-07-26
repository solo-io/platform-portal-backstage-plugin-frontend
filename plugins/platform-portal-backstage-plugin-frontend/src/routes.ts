import { createRouteRef } from '@backstage/core-plugin-api';

export const homePageRouteRef = createRouteRef({
  id: 'gloo-platform-portal-home-page',
});

export const apiDetailsRouteRef = createRouteRef({
  id: 'gloo-platform-portal-api-details',
  params: ['apiId'],
});
