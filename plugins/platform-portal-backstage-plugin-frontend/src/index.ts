import { IconComponent } from '@backstage/core-plugin-api';
import GlooIconComponent from './assets/gloo-outline.icon.svg';

export {
  GlooPortalApiDetailsPage,
  GlooPortalHomePage,
  glooPortalPlugin,
} from './plugin';

/** @public */
export const GlooIcon: IconComponent = GlooIconComponent as IconComponent;
