import * as React from 'react';
import { useDataTableStoreContext, useRecordContext, useStore } from 'ra-core';
import { TableCell, useThemeProps, type SxProps } from '@mui/material';
import { type ComponentsOverrides, styled } from '@mui/material/styles';
import get from 'lodash/get';
import clsx from 'clsx';

import { DataTableColumnProps } from './DataTableColumn';

const PREFIX = 'RaDataTableCell';

export const DataTableCell = React.memo(
    React.forwardRef<HTMLTableCellElement, DataTableColumnProps>(
        (inProps, ref) => {
            const props = useThemeProps({
                props: inProps,
                name: PREFIX,
            });
            const {
                cellSx,
                cellClassName,
                headerClassName,
                children,
                className,
                disableSort,
                render,
                field,
                source,
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
                <TableCellStyled
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
                </TableCellStyled>
            );
        }
    )
);

DataTableCell.displayName = 'DataTableCell';

const TableCellStyled = styled(TableCell, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(() => ({}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaDataTableCell: 'root';
    }

    interface ComponentsPropsList {
        RaDataTableCell: Partial<DataTableColumnProps>;
    }

    interface Components {
        RaDataTableCell?: {
            defaultProps?: ComponentsPropsList['RaDataTableCell'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaDataTableCell'];
        };
    }
}
