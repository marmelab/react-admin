import * as React from 'react';
import { Datagrid, type DatagridProps } from './Datagrid';
import { DatagridBodyModern } from './DatagridBodyModern';
import { DatagridHeaderModern } from './DatagridHeaderModern';
import { DatagridColumn } from './DatagridColumn';

export const Datagrid2 = (props: DatagridProps) => (
    <Datagrid
        body={DatagridBodyModern}
        header={DatagridHeaderModern}
        {...props}
    />
);

Datagrid2.Col = DatagridColumn;
