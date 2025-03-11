import * as React from 'react';
import { Datagrid, type DatagridProps } from '../datagrid/Datagrid';
import { DataTableBody } from './DataTableBody';
import { DataTableHeader } from './DataTableHeader';
import { DataTableColumn } from './DataTableColumn';

export const DataTable = (props: DatagridProps) => (
    <Datagrid body={DataTableBody} header={DataTableHeader} {...props} />
);

DataTable.Col = DataTableColumn;
