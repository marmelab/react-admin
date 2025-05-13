import * as React from 'react';
import { type ComponentType } from 'react';
import { RecordContextProvider, useDataTableDataContext } from 'ra-core';
import { TableBody, useThemeProps, type TableBodyProps } from '@mui/material';
import { type ComponentsOverrides, styled } from '@mui/material/styles';
import clsx from 'clsx';

import { DataTableClasses } from './DataTableRoot';
import { DataTableRow } from './DataTableRow';
import { useDataTableRowSxContext } from './DataTableRowSxContext';

const PREFIX = 'RaDataTableBody';

export const DataTableBody = React.memo(
    React.forwardRef<HTMLTableSectionElement, DataTableBodyProps>(
        (inProps, ref) => {
            const props = useThemeProps({
                props: inProps,
                name: PREFIX,
            });
            const {
                children,
                row: TableRow = DataTableRow,
                className,
                ...rest
            } = props;
            const data = useDataTableDataContext();
            const rowSx = useDataTableRowSxContext();
            return (
                <TableBodyStyled
                    ref={ref}
                    className={clsx(
                        'datatable-body',
                        className,
                        DataTableClasses.tbody
                    )}
                    {...rest}
                >
                    {data?.map((record, rowIndex) => (
                        <RecordContextProvider
                            value={record}
                            key={record.id ?? `row${rowIndex}`}
                        >
                            <TableRow
                                className={clsx(DataTableClasses.row, {
                                    [DataTableClasses.rowEven]:
                                        rowIndex % 2 === 0,
                                    [DataTableClasses.rowOdd]:
                                        rowIndex % 2 !== 0,
                                })}
                                sx={rowSx?.(record, rowIndex)}
                            >
                                {children}
                            </TableRow>
                        </RecordContextProvider>
                    ))}
                </TableBodyStyled>
            );
        }
    )
);

export interface DataTableBodyProps extends TableBodyProps {
    row?: ComponentType;
}

DataTableBody.displayName = 'DataTableBody';

const TableBodyStyled = styled(TableBody, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(() => ({}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        DataTableBody: 'root';
    }

    interface ComponentsPropsList {
        DataTableBody: Partial<DataTableBodyProps>;
    }

    interface Components {
        DataTableBody?: {
            defaultProps?: ComponentsPropsList['DataTableBody'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['DataTableBody'];
        };
    }
}
