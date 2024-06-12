import React, { useContext } from 'react';
import { PortalAppContext } from '../../../context/PortalAppContext';
import { GG_ApiSchemaDisplay } from './GG_ApiSchemaDisplay';
import { GMG_ApiSchemaDisplay } from './GMG_ApiSchemaDisplay';

const ApiSchemaDisplay = ({ showSwagger }: { showSwagger: boolean }) => {
  const { portalServerType } = useContext(PortalAppContext);

  //
  // Render correct ApiSchemaDisplay (GG or GMG)
  //
  if (portalServerType === 'gloo-gateway') {
    return <GG_ApiSchemaDisplay showSwagger={showSwagger} />;
  }
  if (portalServerType === 'gloo-mesh-gateway') {
    return <GMG_ApiSchemaDisplay showSwagger={showSwagger} />;
  }
  // if (portalServerType==='unknown') we are loading.
  return null;
};

export default ApiSchemaDisplay;
