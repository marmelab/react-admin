import * as React from 'react';
import { type SortPayload } from 'ra-core';
import { type TableCellProps } from '@mui/material';

import { DataTableHeaderContext } from './DataTableHeaderContext';
import { DataTableColumnSelectorContext } from './DataTableColumnSelectorContext';
import { DataTableCell } from './DataTableCell';
import { DataTableHeaderCell } from './DataTableHeaderCell';
import { ColumnsSelectorMenuItem } from './ColumnsSelectorMenuItem';

export interface DataTableColumnProps
    extends Omit<TableCellProps, 'component'> {
    cellClassName?: string;
    headerClassName?: string;
    render?: (record: any) => React.ReactNode;
    component?: React.ElementType;
    source?: string;
    label?: string;
    sortable?: boolean;
    sortByOrder?: SortPayload['order'];
}

export const DataTableColumn = React.memo(
    React.forwardRef<HTMLTableCellElement, DataTableColumnProps>(
        (props, ref) => {
            // determine the render context: header, column selector, or data cell
            const headerContext = React.useContext(DataTableHeaderContext);
            const tableSelectorContext = React.useContext(
                DataTableColumnSelectorContext
            );
            if (tableSelectorContext) {
                return <ColumnsSelectorMenuItem {...props} />;
            } else if (headerContext) {
                return <DataTableHeaderCell {...props} ref={ref} />;
            } else {
                return <DataTableCell {...props} ref={ref} />;
            }
        }
    )
);

DataTableColumn.displayName = 'DataTableColumn';
