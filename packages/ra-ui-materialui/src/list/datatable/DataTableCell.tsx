import * as React from 'react';
import { useRecordContext, useStore } from 'ra-core';
import { TableCell, type SxProps } from '@mui/material';
import get from 'lodash/get';
import clsx from 'clsx';

import { TextField } from '../../field/TextField';
import { DataTableColumnProps } from './DataTableColumn';
import { useDataTableStoreContext } from './context';

export const DataTableCell = React.memo(
    React.forwardRef<HTMLTableCellElement, DataTableColumnProps>(
        (props, ref) => {
            const {
                cellSx,
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
                sx,
                ...rest
            } = props;
            const { storeKey, defaultHiddenColumns } =
                useDataTableStoreContext();
            const [hiddenColumns] = useStore<string[]>(
                storeKey,
                defaultHiddenColumns
            );
            const record = useRecordContext();
            const isColumnHidden = hiddenColumns.includes(source!);
            if (isColumnHidden) return null;
            if (!render && !field && !children && !source) {
                throw new Error(
                    'Missing at least one of the following props: render, field, children, or source'
                );
            }
            const sxValue = {
                ...(cellSx && record ? cellSx(record) : {}),
                ...sx,
            } as SxProps;
            return (
                <TableCell
                    ref={ref}
                    className={clsx(
                        className,
                        cellClassName,
                        `column-${source}`
                    )}
                    sx={sxValue}
                    {...rest}
                >
                    {children ??
                        (render
                            ? record && render(record)
                            : field
                              ? React.createElement(field, { source })
                              : get(record, source!))}
                </TableCell>
            );
        }
    )
);

DataTableCell.displayName = 'DataTableCell';
