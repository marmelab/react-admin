import * as React from 'react';
import { useRecordContext, useStore } from 'ra-core';
import { TableCell } from '@mui/material';
import clsx from 'clsx';

import { TextField } from '../../field/TextField';
import { DataTableColumnProps } from './DataTableColumn';
import { useDataTableStoreContext } from './context';

export const DataTableCell = React.memo(
    React.forwardRef<HTMLTableCellElement, DataTableColumnProps>(
        (props, ref) => {
            const {
                cellClassName,
                headerClassName,
                children,
                className,
                render,
                field,
                source,
                sortable,
                sortByOrder,
                label,
                ...rest
            } = props;
            const storeKey = useDataTableStoreContext();
            const [hiddenColumns] = useStore<string[]>(storeKey, []);
            const record = useRecordContext();
            const isColumnHidden = hiddenColumns.includes(source!);
            if (isColumnHidden) return null;
            if (!render && !field && !children && !source) {
                throw new Error(
                    'Missing at least one of the following props: render, field, children, or source'
                );
            }
            return (
                <TableCell
                    ref={ref}
                    className={clsx(
                        className,
                        cellClassName,
                        `column-${source}`
                    )}
                    {...rest}
                >
                    {children ??
                        (render ? (
                            record && render(record)
                        ) : field ? (
                            React.createElement(field, { source })
                        ) : (
                            <TextField source={source!} />
                        ))}
                </TableCell>
            );
        }
    )
);

DataTableCell.displayName = 'DataTableCell';
