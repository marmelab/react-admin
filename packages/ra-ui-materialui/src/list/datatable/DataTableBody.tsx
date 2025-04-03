import * as React from 'react';
import { type ComponentType } from 'react';
import { RecordContextProvider } from 'ra-core';
import { TableBody, useThemeProps, type TableBodyProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';

import { DataTableClasses } from './DataTableRoot';
import { DataTableRow } from './DataTableRow';
import {
    useDataTableCallbacksContext,
    useDataTableDataContext,
} from './context';

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
            const { rowSx } = useDataTableCallbacksContext();
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
