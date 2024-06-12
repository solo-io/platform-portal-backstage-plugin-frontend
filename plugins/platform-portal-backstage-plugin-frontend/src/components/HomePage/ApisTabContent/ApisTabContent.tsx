import React, { useContext } from 'react';
import { useListApis } from '../../../Apis/hooks';
import { PortalAppContext } from '../../../context/PortalAppContext';
import ApisTable from './ApisTable';

const ApisTabContent = () => {
  const { data: apis } = useListApis();
  const { portalServerType } = useContext(PortalAppContext);

  if (apis === undefined || portalServerType === 'unknown')
    return <>Loading...</>;
  return <ApisTable apis={apis} />;
};

export default ApisTabContent;
