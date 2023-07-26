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
import { Link, Table, TableColumn } from '@backstage/core-components';
import Chip from '@material-ui/core/Chip';
import React, { useMemo } from 'react';
import { API } from '../../../Apis/api-types';

interface TableFields {
  apiId: string;
  apiProductDisplayName: string;
  apiVersion: string;
  title: string;
  contact: string;
  customMetadata: Record<string, string> | undefined;
}

const metadataCustomFilterAndSearch: TableColumn<TableFields>['customFilterAndSearch'] =
  (filter, row) => {
    if (typeof filter !== 'string' || !row.customMetadata) return false;
    const processedFilter = filter
      .toLocaleLowerCase('en-US')
      .replaceAll(/\s*:\s*/g, ':');
    return Object.entries(row.customMetadata).some(([pairKey, pairValue]) => {
      const pairString = `${pairKey}:${pairValue}`.toLocaleLowerCase('en-US');
      return pairString.includes(processedFilter);
    });
  };

const renderApiTitleLink = (row: TableFields) => (
  <Link to={`/gloo-platform-portal/apis/${row.apiId}`}>{row.title}</Link>
);

const renderApiMetadata = (row: TableFields) => {
  const data = row.customMetadata;
  if (!data) return null;
  return (
    <>
      {Object.entries(data).map(([pairKey, pairValue]) => (
        <Chip
          key={`${pairKey}:${pairValue}`}
          variant="outlined"
          color="default"
          size="small"
          label={`${pairKey}: ${pairValue}`}
        />
      ))}
    </>
  );
};

const columns: TableColumn<TableFields>[] = [
  {
    title: 'Title',
    field: 'title',
    highlight: true,
    render: renderApiTitleLink,
  },
  { title: 'API Product', field: 'apiProductDisplayName' },
  { title: 'API Version', field: 'apiVersion' },
  { title: 'Contact', field: 'contact' },
  {
    title: 'Meta Data',
    field: 'customMetadata',
    customFilterAndSearch: metadataCustomFilterAndSearch,
    render: renderApiMetadata,
  },
];

const ApisTable = ({ apis }: { apis: API[] }) => {
  const tableData = useMemo(
    () =>
      apis.map(
        a =>
          ({
            id: a.apiId,
            apiId: a.apiId,
            apiProductDisplayName: a.apiProductDisplayName ?? '',
            apiVersion: a.apiVersion ?? '',
            title: a.title,
            contact: a.contact,
            customMetadata: a.customMetadata,
          } as TableFields),
      ),
    [apis],
  );

  return (
    <Table
      title="APIs"
      options={{ paging: false }}
      data={tableData}
      columns={columns}
    />
  );
};

export default ApisTable;
