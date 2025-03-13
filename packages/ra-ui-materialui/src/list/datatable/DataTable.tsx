import * as React from 'react';
import { useResourceContext } from 'ra-core';

import { Datagrid, type DatagridProps } from '../datagrid/Datagrid';
import { DataTableBody } from './DataTableBody';
import { DataTableHeader } from './DataTableHeader';
import { DataTableColumn } from './DataTableColumn';
import { DataTableStoreContext } from './DataTableStoreContext';
import { ColumnsSelector } from './ColumnsSelector';

export const DataTable = (
    props: DatagridProps & { storeKey?: string; resource?: string }
) => {
    const resource = useResourceContext(props);
    const storeKey = props.storeKey || `${resource}.datagrid`;
    return (
        <DataTableStoreContext.Provider value={storeKey}>
            <Datagrid
                body={DataTableBody}
                header={DataTableHeader}
                {...props}
            />
            <ColumnsSelector>{props.children}</ColumnsSelector>
        </DataTableStoreContext.Provider>
    );
};

DataTable.Col = DataTableColumn;
