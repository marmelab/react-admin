import * as React from 'react';
import { useCallback } from 'react';
import { useTranslate } from 'ra-core';
import { Checkbox, TableCell, TableHead, TableRow } from '@mui/material';
import clsx from 'clsx';

import ExpandAllButton from '../datagrid/ExpandAllButton';

import { DataTableClasses } from './DataTableRoot';
import { DataTableHeaderContext } from './DataTableHeaderContext';
import { useDataTableContext } from './DataTableContext';

/**
 * The default DataTable Header component.
 *
 * Renders select all checkbox as well as column header buttons used for sorting.
 */
export const DataTableHeader = (props: DataTableHeaderProps) => {
    const { children, className } = props;
    const {
        expand,
        expandSingle,
        hasBulkActions = false,
        isRowSelectable,
        data,
        onSelect,
        selectedIds,
    } = useDataTableContext();

    const hasExpand = !!expand;

    const translate = useTranslate();

    const handleSelectAll = useCallback(
        event => {
            if (!onSelect || !selectedIds || !data) return;
            onSelect(
                event.target.checked
                    ? selectedIds.concat(
                          data
                              .filter(
                                  record => !selectedIds.includes(record.id)
                              )
                              .filter(record =>
                                  isRowSelectable
                                      ? isRowSelectable(record)
                                      : true
                              )
                              .map(record => record.id)
                      )
                    : []
            );
        },
        [data, onSelect, isRowSelectable, selectedIds]
    );

    const selectableIds = Array.isArray(data)
        ? isRowSelectable
            ? data
                  .filter(record => isRowSelectable(record))
                  .map(record => record.id)
            : data.map(record => record.id)
        : [];

    return (
        <DataTableHeaderContext.Provider value={true}>
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
                    {hasBulkActions && selectedIds && (
                        <TableCell
                            padding="checkbox"
                            className={DataTableClasses.headerCell}
                        >
                            <Checkbox
                                inputProps={{
                                    'aria-label': translate(
                                        'ra.action.select_all',
                                        { _: 'Select all' }
                                    ),
                                }}
                                className="select-all"
                                color="primary"
                                checked={
                                    selectedIds.length > 0 &&
                                    selectableIds.length > 0 &&
                                    selectableIds.every(id =>
                                        selectedIds.includes(id)
                                    )
                                }
                                onChange={handleSelectAll}
                                onClick={e => e.stopPropagation()}
                            />
                        </TableCell>
                    )}
                    {children}
                </TableRow>
            </TableHead>
        </DataTableHeaderContext.Provider>
    );
};

export interface DataTableHeaderProps {
    children?: React.ReactNode;
    className?: string;
    size?: 'medium' | 'small';
}

DataTableHeader.displayName = 'DatagridHeaderModern';
