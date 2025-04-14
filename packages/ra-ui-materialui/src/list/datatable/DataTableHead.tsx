import * as React from 'react';
import { memo } from 'react';
import { TableCell, TableHead, TableRow } from '@mui/material';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
    type SxProps,
    type Theme,
} from '@mui/material/styles';
import clsx from 'clsx';
import {
    useDataTableConfigContext,
    useDataTableDataContext,
    useDataTableCallbacksContext,
} from 'ra-core';

import ExpandAllButton from '../datagrid/ExpandAllButton';
import { SelectPageCheckbox } from './SelectPageCheckbox';
import { DataTableClasses } from './DataTableRoot';

/**
 * The default DataTable Head component.
 *
 * Renders select all checkbox as well as column head buttons used for sorting.
 */
export const DataTableHead = memo((inProps: DataTableHeadProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
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
    sx?: SxProps<Theme>;
}

DataTableHead.displayName = 'DataTableHead';

const PREFIX = 'RaDataTableHead';

const TableHeadStyled = styled(TableHead, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(() => ({}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaDataTableHead: 'root';
    }

    interface ComponentsPropsList {
        RaDataTableHead: Partial<DataTableHeadProps>;
    }

    interface Components {
        RaDataTableHead?: {
            defaultProps?: ComponentsPropsList['RaDataTableHead'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaDataTableHead'];
        };
    }
}
