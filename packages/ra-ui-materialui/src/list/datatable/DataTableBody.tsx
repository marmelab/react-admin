import * as React from 'react';
import DatagridBody, { type DatagridBodyProps } from '../datagrid/DatagridBody';
import DataTableRow from './DataTableRow';

export const DataTableBody = (props: DatagridBodyProps) => (
    <DatagridBody row={<DataTableRow />} {...props} />
);
