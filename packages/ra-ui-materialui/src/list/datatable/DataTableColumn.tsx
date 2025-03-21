import * as React from 'react';
import { type SortPayload } from 'ra-core';
import { type TableCellProps } from '@mui/material';

import { useDataTableRenderContext } from './context/DataTableRenderContext';
import { DataTableCell } from './DataTableCell';
import { DataTableHeaderCell } from './DataTableHeaderCell';
import { ColumnsSelectorItem } from './ColumnsSelectorItem';
import { NumberField } from '../../field/NumberField';

export interface DataTableColumnProps
    extends Omit<TableCellProps, 'component'> {
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
            }
        }
    )
);

DataTableColumn.displayName = 'DataTableColumn';

export const DataTableNumberColumn = React.memo(
    React.forwardRef<HTMLTableCellElement, DataTableColumnProps>(
        (props, ref) => (
            <DataTableColumn
                {...props}
                align="right"
                field={NumberField}
                ref={ref}
            />
        )
    )
);

DataTableNumberColumn.displayName = 'DataTableNumberColumn';
