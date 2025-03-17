import * as React from 'react';
import { useRecordContext, useStore } from 'ra-core';
import { TableCell } from '@mui/material';
import clsx from 'clsx';

import { useDataTableContext } from './DataTableContext';
import { TextField } from '../../field/TextField';
import { DataTableColumnProps } from './DataTableColumn';

export const DataTableCell = React.forwardRef<
    HTMLTableCellElement,
    DataTableColumnProps
>((props, ref) => {
    const {
        cellClassName,
        headerClassName,
        children,
        className,
        render,
        component,
        source,
        sortable,
        sortByOrder,
        label,
        ...rest
    } = props;
    const { storeKey } = useDataTableContext();
    const [hiddenColumns] = useStore<string[]>(storeKey, []);
    const record = useRecordContext();
    const isColumnHidden = hiddenColumns.includes(source!);
    if (isColumnHidden) return null;
    if (!render && !component && !children && !source) {
        throw new Error(
            'Missing at least one of the following props: render, component, children, or source'
        );
    }
    return (
        <TableCell
            ref={ref}
            className={clsx(className, cellClassName, `column-${source}`)}
            {...rest}
        >
            {children ??
                (render ? (
                    record && render(record)
                ) : component ? (
                    React.createElement(component, { source })
                ) : (
                    <TextField source={source!} />
                ))}
        </TableCell>
    );
});

DataTableCell.displayName = 'DataTableCell';
