import * as React from 'react';
import { type ComponentType } from 'react';
import { RecordContextProvider } from 'ra-core';
import { TableBody, type TableBodyProps } from '@mui/material';
import clsx from 'clsx';

import { DataTableClasses } from './DataTableRoot';
import { DataTableRow } from './DataTableRow';
import { useDataTableContext } from './DataTableContext';

export const DataTableBody = React.forwardRef<
    HTMLTableSectionElement,
    DataTableBodyProps
>((props, ref) => {
    const {
        children,
        row: TableRow = DataTableRow,
        className,
        ...rest
    } = props;
    const { data, rowSx } = useDataTableContext();
    return (
        <TableBody
            ref={ref}
            className={clsx('datagrid-body', className, DataTableClasses.tbody)}
            {...rest}
        >
            {data?.map((record, rowIndex) => (
                <RecordContextProvider
                    value={record}
                    key={record.id ?? `row${rowIndex}`}
                >
                    <TableRow
                        className={clsx(DataTableClasses.row, {
                            [DataTableClasses.rowEven]: rowIndex % 2 === 0,
                            [DataTableClasses.rowOdd]: rowIndex % 2 !== 0,
                        })}
                        id={record.id ?? `row${rowIndex}`}
                        sx={rowSx?.(record, rowIndex)}
                    >
                        {children}
                    </TableRow>
                </RecordContextProvider>
            ))}
        </TableBody>
    );
});

export interface DataTableBodyProps extends TableBodyProps {
    row?: ComponentType;
}

DataTableBody.displayName = 'DataTableBody';
