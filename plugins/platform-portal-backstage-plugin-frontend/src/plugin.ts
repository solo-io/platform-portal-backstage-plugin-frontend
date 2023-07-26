import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { apiDetailsRouteRef, homePageRouteRef } from './routes';

export const glooPortalPlugin = createPlugin({
  id: 'gloo-platform-portal',
  routes: {
    root: homePageRouteRef,
  },
});

//
// The plugin home page
//
export const GlooPortalHomePage = glooPortalPlugin.provide(
  createRoutableExtension({
    name: 'GlooPortalHomePage',
    component: () => import('./components/HomePage').then(m => m.HomePage),
    mountPoint: homePageRouteRef,
  }),
);

//
// The api details page
//
export const GlooPortalApiDetailsPage = glooPortalPlugin.provide(
  createRoutableExtension({
    name: 'GlooPortalApiDetailsPage',
    component: () =>
      import('./components/ApiDetailsPage').then(m => m.ApiDetailsPage),
    mountPoint: apiDetailsRouteRef,
  }),
);
