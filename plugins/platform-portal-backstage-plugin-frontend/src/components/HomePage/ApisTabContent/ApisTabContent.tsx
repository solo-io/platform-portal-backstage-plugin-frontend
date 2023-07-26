import React from 'react';
import { useListApis } from '../../../Apis/hooks';
import ApisTable from './ApisTable';

const ApisTabContent = () => {
  const { data: apis } = useListApis();

  if (apis === undefined) return <>Loading...</>;
  return <ApisTable apis={apis} />;
};

export default ApisTabContent;
