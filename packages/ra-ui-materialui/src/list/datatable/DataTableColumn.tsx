import * as React from 'react';
import { type SortPayload } from 'ra-core';
import { type SxProps, type TableCellProps } from '@mui/material';

import { useDataTableRenderContext } from './context/DataTableRenderContext';
import { DataTableCell } from './DataTableCell';
import { DataTableHeaderCell } from './DataTableHeaderCell';
import { ColumnsSelectorItem } from './ColumnsSelectorItem';

export interface DataTableColumnProps
    extends Omit<TableCellProps, 'component'> {
    cellSx?: (record: any) => SxProps;
    cellClassName?: string;
    headerClassName?: string;
    render?: (record: any) => React.ReactNode;
    field?: React.ElementType;
    source?: string;
    label?: React.ReactNode;
    sortable?: boolean;
    sortByOrder?: SortPayload['order'];
}

export const DataTableColumn = React.memo(
    React.forwardRef<HTMLTableCellElement, DataTableColumnProps>(
        (props, ref) => {
            const renderContext = useDataTableRenderContext();
            switch (renderContext) {
                case 'columnsSelector':
                    return <ColumnsSelectorItem {...props} />;
                case 'header':
                    return <DataTableHeaderCell {...props} ref={ref} />;
                case 'data':
                    return <DataTableCell {...props} ref={ref} />;
                case 'footer':
                    return <DataTableCell {...props} ref={ref} />;
            }
        }
    )
);

DataTableColumn.displayName = 'DataTableColumn';
