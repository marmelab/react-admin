import * as React from 'react';
import DatagridBody, {
    PureDatagridBody,
    type DatagridBodyProps,
} from '../datagrid/DatagridBody';
import DataTableRow from './DataTableRow';

export const DataTableBody = (props: DatagridBodyProps) => (
    <DatagridBody row={<DataTableRow />} {...props} />
);

export const PureDataTableBody = (props: DatagridBodyProps) => (
    <PureDatagridBody row={<DataTableRow />} {...props} />
);
