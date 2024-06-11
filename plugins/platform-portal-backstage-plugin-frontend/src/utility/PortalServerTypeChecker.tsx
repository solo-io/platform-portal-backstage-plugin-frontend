import { useContext, useEffect } from 'react';
import { useListApis } from '../Apis/hooks';
import { PortalAppContext } from '../context/PortalAppContext';

const PortalServerTypeChecker = () => {
  const { data: apis } = useListApis();
  const { updatePortalServerType } = useContext(PortalAppContext);

  // Check which return type this is.
  useEffect(() => {
    if (apis?.length === 0) {
      updatePortalServerType('unknown');
    } else if ('apiProductDisplayName' in apis[0]) {
      updatePortalServerType('gloo-mesh-gateway');
    } else if ('id' in apis[0]) {
      updatePortalServerType('gloo-gateway');
    } else {
      updatePortalServerType('unknown');
    }
  }, [apis]);

  return null;
};

export default PortalServerTypeChecker;
