import * as React from 'react';
import { memo } from 'react';
import { TableCell, TableHead, TableRow } from '@mui/material';
import { styled, type SxProps } from '@mui/material/styles';
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
 * The default DataTable Head component.
 *
 * Renders select all checkbox as well as column head buttons used for sorting.
 */
export const DataTableHead = memo((props: DataTableHeadProps) => {
    const { children, className, sx } = props;
    const {
        expand,
        expandSingle,
        hasBulkActions = false,
    } = useDataTableConfigContext();
    const data = useDataTableDataContext();
    const { handleToggleItem } = useDataTableCallbacksContext();

    const hasExpand = !!expand;

    return (
        <TableHeadStyled
            className={clsx(className, DataTableClasses.thead)}
            sx={sx}
        >
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
        </TableHeadStyled>
    );
});

export interface DataTableHeadProps {
    children?: React.ReactNode;
    className?: string;
    size?: 'medium' | 'small';
    sx?: SxProps;
}

DataTableHead.displayName = 'DataTableHead';

const PREFIX = 'RaDataTableHead';

const TableHeadStyled = styled(TableHead, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(() => ({}));
