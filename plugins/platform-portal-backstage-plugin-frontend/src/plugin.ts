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
