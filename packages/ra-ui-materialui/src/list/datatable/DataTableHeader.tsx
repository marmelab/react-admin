import * as React from 'react';
import { memo } from 'react';
import { TableCell, TableHead, TableRow } from '@mui/material';
import clsx from 'clsx';

import ExpandAllButton from '../datagrid/ExpandAllButton';
import { SelectPageCheckbox } from './SelectPageCheckbox';

import { DataTableClasses } from './DataTableRoot';
import { useDataTableConfigContext } from './context/DataTableConfigContext';
import {
    useDataTableDataContext,
    useDataTableCallbacksContext,
} from './context';

/**
 * The default DataTable Header component.
 *
 * Renders select all checkbox as well as column header buttons used for sorting.
 */
export const DataTableHeader = memo((props: DataTableHeaderProps) => {
    const { children, className } = props;
    const {
        expand,
        expandSingle,
        hasBulkActions = false,
    } = useDataTableConfigContext();
    const data = useDataTableDataContext();
    const { handleToggleItem } = useDataTableCallbacksContext();

    const hasExpand = !!expand;

    return (
        <TableHead className={clsx(className, DataTableClasses.thead)}>
            <TableRow
                className={clsx(
                    DataTableClasses.row,
                    DataTableClasses.headerRow
                )}
            >
                {hasExpand && (
                    <TableCell
                        padding="none"
                        variant="head"
                        className={clsx(
                            DataTableClasses.headerCell,
                            DataTableClasses.expandHeader
                        )}
                    >
                        {!expandSingle && data ? (
                            <ExpandAllButton
                                classes={DataTableClasses}
                                ids={data.map(record => record.id)}
                            />
                        ) : null}
                    </TableCell>
                )}
                {hasBulkActions && handleToggleItem && (
                    <TableCell
                        padding="checkbox"
                        variant="head"
                        className={DataTableClasses.headerCell}
                    >
                        <SelectPageCheckbox />
                    </TableCell>
                )}
                {children}
            </TableRow>
        </TableHead>
    );
});

export interface DataTableHeaderProps {
    children?: React.ReactNode;
    className?: string;
    size?: 'medium' | 'small';
}

DataTableHeader.displayName = 'DataTableHeader';
