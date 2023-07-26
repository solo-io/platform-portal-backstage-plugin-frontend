import { createDevApp } from '@backstage/dev-utils';
import React from 'react';
import { GlooPortalHomePage, glooPortalPlugin } from '../src/plugin';

createDevApp()
  .registerPlugin(glooPortalPlugin)
  .addPage({
    element: <GlooPortalHomePage />,
    title: 'Root Page',
    path: '/gloo-platform-portal',
  })
  .render();
